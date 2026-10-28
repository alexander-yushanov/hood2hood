// English texts for training scenarios. Structure mirrors gameData.ts:
// rounds and choices are matched by index, numbers and "good" flags are shared.

type ChoiceEn = { label: string; reply: string };
type RoundEn = { title: string; situation: string; explain?: string; choices: ChoiceEn[] };
export type LearnGameEn = { intro: string; lesson: string; rounds: RoundEn[] };

export const LEARN_GAMES_EN: Record<string, LearnGameEn> = {
  "crisis-pilot": {
    intro: "The market crashed. Your task: don't sell at the bottom and keep a cool head.",
    lesson: "In a crisis, the plan matters more than the forecast. Decide in advance when and by how much you will buy more.",
    rounds: [
      {
        title: "Round 1 · First drop",
        situation: "The market fell 6% in a week. The portfolio holds 60% stocks and 40% cash.",
        choices: [
          { label: "Sell all stocks", reply: "You locked in the loss at the bottom. The market then bounced, and you missed part of the rebound." },
          { label: "Change nothing", reply: "The portfolio dipped, but the position is kept to recover." },
          { label: "Buy more in parts with cash", reply: "Buying on the dip lowered your average price." },
        ],
      },
      {
        title: "Round 2 · Worse news",
        situation: "The fall continues: −15% from the peak. Panic in the news feed.",
        choices: [
          { label: "Sell half", reply: "Selling half out of emotion is the most common way to lock in the worst entry." },
          { label: "Hold and don't check quotes every hour", reply: "Fewer checks mean fewer impulsive decisions." },
          { label: "Buy blue chips in parts", reply: "Gradual buying lowers the risk of guessing the bottom." },
        ],
      },
      {
        title: "Round 3 · Cash running out",
        situation: "The market is −20%. Cash is almost gone. You can take a margin loan to buy.",
        choices: [
          { label: "Take a loan to buy more", reply: "A loan at the bottom amplifies any move down. This is how even strong portfolios break." },
          { label: "Buy according to a plan written in advance", reply: "The plan protects you from decisions made in the moment." },
          { label: "Wait without a plan", reply: "There's no risk, but you might miss the rebound." },
        ],
      },
      {
        title: "Round 4 · Rebound",
        situation: "The market rose 5% in a week. Everyone says the bottom is behind us.",
        choices: [
          { label: "Take profit on the first bounce", reply: "You took a small part, while the main rise happened without you." },
          { label: "Rebalance back to target weights", reply: "Rebalancing sells what grew and buys what fell." },
          { label: "Everything into the one stock that rose", reply: "Concentration during a bounce is a new risk." },
        ],
      },
    ],
  },

  "dividend-hunt": {
    intro: "Collect passive income and watch how compound interest works.",
    lesson: "Dividends work harder when reinvested, and when your portfolio is diversified.",
    rounds: [
      {
        title: "Round 1 · Choosing stocks",
        situation: "You need stocks with steady payouts. What do you buy first?",
        choices: [
          { label: "A stable bank with a ~8% dividend", reply: "Predictable payouts are a good foundation." },
          { label: "A growing IT company with no dividends", reply: "There's growth, but no income. In this game you're building income." },
          { label: "One stock with a record dividend", reply: "A very high dividend from a single stock often signals risk." },
        ],
      },
      {
        title: "Round 2 · First payout",
        situation: "A dividend arrived. Reinvest or withdraw?",
        choices: [
          { label: "Reinvest", reply: "Compound interest starts working for you." },
          { label: "Withdraw for everyday spending", reply: "The income is good, but compound interest is left idle." },
        ],
      },
      {
        title: "Round 3 · Dividend cut",
        situation: "The company cut its dividend in half. The stock dropped on the news.",
        choices: [
          { label: "Sell immediately", reply: "A panic sale after one piece of news." },
          { label: "Check the financial reports and decide on facts", reply: "Decide based on facts, not headlines." },
          { label: "Buy more while it's cheap", reply: "Without analyzing the reasons, a cheap price can be a trap." },
        ],
      },
      {
        title: "Round 4 · Year-end review",
        situation: "The year is closed. How do you allocate income for next year?",
        choices: [
          { label: "Diversify across 5 stocks from different sectors", reply: "One stock falling barely hurts total income." },
          { label: "Put everything into the stock with the highest dividend", reply: "One stock is one point of failure." },
        ],
      },
    ],
  },

  "crypto-storm": {
    intro: "Coins swing within minutes. The key skill is limiting risk before you enter.",
    lesson: "Position size and a stop-loss matter more than guessing direction. Leverage increases both profit and loss.",
    rounds: [
      {
        title: "Round 1 · Rocket",
        situation: "Coin +40% in an hour. Everyone posts “rocket”, price at the peak.",
        choices: [
          { label: "Buy at the peak", reply: "Entering at the peak of euphoria is the worst place to buy." },
          { label: "Wait for a pullback", reply: "You missed the rise, but you avoided the trap." },
          { label: "Small position with a stop", reply: "Risk is limited in advance, and the entry has a plan." },
        ],
      },
      {
        title: "Round 2 · 10-minute crash",
        situation: "Price fell 25% in 10 minutes. Your position is in the red.",
        choices: [
          { label: "Average down and buy more", reply: "Averaging down without a plan multiplies the loss." },
          { label: "Exit at the stop-loss", reply: "A small loss according to the plan is a normal price for discipline." },
          { label: "Wait, without a plan", reply: "Without an exit rule, you're deciding on emotion." },
        ],
      },
      {
        title: "Round 3 · 10x leverage",
        situation: "You're in a trade with 10x leverage. Price moved 6% against you.",
        choices: [
          { label: "Close manually and accept the loss", reply: "A small loss today is better than liquidation." },
          { label: "Wait for the price to recover", reply: "At 10x leverage, liquidation comes very fast." },
        ],
      },
      {
        title: "Round 4 · New coin",
        situation: "A new token with no team and no reports promises x10.",
        choices: [
          { label: "Skip it", reply: "Turning down a doubtful project is also a decision." },
          { label: "Invest 10% of capital", reply: "Ten percent in one unverified project is far too much." },
          { label: "Check the project and invest no more than 2%", reply: "A small size makes a mistake affordable." },
        ],
      },
    ],
  },

  "fomo-psychologist": {
    intro: "Everyone around you is already in profit. Can you avoid buying out of emotion?",
    lesson: "FOMO buys at the top. A pre-written entry rule is stronger than other people's excitement.",
    rounds: [
      {
        title: "Round 1 · The chat yells “Rocket!”",
        situation: "The stock is +30% this week. The chat is all excitement.",
        choices: [
          { label: "Buy now while it's rising", reply: "You bought at the top, when everyone was already in." },
          { label: "Wait", reply: "Waiting is also a strategy." },
          { label: "Figure out why it rose", reply: "The reason for the rise matters more than its speed." },
        ],
      },
      {
        title: "Round 2 · “Everyone's already in profit!”",
        situation: "A friend writes: “Can't you see?!” The price is still rising.",
        choices: [
          { label: "Buy more today", reply: "Buying on a friend's advice is classic FOMO." },
          { label: "Write down your entry price and a rule", reply: "The rule will protect you tomorrow." },
          { label: "Wait for a pullback to the average", reply: "An entry by plan is cheaper than an emotional one." },
        ],
      },
      {
        title: "Round 3 · −10% pullback",
        situation: "The stock pulled back 10% from its peak. It's scary.",
        choices: [
          { label: "Sell everything so you don't lose more", reply: "Selling in fear locks in what could have recovered." },
          { label: "Hold according to plan", reply: "Your plan was written in a calm state, and it's right." },
        ],
      },
      {
        title: "Round 4 · A rule for the future",
        situation: "Which rule will you take with you?",
        choices: [
          { label: "Buy only per a written scenario", reply: "A scenario separates the decision from your mood." },
          { label: "Buy if everyone in the chat agrees", reply: "A chat vote is not a strategy." },
          { label: "Buy on emotion, but small", reply: "A small emotional trade is still emotional." },
        ],
      },
    ],
  },

  "scalping-master": {
    intro: "Minute charts, short trades and lots of noise. The key is not to overtrade.",
    lesson: "Scalping relies on entry discipline and on commissions. Frequent trades without an edge eat capital.",
    rounds: [
      {
        title: "Round 1 · Spike",
        situation: "A sharp move of +1.2% in 2 minutes on the minute chart.",
        choices: [
          { label: "Enter right away", reply: "A move without confirmation often reverses." },
          { label: "Wait for volume confirmation", reply: "Confirmation reduces the number of false entries." },
          { label: "Don't trade at all", reply: "Not trading is also a result." },
        ],
      },
      {
        title: "Round 2 · Locking in",
        situation: "Position +0.5%. Price is choppy.",
        choices: [
          { label: "Lock in +0.5%", reply: "A small profit according to plan — that's what scalping is." },
          { label: "Wait for +3%", reply: "Greed turned a plus into a minus." },
          { label: "Reverse the position", reply: "Reversing without a signal is a new impulsive trade." },
        ],
      },
      {
        title: "Round 3 · Losing streak",
        situation: "Three losing trades in a row. You want to win it back.",
        choices: [
          { label: "Double the size to win it back", reply: "Trying to win it back is the road to a big loss." },
          { label: "Take a break", reply: "A pause restores clarity." },
          { label: "Reduce the size", reply: "A smaller size means less emotion on the next mistake." },
        ],
      },
      {
        title: "Round 4 · Commissions",
        situation: "Broker commissions ate almost all of the month's profit.",
        choices: [
          { label: "Trade less often, only on strong signals", reply: "Fewer trades mean lower commissions." },
          { label: "Trade more to win back the commissions", reply: "Frequency for its own sake eats capital." },
        ],
      },
    ],
  },

  "invest-quiz": {
    intro: "A quick term battle. Answer questions before the AI rival pulls ahead.",
    lesson: "Basic terms are the foundation of any decision. Don't trade on a word you don't know.",
    rounds: [
      {
        title: "Question 1 of 4",
        situation: "What is a dividend?",
        explain: "A dividend is the part of a company's profit it pays out to shareholders. A commission is a fee paid to a broker for a trade, and a tax is a mandatory payment to the state, not income from the company.",
        choices: [
          { label: "Part of the profit that a company pays to shareholders", reply: "Correct! A dividend is a share of profit for shareholders." },
          { label: "A broker's commission", reply: "Not correct. A commission is a fee paid to the broker." },
          { label: "A tax on a trade", reply: "Not correct. A tax is a separate obligation." },
        ],
      },
      {
        title: "Question 2 of 4",
        situation: "What does “stop-loss” mean?",
        explain: "A stop-loss is a sell order set in advance that triggers if the price falls to a given level. This caps the loss before emotions start making decisions for you. A buy order does the opposite.",
        choices: [
          { label: "A sell order at a set price level", reply: "Correct! A stop-loss limits the loss." },
          { label: "A buy order", reply: "Not correct." },
          { label: "A broker's premium", reply: "Not correct." },
        ],
      },
      {
        title: "Question 3 of 4",
        situation: "What is diversification?",
        explain: "Diversification means spreading money across different assets. If one stock falls, the others soften the blow to the whole portfolio. Buying one stock is the opposite — concentrated risk — and a short sale is a bet on a fall.",
        choices: [
          { label: "Spreading money across different assets", reply: "Correct! This reduces the risk of any single stock." },
          { label: "Buying one stock", reply: "Not correct — that's concentration." },
          { label: "A short sale", reply: "Not correct." },
        ],
      },
      {
        title: "Question 4 of 4",
        situation: "What is a bond?",
        explain: "A bond is a debt security: the issuer borrows your money, pays coupons and returns the face value on time. A share of a business is a stock, not a bond.",
        choices: [
          { label: "A debt security: you lend money and receive a coupon", reply: "Correct! A bond is the issuer's debt to you." },
          { label: "A share in a business", reply: "Not correct — that's a stock." },
          { label: "A currency", reply: "Not correct." },
        ],
      },
    ],
  },

  "bear-trail": {
    intro: "A bear market lasts for months. See if you can get through it without panic.",
    lesson: "A bear market is a time for regular contributions. A panic sale locks in the loss and removes the chance to recover.",
    rounds: [
      {
        title: "Round 1 · Half a year down",
        situation: "The bear market has lasted half a year; the portfolio is −18%.",
        choices: [
          { label: "Sell everything and come back later", reply: "Almost no one can really “come back later” — the market often rises without announcements." },
          { label: "Buy in equal parts", reply: "Regular buying on the way down lowers your average price." },
          { label: "Hold without buying more", reply: "You kept the position, but without a plan for growth." },
        ],
      },
      {
        title: "Round 2 · Worse news",
        situation: "Another −7%. The news is grim, headlines scream about a crash.",
        choices: [
          { label: "Sell at the bottom, before it gets worse", reply: "Selling at the bottom is the most expensive button." },
          { label: "Hold according to plan", reply: "The plan was written before the panic; follow it." },
          { label: "Review the holdings, don't sell everything", reply: "A targeted review beats a total sale." },
        ],
      },
      {
        title: "Round 3 · False bounce",
        situation: "+8% rise this week. Everyone is sure the bottom is in.",
        choices: [
          { label: "Invest everything at once", reply: "The bounce turned out to be temporary, and you entered at the peak of hope." },
          { label: "Keep the contribution plan", reply: "Contributions don't depend on market mood." },
          { label: "Sell everything and get out", reply: "You exited before the recovery." },
        ],
      },
      {
        title: "Round 4 · Long distance",
        situation: "What do you choose for a 10-year horizon?",
        choices: [
          { label: "Regular contributions and yearly rebalancing", reply: "A simple system that survives bears." },
          { label: "Wait for the perfect bottom", reply: "Nobody knows the perfect bottom." },
          { label: "Don't invest until it drops further", reply: "While you wait, the market leaves without you." },
        ],
      },
    ],
  },

  "bond-shield": {
    intro: "Build the defensive part of a portfolio that cushions stock shocks.",
    lesson: "Bonds and cash don't deliver maximum growth, but they reduce drawdowns. Set the shares in advance.",
    rounds: [
      {
        title: "Round 1 · Structure",
        situation: "Stocks are very volatile. How do you split the money?",
        choices: [
          { label: "60% bonds and funds, 40% stocks", reply: "The defensive part cushions the fall." },
          { label: "100% stocks", reply: "Without protection, the first crash hits you in full." },
          { label: "100% cash", reply: "Cash doesn't grow; inflation slowly but surely eats it." },
        ],
      },
      {
        title: "Round 2 · Stocks −10%",
        situation: "Stocks fell 10%. Bonds barely changed.",
        choices: [
          { label: "Hold 60/40", reply: "The structure works — you didn't break the plan." },
          { label: "Sell bonds, buy more stocks", reply: "You went against the protection exactly when you needed it." },
        ],
      },
      {
        title: "Round 3 · Rates rise",
        situation: "Rates rose and bonds dropped 3%.",
        choices: [
          { label: "Rebalance to target weights", reply: "Rebalancing buys what got cheaper, following your own plan." },
          { label: "Sell bonds in a panic", reply: "Selling after a drop locks it in." },
        ],
      },
      {
        title: "Round 4 · Annual plan",
        situation: "Time to set the rules for the year.",
        choices: [
          { label: "Write down the weights and a yearly rebalancing rule", reply: "A written plan is the best defense against impulses." },
          { label: "Change the weights after every news item", reply: "Constant reshuffling eats returns." },
        ],
      },
    ],
  },

  "diversify-lab": {
    intro: "Compare a portfolio of one stock with a portfolio spread across many sectors.",
    lesson: "Diversification doesn't cancel falls, but it stops one piece of news from destroying everything.",
    rounds: [
      {
        title: "Round 1 · One stock",
        situation: "Your portfolio is one stock. On news it fell 35%.",
        choices: [
          { label: "Add 2 stocks from different sectors", reply: "The first step toward stability." },
          { label: "Double the position in the same stock", reply: "You increased exactly the point that let you down." },
          { label: "Change nothing", reply: "Concentration risk remains." },
        ],
      },
      {
        title: "Round 2 · Sector fell",
        situation: "Banks fell 20%, the other sectors hold.",
        choices: [
          { label: "Return to the 10-sector weights", reply: "Rebalancing reduces the impact of one sector." },
          { label: "Sell everything", reply: "One piece of news shouldn't lead to a full sale." },
          { label: "Keep 3 stocks from one sector", reply: "Three stocks from one sector is almost the same concentration." },
        ],
      },
      {
        title: "Round 3 · Comparison",
        situation: "Which portfolio is more resilient in a market fall?",
        choices: [
          { label: "A portfolio of 10 sectors", reply: "Smaller drawdown, faster recovery." },
          { label: "One high-growth stock", reply: "High growth means high risk." },
          { label: "One bond", reply: "One security is still one point of failure." },
        ],
      },
      {
        title: "Round 4 · How many stocks",
        situation: "How many stocks are enough for basic diversification?",
        choices: [
          { label: "About 10–20 from different sectors and countries", reply: "Broad enough without spreading too thin." },
          { label: "Just one, but the best one", reply: "Even the best stock can fall." },
          { label: "A hundred stocks without analysis", reply: "Quantity without analysis doesn't give protection." },
        ],
      },
    ],
  },

  "stop-loss-duel": {
    intro: "Entry at 250 ₽. Set a stop before entering and check that it really protects you.",
    lesson: "A stop is set before entry and defines position size. Risk per trade should be a small share of capital.",
    rounds: [
      {
        title: "Round 1 · Entry and stop",
        situation: "You buy at 250 ₽. Where is the stop-loss?",
        choices: [
          { label: "Stop at 240 ₽ (−4%), set before entry", reply: "Risk is limited in advance." },
          { label: "No stop: “it'll recover”", reply: "Without a stop you hand the decision to the market." },
          { label: "Stop at 200 ₽ (−20%)", reply: "Too wide a stop — almost all the risk remains." },
        ],
      },
      {
        title: "Round 2 · Bounce to 260 ₽",
        situation: "The price rose to 260 ₽. What do you do with the stop?",
        choices: [
          { label: "Move the stop to breakeven (250 ₽)", reply: "Now the trade cannot turn into a loss." },
          { label: "Remove the stop so you're not shaken out", reply: "You have a profit, but no more protection." },
        ],
      },
      {
        title: "Round 3 · Pullback to 245 ₽",
        situation: "The price reached 255 ₽ and is falling back to 245 ₽.",
        choices: [
          { label: "Trailing stop triggered, locking in +2%", reply: "The stop executed by the rule and kept the profit." },
          { label: "Move the stop down so you don't sell", reply: "Moving a stop down is the most common mistake." },
        ],
      },
      {
        title: "Round 4 · Position size",
        situation: "What risk per trade do you take?",
        choices: [
          { label: "No more than 1–2% of capital", reply: "Even a series of mistakes won't wipe out your capital." },
          { label: "Half of the capital in one trade", reply: "One mistake and the trading is over." },
          { label: "All of the capital in one trade", reply: "That's a lottery, not trading." },
        ],
      },
    ],
  },

  "news-oracle": {
    intro: "The news is out and the price is already reacting. Noise or signal?",
    lesson: "Not every news item is a signal. A decision based on pre-written criteria beats a reaction in the first minute.",
    rounds: [
      {
        title: "Round 1 · Loud news",
        situation: "The company announced a deal with a major partner. Price +6%.",
        choices: [
          { label: "Buy right away", reply: "The price has already reacted; you're buying last." },
          { label: "Wait for confirmation in the report", reply: "Confirmation separates signal from noise." },
          { label: "Sell, the news is a trap", reply: "Acting against the first reaction is also an emotion." },
        ],
      },
      {
        title: "Round 2 · Report disappointed",
        situation: "Revenue +2% vs. +10% expected. The price falls.",
        choices: [
          { label: "Exit: the signal is bad", reply: "A weak report is a reason to review the position." },
          { label: "Average down, waiting for a rise", reply: "Averaging down against a disappointment is a risky bet." },
          { label: "Hold without analysis", reply: "Without analysis you're just hoping." },
        ],
      },
      {
        title: "Round 3 · Rumor",
        situation: "A channel says: “insider info, buy.” The source is unknown.",
        choices: [
          { label: "Check the source and volume", reply: "Checking is cheap protection against rumors." },
          { label: "Buy on the rumor", reply: "Buying on anonymous insider info is a lottery." },
        ],
      },
      {
        title: "Round 4 · Time's up",
        situation: "Time is up. What do you decide?",
        choices: [
          { label: "By the pre-written criteria", reply: "Rules are stronger than emotions in the last minute." },
          { label: "By the first emotion", reply: "The first emotion is the worst advisor." },
        ],
      },
    ],
  },

  "portfolio-60": {
    intro: "Build a portfolio for your risk and horizon. Decisions are made quickly.",
    lesson: "Portfolio structure is set by goal and horizon, not by the latest news. Under time pressure, a ready template helps.",
    rounds: [
      {
        title: "Round 1 · Low risk, 10 years",
        situation: "Goal: growth with low risk. Horizon 10 years.",
        choices: [
          { label: "60% bonds, 40% index fund", reply: "Balanced for the goal and horizon." },
          { label: "100% one company", reply: "Concentration doesn't fit low risk." },
          { label: "100% cash", reply: "Cash doesn't grow over 10 years." },
        ],
      },
      {
        title: "Round 2 · Money needed in 2 years",
        situation: "Goal: an apartment in 2 years.",
        choices: [
          { label: "Bonds and cash", reply: "A short horizon requires preserving capital." },
          { label: "50% crypto", reply: "For a short horizon with money you need, such risk is unacceptable." },
          { label: "100% growth stocks", reply: "Stocks can drop right when you need to buy." },
        ],
      },
      {
        title: "Round 3 · 5-year horizon",
        situation: "Horizon 5 years, medium risk.",
        choices: [
          { label: "60% index, 40% bonds", reply: "A balance of growth and protection for medium risk." },
          { label: "One stock, 100%", reply: "One stock is too high a risk for medium." },
          { label: "100% cash", reply: "Cash won't meet a 5-year goal." },
        ],
      },
      {
        title: "Round 4 · Rebalance in 60 seconds",
        situation: "After an 8% drop, the stock share rose to 70%. The timer is running.",
        choices: [
          { label: "Return the weights to target", reply: "Rebalancing is a simple way to stay disciplined." },
          { label: "Sell everything", reply: "Selling everything is a reaction to noise." },
          { label: "Do nothing, even though the share has drifted far", reply: "The weights have drifted from plan — the plan no longer works." },
        ],
      },
    ],
  },
};
