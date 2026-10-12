// Reminder copy: meeting ID in the WeChat-friendly Tencent format "#腾讯会议：385-0345-7444" (WeChat makes it tappable).
// Reminders box: when nothing is due, a steady line says when the next reminder opens, so the box does not seem to vanish.
require('../tools/lib.js')(process.argv[2], [
[
"const md = (s.getMonth() + 1) + '月' + s.getDate() + '日', vo = e.meet ? '\\n\\n会议号 Meeting ID: ' + e.meet : '';",
"const md = (s.getMonth() + 1) + '月' + s.getDate() + '日', vo = e.meet ? '\\n\\n#腾讯会议：' + meetFmt(e.meet) : '';"
],
[
"function scRemind(i, fromBox){\n",
"function meetFmt(m){ const d = String(m || '').replace(/\\D/g, ''); if(d.length === 9) return d.replace(/(\\d{3})(\\d{3})(\\d{3})/, '$1-$2-$3'); if(d.length === 10) return d.replace(/(\\d{3})(\\d{3})(\\d{4})/, '$1-$2-$3'); if(d.length === 11) return d.replace(/(\\d{3})(\\d{4})(\\d{4})/, '$1-$2-$3'); return String(m).trim().replace(/\\s+/g, '-'); }\nfunction scNextRem(){ if(!SC) return null; const n = Date.now(); let best = null; SC.events.forEach(e => { if(e.cancelled || ymdLocal(new Date(e.start)) !== ymdLocal(new Date())) return; const s = +new Date(e.start); [['2h', s - 180 * 6e4], ['10m', s - 20 * 6e4]].forEach(([st, at]) => { if(at > n && !scSent(e, st) && (!best || at < best.at)) best = { at, e, st }; }); }); return best; }\nfunction scRemind(i, fromBox){\n"
],
[
"if(!due.length) return sent ? `<div class=\"small mute\" style=\"margin-top:10px\">🔔 Reminders due: all sent ✓ (${sent})</div>` : '';",
"if(!due.length){ const nx = scNextRem(); return (sent || nx) ? `<div class=\"small mute\" style=\"margin-top:10px\">🔔 Reminders: ${sent ? 'all sent ✓ (' + sent + ')' : 'none due now'}${nx ? ' · next opens ' + tm(new Date(nx.at).toISOString()) + ' · ' + esc(nx.e.student || nx.e.title) + ' (' + (nx.st === '10m' ? '10-min' : 'early') + ')' : ''}</div>` : ''; }"
]
]);
