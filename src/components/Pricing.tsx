import { useCallback, useEffect, useState } from "react";
import { Check, Crown, X } from "lucide-react";
import { Reveal } from "./ui";
import { useLang } from "../lib/i18n";

export function ProInfoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
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
    <div className="fixed inset-0 z-50 grid place-items-center p-4" role="dialog" aria-modal="true" aria-labelledby="pro-info-title">
      <button type="button" aria-label={en ? "Close dialog" : "Закрыть окно"} onClick={onClose} className="absolute inset-0 animate-fade-in bg-slate-900/35 backdrop-blur-md" />
      <div className="glass relative w-full max-w-md animate-pop overflow-hidden rounded-[28px] p-6 sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label={en ? "Close" : "Закрыть"}
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white/80 text-slate-600 transition hover:rotate-90 hover:text-ink"
        >
          <X className="h-4 w-4" />
        </button>
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-[0_12px_30px_-8px_rgba(79,70,229,.7)]">
          <Crown className="h-7 w-7" />
        </span>
        <h2 id="pro-info-title" className="mt-5 text-2xl font-extrabold leading-tight tracking-tight">
          {en ? "PRO payment is coming soon" : "Оплата PRO скоро появится"}
        </h2>
        <p className="mt-3 text-sm font-semibold leading-relaxed text-slate-600">
          {en
            ? "Payment will be available in the next update. PRO trainers and unlimited simulations are not available yet."
            : "Функция оплаты появится при следующем обновлении. Сейчас PRO-тренажёры и безлимитные симуляции пока недоступны."}
        </p>
        <p className="mt-3 text-sm font-semibold leading-relaxed text-slate-600">
          {en
            ? "Meanwhile, the free “Start” plan is already working: the basic simulator and 10 training trades per day with mistake breakdowns."
            : "А пока бесплатный тариф «Старт» уже работает: базовый симулятор и 10 учебных сделок в день с разбором ошибок."}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3.5 text-base font-extrabold text-white shadow-[0_14px_30px_-10px_rgba(79,70,229,.8)] transition hover:-translate-y-0.5 active:translate-y-0"
        >
          {en ? "Got it" : "Понятно"}
        </button>
      </div>
    </div>
  );
}

const freeEn = ["Access to the basic simulator", "10 training trades per day", "Standard breakdown"];
const proEn = ["Unlimited simulations", "Deep AI analysis of mistakes", "Personal risk-reduction strategy", "Closed community"];

const free = ["Доступ к базовому симулятору", "10 учебных сделок в день", "Стандартный разбор"];
const pro = ["Безлимитные симуляции", "Глубокий психоанализ ошибок от ИИ", "Персональная стратегия снижения риска", "Закрытое комьюнити"];

export default function Pricing() {
  const [proOpen, setProOpen] = useState(false);
  const closePro = useCallback(() => setProOpen(false), []);
  const [lang] = useLang();
  const en = lang === "en";
  const freeList = en ? freeEn : free;
  const proList = en ? proEn : pro;
  return (
    <section id="pricing" className="relative scroll-mt-20 py-16 lg:py-24">
      <div className="pointer-events-none absolute inset-x-0 top-10 -z-10 mx-auto h-72 max-w-3xl rounded-full bg-indigo-200/50 blur-[100px]" aria-hidden />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">{en ? "Pricing" : "Монетизация"}</p>
          <h2 className="h2 mt-3">
            {en
              ? "Free — 10 trades per day. PRO for 1,499 ₽ — no limits and with AI breakdown."
              : "Бесплатно — 10 сделок в день. PRO за 1\u00a0499\u00a0₽ — без лимитов и с разбором ИИ."}
          </h2>
          <p className="mt-4 text-base font-medium text-slate-600">
            {en
              ? "For the trader who wants to train without limits. One payment for PRO, no subscription."
              : "Платит трейдер, который хочет тренироваться без ограничений. Один платёж за PRO, без подписки."}
          </p>
        </Reveal>

        <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2 md:items-stretch">
          <Reveal>
            <article className="glass flex h-full flex-col rounded-[28px] p-8">
              <h3 className="text-lg font-extrabold">{en ? "Start" : "Старт"}</h3>
              <p className="mt-5 flex items-baseline gap-1.5">
                <span className="text-5xl font-extrabold tracking-tight">0 ₽</span>
              </p>
              <p className="mt-2 text-sm font-medium text-slate-500">{en ? "To try it out and feel the market" : "Чтобы попробовать и почувствовать рынок"}</p>
              <ul className="mt-7 flex-1 space-y-3.5">
                {freeList.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-[15px] font-semibold text-slate-700">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-slate-200">
                      <Check className="h-3 w-3 text-slate-600" strokeWidth={3} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <a href="#trainer" className="btn-ghost mt-8 w-full">
                {en ? "Start for free" : "Начать бесплатно"}
              </a>
            </article>
          </Reveal>

          <Reveal delay={120}>
            <article className="relative flex h-full flex-col rounded-[28px] bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-700 p-8 text-white shadow-[0_40px_80px_-30px_rgba(79,70,229,.75)] md:-my-3 md:py-11">
              <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/20 blur-3xl" aria-hidden />
              <div className="relative flex items-center justify-between">
                <h3 className="text-lg font-extrabold">{en ? "PRO Mentor" : "PRO Наставник"}</h3>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-300 px-3 py-1 text-xs font-extrabold text-amber-950">
                  <Crown className="h-3.5 w-3.5" /> {en ? "Hit" : "Хит"}
                </span>
              </div>
              <p className="relative mt-5 flex items-baseline gap-2">
                <span className="whitespace-nowrap text-5xl font-extrabold tracking-tight">1&nbsp;499&nbsp;₽</span>
                <span className="text-sm font-bold text-indigo-100">{en ? "for lifetime" : "на все время"}</span>
              </p>
              <p className="relative mt-2 text-sm font-medium text-indigo-100">{en ? "Full access to the AI psychologist forever" : "Полный доступ к ИИ-психологу навсегда"}</p>
              <ul className="relative mt-7 flex-1 space-y-3.5">
                {proList.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-[15px] font-semibold">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-white/25">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => setProOpen(true)}
                className="relative mt-8 inline-flex w-full items-center justify-center rounded-2xl bg-white px-6 py-3.5 text-[15px] font-extrabold text-indigo-700 shadow-xl shadow-indigo-900/30 transition hover:-translate-y-0.5 hover:bg-indigo-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/60"
              >
                {en ? "Get PRO" : "Подключить PRO"}
              </button>
            </article>
          </Reveal>
        </div>
      </div>
      <ProInfoModal open={proOpen} onClose={closePro} />
    </section>
  );
}
