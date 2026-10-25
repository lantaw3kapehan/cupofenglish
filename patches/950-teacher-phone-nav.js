// 950 (D5 · Teacher role): phones (< 900 px) showed all 11 teacher menu entries in the bottom bar. At 390 px the bar is 444 px
//      wide, so "Pay" was cut and "My Contract" sat off-screen with no way to scroll to it (checked in the teacher preview:
//      #navIn scrollWidth 444 > 390, overflow visible). Teachers mostly use phones.
//      Now, for teachers on phones only, the bar keeps the five daily screens (Today · Schedule · Students · Messages · Pay)
//      and a "More" entry, exactly like management's phone bar. "More" is a page (view `more`) listing every other teacher
//      screen (Books, Activity log, Growth, QA feedback, Trainings, My Contract, and any entry added later), each with one line
//      on what it is. A red dot on a hidden entry (e.g. a contract to sign) also shows on "More".
//      Laptop menu (≥ 900 px) is unchanged: every entry, in the same groups. No screen, permission or data is changed.
//      Phone header: the teacher's name was hidden and the rank line squeezed to ~30 px ("Senior Teach… ₱180/l"); on phones the
//      name is shown (one line, ellipsis) and the rank line is dropped (rank and rate stay on Pay, Growth and Trainings).
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8'); const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 950 · teacher phone bar: 5 daily screens + More (a page) */
(function(){ if(window.__950) return; window.__950 = 1;
  var PRI = { today: 1, tsched: 1, students: 1, tinbox: 1, pay: 1 };
  var DESC = { books: 'Course books for your classes · Student’s Book, Workbook, unit files', act: 'Every save today, timed by the server · copy as proof',
    growth: 'Career path, attendance, class record and recognition', qa: 'Your monthly teaching evaluation from management',
    train: 'Trainings for your next rank and the books you can teach', contract: 'Your Agreement, addenda to sign and any notices' };
  var isT = function(){ return typeof D !== 'undefined' && D && !D.mgr; };
  var css = '@media(max-width:899px){body.role-t nav button.t950s{display:none!important}body.role-t nav button.mor{display:flex}}'
    + '@media(min-width:900px){body.role-t nav button.mor{display:none!important}}'
    + 'body:not(.role-t) nav button.t950m{display:none!important}'
    + '@media(max-width:520px){body.role-t .hd .who #hName{display:block!important;font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}body.role-t .hd .who #hRank{display:none!important}}'
    + '#v-more .t950 .li{cursor:pointer}#v-more .t950 .li:focus-visible{outline:2px solid #00808B;outline-offset:2px}';
  var st = document.createElement('style'); st.id = 's950'; st.textContent = css; document.head.appendChild(st);
  function mark(){ try{ document.body.classList.toggle('role-t', isT()); if(!isT()) return; var n = document.getElementById('navIn'); if(!n) return;
      n.querySelectorAll('button[data-v]').forEach(function(b){ var v = b.dataset.v; if(v === 'more') return; b.classList.toggle('t950s', !PRI[v]); });
      var m = n.querySelector('button.t950m'); if(!m){ n.insertAdjacentHTML('beforeend', '<button data-v="more" class="mor t950m" type="button" onclick="go(\'more\')" aria-label="More screens">' + ((window.ICON || {}).more || (typeof ICON !== 'undefined' ? ICON.more : '')) + '<span class="nl">More</span><i class="dot hide" id="dT950"></i></button>'); m = n.querySelector('button.t950m'); }
      on(); dot(); }catch(e){} }
  function on(){ try{ if(!isT()) return; var m = document.querySelector('nav button.t950m'); if(!m) return; var v = typeof VIEW !== 'undefined' ? VIEW : '';
      var sec = v && v !== 'more' && !PRI[v] && !!document.querySelector('nav button.t950s[data-v="' + v + '"]');
      m.classList.toggle('on', v === 'more' || sec); if(v === 'more' || sec) m.setAttribute('aria-current', 'page'); else m.removeAttribute('aria-current'); }catch(e){} }
  function dot(){ try{ var d = document.getElementById('dT950'); if(!d) return; var n = 0;
      document.querySelectorAll('nav button.t950s .dot').forEach(function(x){ if(x.id === 'dT950') return; var cs = getComputedStyle(x); if(cs.display !== 'none' && !x.classList.contains('hide') && String(x.textContent).trim() !== '' && String(x.textContent).trim() !== '0') n++; });
      d.classList.toggle('hide', !n); d.textContent = n ? '!' : ''; }catch(e){} }
  function more(){ var el = document.getElementById('v-more'); if(!el) return;
    var L = (typeof NAV_T !== 'undefined' ? NAV_T : []).filter(function(x){ return !PRI[x[0]]; });
    el.innerHTML = '<div class="lead"><h1>More</h1><div class="mute small">Your other screens · the same as the laptop menu</div></div><div class="t950" style="margin-top:12px">'
      + L.map(function(x){ var v = x[0], b = document.querySelector('nav button[data-v="' + v + '"] .dot'), has = b && !b.classList.contains('hide') && getComputedStyle(b).display !== 'none' && String(b.textContent).trim() && String(b.textContent).trim() !== '0';
        return '<div class="li" role="link" tabindex="0" onclick="go(\'' + v + '\')" onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault();go(\'' + v + '\')}"><div class="av">' + ((typeof ICON !== 'undefined' && ICON[x[2]]) || '') + '</div><div class="grow"><b>' + esc(x[1]) + '</b>' + (has ? ' <span class="chip red">New</span>' : '') + '<div class="small mute">' + esc(DESC[v] || '') + '</div></div><span class="mute" aria-hidden="true">›</span></div>'; }).join('') + '</div>'; }
  var _bn = window.buildNav; if(typeof _bn === 'function') window.buildNav = function(){ var r = _bn.apply(this, arguments); mark(); return r; };
  var _rm = window.renderMore; window.renderMore = function(){ if(isT()) return more(); return _rm ? _rm.apply(this, arguments) : undefined; };
  var _go = window.go; if(typeof _go === 'function') window.go = function(v){ var r = _go.apply(this, arguments); try{ if(isT() && v === 'more') more(); on(); }catch(e){} return r; };
  setInterval(function(){ if(isT() && !document.hidden){ if(!document.querySelector('nav button.t950m')) mark(); dot(); } }, 3000);
  (function w(){ if(typeof D === 'undefined' || !D || !document.getElementById('navIn')){ setTimeout(w, 500); return; } mark(); })();
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
