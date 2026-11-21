// 2566 (Misty 10:59 "are these accurate?"): two city names belong to two provinces. Suzhou (苏州 Jiangsu / 宿州 Anhui) and
// Fuzhou (福州 Fujian / 抚州 Jiangxi): the common one is filled and a line under the boxes says to check the Chinese name.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["  const v = addrJoin2565({ city: C.value, prov: Pv.value, country: N.value }), s = g('ivAS'); if(s) s.textContent = v || '—'; ivSet('bill_addr', v); };",
   "  const v = addrJoin2565({ city: C.value, prov: Pv.value, country: N.value }), s = g('ivAS'); if(s) s.textContent = v || '—';\n  { const k = String(C.value || '').trim().replace(/\\s+City$/i, '').toLowerCase(), T = { suzhou: 'Suzhou: 苏州 is Jiangsu Province · 宿州 is Anhui Province · check the parent\\'s address', fuzhou: 'Fuzhou: 福州 is Fujian Province · 抚州 is Jiangxi Province · check the parent\\'s address' }[k];   /* 2566 */\n    let h = g('ivAH'); if(T){ if(!h){ h = document.createElement('div'); h.id = 'ivAH'; h.className = 'small'; h.style.cssText = 'margin-top:4px;color:#8A4B00;font-weight:600'; (s && s.parentNode ? s.parentNode : C.parentNode).after(h); } h.textContent = T; } else if(h) h.remove(); }\n  ivSet('bill_addr', v); };"],
]);
