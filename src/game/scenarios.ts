// Константы и сценарии тренажёра. Все цены и суммы — учебные, виртуальные.

export const START_CASH = 100000; // общий виртуальный капитал
export const MAX_BALANCE = 200000; // при превышении баланс сбрасывается до START_CASH
export const START_LOTS = 20; // стартовая позиция, лотов
export const LOT = 10; // акций в одном лоте
export const MOVES = 5; // ходов в одной тренировке
export const TICKS_PER_MOVE = 3; // точек графика за один ход
export const FREE_TRADES_TOTAL = 10; // бесплатных сделок в день, сбрасываются каждый новый день
export const START_COOL = 85; // стартовый уровень хладнокровия, %

export type Level = {
  id: 1 | 2 | 3;
  title: string;
  subtitle: string;
  locked: boolean;
  series: number[];
};

// Ряд = 16 точек: старт + MOVES * TICKS_PER_MOVE.
export const LEVELS: Level[] = [
  {
    id: 1,
    title: "Новичок: Спокойный рынок",
    subtitle: "График растёт",
    locked: false,
    series: [270.4, 272.1, 271.3, 274.0, 276.2, 275.4, 278.8, 281.0, 283.5, 282.7, 286.0, 288.4, 290.1, 292.9, 295.0, 297.6],
  },
  {
    id: 2,
    title: "Обвал рынка: Коррекция −12%",
    subtitle: "Сценарий высокой паники",
    locked: false,
    series: [270.4, 271.8, 273.1, 268.5, 262.3, 255.0, 249.8, 246.9, 245.5, 247.2, 244.8, 241.6, 238.2, 246.0, 252.4, 258.9],
  },
  {
    id: 3,
    title: "Крипто-шторм: FOMO & Волатильность",
    subtitle: "Доступно по PRO-подписке",
    locked: true,
    series: [270.4, 268.0, 275.0, 262.0, 281.0, 255.0, 290.0, 248.0, 286.0, 252.0, 296.0, 244.0, 288.0, 259.0, 301.0, 262.0],
  },
];

export const fmtRub = (n: number) => `${Math.round(n).toLocaleString("ru-RU")} ₽`;

export const fmtSigned = (n: number) =>
  `${n > 0 ? "+" : n < 0 ? "−" : ""}${Math.abs(Math.round(n)).toLocaleString("ru-RU")} ₽`;

export const fmtPct = (n: number) => `${n > 0 ? "+" : n < 0 ? "−" : ""}${Math.abs(n).toFixed(1).replace(".", ",")}%`;
