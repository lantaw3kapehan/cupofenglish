// 650: class video checks — before upload (length, recording time, screen proof → reason + note), after upload (same file, server);
// teacher Today "Video checks"; management Overview "Videos to check" (OK / Needs action). See 650-video-checks.inc.txt.
const fs = require('fs'), path = require('path'), file = process.argv[2];
const inc = fs.readFileSync(path.join(__dirname, '650-video-checks.inc.txt'), 'utf8');
let s = fs.readFileSync(file, 'utf8'); const i = s.lastIndexOf('</body>');
if(i < 0 || s.indexOf('650 · Class video checks') >= 0){ console.error('cannot insert'); process.exit(1); }
fs.writeFileSync(file, s.slice(0, i) + inc + '\n' + s.slice(i));
require('../tools/lib.js')(file, [
[
"      if(!(s && s.url && !s.done && s.size === f.size",
"      const pre = window.vidPre ? await vidPre(c, f) : {}; if(!pre) throw Object.assign(new Error('cancel'), { cancel: 1 });   /* 650: checks + reason before upload */\n      show('<b>Preparing the upload…</b><div class=\"small\" style=\"opacity:.8\">' + who + ' · ' + esc(f.name) + ' · ' + mb(f.size) + '</div>', 'wait');\n      if(!(s && s.url && !s.done && s.size === f.size"
],
[
"{ name: f.name, size: f.size, type: f.type || '' }",
"{ name: f.name, size: f.size, type: f.type || '', dur: pre.dur || 0, lm: f.lastModified || 0, why: pre.why || '', note: pre.note || '' }"
],
[
"if(e && e.exp){ o = get(); delete o[id]; put(o); }",
"if(e && e.cancel){ try{ const el = pid && document.getElementById(pid); if(el) el.remove(); }catch(x){} return; }\n      if(e && e.exp){ o = get(); delete o[id]; put(o); }"
],
[
"show('<b>✓ Class video saved</b>' + lateTxt",
"const fl = d && d.flags && d.flags.length ? d.flags : null; try{ if(fl && window.vcAdd) vcAdd(c, url, (d && d.name) || '', fl, pre.why, pre.note); }catch(x){}\n      const flTxt = fl ? '<div class=\"small\" style=\"margin-top:4px;font-weight:700;color:#9A6A12\">Sent for review: ' + fl.map(x => esc(x.t)).join(' · ') + '</div>' : '';\n      show('<b>✓ Class video saved</b>' + lateTxt + flTxt"
]
]);
