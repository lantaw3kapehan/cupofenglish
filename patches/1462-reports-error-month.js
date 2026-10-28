// 1462 · President QA 28 Oct: Students › Parent reports, when a month fails to load (e.g. tap "September 2027"), the error said
//   "Could not load the parent reports for October 2027" and offered "Back to November 2027" — one month off. The tabs name the month
//   of the classes (1090: report key 2027-10 = September 2027 classes), but the 921 error panel turned the key into a month itself.
//   Now the error panel uses the same label as the tabs (fbClsLab) + "classes". Display only.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["const ml = m => { const k = String(m || '').match(/^(\\d{4})-(\\d{2})/); return k ? new Date(+k[1], +k[2] - 1, 15).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }) : 'this month'; };",
   "const ml = m => { if(typeof window.fbClsLab === 'function' && /^\\d{4}-\\d{2}/.test(String(m || ''))) return fbClsLab(m) + ' classes';   /* 1462: same month as the tabs */\n    const k = String(m || '').match(/^(\\d{4})-(\\d{2})/); return k ? new Date(+k[1], +k[2] - 1, 15).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }) : 'this month'; };"],
]);
