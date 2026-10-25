// 1092: (Misty, 25 Oct 21:42) "it takes time to return, everything is slow and I need to repeat the task again, especially
//      when unsure if it was returned or not" — Parent reports › Return to teacher is now saved at once.
// · The return goes to the database first (new function coe-rq): about 1 s, the window closes, the report shows "Returned"
//   straight away, and Google's own "return" runs in the background with the same sign-in (as with class edits).
// · The same tap can never send it twice (one save id per return box); the report keeps showing "Returned" on this device
//   for 10 minutes even if Google's list has not caught up yet, so there is no doubt whether it went through.
// · If Google refuses it, the report goes back to "To check" and a message says why. If the database cannot be reached,
//   the old way (straight to Google, "Returning…") is used.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 1092 · Return to teacher saved at once (coe-rq) */
(function(){
  if(window.__1092) return; window.__1092 = 1;
  var LK = 'coe.rq1092';
  var getP = function(){ try{ var o = JSON.parse(localStorage.getItem(LK) || '{}'), n = Date.now(), k; for(k in o) if(n - o[k].t > 600000) delete o[k]; return o; }catch(e){ return {}; } };
  var setP = function(o){ try{ localStorage.setItem(LK, JSON.stringify(o)); }catch(e){} };
  function overlay(){ try{ if(typeof RP === 'undefined' || !RP || !RP.rows) return; var p = getP(); RP.rows.forEach(function(r){ var x = p[r.key]; if(x && !/^Sent/.test(r.status) && r.status !== 'Returned'){ r.status = 'Returned'; r.note = x.note; r.by = x.by || r.by; } }); }catch(e){} }
  var _rr = window.renderReports; if(typeof _rr === 'function') window.renderReports = function(){ overlay(); return _rr.apply(this, arguments); };
  async function watch(id, x, prev){
    for(var i = 0; i < 40; i++){
      await new Promise(function(z){ setTimeout(z, i < 6 ? 4000 : 8000); });
      var r = null; try{ r = await fetch(FAST_URL + '-mgmt', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'writeStatus', id: id, token: TOKEN }) }).then(function(y){ return y.json(); }); }catch(e){}
      if(!r || !r.ok) continue;
      if(r.status === 'done') return;
      if(r.status === 'error'){ var p = getP(); delete p[x.key]; setP(p);
        try{ var row = (RP && RP.rows || []).find(function(y){ return y.key === x.key; }); if(row) Object.assign(row, prev); keep('rep', RP); renderReports(); }catch(e){}
        var msg = String(r.error || (r.result && r.result.msg) || 'Google did not accept it');
        try{ openSheet('<h1>Not returned</h1><div class="fbfix" style="margin-top:10px;border-left:4px solid #C0392B"><b style="color:#B23A22">' + esc(x.student) + '’s report is back in To check</b><div class="small">' + esc(msg) + '</div></div><button class="btn ghost block" style="margin-top:12px" onclick="closeSheet()">OK</button>'); }catch(e){ toast('Not returned · ' + msg); }
        return; } } }
  var _go = window.rpReturnGo;
  window.rpReturnGo = async function(){
    if(typeof RPD === 'undefined' || !RPD || !TOKEN || typeof FAST_URL === 'undefined') return _go.apply(this, arguments);
    var x = RPD.report, ta = document.getElementById('rpNote'), note = ta ? ta.value.trim() : ''; if(note.length < 5) return toast('Write what to fix');
    var b = document.getElementById('rpRetB'), bx = document.getElementById('rpRetX'); if(b && b.disabled) return;
    if(b){ b.disabled = true; b.textContent = 'Returning…'; } if(bx) bx.disabled = true;
    if(ta && !ta.dataset.rid) ta.dataset.rid = 'rq' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    var ac = window.AbortController ? new AbortController() : null, tid = ac ? setTimeout(function(){ ac.abort(); }, 9000) : 0, r = null;
    try{ r = await fetch(FAST_URL + '-rq', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, key: x.key, note: note, rid: ta ? ta.dataset.rid : '' }), signal: ac ? ac.signal : undefined }).then(function(y){ return y.json(); }); }catch(e){ r = null; } finally{ clearTimeout(tid); }
    if(!(r && r.ok && r.queued)){ if(b){ b.disabled = false; b.textContent = 'Return to teacher'; } if(bx) bx.disabled = false; return _go.apply(this, arguments); }
    var prev = { status: x.status, note: x.note, by: x.by, at: x.at };
    var p = getP(); p[x.key] = { t: Date.now(), note: note, by: (D && D.name) || '' }; setP(p);
    x.status = 'Returned'; x.note = note; rpLocal(x); closeSheet();
    toast('Returned to Teacher ' + x.teacher + ' · it shows on their Today');
    watch(r.queued, x, prev);
  };
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
