// 2225 (14 Nov · Misty: "have a button to remind the teacher on the app too"): To do › Meeting ID missing gets "Remind" on each
// row and "Remind all teachers" at the top. One in-app message per teacher (Messages, needs a reply) lists that teacher's students
// with no meeting ID and says how to add it (tap the class › Meeting ID › Save), which fills it for the student's classes.
// Rows then show "Reminded ✓ 12:52" (kept on this device for the day).
const lib = require("../tools/lib.js"), file = process.argv[2];
const JS = String.raw`
<style id="css2225">
.mt14 .rw{grid-template-columns:86px minmax(0,1fr) 112px 64px 96px!important}
.mt14 .rw .rm{justify-self:end;border:1px solid #CFE6E7;background:#fff;color:#00737B;border-radius:999px;padding:4px 12px;font:600 12.5px Inter,sans-serif;cursor:pointer;white-space:nowrap}
.mt14 .rw .rm:hover{background:#EEF8F9}
.mt14 .rw .rm.ok{border-color:transparent;background:#EEF8F3;color:#1F6E4E;cursor:default}
.mt14 .ra{margin:2px 0 6px;border:0;background:#00939D;color:#fff;border-radius:10px;padding:8px 14px;font:600 13.5px Inter,sans-serif;cursor:pointer}
.mt14 .ra:disabled{opacity:.6;cursor:default}
@media (max-width:560px){.mt14 .rw{grid-template-columns:62px minmax(0,1fr) 84px!important}.mt14 .rw>span:nth-child(3){display:none}.mt14 .rw .n{display:none}}
</style>
<script id="x2225">
(function(){
  if(window.__x2225) return; window.__x2225 = 1;
  const K = 'coe.mt2225.' + new Date().toISOString().slice(0, 10);
  const got = () => { try{ return JSON.parse(localStorage.getItem(K) || '{}') || {}; }catch(e){ return {}; } };
  const DL = d => { const t = new Date(String(d).slice(0, 10) + 'T12:00:00'); return isNaN(t) ? String(d || '') : t.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }); };
  window.mt2225Btn = t => { if(!t) return ''; const s = got()[String(t).toLowerCase()];
    return s ? '<span class="rm ok">Reminded ✓ ' + s + '</span>' : '<button type="button" class="rm" onclick="event.stopPropagation();mt2225Send([\'' + String(t).replace(/[^A-Za-z .-]/g, '') + '\'], this)">Remind</button>'; };
  function list(){ const F = window.FX2214; const x = F && (F.items || []).find(y => y.kind === 'meet'); return (x && x.list) || []; }
  function text(t, L){ const R = L.filter(r => String(r.t).toLowerCase() === t.toLowerCase());
    return 'Hi Teacher ' + t + ', please add the Tencent Meeting ID for ' + (R.length === 1 ? 'this student' : 'these students') + ' (the class has no meeting ID yet, so tonight\'s schedule email shows a blank):\n' +
      R.map(r => '• ' + (r.s || r.code) + ' (' + r.code + ') · first class ' + DL(r.d) + (+r.n > 1 ? ' · ' + r.n + ' classes this week' : '')).join('\n') +
      '\n\nIn your app: tap the class › Meeting ID › type the number › Save. It is then filled in for all of that student\'s classes. Reply here when done. Thank you!'; }
  window.mt2225Send = async function(T, btn){
    const L = list(); if(!L.length) return; if(btn) btn.disabled = true;
    const ok = [], bad = [];
    for(const t of T){ try{ const r = await api('mgmtMsgSend', TOKEN, [t], text(t, L), true, null); if(!r || !r.ok) throw r; ok.push(t); } catch(e){ bad.push(t); } }
    const g = got(), at = new Date().toTimeString().slice(0, 5); ok.forEach(t => g[t.toLowerCase()] = at); try{ localStorage.setItem(K, JSON.stringify(g)); }catch(e){}
    try{ toast(ok.length ? '✓ Reminded ' + ok.map(t => 'Teacher ' + t).join(', ') + ' in the app' + (bad.length ? ' · not sent: ' + bad.join(', ') : '') : 'Not sent · try again'); }catch(e){}
    try{ if(typeof loadMsgs === 'function') loadMsgs(true); }catch(e){}
    document.querySelectorAll('.mt14 .rw').forEach(rw => { const t = rw.dataset.t; if(t && g[t.toLowerCase()]){ const b = rw.querySelector('.rm'); if(b) b.outerHTML = window.mt2225Btn(t); } });
    const ra = document.querySelector('.mt14 .ra'); if(ra){ const left = [...new Set(L.map(r => r.t).filter(Boolean))].filter(t => !g[t.toLowerCase()]); ra.disabled = !left.length; ra.textContent = left.length ? 'Remind all teachers (' + left.length + ')' : 'All teachers reminded ✓'; }
    if(btn && bad.length) btn.disabled = false;
  };
  window.mt2225All = function(btn){ const g = got(); const T = [...new Set(list().map(r => r.t).filter(Boolean))].filter(t => !g[t.toLowerCase()]); if(T.length) mt2225Send(T, btn); };
  window.mt2225Top = L => { const g = got(), T = [...new Set((L || []).map(r => r.t).filter(Boolean))], left = T.filter(t => !g[t.toLowerCase()]);
    return '<button type="button" class="ra" ' + (left.length ? '' : 'disabled ') + 'onclick="mt2225All(this)">' + (left.length ? 'Remind all teachers (' + left.length + ')' : 'All teachers reminded ✓') + '</button>'; };
})();
</script>
`;
lib(file, [
 ["  const row = r => '<div class=\"rw\"><span class=\"d\">'", "  const row = r => '<div class=\"rw\" data-t=\"' + E(r.t || '') + '\"><span class=\"d\">'"],
 ["(+r.n === 1 ? '' : 'es') + '</span></div>';", "(+r.n === 1 ? '' : 'es') + '</span>' + (window.mt2225Btn ? window.mt2225Btn(r.t) : '') + '</div>';"],
 ["until then the teacher\\'s evening email shows a blank.</div>' +", "until then the teacher\\'s evening email shows a blank.</div>' + (window.mt2225Top ? window.mt2225Top(L) : '') +"],
 ["\n</body>\n</html>", "\n" + JS.trim() + "\n</body>\n</html>"]
]);
