import { useState } from "react";
import {
  ArrowLeft,
  Crown,
  Gem,
  History,
  LifeBuoy,
  Lock,
  MessageCircle,
  Settings,
  Shield,
  Sparkles,
  Trophy,
  TrendingDown,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "../components/ui";
import { LOT, START_CASH } from "../game/scenarios";
import SettingsPanel from "./Settings";
import { initials, useProfile } from "./profileStore";
import { loadTrainingResults, signOut, useAuth, type TrainingResult } from "../auth/session";
import { useEffect } from "react";
import LangToggle from "../components/LangToggle";
import { useLang } from "../lib/i18n";
import { PROFILE_EN } from "./profileEn";

type NavKey = "achievements" | "history" | "settings" | "support";

const NAV: { key: NavKey; label: string; labelEn: string; icon: LucideIcon }[] = [
  { key: "achievements", label: "Мои достижения", labelEn: PROFILE_EN.navAchievements, icon: Trophy },
  { key: "history", label: "История сделок", labelEn: PROFILE_EN.navHistory, icon: History },
  { key: "settings", label: "Настройки", labelEn: PROFILE_EN.navSettings, icon: Settings },
  { key: "support", label: "Поддержка", labelEn: PROFILE_EN.navSupport, icon: LifeBuoy },
];

// Якоря разделов на странице профиля (для «Мои достижения», «История сделок», «Поддержка»).
const SECTION_IDS: Partial<Record<NavKey, string>> = {
  achievements: "profile-achievements",
  history: "profile-history",
  support: "profile-support",
};

type Counts = { panic: number; greed: number; calm: number };

// Статистика считается только из сохранённых результатов текущего аккаунта.
function statsFrom(history: TrainingResult[]) {
  const cool: number[] = [];
  const counts: Counts = { panic: 0, greed: 0, calm: 0 };
  for (const h of history) {
    const d = h.details as { cool?: unknown; counts?: Partial<Counts> } | null;
    if (!d || typeof d !== "object") continue;
    if (typeof d.cool === "number") cool.push(d.cool);
    if (d.counts) {
      counts.panic += d.counts.panic ?? 0;
      counts.greed += d.counts.greed ?? 0;
      counts.calm += d.counts.calm ?? 0;
    }
  }
  const total = counts.panic + counts.greed + counts.calm;
  return {
    coolAvg: cool.length ? Math.round(cool.reduce((a, b) => a + b, 0) / cool.length) : null,
    calmShare: total ? Math.round((counts.calm / total) * 100) : null,
  };
}

const rub = (n: number) => `${Math.round(n).toLocaleString("ru-RU")} ₽`;
const pct = (n: number) => `${n > 0 ? "+" : ""}${n.toFixed(1).replace(".", ",")}%`;

export default function Profile() {
  const [lang] = useLang();
  const en = lang === "en";
  const [nav, setNav] = useState<NavKey>("achievements");
  const profile = useProfile();
  const isPro = profile.proTrial;
  const auth = useAuth();
  const [history, setHistory] = useState<TrainingResult[] | null>(null);
  const firstName = profile.name.trim().split(/\s+/)[0] || "Инвестор";

  useEffect(() => {
    setHistory(null);
    loadTrainingResults()
      .then(setHistory)
      .catch(() => setHistory([]));
  }, [auth.user?.id]);

  // Капитал аккаунта: наличные + стоимость позиции по цене покупки (стартовый баланс, если симулятор ещё не начат).
  const sim = profile.simBalance;
  const capital = sim ? sim.cash + sim.lots * LOT * sim.avg : START_CASH;
  const profitPct = ((capital - START_CASH) / START_CASH) * 100;
  const sessions = history?.length ?? 0;
  const stats = history ? statsFrom(history) : { coolAvg: null, calmShare: null };
  const hasProfit = Boolean(history?.some((h) => h.result_rub > 0));

  const skills = [
    { label: en ? PROFILE_EN.skillCool : "Хладнокровие", value: stats.coolAvg, bar: "from-emerald-400 to-emerald-600" },
    { label: en ? PROFILE_EN.skillRisk : "Управление рисками", value: stats.calmShare, bar: "from-indigo-500 to-violet-600" },
  ];

  const badges: { title: string; hint: string; icon: LucideIcon; unlocked: boolean; progress?: string }[] = [
    en
      ? { title: PROFILE_EN.badgeIron, hint: PROFILE_EN.badgeIronHint, icon: Shield, unlocked: false }
      : { title: "Железные нервы", hint: "Выдержал обвал −15%", icon: Shield, unlocked: false },
    en
      ? { title: PROFILE_EN.badgeFirst, hint: PROFILE_EN.badgeFirstHint, icon: Sparkles, unlocked: hasProfit }
      : { title: "Первая прибыль", hint: "Закрыл сделку в плюс", icon: Sparkles, unlocked: hasProfit },
    en
      ? { title: PROFILE_EN.badgeHodl, hint: PROFILE_EN.badgeHodlHint, icon: Gem, unlocked: false }
      : { title: "HODLer", hint: "Не продавал акции неделю", icon: Gem, unlocked: false },
  ];

  return (
    <div className="min-h-screen pb-20">
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
        <div className="absolute -left-40 top-0 h-[460px] w-[460px] rounded-full bg-indigo-300/30 blur-[120px]" />
        <div className="absolute right-[-120px] top-40 h-[420px] w-[420px] rounded-full bg-emerald-200/50 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 h-[360px] w-[360px] rounded-full bg-rose-200/40 blur-[120px]" />
      </div>

      <header className="sticky top-0 z-40 px-3 pt-3 sm:px-6">
        <div className="glass mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-2xl px-3 py-2.5 sm:px-4">
          <a
            href="#/"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white/80 transition hover:-translate-y-0.5 sm:w-auto sm:px-3"
            aria-label={en ? PROFILE_EN.home : "На главную"}
          >
            <ArrowLeft className="h-4 w-4 sm:mr-1.5" />
            <span className="hidden text-sm font-bold sm:inline">{en ? PROFILE_EN.home : "На главную"}</span>
          </a>
          <Logo />
          <div className="flex items-center gap-2">
            <LangToggle />
            <a
              href="#/game"
              className="hidden items-center gap-1.5 rounded-xl bg-ink px-4 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 sm:inline-flex"
            >
              {en ? PROFILE_EN.simulator : "Симулятор"}
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto mt-8 grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[280px_1fr]">
        {/* Sidebar */}
        <aside className="glass h-fit rounded-[28px] p-5 lg:sticky lg:top-28">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt=""
                  className="h-24 w-24 rounded-full object-cover shadow-[0_16px_34px_-12px_rgba(79,70,229,.8)]"
                />
              ) : (
                <span className="grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-3xl font-extrabold text-white shadow-[0_16px_34px_-12px_rgba(79,70,229,.8)]">
                  {initials(profile.name)}
                </span>
              )}
              {isPro && (
                <span className="absolute -bottom-1 -right-1 grid h-8 w-8 place-items-center rounded-full border-2 border-white bg-emerald-500 text-white">
                  <Crown className="h-4 w-4" />
                </span>
              )}
            </div>
            <h1 className="mt-4 text-xl font-extrabold tracking-tight">{profile.name}</h1>
            <p className="text-xs font-semibold text-slate-400">{profile.email}</p>
            <p className="text-sm font-semibold text-slate-500">
              {en ? PROFILE_EN.level : "Уровень"}: {sessions > 0 ? (en ? PROFILE_EN.analyst : "Аналитик") : en ? PROFILE_EN.beginner : "Новичок"}
            </p>
            {isPro ? (
              <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-[0_8px_20px_-8px_rgba(79,70,229,.8)]">
                <Crown className="h-3.5 w-3.5" /> {en ? PROFILE_EN.proTrial : "PRO ПРОБНЫЙ"}
              </span>
            ) : (
              <span className="mt-3 rounded-full bg-slate-200 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                {en ? PROFILE_EN.free : "FREE"}
              </span>
            )}
          </div>

          <nav className="mt-6 flex flex-col gap-1.5" aria-label="Разделы профиля">
            {NAV.map(({ key, label, labelEn, icon: Icon }) => {
              const active = nav === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setNav(key);
                    const targetId = SECTION_IDS[key];
                    if (targetId) {
                      // Ждём, пока центральная колонка перерисуется (если был открыт «Настройки»).
                      window.setTimeout(() => {
                        document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
                      }, 0);
                    }
                  }}
                  aria-pressed={active}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-bold transition duration-200 active:scale-[0.98] ${
                    active
                      ? "bg-indigo-600 text-white shadow-[0_10px_24px_-10px_rgba(79,70,229,.9)]"
                      : "text-slate-600 hover:bg-white/80 hover:text-ink"
                  }`}
                >
                  <Icon className="h-[18px] w-[18px]" />
                  {en ? labelEn : label}
                </button>
              );
            })}
          </nav>
          <button
            type="button"
            onClick={() => {
              void signOut().then(() => {
                window.location.hash = "#/";
              });
            }}
            className="mt-4 w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm font-bold text-slate-600 transition hover:-translate-y-0.5 hover:bg-white"
          >
            {en ? PROFILE_EN.signOut : "Выйти из аккаунта"}
          </button>
        </aside>

        {/* Center */}
        {nav === "settings" ? (
          <div className="min-w-0 animate-fade-in">
            <SettingsPanel />
          </div>
        ) : (
        <div className="flex min-w-0 flex-col gap-6">
          {/* Successes */}
          <section className="glass rounded-[28px] p-5 sm:p-7">
            <p className="eyebrow">{en ? PROFILE_EN.successes : "Твои успехи"}</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/70 p-5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                  <Wallet className="h-4 w-4 text-indigo-500" /> {en ? PROFILE_EN.capital : "Виртуальный капитал"}
                </div>
                <p className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">{rub(capital)}</p>
              </div>
              <div className="rounded-2xl bg-white/70 p-5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                  <TrendingUp className="h-4 w-4 text-emerald-500" /> {en ? PROFILE_EN.totalProfit : "Общая прибыль"}
                </div>
                <p
                  className={`mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl ${
                    profitPct < 0 ? "text-rose-600" : "text-emerald-600"
                  }`}
                >
                  {pct(profitPct)}
                </p>
              </div>
              <div className="rounded-2xl bg-white/70 p-5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                  <Trophy className="h-4 w-4 text-indigo-500" /> {en ? PROFILE_EN.completed : "Пройдено симуляций"}
                </div>
                <p className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">{history ? sessions : "…"}</p>
              </div>
            </div>
          </section>

          <div className="grid gap-6 xl:grid-cols-2">
            {/* AI skills */}
            <section className="glass rounded-[28px] p-5 sm:p-7">
              <p className="eyebrow">{en ? PROFILE_EN.skillsTitle : "Анализ навыков от ИИ"}</p>
              {sessions === 0 ? (
                <p className="mt-5 text-sm font-semibold leading-relaxed text-slate-500">
                  {en ? PROFILE_EN.skillsEmpty : "Пройдите симулятор — ИИ оценит ваши решения и покажет навыки."}
                </p>
              ) : (
                <>
                  <div className="mt-5 flex flex-col gap-5">
                    {skills.map((s) =>
                      s.value === null ? null : (
                        <div key={s.label}>
                          <div className="mb-2 flex items-center justify-between text-sm font-bold">
                            <span>{s.label}</span>
                            <span className="text-slate-500">{s.value}%</span>
                          </div>
                          <div className="h-2.5 overflow-hidden rounded-full bg-slate-200/80">
                            <div
                              className={`h-full rounded-full bg-gradient-to-r ${s.bar} transition-[width] duration-1000`}
                              style={{ width: `${s.value}%` }}
                            />
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                  <div className="mt-6 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-4">
                    <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-indigo-600">
                      <Sparkles className="h-4 w-4" /> {en ? PROFILE_EN.aiComment : "ИИ-комментарий"}
                    </div>
                    <p className="mt-2 text-sm font-semibold leading-relaxed text-slate-700">
                      {stats.coolAvg !== null && stats.coolAvg < 50
                        ? en
                          ? PROFILE_EN.aiCommentLow(firstName)
                          : `${firstName}, в сделках чаще берут верх эмоции. Перед каждым ходом назови причину и пройди тренажёр «Психолог FOMO».`
                        : en
                          ? PROFILE_EN.aiCommentHigh(firstName)
                          : `${firstName}, решения в целом взвешенные. Продолжай тренировки, чтобы закрепить результат.`}
                    </p>
                    <a
                      href="#/learn"
                      className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600 transition hover:translate-x-0.5"
                    >
                      {en ? PROFILE_EN.openTrainer : "Открыть тренажёр →"}
                    </a>
                  </div>
                </>
              )}
            </section>

            {/* Badges */}
            <section id="profile-achievements" className="glass scroll-mt-28 rounded-[28px] p-5 sm:p-7">
              <p className="eyebrow">{en ? PROFILE_EN.achievementsTitle : "Достижения"}</p>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                {en
                  ? PROFILE_EN.opened(profile.name, badges.filter((b) => b.unlocked).length, badges.length)
                  : `${profile.name}: открыто ${badges.filter((b) => b.unlocked).length} из ${badges.length}`}
              </p>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {badges.map(({ title, hint, icon: Icon, unlocked, progress }) => (
                  <div
                    key={title}
                    className={`flex flex-col items-center rounded-2xl border p-4 text-center transition duration-300 ${
                      unlocked
                        ? "border-white bg-white/80 shadow-[0_12px_28px_-14px_rgba(79,70,229,.45)] hover:-translate-y-1"
                        : "border-slate-200 bg-slate-100/70 grayscale"
                    }`}
                  >
                    <span
                      className={`grid h-14 w-14 place-items-center rounded-full ${
                        unlocked
                          ? "bg-gradient-to-br from-amber-300 to-amber-500 text-white shadow-lg"
                          : "bg-slate-300 text-slate-500"
                      }`}
                    >
                      {unlocked ? <Icon className="h-6 w-6" /> : <Lock className="h-5 w-5" />}
                    </span>
                    <p className={`mt-3 text-sm font-extrabold ${unlocked ? "text-ink" : "text-slate-500"}`}>{title}</p>
                    <p className="mt-1 text-[11px] font-semibold leading-snug text-slate-500">{hint}</p>
                    {progress && <p className="mt-2 text-[11px] font-bold text-slate-400">{progress}</p>}
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sessions */}
          <section id="profile-history" className="glass scroll-mt-28 rounded-[28px] p-5 sm:p-7">
            <div className="flex items-center justify-between">
              <p className="eyebrow">{en ? PROFILE_EN.historyTitle : "История сессий"}</p>
              <span className="text-xs font-bold text-slate-400">{en ? PROFILE_EN.historyLast : "Последние 4"}</span>
            </div>
            {history === null ? (
              <p className="mt-5 text-sm font-semibold text-slate-500">{en ? PROFILE_EN.historyLoading : "Загружаем историю…"}</p>
            ) : history.length === 0 ? (
              <p className="mt-5 text-sm font-semibold text-slate-500">
                {en
                  ? PROFILE_EN.historyEmpty
                  : "Пока нет сохранённых тренировок. Пройдите симулятор — результат появится здесь."}
              </p>
            ) : (
              <ul className="mt-5 divide-y divide-slate-200/70">
                {history.map((s) => {
                  const positive = s.result_rub >= 0;
                  return (
                    <li key={s.id} className="grid grid-cols-[1fr_auto] items-center gap-3 py-4 sm:grid-cols-[120px_1fr_120px]">
                      <span className="text-xs font-bold text-slate-400 sm:text-sm">
                        {new Date(s.created_at).toLocaleDateString("ru-RU")}
                      </span>
                      <span className="order-3 col-span-2 text-sm font-extrabold sm:order-none sm:col-span-1">
                        {s.game_id.startsWith("sim-") ? (en ? PROFILE_EN.simulatorName : "Симулятор") : s.game_id}
                      </span>
                      <span
                        className={`inline-flex items-center justify-end gap-1 text-sm font-extrabold tabular-nums ${
                          positive ? "text-emerald-600" : "text-rose-500"
                        }`}
                      >
                        {positive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                        {positive ? "+" : "−"}
                        {Math.abs(s.result_rub).toLocaleString("ru-RU")} ₽
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {/* Support */}
          <section id="profile-support" className="glass scroll-mt-28 rounded-[28px] p-5 sm:p-7">
            <p className="eyebrow">{en ? PROFILE_EN.supportTitle : "Поддержка"}</p>
            <div className="mt-4 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <div className="flex-1">
                <p className="text-base font-extrabold">{en ? PROFILE_EN.supportCta : "Напишите нам во ВКонтакте"}</p>
                <p className="mt-2 text-sm font-semibold leading-relaxed text-slate-600">
                  {en
                    ? PROFILE_EN.supportText
                    : "Вопросы по симулятору, оплате PRO и работе аккаунта. Отсканируйте QR-код камерой телефона, чтобы открыть переписку."}
                </p>
                <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-indigo-600">
                  <MessageCircle className="h-4 w-4" /> {en ? PROFILE_EN.supportHours : "Ответим в рабочее время"}
                </p>
              </div>
              <img
                src={import.meta.env.BASE_URL + "uploads/vk-qr.jpg"}
                alt={en ? PROFILE_EN.qrAlt : "QR-код для связи с нами во ВКонтакте"}
                className="h-40 w-40 rounded-2xl border border-white bg-white object-cover shadow-md"
              />
            </div>
          </section>
        </div>
        )}
      </main>
    </div>
  );
}
