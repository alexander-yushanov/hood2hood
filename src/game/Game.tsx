import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, Crown, Lock, Minus, Plus, TrendingDown, TrendingUp } from "lucide-react";
import { Logo } from "../components/ui";
import { FREE_TRADES_TOTAL, LEVELS, LOT, MAX_BALANCE, MOVES, START_CASH, fmtPct, fmtRub, fmtSigned, type Level } from "./scenarios";
import { equityOf, priceAt, useGame, type Kind, type SavedBalance } from "./useGame";
import PriceChart from "./PriceChart";
import Coach from "./Coach";
import Feed from "./Feed";
import ResultModal from "./ResultModal";
import { useAuth, saveTrainingResult } from "../auth/session";
import { useProfile, updateProfile } from "../profile/profileStore";
import { ProInfoModal } from "../components/Pricing";
import LangToggle from "../components/LangToggle";
import { useLang } from "../lib/i18n";
import { GAME_EN } from "./gameEn";

export default function Game() {
  const auth = useAuth();
  const profile = useProfile();
  const signedIn = Boolean(auth.user);
  const [lang] = useLang();
  if (!auth.ready || (signedIn && !profile.loaded)) {
    return <div className="grid min-h-screen place-items-center text-sm font-bold text-slate-500">{lang === "en" ? GAME_EN.loading : "Загружаем баланс…"}</div>;
  }
  // key по аккаунту: при смене пользователя симулятор создаётся заново с его собственным балансом.
  return <GameBoard key={auth.user?.id ?? "guest"} signedIn={signedIn} savedBalance={signedIn ? profile.simBalance : guestBalance} />;
}

const NOTICE_TITLE = {
  over: "Баланс превышен",
  broke: "Деньги закончились",
  noTrades: "Сделки закончились",
} as const;

const NOTICE_TITLE_EN = {
  over: GAME_EN.noticeOver,
  broke: GAME_EN.noticeBroke,
  noTrades: GAME_EN.noticeNoTrades,
} as const;

// Гостевой баланс и счётчик сделок живут в памяти вкладки: переживают выход из симулятора,
// но сбрасываются при обновлении страницы (гостевые результаты не сохраняются).
let guestBalance: SavedBalance | null = null;

// Гость получает стартовый баланс каждый раз (в памяти вкладки); аккаунт — баланс из профиля.
function GameBoard({ signedIn, savedBalance }: { signedIn: boolean; savedBalance: SavedBalance | null }) {
  const onBalance = (b: SavedBalance) => {
    if (!signedIn) {
      guestBalance = b;
      return;
    }
    updateProfile({ simBalance: b }).catch(() => undefined);
  };
  const { state, dispatch } = useGame(savedBalance, onBalance, 1);
  const [qty, setQty] = useState(1);
  const pro = useProfile().proTrial;
  const [proOpen, setProOpen] = useState(false);
  const [lang] = useLang();
  const en = lang === "en";
  const savedRound = useRef(false);

  // Результат тренировки сохраняем один раз при завершении, только для аккаунта.
  useEffect(() => {
    if (state.move >= MOVES && signedIn && !savedRound.current) {
      savedRound.current = true;
      void saveTrainingResult({
        game_id: `sim-level-${state.levelId}`,
        result_rub: equityOf(state) - START_CASH,
        details: { counts: state.counts, cool: state.cool },
      });
    }
    if (state.move < MOVES) savedRound.current = false;
  }, [state.move, signedIn, state.levelId, state.counts, state.cool]);
  const level: Level = LEVELS[state.levelId - 1];
  const price = priceAt(level, state.move);
  const start = level.series[0];
  const changePct = ((price - start) / start) * 100;
  const result = equityOf(state) - START_CASH;
  const finished = state.move >= MOVES;
  const freeLeft = Math.max(0, state.freeLeft);
  const trade = (kind: Kind) => dispatch({ type: "trade", kind, qty, en });
  // Кнопки не блокируем при 0 сделок: клик должен открыть окно «Сделки закончились».
  const blocked = finished || state.broke;
  const chooseLevel = (l: Level) => {
    if (l.locked && !pro) return;
    dispatch({ type: "level", id: l.id });
  };

  return (
    <div className="min-h-screen pb-16">
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
        <div className="absolute -left-40 top-0 h-[460px] w-[460px] rounded-full bg-indigo-300/30 blur-[120px]" />
        <div className="absolute right-[-120px] top-40 h-[420px] w-[420px] rounded-full bg-emerald-200/50 blur-[120px]" />
      </div>

      {/* Верхняя панель */}
      <header className="sticky top-0 z-40 px-3 pt-3 sm:px-6">
        <div className="glass mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-3 rounded-2xl px-3 py-2.5 sm:px-4">
          <div className="flex items-center gap-2">
            <a href="#/" className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white/80 transition hover:-translate-y-0.5 sm:w-auto sm:px-3" aria-label="На главную">
              <ArrowLeft className="h-4 w-4 sm:mr-1.5" />
              <span className="hidden text-sm font-bold sm:inline">На главную</span>
            </a>
            <div className="hidden md:block">
              <Logo />
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <div className="rounded-xl bg-ink px-3 py-1.5 text-center text-white">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-300">{en ? GAME_EN.balance : "Баланс"}</p>
              <p className="text-sm font-extrabold tabular-nums sm:text-base">{fmtRub(equityOf(state))}</p>
            </div>
            <div className="hidden items-center gap-1.5 rounded-xl bg-violet-100 px-3 py-2 text-xs font-extrabold text-violet-700 sm:inline-flex">
              {en ? GAME_EN.coolLabel : "Уровень хладнокровия"}: {state.cool}% 🧠
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <LangToggle className="h-10 px-2.5" />
            <div className="hidden rounded-xl bg-white/80 px-3 py-2 text-xs font-extrabold text-slate-700 sm:block">
              {freeLeft} / {FREE_TRADES_TOTAL} {en ? GAME_EN.freeToday : "сегодня"}
            </div>
            <button
              type="button"
              onClick={() => setProOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-2.5 text-xs font-extrabold text-white shadow-[0_10px_24px_-10px_rgba(79,70,229,.8)] transition hover:-translate-y-0.5"
            >
              <Crown className="h-3.5 w-3.5" /> <span className="hidden sm:inline">{en ? GAME_EN.buyPro : "Оформить PRO"}</span>
            </button>
          </div>
        </div>
        <p className="mx-auto mt-1.5 max-w-7xl px-1 text-center text-[11px] font-semibold text-slate-500 sm:hidden">
          {en ? GAME_EN.coolShort(state.cool) : `Хладнокровие ${state.cool}% · осталось сделок ${freeLeft}/${FREE_TRADES_TOTAL}`}
        </p>
      </header>

      <main className="mx-auto mt-6 max-w-7xl space-y-6 px-4 sm:px-6">
        {/* Выбор уровня */}
        <section aria-label="Выбор сценария" className="grid gap-3 md:grid-cols-3">
          {LEVELS.map((l) => {
            const active = l.id === state.levelId;
            const locked = l.locked && !pro;
            const sceneTitle = en ? GAME_EN.scenarioNames[l.id - 1] : l.title;
            const sceneSub = en ? GAME_EN.scenarioSubs[l.id - 1] : l.subtitle;
            return (
              <button
                key={l.id}
                type="button"
                onClick={() => chooseLevel(l)}
                disabled={locked}
                className={`glass group relative flex items-start gap-3 rounded-2xl p-4 text-left transition duration-200 active:scale-[0.98] ${
                  active ? "ring-2 ring-indigo-500 ring-offset-2 ring-offset-[#f5f7fb]" : "hover:-translate-y-0.5"
                } ${locked ? "cursor-not-allowed opacity-70" : ""}`}
              >
                <span
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white ${
                    l.id === 1 ? "bg-emerald-500" : l.id === 2 ? "bg-rose-500" : "bg-violet-600"
                  }`}
                >
                  {locked ? <Lock className="h-4 w-4" /> : l.id === 1 ? <TrendingUp className="h-5 w-5" /> : l.id === 2 ? <TrendingDown className="h-5 w-5" /> : <Crown className="h-5 w-5" />}
                </span>
                <span className="min-w-0 pr-14">
                  <span className="block text-sm font-extrabold leading-snug">{sceneTitle}</span>
                  <span className="mt-0.5 block text-xs font-semibold text-slate-500">{sceneSub}</span>
                </span>
                {active && <span className="absolute right-3 top-3 rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-extrabold text-white">{en ? GAME_EN.active : "Активен"}</span>}
                {l.id === 2 && !active && <span className="absolute right-3 top-3 rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-extrabold text-rose-600">{en ? GAME_EN.hit : "Хит"}</span>}
                {locked && <span className="absolute right-3 top-3 rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-extrabold text-white">PRO</span>}
              </button>
            );
          })}
        </section>

        {/* Арена */}
        <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="glass rounded-[28px] p-4 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-indigo-600">{en ? GAME_EN.stock : "Сценарий «Паника на новостях»"}</p>
                <p className="mt-2 text-3xl font-extrabold tabular-nums sm:text-4xl">{price.toFixed(2).replace(".", ",")} ₽</p>
              </div>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-extrabold tabular-nums ${
                  changePct < 0 ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-600"
                }`}
              >
                {changePct < 0 ? <TrendingDown className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
                {fmtPct(changePct)}
              </span>
            </div>

            <div className="mt-4 rounded-2xl bg-white/60 p-2">
              <PriceChart series={level.series} move={state.move} start={start} />
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
              <div>
                <p className="mb-2 text-xs font-extrabold uppercase tracking-wider text-slate-500">{en ? GAME_EN.lotsLabel(LOT) : `Количество лотов (1 лот = ${LOT} акций)`}</p>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-white transition active:scale-90" aria-label={en ? GAME_EN.less : "Меньше"}>
                    <Minus className="h-4 w-4" />
                  </button>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={qty}
                    onChange={(e) => setQty(Math.min(99, Math.max(1, Number(e.target.value) || 1)))}
                    className="h-11 w-20 rounded-xl border border-slate-200 bg-white text-center text-base font-extrabold tabular-nums focus:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                  />
                  <button type="button" onClick={() => setQty((q) => Math.min(99, q + 1))} className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-white transition active:scale-90" aria-label={en ? GAME_EN.more : "Больше"}>
                    <Plus className="h-4 w-4" />
                  </button>
                  <p className="ml-2 text-sm font-bold text-slate-600">
                    {en ? GAME_EN.sum : "Сумма:"} <span className="tabular-nums text-ink">{fmtRub(qty * LOT * price)}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2.5">
              <ActionBtn tone="buy" disabled={blocked} onClick={() => trade("buy")}>{en ? GAME_EN.buy : "🟢 Купить"}</ActionBtn>
              <ActionBtn tone="sell" disabled={blocked || state.lots <= 0} onClick={() => trade("sell")}>{en ? GAME_EN.sellAll : "🔴 Продать всё"}</ActionBtn>
              <ActionBtn tone="hold" disabled={blocked} onClick={() => trade("hold")}>{en ? GAME_EN.hold : "⏳ Переждать"}</ActionBtn>
            </div>
            <p className="mt-3 text-xs font-semibold text-slate-500">
              {en ? GAME_EN.moveOf(state.move, MOVES) : `Ход ${state.move} из ${MOVES}.`} {en ? GAME_EN.position : "Позиция:"} {state.lots * LOT}{" "}
              {en ? GAME_EN.shares : "акций"}, {en ? GAME_EN.result : "результат"}{" "}
              <span className={`tabular-nums font-extrabold ${result < 0 ? "text-rose-600" : result > 0 ? "text-emerald-600" : "text-slate-700"}`}>{fmtSigned(result)}</span>.
            </p>
          </div>

          <div className="lg:sticky lg:top-28 lg:self-start">
            <Coach msg={state.coach} idle={state.move === 0} cool={state.cool} />
          </div>
        </section>

        <Feed log={state.log} counts={state.counts} />
      </main>

      {state.notice && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/30 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={NOTICE_TITLE[state.notice]}>
          <div className="glass animate-pop w-full max-w-md rounded-[28px] p-6 text-center sm:p-8">
            <p className="text-4xl" aria-hidden>{state.notice === "over" ? "🎉" : state.notice === "noTrades" ? "🎯" : "💸"}</p>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight">{en ? NOTICE_TITLE_EN[state.notice] : NOTICE_TITLE[state.notice]}</h2>
            <p className="mt-2 text-sm font-semibold leading-relaxed text-slate-600">
              {state.notice === "over"
                ? en
                  ? GAME_EN.overText(fmtRub(MAX_BALANCE), fmtRub(START_CASH))
                  : `Баланс перешагнул ${fmtRub(MAX_BALANCE)}. Позиции закрыты, баланс возвращён к ${fmtRub(START_CASH)}.`
                : state.notice === "noTrades"
                  ? en
                    ? GAME_EN.noTradesText
                    : "На сегодня все 10 бесплатных сделок использованы. Завтра они обновятся до 10 — приходи снова."
                  : en
                    ? GAME_EN.brokeText(fmtRub(START_CASH))
                    : "Баланс недостаточен для продолжения тренировки. Подожди до завтра: баланс обновится и снова станет 100 000 ₽."}
            </p>
            <button type="button" onClick={() => dispatch({ type: "dismiss" })} className="btn-primary mt-6 w-full">
              {en ? GAME_EN.understood : "Понятно"}
            </button>
          </div>
        </div>
      )}

      {finished && (
        <ResultModal
          result={result}
          counts={state.counts}
          onRetry={() => dispatch({ type: "reset" })}
          onPro={() => setProOpen(true)}
        />
      )}

      <ProInfoModal open={proOpen} onClose={() => setProOpen(false)} />
    </div>
  );
}

function ActionBtn({ tone, disabled, onClick, children }: { tone: "buy" | "sell" | "hold"; disabled?: boolean; onClick: () => void; children: ReactNode }) {
  const color = {
    buy: "bg-emerald-500 shadow-[0_12px_28px_-10px_rgba(16,185,129,.8)] hover:bg-emerald-600",
    sell: "bg-rose-500 shadow-[0_12px_28px_-10px_rgba(244,63,94,.8)] hover:bg-rose-600",
    hold: "bg-indigo-600 shadow-[0_12px_28px_-10px_rgba(79,70,229,.8)] hover:bg-indigo-700",
  }[tone];
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`rounded-2xl px-3 py-3.5 text-sm font-extrabold text-white transition duration-150 hover:-translate-y-0.5 active:scale-95 disabled:translate-y-0 disabled:opacity-40 disabled:shadow-none sm:text-base ${color}`}
    >
      {children}
    </button>
  );
}
