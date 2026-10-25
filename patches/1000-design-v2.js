// 1000: (Misty, 25 Oct 20:02) Focused visual-design pass — stronger hierarchy, readable contrast, fewer competing buttons,
// compact student details, better dashboard composition, shared components. Fonts unchanged (Fredoka One for brand / page
// titles, the deployed Inter for everything else). FIRST STEP: Overview, Finance, Students and the student dialog
// (previews for approval); the remaining screens follow the same shared rules once approved.
// ONE shared layer (#d1000): tokens + component rules (text roles, buttons, tabs vs filters vs badges, cards vs sunk panels),
// then a few screen adaptations that only use those rules. Nothing is removed: every button keeps its element and handler;
// less-used ones are moved (same element) into a "More actions" menu. Documents untouched (all rules inside the app screens).
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
const CSS = String.raw`
/* ── tokens ─────────────────────────────────────────── */
html:root{--d-ink:#2B2450;--d-text:#3A3556;--d-mute:#5E5A76;--d-faint:#8C88A3;--d-line:#E7E5EE;--d-line2:#F0EEF5;
 --d-card:#FFFFFF;--d-sunk:#F7F7FA;--d-tint:#EAF7F8;--d-tint2:#F3F1FA;--d-teal:#01B0BF;--d-teal-d:#00707A;--d-purple:#2F2752;
 --d-warn-bg:#FFF6E6;--d-warn:#9A5B00;--d-bad-bg:#FCEDEA;--d-bad:#A8402B;--d-ok-bg:#E9F6EF;--d-ok:#246B4A;
 --d-r:14px;--d-r-sm:10px;--d-sh:0 1px 2px rgba(43,36,80,.05),0 6px 18px -10px rgba(43,36,80,.16);--d-gap:16px}
/* ── text roles ─────────────────────────────────────── */
:is(#app,#sheet) :is(.mute,.small.mute,small.mute){color:var(--d-mute)}
:is(#app,#sheet) main h2{color:var(--d-ink)}
/* ── buttons: primary (solid) · secondary (outline) · quiet (text) ── */
:is(#app,#sheet) :is(.btn.teal,.btn.primary){background:var(--d-teal-d)!important;border-color:var(--d-teal-d)!important;color:#fff!important;box-shadow:none!important}
:is(#app,#sheet) :is(.btn.teal,.btn.primary):hover{background:#005E66!important}
:is(#app,#sheet) .btn.ghost{background:#fff!important;border:1px solid var(--d-line)!important;color:var(--d-text)!important;box-shadow:none!important}
:is(#app,#sheet) .btn.ghost:hover{border-color:#CFCBDD!important;background:var(--d-sunk)!important}
:is(#app,#sheet) :is(.btn,button):focus-visible,:is(#app,#sheet) summary:focus-visible{outline:3px solid rgba(1,176,191,.45)!important;outline-offset:2px}
/* ── tabs (navigation inside a screen): text with an underline indicator ── */
:is(#app,#sheet) :is(.mo-tabs,.stu-tabs){display:flex;gap:4px;border-bottom:1px solid var(--d-line);background:transparent!important;padding:0!important;box-shadow:none!important;border-radius:0!important}
:is(#app,#sheet) :is(.mo-tabs,.stu-tabs)>button{background:transparent!important;border:0!important;border-radius:0!important;color:var(--d-mute)!important;padding:8px 12px!important;margin-bottom:-1px;box-shadow:inset 0 -2px 0 transparent!important;min-height:40px}
:is(#app,#sheet) :is(.mo-tabs,.stu-tabs)>button:hover{color:var(--d-ink)!important}
:is(#app,#sheet) :is(.mo-tabs,.stu-tabs)>button.on{color:var(--d-ink)!important;font-weight:600!important;box-shadow:inset 0 -2px 0 var(--d-teal)!important}
:is(#app,#sheet) :is(.mo-tabs,.stu-tabs)>button.on svg{color:var(--d-teal-d)}
/* ── filters: small outline pills, tinted when chosen ── */
:is(#app,#sheet) .seg{gap:6px!important;background:transparent!important;padding:0!important;border:0!important}
:is(#app,#sheet) .seg>button{border:1px solid var(--d-line)!important;background:#fff!important;color:var(--d-text)!important;border-radius:999px!important;padding:5px 12px!important;min-height:32px;font-size:.875rem!important;box-shadow:none!important}
:is(#app,#sheet) .seg>button.on{background:var(--d-tint)!important;border-color:#BFE6EA!important;color:var(--d-teal-d)!important;font-weight:600!important}
/* ── status badges: no border, tinted, small ── */
:is(#app,#sheet) :is(.chip,.stp,.pill){border:0!important}
/* ── cards vs sunk panels ── */
#app main :is(.ov-card,.x-top,.sec){background:var(--d-card);border:1px solid var(--d-line)!important;border-radius:var(--d-r)!important;box-shadow:var(--d-sh)!important}
/* ── "More actions" menu (shared) ── */
.m1000{position:relative;display:inline-block}
.m1000>summary{list-style:none;cursor:pointer}.m1000>summary::-webkit-details-marker{display:none}
.m1000>summary::after{content:"▾";margin-left:6px;font-size:.75em;opacity:.7}
.m1000-p{position:absolute;right:0;top:calc(100% + 6px);z-index:60;min-width:230px;background:#fff;border:1px solid var(--d-line);border-radius:12px;box-shadow:0 12px 32px -12px rgba(43,36,80,.35);padding:6px;display:flex;flex-direction:column;gap:2px}
.m1000-p .m1000-h{font-size:.75rem;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--d-faint);padding:8px 10px 2px}
.m1000-p .btn{all:unset;box-sizing:border-box;display:flex!important;align-items:center;gap:8px;width:100%;padding:8px 10px;border-radius:8px;cursor:pointer;color:var(--d-text);font:inherit;font-weight:500}
:is(#app,#sheet) .m1000-p .btn.btn{background:transparent!important;border:0!important;color:var(--d-text)!important;box-shadow:none!important;justify-content:flex-start!important;min-height:36px!important;height:auto!important;font-weight:500!important}
:is(#app,#sheet) .m1000-p .btn.btn:hover,:is(#app,#sheet) .m1000-p .btn.btn:focus-visible{background:var(--d-sunk)!important}
.m1000-p .btn svg{width:16px;height:16px;flex:none}

/* ═══ Overview ═══ */
#v-home .ovc{gap:var(--d-gap)!important}
#v-home .x-top{padding:16px 20px!important}
#v-home .x-top h1{font-size:var(--fs-h1)!important;margin:0!important;line-height:1.1}
#v-home .x-top .d{color:var(--d-mute);font-size:.875rem}
#v-home .x-st{gap:8px!important;border:0!important;background:transparent!important}
#v-home .x-st>a{background:var(--d-sunk)!important;border:1px solid var(--d-line2)!important;border-radius:var(--d-r-sm)!important;padding:10px 14px!important;display:flex;flex-direction:column;gap:2px}
#v-home .x-st>a>span{font-size:.75rem!important;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--d-mute)!important}
#v-home .x-st>a>b{font-size:1.625rem!important;font-weight:600!important;color:var(--d-ink);line-height:1.15;font-variant-numeric:tabular-nums}
#v-home .x-st>a>small{color:var(--d-mute)!important;font-size:.875rem!important}
#v-home .x-todo{margin-top:12px!important;border-radius:var(--d-r-sm)!important;padding:10px 14px!important;white-space:normal!important}
#v-home .x-todo *{white-space:normal!important;text-overflow:clip!important;overflow:visible!important}
#v-home .x-todo.warm{background:var(--d-warn-bg)!important;box-shadow:inset 3px 0 0 #E2A33A!important}
#v-home .ov-hd{align-items:center;margin-bottom:12px!important}
#v-home .ov-hd h2{font-size:1.125rem!important;display:flex;align-items:center;gap:10px}
#v-home .ov-hd h2::before{width:4px!important;height:18px!important;border-radius:2px!important;background:var(--d-teal)!important;margin:0!important;position:static!important;flex:none}
#v-home .ov-card{padding:18px 20px!important}
#v-home #ovMon{padding:14px 20px!important}
#v-home #ovMon>.ov-hd{margin-bottom:8px!important}
#v-home #ovMon>.ov-mb{display:inline-flex!important;width:auto!important;flex-wrap:wrap;gap:8px;margin:0 12px 0 0!important;vertical-align:middle}
#v-home #ovMon>.small{display:inline-block!important;margin:0!important;vertical-align:middle;color:var(--d-mute)}
#v-home .bz2-k{gap:10px!important;border:0!important;background:transparent!important}
#v-home .bz2-k>div{background:var(--d-sunk)!important;border:1px solid var(--d-line2)!important;border-radius:var(--d-r-sm)!important;padding:12px 14px!important;display:flex;flex-direction:column;gap:2px;min-width:0}
#v-home .bz2-k>div>span{font-size:.75rem!important;font-weight:600!important;letter-spacing:.06em;text-transform:uppercase;color:var(--d-mute)!important}
#v-home .bz2-k>div>b{font-size:1.625rem!important;font-weight:600!important;color:var(--d-ink);white-space:nowrap;line-height:1.15;font-variant-numeric:tabular-nums}
#v-home .bz2-k>div>em{font-style:normal;color:var(--d-mute);font-size:.875rem!important;line-height:1.4}
#v-home .bz2-k>div>em.up{color:var(--d-ok)!important}
#v-home .bz2-k>div.now{background:var(--d-tint)!important;border-color:#CDEBEE!important}
#v-home .bz2-k>div.now>b{color:var(--d-teal-d)}
#v-home details.t1000{margin-top:14px;border-top:1px solid var(--d-line2);padding-top:10px}
#v-home details.t1000>summary{cursor:pointer;list-style:none;font-weight:600;color:var(--d-ink);display:flex;gap:8px;align-items:center}
#v-home details.t1000>summary::-webkit-details-marker{display:none}
#v-home details.t1000>summary::before{content:"›";display:inline-block;transition:transform .15s;color:var(--d-teal-d);font-size:1.2em}
#v-home details.t1000[open]>summary::before{transform:rotate(90deg)}
#v-home details.t1000>summary>.bz2-h{flex:1;margin:0!important}

/* ═══ Students list ═══ */
#v-astudents .lead{margin-bottom:8px!important}
#v-astudents .lead>.small{font-size:.875rem}
#v-astudents #dbLk{display:flex;flex-wrap:wrap;gap:4px 14px;margin-top:4px}
#v-astudents #dbLk a.lk{font-size:.875rem;min-height:0!important;padding:2px 0!important}
#v-astudents .f1000-row{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:10px 0 6px}
#v-astudents .f1000-row .as-q{flex:1 1 260px;margin:0!important}
#v-astudents .seg.f1000{margin:6px 0 10px!important}
#v-astudents .seg.f1000>button.f1000-x{display:none}
#v-astudents .seg.f1000.open>button.f1000-x{display:inline-flex}
#v-astudents .seg.f1000>.f1000-more{border-style:dashed!important;color:var(--d-teal-d)!important}
#v-astudents .li.sa{padding:10px 14px!important}
#v-astudents .li.sa .small.mute{color:var(--d-mute)}

/* ═══ Student dialog ═══ */
#sheet .stu2 .shero{padding:14px 16px 12px!important;gap:10px 14px!important}
#sheet .stu2 .shero .av.big{width:36px!important;height:36px!important;font-size:1rem!important}
#sheet .stu2 .shero h1{font-size:1.5rem!important;margin:0!important}
#sheet .stu2 #wxG{font-size:.8125rem;color:var(--d-mute);margin:2px 0!important;display:flex;flex-wrap:wrap;align-items:center;gap:2px 8px}
#sheet .stu2 #wxG b{font-weight:500;color:var(--d-text)}
#sheet .stu2 #wxG .btn{min-height:0!important;padding:0 2px!important;border:0!important;background:transparent!important;color:var(--d-teal-d)!important;font-size:.8125rem!important;text-decoration:underline;text-underline-offset:2px}
#sheet .stu2 .shero .row.hl{margin-top:4px!important;gap:4px 12px!important}
#sheet .stu2 .shero .kpis{padding:6px 10px!important;gap:0!important;border-radius:12px!important;background:var(--d-tint)!important;border:0!important}
#sheet .stu2 .shero .kpis>div{padding:4px 12px!important}
#sheet .stu2 .shero .kpis b{white-space:nowrap;font-size:1.375rem!important;font-weight:600!important;color:var(--d-ink)}
#sheet .stu2 .shero .kpis .k-ok b{color:var(--d-teal-d)}
#sheet .stu2 .shero .kpis span{font-size:.75rem!important;color:var(--d-mute)}
#sheet .stu2 .shwk{padding-top:8px!important;margin-top:8px!important}
#sheet .stu2 .stu-bar{display:flex!important;flex-direction:row!important;align-items:center!important;flex-wrap:wrap!important;align-items:center;gap:6px!important;padding:8px 0 4px!important;border:0!important;background:transparent!important;box-shadow:none!important}
#sheet .stu2 .stu-bar .grp{display:contents}
#sheet .stu2 .stu-bar .grp>span{display:none}
#sheet .stu2 .stu-bar .btn{min-height:34px!important;padding:5px 12px!important}
#sheet .stu2 .stu-bar .sp1000{flex:1}
#sheet .stu2 .stu-tabs{margin:4px 0 10px!important}
#sheet .stu2 :is(#stuStat,#stuRn).sec{padding:10px 14px!important;box-shadow:none!important;background:var(--d-sunk)!important;border-color:var(--d-line2)!important}
#sheet .stu2 #stuStat h2{font-size:1rem!important;margin:0!important}
#sheet .stu2 #stuStat .row{margin-top:6px!important}
#sheet .stu2 #stuStat .btn{min-height:32px!important;padding:4px 12px!important}
#sheet .stu2 #stuRn summary{min-height:0!important;padding:2px 0!important}
#sheet .stu2 #stuRn summary b{font-size:1rem!important}

/* ═══ Finance ═══ */
#app .fx :is(td,th){font-variant-numeric:tabular-nums}

/* ═══ phones ═══ */
@media(max-width:640px){
 #v-home .x-top{padding:14px!important}#v-home .ov-card{padding:14px!important}
 #v-home .x-st>a>b,#v-home .bz2-k>div>b{font-size:1.375rem!important;white-space:normal}
 #sheet .stu2 .shero{padding:12px!important}
 #sheet .stu2 .shero .kpis{width:100%}
 #sheet .stu2 .stu-bar .btn,#sheet .stu2 .stu-bar .m1000>summary{width:auto!important;flex:0 0 auto!important;display:inline-flex!important}
 #sheet .stu2 .stu-bar .sp1000{display:none}
 #v-astudents .li.sa{flex-wrap:wrap!important}
 #v-astudents .li.sa>.grow{flex:1 1 0!important;min-width:0}
 #v-astudents .li.sa>.sa-r{flex:1 0 100%!important;padding-left:54px;text-align:left!important;display:flex!important;flex-wrap:wrap;align-items:center;gap:4px 10px}
 .m1000-p{position:fixed;left:12px;right:12px;bottom:84px;top:auto;min-width:0;max-height:60vh;overflow:auto}
}
`;
const JS = String.raw`
(function(){
  if(window.__1000) return; window.__1000 = 1;
  /* shared "More actions" menu: moves the given buttons (same elements, same handlers) into a details menu */
  function menu(label, groups){ var d = document.createElement('details'); d.className = 'm1000';
    var sm = document.createElement('summary'); sm.className = 'btn ghost sm'; sm.textContent = label; d.appendChild(sm);
    var p = document.createElement('div'); p.className = 'm1000-p'; p.setAttribute('role', 'menu');
    groups.forEach(function(g){ if(!g.items.length) return; if(g.title){ var h = document.createElement('div'); h.className = 'm1000-h'; h.textContent = g.title; p.appendChild(h); }
      g.items.forEach(function(b){ b.setAttribute('role', 'menuitem'); p.appendChild(b); }); });
    p.addEventListener('click', function(e){ if(e.target.closest('.btn')) setTimeout(function(){ d.open = false; }, 0); });
    d.appendChild(p); return d; }
  document.addEventListener('click', function(e){ document.querySelectorAll('details.m1000[open]').forEach(function(d){ if(!d.contains(e.target)) d.open = false; }); });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') document.querySelectorAll('details.m1000[open]').forEach(function(d){ d.open = false; var s = d.querySelector('summary'); if(s) s.focus(); }); });
  var txt = function(b){ return (b.textContent || '').replace(/\s+/g, ' ').trim(); };

  /* student dialog toolbar: Lessons left · Class notice · Lesson summary · Edit details stay; the rest go to More actions */
  function stuBar(){ var bar = document.querySelector('#sheet .stu2 .stu-bar'); if(!bar || bar.dataset.d1000) return; bar.dataset.d1000 = '1';
    var send = [].slice.call(bar.querySelectorAll('.g-send .btn')), all = [].slice.call(bar.querySelectorAll('.btn')), man = all.filter(function(b){ return send.indexOf(b) < 0; });
    var KEEP_S = /^(Lessons left|Class notice|Lesson summary)/i, KEEP_M = /^Edit details/i;
    var moreS = send.filter(function(b){ return !KEEP_S.test(txt(b)); }), moreM = man.filter(function(b){ return !KEEP_M.test(txt(b)); });
    if(!moreS.length && !moreM.length) return;
    var sp = document.createElement('span'); sp.className = 'sp1000';
    var m = menu('More actions', [{ title: 'Send to parent', items: moreS }, { title: 'Manage', items: moreM }]);
    bar.appendChild(sp); bar.appendChild(m); }
  /* Students list: search first; the first 3 filters + the chosen one stay, the rest behind "More filters" */
  function stuList(){ var v = document.getElementById('v-astudents'); if(!v) return; var seg = v.querySelector(':scope > .seg'); if(!seg || seg.dataset.d1000) return;
    var bs = [].slice.call(seg.querySelectorAll(':scope > button')); if(bs.length <= 4) return; seg.dataset.d1000 = '1'; seg.classList.add('f1000');
    bs.forEach(function(b, k){ if(k >= 3 && !b.classList.contains('on')) b.classList.add('f1000-x'); });
    var n = seg.querySelectorAll('.f1000-x').length; if(!n) return;
    var mb = document.createElement('button'); mb.type = 'button'; mb.className = 'f1000-more'; mb.textContent = 'More filters · ' + n; mb.setAttribute('aria-expanded', 'false');
    mb.onclick = function(){ var o = seg.classList.toggle('open'); mb.textContent = o ? 'Fewer filters' : 'More filters · ' + n; mb.setAttribute('aria-expanded', String(o)); };
    seg.appendChild(mb); }
  /* Overview: the monthly profit chart becomes an expandable section (open on laptops, closed on phones) */
  function home(){ var v = document.getElementById('v-home'); if(!v) return; var h = v.querySelector('.bz2-h'); if(!h || h.closest('details.t1000')) return;
    var parent = h.parentNode, ch = parent.querySelector('.bz2-ch'), y = parent.querySelector('.bz2-y'), df = parent.querySelector('.bz2-def'); if(!ch) return;
    var d = document.createElement('details'); d.className = 't1000'; d.open = innerWidth > 640;
    var sm = document.createElement('summary'); d.appendChild(sm);
    parent.insertBefore(d, h); sm.appendChild(h); [ch, y, df].forEach(function(x){ if(x) d.appendChild(x); }); }
  function all(){ try{ stuBar(); }catch(e){} try{ stuList(); }catch(e){} try{ home(); }catch(e){} }
  var q = 0, later = function(){ clearTimeout(q); q = setTimeout(all, 60); };
  ['render', 'renderStudents', 'go', 'openSheet', 'renderMHome', 'stuRender'].forEach(function(n){ var f = window[n]; if(typeof f !== 'function') return; window[n] = function(){ var r = f.apply(this, arguments); later(); setTimeout(later, 600); return r; }; });
  var sb = document.getElementById('sheetBody'); if(sb) new MutationObserver(later).observe(sb, { childList: true });
  ['v-astudents', 'v-home'].forEach(function(id){ var el = document.getElementById(id); if(el) new MutationObserver(later).observe(el, { childList: true }); });
  setTimeout(all, 1500);
})();
`;
s = s.slice(0, i) + '<style id="d1000">/* 1000 · design v2 (shared) */' + CSS + '</style>\n<script>' + JS + '</script>\n' + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
