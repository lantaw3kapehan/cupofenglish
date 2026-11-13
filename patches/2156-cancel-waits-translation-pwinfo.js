// 2156 (13 Nov · Misty 12:12 "do all now"):
// (1) Cancel class: when the pasted parent's message is in Chinese and its English is not back yet, tapping Cancel waits for it
//     (at most 4 s), so the teacher always gets the English with it. Not Chinese / already translated: no wait.
// (2) Password screen ("Password already set / not set"): asked from the database first (coe-pw › info), which also knows passwords
//     set in the app (since 2153); a password Google set, or no answer, → Google as before.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
  ["  window.cxReason2154 = function(){",
   "  window.cxEnReady2156 = function(){ const v = String((document.getElementById('eR') || {}).value || '').trim(); if(!zh(v) || (EN.src === v && EN.en)) return Promise.resolve();\n    clearTimeout(T); const box = document.getElementById('eREn'); if(box) box.textContent = 'English for the teacher: translating…';\n    const go2 = Promise.resolve().then(() => api('trEn', TOKEN, v)).then(r => { const en = String((r && r.en) || '').trim(); if(en){ EN = { src: v, en }; const b2 = document.getElementById('eREn'); if(b2) b2.textContent = 'English for the teacher: ' + en; } }).catch(() => {});\n    return Promise.race([go2, new Promise(z => setTimeout(z, 4000))]); };\n  window.cxReason2154 = function(){"],
  ["</script>\n</body>\n</html>",
   `</script>
<script id="x2156">
/* 2156 · Cancel waits for the English · Password screen from the database */
(function(){
  const se = window.sendEdit;
  if(typeof se === 'function') window.sendEdit = function(i, action, src){ const self = this, a = arguments;
    if(action === 'cancel' && window.cxEnReady2156 && !window.__cxW2156){ window.__cxW2156 = 1; try{ toast('Translating the message…'); }catch(e){}
      return window.cxEnReady2156().then(() => { window.__cxW2156 = 0; return se.apply(self, a); }, () => { window.__cxW2156 = 0; return se.apply(self, a); }); }
    return se.apply(this, arguments); };
  const base = window.api;
  if(typeof base === 'function'){ const w = function(fn){ const a = arguments, self = this;
      if(fn === 'mgmtPwInfo' && typeof FAST_URL !== 'undefined'){ const ac = window.AbortController ? new AbortController() : null, t = ac ? setTimeout(() => ac.abort(), 5000) : 0;
        return fetch(FAST_URL + '-pw', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'info', token: a[1], name: a[2] }), signal: ac ? ac.signal : undefined })
          .then(x => x.json()).finally(() => clearTimeout(t)).then(r => r && r.ok ? { has: !!r.has, at: r.at || '', by: r.by || '', msg: r.msg } : base.apply(self, a), () => base.apply(self, a)); }
      return base.apply(this, arguments); };
    for(const k in base) try{ w[k] = base[k]; }catch(e){}
    window.api = w; }
})();
</script>
</body>
</html>`],
]);
