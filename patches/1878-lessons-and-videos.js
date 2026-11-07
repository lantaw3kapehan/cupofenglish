// 1878: (Misty 7 Nov 21:17 "when we tally lesson summary, we just open 1 folder … also see whats best for the linking of videos")
//   Student page → "▶ Lessons & videos": every lesson held (last 13 months) with its class video / screen proof link, month by month,
//   and the tally "N lessons · V videos · P screen proofs · M missing" (from coe-stuvid → coe_stu_videos; videos recorded from 22 Oct).
//   Management sees every lesson; a teacher sees the lessons she taught.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  ["${D.mgr ? `<button class=\"btn ghost sm\" onclick=\"tabSheet('INDPKG','Lesson summary','${esc(code)}')\">Lesson summary</button>",
   "${code ? `<button class=\"btn ghost sm\" onclick=\"lvOpen1878('${esc(code)}')\">▶ Lessons &amp; videos</button>` : ''}${D.mgr ? `<button class=\"btn ghost sm\" onclick=\"tabSheet('INDPKG','Lesson summary','${esc(code)}')\">Lesson summary</button>"],
  ["function lsHtml(code){",
   `async function lvOpen1878(code){   /* 1878: lessons with their class videos */
  openSheet('<h1>Lessons &amp; videos</h1><div class="mute small">' + esc(code) + '</div><div class="sk"></div><div class="sk"></div><div class="sk" style="width:60%"></div>'); try{ $('sheet').classList.add('wide'); }catch(e){}
  let r = null; try{ r = await fetch(FAST_URL + '-stuvid', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, code }) }).then(x => x.json()); }catch(e){}
  if(!r || !r.ok){ $('sheetBody').innerHTML = '<h1>Lessons &amp; videos</h1><div class="empty">Could not load. Try again.</div>'; return; }
  const n1 = x => Math.round(x * 10) / 10, rows = r.rows || [], M = {}, ord = [];
  rows.forEach(x => { const k = String(x.start).slice(0, 7); if(!M[k]){ M[k] = []; ord.push(k); } M[k].push(x); });
  const book = t => { const p = String(t || '').replace(/\\s+X$/i, '').split('-'); while(p.length > 5 && /^(TC|SC|TRIAL|SUB)$/i.test(p[p.length - 1])) p.pop(); return p.length > 5 ? p.slice(4, -1).join('-') : ''; };
  const day = s => { const d = new Date(String(s).slice(0, 10) + 'T12:00:00'); return d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' }) + ' · ' + String(s).slice(11, 16); };
  const st = x => x.url ? '<a class="link" href="' + esc(x.url) + '" target="_blank" rel="noopener">' + (x.proof ? '📷 Screen proof' : '▶ Video') + '</a>' + (x.late ? ' <span class="small" style="color:#9A4330">late</span>' : '')
    : x.rec ? '<b style="color:#B42318">⚠ No video</b>' : '<span class="small mute">before app record</span>';
  const kind = k => k === 'trial' ? ' <span class="chip">Trial</span>' : k === 'sub' ? ' <span class="chip">Sub</span>' : '';
  let h = '<h1>Lessons &amp; videos</h1><div class="mute small">' + esc(code) + ' · lessons held in the last 13 months' + (D.mgr ? '' : ' · your classes') + '</div>'
    + '<div class="stats" style="margin-top:12px"><div class="stat"><b class="num">' + r.held + '</b><span>lessons · ' + n1(+r.units || 0) + ' units</span></div>'
    + '<div class="stat"><b class="num">' + r.videos + '</b><span>videos</span></div><div class="stat"><b class="num">' + r.proofs + '</b><span>screen proofs</span></div>'
    + '<div class="stat"><b class="num' + (r.missing ? ' minus' : '') + '">' + r.missing + '</b><span>missing</span></div></div>'
    + '<div class="small mute" style="margin-top:6px">Videos are tallied from 22 Oct 2026 (the app\\'s upload record): ' + r.tracked + ' lessons since then. Earlier lessons show "before app record" · their videos are in the student\\'s folder in STUDENT CLASS VIDEOS.</div>';
  if(!rows.length) h += '<div class="empty">No lessons held yet.</div>';
  ord.forEach(k => { const L = M[k], d = new Date(k + '-15T12:00:00'), u = n1(L.reduce((a, x) => a + (+x.u || 0), 0)), miss = L.filter(x => !x.url && x.rec).length;
    h += '<h2>' + d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) + ' <span class="c">' + L.length + ' lessons · ' + u + ' units' + (miss ? ' · ' + miss + ' missing' : '') + '</span></h2>'
      + '<table>' + L.map(x => '<tr><td>' + esc(day(x.start)) + '<div class="small mute">' + esc(x.teacher || '') + (book(x.title) ? ' · ' + esc(book(x.title)) : '') + kind(x.kind) + '</div></td><td class="num" style="text-align:right">' + n1(+x.u || 0) + '</td><td style="text-align:right">' + st(x) + '</td></tr>').join('') + '</table>'; });
  $('sheetBody').innerHTML = h; }
function lsHtml(code){`],
]);
