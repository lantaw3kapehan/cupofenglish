// 683: (Misty "I don't see the self-study") Management Trainings screen gets a Self-study card: the model lessons teachers see,
// with views per lesson and "+ Add model lesson". Group label "First week" instead of "To Newly Hired".
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const rep = (a, b) => { if (s.split(a).length !== 2) { console.error('not unique: ' + a.slice(0, 90)); process.exit(1); } s = s.replace(a, b); };
rep("(need.join('') || '<div class=\"small mute\" style=\"padding:8px 0\">All clear.</div>') + '</div></div>';",
    "(need.join('') || '<div class=\"small mute\" style=\"padding:8px 0\">All clear.</div>') + '</div>'\n" +
    "      + (() => { const ML = partsOf(d, 'model'); return '<div class=\"trm-card\"><div class=\"k\">SELF-STUDY · FREE · EVERY TEACHER SEES IT</div>' + (ML.length ? ML.map(p => { const G = (d.progress || []).filter(g => g.part_id === p.id && g.ver === p.ver), w = G.filter(g => g.pct >= 90).length;\n" +
    "          return '<div class=\"trm-it\"><span><b>' + e(p.title) + '</b><small>' + (p.video_path ? Math.round(p.dur_sec / 60) + ' min · ' + w + ' watched' + (G.length > w ? ' · ' + (G.length - w) + ' started' : '') : 'No video yet') + '</small></span><button class=\"btn sm ghost\" onclick=\"trPartEdit(' + p.id + ')\">Edit</button></div>'; }).join('') : '<div class=\"small mute\" style=\"padding:8px 0\">No model lessons yet. Add a video of a strong class; teachers watch it in the app (no download) and write what they will try.</div>')\n" +
    "        + '<button class=\"btn sm teal\" style=\"margin-top:8px\" onclick=\"trPartEdit(0,\\'model\\')\">+ Add model lesson</button></div>'; })() + '</div>';");
rep("(tab === 'path' ? 'To ' + e(x.g) : 'Unlocks')", "(tab === 'path' ? (x.g === 'Newly Hired' ? 'First week' : 'To ' + e(x.g)) : 'Unlocks')");
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
