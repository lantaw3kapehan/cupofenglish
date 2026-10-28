// 1485 · Needs your action stays steady (S4) and one class shows once (S1, Misty's priority 1)
// S4 · The list was rebuilt as data arrived (17 → 22 rows about 15 s after opening) and new rows were sorted in above the
//      ones the teacher was reading. Once Today is on screen and the list has stopped changing for 5 s (at most 20 s after
//      opening), the rows keep their order and count; anything
//      that arrives later waits behind a "N new" chip next to the heading (same line, nothing moves). Tapping the chip (or
//      coming back to Today from another screen) adds them in their proper place. A row that is done leaves (a row that only flickers out during a redraw keeps its place for 2.5 s).
// S1 · One class was in four places: Needs your action "Homework · 1 class today not marked · Mia", "After class · Mia
//      13:00 · Class note · Video not done yet", My class videos "✗ Mia · 13:00 · no video in the folder yet", and Completed
//      today "2 with something to finish". Now:
//      · the After class row is the one place per class and lists Homework too (Homework · Class note · Video); its button
//        opens the class card at the first missing step (Given → Class note → Upload video), as before. The separate
//        "N classes today not marked" row is gone from the list (the class card and the To do list keep it).
//      · My class videos keeps its heading and "N not found yet" line and says "· in Needs your action"; the per-class lines
//        (folder check time, files found) fold under "Details" when every missing video is already a row above.
//      · Completed today keeps its count chip (a summary on the fold, not a task).
// Every action is still reachable; nothing is saved differently.
const fs = require('fs'), file = process.argv[2];
require('../tools/lib.js')(file, [
  ["var L = items(v, td), sig = L.map(", "var L = items(v, td); if(window.q1485) L = q1485.hold(L); var sig = (window.q1485 ? q1485.held() + '#' : '') + L.map("],
  ["var h2 = td.querySelector(':scope>h2'); if(h2) h2.innerHTML = 'Needs your action' + (L.length ? '<span class=\"qn\">' + L.length + '</span>' : '');",
   "var h2 = td.querySelector(':scope>h2'); if(h2){ var hh = 'Needs your action' + (L.length ? '<span class=\"qn\">' + L.length + '</span>' : '') + (window.q1485 ? q1485.chip() : ''); if(h2.innerHTML !== hh) h2.innerHTML = hh; } if(window.q1485) q1485.vids(td, L);"],
  ["if(/^(Message|Memorandum)/i.test(lab)) return; var g = li.querySelector('.grow')",
   "if(/^(Message|Memorandum)/i.test(lab)) return; if(/^Homework$/i.test(lab) && /hwSheet/.test(li.getAttribute('onclick') || '')) return; var g = li.querySelector('.grow')"],
  ["var hasHw = (out || []).some(function(x){ return /homework/i.test(x.kind || ''); }), rows = [];", "var hasHw = false, rows = [];"]
]);
let s = fs.readFileSync(file, 'utf8'); const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<style id="css1485">
#v-today .td1104>h2 .n1485{display:inline-flex;align-items:center;gap:4px;margin-left:10px;padding:2px 10px;border-radius:999px;border:1px solid #9FCFCB;background:#E6F3F2;color:#0B5F63;font:600 .8125rem/1.5 Inter,system-ui,sans-serif;cursor:pointer;vertical-align:2px}
#v-today .td1104>h2 .n1485:focus-visible{outline:2px solid #0B5F63;outline-offset:2px}
#v-today .td1104>h2 .n1485.r{border-color:#F0BDB6;background:#FDECEA;color:#B42318}
#vidMine.c1485>*:not(.row):not(.d1485){display:none!important}
#vidMine .d1485{display:inline-block;margin-top:4px;background:none;border:0;padding:6px 0;color:#00737B;font:600 .8125rem Inter,system-ui,sans-serif;cursor:pointer;text-decoration:underline}
</style>
<script>
/* 1485 · steady queue + one place per class */
(function(){
  if(window.q1485) return;
  var K = function(x){ return String((x.kind || '') + '|' + (x.title || '')).toLowerCase().replace(/\s+/g, ' '); };
  var ORDER = null, T0 = 0, HELD = [], REL = false, LS = '', LC = 0, GH = {};
  function settled(){ try{ return VIEW === 'today' && document.readyState !== 'loading' && !document.documentElement.classList.contains('cur1320') && !document.hidden; }catch(e){ return false; } }
  window.q1485 = {
    hold: function(L){
      if(L.some(function(x){ return x.kind === 'After class' && /Homework/.test(x.sub || ''); })) L = L.filter(function(x){ return !(x.kind === 'Homework' && /today not marked/i.test(x.title || '')); });   /* S1: the After class row lists it */
      if(REL || !ORDER){ if(REL){ REL = false; ORDER = L.map(K); HELD = []; return L; }
        if(settled()){ var sg = L.map(K).join('#'), now = Date.now(); if(!T0) T0 = now; if(sg !== LS){ LS = sg; LC = now; }
          if(L.length && (now - LC > 5000 || now - T0 > 20000)) ORDER = L.map(K); } HELD = []; return L; }
      var now2 = Date.now(), have = {}; L.forEach(function(x){ var k = K(x); have[k] = 1; GH[k] = { x: x, t: now2 }; });
      /* a row that vanishes for a moment while Today redraws keeps its place for 2.5 s; a row that is really done then leaves */
      var keep = ORDER.map(function(k){ return have[k] ? L.find(function(x){ return K(x) === k; }) : (GH[k] && now2 - GH[k].t < 2500 ? GH[k].x : null); }).filter(Boolean);
      var nw = L.filter(function(x){ return ORDER.indexOf(K(x)) < 0; });
      if(!keep.length){ ORDER = L.map(K); HELD = []; return L; }   /* nothing on screen to keep steady */
      HELD = nw; return keep; },
    chip: function(){ if(!HELD.length) return ''; var red = HELD.some(function(x){ return x.sev <= 1.5; });
      return '<button type="button" class="n1485' + (red ? ' r' : '') + '" onclick="q1485.show()" aria-label="' + HELD.length + ' new item' + (HELD.length === 1 ? '' : 's') + ' in Needs your action · show">+' + HELD.length + ' new</button>'; },
    held: function(){ return HELD.map(K).join(','); },
    show: function(){ REL = true; try{ if(window.q1106More) q1106More(); }catch(e){} },
    reset: function(){ ORDER = null; T0 = 0; HELD = []; REL = false; LS = ''; LC = 0; },
    /* S1 · My class videos folds its per-class lines when each missing video is already a row in Needs your action */
    vids: function(td, L){ try{ var vm = document.getElementById('vidMine'); if(!vm) return;
        var miss = [].slice.call(vm.querySelectorAll('b')).map(function(b){ var m = String(b.textContent).match(/✗\s*(.+?)\s*·\s*(\d{1,2}:\d{2})/); return m ? [m[1].trim(), m[2]] : null; }).filter(Boolean);
        var rows = L.filter(function(x){ return x.kind === 'After class' && /video/i.test(x.sub || ''); }).map(function(x){ return x.title; });
        var all = miss.length && miss.every(function(m){ return rows.some(function(t){ return t.indexOf(m[0]) === 0 && t.indexOf(m[1].replace(/^0/, '')) > -1; }); });
        var open = vm.dataset.o1485 === '1', want = all && !open;
        if(vm.classList.contains('c1485') !== want) vm.classList.toggle('c1485', want);
        var b = vm.querySelector(':scope>.d1485');
        if(all){ if(!b){ b = document.createElement('button'); b.type = 'button'; b.className = 'd1485'; b.onclick = function(){ vm.dataset.o1485 = vm.dataset.o1485 === '1' ? '' : '1'; q1485.vids(td, L); }; vm.appendChild(b); }
          var tx = open ? 'Hide details' : 'Details · ' + miss.length + ' in Needs your action'; if(b.textContent !== tx) b.textContent = tx; b.setAttribute('aria-expanded', open ? 'true' : 'false'); }
        else if(b) b.remove(); }catch(e){} }
  };
  var _go = window.go; if(typeof _go === 'function') window.go = function(v){ var was = typeof VIEW !== 'undefined' ? VIEW : ''; if(v === 'today' && was !== 'today') q1485.reset(); return _go.apply(this, arguments); };
  /* My class videos repaints itself (309): fold again right after, before the screen paints */
  var vmo = null; (function hook(){ var v = document.getElementById('v-today'); if(!v){ setTimeout(hook, 1000); return; }
    vmo = new MutationObserver(function(){ var vm = document.getElementById('vidMine'); if(vm && !vm.querySelector(':scope>.d1485') && window.__q1485L) q1485.vids(null, window.__q1485L); }); vmo.observe(v, { childList: true, subtree: true }); })();
  var _h = q1485.hold; q1485.hold = function(L){ var r = _h(L); window.__q1485L = r; return r; };
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
