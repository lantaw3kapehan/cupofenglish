// 1689: (Misty, 1 Nov 11:22, Parent reports) "Chinese not reviewed is too slow · teachers sent feedback on 29 Oct but it's not
//   reviewed yet" + "why is Irene with Pam, yet she never had lessons with Pam?"
//   · The reviewed Chinese was there (the 3-hourly review had written all of them, e.g. Angela, Sunny, Irene, Grace), but the
//     list compared it with the feedback time from the sheet, which has the date only and reads as 12:00 noon. A review made at
//     11:09 on the same day looked older than the feedback → "Chinese not reviewed yet". Now a feedback time of exactly 12:00 is
//     treated as the date only (any review that day counts), and when a report is opened the exact time the teacher sent it
//     (from the app's own record) is used.
//   · The report's teacher comes from the sheet, which takes the student's first active package (Irene ST-2025-111 still has an
//     active package row with Pam besides Ara's). When a report is opened, the teacher who actually sent the feedback in the app
//     (Ara) is shown and used on the parent picture; the window says "sent by Teacher Ara · package also lists Teacher Pam".
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["      if(at && lat && at < lat - 60000) return false; }catch(e){} return true; };",
   "      try{ if(lat && !LAT[k] && new Date(lat + 8 * 36e5).toISOString().slice(11, 19) === '12:00:00') lat = lat - 12 * 36e5; }catch(e2){}   /* 1689: a date-only feedback time (noon) = the whole day */\n" +
   "      if(at && lat && at < lat - 60000) return false; }catch(e){} return true; };\n" +
   "  /* 1689 · the exact time and the teacher of the feedback sent in the app */\n" +
   "  var _fa1689 = window.fbcnApply;\n" +
   "  if(typeof _fa1689 === 'function') window.fbcnApply = async function(R){ try{ if(R && R.report && R.report.code && R.report.month){ var x = R.report, r = await fbGet(x.code);\n" +
   "      var mk = String(x.month), y = +mk.slice(0, 4), m = +mk.slice(5, 7), st = Date.parse(new Date(Date.UTC(y, m - 2, 25)).toISOString().slice(0, 10) + 'T00:00:00+08:00'), en = Date.parse(new Date(Date.UTC(y, m - 1, 25)).toISOString().slice(0, 10) + 'T00:00:00+08:00');\n" +
   "      var S = (r && r.ok && r.sub || []).filter(function(s){ var t = Date.parse(s.at); return t >= st && t < en; }).sort(function(a, b){ return Date.parse(b.at) - Date.parse(a.at); });\n" +
   "      if(S.length){ LAT[x.code + '|' + x.month] = Date.parse(S[0].at); var who = String(S[0].who || '').trim();\n" +
   "        if(who && String(x.teacher || '').trim().toLowerCase() !== who.toLowerCase()){ x.teacherWas1689 = x.teacher; x.teacher = who; } } } }catch(e){}\n" +
   "    return _fa1689.apply(this, arguments); };"],
  ["try{ if(window.fbcnApply) await fbcnApply(RPD); }catch(x){}\nrpPaint();",
   "try{ if(window.fbcnApply) await fbcnApply(RPD); }catch(x){}\nrpPaint(); try{ if(RPD && RPD.report && RPD.report.teacherWas1689){ const h = document.querySelector('#sheetBody .mute.small, #sheetBody .small.mute'); if(h && !h.querySelector('.tw1689')) h.insertAdjacentHTML('beforeend', '<span class=\"tw1689\" style=\"color:#8A5300\"> · sent by Teacher ' + esc(RPD.report.teacher) + ' · package also lists Teacher ' + esc(RPD.report.teacherWas1689) + '</span>'); } }catch(e){}"]
]);
