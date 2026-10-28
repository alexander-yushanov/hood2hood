import { useEffect } from "react";
import { Check, Crown, X } from "lucide-react";
import { PRO_PRICE } from "./games";
import { useLang } from "../lib/i18n";
import { LEARN_EN } from "./learnEn";

type Props = { open: boolean; onClose: () => void };

const perks = [
  "Безлимит сделок в каждом тренажёре",
  "Разбор каждой ошибки от ИИ-психолога",
  "Сертификат о прохождении курса",
];

export default function ProModal({ open, onClose }: Props) {
  const [lang] = useLang();
  const en = lang === "en";
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pro-modal-title"
    >
      <button
        type="button"
        aria-label={en ? LEARN_EN.closeDialog : "Закрыть окно"}
        onClick={onClose}
        className="absolute inset-0 animate-fade-in bg-slate-900/35 backdrop-blur-md"
      />
      <div className="glass relative w-full max-w-md animate-pop overflow-hidden rounded-[28px] p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 opacity-20 blur-3xl" aria-hidden />

        <button
          type="button"
          onClick={onClose}
          aria-label={en ? LEARN_EN.close : "Закрыть"}
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white/80 text-slate-600 transition hover:rotate-90 hover:text-ink"
        >
          <X className="h-4 w-4" />
        </button>

        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-[0_12px_30px_-8px_rgba(79,70,229,.7)]">
          <Crown className="h-7 w-7" />
        </span>

        <h2 id="pro-modal-title" className="mt-5 text-2xl font-extrabold leading-tight tracking-tight">
          {en ? LEARN_EN.proOnly : "Этот тренажёр доступен только в PRO-версии"}
        </h2>
        <p className="mt-2 text-sm font-semibold text-slate-500">{en ? LEARN_EN.proIntro : "Открой все игры и личного ИИ-наставника."}</p>

        <ul className="mt-5 space-y-2.5">
          {(en ? LEARN_EN.proPerks : perks).map((p) => (
            <li key={p} className="flex items-start gap-3 rounded-2xl bg-white/70 px-4 py-3 text-sm font-semibold text-slate-700">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-500 text-white">
                <Check className="h-3 w-3" />
              </span>
              {p}
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-2xl border border-slate-200 bg-white/80 px-6 py-3 text-sm font-extrabold text-slate-700 transition hover:bg-white"
        >
          {en ? LEARN_EN.close : "Закрыть"}
        </button>
        <p className="mt-3 text-center text-[11px] font-semibold text-slate-400">
          {en
            ? LEARN_EN.proPayment
            : "Оплата пока не подключена. Пробный доступ один раз бесплатно. Учебный симулятор, не инвестиционная рекомендация."}
        </p>
      </div>
    </div>
  );
}
