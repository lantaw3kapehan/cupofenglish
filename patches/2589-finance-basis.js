// 2589 (audit QA-08/09, verified 21 Nov): the forecasts use different assumptions (Briefing counts sales still expected; Sales & costs
// "if no more sales" counts none) but did not say so; the 12-month note said "so far, before salaries" though the month's net already
// takes off the salaries accrued to date; "Net (also called profit)" did not name its basis. Wording only: the numbers and the way they
// are worked out are unchanged (checked: the salaries still to pay = average month − salaries already in this month, not counted twice).
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["const MONEY_DEF = '<b>Net</b> (also called profit) = sales − total costs. Total costs = recorded expenses + net salaries + government dues, worked out by the database every 10 minutes.",
   "const MONEY_DEF = '<b>Net</b> (operating net, a management summary, not an accountant\\'s profit statement) = sales − total costs. Total costs = recorded expenses + net salaries + government dues, by the month they are recorded (equipment bought counts as an expense in its month), worked out by the database every 10 minutes."],
  ["${cur ? ` * ${esc(mon(cur))} so far, before salaries.` : ''}",
   "${cur ? ` * ${esc(mon(cur))} so far: salaries accrued up to today are taken off; the rest of the month's salaries are not yet.` : ''}"],
  ["`Net so far ${P(cur.net)} (actual, ${esc(rng877)}) − about ${P(still)} in salaries${stillG ? ' and dues' : ''} still to pay (estimate, from the ${full.length}-month average) · set that aside`",
   "`Scenario: no more sales this month. Net so far ${P(cur.net)} (actual, ${esc(rng877)}, salaries accrued to date included) − about ${P(still)} in salaries${stillG ? ' and dues' : ''} still to pay (estimate: ${full.length}-month average − what is already in) · Briefing's forecast also adds the sales still expected, so it differs`"],
  ["'<div class=\"bz-legend\"><span><i class=\"bz-in1\"></i>Received</span><span><i class=\"bz-in2\"></i>Still expected</span><span><i class=\"bz-out\"></i>Salaries, bills and dues</span></div></div>'; }",
   "'<div class=\"bz-legend\"><span><i class=\"bz-in1\"></i>Received</span><span><i class=\"bz-in2\"></i>Still expected</span><span><i class=\"bz-out\"></i>Salaries, bills and dues</span></div>' +\n        '<div style=\"font-size:12px;color:#6C6883;margin-top:6px\">Forecast: received ' + about(rec) + ' + still expected ' + about(rest) + ' (estimate) − going out ' + about(o.costMonth) + '. Sales & costs › \\'if no more sales\\' leaves out the still-expected sales.</div></div>'; }   /* 2589 */"],
]);
