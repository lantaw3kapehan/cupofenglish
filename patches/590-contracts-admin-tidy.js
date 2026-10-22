// 22 Oct · 587 follow-up (Contracts, management): document title and status wrap neatly on a phone;
// a paper Agreement not yet recorded says "Not recorded" instead of "Not sent".
require('../tools/lib.js')(process.argv[2], [
[`function adStatus(r){ if(!r) return ['p-grey', 'Not sent'];`, `function adStatus(r, d){ if(!r) return ['p-grey', d && d.kind !== 'addendum' ? 'Not recorded' : 'Not sent'];`],
[`signDocs.forEach(d => { const r = rs.find(x => x.doc_id === d.id); const [c, l] = adStatus(r);
      h += '<div class="box"><div style="display:flex;justify-content:space-between;gap:10px;align-items:center"><b>' + e(d.title) + '</b><span class="pill ' + c + '">' + e(l) + '</span></div>';`,
 `signDocs.forEach(d => { const r = rs.find(x => x.doc_id === d.id); const [c, l] = adStatus(r, d);
      h += '<div class="box"><div style="display:flex;justify-content:space-between;gap:6px 10px;align-items:center;flex-wrap:wrap"><b style="flex:1 1 200px">' + e(d.title) + '</b><span class="pill ' + c + '">' + e(l) + '</span></div>';`],
]);
