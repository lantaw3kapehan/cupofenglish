/* 2073 (11 Nov, Misty: "CONTINUE THE PLAN TO MOVE OFF GOOGLE"). Every leave save is finished by the database now (migration 2073).
   This sends the two that carry files — a teacher's answer with a file (tLeaveReply) and management's leave save with proof files
   (mgmtLeaveSave) — to the database queue (coe-wq) with time enough for the upload, instead of Google. The files are kept in the app's
   storage (coe-proof). The same save id is used on a retry, so a weak signal never saves twice; it never falls back to Google. */
(function(){
  if(window.__2073) return; window.__2073 = 1;
  const WQ = 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-wq', MG = 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-mgmt';
  const post = (url, body, ms) => { const ac = window.AbortController ? new AbortController() : null, tid = ac ? setTimeout(() => ac.abort(), ms) : 0;
    return fetch(url, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(body), signal: ac ? ac.signal : undefined }).then(x => x.json()).finally(() => clearTimeout(tid)); };
  const filesOf = (fn, a) => fn === 'tLeaveReply' ? (Array.isArray(a[3]) ? a[3] : []) : (a[1] && Array.isArray(a[1].files) ? a[1].files : []);
  async function send(fn, a){
    const rid = 'w-lv' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8), body = { token: a[0], fn, args: a, rid };
    let r = null; for(let i = 0; i < 3 && !(r && r.ok); i++){ if(i) await new Promise(z => setTimeout(z, 1500 * i)); try{ r = await post(WQ, body, 90000); }catch(e){ r = null; } if(r && r.ok === false && r.error) break; }
    if(!r || !r.ok) throw { msg: r && r.error === 'too big' ? 'The files are too big. Attach smaller photos or a PDF under 10 MB.' : 'Not sent · check your internet and try again.' };
    if(fn === 'tLeaveReply') return { ok: true, files: filesOf(fn, a).length, note: 'Sent · Operations will check it', db: !!r.db };
    try{ const s = await post(MG, { op: 'writeStatus', token: a[0], id: r.id }, 8000);
      if(s && s.ok && s.status === 'done' && s.result && s.result.ok) return s.result;
      if(s && s.ok && s.status === 'error') return { ok: false, msg: (s.result && s.result.msg) || s.error || 'Not saved.' }; }catch(e){}
    return { ok: true, queued: true, note: 'Saved' }; }
  const wrap = base => { const w = function(fn){ const a = Array.prototype.slice.call(arguments, 1);
      if((fn === 'tLeaveReply' || fn === 'mgmtLeaveSave') && filesOf(fn, a).length && typeof TOKEN !== 'undefined' && TOKEN && a[0] === TOKEN && !window.__leaveGoogle2073) return send(fn, a);
      return base.apply(this, arguments); };
    for(const k in base) try{ w[k] = base[k]; }catch(e){} w.__2073 = 1; return w; };
  if(typeof window.api === 'function') window.api = wrap(window.api);
  if(typeof window.apiNow === 'function') window.apiNow = apiNow = wrap(window.apiNow);
})();
