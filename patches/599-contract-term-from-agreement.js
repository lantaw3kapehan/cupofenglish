// 22 Oct · Misty: the 2-year term counts from the teacher's latest signed Agreement (first or renewal — e.g. Mayi renewed on 21 Oct);
// only Agreements older than 2 years count from Addendum No. 1 (Clause 1.10 as revised).
// Agreement date: signed in the app by both, or recorded as paper, or the "Agreement date" in the teacher's details.
require('../tools/lib.js')(process.argv[2], [
[`function termOf(rows, docs){ const add = (docs || []).filter(d => d.kind === 'addendum' || d.kind === 'agreement').map(d => d.id);
    const st = (rows || []).filter(r => add.indexOf(r.doc_id) >= 0 && r.status === 'signed' && r.pres_at).map(r => Math.max(new Date(r.signed_at).getTime(), new Date(r.pres_at).getTime())).sort((a, b) => b - a)[0];
    if(!st) return null;`,
 `function termOf(rows, docs, pp){ const Y2 = 730.5 * 864e5, ids = k => (docs || []).filter(d => d.kind === k).map(d => d.id);
    const both = r => r.status === 'signed' && r.pres_at ? Math.max(new Date(r.signed_at).getTime(), new Date(r.pres_at).getTime()) : 0;
    const addEff = Math.max(0, ...(rows || []).filter(r => ids('addendum').indexOf(r.doc_id) >= 0).map(both));
    const ag = ids('agreement'), agr = Math.max(0, ...(rows || []).filter(r => ag.indexOf(r.doc_id) >= 0).map(r => r.status === 'paper' && r.paper_date ? new Date(r.paper_date + 'T00:00:00+08:00').getTime() : both(r)),
      pp && pp.agreement_date ? new Date(pp.agreement_date + 'T00:00:00+08:00').getTime() : 0);
    let st = 0; if(agr && (addEff ? addEff - agr <= Y2 : Date.now() - agr <= Y2)) st = agr; else if(addEff) st = addEff;
    if(!st) return null;`],
[`const T = termOf(MY.rows, MY.docs);`, `const T = termOf(MY.rows, MY.docs, MY.people);`],
[`const T9 = termOf(rs, AD.docs);`, `const T9 = termOf(rs, AD.docs, (AD.people || []).find(x => x.teacher === t.name));`],
[`const T8 = termOf(rs, AD.docs);`, `const T8 = termOf(rs, AD.docs, pp);`],
[`'<div class="box"><h3>Contract term</h3><div class="fine" style="margin:0">Two years from the day you and the President have both signed Addendum No. 1 (Clause 1.10).</div></div>'`,
 `'<div class="box"><h3>Contract term</h3><div class="fine" style="margin:0">Two years from your latest signed Agreement (first or renewal), or from the day Addendum No. 1 is signed by both if your Agreement is older than two years (Clause 1.10).</div></div>'`],
[`' · two-year term starts when both have signed'`, `' · two-year term: add the Agreement date (details below) or record the paper Agreement'`],
]);
