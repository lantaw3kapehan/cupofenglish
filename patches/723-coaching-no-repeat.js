// 723: (Misty) Dezza's 2 Sept coaching showed twice (logged again to get the full notes + recording). The two were merged (record #46 keeps
// the full notes and the recording; #350 marked void). Now: logging a coaching for a teacher who already has one on that day asks first —
// "Add the recording or notes to the one already there" (+ Recording) or "It's a different session".
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const rep = (a, b) => { if (s.split(a).length !== 2) { console.error('not unique: ' + a.slice(0, 90)); process.exit(1); } s = s.replace(a, b); };
const R = String.raw;
rep(R`window.trCoachSave = async function(){ const v = id => ($(id) || {}).value || '', t = v('tcT'), p = v('tcP').trim(), d = v('tcD'); if(!t || !p) return toast('Choose the teacher and write the topic'); if(!d) return toast('Pick the date');`,
    R`window.trCoachSave = async function(force){ const v = id => ($(id) || {}).value || '', t = v('tcT'), p = v('tcP').trim(), d = v('tcD'); if(!t || !p) return toast('Choose the teacher and write the topic'); if(!d) return toast('Pick the date');
    if(window._tcMode && force !== 1){ const day = d.slice(0, 10), same = ((AL && AL.records) || []).filter(r => r.training_id === 'coach' && r.teacher === t && r.status === 'done' && fmtD(r.done_at) === fmtD(day + 'T12:00:00+08:00'));
      if(same.length){ let w = $('tcDup'); if(!w){ w = document.createElement('div'); w.id = 'tcDup'; w.className = 'card'; w.style.cssText = 'margin-top:12px;border:1.5px solid #F0C9BD;background:#FBEDE8'; const b0 = $('tcS'); b0.parentNode.insertBefore(w, b0); }
        w.innerHTML = '<b>' + e(tName(t)) + ' already has a coaching on ' + e(fmtD(same[0].done_at)) + '</b><div class="small" style="margin:4px 0 10px">' + e(splitN(same[0].note).topic) + ' · to add the recording, use + Recording on that coaching instead of logging it again.</div><div class="row" style="gap:8px;flex-wrap:wrap"><button class="btn sm teal" onclick="trCoachRec(' + same[0].id + ')">+ Recording on that one</button><button class="btn sm ghost" onclick="trCoachSave(1)">It\'s a different session · save</button></div>'; return; } }`);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
