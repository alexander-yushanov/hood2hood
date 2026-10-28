import { useSyncExternalStore } from "react";
import type { User } from "@supabase/supabase-js";
import { isViblyConfigured, requireVibly, vibly } from "../lib/vibly";

// Состояние входа. Гость (user = null) ничего не сохраняет: ни в облако, ни в localStorage.
type AuthState = { ready: boolean; user: User | null };

let state: AuthState = { ready: !isViblyConfigured, user: null };
const listeners = new Set<() => void>();

function setState(patch: Partial<AuthState>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getAuth(): AuthState {
  return state;
}

export function useAuth(): AuthState {
  return useSyncExternalStore(subscribe, getAuth, getAuth);
}

export function currentUserId(): string | null {
  return state.user?.id ?? null;
}

let started = false;
export function initAuth() {
  if (started) return;
  started = true;
  if (!isViblyConfigured) return;
  vibly.auth.onAuthStateChange((_event, session) => setState({ ready: true, user: session?.user ?? null }));
  vibly.auth.getSession().then(({ data }) => setState({ ready: true, user: data.session?.user ?? null }));
}

// Подписка на смену пользователя: вызывается при входе, выходе и первом определении сессии.
export function onUserChange(cb: (user: User | null) => void) {
  let last: string | null | undefined;
  return subscribe(() => {
    if (!state.ready) return;
    const uid = state.user?.id ?? null;
    if (uid === last) return;
    last = uid;
    cb(state.user);
  });
}

function ruError(message: string): string {
  if (/invalid login/i.test(message)) return "Неверный email или пароль.";
  if (/already (registered|exists)/i.test(message)) return "Этот email уже зарегистрирован. Войдите в аккаунт.";
  if (/email not confirmed/i.test(message)) return "Email ещё не подтверждён. Проверьте почту.";
  if (/failed to fetch|networkerror|load failed/i.test(message)) return "Нет связи с сервером. Проверьте интернет и попробуйте ещё раз.";
  return message;
}

export async function signUp(input: { name: string; email: string; password: string }): Promise<void> {
  const c = requireVibly();
  const { data, error } = await c.auth.signUp({
    email: input.email,
    password: input.password,
    options: { data: { display_name: input.name } },
  });
  if (error) throw new Error(ruError(error.message));
  if (!data.session) {
    const r = await c.auth.signInWithPassword({ email: input.email, password: input.password });
    if (r.error) throw new Error("Аккаунт создан, но вход не выполнен. Подтвердите email и войдите.");
  }
  const user = (await c.auth.getUser()).data.user;
  if (!user) throw new Error("Не удалось получить аккаунт. Попробуйте войти.");
  const { error: pErr } = await c.from("profiles").insert({ user_id: user.id, display_name: input.name, email: input.email });
  if (pErr) throw new Error(pErr.message);
}

export async function signIn(input: { email: string; password: string }): Promise<void> {
  const { error } = await requireVibly().auth.signInWithPassword(input);
  if (error) throw new Error(ruError(error.message));
}

// Шаг 1: отправка кода на email, который ввёл пользователь.
export async function resetPassword(email: string): Promise<void> {
  const { error } = await requireVibly().auth.resetPasswordForEmail(email);
  if (error) {
    if (/cannot post|not found|404/i.test(error.message)) {
      throw new Error("Отправка писем для восстановления пока не подключена. Попробуйте позже или напишите нам в ВК.");
    }
    throw new Error(ruError(error.message));
  }
}

// Шаг 2: проверка 6-значного кода из письма и установка нового пароля.
export async function confirmResetPassword(input: { email: string; code: string; password: string }): Promise<void> {
  const c = requireVibly();
  const { error: vErr } = await c.auth.verifyOtp({ email: input.email, token: input.code, type: "recovery" });
  if (vErr) throw new Error(/expired|invalid/i.test(vErr.message) ? "Код неверный или истёк. Запросите новый." : ruError(vErr.message));
  const { error: uErr } = await c.auth.updateUser({ password: input.password });
  if (uErr) throw new Error(ruError(uErr.message));
}

// Смена пароля в профиле: сначала проверяем текущий пароль, затем сохраняем новый.
export async function changePassword(input: { email: string; current: string; next: string }): Promise<void> {
  const c = requireVibly();
  const { error: checkErr } = await c.auth.signInWithPassword({ email: input.email, password: input.current });
  if (checkErr) throw new Error(/invalid login/i.test(checkErr.message) ? "Текущий пароль указан неверно." : ruError(checkErr.message));
  const { error } = await c.auth.updateUser({ password: input.next });
  if (error) throw new Error(/same|different/i.test(error.message) ? "Новый пароль должен отличаться от текущего." : ruError(error.message));
}

export async function signOut(): Promise<void> {
  if (!isViblyConfigured) return;
  await vibly.auth.signOut();
}

export type TrainingResult = {
  id: string;
  game_id: string;
  result_rub: number;
  details: Record<string, unknown> | null;
  created_at: string;
};

// Гостевой результат не сохраняется вообще.
export async function saveTrainingResult(row: { game_id: string; result_rub: number; details: Record<string, unknown> }) {
  const uid = currentUserId();
  if (!uid || !isViblyConfigured) return;
  const { error } = await vibly.from("training_results").insert({ user_id: uid, ...row });
  if (error) console.warn("training result not saved:", error.message);
}

export async function loadTrainingResults(): Promise<TrainingResult[]> {
  const uid = currentUserId();
  if (!uid) return [];
  const { data, error } = await vibly
    .from("training_results")
    .select("id,game_id,result_rub,details,created_at")
    .eq("user_id", uid)
    .order("created_at", { ascending: false })
    .limit(30);
  if (error) throw new Error(error.message);
  return (data ?? []) as TrainingResult[];
}
