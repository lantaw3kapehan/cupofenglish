// 2359 (Misty 18 Nov: "they are paid by CupOfEnglish"): Celine's government contributions are paid by CupOfEnglish, not taken from her pay · My pay says so and nothing is subtracted (the database estimate no longer subtracts them either).
const file = process.argv[2];
require('../tools/lib.js')(file, [
["${p.govEmployer ? ', taken from your pay as part of your deductions' + (cur.govEst ? ' (already counted in this estimate)' : '') : ''}", "${p.govEmployer ? ', paid by CupOfEnglish and not taken from your pay' : ''}"],
["(Math.round(((+cur.deduct || 0) - (p.govEmployer ? +cur.gov || 0 : 0)) * 100) / 100)", "(Math.round((+cur.deduct || 0) * 100) / 100)"]
]);
