// 645: missed class videos (last 7 days, from 22 Oct) can still be uploaded from Today, clearly marked LATE (due 23:59 on the class day,
// contract: Teacher Late Class Video Submission). Needs server tVidList (Apps Script version after 419); without it the card stays hidden.
const fs = require('fs'), path = require('path'), file = process.argv[2];
const inc = fs.readFileSync(path.join(__dirname, '645-late-videos.inc.txt'), 'utf8');
let s = fs.readFileSync(file, 'utf8'); const i = s.lastIndexOf('</body>');
if(i < 0 || s.indexOf('645 · Missed class videos') >= 0){ console.error('cannot insert'); process.exit(1); }
fs.writeFileSync(file, s.slice(0, i) + inc + '\n' + s.slice(i));
require('../tools/lib.js')(file, [
[
"const c = (D.schedule || []).find(x => x.id === id); if(!c) return toast('Class not found",
"const c = (D.schedule || []).find(x => x.id === id) || (window.VL_LIST || []).find(x => x.id === id); if(!c) return toast('Class not found"
],
[
"show('<b>✓ Class video saved</b><div class=\"small\">'",
"const lateTxt = window.vidLate && vidLate(c) ? '<div class=\"small\" style=\"margin-top:4px;font-weight:700\">Uploaded late (due 23:59 on the class day) · recorded as a late video · management may tag it under the contract</div>' : '';\n      show('<b>✓ Class video saved</b>' + lateTxt + '<div class=\"small\">'"
]
]);
