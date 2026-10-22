// 643: class video upload from the app — straight to the school Drive (works@ owns it), same folder and name, DAILY linked. See 643-video-upload.inc.txt.
const fs = require('fs'), path = require('path'), file = process.argv[2];
const inc = fs.readFileSync(path.join(__dirname, '643-video-upload.inc.txt'), 'utf8');
let s = fs.readFileSync(file, 'utf8'); const i = s.lastIndexOf('</body>');
if(i < 0 || s.indexOf('643 · Class video upload') >= 0){ console.error('cannot insert'); process.exit(1); }
fs.writeFileSync(file, s.slice(0, i) + inc + '\n' + s.slice(i));
require('../tools/lib.js')(file, [
[
"<b>Upload the class video</b> <span class=\"mute\">· ${fo?'':'No folder found for this class yet · ask Ops to add it · '}name it ${esc(c.code)}-${esc(c.student||'')}-${esc(new Date(c.start).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'}).replace(/,? /g,'-'))}${(()=>{const b=String(c.book||s.book||'').split(/\\s*,\\s*/).filter(p=>p&&!/^(pre[-\\s]?)?[abc][12]\\+?$/i.test(p))[0]||'';return b?'-'+esc(b.replace(/\\s+/g,'')):'';})()}</span></div>${fo?`<a class=\"btn teal sm\" href=\"${esc(fo)}\" target=\"_blank\">Open folder</a>`:''}</div>`; }",
"<b>Upload the class video</b> <span class=\"mute\">· here in the app · saved to the school Drive, not your storage · named and filed for you</span></div><button class=\"btn teal sm\" onclick=\"vidUp('${esc(c.id)}')\">Upload video</button></div>`; }"
]
]);
