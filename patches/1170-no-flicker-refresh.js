// 1170: (Misty, 26 Oct 16:08) "the flicker on management screen, when refreshing it's also adjusting — annoying and frustrating".
// Measured in the preview after 1111 (the page reloaded with the device copy present, Overview): the screen still changed
// 13–17 times in the first 4 s, alternating between two looks. Causes:
// 1 · Ping-pong redraws. Several small boxes are redrawn "only if different", but they compare the fresh HTML with what is on
//     screen — after a finishing pass has coloured it (contrast, buttons) it is always "different", so each data refresh replaced
//     the box with the unfinished version again (Overview › Teachers today was recreated 10 times; also the Time-ins tab strip,
//     the screen tab strips, the Overview "so far" line, the Growth journey, the student CEFR journey, and every box written by
//     the 515 helper). Now each box remembers the HTML it was given and is redrawn only when that changes.
// 2 · During start-up and ↻ the 1111 "finish before paint" step switched itself off for 2 s once it had used 400 ms in a
//     second, or 150 ms in one step — exactly while the screens were redrawing — so unfinished screens were painted. The budget
//     is now 1.5 s per second and 400 ms per step (still capped at 40 rounds) so start-up and refresh finish before paint.
// 3 · Fonts: Inter / Fredoka One / Noto Sans SC were loaded with display=swap, so after a refresh the text was first drawn in
//     the fallback font and then re-flowed when the font arrived. Now display=optional with a preload: when the font is in the
//     browser's cache (every visit after the first) it is used from the first paint; otherwise the fallback is kept for that
//     visit instead of jumping. The scrollbar space is reserved so screens don't shift sideways when a long screen opens.
// Presentation only: no data, saving, permissions or calculations change.
const lib = require('../tools/lib.js'), fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
/* 1 · helpers, defined before every screen script (right after 515's helpers) */
const A = "window.__put = (el, h) => { el.innerHTML = h; el._sh = h; el._sv = el.innerHTML; };";
if(s.split(A).length !== 2) throw new Error('1170: 515 helper not found');
s = s.replace(A, A + `
/* 1170 · a box is "the same" when it was given the same HTML and still holds what we wrote (finishing passes may have coloured it) */
window.__same = (el, h) => !!el && el._sh === h && (el.innerHTML === el._sv || (!!el._fc && el._fc.parentNode === el));
window.__put = (el, h) => { el.innerHTML = h; el._sh = h; el._sv = el.innerHTML; el._fc = el.firstChild; };
window.__oh = (el, h) => { if(!el || !el.parentNode) return el; if(el.__raw === h) return el; if(el.outerHTML === h){ el.__raw = h; return el; }
  const p = el.parentNode, nx = el.nextSibling; el.outerHTML = h; let n = nx ? nx.previousSibling : p.lastChild; while(n && n.nodeType !== 1) n = n.previousSibling; if(n) n.__raw = h; return n; };`);
fs.writeFileSync(file, s);
lib(file, [
  ["if(b.outerHTML !== h) b.outerHTML = h;", "__oh(b, h);"],
  ["if(old.outerHTML !== html) old.outerHTML = html;", "__oh(old, html);"],
  ["if(cur.outerHTML !== h) cur.outerHTML = h;", "__oh(cur, h);"],
  ["if(el.outerHTML !== h) el.outerHTML = h;", "__oh(el, h);"],
  ["else if(jp.outerHTML !== jh) jp.outerHTML = jh;", "else __oh(jp, jh);"],
  /* Overview › Teachers today: the first copy also remembers its HTML */
  ["if(sec){ sec.insertAdjacentHTML('beforebegin', html); sec.remove(); if(old) old.remove(); return; }",
   "if(sec){ sec.insertAdjacentHTML('beforebegin', html); sec.remove(); if(old) old.remove(); const nw = $('ovMon'); if(nw) nw.__raw = html; return; }"],
  /* the layout and colour passes can be called directly (they already run on timers; 1170 also runs them right after a redraw) */
  ["window.__l1000 = later;", "window.__l1000 = later; window.__p1000 = all;"],
  ["window.__l1102 = later;", "window.__l1102 = later; window.__p1102 = all;"],
  /* 2 · 1111's budget */
  /* 4 · management start-up / browser refresh: the screen area stays invisible while it is being drawn (kept copy, then fresh
     data, then the extra cards) and appears once, when its drawing has been quiet for 0.45 s (at most 2.6 s after the page
     starts; a click or key shows it at once). Header and menu stay visible. Teachers already have this for Today (500). */
  ["let MODE = store('get','coe.mode') === 'mgmt' ? 'mgmt' : 'teacher';",
   "let MODE = store('get','coe.mode') === 'mgmt' ? 'mgmt' : 'teacher';\nif(TOKEN && MODE === 'mgmt'){ try{ const r = document.documentElement, s = document.createElement('style'); s.textContent = 'html.st1170 main.wrap>[id^=\"v-\"]{opacity:0!important;pointer-events:none}html.st1170 main.wrap{position:relative}html.st1170 main.wrap::after{content:\"Updating…\";position:absolute;left:24px;top:24px;font-size:14px;color:#5E5A76}'; document.head.appendChild(s); r.classList.add('st1170'); setTimeout(() => r.classList.remove('st1170'), 3200); }catch(e){} }"],
]);
s = fs.readFileSync(file, 'utf8');
/* the two CEFR-journey redraws (same code twice) */
const cj = "const n = cjHtml(STU); if(n && n !== el.outerHTML){ const t = document.createElement('div'); t.innerHTML = n; const x = t.firstElementChild; if(x) el.replaceWith(x); }";
if(s.split(cj).length !== 3) throw new Error('1170: cj redraw x2 not found');
s = s.split(cj).join("const n = cjHtml(STU); if(n && n !== el.__raw && n !== el.outerHTML){ const t = document.createElement('div'); t.innerHTML = n; const x = t.firstElementChild; if(x){ x.__raw = n; el.replaceWith(x); } }");
/* 3 · fonts: optional + preload; scrollbar space */
const F0 = 'display=swap" rel="stylesheet">';
if(s.split(F0).length !== 2) throw new Error('1170: font link not found');
const href = s.slice(s.lastIndexOf('href="', s.indexOf(F0)) + 6, s.indexOf(F0)) + 'display=optional';
s = s.replace(F0, 'display=optional" rel="stylesheet">');
s = s.replace('<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>', '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="preload" as="style" href="' + href + '">');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>/* 1170 · an identical redraw changes nothing on screen: when a screen is redrawn from the same data (the copy kept on
   this device, then the same data again from the server, or one more piece arriving), the finished version already on screen
   (coloured, aligned, charts with their axes) is kept instead of being replaced by an unfinished copy of itself. */
(function(){ if(window.__1170) return; window.__1170 = 1;
  function cur(){ try{ return document.getElementById('v-' + VIEW); }catch(e){ return null; } }
  window.__keepSame = function(fn, self, args){ var el = cur(); if(!el) return fn.apply(self, args);
    var pre = el.innerHTML, kids = [].slice.call(el.childNodes), y = window.scrollY, r = fn.apply(self, args), el2 = cur();
    if(el2 === el && el.innerHTML !== pre){ try{ if(window.__p1000) __p1000(); }catch(e){} try{ if(window.d1007) d1007(); }catch(e){} try{ if(window.__p1102) __p1102(); }catch(e){} }
    try{ if(el2 === el){ var post = el.innerHTML; if(post !== pre){ if(post === el.__raw1170 && kids.length){ el.replaceChildren.apply(el, kids); if(Math.abs(window.scrollY - y) > 2) window.scrollTo(0, y); } else el.__raw1170 = post; } } }catch(e){}
    return r; };
  var S = window.swr; if(typeof S === 'function') window.swr = swr = function(k, call, set, paint){ return S.call(this, k, call, set, function(){ return window.__keepSame(paint, this, arguments); }); };
  ['renderHome', 'renderMoney', 'renderFinOv', 'renderPerf', 'renderActive', 'renderPayroll', 'renderMonitor', 'renderSchedule', 'renderActions', 'renderReports', 'renderAStudents'].forEach(function(n){
    var f = window[n]; if(typeof f !== 'function' || f.__k1170) return; var w = function(){ return window.__keepSame(f, this, arguments); }; w.__k1170 = 1; window[n] = w; });
  /* management start-up hold (see 4): the screen appears once its drawing is quiet */
  var root = document.documentElement; if(root.classList.contains('st1170')){ var shown = false, qt = 0, hm = null;
    var reveal1170 = function(){ if(shown) return; shown = true; clearTimeout(qt); try{ hm && hm.disconnect(); }catch(e){} root.classList.remove('st1170'); };
    var armHold = function(){ clearTimeout(qt); qt = setTimeout(function settleQuiet(){ var v = null; try{ v = document.getElementById('v-' + VIEW); }catch(e){} if(v && v.childElementCount > 0) reveal1170(); else armHold(); }, 450); };
    var main = document.querySelector('main.wrap'); if(main){ hm = new MutationObserver(armHold); hm.observe(main, { childList: true, subtree: true, characterData: true }); }
    armHold(); setTimeout(reveal1170, Math.max(0, 2600 - (window.performance ? performance.now() : 0)));
    ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach(function(ev){ addEventListener(ev, reveal1170, { once: true, capture: true }); }); }
})();
</script>
` + '<style id="d1170">/* 1170 · no sideways shift when a long screen opens */ html{scrollbar-gutter:stable}</style>\n' + s.slice(i);
fs.writeFileSync(file, s);
lib(file, []);
