// 2322: book covers from our own copies of the PDFs (coe-books coverFiles → page 1 drawn with PDF.js → coe-notice book_cover_put).
// Used first by "Take covers again from COURSEWARE", and automatically when management opens a book that has no cover yet. Google stays the fallback.
const file = process.argv[2];
const inc = `<script>
/* 17 Nov · 2322 · Book covers from our own copies of the PDFs (no Google). Management only. */
(function(){
  const SB = 'https://rlxkiahqjsabopmuhern.supabase.co', PUB = SB + '/storage/v1/object/public/book-media/', PDFJS = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/';
  let ready = null;
  const lib = () => ready || (ready = new Promise((ok, no) => { if(window.pdfjsLib) return ok(window.pdfjsLib);
    const s = document.createElement('script'); s.src = PDFJS + 'pdf.min.js'; s.onload = async () => { try{ const w = await fetch(PDFJS + 'pdf.worker.min.js').then(r => r.text());
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = URL.createObjectURL(new Blob([w], { type: 'text/javascript' })); ok(window.pdfjsLib); }catch(e){ ready = null; no(e); } };
    s.onerror = () => { ready = null; no(new Error('PDF reader did not load')); }; document.head.appendChild(s); }));
  const post = (fn, o) => fetch(SB + '/functions/v1/' + fn, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(Object.assign({ token: TOKEN }, o)) }).then(r => r.json());
  async function page1(url){ const L = await lib();
    const doc = await L.getDocument({ url, rangeChunkSize: 1048576, disableAutoFetch: true, disableStream: true, isEvalSupported: false }).promise;
    const pg = await doc.getPage(1), v1 = pg.getViewport({ scale: 1 }), vp = pg.getViewport({ scale: Math.min(3, 1400 / v1.width) });
    const cv = document.createElement('canvas'); cv.width = Math.round(vp.width); cv.height = Math.round(vp.height); const c = cv.getContext('2d'); c.fillStyle = '#fff'; c.fillRect(0, 0, cv.width, cv.height);
    await pg.render({ canvasContext: c, viewport: vp }).promise; try{ doc.destroy(); }catch(e){}
    const blob = await new Promise(z => cv.toBlob(z, 'image/jpeg', 0.88));
    return await new Promise((ok, no) => { const rd = new FileReader(); rd.onload = () => ok(String(rd.result).split(',')[1]); rd.onerror = no; rd.readAsDataURL(blob); }); }
  /* code: book key (e.g. "od3"); only: ['sb','wb'] or a subset → { done: ['sb',…], bad: [...] } */
  window.bbFromCopies = async (code, only) => { const j = await post('coe-books', { op: 'coverFiles', code }); if(!j || !j.ok) throw new Error((j && j.error) || 'No copies');
    const done = [], bad = [];
    for(const side of (only || ['sb', 'wb'])){ const f = j[side]; if(!f || !f.obj) continue;
      try{ const b64 = await page1(PUB + encodeURIComponent(f.obj)); const r = await post('coe-notice', { action: 'book_cover_put', code, side, type: 'image/jpeg', b64 }); if(!r || !r.ok) throw new Error((r && r.error) || 'Not saved'); done.push(side); }
      catch(e){ bad.push(side + ': ' + (e.message || e)); } }
    return { done, bad }; };
})();
</script>
`;
require('../tools/lib.js')(file, [
['<script id="b2278">', inc + '<script id="b2278">'],
["window.bbRetake = async () => { toast('Taking the covers again…'); try{ const r = await api('mgmtBookCovers', TOKEN, [CUR.code], true);",
 "window.bbRetake = async () => { toast('Taking the covers again…'); try{ let c0 = null; if(window.bbFromCopies){ try{ c0 = await bbFromCopies(CUR.code); }catch(e){ console.warn('2322', e); } }   /* 2322: our copies first */\n    if(c0 && c0.done.length === 2){ await load(true); toast('Covers updated ✓'); sheet(); return; }\n    const r = await api('mgmtBookCovers', TOKEN, [CUR.code], true);"],
["    if((rowOf(CUR.code) || {}).sb_cover) return bbPic();   /* 663: straight to the picture */\n    sheet();",
 "    if((rowOf(CUR.code) || {}).sb_cover) return bbPic();   /* 663: straight to the picture */\n    sheet();\n    if(mgr() && rowOf(CUR.code) && window.bbFromCopies){ const c1 = CUR.code; toast('Drawing the cover from our copy of the book…'); bbFromCopies(c1).then(async x => { if(!x.done.length) return; await load(true); if(CUR && CUR.code === c1){ if((rowOf(c1) || {}).sb_cover) bbPic(); else sheet(); } }).catch(e => console.warn('2322', e)); }   /* 2322 */"]
]);
