// 1007: (Misty, 25 Oct 21:00) design refinements on top of design v2 (1000–1003). Fonts unchanged.
// 1 · Student details header more compact (laptop and phone): WeChat line is one small line; the code/age/city/since and
//     teacher/book/partner chips flow on one wrapping line; tighter gaps; the weekly row sits closer — tabs come up higher.
// 2 · Contrast: every small text (under 18 px) on the app screens whose colour is below 4.5:1 against its own background is
//     darkened in the same hue until it reaches 4.5:1 (greys, greens, ambers, reds, wallet blues, chart labels, sidebar group
//     labels). One shared pass after each screen change; documents, white-on-colour badges and pictures are not touched.
//     Inactive tabs use the shared muted colour (#5E5A76, 6.4:1).
// 3 · Finance › Overview "Sales and costs" chart: a peso scale on the left (₱0 · ₱100k · …, worked out from the chart's own
//     points) and readable values: each month can be focused (Tab) or tapped — the line under the chart shows
//     "October 2027 · sales ₱379,620 · costs ₱189,931 · net …". On phones the first tap shows the values, a second tap opens
//     that month (as a click does on laptops). Screen readers get the same text (aria-label).
// 4 · Tab strips: the strips were 1 px taller than their box, so Windows showed a scrollbar beside them. Now no scrollbar
//     (vertical hidden; horizontal scrolling still works by swipe / trackpad / Shift+wheel, with a soft fade at the edge when
//     more tabs are off-screen) — every tab stays reachable on small screens.
// 5 · Students list: "1× a week · 25 min / 0.5 lessons a week" now reads "1 class a week · 25 min / = 0.5 lesson units a
//     week", with a one-line key above the list: classes are the scheduled sessions; lesson units are what the package counts
//     (1 unit = 50 min, so a 25-min class uses 0.5). Same numbers as before (worked out from S-MONTHLY units ÷ classes × 50).
const lib = require('../tools/lib.js'), fs = require('fs'), file = process.argv[2];
lib(file, [
  ["const per = w.cw ? w.cw + '× a week' : w.v + ' a week', len = w.mins ? w.mins + ' min' : '';",
   "const per = w.cw ? w.cw + ' class' + (w.cw === 1 ? '' : 'es') + ' a week' : w.v + ' lesson units a week', len = w.mins ? w.mins + ' min' : '';   /* 1007 */"],
  ["<small>${w.v} lesson${w.v === 1 ? '' : 's'} a week</small></span>`; };",
   "<small${w.cw ? ' title=\"Lesson units are what the package counts: 1 unit = 50 min, so a 25-min class uses 0.5\"' : ''}>${w.cw ? '= ' : ''}${w.v} lesson unit${w.v === 1 ? '' : 's'} a week</small></span>`; };"]
]);
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
const css = String.raw`
/* 1 · student header */
#sheet .stu2 .shero{padding:12px 16px 10px!important;row-gap:6px!important}
#sheet .stu2 .shero h1{line-height:1.15!important}
#sheet .stu2 #wxG{font-size:.8125rem!important;margin:0!important;line-height:1.35;gap:0 8px!important}
#sheet .stu2 #wxG>b{font-weight:500}
#sheet .stu2 .shero .row.hl{display:inline-flex!important;flex-direction:row!important;flex-wrap:wrap!important;margin:2px 12px 0 0!important;gap:2px 10px!important;vertical-align:top}
#sheet .stu2 .shero .row.hl .chip{padding:0!important;background:transparent!important;font-size:.875rem!important}
#sheet .stu2 .shwk{padding-top:6px!important;margin-top:6px!important;gap:6px 8px!important}
#sheet .stu2 .shwk .sl{padding:4px 12px!important;min-height:0!important}
#sheet .stu2 .shero .kpis{padding:4px 8px!important}
#sheet .stu2 .shero .kpis>div{padding:2px 10px!important}
@media(max-width:640px){
 #sheet #sheetBody.stu2 #wxG:not(#z1007){font-size:.75rem!important;display:block!important}
 #sheet #sheetBody.stu2 #wxG:not(#z1007) .btn{display:inline!important;margin-left:6px!important}
 #sheet #sheetBody.stu2 .shero .row.hl:not(#z1007){font-size:.8125rem!important}
 #sheet #sheetBody.stu2 .stu-tabs:not(#z1007){display:flex!important;flex-wrap:nowrap!important;overflow-x:auto!important}
 #sheet #sheetBody.stu2 .stu-tabs:not(#z1007)>button{flex:0 0 auto!important;white-space:nowrap!important;width:auto!important}
 #sheet #sheetBody.stu2 .shero .row.hl:not(#z1007)>*{display:inline-flex!important;width:auto!important}
 #sheet #sheetBody.stu2 .shero h1:not(#z1007){font-size:1.375rem!important}
 #sheet #sheetBody.stu2 .shero .kpis:not(#z1007) b{font-size:1.25rem!important}
 #sheet #sheetBody.stu2 .shwk:not(#z1007) .lb{display:none!important}
}
/* 2 · inactive tabs */
:is(#app,#sheet) :is(.mo-tabs,.stu-tabs)>button:not(.on){color:var(--d-mute,#5E5A76)!important}
/* 4 · tab strips: no scrollbar, still scrollable */
:is(#app,#sheet) :is(.mo-tabs,.stu-tabs,.seg){overflow-y:hidden!important;scrollbar-width:none;-ms-overflow-style:none}
:is(#app,#sheet) :is(.mo-tabs,.stu-tabs,.seg)::-webkit-scrollbar{display:none;width:0;height:0}
:is(#app,#sheet) :is(.mo-tabs,.stu-tabs).t1007-more{-webkit-mask-image:linear-gradient(90deg,#000 calc(100% - 36px),transparent);mask-image:linear-gradient(90deg,#000 calc(100% - 36px),transparent)}
/* 3 · finance chart */
.fx-tr .c1007{position:relative;padding-left:46px}
.fx-tr .c1007 .ax{position:absolute;left:0;top:0;bottom:0;width:42px;font-size:.75rem;color:#5E5A76;font-variant-numeric:tabular-nums}
.fx-tr .c1007 .ax span{position:absolute;right:4px;transform:translateY(-50%);white-space:nowrap}
.fx-tr .r1007{min-height:1.4em;font-size:.875rem;color:#3A3556;margin-top:6px;font-variant-numeric:tabular-nums}
.fx-tr .r1007 b{font-weight:600}
.fx-tr svg g[role=button]:focus{outline:none}.fx-tr svg g[role=button]:focus-visible rect,.fx-tr svg g.on1007 rect{fill:rgba(1,176,191,.10)}
/* 5 · students key */
#v-astudents .k1007{font-size:.8125rem;color:#5E5A76;margin:2px 0 8px;line-height:1.4}
#v-astudents .k1007 b{font-weight:600;color:#3A3556}
`;
const js = String.raw`
(function(){
  if(window.__1007) return; window.__1007 = 1;
  var DOCS = '#printArea,.docprint,.paper,.memo,.sd,.ivp,.ivq,.tr-page,#rfNote,[data-doc]';
  /* ── 2 · contrast pass ── */
  var lum = function(r,g,b){ var f = function(x){ x /= 255; return x <= .03928 ? x/12.92 : Math.pow((x+.055)/1.055, 2.4); }; return .2126*f(r)+.7152*f(g)+.0722*f(b); };
  var parse = function(c){ var m = String(c).match(/[\d.]+/g); if(!m || m.length < 3) return null; var a = m[3] === undefined ? 1 : +m[3]; return [+m[0], +m[1], +m[2], a]; };
  var ratio = function(a, b){ var x = lum(a[0],a[1],a[2]), y = lum(b[0],b[1],b[2]); return (Math.max(x,y)+.05)/(Math.min(x,y)+.05); };
  var bgOf = function(e){ while(e && e !== document.documentElement){ var cs = getComputedStyle(e); if(cs.backgroundImage !== 'none' && !/gradient/.test(cs.backgroundImage)) return null; var c = parse(cs.backgroundColor); if(c && c[3] > .9) return c; e = e.parentElement; } return [250,250,252,1]; };
  var CACHE = {};
  var fixCol = function(fg, bg){ var k = fg.join(',') + '|' + bg.join(','); if(k in CACHE) return CACHE[k];
    if(lum(bg[0],bg[1],bg[2]) < .4) return (CACHE[k] = null);   /* only darken text on light backgrounds */
    var c = fg.slice(0,3), n = 0; while(ratio(c, bg) < 4.5 && n < 30){ c = [c[0]*0.93, c[1]*0.93, c[2]*0.93]; n++; }
    return (CACHE[k] = n ? 'rgb(' + c.map(Math.round).join(',') + ')' : null); };
  function contrast(root){ if(!root) return; var els = root.querySelectorAll('*:not([data-c1007])'); for(var k = 0; k < els.length; k++){ var e = els[k];
      if(e.dataset) e.dataset.c1007 = '0'; var own = false; for(var j = 0; j < e.childNodes.length; j++){ var nd = e.childNodes[j]; if(nd.nodeType === 3 && nd.textContent.trim()){ own = true; break; } } if(!own) continue;
      if(!e.getClientRects().length || e.closest(DOCS)) continue;
      var cs = getComputedStyle(e); if(parseFloat(cs.fontSize) >= 18.5) continue;
      var svg = e instanceof SVGElement, fg = parse(svg ? cs.fill : cs.color); if(!fg || fg[3] < .5) continue;
      if(lum(fg[0],fg[1],fg[2]) > .45) continue;   /* light text on a coloured badge: leave */
      var bg = bgOf(svg ? (e.ownerSVGElement || e).parentElement : e); if(!bg) continue;
      if(ratio(fg, bg) >= 4.5) continue; var nc = fixCol(fg, bg); if(!nc) continue;
      e.style.setProperty(svg ? 'fill' : 'color', nc, 'important'); if(e.dataset) e.dataset.c1007 = '1'; } }
  /* ── 3 · finance chart ── */
  var peso = function(v){ var a = Math.abs(v); return (v < 0 ? '−' : '') + '₱' + (a >= 1e6 ? (Math.round(a / 1e5) / 10) + 'M' : a >= 1e3 ? Math.round(a / 1e3) + 'k' : Math.round(a)); };
  function chart(){ var card = document.querySelector('.fx-tr'); if(!card) return; var svg = card.querySelector(':scope > svg'); if(!svg || svg.dataset.c1007) return;
    var G = [].slice.call(svg.querySelectorAll('g[role=button]')); if(G.length < 2) return; svg.dataset.c1007 = '1';
    var pts = []; G.forEach(function(g){ var t = (g.querySelector('title') || {}).textContent || '', m = t.match(/sales ₱([\d,]+)/), c = g.querySelectorAll('circle')[0]; if(m && c) pts.push([+m[1].replace(/,/g, ''), +c.getAttribute('cy')]);
      g.setAttribute('aria-label', t); });
    var wrap = document.createElement('div'); wrap.className = 'c1007'; svg.parentNode.insertBefore(wrap, svg); wrap.appendChild(svg);
    if(pts.length >= 2){ var n = pts.length, sx = 0, sy = 0, sxx = 0, sxy = 0; pts.forEach(function(p){ sx += p[0]; sy += p[1]; sxx += p[0]*p[0]; sxy += p[0]*p[1]; });
      var b = (n*sxy - sx*sy) / (n*sxx - sx*sx), a = (sy - b*sx) / n;   /* cy = a + b·value (viewBox units, 0–120) */
      if(isFinite(a) && isFinite(b) && b < 0){ var vTop = (8 - a) / b, vBot = (114 - a) / b, lo = Math.min(vTop, vBot), hi = Math.max(vTop, vBot);
        var raw = (hi - Math.max(0, lo)) / 4, mag = Math.pow(10, Math.floor(Math.log10(raw))), step = [1, 2, 2.5, 5, 10].map(function(x){ return x * mag; }).find(function(x){ return x >= raw; }) || raw;
        var ax = document.createElement('div'); ax.className = 'ax'; ax.setAttribute('aria-hidden', 'true');
        for(var v = Math.ceil(Math.max(0, lo) / step) * step; v <= hi; v += step){ var y = a + b * v; if(y < 4 || y > 118) continue; var sp = document.createElement('span'); sp.style.top = (y / 120 * 100) + '%'; sp.textContent = peso(v); ax.appendChild(sp); }
        wrap.appendChild(ax); } }
    var rd = document.createElement('div'); rd.className = 'r1007'; rd.setAttribute('aria-live', 'polite'); rd.textContent = 'Tap or hover a month for its sales and costs · tap again to open it';
    card.appendChild(rd);
    var show = function(g){ G.forEach(function(x){ x.classList.toggle('on1007', x === g); }); var t = g.getAttribute('aria-label') || ''; rd.innerHTML = t.replace(/^([^·]+)·/, '<b>$1</b>·'); };
    var armed = null;
    G.forEach(function(g){ g.addEventListener('focus', function(){ show(g); }); g.addEventListener('mouseenter', function(){ show(g); });
      g.addEventListener('keydown', function(e){ if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); g.dispatchEvent(new MouseEvent('click', { bubbles: true })); } }); });
    svg.addEventListener('pointerdown', function(e){ svg._pt = e.pointerType; }, true);
    svg.addEventListener('click', function(e){ var g = e.target.closest && e.target.closest('g[role=button]'); if(!g) return;
      if(svg._pt === 'touch' && armed !== g){ e.stopPropagation(); e.preventDefault(); armed = g; show(g); } }, true); }
  /* ── 4 · fade hint on strips with tabs off-screen ── */
  function strips(){ document.querySelectorAll('#app .mo-tabs, #sheet .stu-tabs').forEach(function(t){ var more = t.scrollWidth > t.clientWidth + 2 && t.scrollLeft + t.clientWidth < t.scrollWidth - 2; t.classList.toggle('t1007-more', more);
      if(!t.dataset.s1007){ t.dataset.s1007 = '1'; t.addEventListener('scroll', function(){ var m = t.scrollLeft + t.clientWidth < t.scrollWidth - 2; t.classList.toggle('t1007-more', m); }, { passive: true }); } }); }
  /* ── 5 · students key ── */
  function key(){ var v = document.getElementById('v-astudents'); if(!v || v.querySelector('.k1007')) return; var h = v.querySelector('.sa-h'); if(!h || !v.querySelector('.sa-w')) return;
    var d = document.createElement('div'); d.className = 'k1007'; d.innerHTML = '<b>A week:</b> classes = the scheduled sessions · lesson units = what the package counts (1 unit = 50 min, so a 25-min class uses 0.5)';
    var box = h.parentNode; box.insertBefore(d, h); }
  function all(){ try{ chart(); }catch(e){ console.warn('1007 chart', e); } try{ strips(); }catch(e){} try{ key(); }catch(e){} try{ contrast(document.getElementById('v-' + (typeof VIEW !== 'undefined' ? VIEW : '')) || null); contrast(document.querySelector('#app header, #app .hd')); contrast(document.getElementById('navIn')); if(document.querySelector('#sheet.on')) contrast(document.getElementById('sheet')); }catch(e){ console.warn('1007 contrast', e); } }
  window.d1007 = all;
  var q = 0, later = function(){ clearTimeout(q); q = setTimeout(all, 250); };
  ['render', 'go', 'openSheet', 'renderAStudents', 'renderStudents', 'renderPayroll', 'renderToday'].forEach(function(n){ var f = window[n]; if(typeof f !== 'function') return; window[n] = function(){ var r = f.apply(this, arguments); later(); setTimeout(later, 1200); return r; }; });
  var sb = document.getElementById('sheetBody'); if(sb) new MutationObserver(later).observe(sb, { childList: true });
  /* screens that fill in after their data arrives: watch each screen's own box (direct children only — cheap) */
  var mo = new MutationObserver(later); document.querySelectorAll('[id^="v-"]').forEach(function(v){ mo.observe(v, { childList: true }); });
  setInterval(function(){ if(document.querySelector('.fx-tr > svg:not([data-c1007])')) later(); }, 2000);
  /* content that fills in later inside a screen (lists, charts): one more pass, at most every 1.5 s */
  var lastDeep = 0, deepT = 0, app = document.getElementById('app'); if(app) new MutationObserver(function(){ if(deepT) return; deepT = setTimeout(function(){ deepT = 0; if(Date.now() - lastDeep < 1500) return; lastDeep = Date.now(); all(); }, 900); }).observe(app, { childList: true, subtree: true });
  addEventListener('resize', function(){ clearTimeout(q); q = setTimeout(strips, 200); });
  setTimeout(all, 1800); setTimeout(all, 5000);
})();
`;
s = s.slice(0, i) + '<style id="d1007">/* 1007 · design refinements */' + css + '</style>\n<script>' + js + '</script>\n' + s.slice(i);
fs.writeFileSync(file, s);
lib(file, []);
