/* 2072 (11 Nov, Misty: "CONTINUE THE PLAN TO MOVE OFF GOOGLE"). A teacher's leave request is finished by the database, and its proof
   files are kept in the app's own storage (coe-proof), not Google Drive. "View proof" opens those directly, with no Google call.
   Older proofs (a Google Drive file id) still open through Google as before. */
(function(){
  if(window.__2072) return; window.__2072 = 1;
  const MINE = /^https:\/\/rlxkiahqjsabopmuhern\.supabase\.co\/storage\/v1\/object\/public\/proofs\//;
  function proofOf(id, i){ try{ const rows = (typeof LV !== 'undefined' && LV && LV.rows) || [], x = rows.find(r => r.id === id); return x && x.proof ? x.proof[+i] : null; }catch(e){ return null; } }
  async function viaStorage(p){
    const ac = window.AbortController ? new AbortController() : null, tid = ac ? setTimeout(() => ac.abort(), 20000) : 0;
    try{ const res = await fetch(p.id, { signal: ac ? ac.signal : undefined }); if(!res.ok) throw new Error('http');
      const blob = await res.blob(), b64 = await new Promise((ok, no) => { const fr = new FileReader(); fr.onload = () => ok(String(fr.result).split(',')[1] || ''); fr.onerror = no; fr.readAsDataURL(blob); });
      const nm = String(p.name || 'Proof').replace(/^\d{4}-\d{2}-\d{2} \d{4} [^·]*· /, '');
      return { ok: true, b64, mime: blob.type || 'application/octet-stream', name: nm, db: true }; }
    catch(e){ return { ok: false, msg: 'Could not open the proof. Check your internet.' }; }
    finally{ clearTimeout(tid); } }
  const wrap = base => { const w = function(fn){ const a = Array.prototype.slice.call(arguments, 1);
      if(fn === 'mgmtLeaveProof'){ const p = proofOf(a[1], a[2]); if(p && MINE.test(String(p.id || ''))) return viaStorage(p); }
      return base.apply(this, arguments); };
    for(const k in base) try{ w[k] = base[k]; }catch(e){} w.__2072 = 1; return w; };
  if(typeof window.api === 'function') window.api = wrap(window.api);
  if(typeof window.apiNow === 'function') window.apiNow = apiNow = wrap(window.apiNow);
})();
