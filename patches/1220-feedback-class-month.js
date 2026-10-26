// 1220 · 26 Oct (Misty 21:00, audit retest: Luna "November" vs "October"). Monthly feedback is filed under the month it is DUE
// (key 2026-11 = October classes, due 9 Nov). Several screens still printed that key month, so Luna's current feedback read
// "November 2026" on the form while other screens said "October classes". Display only: every feedback label now names the month
// of the classes (fbClsKey: key − 1 month). Keys, saves, drafts and records are unchanged.
require('../tools/lib.js')(process.argv[2], [
["const monthName = m => { const k = String(m||'').match(/^(\\d{4})-(\\d{2})/);",
 "const monthName = m => { const k = String((window.fbClsKey ? fbClsKey(m) : m)||'').match(/^(\\d{4})-(\\d{2})/);   /* 1220: feedback key → month of the classes */"],
["<span>${esc(String(f.month).slice(5,7))}</span>", "<span>${esc(String(window.fbClsKey ? fbClsKey(f.month) : f.month).slice(5,7))}</span>"],
["function fbLbl(){", "function fbFL(F){ try{ const k = F && (F.monthKey || F.month); if(window.fbClsLab && /^\\d{4}-\\d{2}/.test(String(k || ''))) return fbClsLab(k) + ' classes'; }catch(e){} return (F && F.month) || ''; }   /* 1220 */\nfunction fbLbl(){"],
["${esc(FBF.month)} · due ${esc(FBF.due)}", "${esc(fbFL(FBF))} · due ${esc(FBF.due)}"],
["Already sent for ${esc(FBF.month)}", "Already sent for ${esc(fbFL(FBF))}"],
["'<b>Already sent for ' + esc(FBF.month) + '</b>'", "'<b>Already sent for ' + esc(fbFL(FBF)) + '</b>'"],
["${esc(FB ? String(FB.label).split(' ')[0] : 'monthly')} feedback", "${esc(FB ? String(fbLbl() || FB.label).split(' ')[0] : 'monthly')} feedback"],
["from ${esc(f.month)} feedback", "from ${esc(monthName(f.month))} feedback"],
["' · ' + esc(FB.label || '') + '</div><div class=\"fbfix\"", "' · ' + esc(fbLbl() || FB.label || '') + '</div><div class=\"fbfix\""],
["\"small\"><b>' + esc(f.month) + '</b>", "\"small\"><b>' + esc(monthName(f.month)) + '</b>"],
["const monName = m => { const x = new Date(String(m).slice(0, 7) + '-01T12:00:00');", "const monName = m => { const x = new Date(String(window.fbClsKey ? fbClsKey(m) : m).slice(0, 7) + '-01T12:00:00');   /* 1220 */"],
["const mon = m => { const x = new Date(String(m).slice(0, 7) + '-01T12:00:00');", "const mon = m => { const x = new Date(String(window.fbClsKey ? fbClsKey(m) : m).slice(0, 7) + '-01T12:00:00');   /* 1220 */"],
["s: RP.label + ' feedback PDFs ready'", "s: (window.fbClsLab && (RP.month || RP.current) ? fbClsLab(RP.month || RP.current) + ' classes' : RP.label) + ' · feedback PDFs ready'"]
]);
