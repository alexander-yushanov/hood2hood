import { useMemo, useState } from "react";
import { ArrowLeft, Check, Lock, RotateCcw, Sparkles, X } from "lucide-react";
import { Logo } from "../components/ui";
import LangToggle from "../components/LangToggle";
import { GAMES } from "./games";
import { GAMES_EN } from "./learnEn";
import { LEARN_GAMES, START_CAPITAL, type Choice, type Round } from "./gameData";
import { LEARN_GAMES_EN } from "./gameDataEn";
import ProModal from "./ProModal";
import { useProfile } from "../profile/profileStore";
import { useLang } from "../lib/i18n";

function MiniChart({ series, label }: { series: number[]; label: string }) {
  const W = 320;
  const H = 110;
  const min = Math.min(...series);
  const max = Math.max(...series);
  const span = max - min || 1;
  const pts = series.map((v, i) => {
    const x = (i / (series.length - 1)) * (W - 16) + 8;
    const y = H - 12 - ((v - min) / span) * (H - 24);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const up = series[series.length - 1] >= series[0];
  const color = up ? "#10b981" : "#f43f5e";
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={label}>
      <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const STAKES = [10, 25, 50, 100];
const QUIZ_REWARD = 2000;
const QUIZ_PENALTY = 1000;
const BALANCE_KEY = "h2h-training-balance";

// Баланс тренажёров живёт между играми и визитами, но на следующий день возвращается к стартовому.
const dayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};

function loadBalance(): number {
  try {
    const raw = localStorage.getItem(BALANCE_KEY);
    if (raw) {
      const v = JSON.parse(raw) as { day?: string; balance?: number };
      if (v.day === dayKey() && typeof v.balance === "number") return Math.max(0, v.balance);
    }
  } catch {
    // Хранилище недоступно — работаем со стартовым балансом на время сессии.
  }
  return START_CAPITAL;
}

function saveBalance(balance: number) {
  try {
    localStorage.setItem(BALANCE_KEY, JSON.stringify({ day: dayKey(), balance }));
  } catch {
    // Без хранилища баланс живёт до перезагрузки страницы.
  }
}

const UI = {
  ru: {
    chart: "Динамика цены в раунде",
    notFound: "Такой игры нет",
    backToCenter: "← В центр обучения",
    proOnly: "Этот тренажёр доступен только в PRO-версии.",
    getPro: "Оформить PRO",
    backToGames: "Назад к играм",
    allGames: "Все игры",
    balance: "Баланс",
    trainer: "Тренажёр",
    done: "Тренировка окончена",
    correct: "Правильных ответов",
    of: "из",
    capitalResult: "Итог виртуального капитала:",
    sound: "Разумных решений",
    mentorLesson: "Вывод ИИ-наставника",
    again: "Пройти заново",
    chooseOther: "Выбрать другую игру",
    stakeLabel: "Ставка от баланса",
    stakeNote: (s: number) => `Ставка ${s}% от баланса на этом шаге.`,
    pick: "Отметь решения",
    confirm: (n: number) => `Подтвердить решения (${n})`,
    viewResult: "Посмотреть итог",
    nextRound: "Следующий раунд",
    mentor: "ИИ-наставник",
    mentorSub: "Разбирает решение простым языком",
    mentorIdle: "Отметь одно или несколько решений и подтверди. Я подскажу, что в них разумно, а что выглядит как эмоция.",
    correctAnswer: "Правильный ответ",
    sensible: "Разумные решения",
    why: "Почему",
    quizRule: (r: string, p: string, n: number) => `Верно +${r}, неверно −${p} · верных ответов: ${n}`,
    brokeNote: "Баланс 0 ₽ — решения недоступны до следующего дня.",
    moneyOver: "Деньги закончились",
    moneyOverText: (start: string) =>
      `Виртуальный баланс опустился до 0 ₽. Это учебный сценарий: на следующий день баланс снова станет ${start}.`,
    understood: "Понятно",
  },
  en: {
    chart: "Price movement in the round",
    notFound: "No such game",
    backToCenter: "← Back to the training center",
    proOnly: "This trainer is available in the PRO version only.",
    getPro: "Get PRO",
    backToGames: "Back to games",
    allGames: "All games",
    balance: "Balance",
    trainer: "Trainer",
    done: "Training complete",
    correct: "Correct answers",
    of: "of",
    capitalResult: "Virtual capital result:",
    sound: "Sound decisions",
    mentorLesson: "AI mentor's takeaway",
    again: "Play again",
    chooseOther: "Choose another game",
    stakeLabel: "Stake from balance",
    stakeNote: (s: number) => `Stake ${s}% of the balance at this step.`,
    pick: "Select decisions",
    confirm: (n: number) => `Confirm decisions (${n})`,
    viewResult: "See result",
    nextRound: "Next round",
    mentor: "AI mentor",
    mentorSub: "Explains the decision in plain language",
    mentorIdle: "Select one or more decisions and confirm. I'll point out what makes sense and what looks like emotion.",
    correctAnswer: "Correct answer",
    sensible: "Sound decisions",
    why: "Why",
    quizRule: (r: string, p: string, n: number) => `Correct +${r}, wrong −${p} · correct answers: ${n}`,
    brokeNote: "Balance 0 ₽ — decisions are unavailable until tomorrow.",
    moneyOver: "Out of money",
    moneyOverText: (start: string) =>
      `The virtual balance dropped to 0 ₽. This is a training scenario: tomorrow the balance will be ${start} again.`,
    understood: "Got it",
  },
};

export default function LearnGame({ gameId }: { gameId: string }) {
  const [lang] = useLang();
  const en = lang === "en";
  const t = UI[lang];
  const meta = GAMES.find((g) => g.id === gameId);
  const game = LEARN_GAMES[gameId];
  const gameEn = LEARN_GAMES_EN[gameId];
  const metaTitle = en ? GAMES_EN[gameId]?.title ?? meta?.title ?? "" : meta?.title ?? "";
  const [proOpen, setProOpen] = useState(false);
  const proTrial = useProfile().proTrial;
  const [roundIdx, setRoundIdx] = useState(0);
  const [selected, setSelected] = useState<Choice[]>([]);
  const [picked, setPicked] = useState<Choice[] | null>(null);
  const [capital, setCapital] = useState<number>(loadBalance);
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState<{ roundIdx: number; choices: Choice[] }[]>([]);
  const [finished, setFinished] = useState(false);

  const [stake, setStake] = useState<number>(25);
  const [balances, setBalances] = useState<number[]>(() => [loadBalance()]);
  const [lastDelta, setLastDelta] = useState<number | null>(null);
  const [brokeOpen, setBrokeOpen] = useState<boolean>(() => loadBalance() <= 0);

  const broke = capital <= 0;
  const isQuiz = gameId === "invest-quiz";
  const round = game?.rounds[roundIdx];
  const total = game?.rounds.length ?? 0;
  const goodCount = useMemo(() => history.filter((h) => h.choices.every((c) => c.good)).length, [history]);

  const rub = (n: number) => `${n.toLocaleString(en ? "en-US" : "ru-RU")} ₽`;
  const signedRub = (n: number) => `${n >= 0 ? "+" : "−"}${Math.abs(n).toLocaleString(en ? "en-US" : "ru-RU")} ₽`;

  // Текст раунда и решений на нужном языке. Решения сопоставляются по индексу: логика и числа общие.
  const localRound = (idx: number): { title: string; situation: string; explain?: string; choices: { label: string; reply: string }[] } | null => {
    const ru = game?.rounds[idx];
    if (!ru) return null;
    const r = en ? gameEn?.rounds[idx] : undefined;
    if (!r) return { title: ru.title, situation: ru.situation, explain: ru.explain, choices: ru.choices };
    return {
      title: r.title,
      situation: r.situation,
      explain: r.explain,
      choices: ru.choices.map((c, i) => ({ label: r.choices[i]?.label ?? c.label, reply: r.choices[i]?.reply ?? c.reply })),
    };
  };
  const localize = (idx: number, c: Choice) => {
    const lr = localRound(idx);
    const i = game?.rounds[idx]?.choices.indexOf(c) ?? -1;
    return lr && i >= 0 ? lr.choices[i] : { label: c.label, reply: c.reply };
  };
  const cur = localRound(roundIdx);

  if (!meta || !game) {
    return (
      <div className="grid min-h-screen place-items-center p-6 text-center">
        <div>
          <p className="text-lg font-extrabold">{t.notFound}</p>
          <a href="#/learn" className="mt-4 inline-block font-bold text-indigo-600">
            {t.backToCenter}
          </a>
        </div>
      </div>
    );
  }

  if (meta.pro && !proTrial) {
    return (
      <div className="min-h-screen pb-20">
        <div className="mx-auto mt-8 max-w-3xl px-4 text-center">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1 text-xs font-extrabold text-white">
            <Lock className="h-3.5 w-3.5" /> PRO
          </p>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight">{metaTitle}</h1>
          <p className="mt-3 font-semibold text-slate-600">{t.proOnly}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => setProOpen(true)}
              className="rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3.5 font-extrabold text-white"
            >
              {t.getPro}
            </button>
            <a href="#/learn" className="rounded-2xl border border-slate-200 bg-white px-6 py-3.5 font-extrabold text-slate-700">
              {t.backToGames}
            </a>
          </div>
        </div>
        <ProModal open={proOpen} onClose={() => setProOpen(false)} />
      </div>
    );
  }

  // «Пройти заново» начинает раунды сначала, но не возвращает деньги: баланс меняется только действиями.
  const restart = () => {
    setRoundIdx(0);
    setSelected([]);
    setPicked(null);
    setScore(0);
    setHistory([]);
    setFinished(false);
    setBalances([capital]);
    setLastDelta(null);
  };

  // В викторине — один ответ сразу. В остальных играх решения отмечаются несколько, и применяются по кнопке «Подтвердить».
  const toggle = (c: Choice) => {
    if (picked || !round || broke) return;
    if (isQuiz) {
      confirm([c]);
      return;
    }
    setSelected((s) => (s.includes(c) ? s.filter((x) => x !== c) : [...s, c]));
  };

  // Каждое подтверждение сразу меняет баланс; новое значение остаётся до следующего действия.
  const confirm = (list: Choice[]) => {
    if (picked || !round || broke || list.length === 0) return;
    setPicked(list);
    setHistory((h) => [...h, { roundIdx, choices: list }]);
    const delta = list.reduce(
      (sum, c) => sum + (isQuiz ? (c.good ? QUIZ_REWARD : -QUIZ_PENALTY) : Math.round(capital * (stake / 100) * (c.pct / 100))),
      0,
    );
    const nextCapital = Math.max(0, capital + delta);
    if (isQuiz && list.every((c) => c.good)) setScore((s) => s + 1);
    setCapital(nextCapital);
    saveBalance(nextCapital);
    setLastDelta(delta);
    setBalances((b) => [...b, nextCapital]);
    if (nextCapital <= 0) setBrokeOpen(true);
  };

  const next = () => {
    setPicked(null);
    setSelected([]);
    if (roundIdx + 1 >= total) setFinished(true);
    else setRoundIdx((i) => i + 1);
  };

  const profit = capital - START_CAPITAL;
  const pctTotal = (profit / START_CAPITAL) * 100;
  const fmtPct = (n: number) => Math.abs(n).toFixed(1).replace(".", en ? "." : ",");
  const lessonText = en ? gameEn?.lesson ?? game.lesson : game.lesson;
  const introText = en ? gameEn?.intro ?? game.intro : game.intro;

  return (
    <div className="min-h-screen pb-20">
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
        <div className="absolute -left-40 top-0 h-[460px] w-[460px] rounded-full bg-indigo-300/30 blur-[120px]" />
        <div className="absolute right-[-120px] top-40 h-[420px] w-[420px] rounded-full bg-emerald-200/50 blur-[120px]" />
      </div>

      <header className="sticky top-0 z-40 px-3 pt-3 sm:px-6">
        <div className="glass mx-auto flex max-w-5xl items-center justify-between gap-3 rounded-2xl px-3 py-2.5 sm:px-4">
          <a
            href="#/learn"
            className="flex h-10 items-center gap-1.5 rounded-xl border border-slate-200 bg-white/80 px-3 text-sm font-bold transition hover:-translate-y-0.5"
          >
            <ArrowLeft className="h-4 w-4" /> <span className="hidden sm:inline">{t.allGames}</span>
          </a>
          <Logo />
          <div className="flex items-center gap-2">
            <LangToggle />
            <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-extrabold tabular-nums text-emerald-700">
              {t.balance} {rub(capital)}
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto mt-8 max-w-5xl px-4 sm:px-6">
        <p className="eyebrow">{t.trainer}</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">{metaTitle}</h1>
        <p className="mt-2 font-semibold text-slate-600">{introText}</p>

        {finished ? (
          <section className="glass mt-8 rounded-[28px] p-6 sm:p-8">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white">
              <Check className="h-7 w-7" />
            </span>
            <h2 className="mt-5 text-2xl font-extrabold">{t.done}</h2>
            {isQuiz ? (
              <p className="mt-2 font-semibold text-slate-600">
                {t.correct}: {score} {t.of} {total}.
              </p>
            ) : (
              <p className="mt-2 font-semibold text-slate-600">
                {t.capitalResult}{" "}
                <span className={profit >= 0 ? "text-emerald-600" : "text-rose-500"}>
                  {profit >= 0 ? "+" : "−"}
                  {Math.abs(profit).toLocaleString(en ? "en-US" : "ru-RU")} ₽ ({profit >= 0 ? "+" : "−"}
                  {fmtPct(pctTotal)}%)
                </span>
              </p>
            )}
            <p className="mt-2 text-sm font-semibold text-slate-500">
              {t.sound}: {goodCount} {t.of} {total}.
            </p>

            <div className="mt-6 rounded-2xl bg-white/70 p-5">
              <p className="text-xs font-extrabold uppercase tracking-wide text-indigo-600">{t.mentorLesson}</p>
              <p className="mt-2 font-semibold text-slate-700">{lessonText}</p>
            </div>

            <ul className="mt-6 space-y-2">
              {history.map((h, i) => (
                <li key={i} className="flex items-start gap-3 rounded-2xl bg-white/60 px-4 py-3 text-sm font-semibold">
                  <span
                    className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-white ${
                      h.choices.every((c) => c.good) ? "bg-emerald-500" : "bg-rose-500"
                    }`}
                  >
                    {h.choices.every((c) => c.good) ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                  </span>
                  <span>
                    <span className="block text-slate-500">{localRound(h.roundIdx)?.title}</span>
                    {h.choices.map((c) => (
                      <span key={c.label} className="block">
                        {localize(h.roundIdx, c).label}
                      </span>
                    ))}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={restart}
                className="inline-flex items-center gap-2 rounded-2xl bg-ink px-5 py-3.5 font-extrabold text-white transition hover:-translate-y-0.5"
              >
                <RotateCcw className="h-4 w-4" /> {t.again}
              </button>
              <a href="#/learn" className="rounded-2xl border border-slate-200 bg-white px-5 py-3.5 font-extrabold text-slate-700">
                {t.chooseOther}
              </a>
            </div>
          </section>
        ) : (
          round &&
          cur && (
            <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
              <div className="glass rounded-[28px] p-5 sm:p-6">
                <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                  {cur.title} · {roundIdx + 1} {t.of} {total}
                </p>
                <h2 className="mt-2 text-xl font-extrabold">{cur.situation}</h2>

                <div className="mt-4 rounded-2xl bg-white/70 p-3">
                  <MiniChart series={round.series} label={t.chart} />
                </div>

                {!isQuiz && (
                  <div className="mt-5">
                    <p className="mb-2 text-xs font-extrabold uppercase tracking-wide text-slate-500">
                      {t.stakeLabel}: {stake}% · {rub(Math.round((capital * stake) / 100))}
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      {STAKES.map((s) => (
                        <button
                          key={s}
                          type="button"
                          disabled={picked !== null}
                          onClick={() => setStake(s)}
                          className={`rounded-xl border py-2 text-sm font-extrabold tabular-nums transition active:scale-95 disabled:opacity-60 ${
                            stake === s ? "border-indigo-500 bg-indigo-600 text-white" : "border-slate-200 bg-white/80 text-slate-700 hover:border-indigo-300"
                          }`}
                        >
                          {s}%
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-5 grid gap-3">
                  {round.choices.map((c, i) => {
                    const isSelected = picked ? picked.includes(c) : selected.includes(c);
                    const revealed = picked !== null;
                    const style = !revealed
                      ? isSelected
                        ? "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200"
                        : "border-slate-200 bg-white/80 hover:-translate-y-0.5 hover:border-indigo-300"
                      : isSelected
                        ? c.good
                          ? "border-emerald-300 bg-emerald-50"
                          : "border-rose-300 bg-rose-50"
                        : c.good
                          ? "border-emerald-400 bg-emerald-50/70 ring-2 ring-emerald-200"
                          : "border-slate-200 bg-white/50 opacity-70";
                    return (
                      <button
                        key={c.label}
                        type="button"
                        aria-pressed={isSelected}
                        disabled={revealed || broke}
                        onClick={() => toggle(c)}
                        className={`flex items-start gap-3 rounded-2xl border px-4 py-3.5 text-left text-sm font-bold transition duration-200 active:scale-[0.99] ${style}`}
                      >
                        {!isQuiz && (
                          <span
                            className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border ${
                              isSelected ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-300 bg-white"
                            }`}
                            aria-hidden
                          >
                            {isSelected && <Check className="h-3 w-3" />}
                          </span>
                        )}
                        <span>{cur.choices[i]?.label ?? c.label}</span>
                      </button>
                    );
                  })}
                </div>

                {!picked && !isQuiz && (
                  <button
                    type="button"
                    onClick={() => confirm(selected)}
                    disabled={selected.length === 0 || broke}
                    className="mt-5 w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3.5 font-extrabold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
                  >
                    {selected.length === 0 ? t.pick : t.confirm(selected.length)}
                  </button>
                )}

                {picked && (
                  <button
                    type="button"
                    onClick={next}
                    className="mt-5 w-full rounded-2xl bg-ink px-5 py-3.5 font-extrabold text-white transition hover:-translate-y-0.5"
                  >
                    {roundIdx + 1 >= total ? t.viewResult : t.nextRound}
                  </button>
                )}
              </div>

              <aside className="glass flex flex-col rounded-[28px] p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <span className="relative grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
                    <Sparkles className="h-5 w-5" />
                    <span className="absolute inset-0 animate-ping rounded-2xl bg-indigo-400/30" aria-hidden />
                  </span>
                  <div>
                    <p className="font-extrabold">{t.mentor}</p>
                    <p className="text-xs font-semibold text-slate-500">{t.mentorSub}</p>
                  </div>
                </div>
                <div className="mt-4 rounded-2xl bg-white/70 p-4 text-sm font-semibold leading-relaxed text-slate-700">
                  {picked
                    ? picked.map((c) => (
                        <p key={c.label} className="not-first:mt-2">
                          {localize(roundIdx, c).reply}
                        </p>
                      ))
                    : t.mentorIdle}
                </div>

                {picked && !picked.every((c) => c.good) && (
                  <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 text-sm font-semibold leading-relaxed text-slate-700">
                    <p className="text-xs font-extrabold uppercase tracking-wide text-emerald-700">
                      {isQuiz ? t.correctAnswer : t.sensible}
                    </p>
                    {round.choices
                      .map((c, i) => ({ c, i }))
                      .filter(({ c }) => c.good)
                      .map(({ c, i }) => (
                        <p key={c.label} className="mt-1.5">
                          {cur.choices[i]?.label ?? c.label}
                        </p>
                      ))}
                    <p className="mt-3 text-xs font-extrabold uppercase tracking-wide text-rose-600">{t.why}</p>
                    <p className="mt-1.5">
                      {cur.explain ??
                        round.choices
                          .map((c, i) => ({ c, i }))
                          .filter(({ c }) => c.good)
                          .map(({ i }) => cur.choices[i]?.reply ?? "")
                          .join(" ")}
                    </p>
                  </div>
                )}

                <div className="mt-4 rounded-2xl bg-ink p-4 text-white">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-300">{t.balance}</p>
                  <div className="mt-1 flex flex-wrap items-baseline gap-2">
                    <p className="text-2xl font-extrabold tabular-nums">{rub(capital)}</p>
                    {lastDelta !== null && (
                      <span
                        key={balances.length}
                        className={`rounded-full px-2 py-0.5 text-xs font-extrabold tabular-nums ${
                          lastDelta >= 0 ? "bg-emerald-400/20 text-emerald-300" : "bg-rose-400/20 text-rose-300"
                        }`}
                      >
                        {signedRub(lastDelta)}
                      </span>
                    )}
                  </div>
                  {balances.length > 1 && (
                    <div className="mt-3 rounded-xl bg-white/10 p-2">
                      <MiniChart series={balances} label={t.chart} />
                    </div>
                  )}
                  {isQuiz && (
                    <p className="mt-2 text-xs font-semibold text-slate-300">
                      {t.quizRule(rub(QUIZ_REWARD), rub(QUIZ_PENALTY), score)}
                    </p>
                  )}
                  {broke && <p className="mt-2 text-xs font-semibold text-rose-300">{t.brokeNote}</p>}
                </div>

                {!isQuiz && picked && <p className="mt-3 text-xs font-semibold text-slate-500">{t.stakeNote(stake)}</p>}
              </aside>
            </section>
          )
        )}
      </main>

      {broke && brokeOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="broke-title">
          <div className="glass w-full max-w-md rounded-[28px] p-6 text-center sm:p-8">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-rose-400 to-rose-600 text-white">
              <X className="h-7 w-7" />
            </span>
            <h2 id="broke-title" className="mt-5 text-2xl font-extrabold">
              {t.moneyOver}
            </h2>
            <p className="mt-3 font-semibold text-slate-600">{t.moneyOverText(rub(START_CAPITAL))}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a href="#/learn" className="rounded-2xl bg-ink px-5 py-3.5 font-extrabold text-white transition hover:-translate-y-0.5">
                {t.chooseOther}
              </a>
              <button
                type="button"
                onClick={() => setBrokeOpen(false)}
                className="rounded-2xl border border-slate-200 bg-white px-5 py-3.5 font-extrabold text-slate-700"
              >
                {t.understood}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
