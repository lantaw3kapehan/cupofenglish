// 721: (Misty) Coaching — upload the recording straight into the app (private storage, plays inside the app; only that teacher and
// management can open it) and a record of how many coachings each teacher has had. Teacher: "Coaching · 3 sessions · last 21 Oct" on
// their Trainings. Management: a "Coaching" tile (total sessions) → per-teacher count and last date; on a teacher's path "Coaching · n";
// "+ Recording" adds or replaces the recording of a coaching already logged. Drive links still work.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const rep = (a, b) => { if (s.split(a).length !== 2) { console.error('not unique: ' + a.slice(0, 90)); process.exit(1); } s = s.replace(a, b); };
const R = String.raw;

// the note also keeps "§file:<path>" (an uploaded recording)
rep(R`v = (t.match(/\n§video:(.*)/) || [])[1] || ''; t = t.replace(/\n§(coach|video):.*/g, ''); const m = t.split(' — '); return { topic: m[0] || '', notes: m.slice(1).join(' — '), coach: c.trim(), video: v.trim() }; };`,
    R`v = (t.match(/\n§video:(.*)/) || [])[1] || '', f = (t.match(/\n§file:(.*)/) || [])[1] || ''; t = t.replace(/\n§(coach|video|file):.*/g, ''); const m = t.split(' — '); return { topic: m[0] || '', notes: m.slice(1).join(' — '), coach: c.trim(), video: v.trim(), file: f.trim() }; };`);
rep(R`const packN = (topic, notes, coach, video) => (topic || 'Coaching') + (notes ? ' — ' + notes : '') + (coach ? '\n§coach:' + coach : '') + (video ? '\n§video:' + video : '');`,
    R`const packN = (topic, notes, coach, video, file) => (topic || 'Coaching') + (notes ? ' — ' + notes : '') + (coach ? '\n§coach:' + coach : '') + (file ? '\n§file:' + file : video ? '\n§video:' + video : '');`);

// list: watch (uploaded or link) · management: + Recording
rep(R`(/^https?:\/\//.test(x.video) ? '<a class="btn sm teal" style="margin-top:8px" href="' + e(x.video) + '" target="_blank" rel="noopener">▶ Watch the recording</a>' : '') + '</span></div>'; }).join(''))`,
    R`'<div class="row" style="gap:6px;margin-top:8px;flex-wrap:wrap">' + (x.file ? '<button class="btn sm teal" onclick="trCoachPlay(' + r.id + ')">▶ Watch the recording</button>' : /^https?:\/\//.test(x.video) ? '<a class="btn sm teal" href="' + e(x.video) + '" target="_blank" rel="noopener">▶ Watch the recording</a>' : '') + (D.mgr ? '<button class="btn sm ghost" onclick="trCoachRec(' + r.id + ')">' + (x.file || x.video ? 'Replace recording' : '+ Recording') + '</button>' : '') + '</div></span></div>'; }).join(''))`);

// teacher card: the count
rep(R`return '<section class="tx-card"><div class="tx-h"><b>Coaching</b><span>1:1 with management</span></div>' + coachList(d, who) + '</section>'; };`,
    R`return '<section class="tx-card"><div class="tx-h"><b>🎯 Coaching</b><span>' + coachSum(d, who) + '</span></div>' + coachList(d, who) + '</section>'; };
  function coachSum(d, who){ const P = coachRecs(d, who); return P.length ? P.length + (P.length === 1 ? ' session' : ' sessions') + ' · last ' + fmtD(P[0].done_at) : '1:1 with management'; }
  window.coachSum = coachSum;
  /* 721: upload a coaching recording (returns the storage path, or '' when no file was chosen) */
  async function coachFile(inp, teacher, prog){ const f = (($(inp) || {}).files || [])[0]; if(!f) return '';
    const P = $(prog), u = await call('coach_upload_url', { teacher, name: f.name });
    await new Promise((ok, no) => { const x = new XMLHttpRequest(); x.open('PUT', u.url); x.setRequestHeader('Content-Type', f.type || 'video/mp4'); x.setRequestHeader('x-upsert', 'true');
      x.upload.onprogress = ev => { if(ev.lengthComputable && P) P.textContent = 'Uploading ' + Math.round(ev.loaded / ev.total * 100) + '% · keep this open'; };
      x.onload = () => { if(x.status < 300) return ok(); let m = ''; try{ const j = JSON.parse(x.responseText); m = j.message || j.error || ''; }catch(y){} no(new Error(/exceed|too large|size/i.test(m) || x.status === 413 ? 'The video is bigger than the upload limit (' + Math.round(f.size / 1048576) + ' MB). Export it smaller, or paste a Drive link instead.' : 'Upload failed (' + x.status + ')' + (m ? ': ' + m : ''))); };
      x.onerror = () => no(new Error('Upload failed · check the internet and try again')); x.send(f); });
    if(P) P.textContent = 'Uploaded ✓'; return u.path; }
  const fileIn = (id, pid) => '<label class="small mute">Or upload the recording (MP4 · stays private: only this teacher and management)</label><input type="file" id="' + id + '" accept="video/mp4,video/webm,video/quicktime" style="width:100%;margin-top:4px"><div id="' + pid + '" class="small mute" style="margin-top:4px"></div>';
  window.trCoachPlay = async function(id){ try{ const r = await call('coach_video', { id }); openSheet('<h1>Coaching recording</h1><video src="' + e(r.url) + '" controls playsinline style="width:100%;margin-top:12px;border-radius:14px;background:#000"></video>'); }catch(x){ toast(x.message); } };
  window.trCoachRec = function(id){ openSheet('<h1>Coaching recording</h1><div class="card" style="margin-top:12px">' + fileIn('tcF3', 'tcFP3') + '<label class="small mute" style="display:block;margin-top:12px">Or a link (e.g. Google Drive, shared with the teacher)</label><input id="tcV3" placeholder="https://…" style="width:100%;margin-top:4px"></div><button class="btn teal block" id="tcS3" style="margin-top:12px" onclick="trCoachRecSave(' + id + ')">Save</button>'); };
  window.trCoachRecSave = async function(id){ const b = $('tcS3'), r = ((AL && AL.records) || (TV && TV.records) || []).find(x => x.id === id) || {}; b.disabled = true;
    try{ const path = await coachFile('tcF3', r.teacher || 'coach', 'tcFP3'), url = (($('tcV3') || {}).value || '').trim(); if(!path && !/^https?:\/\//.test(url)){ b.disabled = false; return toast('Choose a video or paste a link'); }
      await call('coach_attach', { id, path, url }); toast('Recording saved ✓ · the teacher can watch it'); closeSheet(); await loadAll(true); paintAll(); }catch(x){ toast(x.message); b.disabled = false; } };
  /* 721: management · per-teacher coaching record */
  function coachRows(d, T){ return T.map(x => ({ n: x.name, P: coachRecs(d, x.name) })).sort((a, b) => b.P.length - a.P.length || String(a.n).localeCompare(b.n))
      .map(o => '<div class="trm-it"><span><b class="link" onclick="closeSheet();trView(\'' + e(o.n) + '\')">' + e(tName(o.n)) + '</b><small>' + (o.P.length ? o.P.length + (o.P.length === 1 ? ' session' : ' sessions') + ' · last ' + e(fmtD(o.P[0].done_at)) + ' · ' + e(splitN(o.P[0].note).topic) : 'No coaching yet') + '</small></span><button class="btn sm ghost" onclick="trCoach(\'' + e(o.n) + '\')">+ Coaching</button></div>').join(''); }
  window._coachRows = coachRows;`);

// log form + done form: upload field
rep(R`<input id="tcV" placeholder="https://…" style="width:100%;margin-top:4px"></div></div>'`,
    R`<input id="tcV" placeholder="https://…" style="width:100%;margin:4px 0 10px">' + fileIn('tcF', 'tcFP') + '</div></div>'`);
rep(R`if(window._tcMode) await call('rec_add', { teacher: t, training_id: 'coach', status: 'done', via: 'live', done_at: d + ':00+08:00', note: packN(p, v('tcN').trim(), v('tcC'), v('tcV').trim()) });`,
    R`if(window._tcMode){ const fp = await coachFile('tcF', t, 'tcFP'); await call('rec_add', { teacher: t, training_id: 'coach', status: 'done', via: 'live', done_at: d + ':00+08:00', note: packN(p, v('tcN').trim(), v('tcC'), v('tcV').trim(), fp) }); }`);
rep(R`<input id="tcV2" placeholder="https://…" style="width:100%;margin-top:4px"></div>'`,
    R`<input id="tcV2" placeholder="https://…" style="width:100%;margin:4px 0 10px">' + fileIn('tcF2', 'tcFP2') + '</div>'`);
rep(R`try{ for(const t of (s.invited || [])) await call('rec_add'`, R`try{ const fp = await coachFile('tcF2', (s.invited || [])[0] || 'coach', 'tcFP2'); for(const t of (s.invited || [])) await call('rec_add'`);
rep(R`(($('tcV2') || {}).value || '').trim()) });`, R`(($('tcV2') || {}).value || '').trim(), fp) });`);

// management: Coaching tile + list; teacher path heading with the count
rep(R`const cnt = (k, lab, sub, warn) =>`, R`const CR = T.map(x => coachRecs(d, x.name).length), CT = CR.reduce((a, b) => a + b, 0); window._trLists.coach = ['Coaching record', [coachRows(d, T)], '<button class="btn teal" onclick="trCoach()">+ Coaching</button>'];
    const cnt = (k, lab, sub, warn) =>`);
rep(R`'<div class="tx-cnts">' + cnt('coming'`, R`'<div class="tx-cnts c5">' + cnt('coming'`);
rep(R`cnt('self', 'Self-study', 'model lessons · + add') + '</div>';`,
    R`cnt('self', 'Self-study', 'model lessons · + add') + '<button type="button" class="tx-cnt" onclick="trListOpen(\'coach\')"><span>Coaching</span><b>' + CT + '</b><small>sessions · ' + CR.filter(n => n).length + ' teachers coached</small></button></div>';`);
rep(R`+ trUpTo(name) + '<h2>Coaching</h2>' + coachList(TV, name)`, R`+ trUpTo(name) + '<h2>🎯 Coaching <span class="small mute" style="font-weight:400">· ' + coachSum(TV, name) + '</span></h2>' + coachList(TV, name)`);
// 5 tiles on a laptop
rep('.tx-cnts{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-top:14px}',
    '.tx-cnts{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-top:14px}.tx-cnts.c5{grid-template-columns:repeat(5,minmax(0,1fr))}@media(max-width:760px){.tx-cnts.c5{grid-template-columns:repeat(2,minmax(0,1fr))}}');
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
