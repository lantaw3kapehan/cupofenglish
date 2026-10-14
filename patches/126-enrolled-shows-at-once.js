// 14 Oct night · After Enrolled · paid is saved, the trial shows "Enrolled" at once (Misty: Ying still said "Thinking it
// over"). The trial's follow-up is set to Enrolling (TR-DATA › Follow-up, which the TODAY tab and Trials read), and the
// Trials list counts a trial as enrolled as soon as the app knows the save went through.
require('../tools/lib.js')(process.argv[2], [
["try{ const r = await api('mgmtEnrolPaid', TOKEN, f); if(!r || !r.ok) throw r; AT = null; MS = null;",
 "try{ const r = await api('mgmtEnrolPaid', TOKEN, f); if(!r || !r.ok) throw r; AT = null; MS = null; try{ enDoneFu(S.code, S.name, r); }catch(e){}"],
["window.enOth = function(){",
 "window.enDoneFu = function(code, name, r){ const T = (typeof TRL !== 'undefined' && TRL && TRL.rows) || [], up = s => String(s || '').toUpperCase();\n" +
 "  const t = T.filter(x => up(x.code) === up(code)).sort((a, b) => String(b.date).localeCompare(String(a.date)))[0]; if(!t) return;\n" +
 "  const k = t.date + '|' + tfuFirst(t.student), note = (r.transfer ? r.carried + ' lessons transferred' : (r.pkg + (r.free ? '+' + r.free : '')) + ' paid') + ' · ACTIVE row ' + r.row, now = new Date();\n" +
 "  TFU[k] = { st: 'Enrolling', note: note, by: (D && D.me && D.me.name) || '', at: ymdLocal(now) + ' ' + now.toTimeString().slice(0, 5) }; try{ localStorage.setItem('coe.tfu', JSON.stringify(TFU)); }catch(e){}\n" +
 "  try{ if(VIEW === 'trials') renderTP(); if(VIEW === 'mtoday') renderMToday(); }catch(e){}\n" +
 "  api('mgmtTrialFu', TOKEN, k, 'Enrolling', note, t.student).then(x => { if(x && x.fu){ TFU[k] = x.fu; try{ localStorage.setItem('coe.tfu', JSON.stringify(TFU)); }catch(e){} } }).catch(() => {}); };\n" +
 "window.enOth = function(){"],
]);
