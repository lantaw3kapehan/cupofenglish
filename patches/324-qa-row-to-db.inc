/* 19 Oct · 324 · A QA sent from the app reaches the database at once (Misty: "copy it and solve this problem")
   After Google accepts the form, the same answers go to coe_qa_row_put (title + answer, placed under the QA-DATA column with that title),
   so Teacher Excellence, the QA form history and Performance count it within seconds. Google's own tab copy writes the same row over it later. */
(function(){
  const post = (fn, args) => fetch(FAST_URL + '-mgmt', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'screen', fn, args: args || [], token: TOKEN }) }).then(x => x.json()).then(r => { if(!(r && r.ok)) throw new Error(fn); return r.data; });
  const ts = () => new Date(Date.now() + 8 * 3600e3).toISOString().slice(0, 19);
  function send(a, tries){ try{
      const its = QF.form.items.filter(x => x.type !== 'SECTION_HEADER' && x.type !== 'PAGE_BREAK');
      const row = [ts()].concat(its.map(x => { const v = a[x.id]; return String(x.title).trim() + '\u001f' + (Array.isArray(v) ? v.join(', ') : String(v == null ? '' : v)); }));
      post('mgmtQaRow', [row]).then(d => { if(d && d.ok === false) console.warn('QA row', d); }).catch(() => { if(tries > 0) setTimeout(() => send(a, tries - 1), 5000); });
    }catch(e){ console.warn('QA row', e); } }
  const _api = api; api = function(fn, ...args){ const p = _api(fn, ...args);
    if(fn === 'mgmtQaSubmit' && typeof D !== 'undefined' && D && D.mgr){ const a = Object.assign({}, args[1] || {}); Promise.resolve(p).then(r => { if(r && r.ok) send(a, 2); }).catch(() => {}); }
    return p; };
})();
