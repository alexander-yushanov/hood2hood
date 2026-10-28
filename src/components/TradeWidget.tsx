import { useEffect, useState } from "react";
import { Brain, ChevronDown, RotateCcw, Sparkles, TrendingDown, TrendingUp } from "lucide-react";
import { useLang } from "../lib/i18n";

const T = {
  ru: {
    emotions: "Эмоции",
    greed: "Азарт",
    calm: "Спокойствие",
    panic: "Паника",
    mentor: "ИИ-наставник",
    subtitle: "Исторический сценарий · виртуальный счёт",
    chartLabel: "График акции: рост, затем падение на 8%",
    peak: "пик",
    sold: "продано −8%",
    sell: "Продать сейчас",
    hold: "Переждать",
    replay: "Пройти сценарий заново",
    analyze: "Разобрать",
    hide: "Скрыть разбор",
    analysisOf: "Разбор твоего действия:",
    quoteSell: "«Продать сейчас»",
    quoteHold: "«Переждать»",
    aiHold: "Отличный выбор. Ты переждал просадку — и рынок почти полностью отыграл падение. Именно этот навык мы и тренируем.",
    aiSell: "Сделка закрыта по −8%. А цена потом вернулась к пику. Это классика: продажа на эмоциях фиксирует убыток. Разберём, что тебя подтолкнуло?",
    aiIdle: "Спокойно! Ты хочешь продать на эмоциях из-за паники. Давай разберём, почему сейчас лучше переждать.",
    sellA: (p: string) => `Ты продал на ${p} ₽ — это −8% от пика, после падения на эмоциях.`,
    sellB: "Цена упала резко, и страх подтолкнул закрыть позицию именно в худшей точке.",
    sellC: "Через несколько шагов цена вернулась почти к пику: убыток оказался временным, а зафиксирован он был окончательно.",
    sellD: "Что проверить в следующий раз: заранее задать условие выхода по плану, а не по панике.",
    holdA: "Ты не стал продавать в просадке и дал рынку время восстановиться.",
    holdB: "Падение сопровождалось новостями, но фундамент компании не менялся, поэтому паника оказалась короткой.",
    holdC: "Переждать — тоже решение: оно основано на плане, а не на эмоции в моменте.",
    holdD: "Что закрепить: перед каждым ходом фиксируй, какую цену и срок ты считаешь приемлемыми.",
  },
  en: {
    emotions: "Emotions",
    greed: "Greed",
    calm: "Calm",
    panic: "Panic",
    mentor: "AI mentor",
    subtitle: "Historical scenario · virtual account",
    chartLabel: "Stock chart: growth, then an 8% drop",
    peak: "peak",
    sold: "sold −8%",
    sell: "Sell now",
    hold: "Hold",
    replay: "Replay scenario",
    analyze: "Review",
    hide: "Hide review",
    analysisOf: "Review of your action:",
    quoteSell: "“Sell now”",
    quoteHold: "“Hold”",
    aiHold: "Great choice. You held through the dip, and the market almost fully recovered. This is exactly the skill we train.",
    aiSell: "The trade closed at −8%, and the price later returned to the peak. This is classic: selling on emotion locks in a loss. Shall we look at what pushed you?",
    aiIdle: "Easy! You want to sell out of panic. Let's review why holding is the better move right now.",
    sellA: (p: string) => `You sold at ${p} ₽ — 8% below the peak, after a fall driven by emotion.`,
    sellB: "The price dropped sharply, and fear pushed you to close the position at the worst point.",
    sellC: "A few steps later the price came back almost to the peak: the loss was temporary, but it became permanent when you locked it in.",
    sellD: "Next time, check: set your exit condition in advance, according to a plan, not panic.",
    holdA: "You did not sell into the dip and gave the market time to recover.",
    holdB: "The fall came with news, but the company's fundamentals did not change, so the panic was short.",
    holdC: "Holding is also a decision: it is based on a plan, not on emotion in the moment.",
    holdD: "To remember: before each move, note which price and time frame you consider acceptable.",
  },
};

// Исторический сценарий: рост до пика (idx 16), падение на 8% (idx 24), затем отскок.
const BASE = [100, 101, 100.5, 102, 103.5, 102.8, 104, 105.5, 105, 106.8, 108, 107.2, 108.9, 110.2, 109.4, 111, 112, 110.5, 108.8, 109.6, 107.4, 105.9, 106.5, 104.2, 103.0];
const RECOVERY = [104.1, 105.6, 105.0, 107.3, 108.9, 110.4, 112.6];
const ALL = [...BASE, ...RECOVERY];
const PEAK = 16;
const DROP = BASE.length - 1;

const W = 520;
const H = 230;
const PAD = { l: 8, r: 14, t: 18, b: 18 };
const MIN = 98;
const MAX = 114;
const x = (i: number) => PAD.l + (i / (ALL.length - 1)) * (W - PAD.l - PAD.r);
const y = (v: number) => PAD.t + (1 - (v - MIN) / (MAX - MIN)) * (H - PAD.t - PAD.b);
const path = (from: number, to: number) =>
  ALL.slice(from, to + 1)
    .map((v, k) => `${k === 0 ? "M" : "L"}${x(from + k).toFixed(1)} ${y(v).toFixed(1)}`)
    .join(" ");

type Choice = null | "sell" | "hold";

export default function TradeWidget() {
  const [count, setCount] = useState(2);
  const [choice, setChoice] = useState<Choice>(null);
  const [run, setRun] = useState(0);
  const [analysisOpen, setAnalysisOpen] = useState(false);
  const [lang] = useLang();
  const t = T[lang];

  // Отрисовка графика до момента просадки
  useEffect(() => {
    setCount(2);
    setChoice(null);
    setAnalysisOpen(false);
    const id = setInterval(() => {
      setCount((c) => {
        if (c >= BASE.length) {
          clearInterval(id);
          return c;
        }
        return c + 1;
      });
    }, 85);
    return () => clearInterval(id);
  }, [run]);

  // Показ отскока после выбора пользователя
  useEffect(() => {
    if (!choice) return;
    const id = setInterval(() => {
      setCount((c) => {
        if (c >= ALL.length) {
          clearInterval(id);
          return c;
        }
        return c + 1;
      });
    }, 160);
    return () => clearInterval(id);
  }, [choice]);

  const last = count - 1;
  const dropped = count >= BASE.length;
  const price = ALL[last];
  const drawnPeak = Math.min(last, PEAK);
  const recovered = last > DROP;
  const ref = last <= PEAK ? ALL[0] : ALL[PEAK];
  const pct = ((price - ref) / ref) * 100;

  const mood = !dropped
    ? { label: t.greed, val: 34, bar: "bg-emerald-500", text: "text-emerald-600" }
    : choice === "hold"
      ? { label: t.calm, val: 78, bar: "bg-emerald-500", text: "text-emerald-600" }
      : { label: t.panic, val: 87, bar: "bg-rose-500", text: "text-rose-600" };

  const ai = choice === "hold" ? t.aiHold : choice === "sell" ? t.aiSell : t.aiIdle;

  const fmt = (n: number) => n.toLocaleString(lang === "en" ? "en-US" : "ru-RU", { maximumFractionDigits: 0 });

  const analysis: string[] =
    choice === "sell"
      ? [t.sellA(fmt(ALL[DROP] * 10)), t.sellB, t.sellC, t.sellD]
      : choice === "hold"
        ? [t.holdA, t.holdB, t.holdC, t.holdD]
        : [];

  return (
    <div className="relative mx-auto w-full">
      {/* метка эмоций: в потоке страницы, без выхода за границы блока */}
      <div
        className={`glass mb-3 inline-block max-w-full rounded-2xl px-4 py-3 transition-opacity duration-500 ${dropped ? "animate-float opacity-100" : "opacity-0"}`}
        aria-live="polite"
      >
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
          <Brain className="h-3.5 w-3.5 text-violet-500" /> {t.emotions}
        </div>
        <div className="mt-1 flex items-center gap-3">
          <span className={`text-sm font-extrabold ${mood.text}`}>{mood.label}</span>
          <span className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-200/80">
            <span className={`block h-full rounded-full transition-all duration-700 ${mood.bar}`} style={{ width: `${mood.val}%` }} />
          </span>
          <span className="text-xs font-bold text-slate-600">{mood.val}%</span>
        </div>
      </div>

      <div className="glass relative rounded-[28px] p-4 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-ink text-[11px] font-extrabold text-white">N</span>
              <div>
                <p className="text-sm font-extrabold leading-none">NOVA · Nova Tech</p>
                <p className="mt-1 text-[11px] font-semibold text-slate-500">{t.subtitle}</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-extrabold tabular-nums leading-none">{fmt(price * 10)} ₽</p>
            <p
              className={`mt-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-extrabold tabular-nums ${
                pct < -0.05 ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-600"
              }`}
            >
              {pct < -0.05 ? <TrendingDown className="h-3.5 w-3.5" /> : <TrendingUp className="h-3.5 w-3.5" />}
              {pct > 0 ? "+" : "−"}
              {Math.abs(pct).toFixed(1).replace(".", ",")}%
            </p>
          </div>
        </div>

        <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 w-full" role="img" aria-label={t.chartLabel}>
          <defs>
            <linearGradient id="areaUp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#10b981" stopOpacity=".22" />
              <stop offset="1" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="areaDown" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#f43f5e" stopOpacity=".2" />
              <stop offset="1" stopColor="#f43f5e" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0.2, 0.4, 0.6, 0.8].map((t) => (
            <line key={t} x1={PAD.l} x2={W - PAD.r} y1={PAD.t + t * (H - PAD.t - PAD.b)} y2={PAD.t + t * (H - PAD.t - PAD.b)} stroke="#cbd5e1" strokeOpacity=".5" strokeDasharray="3 6" />
          ))}

          {/* пик */}
          {last >= PEAK && (
            <g>
              <line x1={x(PEAK)} x2={W - PAD.r} y1={y(ALL[PEAK])} y2={y(ALL[PEAK])} stroke="#94a3b8" strokeDasharray="4 5" strokeOpacity=".7" />
              <text x={W - PAD.r} y={y(ALL[PEAK]) - 6} textAnchor="end" fontSize="10" fontWeight="700" fill="#64748b">
                {t.peak}
              </text>
            </g>
          )}

          {/* области */}
          <path d={`${path(0, drawnPeak)} L${x(drawnPeak)} ${H - PAD.b} L${x(0)} ${H - PAD.b} Z`} fill="url(#areaUp)" />
          {last > PEAK && (
            <path d={`${path(PEAK, Math.min(last, DROP))} L${x(Math.min(last, DROP))} ${H - PAD.b} L${x(PEAK)} ${H - PAD.b} Z`} fill="url(#areaDown)" />
          )}

          {/* линии */}
          <path d={path(0, drawnPeak)} fill="none" stroke="#10b981" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          {last > PEAK && <path d={path(PEAK, Math.min(last, DROP))} fill="none" stroke="#f43f5e" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />}
          {recovered && <path d={path(DROP, last)} fill="none" stroke="#6366f1" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={choice === "sell" ? "2 6" : undefined} />}

          {/* маркер сделки */}
          {choice === "sell" && (
            <g>
              <circle cx={x(DROP)} cy={y(ALL[DROP])} r="6" fill="#fff" stroke="#f43f5e" strokeWidth="2.5" />
              <text x={x(DROP) - 10} y={y(ALL[DROP]) + 22} textAnchor="end" fontSize="10" fontWeight="800" fill="#e11d48">
                {t.sold}
              </text>
            </g>
          )}

          {/* текущая точка */}
          <g>
            <circle cx={x(last)} cy={y(price)} r="9" fill={pct < -0.05 ? "#f43f5e" : "#10b981"} opacity=".18" className={choice ? "" : "animate-pulse"} />
            <circle cx={x(last)} cy={y(price)} r="4.5" fill="#fff" stroke={pct < -0.05 ? "#f43f5e" : recovered ? "#6366f1" : "#10b981"} strokeWidth="2.5" />
          </g>
        </svg>

        {/* действия */}
        <div className="mt-3 grid grid-cols-2 gap-2.5">
          <button
            type="button"
            disabled={!dropped || !!choice}
            onClick={() => setChoice("sell")}
            className="rounded-xl bg-rose-500 px-4 py-3 text-sm font-extrabold text-white shadow-[0_10px_24px_-10px_rgba(244,63,94,.8)] transition hover:-translate-y-0.5 hover:bg-rose-600 disabled:translate-y-0 disabled:opacity-40 disabled:shadow-none"
          >
            {t.sell}
          </button>
          <button
            type="button"
            disabled={!dropped || !!choice}
            onClick={() => setChoice("hold")}
            className="rounded-xl bg-emerald-500 px-4 py-3 text-sm font-extrabold text-white shadow-[0_10px_24px_-10px_rgba(16,185,129,.8)] transition hover:-translate-y-0.5 hover:bg-emerald-600 disabled:translate-y-0 disabled:opacity-40 disabled:shadow-none"
          >
            {t.hold}
          </button>
        </div>
      </div>

      {/* ИИ-наставник */}
      <div className={`mt-3 w-full transition-opacity duration-500 ${dropped ? "animate-float opacity-100" : "opacity-0"}`}>
      <div
        key={choice ?? "idle"}
        className={`glass relative w-full rounded-2xl p-4 shadow-[0_24px_60px_-20px_rgba(79,70,229,.45)] ${
          dropped ? "animate-pop" : "pointer-events-none"
        }`}
        aria-live="polite"
      >
        <div className="flex gap-3">
          <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
            <Sparkles className="h-5 w-5" />
            <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-400" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-extrabold uppercase tracking-wider text-indigo-600">{t.mentor}</p>
            <p className="mt-1 text-[14.5px] font-semibold leading-snug text-slate-700">{lang === "en" ? "“" : "«"}{ai}{lang === "en" ? "”" : "»"}</p>
            {choice && (
              <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-2">
                <button type="button" onClick={() => setRun((r) => r + 1)} className="inline-flex items-center gap-1.5 text-xs font-extrabold text-indigo-600 transition hover:text-indigo-800">
                  <RotateCcw className="h-3.5 w-3.5" /> {t.replay}
                </button>
                <button
                  type="button"
                  onClick={() => setAnalysisOpen((o) => !o)}
                  aria-expanded={analysisOpen}
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-600 transition hover:text-emerald-800"
                >
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${analysisOpen ? "rotate-180" : ""}`} />
                  {analysisOpen ? t.hide : t.analyze}
                </button>
              </div>
            )}
            {choice && analysisOpen && (
              <div className="animate-pop mt-3 rounded-xl border border-white/70 bg-white/60 p-3 text-[13.5px] leading-snug text-slate-700">
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  {t.analysisOf} {choice === "sell" ? t.quoteSell : t.quoteHold}
                </p>
                <ul className="mt-2 space-y-1.5">
                  {analysis.map((line) => (
                    <li key={line} className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
