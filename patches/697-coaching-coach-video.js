// 697: (Misty) Coaching shows who coached and a link to the recording. Book: "Coach" (you or any teacher). Done · notes and
// Already done · log it: coach, notes and "Recording link". The teacher sees "Coach: …" and "▶ Watch the recording".
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const rep = (a, b) => { if (s.split(a).length !== 2) { console.error('not unique: ' + a.slice(0, 90)); process.exit(1); } s = s.replace(a, b); };
// the note keeps topic — notes, plus "§coach:" and "§video:" lines
rep("const splitN = n => { const m = String(n || '').split(' — '); return { topic: m[0] || '', notes: m.slice(1).join(' — ') }; };",
    "const splitN = n => { let t = String(n || ''); const c = (t.match(/\\n§coach:(.*)/) || [])[1] || '', v = (t.match(/\\n§video:(.*)/) || [])[1] || ''; t = t.replace(/\\n§(coach|video):.*/g, ''); const m = t.split(' — '); return { topic: m[0] || '', notes: m.slice(1).join(' — '), coach: c.trim(), video: v.trim() }; };\n" +
    "  const packN = (topic, notes, coach, video) => (topic || 'Coaching') + (notes ? ' — ' + notes : '') + (coach ? '\\n§coach:' + coach : '') + (video ? '\\n§video:' + video : '');\n" +
    "  const coachSel = (id, def) => { const T = ['" + "' + ((typeof D !== 'undefined' && D && D.me && D.me.name) || 'Management') + '" + "'].concat(teachers().map(x => x.name).sort()); return '<select id=\"' + id + '\" style=\"width:100%;margin:4px 0 10px\">' + [...new Set(T)].map(n => '<option' + (n === def ? ' selected' : '') + '>' + e(n) + '</option>').join('') + '</select>'; };");
rep("+ P.map(r => { const x = splitN(r.note); return '<div class=\"trm-it\" style=\"align-items:flex-start\"><span><b>' + e(x.topic || 'Coaching') + '</b><small>' + e(fmtD(r.done_at)) + ' · ' + e(tName(r.by_who)) + '</small>' + (x.notes ? '<div class=\"small\" style=\"margin-top:4px;white-space:pre-line\">' + e(x.notes) + '</div>' : '') + '</span></div>'; }).join(''))",
    "+ P.map(r => { const x = splitN(r.note); return '<div class=\"trm-it\" style=\"align-items:flex-start\"><span><b>' + e(x.topic || 'Coaching') + '</b><small>' + e(fmtD(r.done_at)) + ' · Coach: ' + e(x.coach || tName(r.by_who)) + '</small>' + (x.notes ? '<div class=\"small\" style=\"margin-top:4px;white-space:pre-line\">' + e(x.notes) + '</div>' : '') + (/^https?:\\/\\//.test(x.video) ? '<a class=\"btn sm teal\" style=\"margin-top:8px\" href=\"' + e(x.video) + '\" target=\"_blank\" rel=\"noopener\">▶ Watch the recording</a>' : '') + '</span></div>'; }).join(''))");
// book/log form: coach + recording link
rep("+ '<label class=\"small mute\">Topic</label><input id=\"tcP\"", "+ '<label class=\"small mute\">Coach</label>' + coachSel('tcC', (D.me || {}).name) + '<label class=\"small mute\">Topic</label><input id=\"tcP\"");
rep("+ '<div id=\"tcLg\" class=\"hide\"><label class=\"small mute\">Notes for the teacher · what we worked on, next steps</label><textarea id=\"tcN\" rows=\"5\" style=\"width:100%;margin-top:4px\"></textarea></div></div>'",
    "+ '<div id=\"tcLg\" class=\"hide\"><label class=\"small mute\">Notes for the teacher · what we worked on, next steps</label><textarea id=\"tcN\" rows=\"5\" style=\"width:100%;margin:4px 0 10px\"></textarea><label class=\"small mute\">Recording link (optional · e.g. Google Drive, shared with the teacher)</label><input id=\"tcV\" placeholder=\"https://…\" style=\"width:100%;margin-top:4px\"></div></div>'");
rep("note: p + (v('tcN').trim() ? ' — ' + v('tcN').trim() : '') });", "note: packN(p, v('tcN').trim(), v('tcC'), v('tcV').trim()) });");
rep("facilitator: (D.me || {}).name || '', meet_url: v('tcU'), note: p, invited: [t] } });", "facilitator: v('tcC') || (D.me || {}).name || '', meet_url: v('tcU'), note: p, invited: [t] } });");
// done · notes: coach + recording link
rep("<textarea id=\"tcN2\" rows=\"6\" style=\"width:100%;margin-top:4px\"></textarea></div>'",
    "<textarea id=\"tcN2\" rows=\"6\" style=\"width:100%;margin:4px 0 10px\"></textarea><label class=\"small mute\">Coach</label>' + coachSel('tcC2', s.facilitator || (D.me || {}).name) + '<label class=\"small mute\">Recording link (optional · e.g. Google Drive, shared with the teacher)</label><input id=\"tcV2\" placeholder=\"https://…\" style=\"width:100%;margin-top:4px\"></div>'");
rep("note: (s.note || 'Coaching') + (n ? ' — ' + n : '') });", "note: packN(s.note || 'Coaching', n, (($('tcC2') || {}).value || s.facilitator || ''), (($('tcV2') || {}).value || '').trim()) });");
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
