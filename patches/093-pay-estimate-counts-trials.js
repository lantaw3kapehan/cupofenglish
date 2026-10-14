// 14 Oct · Teacher pay estimate (Misty, Julia: "Estimated October ₱9,390" vs History "Oct 2026 ₱9,660"). T-DASH › W (nowPay) adds
// regular + sub classes only; trial classes are paid at the same rate but are not regular units. Every teacher's gap was exactly
// trial units × rate (Julia 1.5 × 180 = 270, Mayi 180, April 160, Pam 100…). The estimate now = T-DASH pay + trial units × rate,
// on the teacher's Pay screen, the teacher home "pay so far" and the management teacher page. Regular units are unchanged.
require('../tools/lib.js')(process.argv[2], [
["function renderPay(){",
 "function nowPayOf(m){ m = m || {}; return Math.round((+m.nowPay || 0) + (+m.nowTrial || 0) * (+m.rate || 0)); }   /* 14 Oct: trials paid at the same rate, not regular units */\nfunction renderPay(){"],
["const est = (me.nowPay||0) + (me.monthBonus||0) - (me.monthDeduct||0);",
 "const est = nowPayOf(me) + (me.monthBonus||0) - (me.monthDeduct||0);"],
["${peso((me.nowPay||0)+(me.monthBonus||0)-(me.monthDeduct||0))}</b><span>pay so far</span>",
 "${peso(nowPayOf(me)+(me.monthBonus||0)-(me.monthDeduct||0))}</b><span>pay so far</span>"],
["${peso((m.nowPay||0)+(m.monthBonus||0)-(m.monthDeduct||0))}</b><span>pay so far</span>",
 "${peso(nowPayOf(m)+(m.monthBonus||0)-(m.monthDeduct||0))}</b><span>pay so far</span>"],
]);
