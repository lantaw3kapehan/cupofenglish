// 901: (Misty, 25 Oct 15:05) "preserve the current Finance Overview's visual character that I like. Centralize shared font
//      styles and use responsive sizing appropriate for laptops and phones. Aim for body text around 16px, avoid tiny labels,
//      support text zoom and Chinese characters, and maintain readable contrast and touch targets. Treat these as usability
//      targets, not rigid sizes for every element. Do not globally switch to Inter."
// One central type scale for the APP SCREENS (documents untouched). FOR APPROVAL — screenshots in audit/typo/index.html.
// · Tokens (one place, :root of #ui901t): --fs-label 12 · --fs-small 13 · --fs-meta 14 · --fs-table 15 · --fs-text 15 laptop /
//   16 phone · --fs-body 16 · --fs-lead 16 / 16.5 · --fs-h3 17 · --fs-h2 19 / 18 · --fs-kpi 24 / 22 · --fs-h1 28 / 24, all in rem;
//   line-heights --lh-body 1.5, --lh-tight 1.3, --lh-head 1.2; weights --fw-text 400, --fw-strong 600, --fw-bold 700;
//   control height --ui-ctl 36px laptop / 44px phone (900 reads it). Phone = up to 640px wide.
// · Text zoom: html goes back to 100% (the app had html{font-size:16px/16.5px}, which blocks the phone's text-size setting);
//   every px font size on the app screens is re-expressed in rem, so browser / phone text zoom now scales the app text.
// · How (lightest approach, no renderer touched): like patch 880, the existing CSS rules are read once (and again when a screen
//   adds a stylesheet); every rule that sets a px font-size is re-emitted with the SAME selector (same specificity, same media
//   condition, last one wins) and the size moved onto the nearest step of the scale: ≤11.5px → label 12 · 12 → small 13 ·
//   12.5–13 → meta 14 · 13.5 → table 15 · 14–14.5 → text 15/16 · 15–15.5 → lead · 16–17.5 → h3 17 · 18–19.5 → h2 ·
//   20px and up keep their size (in rem). Inline style="font-size:Npx" written by the renderers gets the same mapping
//   through attribute selectors (CSS only). So hierarchy is kept (bigger stays bigger) and nothing is below 12px.
// · Fixed roles: page titles (#app main h1, .fx-h h1, .ui-h h1) → --fs-h1 in Fredoka One (unchanged font); KPI figures
//   (.fx-k b, .ui-k b) → --fs-kpi; Finance Overview controls (.fx .btn.sm / .fx-seg / .fx-bar inputs / .fx-m / .fx-pill) →
//   --ui-ctl high. Phones: primary buttons, tab/segment buttons and the bottom navigation are at least 44px high
//   (buttons inside table rows are left as they are so lists do not double in height).
// · Fonts are not changed here (880 keeps the Finance Overview system sans + Chinese fallbacks; Fredoka One for titles).
// · Never touched: documents and their previews (#printArea, .docprint, .paper, .memo, .sd, .ivp, .ivq, .tr-page, #rfNote,
//   [data-doc]) — they get back exactly the base size they inherited before (16px, 16.5px from 900px wide); SVG chart text;
//   @media print; rules naming a document. Off switch for comparison: localStorage coeType = '0' (reload).
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8'); const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 901 · Central responsive type scale (app screens only; documents untouched) */
(function(){
  if(window.__901) return; window.__901 = 1;
  try{ if(localStorage.getItem('coeType') === '0') return; }catch(e){}
  var ROOTS = '#app,#login,#sheet,#toast,#ivM,#wlM,#tapRes';
  var IN = ':where(#app,#app *,#login,#login *,#sheet,#sheet *,#toast,#toast *,#ivM,#ivM *,#wlM,#wlM *,#tapRes,#tapRes *)';
  var DOCS = '#printArea,.docprint,.paper,.memo,.sd,.ivp,.ivq,.tr-page,#rfNote,[data-doc]';
  var NOT = ':where(:not(:where(' + DOCS + ') *):not(:where(' + DOCS + ')):not(svg *))';
  var SKIP_SEL = /printArea|docprint|\.paper|\.memo|memo-|\.sd\b|\.ivp|\.ivq|tr-page|rfNote|@page|data-doc|(^|[\s>+~,(])(svg|text|tspan)\b|^(html|body|:root)$/;
  /* the scale: [token, upper bound of declared px] — px at or above 20 keep their size (as rem) */
  var STEPS = [['label', 11.75], ['small', 12.25], ['meta', 13.25], ['table', 13.75], ['text', 14.75], ['lead', 15.75], ['h3', 17.75], ['h2', 19.75]];
  var tok = function(px){ for(var k = 0; k < STEPS.length; k++) if(px < STEPS[k][1]) return 'var(--fs-' + STEPS[k][0] + ')'; return (Math.round(px / 16 * 10000) / 10000) + 'rem'; };

  var T = [
    /* phone first (≤640px), then laptop / tablet */
    ':root{--fs-label:.75rem;--fs-small:.8125rem;--fs-meta:.875rem;--fs-table:.9375rem;--fs-text:1rem;--fs-body:1rem;--fs-lead:1.03125rem;',
    '--fs-h3:1.0625rem;--fs-h2:1.125rem;--fs-kpi:1.375rem;--fs-h1:1.5rem;--lh-body:1.5;--lh-tight:1.3;--lh-head:1.2;',
    '--fw-text:400;--fw-strong:600;--fw-bold:700;--ls-label:.04em;--ui-ctl:44px;--tap:44px}',
    '@media(min-width:641px){:root{--fs-text:.9375rem;--fs-lead:1rem;--fs-h2:1.1875rem;--fs-kpi:1.5rem;--fs-h1:1.75rem;--ui-ctl:36px;--tap:36px}}',
    /* text zoom: html back to 100% so rem follows the phone / browser text size */
    'html{font-size:100%}body{font-size:var(--fs-body);line-height:var(--lh-body)}',
    /* documents keep exactly the base size they inherited before (zero specificity: their own rules still win) */
    ':where(' + DOCS + '):where(:not(:where(' + DOCS + ') *)){font-size:16px;line-height:1.5}',
    '@media(min-width:900px){:where(' + DOCS + '):where(:not(:where(' + DOCS + ') *)){font-size:16.5px}}'
  ].join('');
  var P = [
    /* fixed roles */
    ':is(#app main h1,.fx-h h1,.ui-h h1)' + NOT + '{font-size:var(--fs-h1);line-height:var(--lh-head)}',
    ':is(.fx-k b,.ui-k b)' + NOT + '{font-size:var(--fs-kpi)}',
    ':is(.fx-k span,.ui-k span,.fx-pr span,.fx th,.ui-t th)' + NOT + '{letter-spacing:var(--ls-label)}',
    /* Finance Overview controls: same look, a little taller */
    '.fx .btn.sm,.fx-seg,.fx-bar select,.fx-bar input,.fx-m,.fx-pill{height:auto;min-height:var(--ui-ctl)}',
    '.fx-seg,.ui-seg{height:auto;min-height:var(--ui-ctl);align-items:stretch}.fx-seg button,.ui-seg button{min-height:calc(var(--ui-ctl) - 4px)}',
    '.fx-m button{min-width:32px;min-height:calc(var(--ui-ctl) - 6px)}',
    /* touch targets: --tap = 36px laptop / 44px phone. Real height for buttons, tabs and segments ... */
    ':where(' + ROOTS + ') :is(.btn.sm,.seg button,.mo-tabs button,.tabs button,[role=tab])' + NOT + ':not(td *):not(th *){min-height:var(--tap)}',
    '.seg{height:auto}.seg button{height:auto}nav button{min-height:var(--tap)}',
    '#sheet .x{width:var(--tap);height:var(--tap)}:where(' + ROOTS + ') .iconbtn{min-width:var(--tap);min-height:var(--tap)}',
    /* ... and, for small chips inside a line (header status, filter chips, "Show"), a bigger invisible hit area so the look and
       line height stay the same */
    ':where(' + ROOTS + ') :is(.hd button,.sk2 button,.mo-who button,.mo-att button,.g891-t,.cxbtn,.s2-ar,.fx-m button,.fx-seg button,.ui-seg button,th button,.py-act .btn)' + NOT + '{position:relative}',
    ':where(' + ROOTS + ') :is(.hd button,.sk2 button,.mo-who button,.mo-att button,.g891-t,.cxbtn,.s2-ar,.fx-m button,.fx-seg button,.ui-seg button,th button,.py-act .btn)' + NOT + '::after{content:"";position:absolute;left:0;right:0;top:50%;height:max(100%,var(--tap));transform:translateY(-50%)}',
    /* phones: every primary button ≥ 44px; form fields 16px (also stops iPhone zooming into a field) */
    '@media(max-width:640px){:where(' + ROOTS + ') .btn' + NOT + ':not(td *):not(th *){min-height:var(--tap)}',
    'nav button{min-height:52px}:where(' + ROOTS + ') :is(input:not([type=checkbox]):not([type=radio]),select)' + NOT + '{min-height:var(--tap);font-size:max(var(--fs-text),1rem)}',
    /* bigger chart value labels: keep the last month\'s label inside the card */
    '.bz2-c:last-child b{left:auto;right:0;text-align:right}',
    /* 15px table text on a 390px phone: slightly narrower cell padding so Finance tables still fit */
    '.fx th,.fx td,.ui-t th,.ui-t td,#v-expenses th,#v-expenses td{padding-left:6px;padding-right:6px}}'
  ].join('\n');

  var t = document.createElement('style'); t.id = 'ui901t'; t.textContent = T;
  var o = document.createElement('style'); o.id = 'ui901o';
  var p = document.createElement('style'); p.id = 'ui901p'; p.textContent = P;

  /* inline style="font-size:Npx" from the renderers (CSS only, both spellings) */
  var inl = (function(){ var by = {}, v;
    for(v = 7; v <= 40; v += .5){ var k = tok(v); (by[k] = by[k] || []).push('[style*="font-size:' + v + 'px"]', '[style*="font-size: ' + v + 'px"]'); }
    return Object.keys(by).map(function(k){ return ':is(' + by[k].join(',') + ')' + IN + NOT + '{font-size:' + k + '!important}'; }).join('\n'); })();

  var seen = typeof WeakSet === 'function' ? new WeakSet() : null, MAP = new Map(), nRules = 0;
  var hasPseudoEl = function(q){ return /::|:(before|after|first-line|first-letter|placeholder|selection|marker|-webkit-[a-z-]+)\b/i.test(q); };
  var splitSel = function(sel){ var out = [], d = 0, cur = '';
    for(var k = 0; k < sel.length; k++){ var c = sel[k]; if(c === '(' || c === '[') d++; else if(c === ')' || c === ']') d--;
      if(c === ',' && d === 0){ out.push(cur.trim()); cur = ''; } else cur += c; }
    if(cur.trim()) out.push(cur.trim()); return out; };
  var fix = function(rule, cond){ var st = rule.style, sel = rule.selectorText || ''; if(!st || !sel) return;
    var f = st.getPropertyValue('font-size').trim(); if(!f) return;
    var m = /^(\d*\.?\d+)px$/.exec(f), pr = st.getPropertyPriority('font-size');
    splitSel(sel).forEach(function(q){ if(hasPseudoEl(q) || SKIP_SEL.test(q)) return;
      var key = cond + '|' + q; if(m){ var px = +m[1], v = tok(px); MAP.delete(key);
        /* table cells use the table step (15px) rather than running text (16px on phones) */
        if(v === 'var(--fs-text)' && /(^|[\s>+~(])(table|td|th|tr|tbody)\b/.test(q)) v = 'var(--fs-table)';
        if(px >= 7) MAP.set(key, { q: q, cond: cond, v: v, pr: pr }); } else MAP.delete(key); }); };
  var walk = function(rules, cond){
    for(var k = 0; k < rules.length; k++){ var r = rules[k]; if(seen){ if(seen.has(r)) continue; seen.add(r); } nRules++;
      if(r.type === 1) fix(r, cond);
      else if(r.type === 4){ var mt = r.conditionText || (r.media && r.media.mediaText) || ''; if(/print/i.test(mt) && !/screen/i.test(mt)) continue; walk(r.cssRules, cond ? cond + ' and ' + mt : mt); }
      else if(r.type === 12 && r.cssRules) walk(r.cssRules, cond); } };
  var emit = function(){ var out = [];
    MAP.forEach(function(e){ out.push((e.cond ? '@media ' + e.cond + '{' : '') + ':is(' + e.q + ')' + IN + NOT + '{font-size:' + e.v + (e.pr ? '!important' : '') + '}' + (e.cond ? '}' : '')); });
    window.__901stat = { rules: nRules, mapped: MAP.size }; return out.join('\n'); };
  var mine = function(n){ return n === t || n === o || n === p || (n && /^(a880[bo])$/.test(n.id)); };
  var last = '';
  var place = function(){ var h = document.head; if(h.lastElementChild === p && p.previousElementSibling === o) return; h.appendChild(t); h.appendChild(o); h.appendChild(p); };
  var scan = function(){ var t0 = performance.now();
    [].forEach.call(document.styleSheets, function(sh){ var on = sh.ownerNode; if(!on || on === t || on === o || on === p || !document.head.contains(on)) return;
      if(sh.media && sh.media.mediaText && /print/i.test(sh.media.mediaText) && !/screen/i.test(sh.media.mediaText)) return;
      var rs; try{ rs = sh.cssRules; }catch(x){ return; } if(rs) walk(rs, ''); });
    var txt = emit() + '\n' + inl; if(txt !== last){ last = txt; o.textContent = txt; }
    place(); window.__901stat.ms = Math.round(performance.now() - t0); };
  scan();
  var tq = 0, mo = new MutationObserver(function(ms){
    for(var k = 0; k < ms.length; k++) for(var j = 0; j < ms[k].addedNodes.length; j++){ var n = ms[k].addedNodes[j];
      if(!mine(n) && (n.nodeName === 'STYLE' || n.nodeName === 'LINK')){ clearTimeout(tq); tq = setTimeout(scan, 140); return; } } });
  mo.observe(document.head, { childList: true });
  addEventListener('load', function(){ setTimeout(scan, 350); });
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
