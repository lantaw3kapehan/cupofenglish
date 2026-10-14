// 14 Oct · Lesson summary / shared summary always end on the latest ACTIVE numbers (Misty, Ellery: an edit in the sheet did
// not show). It opens at once from what the phone has, then checks ACTIVE in the background and redraws if anything changed.
// Works with the server change that clears the app's saved copy of a tab the moment someone edits it (onSheetEdit_).
require('../tools/lib.js')(process.argv[2], [
["async function shSummary(code, force){ $('sheet').classList.add('wide');",
 "async function shSummary(code, force, bg){ $('sheet').classList.add('wide');"],
["try{ if(force || !AT || !AT.cols) await loadActive(true); }catch(e){}\nconst sh = !!shGroup(code)",
 "const had0 = !!(AT && AT.cols); try{ if(force || !had0) await loadActive(true); }catch(e){}\n" +
 "if(had0 && !force && !bg){ const sig = JSON.stringify(AT && AT.rows); loadActive(true).then(() => { if(JSON.stringify(AT && AT.rows) !== sig && DOCV && DOCV.key === 'SHPKG' && DOCV.pick === code && $('sheet').classList.contains('on')){ shSummary(code, false, 1); toast('Updated to the latest numbers'); } }).catch(() => {}); }   /* 14 Oct: always ends on the latest ACTIVE */\n" +
 "const sh = !!shGroup(code)"],
]);
