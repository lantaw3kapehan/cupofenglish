/* 2064 (11 Nov, Misty: "Fully off Google" · "ensure everything goes directly to the app now and that no google").
   Monthly feedback and parent reports never ask Google. Placed last, so it answers before every older layer (which still had
   "Google when the database cannot answer"):
   · tFbForm   → coe-fbform (the form from the database; teachers and management)
   · tFbPlus   → coe-fbp (the feedback helper; no daily compare with Google)
   · tFbStatus → the database's own list (coe "docs", worked out live), else the copy on this phone
   · mgmtReports / mgmtReportsWait → coe-lists · mgmtReport → coe-taps · mgmtReportPdf → none (the report is the app's picture)
   If the database does not answer, the screen says so; it never falls back to Google. Sends (tFbSubmit, report Sent / Returned)
   are finished by the database itself (2064 migrations). */
(function(){
  if(window.__2064) return; window.__2064 = 1;
  const F = 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/';
  const NOG = /^(tFbForm|tFbPlus|tFbStatus|mgmtReport|mgmtReports|mgmtReportsWait|mgmtReportPdf)$/;
  const post = (url, body, ms) => { const ac = window.AbortController ? new AbortController() : null, tid = ac ? setTimeout(() => ac.abort(), ms) : 0;
    return fetch(url, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(body), signal: ac ? ac.signal : undefined }).then(x => x.json()).finally(() => clearTimeout(tid)); };
  const fail = m => { const e = new Error(m); e.msg = m; throw e; };
  async function db(fn, a){
    const tok = a[0];
    if(fn === 'tFbForm'){ let r = null; try{ r = await post(F + 'coe-fbform', { token: tok, code: a[1] }, 15000); }catch(e){}
      if(r && r.ok) return r; if(r && r.msg) return { ok: false, msg: r.msg, notYet: !!r.notYet };
      return { ok: false, msg: 'Could not open the feedback form. Check your internet and try again.' }; }
    if(fn === 'tFbPlus'){ const r = await post(F + 'coe-fbp', { token: tok, code: String(a[1] || '').trim().toUpperCase() }, 10000).catch(() => null);
      if(r && r.ok) return r; fail('The feedback helper is not available right now.'); }
    if(fn === 'tFbStatus'){ let d = null; try{ d = await sbDoc(sbKey(fn, a)); }catch(e){}
      if(d && d.data && d.data.month) return d.data;
      try{ const c = JSON.parse(store('get', 'coe.fb') || 'null'); if(c && c.month) return c; }catch(e){}
      fail('The feedback list could not be loaded. Check your internet.'); }
    if(fn === 'mgmtReports' || fn === 'mgmtReportsWait'){
      const r = await post(F + 'coe-lists', { token: tok, op: fn === 'mgmtReports' ? 'reports' : 'reportswait', month: a[1] || '' }, 15000).catch(() => null);
      if(r && r.ok && r.data != null) return r.data; fail('Parent reports could not be loaded. Check your internet and try again.'); }
    if(fn === 'mgmtReport'){ const r = await post(F + 'coe-taps', { token: tok, op: 'report', key: a[1] }, 15000).catch(() => null);
      if(r && r.ok && r.data && r.data.report) return r.data; fail('This report could not be opened. Check your internet and try again.'); }
    if(fn === 'mgmtReportPdf') return { ok: false, msg: 'The report is made in the app.' };
  }
  const wrap = base => { const w = function(fn){ const a = Array.prototype.slice.call(arguments, 1);
      if(NOG.test(fn) && a[0] && typeof TOKEN !== 'undefined' && a[0] === TOKEN && !(typeof window.__fbGoogle2064 !== 'undefined' && window.__fbGoogle2064)) return db(fn, a);
      return base.apply(this, arguments); };
    for(const k in base) try{ w[k] = base[k]; }catch(e){} w.__2064 = 1; return w; };
  if(typeof window.api === 'function') window.api = wrap(window.api);
  if(typeof window.apiNow === 'function') window.apiNow = apiNow = wrap(window.apiNow);
})();
