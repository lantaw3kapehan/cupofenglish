// 1939: (Misty, 9 Nov 10:19) To do › Class videos: tapping a teacher opened "Lessons by student" (the payslip view).
//   · Now it opens that teacher's class videos for the month, from the database (coe-stuvid › coe_teacher_videos):
//     still missing (class held, no video or screen proof), uploaded late, then every lesson with its ▶ video.
//   · "Lessons by student" stays one tap away at the top of the sheet.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["    const row = x => '<div style=\"padding:8px 0;border-top:1px solid #EFEDF4;cursor:pointer\" onclick=\"ps1752Lessons(\\'' + esc(String(x.teacher)).replace(/'/g, '') + '\\',\\'' + ym + '\\')\"><b>' + esc(x.teacher) + '</b> '",
   "    const row = x => '<div style=\"padding:8px 0;border-top:1px solid #EFEDF4;cursor:pointer\" onclick=\"vid1939Open(\\'' + esc(String(x.teacher)).replace(/'/g, '') + '\\',\\'' + ym + '\\')\"><b>' + esc(x.teacher) + '</b> '"],
  ["' late upload' + (x.monthLate === 1 ? '' : 's') + ' · tap for the lessons</div>' + lateCases(x.teacher, ym) + '</div>';",
   "' late upload' + (x.monthLate === 1 ? '' : 's') + ' · tap for the videos</div>' + lateCases(x.teacher, ym) + '</div>';"],
  ["  const rt = window.renderMToday; if(rt) window.renderMToday = function(){ const r = rt.apply(this, arguments); try{ card(); load(); }catch(e){} return r; };\n  setTimeout(load, 4000); setInterval(() => { at = 0; load(); }, 30 * 6e4);",
   "  const rt = window.renderMToday; if(rt) window.renderMToday = function(){ const r = rt.apply(this, arguments); try{ card(); load(); }catch(e){} return r; };\n  setTimeout(load, 4000); setInterval(() => { at = 0; load(); }, 30 * 6e4);\n" +
   "  /* 1939: a teacher's class videos this month (missing · late · every lesson with its video) */\n" +
   "  window.vid1939Open = async (t, ym) => {\n" +
   "    const name = String(t || ''), mon = new Date(ym + '-15T12:00:00').toLocaleDateString('en-US', { month: 'long', year: 'numeric' });\n" +
   "    const head = '<div class=\"row\" style=\"gap:8px;flex-wrap:wrap;align-items:center\"><h1 class=\"grow\" style=\"margin:0\">Class videos · ' + esc(name) + '</h1><button class=\"btn sm ghost\" onclick=\"ps1752Lessons(\\'' + esc(name).replace(/\\x27/g, '') + '\\',\\'' + ym + '\\')\">Lessons by student →</button></div><div class=\"small mute\" style=\"margin-top:4px\">' + esc(mon) + ' · from the database</div>';\n" +
   "    openSheet(head + '<div class=\"sk\" style=\"height:260px;margin-top:10px\"></div>'); try{ $('sheet').classList.add('wide'); }catch(e){}\n" +
   "    let r = null; try{ r = await fetch(FAST_URL + '-stuvid', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, month: ym, teacher: name }) }).then(x => x.json()); }catch(e){}\n" +
   "    if(!r || !r.ok){ $('sheetBody').innerHTML = head + '<div class=\"empty\">Could not load the videos. Try again.</div>'; return; }\n" +
   "    const today = new Date(Date.now() + 8 * 3600e3).toISOString().slice(0, 10), stu = x => { const p = String(x.title || '').replace(/\\s+X$/i, '').split('-'); return p.length > 3 ? p[3] : String(x.code || ''); };\n" +
   "    const when = x => new Date(x.d + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' }) + ' ' + esc(x.t || '');\n" +
   "    const kind = x => x.kind === 'trial' ? ' <span class=\"chip\">trial</span>' : x.kind === 'sub' ? ' <span class=\"chip\">sub</span>' : '';\n" +
   "    const L = (r.rows || []).filter(x => x && x.d && x.d <= today), miss = L.filter(x => !x.url), late = L.filter(x => x.url && x.late);\n" +
   "    const line = (x, right) => '<div style=\"display:flex;gap:10px;align-items:center;padding:8px 0;border-top:1px solid #EFEDF4\"><span class=\"grow\"><b>' + esc(stu(x)) + '</b> <span class=\"small mute\">' + esc(x.code || '') + '</span>' + kind(x) + '<div class=\"small mute\">' + when(x) + '</div></span>' + right + '</div>';\n" +
   "    const open = x => x.url ? '<a class=\"btn sm ghost\" href=\"' + esc(x.url) + '\" target=\"_blank\" rel=\"noopener\">▶ ' + (x.proof ? 'Screen proof' : 'Video') + '</a>' : '';\n" +
   "    const sec = (title, col, A, right) => A.length ? '<h2 style=\"margin-top:14px;color:' + col + '\">' + title + ' · ' + A.length + '</h2>' + A.map(x => line(x, right(x))).join('') : '';\n" +
   "    $('sheetBody').innerHTML = head\n" +
   "      + '<div style=\"display:flex;gap:6px;margin-top:10px\">' + [['#0E6B5C', L.length - miss.length, 'with video'], ['#B42318', miss.length, 'missing'], ['#B54708', late.length, 'late']].map(a => '<div style=\"flex:1;background:#F7F5FC;border-radius:10px;padding:8px 4px;text-align:center\"><b style=\"display:block;font-size:18px;color:' + a[0] + '\">' + a[1] + '</b><span class=\"small mute\">' + a[2] + '</span></div>').join('') + '</div>'\n" +
   "      + (miss.length ? sec('Missing', '#B42318', miss, x => '<span class=\"small\" style=\"color:#B42318\">no video yet</span>') : '<div class=\"small\" style=\"margin-top:12px;color:#0E6B5C\">✓ No missing videos this month.</div>')\n" +
   "      + sec('Uploaded late', '#B54708', late, x => '<span class=\"small mute\">' + esc(x.up || '') + '</span> ' + open(x))\n" +
   "      + '<details style=\"margin-top:14px\"><summary class=\"small\" style=\"cursor:pointer\"><b>All ' + L.length + ' lessons</b> · newest first</summary>' + L.slice().reverse().map(x => line(x, x.url ? open(x) : '<span class=\"small\" style=\"color:#B42318\">missing</span>')).join('') + '</details>'\n" +
   "      + '<div class=\"small mute\" style=\"margin-top:10px\">Missing = class held, no video or screen proof · late = uploaded after the class day.</div>';\n" +
   "  };"]
]);
