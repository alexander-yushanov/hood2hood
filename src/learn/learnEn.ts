// English copy for the learning center, games and PRO modal.

export const LEARN_EN = {
  allGames: "All games",
  home: "Home",
  textbook: "Textbook",
  simulator: "Simulator",
  eyebrow: "Learning center",
  title: "Your capital's gym",
  lead: (n: number) =>
    `${n} short games with virtual money. Each one trains a single decision: how not to panic, not to be greedy and to count risk.`,
  free: "Free",
  pro: "PRO",
  play: "Play",
  difficulty: (n: number) => `Difficulty ${n} of 3`,
  levels: ["Easy", "Medium", "Hard"],
  proOnly: "This trainer is available only in the PRO version",
  proIntro: "Open all games and your personal AI mentor.",
  proPerks: [
    "Unlimited trades in every trainer",
    "AI psychologist breakdown of every mistake",
    "Course completion certificate",
  ],
  proPayment: "Payment is not connected yet. You can try PRO once for free. Educational simulator, not investment advice.",
  close: "Close",
  closeDialog: "Close dialog",
  getPro: "Get PRO for 1,499 ₽",
  // LearnGame
  notFound: "This game doesn't exist",
  backToLearn: "← To the learning center",
  backToGames: "Back to games",
  allGamesShort: "All games",
  proOnlyText: "This trainer is available only in the PRO version.",
  getProShort: "Get PRO",
  balance: "Balance",
  trainer: "Trainer",
  mentor: "AI mentor",
  mentorSub: "Explains the decision in plain language",
  mentorIdle:
    "Select one or more decisions and confirm. I'll explain what is reasonable in them and what looks like emotion.",
  reasonable: "Reasonable decisions",
  correctAnswer: "Correct answer",
  why: "Why",
  pickFirst: "Select decisions",
  confirmOne: (n: number) => `Confirm decisions (${n})`,
  nextRound: "Next round",
  seeResult: "See result",
  finishTitle: "Training complete",
  capitalResult: "Virtual capital result:",
  correctCount: (s: number, t: number) => `Correct answers: ${s} of ${t}.`,
  reasonableCount: (g: number, t: number) => `Reasonable decisions: ${g} of ${t}.`,
  mentorConclusion: "Mentor's conclusion",
  restart: "Play again",
  chooseOther: "Choose another game",
  stakeLabel: "Stake from balance",
  stakeNote: (s: number) => `Stake ${s}% of balance on this step.`,
  quizReward: (r: string, p: string, s: number) => `Correct +${r}, wrong −${p} · correct answers: ${s}`,
  zeroBalance: "Balance 0 ₽ — decisions are unavailable until the next day.",
  moneyOver: "Money has run out",
  brokeText: (start: string) =>
    `Virtual balance dropped to 0 ₽. This is a training scenario: tomorrow the balance will be ${start} again.`,
  understood: "Got it",
  roundOf: (a: number, b: number) => `${a} of ${b}`,
  chartLabel: "Price dynamics in the round",
  // Simulator/Learn card titles are kept in games data (EN in games map below)
};

export const GAMES_EN: Record<string, { title: string; description: string }> = {
  "crisis-pilot": {
    title: "Crisis Pilot",
    description: "Manage a portfolio during a −20% market crash. Decide what to hold, what to sell and when to buy more.",
  },
  "dividend-hunt": {
    title: "Dividend Hunt",
    description: "Build passive income over 10 virtual years. Pick securities and reinvest the payouts.",
  },
  "crypto-storm": {
    title: "Crypto Storm",
    description: "Trade volatile coins with leverage. Learn to hold risk when the price jumps within minutes.",
  },
  "fomo-psychologist": {
    title: "FOMO Psychologist",
    description: 'Learn not to buy stocks when everyone around shouts "Rocket!". Count the price of emotions.',
  },
  "scalping-master": {
    title: "Scalping Master",
    description: "Quick intraday trades on minute charts. Take small profits without rushing.",
  },
  "invest-quiz": {
    title: "Invest Quiz",
    description: "Test your knowledge of terms in an AI battle format. Answer faster than the bot opponent.",
  },
  "bear-trail": {
    title: "Bear Trail",
    description: "Survive a long bear market without selling at the bottom. Count what every panic button costs.",
  },
  "bond-shield": {
    title: "Bond Shield",
    description: "Build the defensive part of a portfolio: bonds, funds and cash against stock swings.",
  },
  "diversify-lab": {
    title: "Diversification Lab",
    description: "Compare a portfolio of one stock with one spread across ten sectors. See how each holds up in a market hit.",
  },
  "stop-loss-duel": {
    title: "Stop-Loss Duel",
    description: "Set a stop-loss before entering a trade and check how much capital it really protects.",
  },
  "news-oracle": {
    title: "News Oracle",
    description: "News is out and the price is already reacting. Decide whether it's noise or a signal before the timer ends.",
  },
  "portfolio-60": {
    title: "Portfolio in 60 Seconds",
    description: "Quickly build a portfolio for a given risk and horizon. Learn to decide under time pressure.",
  },
};
