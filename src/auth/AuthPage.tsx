import { useState, type FormEvent } from "react";
import { ArrowLeft, Lock } from "lucide-react";
import { Logo } from "../components/ui";
import { confirmResetPassword, resetPassword, signIn, signUp } from "./session";
import { updateProfile, type Experience, type LearnGoal, type CoachStyle, type RiskProfile } from "../profile/profileStore";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INPUT =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-ink outline-none transition duration-200 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100";

type Mode = "register" | "login" | "reset";

export default function AuthPage({ reason }: { reason?: string }) {
  const [mode, setMode] = useState<Mode>("register");
  const [step, setStep] = useState<"account" | "onboarding">("account");
  const [busy, setBusy] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [resetStage, setResetStage] = useState<"email" | "code">("email");
  const [resetCode, setResetCode] = useState("");
  const [resetPass, setResetPass] = useState("");
  const [resetDone, setResetDone] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "", agree: false });

  const switchMode = (m: Mode) => {
    setMode(m);
    setErrors({});
    setServerError(null);
    setResetStage("email");
    setResetDone(false);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setServerError(null);
    const next: Record<string, string> = {};
    if (mode === "register" && form.name.trim().length < 2) next.name = "Укажите имя или никнейм (минимум 2 символа)";
    if (!EMAIL_RE.test(form.email.trim())) next.email = "Введите корректный email";
    if (mode === "reset" && resetStage === "code") {
      if (!/^\d{6,8}$/.test(resetCode.trim())) next.code = "Введите код из письма";
      if (resetPass.length < 8) next.resetPass = "Новый пароль — минимум 8 символов";
    }
    if (mode !== "reset" && form.password.length < 8) next.password = "Пароль — минимум 8 символов";
    if (mode === "register" && form.confirm !== form.password) next.confirm = "Пароли не совпадают";
    if (mode === "register" && !form.agree) next.agree = "Нужно согласиться с условиями и политикой";
    setErrors(next);
    if (Object.keys(next).length) return;

    setBusy(true);
    try {
      if (mode === "reset" && resetStage === "email") {
        await resetPassword(form.email.trim());
        setResetStage("code");
      } else if (mode === "reset") {
        await confirmResetPassword({ email: form.email.trim(), code: resetCode.trim(), password: resetPass });
        setResetDone(true);
      } else if (mode === "register") {
        await signUp({ name: form.name.trim(), email: form.email.trim(), password: form.password });
        await updateProfile({ name: form.name.trim(), email: form.email.trim() }).catch(() => undefined);
        setStep("onboarding");
      } else {
        await signIn({ email: form.email.trim(), password: form.password });
        window.location.hash = "#/profile";
      }
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Не удалось выполнить действие. Попробуйте ещё раз.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen pb-16">
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
        <div className="absolute -left-40 top-0 h-[460px] w-[460px] rounded-full bg-indigo-300/30 blur-[120px]" />
        <div className="absolute right-[-120px] top-40 h-[420px] w-[420px] rounded-full bg-emerald-200/50 blur-[120px]" />
      </div>

      <header className="relative z-10 px-3 pt-3 sm:px-6">
        <div className="glass mx-auto flex max-w-5xl items-center justify-between gap-3 rounded-2xl px-3 py-2.5 sm:px-4">
          <a href="#/" className="flex h-10 items-center gap-1.5 rounded-xl border border-slate-200 bg-white/80 px-3 text-sm font-bold transition hover:-translate-y-0.5">
            <ArrowLeft className="h-4 w-4" /> <span className="hidden sm:inline">На главную</span>
          </a>
          <Logo />
          <span className="w-10 sm:w-auto" aria-hidden />
        </div>
      </header>

      <main className="mx-auto mt-8 max-w-md px-4 sm:px-6">
        {step === "account" ? (
          <section className="glass rounded-[28px] p-6 sm:p-8">
            {reason && (
              <p className="mb-5 flex items-start gap-2 rounded-2xl border border-indigo-100 bg-indigo-50/80 p-3.5 text-sm font-semibold text-indigo-800">
                <Lock className="mt-0.5 h-4 w-4 shrink-0" /> {reason}
              </p>
            )}
            {mode !== "reset" && (
              <div role="tablist" aria-label="Вход или регистрация" className="grid grid-cols-2 gap-1.5 rounded-2xl bg-slate-200/60 p-1.5">
                {(["register", "login"] as Mode[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    role="tab"
                    aria-selected={mode === m}
                    onClick={() => switchMode(m)}
                    className={`rounded-xl px-4 py-2.5 text-sm font-extrabold transition ${
                      mode === m ? "bg-indigo-600 text-white shadow-[0_10px_24px_-10px_rgba(79,70,229,.9)]" : "text-slate-600"
                    }`}
                  >
                    {m === "register" ? "Регистрация" : "Вход"}
                  </button>
                ))}
              </div>
            )}

            {mode === "reset" && (
              <div className="mb-1">
                <h2 className="text-xl font-extrabold tracking-tight">Восстановление пароля</h2>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  {resetStage === "email" ? "Укажите email аккаунта — пришлём код на эту почту." : `Код отправлен на ${form.email.trim()}. Введите его и новый пароль.`}
                </p>
              </div>
            )}

            {mode === "reset" && resetDone ? (
              <div className="mt-6 flex flex-col gap-4">
                <p role="status" className="rounded-2xl bg-emerald-50 p-3.5 text-sm font-bold text-emerald-700">
                  Пароль обновлён. Теперь можно войти с новым паролем.
                </p>
                <button type="button" onClick={() => switchMode("login")} className="btn-primary w-full">
                  Перейти ко входу
                </button>
              </div>
            ) : (
            <form onSubmit={submit} noValidate className="mt-6 flex flex-col gap-4">
              {mode === "register" && (
                <Field label="Имя или никнейм" id="a-name" error={errors.name}>
                  <input id="a-name" className={INPUT} value={form.name} maxLength={40} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="nickname" />
                </Field>
              )}
              <Field label="Email" id="a-email" error={errors.email}>
                <input id="a-email" type="email" className={INPUT} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" />
              </Field>
              {mode === "reset" && resetStage === "code" && (
                <>
                  <Field label="Код из письма" id="a-code" error={errors.code}>
                    <input id="a-code" inputMode="numeric" autoComplete="one-time-code" className={INPUT} value={resetCode} onChange={(e) => setResetCode(e.target.value)} />
                  </Field>
                  <Field label="Новый пароль" id="a-newpass" error={errors.resetPass} hint="Минимум 8 символов">
                    <input id="a-newpass" type="password" className={INPUT} value={resetPass} onChange={(e) => setResetPass(e.target.value)} autoComplete="new-password" />
                  </Field>
                </>
              )}
              {mode !== "reset" && (
                <Field label="Пароль" id="a-pass" error={errors.password} hint="Минимум 8 символов">
                  <input id="a-pass" type="password" className={INPUT} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} autoComplete={mode === "register" ? "new-password" : "current-password"} />
                  {mode === "login" && (
                    <button type="button" onClick={() => switchMode("reset")} className="mt-2 text-xs font-extrabold text-indigo-600 transition hover:text-indigo-800">
                      Забыл пароль?
                    </button>
                  )}
                </Field>
              )}
              {mode === "register" && (
                <Field label="Повторите пароль" id="a-confirm" error={errors.confirm}>
                  <input
                    id="a-confirm"
                    type="password"
                    className={INPUT}
                    value={form.confirm}
                    onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                    autoComplete="new-password"
                  />
                </Field>
              )}
              {mode === "register" && (
                <div>
                  <label className="flex items-start gap-3 text-sm font-semibold text-slate-600">
                    <input type="checkbox" className="mt-0.5 h-4 w-4 accent-indigo-600" checked={form.agree} onChange={(e) => setForm({ ...form, agree: e.target.checked })} />
                    <span>Я согласен с условиями использования и политикой конфиденциальности. Платформа учебная, реальные деньги не используются.</span>
                  </label>
                  {errors.agree && <p className="mt-1.5 text-xs font-bold text-rose-500">{errors.agree}</p>}
                </div>
              )}

              {serverError && <p role="alert" className="rounded-2xl bg-rose-50 p-3 text-sm font-bold text-rose-600">{serverError}</p>}

              <button type="submit" disabled={busy} className="btn-primary mt-2 w-full disabled:opacity-60">
                {busy
                  ? "Подождите…"
                  : mode === "register"
                    ? "Создать профиль"
                    : mode === "reset"
                      ? resetStage === "email"
                        ? "Отправить код"
                        : "Сохранить новый пароль"
                      : "Войти"}
              </button>
              {mode === "reset" && resetStage === "code" && (
                <button type="button" onClick={() => setResetStage("email")} className="text-center text-xs font-extrabold text-indigo-600 transition hover:text-indigo-800">
                  Отправить код на другой email
                </button>
              )}
              {mode === "reset" && (
                <button type="button" onClick={() => switchMode("login")} className="text-center text-xs font-extrabold text-indigo-600 transition hover:text-indigo-800">
                  Назад ко входу
                </button>
              )}
            </form>
            )}
            <p className="mt-5 text-center text-xs font-semibold text-slate-500">
              Прототип: учебный аккаунт. Полноценная защита данных не заявлена.
            </p>
          </section>
        ) : (
          <Onboarding onDone={() => (window.location.hash = "#/profile")} />
        )}
      </main>
    </div>
  );
}

function Field({ label, id, error, hint, children }: { label: string; id: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-extrabold uppercase tracking-wider text-slate-500">
        {label}
      </label>
      {children}
      {error ? <p className="mt-1.5 text-xs font-bold text-rose-500">{error}</p> : hint ? <p className="mt-1.5 text-xs font-semibold text-slate-400">{hint}</p> : null}
    </div>
  );
}

const EXPERIENCE: { key: Experience; label: string }[] = [
  { key: "none", label: "Не торговал" },
  { key: "under_1y", label: "Меньше года" },
  { key: "1_3y", label: "1–3 года" },
  { key: "3y_plus", label: "Больше 3 лет" },
];
const GOALS: { key: LearnGoal; label: string }[] = [
  { key: "safe_start", label: "Начать без страха" },
  { key: "skills", label: "Прокачать навыки" },
  { key: "passive_income", label: "Пассивный доход" },
  { key: "trading", label: "Торговля на бирже" },
];
const RISK: { key: RiskProfile; label: string }[] = [
  { key: "conservative", label: "Осторожный" },
  { key: "balanced", label: "Умеренный" },
  { key: "aggressive", label: "Смелый" },
];
const COACH: { key: CoachStyle; label: string }[] = [
  { key: "strict", label: "Строгий ментор" },
  { key: "analyst", label: "Аналитик" },
  { key: "friend", label: "Дружеский коуч" },
];

function Chips<T extends string>({ value, options, onChange, label }: { value: T | null; options: { key: T; label: string }[]; onChange: (v: T) => void; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.key}
          type="button"
          role="radio"
          aria-checked={value === o.key}
          onClick={() => onChange(o.key)}
          className={`rounded-xl border px-3 py-2 text-xs font-extrabold transition active:scale-95 ${
            value === o.key ? "border-indigo-500 bg-indigo-600 text-white" : "border-slate-200 bg-white/80 text-slate-700 hover:border-indigo-300"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function MultiChips<T extends string>({ value, options, onToggle, label }: { value: T[]; options: { key: T; label: string }[]; onToggle: (v: T) => void; label: string }) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = value.includes(o.key);
        return (
          <button
            key={o.key}
            type="button"
            role="checkbox"
            aria-checked={active}
            onClick={() => onToggle(o.key)}
            className={`rounded-xl border px-3 py-2 text-xs font-extrabold transition active:scale-95 ${
              active ? "border-indigo-500 bg-indigo-600 text-white" : "border-slate-200 bg-white/80 text-slate-700 hover:border-indigo-300"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function Onboarding({ onDone }: { onDone: () => void }) {
  const [experience, setExperience] = useState<Experience | null>(null);
  const [goal, setGoal] = useState<LearnGoal[]>([]);
  const [risk, setRisk] = useState<RiskProfile>("balanced");
  const [coach, setCoach] = useState<CoachStyle[]>(["analyst"]);
  const [error, setError] = useState<string | null>(null);

  const toggle = <T extends string>(list: T[], key: T, min: number): T[] => {
    if (list.includes(key)) return list.length > min ? list.filter((k) => k !== key) : list;
    return [...list, key];
  };

  const save = async () => {
    try {
      await updateProfile({ experience, goal, riskProfile: risk, coachStyle: coach, onboarded: true });
      onDone();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось сохранить профиль");
    }
  };

  return (
    <section className="glass rounded-[28px] p-6 sm:p-8">
      <p className="eyebrow">Аккаунт создан</p>
      <h1 className="mt-2 text-2xl font-extrabold tracking-tight">Заполните профиль</h1>
      <p className="mt-1 text-sm font-semibold text-slate-500">Это поможет ИИ-наставнику подстроиться под вас. Можно изменить позже.</p>

      <div className="mt-6 space-y-6">
        <div>
          <p className="mb-2 text-xs font-extrabold uppercase tracking-wider text-slate-500">Опыт инвестирования</p>
          <Chips value={experience} options={EXPERIENCE} onChange={setExperience} label="Опыт" />
        </div>
        <div>
          <p className="mb-2 text-xs font-extrabold uppercase tracking-wider text-slate-500">Цель обучения · можно несколько</p>
          <MultiChips value={goal} options={GOALS} onToggle={(k) => setGoal(toggle(goal, k, 0))} label="Цель" />
        </div>
        <div>
          <p className="mb-2 text-xs font-extrabold uppercase tracking-wider text-slate-500">Отношение к риску</p>
          <Chips value={risk} options={RISK} onChange={setRisk} label="Риск" />
        </div>
        <div>
          <p className="mb-2 text-xs font-extrabold uppercase tracking-wider text-slate-500">Стиль ИИ-наставника · можно несколько</p>
          <MultiChips value={coach} options={COACH} onToggle={(k) => setCoach(toggle(coach, k, 1))} label="Стиль" />
        </div>
      </div>

      {error && <p role="alert" className="mt-4 rounded-2xl bg-rose-50 p-3 text-sm font-bold text-rose-600">{error}</p>}
      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={save} className="btn-primary flex-1">
          Сохранить и открыть профиль
        </button>
        <button type="button" onClick={onDone} className="btn-ghost flex-1 justify-center">
          Пропустить
        </button>
      </div>
    </section>
  );
}
