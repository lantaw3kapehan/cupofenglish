// 1837: (Misty 7 Nov "yes!" to the mock, "also for the other screens, tabs, buttons, and make it aligned and centralized for uniformity")
//   · Management menu in four groups: Today (Overview, To do, Schedule, Monitor) · People (Students, Trials, Teachers, Walk-in test)
//     · Messages (Notices & requests, Team Chat) · Finance. Laptop side menu regrouped; phone bottom bar = the four groups,
//     each opening with a bar of its screens at the top ("More" no longer needed). Old links keep working.
//   · Overview: numbers first, then "Needs you" (one row per item with an Open button), teacher messages folded to one line.
//   · Overview counts now match To do exactly (the "All recent reports are saved." line and already-fixed data no longer counted).
//   · Every screen: same width, headings on the same line, Finance and Teachers tabs in one even row, same header buttons.
const lib = require('../tools/lib.js'), fs = require('fs'), file = process.argv[2];
const inc = fs.readFileSync(__dirname + '/1837-four-groups-overview-uniform.inc.txt', 'utf8');
lib(file, [
  ["return { renNow: ren.filter(x => x.now), ren, fol, rep: P ? (P.rows || []).filter(r => { const t = trlFor(r[0], r[1], r[2]); return !(t && t.status === 'Sent'); }) : [], fix: X ? X.rows : [] }; }",
   "const rep = (P ? (P.rows || []) : []).filter(r => String(r[1] || '').trim() && !/reports? (are )?saved|all recent/i.test(String(r[0]) + ' ' + String(r[1]))).filter(r => { const t = trlFor(r[0], r[1], r[2]); return !(t && t.status === 'Sent'); });   /* 1837: counted the same way as the To do screen */\n"
   + "try{ if(typeof TRL !== 'undefined' && TRL && TRL.rows && typeof ymdLocal === 'function'){ const s14 = ymdLocal(new Date(Date.now() - 14 * 864e5)); TRL.rows.forEach(t => { if(!t.date || t.status === 'Sent' || t.date < s14) return; if(rep.some(r => String(r[0] || '').slice(0, 10) === t.date && String(r[1] || '').trim().toLowerCase() === String(t.student || '').trim().toLowerCase())) return; rep.push([t.date, t.student, t.code]); }); } }catch(e){}\n"
   + "const fix = (X ? X.rows : []).filter(r => { try{ const k = fixKey({ date: r[0], name: r[1], t: r[tdCol(X,/TEACHER/,2)], issue: r[tdCol(X,/ISSUE/,8)] || r.slice(3).filter(Boolean).pop() || '' }); return !FIXI[k] && !FIXD[k]; }catch(e){ return true; } });\n"
   + "return { renNow: ren.filter(x => x.now), ren, fol, rep, fix }; }"],
  ["const pool = nw.length ? nw : L.slice(0, 3), show = FD1806.all ? pool.slice(0, 12) : pool.slice(0, 3);   /* 1815: 3 unless Show all */",
   "const pool = nw.length ? nw : L.slice(0, 3), show = !FD1806.open ? [] : FD1806.all ? pool.slice(0, 12) : pool.slice(0, 3);   /* 1815: 3 unless Show all · 1837: one line until Show */\n"
   + "  const cnt37 = k => nw.filter(x => x.k === k).length, sumL37 = [[cnt37('leave'), 'notice of unavailability', 'notices of unavailability'], [cnt37('withdrawn'), 'withdrawn notice', 'withdrawn notices'], [cnt37('msg'), 'message', 'messages']].filter(a => a[0]).map(a => a[0] + ' ' + (a[0] === 1 ? a[1] : a[2])), sum37 = sumL37.length > 1 ? sumL37.slice(0, -1).join(', ') + ' and ' + sumL37[sumL37.length - 1] : (sumL37[0] || '');"],
  ["'<section class=\"fd1806' + (nw.length ? ' on' : '') + '\" id=\"fd1806\"><div class=\"fd-h\"><b>' + (nw.length ? nw.length + ' new from teachers' : 'From teachers · nothing new') + '</b>'\n    + (nw.length ? '<button class=\"btn sm ghost\" onclick=\"fd1806all()\">Mark all seen</button>' : '<span class=\"small mute\">last 7 days</span>') + '</div>'",
   "'<section class=\"fd1806' + (nw.length ? ' on' : '') + '\" id=\"fd1806\"><div class=\"fd-h\"><span class=\"fd37\"><b>' + (nw.length ? 'From teachers: ' + nw.length + ' new' : 'From teachers: nothing new') + '</b><span class=\"small mute\">' + (nw.length ? esc(sum37) : 'Last 7 days') + '</span></span>'\n"
   + "    + '<span class=\"fd37b\">' + (nw.length && FD1806.open ? '<button class=\"btn sm ghost\" onclick=\"fd1806all()\">Mark all seen</button>' : '') + (L.length ? '<button class=\"btn sm ' + (FD1806.open || !nw.length ? 'ghost' : 'teal') + '\" aria-expanded=\"' + !!FD1806.open + '\" onclick=\"FD1806.open=!FD1806.open;fd1806paint()\">' + (FD1806.open ? 'Hide' : 'Show') + '</button>' : '') + '</span></div>'"],
  [": '<div class=\"small mute\" style=\"padding:6px 0\">No notices or messages from teachers in the last 7 days.</div>')",
   ": (FD1806.open ? '<div class=\"small mute\" style=\"padding:6px 0\">No notices or messages from teachers in the last 7 days.</div>' : ''))"],
  ["\n</body>", "\n" + inc + "</body>"]]);
