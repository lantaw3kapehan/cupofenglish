// 678: (Misty) Trainings — faster ticking for management, and teachers see ticks within a minute.
//  · Tap a column heading → tick that training for many teachers at once (date, how; "Select all").
//  · On a teacher's path (tap the name) → "Mark everything up to …" in one go (done before the app).
//  · A teacher who has Trainings open refreshes it every minute while the screen is visible.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const rep = (a, b) => { if (s.split(a).length !== 2) { console.error('not unique: ' + a.slice(0, 90)); process.exit(1); } s = s.replace(a, b); };
rep("M.map(t => '<th>' + (short[t.id] || e(t.title)) + '</th>').join('')",
    "M.map(t => '<th class=\"c\" style=\"cursor:pointer\" title=\"Tick many teachers\" onclick=\"trCol(\\'' + t.id + '\\')\">' + (short[t.id] || e(t.title)) + ' <span style=\"color:#00A3AD\">✓</span></th>').join('')");
rep("+ '<h2>CupOfEnglish Way</h2>' + partsOf(TV, 'way')",
    "+ trUpTo(name) + '<h2>CupOfEnglish Way</h2>' + partsOf(TV, 'way')");
rep("try{ await loadMy(force); paintMy(); paintBanner(); }",
    "try{ await loadMy(force); paintMy(); paintBanner(); if(!window._trLive){ window._trLive = setInterval(() => { if(VIEW === 'train' && document.visibilityState === 'visible' && !$('sheet').classList.contains('on')) loadMy(true).then(paintMy).catch(() => {}); }, 60000); } }");
rep("  /* trainings list: parts, videos, quizzes */",
`  /* 678 · quick ticking */
  const today8 = () => new Date(Date.now() + 8 * 3600e3).toISOString().slice(0, 10);
  const howSel = id => '<select id="' + id + '" style="width:100%;margin:4px 0 10px"><option value="grandfathered">Done before the app</option><option value="live">Attended live</option><option value="recording">Recording + reflection</option><option value="manual">Other</option></select>';
  async function many(rows, btn){ let n = 0, bad = 0; for(let i = 0; i < rows.length; i += 5){ await Promise.all(rows.slice(i, i + 5).map(r => call('rec_add', r).then(() => n++).catch(() => bad++))); if(btn) btn.textContent = 'Saving ' + n + ' / ' + rows.length + '…'; } return { n, bad }; }
  window.trCol = function(id){ const d = AL, t = (d.trainings || []).find(x => x.id === id); if(!t) return; const T = teachers();
    const done = n => ['done', 'excused'].includes((latestRec(d.records, n, id) || {}).status);
    openSheet('<h1>' + e(t.title) + '</h1><div class="mute small">Tick it for many teachers at once · kept permanently</div><div class="card" style="margin-top:12px"><label class="small mute">Date</label><input type="date" id="tcD" value="' + today8() + '" style="width:100%;margin:4px 0 10px"><label class="small mute">How</label>' + howSel('tcV') + '</div>'
      + '<div class="row" style="margin:12px 0 4px"><b class="grow">Teachers</b><a class="link small" onclick="document.querySelectorAll(\\'.tcI:not(:disabled)\\').forEach(x => x.checked = true)">Select all</a></div>'
      + T.map(x => '<label class="trm-it" style="cursor:pointer"><span>' + e(tName(x.name)) + ' <small style="display:inline">' + e(x.rank || '') + '</small>' + (done(x.name) ? ' <small style="display:inline;color:#00737B">· ✓ already</small>' : '') + '</span><input type="checkbox" class="tcI" value="' + e(x.name) + '"' + (done(x.name) ? ' disabled' : '') + '></label>').join('')
      + '<button class="btn teal block" id="tcS" style="margin-top:12px" onclick="trColSave(\\'' + id + '\\')">✓ Tick selected</button>'); };
  window.trColSave = async function(id){ const L = [...document.querySelectorAll('.tcI:checked')].map(x => x.value); if(!L.length) return toast('Select teachers'); const b = $('tcS'); b.disabled = true;
    const dd = $('tcD').value, via = $('tcV').value; const r = await many(L.map(n => ({ teacher: n, training_id: id, status: 'done', via, done_at: dd ? dd + 'T12:00:00+08:00' : null })), b);
    toast(r.n + ' ticked ✓' + (r.bad ? ' · ' + r.bad + ' not saved, try again' : '')); closeSheet(); await loadAll(true); paintAll(); };
  window.trUpTo = function(name){ const d = AL || TV; if(!d) return ''; const M = (d.trainings || []).filter(t => t.kind === 'mandatory').sort((a, b) => a.sort - b.sort);
    return '<div class="card" style="margin:12px 0"><b>Mark everything up to</b><div class="small mute">Ticks every training up to the one you choose that is not done yet</div><select id="tuT" style="width:100%;margin:8px 0">' + M.map(t => '<option value="' + t.id + '">' + e(t.title) + ' · ' + e(t.gate) + '</option>').join('') + '</select>'
      + '<div class="row" style="gap:8px"><input type="date" id="tuD" value="' + today8() + '" style="flex:1"><select id="tuV" style="flex:1"><option value="grandfathered">Done before the app</option><option value="live">Attended live</option><option value="manual">Other</option></select></div>'
      + '<button class="btn teal block" id="tuS" style="margin-top:10px" onclick="trUpToSave(\\'' + e(name) + '\\')">✓ Mark done</button></div>'; };
  window.trUpToSave = async function(name){ const d = AL || TV, M = (d.trainings || []).filter(t => t.kind === 'mandatory').sort((a, b) => a.sort - b.sort), upto = $('tuT').value, k = M.findIndex(t => t.id === upto);
    const recs = (TV && TV.records) || d.records || [], todo = M.slice(0, k + 1).filter(t => !['done', 'excused'].includes((latestRec(recs, name, t.id) || {}).status)); if(!todo.length) return toast('All already done');
    const b = $('tuS'); b.disabled = true; const dd = $('tuD').value, via = $('tuV').value;
    const r = await many(todo.map(t => ({ teacher: name, training_id: t.id, status: 'done', via, done_at: dd ? dd + 'T12:00:00+08:00' : null })), b);
    toast(r.n + ' ticked ✓'); closeSheet(); await loadAll(true); paintAll(); };
  /* trainings list: parts, videos, quizzes */`);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
