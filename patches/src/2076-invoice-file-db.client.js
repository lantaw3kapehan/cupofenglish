/* 2076 (11 Nov, Misty: "CONTINUE THE PLAN TO MOVE OFF GOOGLE"). "Add sale" with an invoice file goes to the database like a sale without
   one; the invoice is kept in the app's storage (coe-proof), not Google Drive. Signed agreements already go to the database queue (coe-wq),
   which now keeps the file for the database too. If the database cannot be reached, fastWrite falls back to Google once, as before. */
(function(){
  if(window.__2076) return; window.__2076 = 1;
  const base = window.api; if(typeof base !== 'function') return;
  const w = function(fn){ const a = Array.prototype.slice.call(arguments, 1);
    if(fn === 'addSale' && a[1] && a[1].file && a[1].file.b64 && String(a[1].file.b64).length <= 12e6 && !window.__filesGoogle2076
       && typeof TOKEN !== 'undefined' && TOKEN && a[0] === TOKEN && typeof fastWrite === 'function') return fastWrite('addSale', a);
    return base.apply(this, arguments); };
  for(const k in base) try{ w[k] = base[k]; }catch(e){} w.__2076 = 1; window.api = w;
})();
