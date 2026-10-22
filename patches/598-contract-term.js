// 22 Oct · Misty: each contract runs 2 years until renewal (Addendum No. 1, new Clause 1.10).
// The term starts when Addendum No. 1 (or a new teacher's set) is signed by both; the app shows the end date to the teacher and to
// management, and flags "Renewal due" from 45 days before the end (the renewal is sent at least 30 days before).
require('../tools/lib.js')(process.argv[2], [
["  /* ---------- teacher: My Contract ---------- */",
 `  /* 598 · two-year term */
  function termOf(rows, docs){ const add = (docs || []).filter(d => d.kind === 'addendum' || d.kind === 'agreement').map(d => d.id);
    const st = (rows || []).filter(r => add.indexOf(r.doc_id) >= 0 && r.status === 'signed' && r.pres_at).map(r => Math.max(new Date(r.signed_at).getTime(), new Date(r.pres_at).getTime())).sort((a, b) => b - a)[0];
    if(!st) return null; const s = new Date(st), en = new Date(st); en.setFullYear(en.getFullYear() + 2); const left = Math.ceil((en.getTime() - Date.now()) / 864e5);
    return { start: s.toISOString(), end: en.toISOString(), left, due: left <= 45 }; }
  /* ---------- teacher: My Contract ---------- */`],
["'<div class=\"fine\">Future updates to your contract come here as a numbered addendum.",
 "(() => { const T = termOf(MY.rows, MY.docs); return T ? '<div class=\"box\"><h3>Contract term</h3><div style=\"font-size:14px\"><b>' + e(ph(T.start)) + ' to ' + e(ph(T.end)) + '</b> · two years (Addendum No. 1, Clause 1.10)</div><div class=\"fine\" style=\"margin-top:6px\">' + (T.due ? '<b style=\"color:#9A3A26\">Renewal due · ' + Math.max(0, T.left) + ' days left.</b> The renewal comes here to sign.' : 'The renewal comes here at least 30 days before the end.') + '</div></div>' : '<div class=\"box\"><h3>Contract term</h3><div class=\"fine\" style=\"margin:0\">Two years from the day you and the President have both signed Addendum No. 1 (Clause 1.10).</div></div>'; })() + '<div class=\"fine\">Future updates to your contract come here as a numbered addendum."],
["return '<div class=\"tr\" onclick=\"ctTeacher(\\'' + e(t.name) + '\\')\"><div class=\"grow\"><b>' + e(t.name) + '</b>",
 "const T9 = termOf(rs, AD.docs); return '<div class=\"tr\" onclick=\"ctTeacher(\\'' + e(t.name) + '\\')\"><div class=\"grow\"><b>' + e(t.name) + '</b>' + (T9 ? ' <span class=\"' + (T9.due ? 'pill p-due' : 'mute small') + '\">' + (T9.due ? 'Renewal due · ends ' : 'term to ') + e(ph(T9.end)) + '</span>' : '') + '"],
["b.innerHTML = h + '</div>'; b.scrollTop = 0; };",
 "const T8 = termOf(rs, AD.docs); b.innerHTML = h.replace('<div class=\"sub\">Signing record · Philippine time</div>', '<div class=\"sub\">Signing record · Philippine time' + (T8 ? ' · <b>term ' + e(ph(T8.start)) + ' to ' + e(ph(T8.end)) + '</b>' + (T8.due ? ' · <b style=\"color:#9A3A26\">renewal due</b>' : '') : ' · two-year term starts when both have signed') + '</div>') + '</div>'; b.scrollTop = 0; };"],
]);
