/* 2065 (11 Nov, Misty: "LET US DO ALL NOW" · trial reports and progress checks off Google).
   Placed last, so it answers before the older layers that still had "Google when the database cannot answer":
   · tTrialForm / tPcForm → coe-trform (the forms from the database)
   · mgmtZh (Chinese of a teacher's text) → the reviewed Chinese the hourly review saves (docs zh:<hash>); never Google's translator.
     A text not reviewed yet comes back empty, so the report shows the English and "Chinese being prepared".
   · mgmtTrialPdf / mgmtTrialPdfNow → none (the trial report is the app's own, made at once)
   · mgmtPcPdf → the progress report made in the app (the same PR-REPORT design, two A4 pages), instead of Google's PR-REPORT sheet
   · mgmtTab / tDoc for PRREP (the Progress report on a student's profile) → the same page from the database
   Sends (tTrialSubmit, tPcSubmit, trial Sent / Return / CEFR / learner type) are finished by the database (migrations 2065). */
(function(){
  if(window.__2065) return; window.__2065 = 1;
  const F = 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/';
  const NOG = /^(tTrialForm|tPcForm|mgmtZh|mgmtTrialPdf|mgmtTrialPdfNow|mgmtPcPdf|mgmtTab|tDoc)$/;
  const post = (url, body, ms) => { const ac = window.AbortController ? new AbortController() : null, tid = ac ? setTimeout(() => ac.abort(), ms) : 0;
    return fetch(url, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(body), signal: ac ? ac.signal : undefined }).then(x => x.json()).finally(() => clearTimeout(tid)); };
  const trim = s => String(s == null ? '' : s).replace(/^[ \t\r\n]+|[ \t\r\n]+$/g, '');
  async function zhKey(t){ const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(trim(t))); return 'zh:' + [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('').slice(0, 40); }
  const ZH = {};
  async function zhOf(list){ const L = (Array.isArray(list) ? list : [list]).map(x => trim(x)), keys = await Promise.all(L.map(zhKey)), need = keys.filter((k, i) => L[i] && !(k in ZH));
    if(need.length){ try{ const r = await post(FAST_URL, { op: 'docs', token: TOKEN, keys: need.slice(0, 60) }, 8000); need.forEach(k => { const d = r && r.ok && r.docs && r.docs[k]; ZH[k] = d && d.data && d.data.zh ? String(d.data.zh) : ''; }); }catch(e){} }
    return keys.map((k, i) => L[i] ? (ZH[k] || '') : ''); }
  window.coeZh2065 = zhOf;
  /* The progress report keeps the CURRENT design (Misty 11 Nov: "ensure design still follows our current"): the app's own copy of the
     PR-REPORT tab (DOCS.PRREP · docHtml), filled from the database by coe-trform "prrows" cell for cell like the Google tab
     (checked against 13 Google copies). The picture is two A4 pages, like the PDF Google exported. */
  const prRows = (tok, q) => post(F + 'coe-trform', Object.assign({ token: tok, op: 'prrows' }, q), 15000).catch(() => null);
  async function pcPdf(code){
    const R = await prRows(TOKEN, { code });
    if(!R || !R.ok) throw { msg: (R && R.msg) || 'Could not load the progress check. Check your internet.' };
    const [H2C, PDF] = await Promise.all([h2c(), window.coeJsPdf ? coeJsPdf() : Promise.reject(new Error('pdf'))]);
    if(document.fonts && document.fonts.ready) await document.fonts.ready;
    const doc = new PDF({ unit: 'pt', format: 'a4' }), W = doc.internal.pageSize.getWidth(), Hh = doc.internal.pageSize.getHeight();
    for(const [from, to, i] of [[4, 30, 0], [30, 45, 1]]){
      const box = document.createElement('div'); box.className = 'paper';
      box.style.cssText = 'position:fixed;left:-12000px;top:0;width:900px;background:#fff;padding:36px;box-sizing:border-box;border-radius:0;box-shadow:none;margin:0';
      box.innerHTML = docHtml('PRREP', R.rows, from, to); document.body.appendChild(box);
      try{ const t = box.querySelector('table.sd'); if(t){ t.style.zoom = ''; const tw = Math.max(+t.dataset.w || 0, t.scrollWidth); if(tw > 828) box.style.width = (tw + 72) + 'px'; }
        const cv = await H2C(box, { scale: 2, backgroundColor: '#ffffff', useCORS: true, logging: false }), h = W * cv.height / cv.width, k = h > Hh ? Hh / h : 1;
        if(i) doc.addPage(); doc.addImage(cv.toDataURL('image/jpeg', 0.92), 'JPEG', (W - W * k) / 2, 0, W * k, h * k); }
      finally{ box.remove(); } }
    const p = String(R.pick || '').split(' · '), name = 'COE_PR_' + String(p[1] || code).replace(/[\\\/:*?"<>|]/g, '').trim() + '_' + (p[2] || '').trim() + '_' + (p[0] || '') + '.pdf', blob = doc.output('blob');
    const b64 = await new Promise(res => { const fr = new FileReader(); fr.onload = () => res(String(fr.result).split(',')[1] || ''); fr.readAsDataURL(blob); });
    const noZh = (R.rows[20][1] && !R.rows[21][1]) || (R.rows[23][1] && !R.rows[24][1]);
    return { ok: true, b64, name, label: R.pick + ' · made in the app' + (noZh ? ' · Chinese being prepared (within the hour)' : '') }; }
  async function db(fn, a){
    const tok = a[0];
    if(fn === 'tTrialForm'){ const r = await post(F + 'coe-trform', { token: tok, op: 'trial', c: a[1] || {} }, 15000).catch(() => null);
      return r && (r.ok || r.msg) ? r : { ok: false, msg: 'Could not open the trial form. Check your internet.' }; }
    if(fn === 'tPcForm'){ const r = await post(F + 'coe-trform', { token: tok, op: 'pc', code: a[1] }, 15000).catch(() => null);
      return r && (r.ok || r.msg) ? r : { ok: false, msg: 'Could not open the progress check. Check your internet.' }; }
    if(fn === 'mgmtZh'){ const zh = await zhOf(a[1] || []); return { ok: true, zh, db: true }; }
    if(fn === 'mgmtTrialPdf') return { ok: false, app: true };
    if(fn === 'mgmtTrialPdfNow') return { ok: false, msg: 'The trial report is made in the app: open it and use Copy picture or Save PDF.' };
    if(fn === 'mgmtPcPdf') return pcPdf(a[1]);
    if(fn === 'mgmtTab' || fn === 'tDoc'){ const r = await prRows(tok, { label: a[2] || '' });   /* only PRREP comes here (see the wrapper) */
      if(r && r.ok) return { at: r.at, pick: r.pick, pick2: '', rows: r.rows, db: true }; throw { msg: (r && r.msg) || 'Could not open the progress report. Check your internet.' }; }
  }
  const wrap = base => { const w = function(fn){ const a = Array.prototype.slice.call(arguments, 1);
      if(NOG.test(fn) && (!/^(mgmtTab|tDoc)$/.test(fn) || a[1] === 'PRREP') && a[0] && typeof TOKEN !== 'undefined' && a[0] === TOKEN && !window.__trGoogle2065) return db(fn, a);
      return base.apply(this, arguments); };
    for(const k in base) try{ w[k] = base[k]; }catch(e){} w.__2065 = 1; return w; };
  if(typeof window.api === 'function') window.api = wrap(window.api);
  if(typeof window.apiNow === 'function') window.apiNow = apiNow = wrap(window.apiNow);
})();
