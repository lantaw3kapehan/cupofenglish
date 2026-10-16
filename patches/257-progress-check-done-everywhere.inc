/* 16 Oct · 257 · A progress check sent from one device stopped showing as "Fill it in now" only on that device (the "done" mark
   was kept on the phone). Now the app asks the server (tPcForm, the same answer the form uses to show "✓ Sent") for every
   progress check in the list, and marks it done on every device of that teacher. (Julia: Ellery and Amy, sent 15 Oct.) */
(function(){
  const p0 = window.pcPrefetch; if(typeof p0 !== 'function') return;
  let RD = 0; const redraw = () => { clearTimeout(RD); RD = setTimeout(() => { try{ if(typeof render === 'function' && !document.querySelector('#sheet.on')) render(); }catch(e){} }, 300); };
  window.pcPrefetch = function(code){ const r0 = p0.apply(this, arguments);
    try{ const p = (typeof PCF !== 'undefined') && PCF[code]; if(p && !p._dn){ p._dn = 1; p.then(r => {
      if(r && r.ok && r.done && !(window.luSkipDone && luSkipDone(code, r.done)) && !(window.PCDONE && PCDONE[code])){
        window.PCDONE = window.PCDONE || {}; PCDONE[code] = 1; try{ store('set', 'coe.pcdone', JSON.stringify(PCDONE)); }catch(e){} redraw(); } }).catch(() => {}); } }catch(e){}
    return r0; };
})();
