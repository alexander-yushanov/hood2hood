import { Crown, RotateCcw, Sparkles } from "lucide-react";
import { START_CASH, fmtRub, fmtSigned } from "./scenarios";
import type { Counts } from "./useGame";

type Props = { result: number; counts: Counts; onRetry: () => void; onPro: () => void };

function typeOf(c: Counts) {
  const total = c.panic + c.greed + c.calm || 1;
  if (c.greed / total > 0.4) return { name: "Азартный охотник", tip: "Ты покупал на росте и быстро набирал позицию. Перед входом задавай себе один вопрос: что изменится, если цена пойдёт вниз на 10%?" };
  if (c.panic / total > 0.4) return { name: "Импульсивный стратег", tip: "Ты принимаешь решения на резких движениях. Заранее пропиши план: при каком падении продаёшь, а при каком докупаешь. Тогда график не будет решать за тебя." };
  return { name: "Спокойный аналитик", tip: "Ты умеешь ждать. Чтобы закрепить навык, попробуй уровень «Коррекция −12%» и отметь, как меняется твой пульс перед кнопкой." };
}

export default function ResultModal({ result, counts, onRetry, onPro }: Props) {
  const t = typeOf(counts);
  const positive = result >= 0;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/30 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Конец тренировки">
      <div className="glass animate-pop max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-[28px] p-6 sm:p-8">
        <p className="eyebrow">Конец тренировки</p>
        <h2 className="mt-2 text-2xl font-extrabold tracking-tight">Итог: 5 ходов</h2>

        <div className="mt-5 rounded-2xl bg-white/70 p-5 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Финансовый результат</p>
          <p className={`mt-1 text-4xl font-extrabold tabular-nums ${positive ? "text-emerald-600" : "text-rose-600"}`}>{fmtSigned(result)}</p>
          <p className="mt-1 text-xs font-semibold text-slate-500">от стартового капитала {fmtRub(START_CASH)}</p>
        </div>

        <div className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-5">
          <p className="flex items-center gap-2 text-sm font-extrabold text-indigo-700">
            <Sparkles className="h-4 w-4" /> Оценка ИИ: «Твой тип: {t.name}»
          </p>
          <p className="mt-2 text-sm font-semibold leading-relaxed text-slate-700">{t.tip}</p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button type="button" onClick={onRetry} className="btn-ghost w-full">
            <RotateCcw className="h-4 w-4" /> Пройти уровень заново
          </button>
          <button type="button" onClick={onPro} className="btn-primary w-full">
            <Crown className="h-4 w-4" /> Разблокировать PRO-аналитику за 1&nbsp;499&nbsp;₽
          </button>
        </div>
      </div>
    </div>
  );
}
