// 799: (Misty) Trials › student › "Loading PDF…" — "this is too slow"
// · Each trial PDF used to be fetched from Google Drive (through Apps Script) every time a card was opened: 5–15 s.
// · Now the PDFs still to send (and new ones as they appear) are fetched quietly in the background when the trial list loads,
//   and kept on this device. Opening the card shows the PDF at once. A remade PDF (new link) is fetched again.
// · Kept 21 days; at most 10 fetched ahead, one at a time.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>'); if (i < 0) { console.error('no body'); process.exit(1); }
s = s.slice(0, i) + String.raw`<script>
/* 799 · trial PDFs ready before you open them */
(function(){
  if(window.__799) return; window.__799 = 1;
  let DBP = null;
  const idb = () => DBP || (DBP = new Promise((ok, no) => { try{ const q = indexedDB.open('coe-pdf', 1); q.onupgradeneeded = () => q.result.createObjectStore('p'); q.onsuccess = () => ok(q.result); q.onerror = () => no(q.error); }catch(e){ no(e); } }));
  const get = k => idb().then(d => new Promise(ok => { try{ const q = d.transaction('p').objectStore('p').get(k); q.onsuccess = () => ok(q.result || null); q.onerror = () => ok(null); }catch(e){ ok(null); } })).catch(() => null);
  const put = (k, v) => idb().then(d => new Promise(ok => { try{ const t = d.transaction('p', 'readwrite'); t.objectStore('p').put(v, k); t.oncomplete = () => ok(1); t.onerror = () => ok(0); }catch(e){ ok(0); } })).catch(() => 0);
  const tidy = () => idb().then(d => { try{ const st = d.transaction('p', 'readwrite').objectStore('p'), q = st.openCursor(); q.onsuccess = () => { const c = q.result; if(!c) return; if(!c.value || Date.now() - (c.value.at || 0) > 21 * 864e5) c.delete(); c.continue(); }; }catch(e){} }).catch(() => {});
  const rowOf = lab => ((typeof TRL !== 'undefined' && TRL && TRL.rows) || []).find(x => x.label === lab) || null;
  const FLY = {};
  const _api = window.api;
  function fetchPdf(lab){ const row = rowOf(lab), url = row && row.pdf || ''; if(FLY[lab]) return FLY[lab];
    return FLY[lab] = (async () => { try{ const c = await get(lab); if(c && c.b64 && (!url || c.url === url)) return { ok: true, name: c.name, b64: c.b64, cached: 1 };
      const r = await _api('mgmtTrialPdf', TOKEN, lab); if(r && r.ok && r.b64) put(lab, { url, name: r.name, b64: r.b64, at: Date.now() }); return r; }
      finally{ delete FLY[lab]; } })(); }
  window.api = function(fn, tok, lab){ if(fn === 'mgmtTrialPdf' && typeof lab === 'string') return fetchPdf(lab); return _api.apply(this, arguments); };
  let RUN = 0;
  async function ahead(){ if(RUN || typeof D === 'undefined' || !D || !D.mgr || !TOKEN) return; RUN = 1;
    try{ const L = ((typeof TRL !== 'undefined' && TRL && TRL.rows) || []).filter(x => x && x.pdf && x.label && !/^Sent/i.test(String(x.status || ''))).slice(0, 10);
      for(const x of L){ const c = await get(x.label); if(c && c.url === x.pdf) continue; try{ await fetchPdf(x.label); }catch(e){} await new Promise(z => setTimeout(z, 800)); } }
    finally{ RUN = 0; } }
  window.trPdfAhead = ahead;
  const _lt = window.loadTrials; if(typeof _lt === 'function') window.loadTrials = async function(){ const r = await _lt.apply(this, arguments); setTimeout(ahead, 1500); return r; };
  setTimeout(() => { tidy(); ahead(); }, 6000);
  setInterval(() => { try{ if(!document.hidden) ahead(); }catch(e){} }, 3 * 6e4);
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
