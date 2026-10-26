// 1105: (Misty, 26 Oct 12:00 · "reliable completion: saved confirmation; failed actions stay pending with Retry; never silently
//      mark complete") — Today's class checklist shows what is still being saved and what did not save:
// · Homework "Given": the chip says "Homework · saving…" (no tick) until the database has the save; then ✓ Homework.
//   If it does not save, the chip turns red "Homework · not saved — tap to retry" (the same tap opens the homework box as
//   before) and stays until it is saved. The existing message "Homework not saved. Tap again." still shows.
// · "I'm in": while the time-in is still being saved the chip says "In · saving…" (it was already kept as pending, the tick
//   only shows once the save is through).
// Display only: the saving code, the queue and the records are unchanged.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
const css = `
#v-today .cs93>span.p1105{background:#F0EEF5!important;color:#3A3556!important}
#v-today .cs93>span.p1105 i{display:none}
#v-today .cs93>span.p1105::before{content:"";width:10px;height:10px;border-radius:50%;border:2px solid #8C88A3;border-top-color:transparent;display:inline-block;margin-right:6px;animation:sp1105 .9s linear infinite;vertical-align:-1px}
@keyframes sp1105{to{transform:rotate(360deg)}}
@media (prefers-reduced-motion:reduce){#v-today .cs93>span.p1105::before{animation:none}}
#v-today .cs93>span.f1105{background:#FDECEA!important;color:#B42318!important;box-shadow:inset 0 0 0 1px #F0BDB6}
`;
const js = String.raw`
(function(){
  if(window.__1105) return; window.__1105 = 1;
  var PEND = {}, FAIL = {};
  function chip(id, re){ var v = document.getElementById('v-today'); if(!v) return null; var el = v.querySelector('.cs93>span[onclick*="\'' + id + '\'"]'); var all = el ? [].slice.call(el.parentElement.children) : []; return all.find(function(s){ return re.test(s.textContent); }) || null; }
  function paint(){ try{ if(typeof D === 'undefined' || !D || D.mgr) return;
    Object.keys(PEND).forEach(function(id){ var c = chip(id, /homework/i); if(c && !c.classList.contains('p1105')){ c.classList.add('p1105'); c.lastChild && (c.lastChild.textContent = 'Homework · saving…'); } });
    Object.keys(FAIL).forEach(function(id){ if(D.hw && D.hw[id]){ delete FAIL[id]; return; } var c = chip(id, /homework/i); if(c && !c.classList.contains('f1105')){ c.classList.add('f1105'); c.title = 'Not saved · tap to try again'; if(c.lastChild) c.lastChild.textContent = 'Homework · not saved — tap to retry'; } });
    var ci = D.classIns || {}; Object.keys(ci).forEach(function(id){ if(!ci[id] || !ci[id].pending) return; var c = chip(id, /\bIn\b/); if(c && !c.classList.contains('p1105')){ c.classList.add('p1105'); if(c.lastChild) c.lastChild.textContent = 'In · saving…'; } });
  }catch(e){} }
  var _m = window.markHw;
  if(typeof _m === 'function') window.markHw = async function(id){ var had = !!(D && D.hw && D.hw[id]); delete FAIL[id];
    var pr = _m.apply(this, arguments), done = false, tried = false;
    var look = function(){ if(!done && !had && D && D.hw && D.hw[id] && !tried){ tried = true; PEND[id] = 1; later(); } };   /* the tick was set: the save started */
    look(); var iv = setInterval(function(){ if(done) return clearInterval(iv); look(); }, 50);
    try{ return await pr; }
    finally{ done = true; clearInterval(iv); look(); delete PEND[id]; if(tried && APIF[id] && !(D && D.hw && D.hw[id])) FAIL[id] = 1; delete APIF[id]; try{ renderToday(); }catch(e){} later(); } };
  /* a save counts as failed only when the server said no (or could not be reached) */
  var APIF = {}, _api = window.api;
  if(typeof _api === 'function') window.api = function(fn){ var a = arguments, id = fn === 'markHomework' && a[2] && a[2].id; var r = _api.apply(this, a); if(!id || !r || typeof r.then !== 'function') return r;
    delete APIF[id]; return r.then(function(x){ if(!x || x.ok === false) APIF[id] = 1; return x; }, function(e){ APIF[id] = 1; throw e; }); };
  var t = 0, later = function(){ clearTimeout(t); t = setTimeout(paint, 40); };
  ['renderToday', 'render'].forEach(function(nm){ var f = window[nm]; if(typeof f !== 'function') return; window[nm] = function(){ var r = f.apply(this, arguments); later(); return r; }; });
  var v = document.getElementById('v-today'); if(v) new MutationObserver(later).observe(v, { childList: true });
  setInterval(function(){ if(Object.keys(PEND).length || Object.keys(FAIL).length || (typeof D !== 'undefined' && D && D.classIns && Object.keys(D.classIns).some(function(k){ return D.classIns[k] && D.classIns[k].pending; }))) paint(); }, 300);   /* cards are redrawn often: keep the state on them */
})();
`;
s = s.slice(0, i) + '<style id="d1105">/* 1105 · Today saving states */' + css + '</style>\n<script>' + js + '</script>\n' + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
