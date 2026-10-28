import { useState } from "react";
import { Plus } from "lucide-react";
import { Reveal } from "./ui";
import { useLang } from "../lib/i18n";

const faqRu = [
  { q: "Я рискую реальными деньгами?", a: "Нет, симулятор использует виртуальный капитал." },
  { q: "Как ИИ понимает мои эмоции?", a: "Алгоритм анализирует тайминги нажатий, резкие закрытия позиций в минус и импульсивные докупки." },
  { q: "Нужен ли опыт, чтобы начать?", a: "Нет. Тренажёр рассчитан на новичков: наставник объясняет каждую сделку простым языком, без сложных терминов." },
  { q: "Это инвестиционная рекомендация?", a: "Нет. Платформа носит учебный характер и не даёт индивидуальных инвестиционных советов." },
];

const faqEn = [
  { q: "Do I risk real money?", a: "No, the simulator uses virtual capital." },
  { q: "How does AI understand my emotions?", a: "The algorithm analyzes click timing, sharp closes at a loss and impulsive add-ons." },
  { q: "Do I need experience to start?", a: "No. The trainer is built for beginners: the mentor explains every trade in plain language, without complex jargon." },
  { q: "Is this investment advice?", a: "No. The platform is educational and does not give individual investment recommendations." },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const [lang] = useLang();
  const en = lang === "en";
  const faq = en ? faqEn : faqRu;

  return (
    <section id="faq" className="scroll-mt-20 py-16 lg:py-24">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <Reveal>
          <p className="eyebrow">FAQ</p>
          <h2 className="h2 mt-3">{en ? "Frequently asked questions" : "Частые вопросы"}</h2>
          <p className="mt-4 max-w-sm text-base font-medium text-slate-600">
            {en ? "The essentials in brief. The mentor will explain the rest right in the trainer." : "Коротко о главном. Остальное наставник объяснит прямо в тренажёре."}
          </p>
        </Reveal>

        <div className="space-y-3">
          {faq.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={f.q} delay={i * 70}>
                <div className={`glass rounded-2xl transition duration-300 ${isOpen ? "bg-white/90 shadow-[0_24px_50px_-24px_rgba(79,70,229,.4)]" : ""}`}>
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-${i}`}
                      className="flex w-full items-center justify-between gap-4 rounded-2xl px-5 py-5 text-left text-base font-extrabold focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200 sm:px-6 sm:text-lg"
                    >
                      {f.q}
                      <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition duration-300 ${isOpen ? "rotate-45 bg-indigo-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                        <Plus className="h-4 w-4" />
                      </span>
                    </button>
                  </h3>
                  <div id={`faq-${i}`} className={`grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-[15px] font-medium leading-relaxed text-slate-600 sm:px-6">{f.a}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
