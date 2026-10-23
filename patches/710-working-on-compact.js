// 710: (QA) "Working on" groups by status on one line each (e.g. Further training: IELTS · TOEFL · Pathways) instead of one pill per book;
// smaller pills on phones so the card stays short.
require('../tools/lib.js')(process.argv[2], [
["'<div class=\"tx-bdg\"><b class=\"tx-bl\">Working on:</b>' + WK(d, who).map(x => '<span class=\"wk\" style=\"--c:' + x[2] + '\">' + e(x[0]) + ' <small>' + e(x[1]) + '</small></span>').join('') + '</div>'",
 "'<div class=\"tx-bdg tx-wk\"><b class=\"tx-bl\">Working on:</b><div class=\"grow\">' + ['In training', 'Training completed', 'Further training'].map(s => { const L = WK(d, who).filter(x => x[1] === s); return L.length ? '<div><b style=\"color:' + L[0][2] + '\">' + s + '</b> ' + L.map(x => e(x[0])).join(' · ') + '</div>' : ''; }).join('') + '</div></div>'"],
[".tx-cn{", ".tx-wk{align-items:flex-start}.tx-wk .grow{font-size:13px;line-height:1.55;color:var(--ink)}.tx-wk .grow b{font-size:12px;margin-right:4px}\n@media(max-width:620px){.tx-bdg span{font-size:11.5px;padding:3px 8px}}\n.tx-cn{"],
]);
