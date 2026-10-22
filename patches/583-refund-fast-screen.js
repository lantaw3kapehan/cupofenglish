// 22 Oct · Misty: "It takes time to finish it" (Record refund sat on "Recording…" ~30 s while Google updated SALES/ACTIVE).
// Now: as soon as the number R-n is saved (1–2 s) the result screen opens with the message, Copy and the picture;
// the sheet step runs behind with a live line "Updating SALES and ACTIVE in Google… (about 30 s)" that turns into ✓ when done.
require('../tools/lib.js')(process.argv[2], [
["        (R.sheetOk ? '<div class=\"ok\">✓ '",
 "        (R.sheetBusy ? '<div class=\"warn\" style=\"background:#F1FAF9;color:#00626A\">Refund R-' + d.no + ' is saved. Updating SALES and ACTIVE in Google… (about 30 seconds · you can copy the message now)</div>' : R.sheetOk ? '<div class=\"ok\">✓ '"],
["      R.done = j.refund; await rfSheet(true);",
 "      R.done = j.refund; R.sheetBusy = true; paint(); await rfSheet(true);"],
["    try{ delete STUC[R.code]; }catch(x){}\n    paint(); };",
 "    try{ delete STUC[R.code]; }catch(x){}\n    R.sheetBusy = false; const keep = ($('rfMsg') || {}).value; if(keep) R.msg = keep; if($('sheetBody') && $('sheetBody').querySelector('.rf')) paint(); toast(R.sheetOk ? 'Refund R-' + d.no + ' · sheet updated' : 'Refund R-' + d.no + ' saved · sheet not updated'); };"],
]);
