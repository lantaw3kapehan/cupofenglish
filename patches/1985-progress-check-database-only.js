// 1985: (Misty 9 Nov "OK") The progress-check form no longer asks Google (about 30 s each, prefetched in the background).
//   The database answer (coe-pcf, since 1230: trial, already sent, class notes, monthly feedback, questions) is used for the prefetch and
//   the form. Google is asked only if the database cannot answer at all.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["PCF[code] = api('tPcForm', TOKEN, code).then(r => {", "PCF[code] = pcDb1230(code).then(r => {   /* 1985: from the database */"],
  ["const gq1230 = PCF[code] || api('tPcForm', TOKEN, code); delete PCF[code];", "const gq1230 = PCF[code] || null; delete PCF[code];   /* 1985 */"],
  ["let fresh = null; try{ fresh = await gq1230; }catch(e){}\nif(fresh && fresh.ok && db1230",
   "let fresh = null; try{ fresh = await gq1230; if(!(fresh && fresh.ok) && !db1230) fresh = await api('tPcForm', TOKEN, code); }catch(e){}   /* 1985: Google only when the database could not answer */\nif(fresh && fresh.ok && db1230"],
]);
