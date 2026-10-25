// 821: (Misty, screenshot) Payroll › "PAY tab" opened a narrow pop-up with the raw sheet: squashed text ("Chec ks"),
//      a side-scrolling table, cut-off columns.
// Now a wide, readable view of the same PAY tab (still live, still Print / PDF):
// · Top: the month, Still to pay · Paid · Checks as three tiles; the "Tick ✔ PAID…" line as a small note.
// · Each table (TO PAY · month, THIS MONTH SO FAR) as a clean table: names on the left, figures right-aligned, NET in bold,
//   "—" faint, empty columns hidden, the first column stays put when a phone scrolls sideways, Total row at the bottom.
// · CHECK + ✔ PAID become one status: green "Paid Oct 9", amber "Not paid yet", or the check's own words.
// · CHECKS BEFORE PAYDAY as a short list with a ⚠ per line (or "All clear").
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 821 · PAY tab, readable */
(function(){
  if(window.__821 || typeof tabSheet !== 'function') return; window.__821 = 1;
  document.head.insertAdjacentHTML('beforeend', '<style>' + [
    '.pt-h{display:flex;align-items:flex-start;gap:12px;flex-wrap:wrap;margin-bottom:6px}.pt-h h1{margin:0}.pt-h .grow{flex:1}.pt-h .sub{font-size:13px;color:#8A86A0;margin-top:4px}',
    '.pt-note{font-size:13px;color:#6F6B85;background:#F7F6FB;border-radius:12px;padding:10px 14px;margin:10px 0 14px;line-height:1.45}',
    '.pt-tiles{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:0 0 18px}.pt-t{border:1px solid var(--line);border-radius:16px;padding:12px 16px;background:#fff}',
    '.pt-t small{display:block;font-size:11.5px;letter-spacing:.05em;text-transform:uppercase;color:#8A86A0;margin-bottom:4px}.pt-t b{font-size:22px;font-family:"Fredoka One","Fredoka",Rockwell,sans-serif;font-weight:400}',
    '.pt-t.ok b{color:#1C7A55}.pt-t.warn b{color:#B4442F}',
    '.pt-sec{display:flex;align-items:baseline;gap:10px;margin:18px 0 8px}.pt-sec h2{margin:0;font-size:17px}.pt-sec span{font-size:12.5px;color:#8A86A0}',
    '.pt-w{overflow-x:auto;border:1px solid var(--line);border-radius:14px;background:#fff;-webkit-overflow-scrolling:touch}',
    '.pt-w table{width:100%;border-collapse:collapse;font-size:13.5px;font-family:inherit}',
    '.pt-w th{font-size:10.5px;letter-spacing:.06em;text-transform:uppercase;color:#8A86A0;background:#FAFAFC;padding:9px 10px;text-align:right;white-space:nowrap;font-weight:700}',
    '.pt-w td{padding:8px 10px;border-top:1px solid #F1F0F6;text-align:right;white-space:nowrap;font-variant-numeric:tabular-nums}',
    '.pt-w th:first-child,.pt-w td:first-child{text-align:left;position:sticky;left:0;background:inherit;z-index:1}.pt-w tr{background:#fff}.pt-w thead tr{background:#FAFAFC}',
    '.pt-w td:first-child{font-weight:700}.pt-w td.net{font-weight:800;color:#2B2253}.pt-w td.f{color:#C9C6D6}.pt-w td.st,.pt-w th.st{text-align:left}',
    '.pt-w tr.tot td{border-top:2px solid #E3E1EC;font-weight:800;background:#FAFAFC}',
    '.pt-chip{display:inline-block;font-size:12px;font-weight:700;border-radius:999px;padding:2px 9px}.pt-chip.ok{background:#E8F6EE;color:#1C7A55}.pt-chip.no{background:#FFF4E5;color:#9A5B10}.pt-chip.x{background:#F1F0F6;color:#55526E}',
    '.pt-chk{list-style:none;margin:0;padding:0;border:1px solid var(--line);border-radius:14px;background:#fff}.pt-chk li{padding:10px 14px;border-top:1px solid #F1F0F6;font-size:14px;line-height:1.45}.pt-chk li:first-child{border-top:0}',
    '.pt-chk li b{margin-right:6px}.pt-chk .ok{color:#1C7A55;font-weight:700}',
    '@media(max-width:640px){.pt-tiles{grid-template-columns:1fr 1fr}.pt-t b{font-size:18px}}',
    '@media print{.pt-w{overflow:visible;border:0}.pt-w th:first-child,.pt-w td:first-child{position:static}}'].join('') + '</style>');
  const T = x => String(x == null ? '' : x).trim(), dash = x => !x || x === '—' || x === '-';
  function table(head, rows){
    const cols = head.map((h, j) => j).filter(j => j === 0 || (head[j] && (rows.some(r => !dash(T(r[j]))) || /NET/.test(head[j]))));
    const iChk = head.findIndex(h => /^CHECK$/i.test(h)), iPaid = head.findIndex(h => /PAID/.test(h)), iNet = head.findIndex(h => /^NET$/i.test(h));
    const show = cols.filter(j => j !== iPaid && j !== iChk), hasSt = iChk > -1 && (rows.some(r => T(r[iChk])) || iPaid > -1);
    const st = r => { const c = T(r[iChk]).replace(/\s*·\s*payslip\s*↗?/i, ''), p = iPaid > -1 && /^(TRUE|✔|yes)$/i.test(T(r[iPaid]));
      if(/^paid/i.test(c) || (p && !c)) return '<span class="pt-chip ok">✓ ' + esc(c || 'Paid') + '</span>';
      if(c) return '<span class="pt-chip x">' + esc(c) + '</span>';
      return iPaid > -1 ? '<span class="pt-chip no">Not paid yet</span>' : ''; };
    return '<div class="pt-w"><table><thead><tr>' + show.map(j => '<th>' + esc(head[j]) + '</th>').join('') + (hasSt ? '<th class="st">Status</th>' : '') + '</tr></thead><tbody>' +
      rows.map(r => { const tot = /^total$/i.test(T(r[0]));
        return '<tr class="' + (tot ? 'tot' : '') + '">' + show.map(j => { const v = T(r[j]); return '<td class="' + (j === iNet ? 'net ' : '') + (j && dash(v) ? 'f' : '') + '">' + esc(v || (j ? '—' : '')) + '</td>'; }).join('') +
          (hasSt ? '<td class="st">' + (tot ? '' : st(r)) + '</td>' : '') + '</tr>'; }).join('') + '</tbody></table></div>'; }
  function view(R){ R = (R || []).map(r => (r || []).map(T)); let h = '', note = '', upd = '', month = '', tiles = '';
    const n1 = r => r.filter(Boolean).length;
    for(let k = 0; k < R.length; k++){ const r = R[k]; if(!n1(r)) continue;
      if(/TEACHER PAY/i.test(r[0]) && n1(r) === 1) continue;
      if(/^Tick /i.test(r[0])){ const m = r[0].match(/Updated ([^.]+)\./); if(m) upd = m[1]; note = r[0].replace(/\s*Updated [^.]+\.\s*$/, ''); continue; }
      if(/^Still to pay$/i.test(r[0])){ const pairs = []; for(let j = 0; j < r.length; j++) if(r[j] && !/^[₱—\-\d]/.test(r[j]) && !/clear|issue|\d/.test(r[j])){ let v = ''; for(let q = j + 1; q < r.length; q++) if(r[q]){ v = r[q]; break; } pairs.push([r[j], v]); }
        tiles = '<div class="pt-tiles">' + pairs.map(([l, v]) => '<div class="pt-t ' + (/^Still/i.test(l) ? (dash(v) ? 'ok' : 'warn') : /^Checks/i.test(l) ? (/clear/i.test(v) ? 'ok' : 'warn') : '') + '"><small>' + esc(l) + '</small><b>' + esc(/^Still/i.test(l) && dash(v) ? '₱0 · all paid' : v || '—') + '</b></div>').join('') + '</div>'; continue; }
      if(n1(r) === 1 && R[k + 1] && /^TEACHER$/i.test(R[k + 1][0])){ const head = R[k + 1], rows = []; let q = k + 2;
        for(; q < R.length && n1(R[q]); q++) rows.push(R[q]);
        const t = r[0].replace(/\s{2,}/g, ' '), m = t.match(/^(.*?)\s*·\s*(.*?)(\s*\((.*)\))?$/);
        h += '<div class="pt-sec"><h2>' + esc(m ? m[1].charAt(0) + m[1].slice(1).toLowerCase() + ' · ' + m[2] : t.charAt(0) + t.slice(1).toLowerCase()) + '</h2>' + (m && m[4] ? '<span>' + esc(m[4]) + '</span>' : '') + '</div>';
        if(/WHAT TO CHECK/i.test(head[1] || '')) h += rows.length ? '<ul class="pt-chk">' + rows.map(x => '<li>⚠ ' + (x[0] ? '<b>' + esc(x[0]) + '</b>' : '') + esc(x.slice(1).filter(Boolean).join(' · ')) + '</li>').join('') + '</ul>' : '<ul class="pt-chk"><li class="ok">✓ All clear</li></ul>';
        else h += table(head, rows);
        k = q - 1; continue; }
      if(n1(r) === 1 && /pay$/i.test(r[0]) && !month){ month = r[0]; continue; }
      if(n1(r) === 1){ h += '<div class="pt-sec"><h2>' + esc(r[0]) + '</h2></div>'; continue; }
      h += '<div class="pt-note">' + esc(r.filter(Boolean).join(' · ')) + '</div>'; }
    return '<div class="pt-h"><div class="grow"><h1>' + esc(month || 'Teacher pay') + '</h1><div class="sub">From the PAY tab · live' + (upd ? ' · updated ' + esc(upd) : '') + '</div></div>' + printBtn('sheetBody', month || 'Teacher pay') + '</div>' +
      tiles + (note ? '<div class="pt-note">' + esc(note) + '</div>' : '') + h; }
  const _ts = window.tabSheet;
  window.tabSheet = tabSheet = async function(key, title, pick, pick2){ if(key !== 'PAY' || pick) return _ts.apply(this, arguments);
    openSheet('<h1>Teacher pay</h1><div class="sk"></div><div class="sk"></div><div class="sk" style="width:70%"></div>'); $('sheet').classList.add('wide');
    const tk = 'coe.m.tab.PAY||'; window._tabK = tk;
    try{ await fastView(tk, () => api('mgmtTab', TOKEN, 'PAY', '', ''), r => { if(window._tabK !== tk || !$('sheet').classList.contains('on')) return; $('sheet').classList.add('wide'); $('sheetBody').innerHTML = view(r.rows); }); }
    catch(e){ $('sheetBody').innerHTML = '<h1>Teacher pay</h1><div class="empty">Could not load. Try again.</div>'; } };
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
