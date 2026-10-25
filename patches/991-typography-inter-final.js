// 991: (Misty, 25 Oct 16:40 / 19:14 · FINAL typography direction, supersedes earlier font notes incl. the 14:26 system-font note)
// "Inter as the main interface font throughout the app, with Noto Sans SC for Simplified Chinese and system sans-serif as the
//  final fallback. Fredoka One for the CupOfEnglish brand and main page titles only. Inter for section headings, navigation,
//  buttons, forms, tables, statuses, and financial figures. Body text and form inputs 16px · secondary 14px · section headings
//  18–20px · page titles 24px phones, 28–32px laptops. Regular body, medium controls, semibold headings and important amounts.
//  Tabular numerals for financial data, right-align comparable amounts. Centralize typography in shared styles."
// · ONE place: this end-of-head style (#a991) redefines the shared tokens that 880 (font) and 901 (sizes) already route every
//   app screen through, with higher specificity (html:root), so nothing else is edited:
//     --ui / --ui-font   Inter, "Noto Sans SC", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif
//     --fs-body / --fs-text 16 (phone and laptop) · --fs-small / --fs-meta 14 · --fs-label 13 (upper-case labels) ·
//     --fs-table 15 (dense data tables) · --fs-h3 18 · --fs-h2 20 · --fs-kpi 22 / 24 · --fs-h1 24 phone / 30 laptop
//     --fw-text 400 · --fw-ctl 500 · --fw-strong 600 (also --fw-bold: Inter is loaded up to 600)
// · Fonts loaded from Google Fonts: Inter 400/500/600 and Noto Sans SC 400/500/600 (Chinese glyphs only download when Chinese
//   text is on screen). Fredoka One stays loaded for the brand and page titles (h1, header name — patch 880's KEEP_BRAND).
// · Weights: buttons, navigation, tabs, segments and form fields → 500; section headings h2–h4 → 600 in Inter;
//   KPI / important amounts → 600; body 400.
// · Numbers: tabular numerals across Finance, tables and KPI figures; table columns whose cells are amounts or counts
//   (₱ / ¥ / % / plain numbers) are right-aligned with their header (marked by a small scan, class n991).
// · Form fields: 16px on laptops too (phones already).
// · Documents (payslips, invoices, agreements, receipts, reports, print) are NOT touched: everything is scoped to the app
//   screens and excludes #printArea, .docprint, .paper, .memo, .sd, .ivp, .ivq, .tr-page, #rfNote, [data-doc].
// · Off switch for comparison: localStorage coeType991 = '0' (reload).
const lib = require('../tools/lib.js'), fs = require('fs'), file = process.argv[2];
lib(file, [
  ["family=Arvo:wght@400;700&amp;family=Fredoka&#43;One&amp;display=swap",
   "family=Arvo:wght@400;700&amp;family=Fredoka&#43;One&amp;family=Inter:wght@400;500;600&amp;family=Noto&#43;Sans&#43;SC:wght@400;500;600&amp;display=swap"]
]);
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 991 · final typography: Inter + Noto Sans SC + system sans · Fredoka One for brand and page titles · one shared token set */
(function(){
  if(window.__991) return; window.__991 = 1;
  try{ if(localStorage.getItem('coeType991') === '0') return; }catch(e){}
  var UI = 'Inter,"Noto Sans SC",system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"PingFang SC","Microsoft YaHei",Arial,sans-serif';
  var ROOTS = '#app,#login,#sheet,#toast,#ivM,#wlM,#tapRes';
  var DOCS = '#printArea,.docprint,.paper,.memo,.sd,.ivp,.ivq,.tr-page,#rfNote,[data-doc]';
  var NOT = ':where(:not(:where(' + DOCS + ') *):not(:where(' + DOCS + ')))';
  var IN = function(sel){ return ':where(' + ROOTS + ') :is(' + sel + ')' + NOT; };
  var st = document.createElement('style'); st.id = 'a991';
  st.textContent = [
    'html:root{--ui:' + UI + ';--ui-font:' + UI + ';--fs-label:.8125rem;--fs-small:.875rem;--fs-meta:.875rem;--fs-table:.9375rem;--fs-text:1rem;--fs-body:1rem;--fs-lead:1rem;',
    '--fs-h3:1.125rem;--fs-h2:1.25rem;--fs-kpi:1.375rem;--fs-h1:1.5rem;--fw-text:400;--fw-ctl:500;--fw-strong:600;--fw-bold:600}',
    '@media(min-width:641px){html:root{--fs-text:1rem;--fs-kpi:1.5rem;--fs-h1:1.875rem}}',
    ':is(' + ROOTS + '){font-family:var(--ui);font-weight:var(--fw-text)}',
    /* controls: medium */
    IN('.btn,button,select,input,textarea,[role=tab],nav button,.seg button,.tabs button') + '{font-family:var(--ui);font-weight:var(--fw-ctl)!important}',
    IN('input:not([type=checkbox]):not([type=radio]),select,textarea') + '{font-size:max(var(--fs-text),1rem)}',
    /* section headings: Inter semibold, 18–20px */
    IN('h2,h3,h4') + '{font-family:var(--ui)!important;font-weight:var(--fw-strong)!important;letter-spacing:0}',
    /* important amounts: semibold, tabular */
    IN('.fx-k b,.ui-k b,.kpis b,.fx-pr b,.ov-n,.ov .num,.amt,.peso') + '{font-weight:var(--fw-strong)!important;font-variant-numeric:tabular-nums}',
    IN('.fx,.ui-t,.ui-k,table,td,th,.num,.n,.big,.big-num,.amt,.peso,b,strong') + '{font-variant-numeric:tabular-nums}',
    /* one size per role: section headings 18px · page titles 24 / 30px · secondary text 14px */
    IN('h2') + '{font-size:var(--fs-h3)!important;line-height:var(--lh-tight)}',
    '#app main h1:not(#z991a):not(#z991b)' + NOT + '{font-size:var(--fs-h1)!important;line-height:var(--lh-head)}',
    IN('.small,.mute.small,small') + '{font-size:var(--fs-meta)}',
    IN('td.n991,th.n991') + '{text-align:right!important}',
    /* page titles and the brand keep Fredoka One */
    IN('#app main h1,.fx-h h1,.ui-h h1,.hd .who,.brand') + '{font-weight:400}'
  ].join('\n');
  var place = function(){ if(document.head.lastElementChild !== st) document.head.appendChild(st); };
  place();
  /* keep this sheet after 880 / 901, which re-append theirs when a screen adds styles */
  new MutationObserver(function(ms){ for(var k = 0; k < ms.length; k++) for(var j = 0; j < ms[k].addedNodes.length; j++){ var n = ms[k].addedNodes[j]; if(n !== st && (n.nodeName === 'STYLE' || n.nodeName === 'LINK')){ setTimeout(place, 150); return; } } })
    .observe(document.head, { childList: true });
  addEventListener('load', function(){ setTimeout(place, 400); });
  /* right-align columns of amounts / counts (app tables only, never documents) */
  var NUM = /^[-−+]?\s*(₱|PHP|¥|CNY|RMB|\$)?\s*[-−+]?\d[\d,]*(\.\d+)?\s*(%|₱|¥|元|k|K)?$/;
  var tq = 0;
  function scan(){ try{ var root = document.getElementById('app'); if(!root) return; var T = root.querySelectorAll('table'), sh = document.getElementById('sheet'); if(sh) T = [].slice.call(T).concat([].slice.call(sh.querySelectorAll('table')));
      [].forEach.call(T, function(t){ if(t.closest(DOCS) || t.dataset.n991 === String(t.rows.length)) return; t.dataset.n991 = String(t.rows.length);
        var body = [].filter.call(t.rows, function(r){ return !r.closest('thead') && !r.querySelector('th[colspan]'); }), cols = {};
        body.forEach(function(r){ var x = 0; [].forEach.call(r.cells, function(c){ var span = c.colSpan || 1; if(span === 1 && c.tagName === 'TD'){ var v = (c.textContent || '').replace(/\s+/g, ' ').trim(); if(v && v !== '—' && v !== '-'){ var o = cols[x] || (cols[x] = { n: 0, y: 0 }); o.n++; if(NUM.test(v)) o.y++; } } x += span; }); });
        Object.keys(cols).forEach(function(x){ var o = cols[x]; if(o.n < 2 || o.y / o.n < 0.8 || +x === 0) return;
          [].forEach.call(t.rows, function(r){ var k = 0; [].some.call(r.cells, function(c){ if(k === +x && (c.colSpan || 1) === 1){ c.classList.add('n991'); return true; } k += c.colSpan || 1; return k > +x; }); }); }); }); }catch(e){} }
  new MutationObserver(function(){ clearTimeout(tq); tq = setTimeout(scan, 200); }).observe(document.body, { childList: true, subtree: true });
  setTimeout(scan, 1500);
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
lib(file, []);
