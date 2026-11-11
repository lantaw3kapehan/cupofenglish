/* 2074 (11 Nov, Misty: "CONTINUE THE PLAN TO MOVE OFF GOOGLE"). A NEW enquiry is made by the database (it gives the EQ- number,
   migration enquiries_db_only_2074), through the database queue (coe-wq), instead of Google. Changes already went there.
   The answer is the same as Google's ({ok, id, at, by}), so the list swaps the "tmp" entry for the real number as before. */
(function(){
  if(window.__2074) return; window.__2074 = 1;
  const WQ = 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-wq', MG = 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-mgmt';
  const post = (url, body, ms) => { const ac = window.AbortController ? new AbortController() : null, tid = ac ? setTimeout(() => ac.abort(), ms) : 0;
    return fetch(url, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(body), signal: ac ? ac.signal : undefined }).then(x => x.json()).finally(() => clearTimeout(tid)); };
  async function make(a){
    const body = { token: a[0], fn: 'mgmtEnqSave', args: a, rid: 'w-eq' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8) };
    let r = null; for(let i = 0; i < 3 && !(r && r.ok); i++){ if(i) await new Promise(z => setTimeout(z, 1500 * i)); try{ r = await post(WQ, body, 15000); }catch(e){ r = null; } if(r && r.ok === false && r.error) break; }
    if(!r || !r.ok || !r.id) throw new Error('Not saved · check the connection and try again');
    for(let i = 0; i < 8; i++){   /* finished by the database at once; a refusal is answered by Google within seconds */
      try{ const s = await post(MG, { op: 'writeStatus', token: a[0], id: r.id }, 8000);
        if(s && s.ok && s.status === 'done' && s.result && s.result.ok) return s.result;
        if(s && s.ok && s.status === 'error') return { ok: false, msg: (s.result && s.result.msg) || s.error || 'Not saved.' }; }catch(e){}
      await new Promise(z => setTimeout(z, 2500)); }
    return { ok: false, msg: 'Saving took too long · refresh in a minute to see it' }; }
  const wrap = base => { const w = function(fn){ const a = Array.prototype.slice.call(arguments, 1);
      if(fn === 'mgmtEnqSave' && a[1] && typeof a[1] === 'object' && !a[1].id && typeof TOKEN !== 'undefined' && TOKEN && a[0] === TOKEN && !window.__enqGoogle2074) return make(a);
      return base.apply(this, arguments); };
    for(const k in base) try{ w[k] = base[k]; }catch(e){} w.__2074 = 1; return w; };
  if(typeof window.api === 'function') window.api = wrap(window.api);
  if(typeof window.apiNow === 'function') window.apiNow = apiNow = wrap(window.apiNow);
})();
