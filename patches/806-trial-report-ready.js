// 806: (Misty) Trials › a student: "I still feel like opening here is too slow"
// · The report the app makes (2 pages, drawn sharp) took a few seconds every time a trial was opened.
// · Now each report is made ONCE and kept on this device; opening the trial again shows it at once.
//   It is made again only when something on it changes (learner type, level, the teacher's lines, the Chinese).
// · The reports still to send are made ahead in the background when the trial list loads, so even the first open is instant.
// · The old background download of Google's PDFs (799) is switched off: the card uses the app's report now (804).
const lib = require('../tools/lib.js'), fs = require('fs'), file = process.argv[2];
lib(file, [["async function ahead(){ if(RUN ||", "async function ahead(){ return; if(RUN ||"]]);
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 806 · trial reports made once, kept, and made ahead */
(function(){
  if(window.__806 || typeof window.tlInstant !== 'function' || typeof window.coeTrialPages !== 'function') return; window.__806 = 1;
  let DBP = null;
  const idb = () => DBP || (DBP = new Promise((ok, no) => { try{ const q = indexedDB.open('coe-pdf', 1); q.onupgradeneeded = () => q.result.createObjectStore('p'); q.onsuccess = () => ok(q.result); q.onerror = () => no(q.error); }catch(e){ no(e); } }));
  const get = k => idb().then(d => new Promise(ok => { try{ const q = d.transaction('p').objectStore('p').get(k); q.onsuccess = () => ok(q.result || null); q.onerror = () => ok(null); }catch(e){ ok(null); } })).catch(() => null);
  const put = (k, v) => idb().then(d => new Promise(ok => { try{ const t = d.transaction('p', 'readwrite'); t.objectStore('p').put(v, k); t.oncomplete = () => ok(1); t.onerror = () => ok(0); }catch(e){ ok(0); } })).catch(() => 0);
  const grp = t => { try{ const o = JSON.parse(localStorage.getItem('coe.trgrp.' + t.label) || 'null'); if(o && Date.now() - o.at < 6 * 3600e3) return o.g; }catch(e){} return t._g || t.group || ''; };
  const sig = (t, extra) => 'app:' + (t.label || t.date + '|' + t.student) + '|' + grp(t) + '|' + (t.cefr || '') + '|' + (t.commZh ? 1 : 0) + '|' + (extra || '') + '|v3';
  const show = (t, f) => { if(TLD !== t) return; TLB = f; TLB._app = 1; const el = $('tlPdf'); if(el) el.innerHTML = '<iframe class="rp-pdf" src="' + URL.createObjectURL(TLB) + '#view=FitH"></iframe><div class="small mute" style="margin-top:4px">Made in the app · the same report the sheet makes</div>'; try{ tlBtns(); }catch(e){} };
  const N = {};   /* teacher → their sent reports with lines per skill */
  async function notesOf(t){ const tk = String(t.teacher || '').toLowerCase(); if(!N[tk] || Date.now() - N[tk].at > 5 * 6e4){
      try{ const r = await fetch(FAST_URL + '-trials', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, as: t.teacher || '' }) }).then(x => x.json()); N[tk] = { at: Date.now(), list: (r && r.list) || [] }; }catch(e){ N[tk] = { at: Date.now(), list: [] }; } }
    const sl = String(t.student || '').trim().toLowerCase(), c = String(t.code || '').trim().toUpperCase();
    const hit = N[tk].list.find(x => x.d === t.date && Array.isArray(x.n) && (x.s === sl || (c && x.c === c))); return hit ? hit.n : null; }
  // Opening a trial: a report already made for exactly this content shows at once.
  const _ti = window.tlInstant;
  window.tlInstant = async function(btn){ const t = (typeof TLD !== 'undefined') ? TLD : null; if(!t) return _ti.apply(this, arguments);
    const n = await notesOf(t); const k = sig(t, n ? n.join('').length : ''); const c = await get(k);
    if(c && c.blob && TLD === t){ show(t, new File([c.blob], c.name || 'report.pdf', { type: 'application/pdf' })); return; }
    const r = await _ti.apply(this, arguments);
    try{ if(TLD === t && TLB && TLB._app) put(k, { blob: TLB, name: TLB.name, at: Date.now() }); }catch(e){}
    return r; };
  // Ahead: the reports still to send, made quietly one at a time.
  let RUN = 0;
  async function make(t){ const n = await notesOf(t); const k = sig(t, n ? n.join('').length : ''); if(await get(k)) return;
    const r = await fetch(FAST_URL + '-mgmt', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'trialData', token: TOKEN, date: t.date, student: t.student, tables: true }) }).then(x => x.json());
    if(!r || !r.ok) return; const d = r.tr && r.tr.data;
    if(d && d[25] && !d[27]){ try{ const z = await api('mgmtZh', TOKEN, [d[25], d[26] || ''], [t.student, t.cn || '']); if(z && z.ok && z.zh){ d[27] = z.zh[0] || ''; d[28] = z.zh[1] || ''; } }catch(e){} }
    const tt = Object.assign({}, t, { group: grp(t), _g: grp(t) });
    if(n){ tt._notes = n; try{ const z = await api('mgmtZh', TOKEN, n, [t.student, t.cn || '']); if(z && z.ok && Array.isArray(z.zh)) tt._notesZh = z.zh; }catch(e){} }
    const html = coeTrialPages(tt, r); if(!html) return;
    const [H2, PDF] = await Promise.all([h2c(), coeJsPdf()]);
    const host = document.createElement('div'); host.style.cssText = 'position:fixed;left:-10000px;top:0;width:794px;z-index:-1'; host.innerHTML = html; document.body.appendChild(host);
    try{ if(document.fonts && document.fonts.ready) await document.fonts.ready;
      const doc = new PDF({ unit: 'pt', format: 'a4' }), W = doc.internal.pageSize.getWidth(), Hh = doc.internal.pageSize.getHeight(), P = [...host.querySelectorAll('.tr-page')];
      for(let j = 0; j < P.length; j++){ const cv = await H2(P[j], { scale: 3, backgroundColor: '#ffffff', useCORS: true, logging: false }); if(j) doc.addPage(); const h = W * cv.height / cv.width, kk = h > Hh ? Hh / h : 1; doc.addImage(cv.toDataURL('image/jpeg', 0.92), 'JPEG', (W - W * kk) / 2, 0, W * kk, h * kk);
        await new Promise(z => setTimeout(z, 60)); }
      const name = 'COE_TCR_' + String(t.student).replace(/[\\\/:*?"<>|]/g, '') + '_' + (t.teacher || '') + '_' + t.date + '.pdf';
      await put(k, { blob: doc.output('blob'), name, at: Date.now() }); }
    finally{ host.remove(); } }
  async function ahead(){ if(RUN || typeof D === 'undefined' || !D || !D.mgr || !TOKEN || document.hidden) return; RUN = 1;
    try{ const L = ((typeof TRL !== 'undefined' && TRL && TRL.rows) || []).filter(x => x && x.label && x.status !== 'Sent' && x.total !== '' && x.total != null).slice(0, 6);
      for(const t of L){ if(document.hidden) break; if(typeof TLD !== 'undefined' && TLD === t) continue; try{ await make(t); }catch(e){} await new Promise(z => setTimeout(z, 1500)); } }
    finally{ RUN = 0; } }
  window.trAhead = ahead;
  const _lt = window.loadTrials; if(typeof _lt === 'function') window.loadTrials = async function(){ const r = await _lt.apply(this, arguments); setTimeout(ahead, 2500); return r; };
  setTimeout(ahead, 8000); setInterval(ahead, 4 * 6e4);
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
