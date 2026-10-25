// 880: (Misty brief · Typography + #18 contrast) · REVISED 25 Oct 14:26: Misty prefers the Finance Overview fonts → the
//      UI font is the same system sans stack as Finance Overview (patch 823), not Inter; Inter is no longer loaded.
// one global, additive layer for the app screens only.
// · Fonts: Inter is added to the existing Google Fonts link. The app screens (#app, #login, the card #sheet, toast and the
//   invoice / wallet windows) use Inter for navigation, buttons, forms, tables, descriptions and statuses. Fredoka One stays
//   for h1 (main page titles and the "Good morning" greetings) and the header name. Figures use tabular numerals.
//   Every stack ends with Chinese fallbacks ("PingFang SC","Hiragino Sans GB","Microsoft YaHei","Noto Sans SC",sans-serif).
// · Contrast: light grey text colours (2.5–4.4:1 on white, e.g. #8A86A0, #A3A0B5, #9A96AE, literal #9E9E9E) become
//   #6B6782 / #6E6A85 (5.4:1 / 5.2:1) on the app screens. (--mute is already #76738A, 4.6:1, and is left alone.)
// · How: nothing in the existing CSS is edited. The script reads the existing rules once (and again when a screen adds
//   a stylesheet) and writes one end-of-head sheet (#a880o) with the same selectors, scoped to the app screens with
//   :where(), so specificity is unchanged and later/more specific rules (e.g. white text on a selected chip) still win.
//   Per selector only the LAST colour/font declared counts, as in the normal cascade.
// · Documents are never touched: the overrides only match inside the app screens and never inside a document preview
//   (.paper, .memo, .sd, .ivp, .ivq, .tr-page, .docprint, #printArea, [data-doc]). The print area and all picture/PDF capture
//   boxes (payslip/receipt PNG, agreement, invoice, refund note, trial and parent reports) are appended straight to <body>,
//   outside the app screens, so they keep Rockwell/Fredoka and their original colours. Rules naming a document and
//   @media print rules are skipped. Canvas-drawn parent pictures set their own fonts and are unaffected.
// · Off switch for comparison: localStorage coeTypo = '0' (reload).
const lib = require('../tools/lib.js'), fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 880 · Typography (Inter for the app, Fredoka One for titles) and text contrast · app screens only, documents untouched */
(function(){
  if(window.__880) return; window.__880 = 1;
  try{ if(localStorage.getItem('coeTypo') === '0') return; }catch(e){}
  var ZH = '"PingFang SC","Hiragino Sans GB","Microsoft YaHei","Noto Sans SC",sans-serif';
  /* 25 Oct (Misty): keep the Finance Overview fonts she likes — the same system sans stack as patch 823 (.fx), not Inter */
  var UI = '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,' + ZH;
  var ROOTS = '#app,#login,#sheet,#toast,#ivM,#wlM,#tapRes';
  var DOCS = '#printArea,.docprint,.paper,.memo,.sd,.ivp,.ivq,.tr-page,#rfNote,[data-doc]';
  var SKIP_SEL = /printArea|docprint|\.paper|\.memo|memo-|\.sd\b|\.ivp|\.ivq|tr-|rfNote|\.ph\b|\.mr-|@page|data-doc/;
  var KEEP_BRAND = /(^|[\s>+~,(])h1\b|\.hd \.who|\.brand|logo|\.tagl/;
  var MID = ['8a86a0','8a87a0','8f8ca3','8a879c','7a768f','7c7990','7c7893','8a8798','7a7690','8c89a3','8a8a9c','8a88a0','8a8799','7a7790'];
  var LIGHT = ['a3a0b5','9a97ae','9a96ae','a9a6b8','a9a6ba','9a9aae','9c98b0','a5a1b8','a3a1b0','9e9e9e','9a8f94'];
  var rgb = function(h){ return 'rgb(' + parseInt(h.slice(0,2),16) + ', ' + parseInt(h.slice(2,4),16) + ', ' + parseInt(h.slice(4,6),16) + ')'; };
  var CMAP = {}; MID.forEach(function(h){ CMAP[rgb(h)] = '#6B6782'; CMAP['#' + h] = '#6B6782'; }); LIGHT.forEach(function(h){ CMAP[rgb(h)] = '#6E6A85'; CMAP['#' + h] = '#6E6A85'; });

  /* 1 · base layer: Inter on the app screens (h1 keeps Fredoka One via --brand), originals inside document previews */
  var base = document.createElement('style'); base.id = 'a880b';
  base.textContent = [
    ':root{--ui:' + UI + '}',
    ':is(' + ROOTS + '){--f:var(--ui);--brand:"Fredoka One","Fredoka",var(--ui);font-family:var(--ui)}',
    ':where(' + ROOTS + ') :where(' + DOCS + '):where(:not(:where(' + DOCS + ') *)){--f:Rockwell,"Rockwell Nova",Arvo,Georgia,serif;--brand:"Fredoka One","Fredoka",Rockwell,"Rockwell Nova",Arvo,Georgia,serif;font-family:var(--f)}',
    ':where(' + ROOTS + ') :where(td,th,.num,.peso,.amt,.n,.big,.big-num,b,strong):where(:not(:where(' + DOCS + ') *)){font-variant-numeric:tabular-nums}'
  ].join('\n');
  document.head.appendChild(base);
  var rest = document.createElement('style'); rest.id = 'a880o';

  var seen = typeof WeakSet === 'function' ? new WeakSet() : null, MAP = new Map(), nRules = 0;
  var hasPseudoEl = function(p){ return /::|:(before|after|first-line|first-letter|placeholder|selection|marker|-webkit-[a-z-]+)\b/i.test(p); };
  var splitSel = function(sel){ var out = [], d = 0, cur = '';
    for(var k = 0; k < sel.length; k++){ var c = sel[k]; if(c === '(' || c === '[') d++; else if(c === ')' || c === ']') d--;
      if(c === ',' && d === 0){ out.push(cur.trim()); cur = ''; } else cur += c; }
    if(cur.trim()) out.push(cur.trim()); return out; };
  /* MAP keeps, per (media condition + selector), the LAST colour / font declared for it in the cascade order,
     so a later rule that changes the same selector wins exactly as before. */
  var fix = function(rule, cond){
    var st = rule.style, sel = rule.selectorText || ''; if(!st || !sel) return;
    var c = st.getPropertyValue('color').trim().toLowerCase(), ff = st.getPropertyValue('font-family'), fw = st.getPropertyValue('font-weight').trim();
    if(!c && !ff && !fw) return;
    splitSel(sel).forEach(function(p){ if(hasPseudoEl(p) || SKIP_SEL.test(p)) return; var key = cond + '|' + p, e = MAP.get(key) || { p: p, cond: cond };
      if(c){ e.c = c; e.cp = st.getPropertyPriority('color'); }
      if(ff){ e.ff = ff; e.fp = st.getPropertyPriority('font-family'); }
      if(fw){ e.fw = fw; e.wp = st.getPropertyPriority('font-weight'); }
      MAP.set(key, e); });
  };
  var emit = function(){ var out = [], nf = 0, nc = 0, scope = ':where(' + ROOTS + ') ', notDoc = ':where(:not(:where(' + DOCS + ') *):not(:where(' + DOCS + ')))';
    MAP.forEach(function(e){ var d = [];
      if(e.c && CMAP[e.c]){ d.push('color:' + CMAP[e.c] + (e.cp ? '!important' : '')); nc++; }
      if(e.ff && /Fredoka|var\(--brand\)/i.test(e.ff) && !KEEP_BRAND.test(e.p)){ d.push('font-family:var(--ui)' + (e.fp ? '!important' : ''), 'font-variant-numeric:tabular-nums');
        if(e.fw === '400' || e.fw === 'normal') d.push('font-weight:600' + (e.wp ? '!important' : '')); nf++; }
      if(d.length) out.push((e.cond ? '@media ' + e.cond + '{' : '') + scope + ':is(' + e.p + ')' + notDoc + '{' + d.join(';') + '}' + (e.cond ? '}' : '')); });
    window.__880stat = { rules: nRules, fonts: nf, colours: nc };
    return out.join('\n'); };
  var walk = function(rules, cond){
    for(var k = 0; k < rules.length; k++){ var r = rules[k]; if(seen){ if(seen.has(r)) continue; seen.add(r); } nRules++;
      if(r.type === 1) fix(r, cond);
      else if(r.type === 4){ var m = r.conditionText || (r.media && r.media.mediaText) || ''; if(/print/i.test(m) && !/screen/i.test(m)) continue; walk(r.cssRules, cond ? cond + ' and ' + m : m); }
      else if(r.type === 12 && r.cssRules) walk(r.cssRules, cond); }
  };
  var last = '';
  var scan = function(){ var t0 = performance.now();
    [].forEach.call(document.styleSheets, function(sh){ var o = sh.ownerNode; if(!o || o === base || o === rest || !document.head.contains(o)) return;
      if(sh.media && sh.media.mediaText && /print/i.test(sh.media.mediaText) && !/screen/i.test(sh.media.mediaText)) return;
      var rs; try{ rs = sh.cssRules; }catch(e){ return; } if(rs) walk(rs, ''); });
    var txt = emit(); if(txt !== last){ last = txt; rest.textContent = txt; }
    if(document.head.lastElementChild !== rest) document.head.appendChild(rest);
    window.__880stat.ms = Math.round(performance.now() - t0);
  };
  scan();
  var tq = 0, mo = new MutationObserver(function(ms){
    for(var k = 0; k < ms.length; k++) for(var j = 0; j < ms[k].addedNodes.length; j++){ var n = ms[k].addedNodes[j];
      if(n !== rest && n !== base && (n.nodeName === 'STYLE' || n.nodeName === 'LINK')){ clearTimeout(tq); tq = setTimeout(scan, 120); return; } } });
  mo.observe(document.head, { childList: true });
  addEventListener('load', function(){ setTimeout(scan, 300); });
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
lib(file, []);
