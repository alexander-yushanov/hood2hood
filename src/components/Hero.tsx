import { ArrowRight, Play } from "lucide-react";
import TradeWidget from "./TradeWidget";
import { useLang } from "../lib/i18n";

export default function Hero() {
  const [lang] = useLang();
  const en = lang === "en";
  return (
    <section id="top" className="relative overflow-hidden pt-24 sm:pt-28">
      {/* фон */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="absolute -left-40 top-0 h-[460px] w-[460px] rounded-full bg-indigo-300/40 blur-[110px]" />
        <div className="absolute right-[-120px] top-24 h-[400px] w-[400px] rounded-full bg-emerald-200/60 blur-[110px]" />
        <div
          className="absolute inset-0 opacity-[0.5]"
          style={{
            backgroundImage: "radial-gradient(#c7cfe3 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            maskImage: "linear-gradient(to bottom, black 0%, transparent 75%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 0%, transparent 75%)",
          }}
        />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-12 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10 lg:pb-16">
        <div>
          <span className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-bold text-slate-700">
            {en ? "13 trainers · 100,000 ₽ of virtual capital" : "13 тренажёров · 100 000 ₽ виртуального капитала"}
          </span>
          <h1 className="mt-5 text-[34px] font-extrabold leading-[1.06] tracking-tight sm:text-[48px] lg:text-[54px]">
            {en ? (
              <>
                Trade calmly: learn <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500 bg-clip-text text-transparent">not to panic</span> during drawdowns
              </>
            ) : (
              <>
                Торгуй спокойно: учись <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-emerald-500 bg-clip-text text-transparent">не паниковать</span> на просадках
              </>
            )}
          </h1>
          <p className="mt-5 max-w-xl text-base font-medium leading-relaxed text-slate-600 sm:text-lg">
            {en
              ? "Practice your decisions with virtual 100,000 ₽: AI breaks down every emotional trade"
              : "Тренируй решения на виртуальных 100 000 ₽: ИИ разберёт каждую эмоциональную сделку"}
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a href="#/game" className="btn-primary group">
              {en ? "Start training for free" : "Начать тренировку бесплатно"}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </a>
            <a href="#trainer" className="btn-ghost group">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-ink text-white">
                <Play className="ml-0.5 h-3 w-3 fill-current" />
              </span>
              {en ? "Watch demo" : "Смотреть демо"}
            </a>
          </div>
        </div>

        <div id="trainer" className="scroll-mt-28 lg:col-span-2">
          <TradeWidget />
          <p className="mt-5 text-center text-xs font-semibold text-slate-500">
            {en
              ? "This is a live demo: press “Sell now” or “Wait” and see what the mentor says."
              : "Это живое демо: нажми «Продать сейчас» или «Переждать» и посмотри, что скажет наставник."}
          </p>
        </div>
      </div>
    </section>
  );
}
