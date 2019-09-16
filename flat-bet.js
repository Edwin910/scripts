var config = {
  wager: { label: "Wager", type: "balance", value: 10 },
  target: { label: "Target", type: "multiplier", value: 10 }
};

while (true) {
    const { multiplier } = await this.bet(config.wager.value, config.target.value)
    if (multiplier >= config.target.value) {
        break
    }
}var config = {
    baseBet: { type: 'balance', label: 'Base Bet', value: 200},
    payout: { type: 'multiplier', label: 'Payout', value: 2.00},
    actions: { type: 'text', label: 'Action Limit', value: "20"},
    betSpd: { type: 'text', label: 'Bet Speed', value: "2000"},
    debug: { type: 'checkbox', label: 'Debug Log', value: false}
};
const baseBet = config.baseBet.value, payout = config.payout.value;
const actionLimit = parseInt(config.actions.value), debug = config.debug.value;
const betSpeed = Math.ceil(config.betSpd.value/actionLimit);
let roster = [], outQueue = [], inQueue = [];

function roundBit(bet) { return Math.max(10, Math.round(bet / 100) * 100); }
function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
for(let w = 0, len = (actionLimit * 2); w < len; w++) {roster.push(baseBet/2, baseBet/2);}
if (debug) this.log(`Starting.. Roster(${roster.length})`);
for(;;){
    for(let i = 0, len = inQueue.length; i < len; i++){
        let result = inQueue.pop();
        if(result.multiplier < result.target){
            roster.push(result.value);
            if (debug) this.log(`Won ${(result.value*(result.target-1))/100} bits`);
        }else{
            roster.push(baseBet);
            if (debug) this.log(`Lost ${result.value/100} bits`);
        }
        if (i >= actionLimit || inQueue.length ) break;
        await sleep(betSpeed);
    }
    for(let i = 0, len = roster.length; i < (len / 2); i++){
        let wager = roundBit(roster[0]+roster[roster.length-1]);
        outQueue.push(wager); roster.pop(); roster.shift();
        if (debug) this.log(`Queued bet for ${wager/100} bits. (${i}/${roster.length/2}`);
        await sleep(betSpeed);
    }
    for(let i = 0, len = outQueue.length; i < len; i++){
        let wager = outQueue.pop();
        Promise.resolve(this.bet(wager, payout)).then((r)=>{ inQueue.push(r) });
        if (debug) this.log(`Placed bet for ${wager/100} bits.`);
        if (i >= actionLimit || outQueue.length < 1) break;
        await sleep(betSpeed);
    }
    await sleep(actionLimit);
}
