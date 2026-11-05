// 1788: (App health report 5 Nov: management taps that still waited on Google) Their reads now come from the database first:
//   · Parent report sheet (mgmtReport, 36 taps · 6.6 s): edge coe-taps "report" — the REPORT FILES row (coe_report_files, as the Reports
//     list) + the month's feedback (docs sys:fb, checked against the FB:FEEDBACK DATA copy). 17 of 19 keys identical to Google live; the
//     other 2 had been sent after the row was last copied, so a Sent/Returned save newer than the row now goes to Google.
//   · App health box (mgmtHealth): Google's own last answer read straight from the database; Google is asked behind at most every 30 min (as before).
//   · Teacher card (mgmtTeacherCard, 22.9 s): the database card at once (no wait for the stored Google copy first); a slow database shows
//     the card this page already has; Google only if the database fails and there is no card.
//   · Pulse (mgmtPulse, 3.0 s): the database answer no longer waits for Google's 5-minute check; Google's extra items join the next pulse.
//   · Students list (mgmtStudents): when no database copy came back, the database works the list out (coe "students") before Google.
//   Readable source: patches/src/1788-slow-taps.client.js · edge function coe-taps (SQL coe_taps_report, coe_taps_health).
const lib = require("../tools/lib.js"), fs = require("fs"), path = require("path"), file = process.argv[2];
const CODE = fs.readFileSync(path.join(__dirname, "src/1788-slow-taps.client.js"), "utf8");
lib(file, [
  // pulse (791): Google's check runs behind; what it finds is added to the next answer (each item once)
  ["const gp = wantG ? Promise.resolve(base.apply(self, args)).catch(() => null) : Promise.resolve(null);",
   "if(wantG) Promise.resolve(base.apply(self, args)).then(g => { try{ if(g && Array.isArray(g.items)) g.items.forEach(x => { const k = x.t + '|' + x.fn + '|' + x.who; if(x.fn && DBF.test(x.fn) || GS1788[k]) return; GS1788[k] = 1; GQ1788.push(x); }); if(Object.keys(GS1788).length > 600) GS1788 = {}; }catch(e){} }, () => {});   /* 1788 */"],
  ["const g = wantG ? await gp : null; let items = r.items || [];\n        if(g && Array.isArray(g.items)) items = items.concat(g.items.filter(x => !(x.fn && DBF.test(x.fn))));",
   "let items = r.items || [];\n        if(GQ1788.length) items = items.concat(GQ1788.splice(0, GQ1788.length));   /* 1788: Google's items from the last check */"],
  ["  let gAt = 0;\n  const base = window.api;\n  const w = function(fn){ if(fn !== 'mgmtPulse') return base.apply(this, arguments);",
   "  let gAt = 0, GQ1788 = [], GS1788 = {};\n  const base = window.api;\n  const w = function(fn){ if(fn !== 'mgmtPulse') return base.apply(this, arguments);"],
  ["</body>\n</html>", CODE + "</body>\n</html>"],
]);
