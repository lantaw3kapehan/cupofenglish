// 699: (Misty) 1) A teacher already teaching a book without formal training (Julia · Pathways): management records it as
// "Recognized · already teaching it" — she gets the badge, the history says why. 2) Teachers who facilitate trainings (Pam, Kat, April):
// a "Trains …" badge per training they facilitated (from sessions, and from management's tick for ones before the app, where
// "Facilitate one training" now asks which training). Facilitating still counts for Master.
require('../tools/lib.js')(process.argv[2], [
["grandfathered: 'Recorded from before the app'", "grandfathered: 'Recorded from before the app', recognized: 'Recognized · already teaching it'"],
[`<select id="trCv" style="width:100%;margin:4px 0 10px"><option value="live">Attended live</option><option value="grandfathered">Done before the app</option>`,
 `<select id="trCv" style="width:100%;margin:4px 0 10px">' + (t.kind === 'unlock' ? '<option value="recognized">Recognized · already teaching it</option>' : '') + '<option value="live">Attended live</option><option value="grandfathered">Done before the app</option>`],
[`+ '<label class="small mute">Note (optional)</label><input id="trCn" style="width:100%;margin-top:4px"></div>'`,
 `+ (id === 'facil' ? '<label class="small mute">Which training did they facilitate?</label><select id="trCf" style="width:100%;margin:4px 0 10px">' + (d.trainings || []).filter(x => x.id !== 'facil' && x.kind !== 'selfstudy').sort((a, b) => a.sort - b.sort).map(x => '<option value="' + x.id + '">' + e(x.title) + '</option>').join('') + '</select><div class="small mute" style="margin:-4px 0 10px">Tick again for each training they facilitate · each one shows as a "Trains …" badge</div>' : '')
      + '<label class="small mute">Note (optional)</label><input id="trCn" style="width:100%;margin-top:4px"></div>'`],
["await call('rec_add', { teacher: name, training_id: id, status: status || 'done', via: via || v0 || 'manual', note: n0 || '',",
 "const f0 = id === 'facil' && ($('trCf') || {}).value; await call('rec_add', { teacher: name, training_id: id, status: status || 'done', via: via || v0 || 'manual', note: f0 ? 'Facilitated ' + f0 + (n0 ? ' — ' + n0 : '') : n0 || '',"],
[`<option value="grandfathered">Done before the app</option><option value="live">Attended live</option><option value="recording">Recording + reflection</option><option value="manual">Other</option></select>';`,
 `<option value="grandfathered">Done before the app</option><option value="recognized">Recognized · already teaching it</option><option value="live">Attended live</option><option value="recording">Recording + reflection</option><option value="manual">Other</option></select>';`],
[`      + (D0.length ? '<div class="tx-bdg">' + D0.map(t => '<span style="--c:' + (BGC[BG(t)] || '#9A97AE') + '" title="' + e(BG(t)) + '">' + (BG(t) === 'Specializations' ? '★ ' : '') + e(lab(t)) + '</span>').join('') + '</div>' :`,
 `      + (D0.length || TRN(d, who).length ? '<div class="tx-bdg">' + D0.map(t => '<span style="--c:' + (BGC[BG(t)] || '#9A97AE') + '" title="' + (t.id !== 'trial' && (latestRec(d.records, who, t.id) || {}).via === 'recognized' ? 'Recognized · already teaching it' : e(BG(t))) + '">' + (BG(t) === 'Specializations' ? '★ ' : '') + e(lab(t)) + '</span>').join('') + TRN(d, who).map(x => '<span style="--c:#00737B;background:#EEF8F7" title="Facilitates this training">Trains ' + e(x) + '</span>').join('') + '</div>' :`],
["  function profHtml(d, who, rank){", `  /* 699: trainings this teacher has facilitated (done sessions + management's ticks) */
  function TRN(d, who){ const T = id => ((d.trainings || []).find(t => t.id === id) || {}).title, S = new Set();
    (d.sessions || []).forEach(s => { if(s.facilitator === who && s.status === 'done' && s.training_id !== 'coach') S.add(s.training_id); });
    (d.records || []).forEach(r => { const m = r.teacher === who && r.training_id === 'facil' && r.status === 'done' && /^Facilitated (\\S+)/.exec(r.note || ''); if(m && m[1] !== 'coach') S.add(m[1]); });
    return [...S].map(T).filter(Boolean).map(t => t.split(' · ')[0].replace(/ Specialization$/, '')); }
  function profHtml(d, who, rank){`],
]);
