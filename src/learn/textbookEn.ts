// English copy for the Textbook page. Keys follow the Russian source order in Textbook.tsx.

export const TB_EN = {
  back: "Back to games",
  simulator: "Simulator",
  eyebrow: "Textbook",
  title: "Investor's glossary",
  intro:
    "All terms from the games in plain language, plus rules that help you avoid losing money on emotions. This material is educational and is not investment advice.",
  navTerms: "Terms",
  navTips: "Investor tips",
  navMistakes: "Common mistakes",
  navFormulas: "Formulas",
  termsTitle: "Terms",
  searchLabel: "Search terms",
  searchPlaceholder: 'Find a term, e.g. "stop" or "dividend"',
  all: "All",
  notFound: "Nothing found. Try another word.",
  tipsTitle: "Investor tips",
  mistakesTitle: "Common beginner mistakes",
  formulasTitle: "Useful formulas",
  disclaimer:
    'Disclaimer: Capital of the Future materials are educational. They are not individual investment advice. Past returns do not guarantee future results. Consult a licensed specialist before making real decisions.',
  categories: {
    "Основы": "Basics",
    "Инструменты": "Instruments",
    "Риск и защита": "Risk & protection",
    "Рынок и сигналы": "Market & signals",
    "Поведение": "Behavior",
    "Крипто": "Crypto",
  } as Record<string, string>,
};

export const TERMS_EN: Record<string, { term: string; def: string; aka?: string }> = {
  Акция: {
    term: "Stock",
    def: "A share of a company. The owner gets part of the profit and a vote, and the price changes with market expectations.",
  },
  Облигация: {
    term: "Bond",
    def: "A debt security: you lend money to the issuer and receive coupon income and repayment of the face value at maturity.",
  },
  Купон: { term: "Coupon", def: "A regular payment on a bond, usually calculated as a percentage of its face value." },
  Эмитент: { term: "Issuer", def: "A company, government or organization that issues securities." },
  Дивиденд: {
    term: "Dividend",
    def: "Part of a company's profit paid out to shareholders. It can be paid quarterly, semi-annually or annually.",
  },
  "Дивидендная доходность": {
    term: "Dividend yield",
    aka: "dividend ~8%",
    def: "The annual dividend divided by the current share price. A very high yield can mean the price fell because of problems.",
  },
  "Блю-чип": {
    term: "Blue chip",
    def: "A large, stable company with a long history of profits and payouts. It does not guarantee growth but is usually less risky.",
  },
  "Сложный процент": {
    term: "Compound interest",
    def: "Income earned on both the invested sum and the income already received. The main engine of long-term growth: reinvest dividends and they start working for you.",
  },
  "Пассивный доход": {
    term: "Passive income",
    def: "Income that arrives without daily effort: dividends, coupons, interest, rent.",
  },
  Инфляция: {
    term: "Inflation",
    def: "Rising prices that make money buy less over time. Cash held at home loses real value during inflation.",
  },
  Комиссия: {
    term: "Fee",
    def: "A payment to a broker, exchange or fund for a transaction or management. Small fees on frequent trades eat into returns.",
  },
  "Ставка ЦБ (ключевая ставка)": {
    term: "Central bank key rate",
    def: "The rate the central bank uses to manage inflation. Rate hikes usually pressure stocks and bonds; cuts help them.",
  },
  "Индексный фонд (ETF)": {
    term: "Index fund (ETF)",
    def: "A fund that copies a basket of securities from an index, for example dozens of the largest companies in the market. One purchase gives broad diversification.",
  },
  "Паевой фонд": {
    term: "Mutual fund",
    def: "A common portfolio that pools money from many investors. Professionals manage it, and a fee is charged for that.",
  },
  Брокер: {
    term: "Broker",
    def: "A company through which you buy and sell securities. It charges a fee for trades or for account maintenance.",
  },
  "Кэш (свободные деньги)": {
    term: "Cash",
    aka: "cash",
    def: "Money in the account that is not invested. It does not grow and is exposed to inflation, but lets you buy more during a drop.",
  },
  "Заём под покупку (маржа)": {
    term: "Margin loan",
    aka: "margin trading",
    def: "Money borrowed from a broker against your securities. It amplifies both gains and losses and can lead to forced selling.",
  },
  Плечо: {
    term: "Leverage",
    def: "Trading with borrowed money. 10x leverage means that with 1,000 ₽ of your own money you open a 10,000 ₽ position. A 10% move against you almost wipes out the investment.",
  },
  Ликвидация: {
    term: "Liquidation",
    def: "A forced closing of a position by the exchange or broker when collateral is insufficient. It often happens right after a sharp move against leverage.",
  },
  "Короткая продажа (шорт)": {
    term: "Short selling",
    aka: "short",
    def: "Selling a security you borrowed from a broker, expecting to buy it back cheaper later. You profit if the price falls, but losses are unlimited if it rises.",
  },
  Диверсификация: {
    term: "Diversification",
    def: "Spreading money across different securities, sectors, countries and asset classes. One piece of news should not destroy the whole portfolio.",
  },
  Концентрация: {
    term: "Concentration",
    def: "Most of the capital sits in one security or sector. High returns are possible, but one mistake becomes fatal.",
  },
  Ребаланс: {
    term: "Rebalancing",
    def: "Returning portfolio weights to target values: selling what grew a lot and buying what fell.",
  },
  "Стоп-лосс": {
    term: "Stop-loss",
    def: "An order to sell automatically when the price falls to a set level. It limits the loss on a trade. It is set before entering.",
  },
  "Трейлинг-стоп": {
    term: "Trailing stop",
    def: "A stop-loss that follows a rising price and never moves down. It protects accumulated profit.",
  },
  "Стоп-лимит": {
    term: "Stop-limit order",
    def: "A stop order with a minimum execution price. It protects against selling at an accidentally low price, but may not get filled.",
  },
  Безубыток: {
    term: "Break-even",
    def: "The level at which a trade returns zero after fees. Moving the stop to break-even makes the trade risk-free.",
  },
  "Риск на сделку": {
    term: "Risk per trade",
    def: "The amount you are ready to lose on one trade, usually 1–2% of capital. It is calculated from position size and the distance to the stop.",
  },
  "Размер позиции": {
    term: "Position size",
    def: "How much capital goes into one trade. It matters more than forecast accuracy: the right size survives a series of mistakes.",
  },
  Усреднение: {
    term: "Averaging down",
    def: "Buying the same security at a lower price to reduce the average entry price. Dangerous without a plan: the loss grows with the position.",
  },
  "Регулярные взносы (DCA)": {
    term: "Dollar-cost averaging (DCA)",
    aka: "averaging over time",
    def: "Buying a fixed amount at regular intervals regardless of price. It reduces the risk of buying everything at the top.",
  },
  Просадка: {
    term: "Drawdown",
    def: "The percentage fall of capital from a previous peak to a new low. A −50% drawdown needs +100% growth to return to the peak.",
  },
  Волатильность: {
    term: "Volatility",
    def: "How much a price fluctuates over a period. High volatility brings both opportunities and the risk of sharp losses.",
  },
  Коррекция: {
    term: "Correction",
    def: "A market fall of 10% or more from a peak. A normal part of a healthy cycle, not always the start of a crisis.",
  },
  "Медвежий рынок": {
    term: "Bear market",
    aka: "bearish trend",
    def: "A long market decline, usually 20% or more from a peak, lasting months or years.",
  },
  "Бычий рынок": {
    term: "Bull market",
    def: "A period of sustained price growth dominated by buyers.",
  },
  "Дно и пик": {
    term: "Bottom and top",
    def: "The local low and high of a price. Almost no one can identify them in advance, so strategies are not built on guessing.",
  },
  "Поддержка и сопротивление": {
    term: "Support and resistance",
    def: "Levels where the price previously turned up (support) or down (resistance). Used in technical analysis.",
  },
  "Объём торгов": {
    term: "Trading volume",
    aka: "volume",
    def: "The number of shares or coins bought and sold over a period. A strong move on high volume is more reliable than on low volume.",
  },
  Скальпинг: {
    term: "Scalping",
    def: "Intraday trades for small profits, often on minute charts. It requires discipline and low fees.",
  },
  Таймфрейм: {
    term: "Timeframe",
    def: "The interval of one candle on a chart: minute, hour, day. A short timeframe produces more noise.",
  },
  Отчётность: {
    term: "Financial reporting",
    def: "A company's regular financial statements: revenue, profit, debt, cash flow. The main source of facts about a business.",
  },
  "Новость и сигнал": {
    term: "News vs. signal",
    def: "News is an event. A signal is an event confirmed by data that changes the valuation of a business. The market's first reaction often already priced in the news.",
  },
  Инсайд: {
    term: "Insider information",
    def: "Non-public material information about a company. Trading on it is illegal. In chats, ordinary rumors are often called “insider”.",
  },
  Слух: {
    term: "Rumor",
    def: "Unverified information. Before deciding, check the source, trading volume and official disclosures.",
  },
  FOMO: {
    term: "FOMO",
    aka: "fear of missing out",
    def: "Fear of missing out: buying on emotion when everyone else is making money. People usually buy at the top.",
  },
  "Паническая продажа": {
    term: "Panic selling",
    def: "Selling out of fear during a fall. It locks in the loss and often happens close to the bottom.",
  },
  Жадность: {
    term: "Greed",
    def: "The urge to take more than the strategy allows: waiting for extra percent, doubling the stake, not taking profit.",
  },
  "Эффект якоря": {
    term: "Anchoring",
    def: "Fixation on an arbitrary price, such as your purchase price. It makes it hard to sell at a loss even when there is no longer a reason to hold.",
  },
  "Эффект толпы": {
    term: "Herd effect",
    def: "Deciding by the majority's opinion instead of analysis. A chat vote or “everyone is buying” is not a strategy.",
  },
  "Торговый план": {
    term: "Trading plan",
    def: "Written rules: what I buy, at what price, how much, where the stop is and when I take profit. Written in advance, in a calm state.",
  },
  "Подушка безопасности": {
    term: "Emergency fund",
    def: "Money for 3–6 months of expenses, kept separately from investments. It lets you avoid selling assets in a crisis.",
  },
  Криптовалюта: {
    term: "Cryptocurrency",
    def: "A digital asset recorded on a distributed network without a central bank. Its price is very volatile.",
  },
  "Токен / монета": {
    term: "Token / coin",
    def: "A digital unit within a project or blockchain. It does not always give rights to a business or income.",
  },
  Альткоин: {
    term: "Altcoin",
    def: "Any cryptocurrency other than bitcoin. Generally riskier: many projects disappear completely.",
  },
  Ракета: {
    term: "Rocket",
    def: "Slang: a coin that rose sharply. The louder the “rocket”, the closer the top usually is.",
  },
  HODL: {
    term: "HODL",
    def: "Slang: holding an asset for a long time without reacting to swings. It works only with a position size chosen in advance.",
  },
  "Pump & dump": {
    term: "Pump and dump",
    def: "A scheme in which a coin is artificially hyped on social media and the organizers sell into the wave. Everyone else is left with losses.",
  },
  Блокчейн: {
    term: "Blockchain",
    def: "A distributed database in which records are linked in a chain and confirmed by network participants.",
  },
};

export const TIPS_EN: { title: string; text: string }[] = [
  {
    title: "Emergency fund first, then investing",
    text: "Put aside 3–6 months of expenses in a separate account. Without it, any drawdown turns into a forced sale.",
  },
  {
    title: "Goal and horizon before picking securities",
    text: "Money for a purchase in 2 years and a pension in 25 years need different strategies. Decide the horizon first, then the portfolio.",
  },
  {
    title: "Diversify widely",
    text: "An index fund or 10–20 stocks from different sectors protects better than one “most promising” company.",
  },
  {
    title: "Consistency beats the perfect entry",
    text: "A fixed amount every month removes the need to guess the bottom and reduces the impact of emotions.",
  },
  {
    title: "Count the fees",
    text: "Broker commission, fund fee and spread together can noticeably cut returns, especially with frequent trades.",
  },
  {
    title: "Reinvest income",
    text: "Dividends and coupons that are reinvested create the effect of compound interest. The earlier you start, the stronger it is.",
  },
  {
    title: "Don't trade on borrowed money",
    text: "Leverage and margin increase not only profit but also the chance of losing everything. You don't need them for learning.",
  },
  {
    title: "Read reports, not headlines",
    text: "A news item in the feed is a reason to check, not a command to act. Decide based on revenue, profit, debt and cash flow.",
  },
  {
    title: "Review the plan once a year",
    text: "Check weights, goals and risk. Change the plan because your life changed, not because the market fell again.",
  },
  {
    title: "Learn about tax benefits",
    text: "In Russia there are investment accounts with tax benefits (for example, IIS). Check the conditions and limits with your broker or the tax authority.",
  },
];

export const MISTAKES_EN: string[] = [
  "Putting everything into one stock or one coin.",
  "Selling at the bottom because of news and missing the recovery.",
  "Buying at the top because everyone talks about growth.",
  "Moving the stop-loss down to “wait it out”.",
  "Averaging down a losing position without a plan or a limit.",
  "Trading with leverage without understanding the liquidation price.",
  "Investing money you will need within a few months.",
];

export const FORMULAS_EN: { name: string; formula: string; note: string }[] = [
  {
    name: "Compound interest",
    formula: "Capital × (1 + rate)ⁿ",
    note: "100,000 ₽ at 10% a year for 10 years ≈ 259,000 ₽ without new contributions.",
  },
  {
    name: "Drawdown",
    formula: "(Minimum − Maximum) ÷ Maximum",
    note: "A fall from 100 to 70 is a drawdown of −30%.",
  },
  {
    name: "Recovery",
    formula: "1 ÷ (1 − drawdown) − 1",
    note: "To recover −30% you need +43%. To recover −50% you need +100%.",
  },
  {
    name: "Risk per trade",
    formula: "(Capital × risk %) ÷ (entry − stop)",
    note: "Capital 100,000 ₽, risk 1%, entry 250 ₽, stop 240 ₽ → 100 shares.",
  },
];
