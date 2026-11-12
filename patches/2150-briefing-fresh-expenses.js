// 2150 (12 Nov): (a) the Briefing and Forecast always read expenses fresh from the database (coe-expenses) instead of the Transactions
// screen's saved copy on this device (coe.exp), which could be old; the live refresh (2143) also drops that copy. This makes
// "Since you last looked" and "Costs" (2149) work, and keeps the forecast's expenses current.
// (b) "Near the end of their package › Reminded / Renewing" counts the same packages as "Renewals coming up" (5 or fewer lessons left),
// so the two cards agree.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
  ["function expData(){ try{ var k = JSON.parse(localStorage.getItem('coe.exp') || 'null'); if(k && k.rows) return k; }catch(e){} return ST.exp; }",
   "function expData(){ if(ST.exp && ST.exp.rows) return ST.exp; try{ var k = JSON.parse(localStorage.getItem('coe.exp') || 'null'); if(k && k.rows) return k; }catch(e){} return ST.exp; }"],
  ["    if(!expData() && typeof FAST_URL !== 'undefined') jobs.push(fetch(FAST_URL + '-expenses'",
   "    if(!(ST.exp && ST.exp.rows) && typeof FAST_URL !== 'undefined') jobs.push(fetch(FAST_URL + '-expenses'"],
  ["    var low = o.low || [], rn = G.renewing || {};",
   "    var low = o.low || [], rn = G.renewing || {}; try{ var PQ = G.more && G.more.pipe; if(PQ) rn = { reminded: (PQ.likely || {}).n || 0, renewing: (PQ.confirmed || {}).n || 0 }; }catch(e){}"],
]);
