import { useState } from "react";
import { Brain, Sparkles } from "lucide-react";
import type { Coach as CoachMsg } from "./useGame";
import { useLang } from "../lib/i18n";

const TONE = {
  warn: "text-rose-600 bg-rose-50 border-rose-100",
  good: "text-emerald-700 bg-emerald-50 border-emerald-100",
  info: "text-indigo-700 bg-indigo-50 border-indigo-100",
} as const;

type Props = { msg: CoachMsg | null; idle: boolean; cool: number };

export default function Coach({ msg, idle, cool }: Props) {
  const [showMath, setShowMath] = useState(false);
  const [lang] = useLang();
  const en = lang === "en";

  return (
    <div className="glass flex h-full flex-col rounded-[24px] p-5">
      <div className="flex items-center gap-3">
        <span className="relative grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
          <Brain className="h-5 w-5" />
          <span className="absolute inset-0 -z-10 animate-ping2 rounded-2xl bg-indigo-400/40" aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-extrabold leading-none">{en ? "AI mentor" : "ИИ-наставник"}</p>
          <p className="mt-1 text-[11px] font-semibold text-slate-500">{en ? "AI reads your pulse and click timing…" : "ИИ считывает твой пульс и тайминг кликов…"}</p>
        </div>
        <span className="ml-auto rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-extrabold text-emerald-700">{en ? "online" : "онлайн"}</span>
      </div>

      <div className="mt-4 flex-1 space-y-3" aria-live="polite">
        {idle || !msg ? (
          <div className="rounded-2xl border border-slate-100 bg-white/70 p-4 text-sm font-semibold leading-relaxed text-slate-600">
            {en
              ? "Make your first move — buy, sell or pause. I'll comment on every decision and point out where emotions took over."
              : "Сделай первый ход — покупку, продажу или паузу. Я буду комментировать каждое решение и подскажу, где сработали эмоции."}
          </div>
        ) : (
          <div key={msg.text} className={`animate-pop rounded-2xl border p-4 text-[14.5px] font-semibold leading-snug ${TONE[msg.tone]}`}>
            <Sparkles className="mb-1.5 h-4 w-4" />
            {msg.text}
          </div>
        )}

        {showMath && msg && (
          <div className="animate-pop rounded-2xl border border-slate-200 bg-white p-4 text-sm font-medium leading-relaxed text-slate-700">
            <p className="mb-1 text-xs font-extrabold uppercase tracking-wider text-slate-500">{en ? "Math" : "Математика"}</p>
            {msg.math}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-200/70 pt-4">
        <p className="text-xs font-bold text-slate-500">{en ? "Composure" : "Хладнокровие"}: <span className="text-slate-800">{cool}%</span></p>
        <button
          type="button"
          disabled={!msg}
          onClick={() => setShowMath((v) => !v)}
          className="rounded-xl bg-ink px-3.5 py-2 text-xs font-extrabold text-white transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-40"
        >
          {showMath ? (en ? "Hide breakdown" : "Скрыть разбор") : (en ? "Explain the math of the mistake" : "Объяснить математику ошибки")}
        </button>
      </div>
    </div>
  );
}
