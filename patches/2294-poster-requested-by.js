// 2294 (Misty 17 Nov 10:49, cancellation picture): the reason read "Take a break from class tonight · From the parent" in big bold.
// The picture now shows the reason on its own, and a separate line "Requested by · 申请方  Parent · 家长" (Teacher · 老师 /
// CupOfEnglish · 一杯英语 / Force majeure · 不可抗力). Older reasons typed as "- From parent" are read the same way.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
 ["const why = String(P.why == null ? (e.why || '') : P.why).trim();",
  `let why = String(P.why == null ? (e.why || '') : P.why).trim(), rq2294 = '';
try{ if(typeof cxWho2293 === 'function'){ const a = cxWho2293(why); why = a.r.trim(); rq2294 = a.k; if(P.zh){ const z = cxWho2293(P.zh); P.zh = z.r.trim(); rq2294 = rq2294 || z.k; } } }catch(x){}   /* 2294 */`],
 ["if((!mv && !cl && !bl) || why || P.zh) rows.push(['Reason', '原因', why ? wrap(why, '700 30px ' + F, 700) : [], P.zh ? wrap(P.zh, '400 26px ' + F, 700) : []]);",
  "if((!mv && !cl && !bl) || why || P.zh) rows.push(['Reason', '原因', why ? wrap(why, '700 30px ' + F, 700) : [], P.zh ? wrap(P.zh, '400 26px ' + F, 700) : []]);\n" +
  "if(rq2294){ const RQ = { parent: ['Parent', '家长'], teacher: ['Teacher', '老师'], company: ['CupOfEnglish', '一杯英语'], force: ['Force majeure', '不可抗力'] }[rq2294]; if(RQ) rows.push(['Requested by', '申请方', [RQ[0]], [RQ[1]]]); }"],
]);
