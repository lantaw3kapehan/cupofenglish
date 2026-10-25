// 1004: (Misty, 25 Oct 20:48) "Celine is saying in her Management Access she cannot see her My Pay".
// Cause: 817 (Finance redesign) took "My pay" out of the management menu for everyone, because the President is not on
// payroll. Celine (Operations) is, so she lost her only way to her pay. Now "My pay" is removed only for the President;
// other management accounts with pay records see it again under Finance (and on the phone's More page).
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  ["if(typeof D !== 'undefined' && D && D.mgr){ const k = NAV_M.findIndex(x => x[0] === 'mypay'); if(k > -1) NAV_M.splice(k, 1); }",
   "if(typeof D !== 'undefined' && D && D.mgr && D.pres){ const k = NAV_M.findIndex(x => x[0] === 'mypay'); if(k > -1) NAV_M.splice(k, 1); }"],
  ["if(typeof D !== 'undefined' && D && D.mgr){ buildNav(); if(VIEW === 'mypay') go('expenses'); }",
   "if(typeof D !== 'undefined' && D && D.mgr){ buildNav(); if(VIEW === 'mypay' && D.pres) go('expenses'); if(!D.pres && typeof loadMyPay === 'function') loadMyPay(true); }"]
]);
