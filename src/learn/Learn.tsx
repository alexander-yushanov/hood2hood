import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Lock, Star } from "lucide-react";
import { Logo } from "../components/ui";
import { GAMES, type GameCard } from "./games";
import ProModal from "./ProModal";
import { useProfile } from "../profile/profileStore";
import LangToggle from "../components/LangToggle";
import { useLang } from "../lib/i18n";
import { LEARN_EN, GAMES_EN } from "./learnEn";

const iconBg: Record<GameCard["accent"], string> = {
  emerald: "from-emerald-400 to-emerald-600",
  indigo: "from-indigo-500 to-indigo-700",
  rose: "from-rose-400 to-rose-600",
  violet: "from-violet-500 to-fuchsia-600",
  amber: "from-amber-400 to-orange-500",
  sky: "from-sky-400 to-cyan-600",
};

function Stars({ level, en }: { level: number; en: boolean }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={en ? LEARN_EN.difficulty(level) : `Сложность ${level} из 3`}>
      {[1, 2, 3].map((i) => (
        <Star key={i} className={`h-4 w-4 ${i <= level ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
      ))}
      <span className="ml-2 text-xs font-bold text-slate-500">
        {en
          ? LEARN_EN.levels[level - 1]
          : level === 1
            ? "Легко"
            : level === 2
              ? "Средне"
              : "Сложно"}
      </span>
    </div>
  );
}

export default function Learn() {
  const [lang] = useLang();
  const en = lang === "en";
  const [proOpen, setProOpen] = useState(false);
  const closePro = useCallback(() => setProOpen(false), []);
  const proTrial = useProfile().proTrial;

  // При открытии центра обучения показываем первые игры, а не место прокрутки предыдущей страницы.
  useEffect(() => {
    document.getElementById("games")?.scrollIntoView({ behavior: "auto", block: "start" });
  }, []);

  const onPlay = (g: GameCard) => {
    if (g.pro && !proTrial) setProOpen(true);
    else window.location.hash = `#/learn/${g.id}`;
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
        <div className="absolute -left-40 top-0 h-[460px] w-[460px] rounded-full bg-indigo-300/30 blur-[120px]" />
        <div className="absolute right-[-120px] top-40 h-[420px] w-[420px] rounded-full bg-emerald-200/50 blur-[120px]" />
      </div>

      <header className="sticky top-0 z-40 px-3 pt-3 sm:px-6">
        <div className="glass mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-2xl px-3 py-2.5 sm:px-4">
          <div className="flex items-center gap-2">
            <a
              href="#/"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white/80 transition hover:-translate-y-0.5 sm:w-auto sm:px-3"
              aria-label={en ? LEARN_EN.home : "На главную"}
            >
              <ArrowLeft className="h-4 w-4 sm:mr-1.5" />
              <span className="hidden text-sm font-bold sm:inline">{en ? LEARN_EN.home : "На главную"}</span>
            </a>
          </div>
          <Logo />
          <div className="flex items-center gap-2">
            <LangToggle />
            <a
              href="#/textbook"
              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl border border-slate-200 bg-white/80 px-2.5 py-2 text-xs font-bold transition hover:-translate-y-0.5 sm:px-4 sm:py-2.5 sm:text-sm"
            >
              {en ? LEARN_EN.textbook : "Учебник"}
            </a>
            <a
              href="#/game"
              className="group hidden items-center gap-1.5 rounded-xl bg-ink px-4 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 sm:inline-flex"
            >
              {en ? LEARN_EN.simulator : "Симулятор"}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto mt-8 max-w-7xl px-4 sm:px-6">
        <section className="max-w-2xl">
          <p className="eyebrow">{en ? LEARN_EN.eyebrow : "Центр обучения"}</p>
          <h1 className="mt-3 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
            {en ? LEARN_EN.title : "Тренажёрный зал твоего капитала"}
          </h1>
          <p className="mt-4 text-base font-semibold leading-relaxed text-slate-600 sm:text-lg">
            {en
              ? LEARN_EN.lead(GAMES.length)
              : `${GAMES.length} коротких игр на виртуальных деньгах. Каждая тренирует одно решение: как не паниковать, не жадничать и считать риск.`}
          </p>
        </section>

        <section id="games" aria-label="Игры" className="mt-10 grid scroll-mt-28 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {GAMES.map((g, i) => {
            const t = en ? GAMES_EN[g.id] ?? { title: g.title, description: g.description } : { title: g.title, description: g.description };
            return (
            <article
              key={g.id}
              className="glass group relative flex flex-col rounded-[24px] p-5 transition duration-300 hover:-translate-y-1 sm:p-6"
              style={{ animation: `fade-up .6s cubic-bezier(.2,.8,.2,1) ${i * 70}ms both` }}
            >
              <div className="flex items-start justify-between gap-3">
                <span className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br text-white shadow-lg ${iconBg[g.accent]}`}>
                  <Star className="h-5 w-5 fill-white/30" />
                </span>
                {g.pro ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide text-white">
                    <Lock className="h-3 w-3" /> {en ? LEARN_EN.pro : "PRO"}
                  </span>
                ) : (
                  <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide text-emerald-700">
                    {en ? LEARN_EN.free : "Бесплатно"}
                  </span>
                )}
              </div>

              <h2 className="mt-5 text-xl font-extrabold tracking-tight">{t.title}</h2>
              <p className="mt-2 flex-1 text-sm font-semibold leading-relaxed text-slate-600">{t.description}</p>

              <div className="mt-5 flex items-center justify-between gap-3">
                <Stars level={g.difficulty} en={en} />
              </div>

              <button
                type="button"
                onClick={() => onPlay(g)}
                className={`mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-extrabold transition duration-200 active:scale-[0.98] ${
                  g.pro
                    ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-[0_12px_28px_-10px_rgba(79,70,229,.8)] hover:-translate-y-0.5 hover:shadow-[0_16px_34px_-10px_rgba(79,70,229,.9)]"
                    : "bg-ink text-white hover:-translate-y-0.5 hover:bg-slate-800"
                }`}
              >
                {g.pro && <Lock className="h-4 w-4" />}
                {en ? LEARN_EN.play : "Играть"}
              </button>
            </article>
            );
          })}
        </section>
      </main>

      <ProModal open={proOpen} onClose={closePro} />
    </div>
  );
}
