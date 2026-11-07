// 1865: (Misty 7 Nov "I want that kind of timeline to be shown to teachers") Tapping the "In 16:55" chip (teacher's Today card, and the
//   management Schedule) opens the "I'm in" timeline, read live from the database (coe-cin v3, detail): class start, the tap, when the
//   screen share finished and it was sent, when it was saved with the screen proof (link), the result and what it was counted from,
//   and the device, internet and location. A teacher sees only her own; management sees every teacher's.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  ["if(ci) inBtn = (ci.time ? `<span class=\"chip ${ci.status==='On time'?'green':'red'}\" style=\"margin:8px 0 0 6px\">${ci.status==='On time'?'In':esc(ci.status)} ${esc(ci.time)}${ci.status==='On time'?'':esc(lateBy)}</span>` : '')",
   "if(ci) inBtn = (ci.time ? `<button type=\"button\" class=\"chip ${ci.status==='On time'?'green':'red'}\" style=\"margin:8px 0 0 6px;cursor:pointer;border:0;font:inherit\" title=\"See the timeline\" onclick=\"ciLine('${esc(c.id)}','${esc(c.day)}')\">${ci.status==='On time'?'In':esc(ci.status)} ${esc(ci.time)}${ci.status==='On time'?'':esc(lateBy)} ›</button>` : '')"],
  ["out.push(`<span class=\"chip ${ci.status==='On time'?'green':'red'}\">${ci.first?'Timed in':'In'} ${esc(ci.time)}",
   "out.push(`<span class=\"chip ${ci.status==='On time'?'green':'red'}\" style=\"cursor:pointer\" role=\"button\" tabindex=\"0\" title=\"See the timeline\" onclick=\"event.stopPropagation();ciLine('${esc(e.id)}','${esc(ymdLocal(st))}','${esc(String(e.teacher || '').split(',')[0].trim())}',${ci.first ? 1 : 0})\">${ci.first?'Timed in':'In'} ${esc(ci.time)}"],
  ["\n</body>", "\n<script>\n/* 1865 · the \"I'm in\" timeline (teacher: her own · management: any teacher) */\n(function(){\n"
   + "  if(window.__1865) return; window.__1865 = 1;\n"
   + "  const T = iso => { try{ return new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Asia/Manila' }); }catch(e){ return ''; } };\n"
   + "  const DUR = ms => { const s = Math.max(0, Math.round(ms / 1000)), m = Math.floor(s / 60); return (m ? m + ' min ' : '') + (s % 60) + ' s'; };\n"
   + "  window.ciLine = async function(id, day, who, first){ const mgr = typeof D !== 'undefined' && D && D.mgr;\n"
   + "    openSheet('<h1>\\u201cI\\u2019m in\\u201d timeline</h1><div class=\"sk\"></div><div class=\"sk\"></div><div class=\"sk\" style=\"width:60%\"></div>');\n"
   + "    let r = null; try{ r = await fetch(FAST_URL + '-cin', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, day: day, detail: 1 }) }).then(y => y.json()); }catch(e){}\n"
   + "    if(!r || !r.ok){ openSheet('<h1>\\u201cI\\u2019m in\\u201d timeline</h1><p class=\"small mute\">Could not load the timeline. Check the internet and try again.</p>'); return; }\n"
   + "    const L = r.list || [], wl = String(who || '').toLowerCase();\n"
   + "    let x = first ? L.filter(z => z.kind === 'ti' && (!wl || String(z.who).toLowerCase() === wl)).pop() : L.filter(z => z.kind === 'ci' && z.id === id).pop();\n"
   + "    if(!x){ openSheet('<h1>\\u201cI\\u2019m in\\u201d timeline</h1><p class=\"small mute\">No \\u201cI\\u2019m in\\u201d is saved for this class yet.</p>'); return; }\n"
   + "    const ev = [], you = mgr ? 'Teacher ' + esc(x.who || '') : 'You';\n"
   + "    if(x.start) ev.push({ t: x.start, l: (x.kind === 'ti' ? 'First class starts' : 'Class starts'), d: '', k: 'c' });\n"
   + "    if(x.tapAt) ev.push({ t: x.tapAt, l: you + ' tapped \\u201cI\\u2019m in\\u201d', d: 'The time that counts.', k: 'a' });\n"
   + "    const wait = x.tapAt && x.sentAt ? Date.parse(x.sentAt) - Date.parse(x.tapAt) : 0;\n"
   + "    if(x.sentAt) ev.push({ t: x.sentAt, l: x.kind === 'ti' ? 'Time-in sent' : 'Screen shared and \\u201cI\\u2019m in\\u201d sent', d: wait > 20000 ? 'Waited ' + DUR(wait) + ' for the screen share (choose Entire screen, then Share).' : '', k: 'b' });\n"
   + "    if(x.doneAt) ev.push({ t: x.doneAt, l: 'Saved' + (x.proof ? ' with the screen proof' : ''), d: x.proof ? '<a class=\"link\" href=\"' + esc(x.proof) + '\" target=\"_blank\" rel=\"noopener\">View the screen proof</a>' : (x.shotNote ? esc(x.shotNote) : ''), k: 'b', html: 1 });\n"
   + "    ev.sort((a, b) => Date.parse(a.t) - Date.parse(b.t));\n"
   + "    const ok = x.status === 'On time', m = x.mins == null ? null : +x.mins;\n"
   + "    const res = esc(x.status || 'Saved') + (m == null ? '' : m >= 0 ? ' \\u00b7 ' + m + ' min before class' : ' \\u00b7 ' + Math.abs(m) + ' min late');\n"
   + "    const basis = x.tapAt ? 'Counted from the tap.' : 'Counted from when it was saved (taps are recorded from 7 November 2026).';\n"
   + "    const row = e => '<div style=\"display:flex;gap:12px;padding:10px 0;border-top:1px dashed #E3E8EC\"><span style=\"flex:none;width:12px;height:12px;margin-top:5px;border-radius:50%;background:' + (e.k === 'a' ? '#0E7C7B' : e.k === 'c' ? '#2B2253' : '#9AA5AE') + '\"></span>'\n"
   + "      + '<b class=\"num\" style=\"flex:none;width:76px\">' + esc(T(e.t)) + '</b><div class=\"grow\"><div>' + e.l + '</div>' + (e.d ? '<div class=\"small mute\">' + (e.html ? e.d : esc(e.d)) + '</div>' : '') + '</div></div>';\n"
   + "    const facts = [['Device', x.device], ['Internet', x.speed], ['Location', x.place || (x.locNote ? 'Not shared (' + x.locNote + ')' : '')]].filter(f => f[1]);\n"
   + "    openSheet('<h1>\\u201cI\\u2019m in\\u201d timeline</h1><div class=\"small mute\">' + (mgr ? 'Teacher ' + esc(x.who || '') + ' \\u00b7 ' : '') + esc(x.student || (x.kind === 'ti' ? 'Time-in' : '')) + (x.start ? ' \\u00b7 class ' + esc(T(x.start).slice(0, 5)) + (x.end ? '\\u2013' + esc(T(x.end).slice(0, 5)) : '') : '') + ' \\u00b7 ' + esc(day) + '</div>'\n"
   + "      + '<div style=\"margin:14px 0 6px;padding:12px 14px;border-radius:14px;background:' + (ok ? '#F3FAF6;border:1px solid #BFE3D2' : '#FFF4F1;border:1px solid #F3C7BC') + '\"><b style=\"color:' + (ok ? '#1F7A4F' : '#AE4D41') + '\">' + res + '</b><div class=\"small\">' + basis + (x.flag ? ' ' + esc(x.flag) : '') + '</div></div>'\n"
   + "      + ev.map(row).join('') + (facts.length ? '<div style=\"margin-top:12px;border-top:1px solid #E3E8EC;padding-top:10px\">' + facts.map(f => '<div class=\"small\"><span class=\"mute\">' + f[0] + ':</span> ' + esc(f[1]) + '</div>').join('') + '</div>' : '')\n"
   + "      + '<div class=\"small mute\" style=\"margin-top:12px\">Recorded automatically by the app and the database. Times are Philippine time.</div>'); };\n"
   + "})();\n</script>\n</body>"]]);
