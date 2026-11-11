/* 2075 (11 Nov, Misty: "CONTINUE THE PLAN TO MOVE OFF GOOGLE"). Memorandums are made by the database (migration memos_db_only_2075):
   · the memo form's number, full names, signer and title come from docs mgmt:memoInfo (kept by the database), not Google;
   · sending a memo goes through the database like any other notice (the database writes one memo per person and keeps the number). */
(function(){
  if(window.__2075) return; window.__2075 = 1;
  const post = (url, body, ms) => { const ac = window.AbortController ? new AbortController() : null, tid = ac ? setTimeout(() => ac.abort(), ms) : 0;
    return fetch(url, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(body), signal: ac ? ac.signal : undefined }).then(x => x.json()).finally(() => clearTimeout(tid)); };
  async function info(tok){
    const r = await post(FAST_URL, { op: 'docs', token: tok, keys: ['mgmt:memoInfo'] }, 10000);
    const d = r && r.ok && r.docs && r.docs['mgmt:memoInfo'] && r.docs['mgmt:memoInfo'].data;
    if(!d || !d.no) throw new Error('Could not load the memo details. Check your internet.');
    const me = (typeof D !== 'undefined' && D && D.me) || {}, nm = String(me.name || ''), s = (d.staff || {})[nm.toLowerCase()] || {}, pres = !!(typeof D !== 'undefined' && D && D.pres);
    return { no: d.no, names: d.names || {}, signer: s.full || (d.names || {})[nm.toLowerCase()] || nm, title: pres ? 'President' : (s.title || 'Operations Coordinator'), pres, db: true }; }
  /* sending goes only through api (fastWrite falls back to apiNow = Google if the database cannot be reached, never round in a loop) */
  const wrap = (base, send) => { const w = function(fn){ const a = Array.prototype.slice.call(arguments, 1);
      if(!window.__memoGoogle2075 && typeof TOKEN !== 'undefined' && TOKEN && a[0] === TOKEN){
        if(fn === 'mgmtMemoInfo') return info(a[0]);
        if(send && fn === 'mgmtMsgSend' && a[4] && typeof a[4] === 'object' && a[4].subject && typeof fastWrite === 'function') return fastWrite('mgmtMsgSend', a); }
      return base.apply(this, arguments); };
    for(const k in base) try{ w[k] = base[k]; }catch(e){} w.__2075 = 1; return w; };
  if(typeof window.api === 'function') window.api = wrap(window.api, true);
  if(typeof window.apiNow === 'function') window.apiNow = apiNow = wrap(window.apiNow, false);
})();
