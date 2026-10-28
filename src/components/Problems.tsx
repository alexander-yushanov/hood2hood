import { Reveal } from "./ui";
import { useLang } from "../lib/i18n";

const rowsRu = [
  { label: "Кому", value: "Новичкам, которые боятся потерять деньги" },
  { label: "Что это", value: "Симулятор биржи без реальных денег" },
  { label: "Что даёт", value: "Хладнокровие и разбор каждой ошибки" },
];

const rowsEn = [
  { label: "Who it's for", value: "Beginners who are afraid of losing money" },
  { label: "What it is", value: "A stock market simulator with no real money" },
  { label: "What it gives", value: "Composure and a breakdown of every mistake" },
];

export default function Problems() {
  const [lang] = useLang();
  const en = lang === "en";
  const rows = en ? rowsEn : rowsRu;
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
      <Reveal className="max-w-3xl">
        <p className="eyebrow">{en ? "Value" : "Ценность"}</p>
        <h2 className="h2 mt-3">
          {en ? "Practice decisions without risk: AI explains every mistake." : "Тренируйте решения без риска: ИИ объяснит каждую ошибку."}
        </h2>
      </Reveal>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {rows.map((r, i) => (
          <Reveal key={r.label} delay={i * 100}>
            <article className="glass h-full rounded-3xl p-7">
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-indigo-600">{r.label}</p>
              <p className="mt-3 text-[15px] font-semibold leading-relaxed text-slate-700">{r.value}</p>
            </article>
          </Reveal>
        ))}
      </div>
      <Reveal delay={200}>
        <p className="mt-8 max-w-3xl text-base font-semibold leading-relaxed text-slate-700">
          {en
            ? "Demo accounts show the result. We explain why the trade went the way it did."
            : "Демо-счета показывают результат. Мы объясняем, почему сделка прошла именно так."}
        </p>
      </Reveal>
    </section>
  );
}
