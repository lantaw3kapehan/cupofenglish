// 693: (Misty) 1:1 Coaching (e.g. Misty with Dezza on REF). Management: "+ Coaching" — book a coaching (teacher, topic, date, link) or
// log one already done with notes; coming coachings sit in Coming up with "Done · notes". Teacher: a "Coaching" card — next coaching and
// past ones with the topic and the coach's notes. On a teacher's path (tap the name) the coaching history shows too. Kept permanently.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const rep = (a, b) => { if (s.split(a).length !== 2) { console.error('not unique: ' + a.slice(0, 90)); process.exit(1); } s = s.replace(a, b); };
rep("<button class=\"btn\" onclick=\"trSched()\">+ Schedule</button> <button class=\"btn ghost\" onclick=\"trList()\">Videos &amp; quizzes</button></div>';",
    "<button class=\"btn\" onclick=\"trSched()\">+ Schedule</button> <button class=\"btn teal\" onclick=\"trCoach()\">+ Coaching</button> <button class=\"btn ghost\" onclick=\"trList()\">Videos &amp; quizzes</button></div>';");
rep("<button class=\"btn sm ' + (past ? 'teal' : 'ghost') + '\" onclick=\"trAttend(' + s.id + ')\">Attendance</button>",
    "' + (s.training_id === 'coach' ? '<button class=\"btn sm ' + (past ? 'teal' : 'ghost') + '\" onclick=\"trCoachDone(' + s.id + ')\">Done · notes</button>' : '<button class=\"btn sm ' + (past ? 'teal' : 'ghost') + '\" onclick=\"trAttend(' + s.id + ')\">Attendance</button>') + '");
rep("+ '<section class=\"tx-card\"><div class=\"tx-h\"><b>Self-study</b><span>free</span></div>'", "+ coachCard(d, who) + '<section class=\"tx-card\"><div class=\"tx-h\"><b>Self-study</b><span>free</span></div>'");
rep("+ trUpTo(name) + '<h2>CupOfEnglish Way</h2>'", "+ trUpTo(name) + '<h2>Coaching</h2>' + coachList(TV, name) + '<h2>CupOfEnglish Way</h2>'");
rep("  window.paintTrAll = () => paintAll();", `  window.paintTrAll = () => paintAll();
  /* 693 · coaching */
  const coachRecs = (d, who) => (d.records || []).filter(r => r.training_id === 'coach' && r.teacher === who && r.status === 'done').sort((a, b) => String(b.done_at).localeCompare(String(a.done_at)));
  const coachUp = (d, who) => (d.sessions || []).filter(s => s.training_id === 'coach' && s.status === 'scheduled' && (s.invited || []).includes(who) && new Date(s.starts_at).getTime() > Date.now() - 3 * 3600e3);
  const splitN = n => { const m = String(n || '').split(' — '); return { topic: m[0] || '', notes: m.slice(1).join(' — ') }; };
  function coachList(d, who){ const U = coachUp(d, who), P = coachRecs(d, who);
    return (U.map(s => '<div class="trm-it"><span><b>' + e(s.note || 'Coaching') + '</b><small>' + e(fmtDT(s.starts_at)) + (s.facilitator ? ' · ' + e(tName(s.facilitator)) : '') + '</small></span>' + (s.meet_url ? '<a class="btn sm teal" href="' + e(s.meet_url) + '" target="_blank" rel="noopener">Join</a>' : '<span class="small mute">booked</span>') + '</div>').join('')
      + P.map(r => { const x = splitN(r.note); return '<div class="trm-it" style="align-items:flex-start"><span><b>' + e(x.topic || 'Coaching') + '</b><small>' + e(fmtD(r.done_at)) + ' · ' + e(tName(r.by_who)) + '</small>' + (x.notes ? '<div class="small" style="margin-top:4px;white-space:pre-line">' + e(x.notes) + '</div>' : '') + '</span></div>'; }).join(''))
      || '<div class="small mute" style="padding:6px 0">No coaching yet.</div>'; }
  window.coachCard = function(d, who){ const U = coachUp(d, who), P = coachRecs(d, who); if(!U.length && !P.length) return '';
    return '<section class="tx-card"><div class="tx-h"><b>Coaching</b><span>1:1 with management</span></div>' + coachList(d, who) + '</section>'; };
  window.trCoach = function(name){ const T = teachers().map(x => x.name).sort(), now8 = new Date(Date.now() + 8 * 3600e3).toISOString();
    openSheet('<h1>1:1 Coaching</h1><div class="mute small">Book a coaching, or log one you already did. The teacher sees it on their Trainings.</div>'
      + '<div class="tx-seg" style="margin:12px 0"><button id="tcB" class="on" onclick="trCoachMode(0)">Book</button><button id="tcL" onclick="trCoachMode(1)">Already done · log it</button></div>'
      + '<div class="card"><label class="small mute">Teacher</label><select id="tcT" style="width:100%;margin:4px 0 10px">' + T.map(n => '<option' + (n === name ? ' selected' : '') + '>' + e(n) + '</option>').join('') + '</select>'
      + '<label class="small mute">Topic</label><input id="tcP" placeholder="e.g. REF · Reading Explorer Foundations, Unit 3" style="width:100%;margin:4px 0 10px">'
      + '<label class="small mute">Date and time (PH)</label><input type="datetime-local" id="tcD" value="' + now8.slice(0, 16) + '" style="width:100%;margin:4px 0 10px">'
      + '<div id="tcBk"><label class="small mute">Minutes</label><input type="number" id="tcM" value="30" style="width:100%;margin:4px 0 10px"><label class="small mute">Meeting link (optional)</label><input id="tcU" style="width:100%;margin-top:4px"></div>'
      + '<div id="tcLg" class="hide"><label class="small mute">Notes for the teacher · what we worked on, next steps</label><textarea id="tcN" rows="5" style="width:100%;margin-top:4px"></textarea></div></div>'
      + '<button class="btn teal block" id="tcS" style="margin-top:12px" onclick="trCoachSave()">Book coaching</button>'); window._tcMode = 0; };
  window.trCoachMode = m => { window._tcMode = m; $('tcB').classList.toggle('on', !m); $('tcL').classList.toggle('on', !!m); $('tcBk').classList.toggle('hide', !!m); $('tcLg').classList.toggle('hide', !m); $('tcS').textContent = m ? 'Save coaching' : 'Book coaching'; };
  window.trCoachSave = async function(){ const v = id => ($(id) || {}).value || '', t = v('tcT'), p = v('tcP').trim(), d = v('tcD'); if(!t || !p) return toast('Choose the teacher and write the topic'); if(!d) return toast('Pick the date');
    const b = $('tcS'); b.disabled = true; try{
      if(window._tcMode) await call('rec_add', { teacher: t, training_id: 'coach', status: 'done', via: 'live', done_at: d + ':00+08:00', note: p + (v('tcN').trim() ? ' — ' + v('tcN').trim() : '') });
      else await call('sess_set', { s: { training_id: 'coach', starts_at: d + ':00+08:00', mins: +v('tcM') || 30, facilitator: (D.me || {}).name || '', meet_url: v('tcU'), note: p, invited: [t] } });
      toast(window._tcMode ? 'Coaching saved ✓' : 'Coaching booked ✓ · ' + t + ' sees it on Trainings'); closeSheet(); await loadAll(true); paintAll(); }catch(x){ toast(x.message); b.disabled = false; } };
  window.trCoachDone = function(sid){ const s = (AL.sessions || []).find(x => x.id === sid); if(!s) return; const t = (s.invited || [])[0] || '';
    openSheet('<h1>Coaching done</h1><div class="mute small">' + e(tName(t)) + ' · ' + e(s.note || '') + ' · ' + e(fmtDT(s.starts_at)) + '</div><div class="card" style="margin-top:12px"><label class="small mute">Notes for the teacher · what we worked on, next steps</label><textarea id="tcN2" rows="6" style="width:100%;margin-top:4px"></textarea></div>'
      + '<button class="btn teal block" id="tcS2" style="margin-top:12px" onclick="trCoachDoneSave(' + sid + ')">Save</button>'); };
  window.trCoachDoneSave = async function(sid){ const s = (AL.sessions || []).find(x => x.id === sid); if(!s) return; const b = $('tcS2'); b.disabled = true; const n = (($('tcN2') || {}).value || '').trim();
    try{ for(const t of (s.invited || [])) await call('rec_add', { teacher: t, training_id: 'coach', status: 'done', via: 'live', done_at: s.starts_at, note: (s.note || 'Coaching') + (n ? ' — ' + n : '') });
      await call('sess_set', { s: Object.assign({}, s, { status: 'done' }) }); toast('Saved ✓'); closeSheet(); await loadAll(true); paintAll(); }catch(x){ toast(x.message); b.disabled = false; } };`);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
