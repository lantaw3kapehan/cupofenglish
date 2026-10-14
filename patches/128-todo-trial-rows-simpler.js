// 14 Oct night · To do › Trial follow-ups simpler (Misty: the options feel redundant).
// · The long history line under each trial is cut to one line ("History ›" opens it); the full history is in Update.
// · Buttons: Copy message · ✓ Message sent · Update (was "Change").
// · The follow-up card no longer offers "Enrolling" when the student has a code: "Enrolled · paid" at the top does it,
//   and marks the trial enrolled by itself. The teacher is passed to the enrol form without "Teacher ".
require('../tools/lib.js')(process.argv[2], [
["${opt('Enrolling','said yes · package coming')}", "${x.code && /^ST-/.test(x.code) ? '' : opt('Enrolling','said yes · package coming')}"],
["FUS = { k: x.k, name: x.name, st: null, code: x.code || '', teacher: x.teacher || '' };",
 "FUS = { k: x.k, name: x.name, st: null, code: /^ST-/.test(x.code || '') ? x.code : '', teacher: String(x.teacher || x.t || '').replace(/^teacher\\s+/i, '').split(/[,&/]/)[0].trim() };"],
["<div class=\"small\" style=\"margin-top:2px\">Trial ${tdDate(x.date)} · ${tdWho(x.t)}${x.note ? ' · <span class=\"mute\">' + esc(x.note) + '</span>' : ''}</div>",
 "<div class=\"small\" style=\"margin-top:2px\">Trial ${tdDate(x.date)} · ${tdWho(x.t)}</div>${x.note ? `<div class=\"small mute\" style=\"margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:pointer\" title=\"Tap to see all\" onclick=\"this.style.whiteSpace=this.style.whiteSpace==='normal'?'nowrap':'normal'\">History › ${esc(String(x.note).split(' · ').slice(-1)[0])}</div>` : ''}"],
["<button class=\"btn ghost sm\" onclick=\"fuSheet(${fi})\">${a || !no ? 'Change' : 'Followed up'}</button>",
 "<button class=\"btn ghost sm\" onclick=\"fuSheet(${fi})\">Update</button>"],
["onclick=\"fuQuick(${fi},'Following up','${esc(s.en.split(' · ')[0])} message sent')\">✓ Sent</button>",
 "onclick=\"fuQuick(${fi},'Following up','${esc(s.en.split(' · ')[0])} message sent')\">✓ Message sent</button>"],
]);
