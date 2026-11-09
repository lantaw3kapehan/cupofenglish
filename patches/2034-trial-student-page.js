// 2034 (9 Nov 21:17, Misty: "here is showing last, it should be Trial Class since she is for trial"): a student booked only for a
//   trial class reads as a trial everywhere on her page:
//   · the calendar day says "Trial" (not "last"); the hero says "Trial class · Wed 19:00 · Teacher · book" (not "Every week · 0.5 lesson
//     units a week"); the books line shows "Trial book · OD1" (not "No book on the classes yet").
//   · "Google Calendar" is no longer named on the Schedule card or in save messages (the app is the calendar since 8 Nov, 1903/1907).
const file = process.argv[2];
const isTr = "(c => !!c && /-TC\\b|trial/i.test(String(c.title || '')))";
require('../tools/lib.js')(file, [
 [
  "const nxs = nx ? new Date(nx.start).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) + ' ' + tm(nx.start) : '';\n    const html = S.length\n",
  "const nxs = nx ? new Date(nx.start).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) + ' ' + tm(nx.start) : '';\n" +
  "    const isTr2034 = " + isTr + ", L2034 = (Array.isArray(STU.cls) ? STU.cls : []).filter(c => c && !c.cancelled), tr2034 = L2034.length && L2034.every(isTr2034) ? (L2034.filter(c => +new Date(c.end) >= Date.now())[0] || L2034[L2034.length - 1]) : null;   /* 2034 */\n" +
  "    const html = tr2034 ? '<span class=\"lb\">Trial class</span><span class=\"sl\"><b>' + DS[(new Date(tr2034.start).getDay() + 6) % 7] + '</b>' + esc(tm(tr2034.start)) + '</span><span class=\"mt\">' + esc([tr2034.teacher ? 'Teacher ' + String(typeof tName === 'function' ? tName(tr2034.teacher) : tr2034.teacher).replace(/^Teacher\\s+/i, '') : '', tr2034.book || '', Math.round((new Date(tr2034.end) - new Date(tr2034.start)) / 6e4) + ' min'].filter(Boolean).join(' · ')) + '</span>' + (nxs ? '<span class=\"nx\">' + (+new Date(tr2034.start) > Date.now() ? 'Trial · ' : 'Next · ') + esc(nxs) + '</span>' : '')\n      : S.length\n"
 ],
 [
  "(STU.cls ? '<span class=\"lb\">Current books</span><span class=\"h\">No book on the classes yet · use Change book</span>' : '')",
  "(STU.cls ? ((() => { const tb = (STU.cls || []).filter(c => c && !c.cancelled && c.book && " + isTr + "(c)).map(c => c.book).pop(); return tb ? '<span class=\"lb\">Trial book</span><span class=\"h\" style=\"color:inherit\">📚 ' + esc(tb) + '</span>' : '<span class=\"lb\">Current books</span><span class=\"h\">No book on the classes yet · use Change book</span>'; })()) : '')   /* 2034 */"
 ],
 [
  "(E.some(e => LL.indexOf(e) === ix.last) ? ' lsd' : '')",
  "(E.some(e => !e.cancelled && " + isTr + "(e)) ? ' trd' : E.some(e => LL.indexOf(e) === ix.last) ? ' lsd' : '')"
 ],
 [
  ".cal28 .d.lsd:after{content:'last';font-size:9px;color:#8D6421;font-weight:700;text-align:center;margin-top:auto}",
  ".cal28 .d.lsd:after{content:'last';font-size:9px;color:#8D6421;font-weight:700;text-align:center;margin-top:auto}.cal28 .d.trd:after{content:'Trial';font-size:9px;color:#00636B;font-weight:700;text-align:center;margin-top:auto}"
 ],
 ["<h2>Schedule <span class=\"c\">Google Calendar</span></h2><div class=\"", "<h2>Schedule</h2><div class=\""],
 ["<h2>Schedule <span class=\"c\">Google Calendar</span>${D.mgr?", "<h2>Schedule${D.mgr?"],
 ["'✓ <b>Saved in Google Calendar</b> · ' + esc(s.name || s.code)", "'✓ <b>Saved</b> · ' + esc(s.name || s.code)"],
 ["'✓ <b>Saved in Google Calendar</b>' + (r.note ? ' · ' + esc(r.note) : ''), 'ok'); try{ ding('msg'); }catch(y){}", "'✓ <b>Saved</b>' + (r.note ? ' · ' + esc(r.note) : ''), 'ok'); try{ ding('msg'); }catch(y){}"],
 ["'✓ <b>Saved in Google Calendar</b> · ') + pk0", "'✓ <b>Saved</b> · ') + pk0"],
 ["'<h1>Not saved in Google Calendar</h1>", "'<h1>Not saved</h1>"],
 ["'<h1>Book not changed in Google Calendar</h1>", "'<h1>Book not changed</h1>"],
 ["'<h1>Not added in Google Calendar</h1>", "'<h1>Not added</h1>"]
]);
