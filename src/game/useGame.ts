import { useEffect, useReducer } from "react";
import { FREE_TRADES_TOTAL, LEVELS, LOT, MAX_BALANCE, MOVES, START_CASH, START_COOL, START_LOTS, TICKS_PER_MOVE, fmtRub, type Level } from "./scenarios";

export type Kind = "buy" | "sell" | "hold";
export type Entry = { n: number; kind: Kind; price: number; qty: number; text: string };
export type Coach = { tone: "warn" | "good" | "info"; text: string; math: string };
export type Counts = { panic: number; greed: number; calm: number };
export type Notice = "over" | "broke" | "noTrades" | null;

export type GameState = {
  levelId: 1 | 2 | 3;
  move: number;
  lots: number;
  avg: number;
  cash: number;
  freeLeft: number;
  cool: number;
  counts: Counts;
  log: Entry[];
  coach: Coach | null;
  broke: boolean; // деньги закончились, торговля закрыта до следующего дня
  notice: Notice; // всплывающее окно: превышен баланс / деньги закончились
};

export type GameAction =
  | { type: "trade"; kind: Kind; qty: number; en: boolean }
  | { type: "level"; id: 1 | 2 | 3 }
  | { type: "reset" }
  | { type: "dismiss" };

const fmtRubEn = (n: number) => `${Math.round(n).toLocaleString("en-US")} ₽`;

export const priceAt = (level: Level, move: number) => level.series[Math.min(move * TICKS_PER_MOVE, level.series.length - 1)];

export const equityOf = (s: GameState) => s.cash + s.lots * LOT * priceAt(LEVELS[s.levelId - 1], s.move);

// Локальная дата YYYY-MM-DD: по ней определяем, наступил ли следующий день.
export const today = () => new Date().toLocaleDateString("en-CA");

// Баланс симулятора: у гостя живёт только в памяти вкладки, у аккаунта — в профиле (см. Game.tsx).
export function initState(levelId: 1 | 2 | 3 = 1, saved: SavedBalance | null = null): GameState {
  const level = LEVELS[levelId - 1];
  const p0 = level.series[0];
  // Если деньги закончились в прошлый день — на новый день баланс снова становится стартовым.
  const brokeToday = saved?.brokeDay === today();
  const usable = saved && (!saved.brokeDay || brokeToday) ? saved : null;
  // Бесплатные сделки сохраняются в течение дня и обновляются до 10 каждый новый день.
  const freeToday = saved?.freeDay === today() && typeof saved.freeLeft === "number" ? saved.freeLeft : FREE_TRADES_TOTAL;
  const base = {
    levelId,
    move: 0,
    lots: usable ? usable.lots : START_LOTS,
    avg: usable ? usable.avg : p0,
    cash: usable ? usable.cash : START_CASH - START_LOTS * LOT * p0,
    freeLeft: freeToday,
    cool: START_COOL,
    counts: { panic: 0, greed: 0, calm: 0 },
    log: [],
    coach: null,
    broke: brokeToday,
    notice: null as Notice,
  };
  return { ...base, notice: noticeFor(base) };
}

// Какое окно показать, когда торговля в начале сценария закрыта: деньги важнее сделок.
export function noticeFor(s: Pick<GameState, "broke" | "move" | "freeLeft">): Notice {
  if (s.broke) return "broke";
  if (s.move === 0 && s.freeLeft <= 0) return "noTrades";
  return null;
}

const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

export type Lang = "ru" | "en";

function trade(s: GameState, kind: Kind, qty: number, en: boolean): GameState {
  if (s.move >= MOVES || s.broke) return s;
  // Новый сценарий начинать можно только при наличии бесплатных сделок.
  if (s.move === 0 && s.freeLeft <= 0) return s;
  const level = LEVELS[s.levelId - 1];
  const price = priceAt(level, s.move);
  const prevPrice = s.move === 0 ? level.series[0] : priceAt(level, s.move - 1);
  const start = level.series[0];
  const inDrop = price < start * 0.97;
  const falling = price < prevPrice;
  const p = (n: number) => (en ? n.toFixed(1) : n.toFixed(1).replace(".", ","));
  const R = (n: number) => (en ? fmtRubEn(n) : fmtRub(n));

  let { lots, avg, cash, freeLeft, cool } = s;
  const counts = { ...s.counts };
  let done = 0;
  let coach: Coach;
  let text: string;

  if (kind === "buy") {
    done = Math.min(qty, Math.floor(cash / (LOT * price)));
    if (done <= 0) return s;
    const cost = done * LOT * price;
    avg = (avg * lots * LOT + cost) / ((lots + done) * LOT);
    lots += done;
    cash -= cost;
    text = en ? `Added ${done} lot(s) at ${p(price)} ₽` : `Докупка ${done} лот. по ${p(price)} ₽`;
    if (falling) {
      counts.panic += 1;
      cool -= 6;
      coach = en
        ? { tone: "warn", text: "Buying into a fall: you're trying to win back the loss on emotion. First decide why you hold this stock, according to your plan.", math: `Your average price is now ${p(avg)} ₽. The lower you buy, the further you are from breakeven without a rebound.` }
        : { tone: "warn", text: "Докупка на падении: ты пытаешься «отбить» убыток на эмоциях. Сначала реши, зачем тебе эта бумага по плану.", math: `Средняя цена позиции теперь ${p(avg)} ₽. Чем ниже докупаешь, тем дальше до безубытка без отскока.` };
    } else {
      counts.greed += 1;
      cool -= 3;
      coach = en
        ? { tone: "info", text: "Buying into a rise is classic FOMO. Check whether this is your strategy or the fear of missing out.", math: `You paid ${R(cost)} at ${p(price)} ₽. If the price returns to the start ${p(start)} ₽, the trade is at zero.` }
        : { tone: "info", text: "Покупка на росте — классический FOMO. Проверь, что это твоя стратегия, а не страх упустить момент.", math: `Ты заплатил ${fmtRub(cost)} по ${p(price)} ₽. Если цена вернётся к старту ${p(start)} ₽, сделка будет в нуле.` };
    }
  } else if (kind === "sell") {
    if (s.lots <= 0) return s;
    done = lots;
    const loss = (price - avg) * lots * LOT;
    cash += lots * LOT * price;
    lots = 0;
    avg = price;
    text = en ? `Sold all lots at ${p(price)} ₽` : `Продажа всех лотов по ${p(price)} ₽`;
    if (inDrop) {
      counts.panic += 2;
      cool -= 15;
      coach = en
        ? {
            tone: "warn",
            text: "⚠️ Stop! This is a panic sale. You're locking in a loss out of emotion. Let's look at why the market is about to recover.",
            math: `You locked in a loss of −${R(Math.abs(loss))} (−${p(Math.abs(((price - s.avg) / s.avg) * 100))}%). Your average price was ${p(s.avg)} ₽, and the scenario returns to ${p(start)} ₽ — on that rebound the position would have recovered ${R(Math.abs(loss))}.`,
          }
        : {
            tone: "warn",
            text: "⚠️ Стоп! Это паническая продажа. Ты фиксируешь убыток на эмоциях. Давай разберём, почему рынок сейчас восстановится.",
            math: `Ты зафиксировал убыток −${fmtRub(Math.abs(loss))} (−${p(Math.abs(((price - s.avg) / s.avg) * 100))}%). Средняя цена была ${p(s.avg)} ₽, а сценарий возвращается к ${p(start)} ₽ — на этом отскоке позиция вернула бы ${fmtRub(Math.abs(loss))}.`,
          };
    } else if (loss >= 0) {
      counts.calm += 1;
      coach = en
        ? { tone: "info", text: "Taking profit is a normal decision if it follows your plan. Check whether you sold too early out of fear of a pullback.", math: `Trade profit: +${R(loss)}.` }
        : { tone: "info", text: "Фиксация прибыли — нормальное решение, если оно по плану. Проверь, не продал ли ты раньше времени из страха отката.", math: `Прибыль от сделки: +${fmtRub(loss)}.` };
    } else {
      counts.panic += 1;
      cool -= 8;
      coach = en
        ? { tone: "warn", text: "Selling at a loss without a clear signal. First try to name the reason: news, price or fear?", math: `Trade loss: −${R(Math.abs(loss))}.` }
        : { tone: "warn", text: "Продажа в минус без явного сигнала. Попробуй сначала назвать причину: новость, цена или страх?", math: `Убыток от сделки: −${fmtRub(Math.abs(loss))}.` };
    }
  } else {
    done = 0;
    const unreal = lots * LOT * (avg - price);
    text = en ? "Waiting, no trade" : "Ждёшь и не торгуешь";
    if (inDrop && lots > 0) {
      counts.calm += 2;
      cool += 4;
      if (unreal >= 0) {
        coach = en
          ? {
              tone: "good",
              text: `✅ Excellent composure! Panic is fading, you saved ${R(unreal)}.`,
              math: `The position is in profit now: +${R(unreal)} at ${p(price)} ₽. You didn't lock it in out of emotion.`,
            }
          : {
              tone: "good",
              text: `✅ Отличное хладнокровие! Паника стихает, ты сэкономил ${fmtRub(unreal)}.`,
              math: `Позиция сейчас в плюсе: +${fmtRub(unreal)} при цене ${p(price)} ₽. Ты не зафиксировал его на эмоциях.`,
            };
      } else {
        coach = en
          ? {
              tone: "warn",
              text: `Composure is right, but the loss is still there: −${R(Math.abs(unreal))}. You haven't locked it in, so it can still shrink.`,
              math: `The unrealized loss at ${p(price)} ₽ is −${R(Math.abs(unreal))}. The position is still open.`,
            }
          : {
              tone: "warn",
              text: `Хладнокровие — это правильно, но убыток пока есть: −${fmtRub(Math.abs(unreal))}. Ты его не зафиксировал, поэтому он ещё может сократиться.`,
              math: `Нереализованный убыток на ${p(price)} ₽ составляет −${fmtRub(Math.abs(unreal))}. Позиция по-прежнему открыта.`,
            };
      }
    } else {
      counts.calm += 1;
      cool += 2;
      coach = en
        ? { tone: "info", text: "Pausing is also a decision. What matters is that you made it calmly, not out of fear.", math: `Current price ${p(price)} ₽, average position ${p(avg)} ₽.` }
        : { tone: "info", text: "Пауза тоже решение. Важно, что оно принято спокойно, а не из страха.", math: `Текущая цена ${p(price)} ₽, средняя позиция ${p(avg)} ₽.` };
    }
  }

  const n = s.move + 1;
  // Одна бесплатная сделка = весь сценарий: счётчик уменьшается только когда сценарий завершён.
  const freeAfter = n >= MOVES ? Math.max(0, freeLeft - 1) : freeLeft;
  return {
    ...s,
    move: n,
    lots,
    avg,
    cash,
    freeLeft: freeAfter,
    cool: clamp(cool),
    counts,
    log: [...s.log, { n, kind, price, qty: done, text }],
    coach,
  };
}

// Проверка лимитов после каждой сделки: превышение 200 000 ₽ сбрасывает баланс до стартового,
// баланс, которого не хватает даже на один лот, закрывает торговлю до следующего дня.
function applyLimits(s: GameState): GameState {
  if (s.broke) return s;
  const level = LEVELS[s.levelId - 1];
  const price = priceAt(level, s.move);
  if (equityOf(s) > MAX_BALANCE) {
    return { ...s, cash: START_CASH, lots: 0, avg: price, notice: "over" };
  }
  if (equityOf(s) < LOT * price) {
    return { ...s, cash: 0, broke: true, notice: "broke" };
  }
  return s;
}

// Новый раунд или другой сценарий не возвращает стартовые 100 000 ₽: баланс и позиция переносятся как есть.
function carryOver(s: GameState, levelId: 1 | 2 | 3): GameState {
  const p0 = LEVELS[levelId - 1].series[0];
  const equity = equityOf(s);
  // Смена сценария посреди раунда считается завершением этой сделки, иначе можно обойти лимит.
  const abandoned = s.move > 0 && s.move < MOVES;
  const freeLeft = abandoned ? Math.max(0, s.freeLeft - 1) : s.freeLeft;
  const next = {
    ...initState(levelId),
    lots: s.lots,
    avg: s.avg,
    cash: s.broke ? 0 : equity - s.lots * LOT * p0,
    broke: s.broke,
    freeLeft,
  };
  return { ...next, notice: noticeFor(next) };
}

function reducer(s: GameState, a: GameAction): GameState {
  switch (a.type) {
    case "trade":
      // Сделки на сегодня закончились: показываем окно вместо молчаливого отказа.
      if (!s.broke && s.move === 0 && s.freeLeft <= 0) return { ...s, notice: "noTrades" };
      if (a.kind === "buy" && !s.broke && s.move < MOVES && s.cash < LOT * priceAt(LEVELS[s.levelId - 1], s.move)) {
        // Денег не хватает даже на один лот: торговля закрывается до следующего дня.
        return { ...s, broke: true, notice: "broke" };
      }
      return applyLimits(trade(s, a.kind, a.qty, a.en));
    case "level":
      return carryOver(s, a.id);
    case "reset":
      return carryOver(s, s.levelId);
    case "dismiss":
      return { ...s, notice: null };
  }
}

export type SavedBalance = { cash: number; lots: number; avg: number; brokeDay: string | null; freeLeft?: number; freeDay?: string | null };

export function toSaved(s: GameState): SavedBalance {
  return { cash: s.cash, lots: s.lots, avg: s.avg, brokeDay: s.broke ? today() : null, freeLeft: s.freeLeft, freeDay: today() };
}

export function useGame(saved: SavedBalance | null, onChange?: (b: SavedBalance) => void, initial: 1 | 2 | 3 = 1) {
  const [state, dispatch] = useReducer(reducer, { levelId: initial, saved }, (a) => initState(a.levelId, a.saved));
  useEffect(() => {
    onChange?.(toSaved(state));
    // onChange намеренно не в зависимостях: сохраняем только при смене баланса.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.cash, state.lots, state.avg, state.broke, state.freeLeft]);
  return { state, dispatch };
}
