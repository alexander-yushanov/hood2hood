import { Activity } from "lucide-react";
import type { Counts, Entry } from "./useGame";
import { useLang } from "../lib/i18n";

const KIND = {
  buy: { label: "Купить", labelEn: "Buy", cls: "bg-emerald-100 text-emerald-700" },
  sell: { label: "Продать", labelEn: "Sell", cls: "bg-rose-100 text-rose-600" },
  hold: { label: "Переждать", labelEn: "Hold", cls: "bg-indigo-100 text-indigo-700" },
} as const;

type Props = { log: Entry[]; counts: Counts };

export default function Feed({ log, counts }: Props) {
  const [lang] = useLang();
  const en = lang === "en";
  const total = counts.panic + counts.greed + counts.calm || 1;
  const bars = [
    { label: en ? "Panic" : "Паника", val: Math.round((counts.panic / total) * 100), bar: "bg-rose-500" },
    { label: en ? "Greed" : "Жадность", val: Math.round((counts.greed / total) * 100), bar: "bg-amber-500" },
    { label: en ? "Calm" : "Расчёт", val: Math.round((counts.calm / total) * 100), bar: "bg-emerald-500" },
  ];

  return (
    <section className="grid gap-6 md:grid-cols-[1.4fr_1fr]">
      <div className="glass rounded-[24px] p-5">
        <div className="mb-4 flex items-center gap-2">
          <Activity className="h-4 w-4 text-indigo-600" />
          <h2 className="text-sm font-extrabold">{en ? "Live move feed" : "Live-лента ходов"}</h2>
        </div>
        {log.length === 0 ? (
          <p className="rounded-xl bg-white/70 p-4 text-sm font-semibold text-slate-500">{en ? "No moves yet. Your history will appear here." : "Ходов пока нет. Твоя история появится здесь."}</p>
        ) : (
          <ul className="space-y-2">
            {[...log].reverse().map((e) => (
              <li key={e.n} className="animate-pop flex items-center gap-3 rounded-xl bg-white/70 px-3 py-2.5 text-sm">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-slate-900 text-[11px] font-extrabold text-white">{e.n}</span>
                <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-extrabold ${KIND[e.kind].cls}`}>{en ? KIND[e.kind].labelEn : KIND[e.kind].label}</span>
                <span className="min-w-0 flex-1 truncate font-semibold text-slate-700">{e.text}</span>
                <span className="shrink-0 tabular-nums font-bold text-slate-500">{e.price.toFixed(1).replace(".", ",")} ₽</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="glass rounded-[24px] p-5">
        <h2 className="text-sm font-extrabold">Эмоциональный профиль игрока</h2>
        <div className="mt-4 space-y-4">
          {bars.map((b) => (
            <div key={b.label}>
              <div className="mb-1.5 flex justify-between text-xs font-bold">
                <span className="text-slate-600">{b.label}</span>
                <span className="tabular-nums text-slate-800">{b.val}%</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-slate-200/80">
                <div className={`h-full rounded-full transition-all duration-700 ${b.bar}`} style={{ width: `${b.val}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
