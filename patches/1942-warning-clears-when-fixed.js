// 1942: (Misty, 9 Nov 10:32) Julia's Today kept showing "Final warning · 2 issues" from the 11–17 Oct class visits,
//   although every later visit (24, 27, 29 Oct) rated Presence OK and the follow-up "Improved".
//   · Visits are ordered by when they were reviewed (not the class date), and the same class reviewed twice counts once.
//   · "Not fixed" (follow-up Partly / Not yet) clears once a later review says the follow-up "Improved".
//   · "Same issue" (an area marked Needs work twice) clears once the newest review of that area rates it OK or Strong.
//   · A follow-up plan the teacher sent (last 30 days) that already lists every current item keeps the card in its quiet green
//     "plan sent" form: it does not come back red every few days for the same items.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["    const V = (visits || []).slice().sort((a, b) => String(b.date).localeCompare(String(a.date)));",
   "    const rt = v => (+v.id > 1e11 ? +v.id : 0) || tms(v.date + ' ' + (v.time || ''));   /* 1942: when it was reviewed */\n" +
   "    const V = (() => { const seen = {}; return (visits || []).slice().sort((a, b) => rt(b) - rt(a)).filter(v => { const k = [v.date, v.time, v.code || v.student].join('|'); if(seen[k]) return false; seen[k] = 1; return true; }); })();   /* 1942: one class reviewed twice counts once */"],
  ["      if(m){ const w = m[3] === 'Not yet' ? 1 : 0.5; repeat += w;",
   "      if(m && V.some(y => rt(y) > rt(v) && /Follow-up:\\s*Improved/i.test(String(y.checks || '') + ' ' + String(y.note || '')))) return;   /* 1942: improved since */\n" +
   "      if(m){ const w = m[3] === 'Not yet' ? 1 : 0.5; repeat += w;"],
  ["    Object.keys(area).forEach(k => { if(area[k].length >= 2){",
   "    const fixedNow = k => { const y = V.find(x => new RegExp('(^|· )' + k.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&') + ':\\\\s*').test(String(x.checks || ''))); if(!y) return false; const s = (String(y.checks).split(' · ').find(c => c.indexOf(k + ':') === 0) || ''); return !/(Needs work|Not yet)$/.test(s.trim()); };   /* 1942: the newest review of that area */\n" +
   "    Object.keys(area).forEach(k => { if(area[k].length >= 2 && !fixedNow(k)){"],
  ["      if(P.length){ sent = true; plan = { at: P[0] }; } }catch(e){} }",
   "      if(P.length){ sent = true; plan = { at: P[0] }; } }catch(e){} }\n" +
   "    if(!sent){ try{ const Q = ((TMSG && TMSG.threads) || []).map(t => t.root).filter(r => r && r.role !== 'mgmt' && /^⚠ My follow-up plan/.test(String(r.text || '')) && Date.now() - tms(r.at) < 30 * DAY);   /* 1942: a plan that already covers every item */\n" +
   "      const cov = Q.find(r => R.items.every(x => String(r.text).indexOf(x.text) >= 0)); if(cov){ sent = true; plan = { at: tms(cov.at) }; } }catch(e){} }"]
]);
