// English copy for the simulator screens (board, coach, feed, result modal, notices).

export const GAME_EN = {
  loading: "Loading balance…",
  home: "Home",
  balance: "Balance",
  coolLabel: "Composure level",
  freeToday: "today",
  buyPro: "Get PRO",
  coolShort: (n: number) => `Composure ${n}% · trades left ${n}`,
  stock: "“Panic on news” scenario",
  lotsLabel: (lot: number) => `Lots (1 lot = ${lot} shares)`,
  less: "Less",
  more: "More",
  sum: "Amount:",
  buy: "🟢 Buy",
  sellAll: "🔴 Sell all",
  hold: "⏳ Hold",
  moveOf: (m: number, total: number) => `Move ${m} of ${total}.`,
  position: "Position:",
  shares: "shares",
  result: "result",
  scenarioNames: ["Newcomer: calm market", "Market crash: −12% correction", "Crypto storm: FOMO & volatility"],
  scenarioSubs: ["Chart rises", "High panic scenario", "Available with PRO subscription"],
  active: "Active",
  hit: "Hot",
  // notices
  noticeOver: "Balance exceeded",
  noticeBroke: "Money has run out",
  noticeNoTrades: "Trades are over",
  overText: (max: string, start: string) => `The balance passed ${max}. Positions closed, balance returned to ${start}.`,
  noTradesText: "All 10 free trades for today are used. They refresh to 10 tomorrow — come back then.",
  brokeText: (start: string) =>
    `Balance is not enough to continue the training. Wait until tomorrow: the balance will refresh and become ${start} again.`,
  understood: "Got it",
  // result
  resultEyebrow: "End of training",
  resultTitle: "Result: 5 moves",
  financialResult: "Financial result",
  fromStart: (start: string) => `from the starting capital ${start}`,
  aiVerdict: (name: string) => `AI verdict: “Your type: ${name}”`,
  retry: "Play the level again",
  unlockPro: "Unlock PRO analytics for 1,499 ₽",
  types: {
    greed: "Greedy hunter",
    panic: "Impulsive strategist",
    calm: "Calm analyst",
  },
  typeTips: {
    greed:
      "You bought on rises and built the position fast. Before entering, ask yourself one question: what changes if the price drops 10%?",
    panic:
      "You make decisions on sharp moves. Write a plan in advance: at what fall you sell and at what you buy more. Then the chart won't decide for you.",
    calm:
      "You know how to wait. To reinforce the skill, try the “Correction −12%” level and notice how your pulse changes before the button.",
  },
  // Coach
  coachTitle: "AI mentor",
  coachSub: "AI reads your pulse and click timing…",
  online: "online",
  coachIdle:
    "Make your first move — buy, sell or wait. I'll comment on every decision and point out where emotions took over.",
  mathLabel: "Math",
  hideBreakdown: "Hide breakdown",
  explainMath: "Explain the mistake's math",
  composure: "Composure:",
  // Feed
  liveTitle: "Live move feed",
  noMoves: "No moves yet. Your history will appear here.",
  emotionsTitle: "Player emotional profile",
  panic: "Panic",
  greed: "Greed",
  calmBar: "Calm",
  kindBuy: "Buy",
  kindSell: "Sell",
  kindHold: "Hold",
  // PriceChart
  chartLabel: "Stock price chart",
  startLabel: "start",
  // Game log texts
  logBuyAdd: (n: number, price: string) => `Added ${n} lot(s) at ${price} ₽`,
  logSellAll: (price: string) => `Sold all lots at ${price} ₽`,
  logHold: "Waiting and not trading",
  // Coach messages
  cBuyFalling:
    "Buying on a fall: you're trying to recover the loss on emotion. First decide why you need this stock according to the plan.",
  cBuyRising: "Buying on a rise is classic FOMO. Check that this is your strategy, not the fear of missing out.",
  cPanicSell:
    "⚠️ Stop! This is a panic sale. You're locking in a loss on emotion. Let's look at why the market is likely to recover now.",
  cProfitSell:
    "Taking profit is a sound decision if it follows the plan. Check whether you sold too early out of fear of a pullback.",
  cLossSell: "Selling at a loss without a clear signal. Try naming the reason first: news, price or fear?",
  cHoldGood: (gain: string) => `✅ Excellent composure! Panic is fading, you saved ${gain}.`,
  cHoldBad: (loss: string) =>
    `Composure is right, but there's still a loss: −${loss}. You didn't lock it in, so it may still shrink.`,
  cHoldCalm: "Pausing is also a decision. What matters is that it was made calmly, not out of fear.",
  mathBuy: (cost: string, price: string, start: string) =>
    `You paid ${cost} at ${price} ₽. If the price returns to the start of ${start} ₽, the trade is at zero.`,
  mathBuyFalling: (avg: string) =>
    `Your average position price is now ${avg} ₽. The lower you buy, the further the break-even without a rebound.`,
  mathSellPanic: (loss: string, pct: string, avg: string, start: string) =>
    `You locked in a loss of −${loss} (−${pct}%). Average price was ${avg} ₽, and the scenario returns to ${start} ₽ — on that rebound the position would have recovered ${loss}.`,
  mathSellProfit: (gain: string) => `Profit from the trade: +${gain}.`,
  mathSellLoss: (loss: string) => `Loss from the trade: −${loss}.`,
  mathHoldUnreal: (gain: string, price: string) =>
    `The position is now in profit: +${gain} at price ${price} ₽. You didn't lock it in on emotion.`,
  mathHoldLoss: (loss: string, price: string) =>
    `Unrealized loss at ${price} ₽ is −${loss}. The position is still open.`,
  mathHoldInfo: (price: string, avg: string) => `Current price ${price} ₽, average position ${avg} ₽.`,
  // Notices in state
  nowLimitOver: "Balance limit exceeded",
  // Quiz / Results
  pickedLabel: "Choice",
};
