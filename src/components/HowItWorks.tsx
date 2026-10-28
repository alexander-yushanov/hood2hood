import { Activity, MousePointerClick, Sparkles } from "lucide-react";
import { Reveal } from "./ui";
import { useLang } from "../lib/i18n";

const stepsRu = [
  { n: "01", icon: MousePointerClick, title: "Заходишь в тренажёр", text: "Открываешь любой из 13 сценариев с виртуальными 100 000 ₽ на исторических графиках." },
  { n: "02", icon: Activity, title: "Выбираешь решение", text: "Покупаешь, продаёшь или ждёшь. ИИ замечает паническую или жадную сделку по твоим действиям." },
  { n: "03", icon: Sparkles, title: "Получаешь разбор", text: "Видишь, сколько сэкономил или потерял, и почему решение сработало или подвело." },
];

const stepsEn = [
  { n: "01", icon: MousePointerClick, title: "Enter the trainer", text: "Open any of 13 scenarios with virtual 100,000 ₽ on historical charts." },
  { n: "02", icon: Activity, title: "Choose a decision", text: "Buy, sell or wait. AI spots a panicked or greedy trade from your actions." },
  { n: "03", icon: Sparkles, title: "Get a breakdown", text: "See how much you saved or lost, and why the decision worked or fell short." },
];

export default function HowItWorks() {
  const [lang] = useLang();
  const en = lang === "en";
  const steps = en ? stepsEn : stepsRu;
  return (
    <section id="how" className="relative scroll-mt-20 py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[36px] bg-slate-900 px-5 py-12 text-white sm:px-10 lg:px-14 lg:py-16">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-500/40 blur-[90px]" aria-hidden />
          <div className="pointer-events-none absolute -bottom-24 left-10 h-64 w-64 rounded-full bg-emerald-400/25 blur-[90px]" aria-hidden />

          <Reveal className="relative max-w-2xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-indigo-200">{en ? "How it works" : "Как это работает"}</p>
            <h2 className="h2 mt-3">
              {en ? "Three steps: enter, choose, get a breakdown" : "Три шага: заходишь, выбираешь, получаешь разбор"}
            </h2>
          </Reveal>

          <div className="relative mt-12 grid gap-5 md:grid-cols-3">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 120}>
                <article className="h-full rounded-3xl border border-white/10 bg-white/[0.06] p-7 backdrop-blur-xl transition duration-300 hover:-translate-y-1.5 hover:bg-white/[0.1]">
                  <div className="flex items-start justify-between">
                    <span className="text-6xl font-extrabold leading-none tracking-tighter text-white">{s.n}</span>
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 shadow-lg shadow-indigo-900/40">
                      <s.icon className="h-5 w-5" />
                    </span>
                  </div>
                  <h3 className="mt-8 text-xl font-extrabold tracking-tight">{s.title}</h3>
                  <p className="mt-2.5 text-[15px] font-medium leading-relaxed text-slate-300">{s.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
