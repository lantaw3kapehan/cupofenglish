// 1101: (Misty, 26 Oct 09:49) one centralized colour + button system across every screen, tab and dialog.
// Keeps teal/purple identity, Fredoka One headings and the Inter supporting font (no font change).
// · Tokens (html:root): primary #00707A (white text 5.9:1) · hover #005E66 · pressed #004E55 · focus ring;
//   status green ok / amber pending / red error-destructive / blue info, each with text, tint and border that pass AA.
// · Buttons: primary = solid teal, white text (every .btn.teal / .btn.primary / plain .btn); secondary = white with a
//   neutral outline (.btn.ghost); "row" secondary = white with a teal outline (primary buttons that repeat in a list or
//   sit next to another primary are toned down, so each group keeps ONE strongest action); destructive = red text with
//   a red outline, pushed to the end of its row (Refund, Delete, Remove, Void, Cancel class, Stop classes, Decline…),
//   solid red only as the full-width confirm inside a dialog. Existing confirmations and permissions untouched.
//   Distinct hover / pressed / focus-visible / loading (aria-busy) / disabled states everywhere.
// · Selected filters and segments: teal tint + teal outline + semibold (colour plus shape), instead of solid purple fills.
//   Form choices (book, goals, ratings) stay solid but in AA colours. Tabs: 3 px teal underline. Navigation: sidebar
//   tint + bar; phone bottom bar: tinted pill behind the icon, bold label and a top bar on the current screen.
// · Status chips get an icon as well as colour: ✓ done (green) · ◷ pending (amber) · ! problem (red) · info (blue).
// · Readability: faint grey text darkened to AA; white initials / rank badges on light colours get a darker tint.
// · Parent report window: Copy picture stays the main action; Save PDF, Copy message and Return to teacher move under
//   "More actions" (same buttons, same handlers).
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
const A = ':is(#app,#sheet)', Z = ':not(#z1101):not(#y1101)';
const PRI = `${A} .btn:not(.ghost):not(.x1101-sec):not(.x1101-dz):not(.x1101-dzs):not(.coral):not(.on):not(.m1000-p .btn):not(.lk):not([class*="link"]):not(:where(#wxG) .btn)`;
const SEGA = ['.seg>button.on', '.tx-seg>button.on', '.x73 .fl button.on', '.bl-chips button.on', '.bl-tog button.on', '.e2-m .all.on', '.ex-ch button.on',
  '.py-chips button.on', '.tc2-bar button.on', '.fd14 button.on', '.rg37 button.on', '.ac2-tf button.on', '.mo-who button.on', '.s2-d.on', '.fl button.on'].map(x => `${A} ${x}${Z}`);
const SEG = SEGA.join(',');
const SEGD = suf => SEGA.map(x => x + suf).join(',');
const PICK = ['#cBk .bk button.on', '#cQP button.on', '.gx-c button.on', '#mvMin button.on', '.skc button.on', '.fbpick button.on', '#nKind button.on'].map(x => `${A} ${x}${Z}`).join(',');
const css = `
html:root{--c-pri:#00707A;--c-pri-h:#005E66;--c-pri-a:#004E55;--c-ring:rgba(0,112,122,.55);
 --c-ok:#1E6E4C;--c-ok-bg:#E6F4EC;--c-ok-bd:#BFE0CE;--c-warn:#7A4A00;--c-warn-bg:#FFF4DE;--c-warn-bd:#EFD39C;
 --c-bad:#B42318;--c-bad-bg:#FDECEA;--c-bad-bd:#F0BDB6;--c-info:#1D5FA8;--c-info-bg:#E8F1FB;--c-info-bd:#C3D8F1;
 --mute:#5E5A76;--d-mute:#5E5A76;--d-faint:#6B6783;--d-teal:#00838F}
/* ── primary: one solid teal action ── */
${PRI}{background:var(--c-pri)!important;border:1px solid var(--c-pri)!important;color:#fff!important;box-shadow:none!important;text-shadow:none!important}
${PRI}:hover{background:var(--c-pri-h)!important;border-color:var(--c-pri-h)!important}
${PRI}:active{background:var(--c-pri-a)!important;transform:translateY(1px)}
${PRI} svg{color:#fff}
/* ── secondary: neutral outline · row secondary: teal outline ── */
${A} .btn.ghost{background:#fff!important;border:1px solid #CFCBDD!important;color:#2B2450!important;box-shadow:none!important}
${A} .btn.ghost:hover{background:#F4F3F8!important;border-color:#B4AFC8!important}
${A} .btn.ghost:active{background:#ECEAF3!important;transform:translateY(1px)}
${A} .btn.x1101-sec:not(:where(#wxG) .btn)${Z}{background:#fff!important;border:1px solid #8CC5CA!important;color:#00616A!important;box-shadow:none!important}
${A} .btn.x1101-sec${Z}:hover{background:#EEF8F9!important;border-color:#00707A!important}
${A} .btn.x1101-sec${Z}:active{background:#E1F2F4!important;transform:translateY(1px)}
/* ── destructive ── */
${A} :is(.btn,button).x1101-dz${Z},${A} .btn.coral${Z}{background:#fff!important;border:1px solid var(--c-bad-bd)!important;color:var(--c-bad)!important;box-shadow:none!important}
${A} :is(.btn,button).x1101-dz${Z}:hover,${A} .btn.coral${Z}:hover{background:var(--c-bad-bg)!important;border-color:var(--c-bad)!important}
${A} :is(.btn,button).x1101-dzs${Z},#sheet .btn.block.x1101-dz${Z}{background:var(--c-bad)!important;border:1px solid var(--c-bad)!important;color:#fff!important;box-shadow:none!important}
${A} :is(.btn,button).x1101-dzs${Z}:hover,#sheet .btn.block.x1101-dz${Z}:hover{background:#912018!important}
${A} .x1101-end{margin-left:auto!important}
.m1000-p .btn.x1101-dz{color:var(--c-bad)!important}
#rpAct .m1000-p{top:auto!important;bottom:calc(100% + 6px)!important}
.m1000-p .x1101-dzsep{height:1px;background:#EEECF3;margin:4px 6px}
${A} .btn.x1101-pri${Z}{background:var(--c-pri)!important;border-color:var(--c-pri)!important;color:#fff!important}
/* ── states ── */
${A} .btn{transition:background-color .12s,border-color .12s,transform .06s}
${A} :is(.btn,button):is(:disabled,[disabled],[aria-disabled="true"])${Z}{opacity:.5!important;cursor:not-allowed!important;transform:none!important;filter:none!important}
${A} :is(.btn,button)[aria-busy="true"]${Z}{cursor:progress!important;opacity:.75!important}
:is(#app,#sheet,nav,#login) :is(a,button,summary,input,select,textarea,[tabindex]):focus-visible{outline:3px solid var(--c-ring)!important;outline-offset:2px!important}
/* ── selected filters / segments: tint + outline + weight ── */
${SEG}{background:#E3F4F5!important;color:#00575F!important;border-color:#00707A!important;box-shadow:inset 0 0 0 1px #00707A!important;font-weight:600!important}
${SEGD(' :is(b,i,span)')}{color:inherit}
/* ── form choices: solid, AA ── */
${PICK}{background:var(--c-pri)!important;border-color:var(--c-pri)!important;color:#fff!important}
${A} #nKind button.on.wk${Z},${A} #monVisit .gx-rv button.on.n${Z}{background:var(--c-bad)!important;border-color:var(--c-bad)!important;color:#fff!important}
${A} #monVisit .gx-rv button.on.o${Z}{background:#8A5300!important;border-color:#8A5300!important;color:#fff!important}
${A} #monVisit .gx-rv button.on.s${Z}{background:var(--c-ok)!important;border-color:var(--c-ok)!important;color:#fff!important}
/* ── tabs: 3px teal underline on the current tab ── */
${A} :is(.mo-tabs,.stu-tabs)>button.on${Z}{box-shadow:inset 0 -3px 0 #00707A!important;color:#2B2450!important}
${A} .x73 .tabs button.on${Z}{box-shadow:inset 0 -3px 0 #00707A,0 1px 2px rgba(47,39,82,.12)!important}
/* ── navigation ── */
nav button.on${Z}{color:#00575F!important;font-weight:700!important}
@media(min-width:900px){nav button.on${Z}{background:#E3F4F5!important;box-shadow:inset 3px 0 0 #00707A!important}}
@media(max-width:899px){nav button.on${Z}{background:transparent!important;box-shadow:inset 0 3px 0 #00707A!important}
 nav button.on${Z} svg{background:#D7EFF1!important;border-radius:12px;padding:3px 10px!important;width:44px!important;height:28px!important;margin:-3px 0!important;color:#00575F}
 nav button:not(.on) .nl{color:#4C4868}}
/* ── status chips: icon + colour ── */
${A} :is(.chip.green,.chip.t-ok)${Z}{background:var(--c-ok-bg)!important;color:var(--c-ok)!important}
${A} :is(.chip.amber,.chip.t-warn)${Z}{background:var(--c-warn-bg)!important;color:var(--c-warn)!important}
${A} :is(.chip.red,.chip.coral,.chip.t-bad)${Z}{background:var(--c-bad-bg)!important;color:var(--c-bad)!important}
${A} :is(.chip.teal,.chip.t-info)${Z}{background:var(--c-info-bg)!important;color:var(--c-info)!important}
${A} .chip .i1101{font-weight:700;margin-right:4px;font-style:normal}
/* ── readable supporting text ── */
#v-books :is(.n,.s,.l){color:#3F3B58!important}
#v-home a:not(.btn){color:#005F67}
${A} .sa-l.minus${Z}{color:#A33A23!important}
${A} .sa-l.soon${Z}{color:#7A4A00!important}
${SEGD(' :not(.chip):not(.dot):not(.i1101)')}{color:inherit!important}
${A} :is(.mute,.hint,.sub,.sl2,.lbl,.cap,.meta)${Z}{color:#5E5A76}
${A} .x1101-dk{background-image:linear-gradient(rgba(24,18,48,.34),rgba(24,18,48,.34))!important}
`;
const js = String.raw`
(function(){
  if(window.__1101) return; window.__1101 = 1;
  var DZ = /^[^A-Za-z]{0,3}(delete\b|remove\b|refund\s*$|void\b|cancel class|cancel\s*·|cancel the class|cancel lesson|cancel this class|cancel the \d|stop classes|stop this schedule|decline\b|revoke\b|terminate\b|remove access|remove the link|discard\b|delete video)/i;
  var NEG = /needs action|unexcused/i, ICON = /^[\s]*[✓✔✕✗×!⚠◷●•▲▼★☆⏳✅❌⭐🔴🟢🟡]/;
  var lum = function(c){ var m = String(c).match(/[\d.]+/g); if(!m) return null; var f = function(x){ x /= 255; return x <= .03928 ? x / 12.92 : Math.pow((x + .055) / 1.055, 2.4); }; return .2126 * f(+m[0]) + .7152 * f(+m[1]) + .0722 * f(+m[2]); };
  var lab = function(b){ return String(b.textContent || '').replace(/\s+/g, ' ').trim(); };
  var KEEP = /^(i['’]m in|time in|time-in|i am in)/i;   /* time-critical: never toned down */
  function isPri(b){ return b.classList.contains('btn') && !KEEP.test(lab(b)) && !/classIn\(|timeIn\(/.test(b.getAttribute('onclick') || '') && !b.matches('.ghost,.x1101-sec,.x1101-dz,.x1101-dzs,.coral,.on,.lk') && !b.closest('.m1000-p,nav,.seg,.stu-tabs,.mo-tabs,#wxG') && b.offsetParent; }
  function pass(root){
    if(!root) return;
    var B = root.querySelectorAll('.btn,button');
    for(var k = 0; k < B.length; k++){ var b = B[k]; if(b.dataset.x1101) continue; b.dataset.x1101 = '1'; if(b.closest('nav')) continue;
      var t = lab(b), st = b.getAttribute('style') || '';
      if(/#D4705A|#C2483A|#D9734E/i.test(st)) b.classList.add(NEG.test(t) ? 'x1101-dzs' : 'x1101-pri');
      else if(DZ.test(t) && !b.classList.contains('on')){ b.classList.add('x1101-dz');
        var p = b.parentElement; if(p && !b.closest('.m1000-p') && b.nextElementSibling == null && b.previousElementSibling){ var cs = getComputedStyle(p); if(/flex/.test(cs.display) && !/column/.test(cs.flexDirection)) b.classList.add('x1101-end'); } } }
    /* one strongest action per group */
    var P = [].filter.call(root.querySelectorAll('.btn'), isPri), byP = new Map(), byL = {};
    P.forEach(function(b){ var p = b.parentElement; if(!byP.has(p)) byP.set(p, []); byP.get(p).push(b); var l = lab(b).toLowerCase(); if(l) (byL[l] = byL[l] || []).push(b); });
    var fnOf = function(b){ return (String(b.getAttribute('onclick') || '').match(/^[\s\w.$]*?([\w$]+)\s*\(/) || [])[1] || ''; };
    byP.forEach(function(L, p){ if(L.length < 2) return; var f0 = fnOf(L[0]); if(f0 && L.every(function(b){ return fnOf(b) === f0 && lab(b).length <= 14; }) && p.querySelector(':scope>.btn.ghost')) return; /* a picker (same handler, other choices outline) */
      L.slice(1).forEach(function(b){ b.classList.add('x1101-sec'); }); });
    var ROW = [];
    Object.keys(byL).forEach(function(l){ if(byL[l].length > 1) byL[l].forEach(function(b){ if(!b.classList.contains('x1101-sec')){ b.classList.add('x1101-sec'); ROW.push(b); } }); });
    /* repeated cards / rows that each carry a solid button: row actions, not the page's main action */
    P.forEach(function(b){ if(b.classList.contains('x1101-sec')) return; var c = b.parentElement;
      for(var d = 0; d < 5 && c && c !== root; d++, c = c.parentElement){ var par = c.parentElement; if(!par || !c.className) continue; var cn = String(c.className).split(' ')[0]; if(!cn) continue;
        if(c.tagName === 'SECTION' || /^(sec|ov-card|stu2|sheet-in)$/.test(cn)) break;
        var sib = [].filter.call(par.children, function(x){ return x !== c && String(x.className).split(' ')[0] === cn && x.querySelector('.btn:not(.ghost)'); });
        if(sib.length >= 2){ b.classList.add('x1101-sec'); ROW.push(b); break; } } });
    /* a dialog keeps one solid action: the widest (the main next step); the others become teal outline */
    if(root.id === 'sheet' && !root.querySelector('.stu2')){ var Q = P.filter(function(b){ return !b.classList.contains('x1101-sec') && b.offsetParent; }); if(Q.length > 1){ var w = Q.slice().sort(function(a, b){ return b.offsetWidth - a.offsetWidth; })[0]; Q.forEach(function(b){ if(b !== w) b.classList.add('x1101-sec'); }); } }
    /* no page-level main action left: the first row action (the next thing to do) stays solid */
    if(ROW.length && !P.some(function(b){ return !b.classList.contains('x1101-sec'); })){ ROW.sort(function(a, b){ return a.compareDocumentPosition(b) & 4 ? -1 : 1; }); ROW[0].classList.remove('x1101-sec'); }
    /* chips: icon + colour */
    root.querySelectorAll('.chip:not([data-i1101])').forEach(function(c){ c.dataset.i1101 = '1'; var ic = c.matches('.green,.t-ok') ? '✓' : c.matches('.amber,.t-warn') ? '◷' : c.matches('.red,.coral,.t-bad') ? '!' : ''; if(!ic || ICON.test(c.textContent || '')) return;
      var sp = document.createElement('i'); sp.className = 'i1101'; sp.setAttribute('aria-hidden', 'true'); sp.textContent = ic; c.insertBefore(sp, c.firstChild); });
    /* white text on light colour badges: darker tint */
    fixText(root);
  }
  var rgb = function(c){ c = String(c); var v = (c.match(/[\d.]+/g) || []).map(Number); if(/^color\(srgb/.test(c)){ v = v.map(function(x, j){ return j < 3 ? x * 255 : x; }); } return v; };
  var L3 = function(a){ var f = function(x){ x /= 255; return x <= .03928 ? x / 12.92 : Math.pow((x + .055) / 1.055, 2.4); }; return .2126 * f(a[0]) + .7152 * f(a[1]) + .0722 * f(a[2]); };
  var CR = function(a, b){ var x = L3(a), y = L3(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
  var OWN = null;
  function bgAt(e){ OWN = null; while(e && e.nodeType === 1){ var cs = getComputedStyle(e), a = rgb(cs.backgroundColor), solid = a.length && (a[3] == null || a[3] > .9);
      if(cs.backgroundImage !== 'none'){ if(/url\(/.test(cs.backgroundImage)) return null; var g = cs.backgroundImage.match(/(rgba?\([^)]*\)|color\([^)]*\))/); if(!g) return null; var o = rgb(g[1]), al = o[3] == null ? 1 : o[3], u = solid ? a : (bgAt(e.parentElement) || [255, 255, 255]); OWN = e; return [0, 1, 2].map(function(j){ return o[j] * al + u[j] * (1 - al); }); }
      if(solid){ OWN = e; return a; } e = e.parentElement; } return [255, 255, 255]; }
  /* safety net: text that still misses AA (4.5:1, 3:1 from 24 px / 18.7 px bold) — white text on a light colour gets a darker
     tint behind it, coloured text on a light background is darkened toward the ink colour until it passes */
  function fixText(root){ var E = root.querySelectorAll('span,b,i,em,small,strong,div,a,p,td,th,label,li,h3,h4,button'), n = 0;
    for(var k = 0; k < E.length && n < 20000; k++){ var e = E[k]; if(e.dataset.k1101 || !e.offsetParent) continue; e.dataset.k1101 = '1'; n++;
      if(!e.firstChild || ![].some.call(e.childNodes, function(x){ return x.nodeType === 3 && x.textContent.trim().length > 0; })) continue;
      if(e.closest('svg,canvas,#printArea,.docprint,.paper,.memo,.sd,.ivp,.ivq,.tr-page,[data-doc],nav,[disabled]')) continue;
      var cs = getComputedStyle(e); if(+cs.opacity < .95) continue; var fg = rgb(cs.color); if(fg[3] != null && fg[3] < .9) continue; var bg = bgAt(e); if(!bg) continue;
      var fs = parseFloat(cs.fontSize), need = (fs >= 24 || (fs >= 18.66 && +cs.fontWeight >= 700)) ? 3 : 4.5; if(CR(fg, bg) >= need) continue;
      if(L3(fg) > .6){ var ow = OWN; if(ow && ow !== document.body && ow.closest && !ow.matches('#app,#sheet,main,section,.sec') && getComputedStyle(ow).backgroundImage === 'none'){ for(var a = .2; a <= .8; a += .05){ var bl = [0, 1, 2].map(function(j){ return bg[j] * (1 - a) + [24, 18, 48][j] * a; }); if(CR(fg, bl) >= need){ ow.style.setProperty('background-image', 'linear-gradient(rgba(24,18,48,' + a.toFixed(2) + '),rgba(24,18,48,' + a.toFixed(2) + '))', 'important'); break; } } } continue; }
      for(var t = .1; t <= 1.001; t += .1){ var nc = [0, 1, 2].map(function(j){ return Math.round(fg[j] * (1 - t) + [43, 36, 80][j] * t); }); if(CR(nc, bg) >= need){ e.style.setProperty('color', 'rgb(' + nc.join(',') + ')', 'important'); break; } } } }
  function all(){ try{ var v = typeof VIEW !== 'undefined' && document.getElementById('v-' + VIEW); pass(v); var sh = document.getElementById('sheet'); if(sh && sh.classList.contains('on')) pass(sh); moreRp(); }catch(e){} }
  /* parent report window: one main action */
  function moreRp(){ var el = document.getElementById('rpAct'); if(!el || el.querySelector('#rpNote') || el.querySelector('.m1000')) return;
    var keep = /^(copy picture|share \/ save picture|save picture|mark as sent|send again on wechat)$/i, mv = [].filter.call(el.querySelectorAll(':scope>.btn,:scope>.row>.btn'), function(b){ return b.offsetParent && !keep.test(lab(b)); });
    if(mv.length < 2) return; var d = document.createElement('details'); d.className = 'm1000'; d.innerHTML = '<summary class="btn ghost">More actions</summary><div class="m1000-p"></div>'; var pn = d.lastChild;
    mv.forEach(function(b){ if(b.classList.contains('x1101-dz') || /return to teacher/i.test(lab(b))){ var sep = document.createElement('div'); sep.className = 'x1101-dzsep'; pn.appendChild(sep); } pn.appendChild(b); });
    el.appendChild(d); }
  var q = 0, later = function(){ clearTimeout(q); q = setTimeout(all, 120); };
  ['render', 'go', 'openSheet', 'rpBtns', 'renderReports', 'renderAStudents', 'renderStudents', 'renderPayroll', 'renderToday'].forEach(function(n){ var f = window[n]; if(typeof f !== 'function') return; window[n] = function(){ var r = f.apply(this, arguments); later(); return r; }; });
  var sb = document.getElementById('sheetBody'); if(sb) new MutationObserver(later).observe(sb, { childList: true });
  var mo = new MutationObserver(later); document.querySelectorAll('[id^="v-"]').forEach(function(v){ mo.observe(v, { childList: true }); });
  var deep = 0, app = document.getElementById('app'); if(app) new MutationObserver(function(){ if(deep) return; deep = setTimeout(function(){ deep = 0; all(); }, 700); }).observe(app, { childList: true, subtree: true });
  var sh2 = document.getElementById('sheet'); if(sh2) new MutationObserver(function(){ if(deep) return; deep = setTimeout(function(){ deep = 0; all(); }, 700); }).observe(sh2, { childList: true, subtree: true });
  window.__x1101 = all; setTimeout(all, 1500); setTimeout(all, 4000);
})();
`;
s = s.slice(0, i) + '<style id="d1101">/* 1101 · colour + button system */' + css + '</style>\n<script>' + js + '</script>\n' + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
