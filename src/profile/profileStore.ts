import { useSyncExternalStore } from "react";
import { currentUserId } from "../auth/session";
import { isViblyConfigured, vibly } from "../lib/vibly";

export type CoachStyle = "strict" | "analyst" | "friend";
export type RiskProfile = "conservative" | "balanced" | "aggressive";
export type Experience = "none" | "under_1y" | "1_3y" | "3y_plus";
export type LearnGoal = "safe_start" | "skills" | "passive_income" | "trading";

export interface ProfileData {
  name: string;
  email: string;
  startCapital: number;
  avatarUrl: string | null;
  coachStyle: CoachStyle[];
  hintFrequency: number;
  riskProfile: RiskProfile;
  crashAlerts: boolean;
  dailyReport: boolean;
  experience: Experience | null;
  goal: LearnGoal[];
  onboarded: boolean;
  /** Одноразовый пробный доступ к PRO: включается кнопкой «Попробовать» в окне оплаты. */
  proTrial: boolean;
  simBalance: SavedBalance | null;
  learnBalance: { day: string; balance: number } | null;
  loaded: boolean;
}

export type SavedBalance = { cash: number; lots: number; avg: number; brokeDay: string | null; freeLeft?: number; freeDay?: string | null };

export const CAPITAL_OPTIONS = [100000, 250000, 500000, 1000000];

const EMPTY_PROFILE: ProfileData = {
  name: "",
  email: "",
  startCapital: 100000,
  avatarUrl: null,
  coachStyle: ["analyst"],
  hintFrequency: 5,
  riskProfile: "balanced",
  crashAlerts: true,
  dailyReport: false,
  experience: null,
  goal: [],
  onboarded: false,
  proTrial: false,
  simBalance: null,
  learnBalance: null,
  loaded: false,
};

// Профиль живёт только в памяти текущей сессии и в аккаунте (таблица profiles).
// localStorage не используется: данные не должны переходить между аккаунтами и гостевым режимом.
let state: ProfileData = EMPTY_PROFILE;
// Аккаунт, чей профиль сейчас загружен в state. Запись разрешена только для него.
let owner: string | null = null;
const listeners = new Set<() => void>();

export function getProfile(): ProfileData {
  return state;
}

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useProfile(): ProfileData {
  return useSyncExternalStore(subscribe, getProfile, getProfile);
}

/** Загружает профиль текущего аккаунта из облака. Для гостя сбрасывает к пустому. */
export async function loadProfileFromCloud(seed?: { name?: string; email?: string }): Promise<void> {
  // Сразу сбрасываем данные предыдущего аккаунта: до ответа облака они не должны быть видны или записаны.
  state = { ...EMPTY_PROFILE, loaded: false };
  owner = null;
  emit();
  const uid = currentUserId();
  if (!uid || !isViblyConfigured) {
    state = { ...EMPTY_PROFILE, loaded: true };
    emit();
    return;
  }
  const { data, error } = await vibly.from("profiles").select("display_name,email,profile").eq("user_id", uid).maybeSingle();
  // Ответ пришёл после смены аккаунта — его нельзя показывать и принимать за данные текущего пользователя.
  if (currentUserId() !== uid) return;
  if (error) {
    // Ошибка загрузки: не помечаем профиль загруженным, иначе следующая запись перезапишет облачные данные пустыми.
    state = { ...EMPTY_PROFILE, loaded: false };
    emit();
    throw new Error(error.message);
  }
  owner = uid;
  const saved = (data?.profile ?? {}) as Partial<ProfileData>;
  state = {
    ...EMPTY_PROFILE,
    ...saved,
    coachStyle: normalizeList(saved.coachStyle, ["analyst"]),
    goal: normalizeList(saved.goal, []),
    name: data?.display_name || seed?.name || saved.name || "",
    email: data?.email || seed?.email || "",
    loaded: true,
  };
  emit();
}

export async function updateProfile(patch: Partial<ProfileData>): Promise<void> {
  const uid = currentUserId();
  if (!uid || !isViblyConfigured) {
    state = { ...state, ...patch };
    emit();
    return;
  }
  // Пишем только когда профиль именно этого аккаунта загружен: иначе пустые данные перезапишут облако.
  if (owner !== uid || !state.loaded) throw new Error("Профиль ещё загружается. Повторите через секунду.");
  state = { ...state, ...patch };
  emit();
  const { name, email, loaded: _loaded, ...rest } = state;
  const { error } = await vibly
    .from("profiles")
    .update({ display_name: name, email, profile: rest })
    .eq("user_id", uid);
  if (error) throw new Error(error.message);
}

/** Старые аккаунты хранили одно значение строкой — приводим к массиву. */
function normalizeList<T extends string>(value: unknown, fallback: T[]): T[] {
  if (Array.isArray(value)) return value.filter((v): v is T => typeof v === "string") as T[];
  if (typeof value === "string" && value) return [value as T];
  return fallback;
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "??";
  return parts
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");
}
