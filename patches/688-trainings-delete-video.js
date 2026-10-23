// 688: (Misty) Trainings list › Edit: "Delete video" (file removed from storage; teachers see "Video coming soon") and
// "Remove this part" (hidden from teachers). Teachers' watch and quiz history is kept. Replacing a video deletes the old file.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const rep = (a, b) => { if (s.split(a).length !== 2) { console.error('not unique: ' + a.slice(0, 90)); process.exit(1); } s = s.replace(a, b); };
rep("await call('part_set', { p: { id: part.id, video_path: u.path, dur_sec: dur, newver: !!part.video_path } }); }",
    "if(part.video_path) await call('part_remove', { id: part.id, what: 'video' });   /* 688: the old file goes */\n        await call('part_set', { p: { id: part.id, video_path: u.path, dur_sec: dur, newver: !!part.video_path } }); }");
rep("+ '<button class=\"btn teal block\" style=\"margin-top:12px\" id=\"tpS\" onclick=\"trPartSave(",
    "+ (pid ? '<div class=\"row\" style=\"gap:8px;margin-top:12px;flex-wrap:wrap\">' + (p.video_path ? '<button class=\"btn ghost grow\" id=\"tpDV\" onclick=\"trPartDel(' + pid + ',\\'video\\')\">Delete video</button>' : '') + '<button class=\"btn ghost grow\" id=\"tpDP\" style=\"color:#B4442F\" onclick=\"trPartDel(' + pid + ',\\'part\\')\">Remove this ' + (p.training_id === 'model' ? 'lesson' : 'part') + '</button></div><p class=\"small mute\" style=\"margin-top:6px\">Teachers\\' watch and quiz history is kept.</p>' : '')\n      + '<button class=\"btn teal block\" style=\"margin-top:12px\" id=\"tpS\" onclick=\"trPartSave(");
rep("  window.trPartSave = async function(pid, tid, sort){",
    "  window.trPartDel = async function(pid, what){ const b = $(what === 'video' ? 'tpDV' : 'tpDP'); if(!b) return; if(!b.dataset.c){ b.dataset.c = 1; b.textContent = what === 'video' ? 'Tap again to delete the video' : 'Tap again to remove'; return; }\n    b.disabled = true; b.textContent = 'Removing…'; try{ await call('part_remove', { id: pid, what }); toast(what === 'video' ? 'Video deleted' : 'Removed'); await loadAll(true); trList(); paintAll(); }catch(x){ toast(x.message); b.disabled = false; } };\n  window.trPartSave = async function(pid, tid, sort){");
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
