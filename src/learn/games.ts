export type GameCard = {
  id: string;
  title: string;
  description: string;
  difficulty: 1 | 2 | 3;
  pro: boolean;
  accent: "emerald" | "indigo" | "rose" | "violet" | "amber" | "sky";
};

export const GAMES: GameCard[] = [
  {
    id: "crisis-pilot",
    title: "Пилот Кризиса",
    description: "Управление портфелем при обвале рынка на −20%. Решай, что держать, что продавать и когда докупать.",
    difficulty: 2,
    pro: false,
    accent: "rose",
  },
  {
    id: "dividend-hunt",
    title: "Дивидендная Охота",
    description: "Собирай пассивный доход за 10 виртуальных лет. Подбирай бумаги и реинвестируй выплаты.",
    difficulty: 1,
    pro: false,
    accent: "emerald",
  },
  {
    id: "crypto-storm",
    title: "Крипто-Шторм",
    description: "Торговля волатильными монетами с плечом. Учись держать риск, когда цена скачет за минуты.",
    difficulty: 3,
    pro: true,
    accent: "violet",
  },
  {
    id: "fomo-psychologist",
    title: "Психолог FOMO",
    description: "Учись не покупать акции, когда все вокруг кричат «Ракета!». Считай цену эмоций.",
    difficulty: 2,
    pro: true,
    accent: "amber",
  },
  {
    id: "scalping-master",
    title: "Скальпинг-Мастер",
    description: "Быстрые сделки внутри дня на минутных графиках. Фиксируй маленькую прибыль без спешки.",
    difficulty: 3,
    pro: true,
    accent: "sky",
  },
  {
    id: "invest-quiz",
    title: "Инвест-Квиз",
    description: "Проверка знаний терминов в формате баттла с ИИ. Отвечай быстрее соперника-бота.",
    difficulty: 1,
    pro: false,
    accent: "indigo",
  },
  {
    id: "bear-trail",
    title: "Медвежья Тропа",
    description: "Пережди длинный медвежий рынок без продаж на дне. Считай, сколько стоит каждая паническая кнопка.",
    difficulty: 2,
    pro: false,
    accent: "rose",
  },
  {
    id: "bond-shield",
    title: "Облигационный Щит",
    description: "Собери защитную часть портфеля: облигации, фонды и кэш против скачков акций.",
    difficulty: 1,
    pro: false,
    accent: "sky",
  },
  {
    id: "diversify-lab",
    title: "Лаборатория Диверсификации",
    description: "Сравни портфели из одной бумаги и из десяти секторов. Смотри, как каждый выдерживает удар рынка.",
    difficulty: 2,
    pro: false,
    accent: "emerald",
  },
  {
    id: "stop-loss-duel",
    title: "Дуэль Стоп-Лоссов",
    description: "Ставь стоп-лосс до входа в сделку и проверь, сколько капитала он реально защищает.",
    difficulty: 2,
    pro: true,
    accent: "indigo",
  },
  {
    id: "news-oracle",
    title: "Оракул Новостей",
    description: "Новость вышла, цена уже реагирует. Реши, это шум или сигнал, пока таймер не закончился.",
    difficulty: 3,
    pro: true,
    accent: "violet",
  },
  {
    id: "portfolio-60",
    title: "Портфель за 60 секунд",
    description: "Быстрая сборка портфеля под заданный риск и срок. Учись принимать решения под давлением времени.",
    difficulty: 3,
    pro: true,
    accent: "amber",
  },
];

export const PRO_PRICE = "1 499 ₽";
