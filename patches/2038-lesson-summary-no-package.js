// 2038 (9 Nov 21:47, Misty: "for Sunny the trial booked, I clicked her lesson summary, though it's empty, but why is Virgo showing"):
//   a student with no package yet (a trial student, made in the app) is not in the packages list, so the Lesson summary fell back to
//   Google's old IND-PKG sheet, which still held the last student's teacher (Virgo) and no name. Management now gets a clear note
//   instead: no package yet, the summary starts once the student is enrolled; the trial class is shown. Google's sheet is no longer used here.
const file = process.argv[2];
require('../tools/lib.js')(file, [
 [
  "tabSheet = function(key, title, pick, pick2){ try{ if(key === 'INDPKG' && D && D.mgr && pick && (shGroup(pick) || lsRows(pick))) return shSummary(pick); }catch(e){} return _tsSh.apply(this, arguments); };",
  "tabSheet = function(key, title, pick, pick2){ try{ if(key === 'INDPKG' && D && D.mgr && pick && (shGroup(pick) || lsRows(pick))) return shSummary(pick); }catch(e){}\n" +
  "  if(key === 'INDPKG' && D && D.mgr && pick){   /* 2038: no package yet → a clear note, never Google's old sheet */\n" +
  "    if(!(AT && AT.cols)){ if(tabSheet._w2038 !== pick){ tabSheet._w2038 = pick; openSheet('<h1>Lesson summary</h1><div class=\"paper\"><div class=\"sk\"></div><div class=\"sk\" style=\"width:60%\"></div></div>'); loadActive(true).then(() => { tabSheet(key, title, pick, pick2); }, () => { tabSheet(key, title, pick, pick2); }); return; } }\n" +
  "    tabSheet._w2038 = '';\n" +
  "    const up = String(pick).trim().toUpperCase(), cls = (typeof STU !== 'undefined' && STU && String(STU.code || '').toUpperCase() === up && Array.isArray(STU.cls)) ? STU.cls.filter(c => c && !c.cancelled) : [];\n" +
  "    const tr = cls.filter(c => /-TC\\b|trial/i.test(String(c.title || ''))), nm = (typeof STU !== 'undefined' && STU && STU.s && (STU.s.name || STU.s.en)) || '';\n" +
  "    const line = c => { const d = new Date(c.start); return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) + ' ' + tm(c.start) + (c.teacher ? ' · Teacher ' + String(typeof tName === 'function' ? tName(c.teacher) : c.teacher).replace(/^Teacher\\s+/i, '') : '') + (c.book ? ' · ' + c.book : ''); };\n" +
  "    openSheet('<h1>Lesson summary</h1><div class=\"mute small\">' + esc((nm ? nm + ' · ' : '') + up) + '</div><div class=\"card\" style=\"margin-top:12px;padding:14px 16px;background:#F7F5FC;border-color:#E2DEEE;line-height:1.5\"><b>No package yet</b><div class=\"small\" style=\"margin-top:4px\">The lesson summary starts once the student is enrolled (Enrolled · paid). A trial class never counts toward a package.</div>' + (tr.length ? '<div class=\"small\" style=\"margin-top:8px\"><b>Trial class</b> · ' + tr.map(c => esc(line(c))).join('<br>') + '</div>' : '') + '</div>');\n" +
  "    return; }\n" +
  "  return _tsSh.apply(this, arguments); };"
 ]
]);
