// 1595: (Misty's live telemetry 11:50:59, v1464: "stuRn+stuStat|65" at 1.8 s on a first open) the Status card grew when the notes
// history arrived (loading bar → up to 3 note cards with full text), pushing Changes · step by step and Schedule down.
// Now the Status card shows the latest note on two fixed lines (status · date · by · "N older", then the note on one line, full text on
// hover); the loading bars and "No notes yet." take the same two lines. The full history stays in Update · add a note (unchanged).
// Telemetry (1593): each shift row now also says how far the first moved element went (dy, dh in px), within the same 30 characters.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  ["  function paintBox(){ const el = $('stuStat'); if(!el || !STU) return;",
   "  const last1595 = L => !L ? '<div class=\"sk\"></div><div class=\"sk\" style=\"width:60%\"></div>' : !L.length ? '<div class=\"small mute\">No notes yet.</div>' :\n    (x => '<div class=\"r\"><b>' + esc(x.status || 'Note') + '</b><span class=\"mute\"> · ' + when(x.at) + (x.by ? ' · ' + esc(x.by) : '') + (L.length > 1 ? ' · ' + (L.length - 1) + ' older' : '') + '</span></div>' + (x.note ? '<div class=\"t\" title=\"' + esc(x.note) + '\">' + esc(String(x.note).replace(/\\s+/g, ' ')) + '</div>' : ''))(L[0]);\n  function paintBox(){ const el = $('stuStat'); if(!el || !STU) return;"],
  ["      '<div style=\"margin-top:8px\">' + logHtml(LOG[lk(code, key)], 3) + '</div>'; }",
   "      '<div class=\"stn1595\">' + last1595(LOG[lk(code, key)]) + '</div>'; }   /* 1595: two fixed lines, final height from the first paint */"],
  ["run.sh.push([Math.round(t), e.value, S.slice(0, 2).map(x => lab(x.node)).join('+')]);",
   "const r0 = S[0].previousRect, r1 = S[0].currentRect; run.sh.push([Math.round(t), e.value, lab(S[0].node).slice(0, 14) + ' ' + Math.round(r1.y - r0.y) + ',' + Math.round(r1.height - r0.height) + (S.length > 1 ? '+' + (S.length - 1) : '')]);"],
  ["</body>\n</html>",
   "<style id=\"css1595\">#stuStat .stn1595{margin-top:8px;height:44px;overflow:hidden;font-size:13px;line-height:22px}#stuStat .stn1595 .r,#stuStat .stn1595 .t{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}#stuStat .stn1595 .t{color:var(--coe-text,#3A3556)}#stuStat .stn1595 .sk{height:14px!important;margin:4px 0!important}#stuStat .stn1595 .small{line-height:22px}</style>\n</body>\n</html>"]
]);
