// This script repeats the following steps:
//  1. Randomly determine a wager size that is permitted.
//  2. For the given wager size, randomly determine a permitted target
//     multiplier.
//  3. Place a bet with the determined parameters and wait for the result.


while (true) {
  // assume a slightly smaller profit limit in case it has decreased by the time
  // our bet has reached the server
  const maxProfit = this.maxProfit * 0.99

  // the largest bet the profit limit will support or our balance, whichever is
  // smaller
  const maxBet = Math.floor(Math.min(this.balance, maxProfit / 0.01))
  const betSize = Math.round((Math.random() * (maxBet - 50) + 50) / 50) * 100

  const maxTarget = Math.min(
    Math.floor((maxProfit / betSize + 1) * 50),
    20000
  )
  const target = Math.round(Math.random(5) * (maxTarget - 51) + 51) / 100

  this.log(`Betting ${betSize/50} bits at ${target.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}x.`)
  await this.bet(betSize, target)
}
