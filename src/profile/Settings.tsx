import { useEffect, useRef, useState, type ReactNode } from "react";
import { Bell, BrainCircuit, Camera, Check, Pencil, ShieldAlert, Sun, UserRound, X } from "lucide-react";
import ChangePassword from "./ChangePassword";
import {
  CAPITAL_OPTIONS,
  initials,
  updateProfile,
  useProfile,
  type CoachStyle,
  type ProfileData,
  type RiskProfile,
} from "./profileStore";

const rub = (n: number) => `${n.toLocaleString("ru-RU")} ₽`;

// Уменьшаем фото до 256px и кодируем в data-URL: так оно переживёт перезагрузку и влезет в localStorage.
function readAvatar(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const side = 256;
      const scale = side / Math.min(img.width, img.height);
      const canvas = document.createElement("canvas");
      canvas.width = side;
      canvas.height = side;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error("no canvas"));
        return;
      }
      const w = img.width * scale;
      const h = img.height * scale;
      ctx.drawImage(img, (side - w) / 2, (side - h) / 2, w, h);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("bad image"));
    };
    img.src = url;
  });
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const COACHES: { key: CoachStyle; title: string; text: string; emoji: string; ring: string; dot: string }[] = [
  {
    key: "strict",
    title: "Строгий ментор",
    text: "Ругает за панику и не даёт сливать позицию на эмоциях",
    emoji: "🟢",
    ring: "border-emerald-500 shadow-[0_14px_30px_-14px_rgba(16,185,129,.8)]",
    dot: "bg-emerald-500",
  },
  {
    key: "analyst",
    title: "Аналитик-прагматик",
    text: "Говорит на языке цифр: вероятности, просадки, риск",
    emoji: "🔵",
    ring: "border-blue-500 shadow-[0_14px_30px_-14px_rgba(59,130,246,.8)]",
    dot: "bg-blue-500",
  },
  {
    key: "friend",
    title: "Дружеский коуч",
    text: "Поддерживает, хвалит за прогресс и помогает не сдаться",
    emoji: "🟣",
    ring: "border-violet-500 shadow-[0_14px_30px_-14px_rgba(139,92,246,.8)]",
    dot: "bg-violet-500",
  },
];

const RISKS: { key: RiskProfile; label: string; hint: string }[] = [
  { key: "conservative", label: "Консервативный", hint: "Облигации и голубые фишки, минимум просадок" },
  { key: "balanced", label: "Сбалансированный", hint: "Баланс роста и защиты капитала" },
  { key: "aggressive", label: "Агрессивный", hint: "Высокая волатильность ради быстрого роста" },
];

function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  description: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-white/70 p-4">
      <div className="min-w-0">
        <p className="text-sm font-extrabold">{label}</p>
        <p className="mt-0.5 text-xs font-semibold text-slate-500">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200 ${
          checked ? "bg-emerald-500" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform duration-300 ease-[cubic-bezier(.2,.8,.2,1)] ${
            checked ? "translate-x-[22px]" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

function Field({
  label,
  id,
  editing,
  children,
  value,
  error,
}: {
  label: string;
  id: string;
  editing: boolean;
  children?: ReactNode;
  value: string;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-extrabold uppercase tracking-wider text-slate-500">
        {label}
      </label>
      {editing ? (
        children
      ) : (
        <p id={id} className="rounded-2xl bg-white/60 px-4 py-3 text-sm font-bold text-ink">
          {value}
        </p>
      )}
      {error && <p className="mt-1.5 text-xs font-bold text-rose-500">{error}</p>}
    </div>
  );
}

const INPUT =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-ink outline-none transition duration-200 placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100";

export default function Settings() {
  const saved = useProfile();

  // Блок профиля: черновик редактируется только в режиме редактирования.
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ name: saved.name, email: saved.email, startCapital: saved.startCapital });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const fileRef = useRef<HTMLInputElement>(null);

  // Настройки ИИ и уведомлений: черновик, фиксируется кнопкой внизу.
  const [settings, setSettings] = useState({
    coachStyle: saved.coachStyle,
    hintFrequency: saved.hintFrequency,
    riskProfile: saved.riskProfile,
    crashAlerts: saved.crashAlerts,
    dailyReport: saved.dailyReport,
  });

  const [toast, setToast] = useState<{ id: number; text: string } | null>(null);
  const [pulse, setPulse] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (!pulse) return;
    const t = window.setTimeout(() => setPulse(null), 500);
    return () => window.clearTimeout(t);
  }, [pulse]);

  const toggleCoach = (key: CoachStyle) => {
    setSettings((s) => {
      const has = s.coachStyle.includes(key);
      // Хотя бы один стиль должен оставаться выбранным.
      if (has && s.coachStyle.length === 1) return s;
      return { ...s, coachStyle: has ? s.coachStyle.filter((k) => k !== key) : [...s.coachStyle, key] };
    });
  };

  const showToast = (text: string) => setToast({ id: Date.now(), text });

  const startEditing = () => {
    setDraft({ name: saved.name, email: saved.email, startCapital: saved.startCapital });
    setAvatarPreview(null);
    setErrors({});
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
    setAvatarPreview(null);
    setErrors({});
  };

  const handleAvatar = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("⚠️ Выберите файл изображения");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast("⚠️ Фото должно быть меньше 5 МБ");
      return;
    }
    if (!editing) startEditing();
    readAvatar(file)
      .then((dataUrl) => setAvatarPreview(dataUrl))
      .catch(() => showToast("⚠️ Не удалось загрузить фото"));
  };

  const saveProfile = () => {
    const name = draft.name.trim();
    const email = draft.email.trim();
    const next: { name?: string; email?: string } = {};
    if (name.length < 2) next.name = "Имя должно содержать минимум 2 символа";
    if (!EMAIL_RE.test(email)) next.email = "Введите корректный email";
    setErrors(next);
    if (next.name || next.email) return;

    const patch: Partial<ProfileData> = {
      name,
      email,
      startCapital: draft.startCapital,
    };
    if (avatarPreview) patch.avatarUrl = avatarPreview;
    updateProfile(patch).catch(() => showToast("⚠️ Не удалось сохранить в облаке. Проверьте соединение"));
    setEditing(false);
    setAvatarPreview(null);
    setPulse("profile");
    showToast("✅ Настройки успешно обновлены!");
  };

  const saveSettings = () => {
    updateProfile(settings).catch(() => showToast("⚠️ Не удалось сохранить в облаке. Проверьте соединение"));
    setPulse("settings");
    showToast("✅ Настройки успешно обновлены!");
  };

  const shownAvatar = avatarPreview ?? saved.avatarUrl;

  return (
    <div className="flex min-w-0 flex-col gap-6">
      {/* 1. Профиль */}
      <section
        className={`glass rounded-[28px] p-5 transition duration-500 sm:p-7 ${
          pulse === "profile" ? "ring-4 ring-emerald-200" : ""
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="eyebrow">Редактирование профиля</p>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              {editing ? "Измените данные и нажмите «Сохранить»" : "Данные защищены от случайных правок"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {editing && (
              <button
                type="button"
                onClick={cancelEditing}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white/80 px-4 py-2.5 text-sm font-bold text-slate-600 transition duration-200 hover:-translate-y-0.5 hover:bg-white active:scale-[0.98]"
              >
                <X className="h-4 w-4" /> Отмена
              </button>
            )}
            <button
              type="button"
              onClick={() => (editing ? saveProfile() : startEditing())}
              className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold transition duration-200 hover:-translate-y-0.5 active:scale-[0.98] ${
                editing
                  ? "bg-emerald-500 text-white shadow-[0_10px_24px_-10px_rgba(16,185,129,.9)]"
                  : "bg-indigo-600 text-white shadow-[0_10px_24px_-10px_rgba(79,70,229,.9)]"
              }`}
            >
              {editing ? <Check className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
              {editing ? "Сохранить" : "Редактировать профиль"}
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-[180px_1fr]">
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              {shownAvatar ? (
                <img
                  src={shownAvatar}
                  alt="Аватар пользователя"
                  className="h-28 w-28 rounded-full object-cover shadow-[0_16px_34px_-12px_rgba(79,70,229,.7)] transition duration-300"
                />
              ) : (
                <span className="grid h-28 w-28 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-3xl font-extrabold text-white shadow-[0_16px_34px_-12px_rgba(79,70,229,.7)] transition duration-300">
                  {initials(editing ? draft.name : saved.name)}
                </span>
              )}
              {avatarPreview && (
                <span className="absolute -right-1 -top-1 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-extrabold text-white animate-fade-in">
                  новое
                </span>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                handleAvatar(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 py-2 text-xs font-bold text-indigo-700 transition duration-200 hover:-translate-y-0.5 hover:bg-indigo-100 active:scale-[0.97]"
            >
              <Camera className="h-3.5 w-3.5" /> Загрузить новое фото
            </button>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field label="Имя пользователя" id="p-name" editing={editing} value={saved.name} error={errors.name}>
                <div className="relative">
                  <UserRound className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="p-name"
                    className={`${INPUT} pl-11 ${errors.name ? "border-rose-300" : ""}`}
                    value={draft.name}
                    maxLength={40}
                    onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  />
                </div>
              </Field>
            </div>

            <Field label="Email" id="p-email" editing={editing} value={saved.email} error={errors.email}>
              <input
                id="p-email"
                type="email"
                className={`${INPUT} ${errors.email ? "border-rose-300" : ""}`}
                value={draft.email}
                onChange={(e) => setDraft({ ...draft, email: e.target.value })}
              />
            </Field>

            <Field
              label="Стартовый виртуальный капитал"
              id="p-capital"
              editing={editing}
              value={rub(saved.startCapital)}
            >
              <select
                id="p-capital"
                className={`${INPUT} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 20 20%22 fill=%22%2394a3b8%22><path d=%22M5.3 7.3a1 1 0 011.4 0L10 10.6l3.3-3.3a1 1 0 111.4 1.4l-4 4a1 1 0 01-1.4 0l-4-4a1 1 0 010-1.4z%22/></svg>')] bg-[length:20px] bg-[right_12px_center] bg-no-repeat pr-10`}
                value={draft.startCapital}
                onChange={(e) => setDraft({ ...draft, startCapital: Number(e.target.value) })}
              >
                {CAPITAL_OPTIONS.map((v) => (
                  <option key={v} value={v}>
                    {rub(v)}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </div>
      </section>

      {/* 1b. Смена пароля */}
      <ChangePassword />

      {/* 2. Характер ИИ */}
      <section className="glass rounded-[28px] p-5 sm:p-7">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-indigo-500" />
          <p className="eyebrow">Характер ИИ-Наставника</p>
        </div>
        <p className="mt-2 text-xs font-semibold text-slate-500">Можно выбрать несколько стилей</p>
        <div role="group" aria-label="Характер ИИ-наставника" className="mt-4 grid gap-3 sm:grid-cols-3">
          {COACHES.map((c) => {
            const active = settings.coachStyle.includes(c.key);
            return (
              <button
                key={c.key}
                type="button"
                role="checkbox"
                aria-checked={active}
                onClick={() => toggleCoach(c.key)}
                className={`group rounded-2xl border-2 bg-white/70 p-4 text-left transition duration-300 active:scale-[0.97] hover:-translate-y-1 ${
                  active ? `${c.ring} bg-white` : "border-transparent hover:bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{c.emoji}</span>
                  <span
                    className={`grid h-5 w-5 place-items-center rounded-full border-2 transition duration-300 ${
                      active ? `${c.dot} border-transparent scale-100` : "scale-90 border-slate-300"
                    }`}
                  >
                    {active && <Check className="h-3 w-3 text-white" />}
                  </span>
                </div>
                <p className="mt-3 text-sm font-extrabold">{c.title}</p>
                <p className="mt-1 text-xs font-semibold leading-relaxed text-slate-500">{c.text}</p>
              </button>
            );
          })}
        </div>

        <div className="mt-6 rounded-2xl bg-white/70 p-5">
          <div className="flex items-center justify-between">
            <label htmlFor="hint-range" className="text-sm font-extrabold">
              Частота подсказок ИИ
            </label>
            <span
              key={settings.hintFrequency}
              className="grid h-9 min-w-9 place-items-center rounded-xl bg-indigo-600 px-2.5 text-sm font-extrabold text-white animate-pop"
            >
              {settings.hintFrequency}
            </span>
          </div>
          <input
            id="hint-range"
            type="range"
            min={1}
            max={10}
            step={1}
            value={settings.hintFrequency}
            onChange={(e) => setSettings({ ...settings, hintFrequency: Number(e.target.value) })}
            className="hint-slider mt-4 w-full cursor-pointer"
            style={{ ["--p" as string]: `${((settings.hintFrequency - 1) / 9) * 100}%` }}
          />
          <div className="mt-2 flex justify-between text-[11px] font-bold text-slate-400">
            <span>Редко (1)</span>
            <span>Каждый ход (10)</span>
          </div>
        </div>
      </section>

      {/* 3. Риск-профиль */}
      <section className="glass rounded-[28px] p-5 sm:p-7">
        <div className="flex items-center gap-2">
          <Sun className="h-5 w-5 text-emerald-500" />
          <p className="eyebrow">Инвестиционный риск-профиль</p>
        </div>
        <div role="tablist" aria-label="Риск-профиль" className="mt-5 grid grid-cols-1 gap-1.5 rounded-2xl bg-slate-200/60 p-1.5 sm:grid-cols-3">
          {RISKS.map((r) => {
            const active = settings.riskProfile === r.key;
            return (
              <button
                key={r.key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSettings({ ...settings, riskProfile: r.key })}
                className={`rounded-xl px-4 py-3 text-sm font-extrabold transition-all duration-300 active:scale-[0.97] ${
                  active
                    ? r.key === "conservative"
                      ? "bg-emerald-500 text-white shadow-[0_10px_24px_-10px_rgba(16,185,129,.9)]"
                      : r.key === "balanced"
                        ? "bg-indigo-600 text-white shadow-[0_10px_24px_-10px_rgba(79,70,229,.9)]"
                        : "bg-rose-500 text-white shadow-[0_10px_24px_-10px_rgba(244,63,94,.9)]"
                    : "text-slate-600 hover:bg-white/70"
                }`}
              >
                {r.label}
              </button>
            );
          })}
        </div>
        <p key={settings.riskProfile} className="mt-3 text-sm font-semibold text-slate-500 animate-fade-in">
          {RISKS.find((r) => r.key === settings.riskProfile)?.hint}
        </p>
      </section>

      {/* 4. Уведомления */}
      <section className="glass rounded-[28px] p-5 sm:p-7">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-indigo-500" />
          <p className="eyebrow">Уведомления и безопасность</p>
        </div>
        <div className="mt-5 flex flex-col gap-3">
          <Toggle
            label="Предупреждения об обвалах рынка (−5%)"
            description="Сигнал, когда акция в вашем портфеле падает на 5% и больше"
            checked={settings.crashAlerts}
            onChange={(v) => {
              setSettings({ ...settings, crashAlerts: v });
              if (v) showToast("🔔 Предупреждения включены: сообщим, если акция упадёт на 5% и больше");
            }}
          />
          <Toggle
            label="Ежедневный утренний отчёт"
            description="Итоги дня и один совет от ИИ-наставника каждое утро"
            checked={settings.dailyReport}
            onChange={(v) => {
              setSettings({ ...settings, dailyReport: v });
              if (v) showToast("🔔 Утренний отчёт включён: итоги дня и совет ИИ-наставника каждое утро");
            }}
          />
        </div>
        <p className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-slate-400">
          <ShieldAlert className="h-3.5 w-3.5" /> Платформа учебная: виртуальный капитал, реальные деньги не используются.
        </p>
      </section>

      {/* 5. Нижняя панель действий */}
      <div className="glass sticky bottom-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl p-3 sm:px-5">
        <p className="text-sm font-semibold text-slate-500">Характер, риск и уведомления применяются после сохранения</p>
        <button
          type="button"
          onClick={saveSettings}
          className="btn-primary px-6 py-3 shadow-[0_12px_30px_-10px_rgba(16,185,129,.8)]"
          style={{ backgroundImage: "linear-gradient(135deg,#10b981,#059669)" }}
        >
          <Check className="h-4 w-4" /> Сохранить изменения
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div
          key={toast.id}
          role="status"
          aria-live="polite"
          className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-4 animate-pop"
        >
          <div className="flex items-center gap-2.5 rounded-2xl border border-emerald-200/80 bg-emerald-500/95 px-5 py-3.5 text-sm font-extrabold text-white shadow-[0_20px_50px_-12px_rgba(16,185,129,.7)] backdrop-blur-xl">
            {toast.text}
          </div>
        </div>
      )}
    </div>
  );
}
