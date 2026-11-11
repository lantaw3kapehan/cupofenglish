/* 2079 (11 Nov, Misty: "MOVE THEM ALL AND SWITCH OFF"). Google's background jobs are off and its Sheets are a read-only archive.
   The package check (Enrolled · paid / Renewed · paid) now comes only from the database's copy (sys:pkglink, rebuilt every minute and
   right after each payment save): Google's check, which read the frozen sheets, no longer replaces it. */
(function(){
  if(window.__2079) return; window.__2079 = 1;
  const off = () => { if(typeof window.pkcVerify === 'function' && !window.pkcVerify.__2079){ const f = function(){ /* the database's answer stands */ }; f.__2079 = 1; window.pkcVerify = f; try{ pkcVerify = f; }catch(e){} } };
  off(); window.addEventListener('load', off); setTimeout(off, 3000);
})();
