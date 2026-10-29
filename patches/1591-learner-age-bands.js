// 1591: (Misty 10:41) learner type = the partner portal's four age bands, English only: Early Years 2–6 · Young Learners 7–12 · Teens 13–17 · Adults 18+.
// · Detected from age first: birthdate (always current), else the AGE column moved on by the years since the DATABASE trial date; then the
//   trial report → course → grade (K / preschool → Early Years, G1–G6 → Young Learners, G7–G12 → Teens, university → Adults) → student list.
//   An explicit learner type passed by a dialog caller still wins. Unknown → "Type?" + the App health line (wording updated).
// · Chips (list rows, card header) and the Learner filter: All · Early Years · Young Learners · Teens · Adults with counts; "· IELTS" and PH kept.
//   Colours = the partner portal's band colours. A remembered old filter "yle" falls back to All.
// · Dialogs keep their categories: Early Years / Young Learners → the kids path, Teens → teens, Adults → the adult types (coeLearner.kind / .adult).
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
 [
  "      const b = String(r[5] || ''); if(/^\\d{4}-\\d{2}-\\d{2}/.test(b)){ const d = new Date(b.slice(0, 10) + 'T00:00:00'), n = new Date(); let a = n.getFullYear() - d.getFullYear(); if(n.getMonth() < d.getMonth() || (n.getMonth() === d.getMonth() && n.getDate() < d.getDate())) a--; if(a >= 2 && a < 100) o.age = a; }",
  "      const b = String(r[5] || ''); if(/^\\d{4}-\\d{2}-\\d{2}/.test(b)){ const d = new Date(b.slice(0, 10) + 'T00:00:00'), n = new Date(); let a = n.getFullYear() - d.getFullYear(); if(n.getMonth() < d.getMonth() || (n.getMonth() === d.getMonth() && n.getDate() < d.getDate())) a--; if(a >= 0 && a < 100){ o.age = a; o.ageFrom = 'birthdate'; } }   /* 1591: birthdate first, always current */"
 ],
 [
  "      if(o.age == null && +r[6] > 0) o.age = +r[6]; }",
  "      if(o.age == null && +r[6] > 0){ let a = +r[6]; const t = String(r[10] || ''); if(/^\\d{4}-\\d{2}-\\d{2}/.test(t)){ const yrs = Math.floor((Date.now() - new Date(t.slice(0, 10) + 'T00:00:00').getTime()) / 31557600000); if(yrs > 0 && yrs < 20) a += yrs; } o.age = a; o.ageFrom = 'age'; } }   /* 1591: the AGE column, moved on by the years since the DATABASE trial date */"
 ],
 [
  "    const g = hint.group || trialGroup(code);\n    if(g && !/pick/i.test(g)){ o.group = g; o.adult = /^adult/i.test(g); o.kind = o.adult ? 'adult' : /teen/i.test(g) ? 'teen' : 'kid'; o.from = 'trial report'; }\n    else if(AD.test(c)){ o.adult = true; o.kind = 'adult'; o.from = 'course'; }\n    else if(KID.test(c)){ o.adult = false; o.kind = o.age != null && o.age >= 11 ? 'teen' : 'kid'; o.from = 'course'; }\n    else if(/^(WA|UM|U\\d|PhD|ADULT)$/i.test(o.grade) || (o.age != null && o.age >= 18 && !/^(G\\d+|GK)$/i.test(o.grade))){ o.adult = true; o.kind = 'adult'; o.from = 'age'; }\n    else if(o.age != null || /^(G\\d+|GK)$/i.test(o.grade)){ o.adult = false; o.kind = o.age != null && o.age <= 10 ? 'kid' : 'teen'; o.from = 'age'; }\n    else if(s && s.adult != null){ o.adult = !!s.adult; o.kind = s.adult ? 'adult' : ''; o.from = 'student list'; }\n",
  "    const g = hint.group || trialGroup(code); if(g && !/pick/i.test(g)) o.group = g;\n    /* 1591 · four bands (same as the partner portal): Early Years 2–6 · Young Learners 7–12 · Teens 13–17 · Adults 18+.\n       Order: a learner type passed in by the caller → age (birthdate, else AGE) → trial report → course → grade → student list. */\n    const byAge = a => a <= 6 ? 'early' : a <= 12 ? 'young' : a <= 17 ? 'teen' : 'adult';\n    const byGrp = x => /^adult/i.test(x) ? 'adult' : /teen/i.test(x) ? 'teen' : 'young';\n    const gr = o.grade, gn = (gr.match(/^G\\s*(\\d{1,2})$/i) || [])[1];\n    let band = '';\n    if(hint.group && !/pick/i.test(hint.group)){ band = byGrp(hint.group); o.from = 'trial report'; }\n    else if(o.age != null && o.age > 0){ band = byAge(o.age); o.from = o.ageFrom === 'birthdate' ? 'birthdate' : 'age'; }\n    else if(o.group){ band = byGrp(o.group); o.from = 'trial report'; }\n    else if(AD.test(c)){ band = 'adult'; o.from = 'course'; }\n    else if(KID.test(c)){ band = 'young'; o.from = 'course'; }\n    else if(/^(GK|K\\d?|KG|PK|Pre-?K|Nursery|Preschool|Kinder(garten)?)$/i.test(gr)){ band = 'early'; o.from = 'grade'; }\n    else if(gn && +gn >= 1 && +gn <= 6){ band = 'young'; o.from = 'grade'; }\n    else if(gn && +gn >= 7 && +gn <= 12){ band = 'teen'; o.from = 'grade'; }\n    else if(/^(WA|UM|U\\d|PhD|ADULT|College|University)$/i.test(gr)){ band = 'adult'; o.from = 'grade'; }\n    else if(s && s.adult != null){ band = s.adult ? 'adult' : ''; o.from = 'student list'; }\n    o.band = band; o.adult = band ? band === 'adult' : null; o.kind = band === 'adult' ? 'adult' : band === 'teen' ? 'teen' : band ? 'kid' : '';\n    o.bandLabel = { early: 'Early Years', young: 'Young Learners', teen: 'Teens', adult: 'Adults' }[band] || '';\n"
 ],
 [
  "  window.learnerTag1588 = function(code){ const L = coeLearner(code), ie = L.exam === 'ielts';\n    const k = L.kind === 'kid' ? 'yle' : L.kind === 'teen' ? 'teen' : L.kind === 'adult' ? 'adult' : 'unk';\n    const t = k === 'yle' ? 'YLE' : k === 'teen' ? 'Teens' : k === 'adult' ? 'Adults' : 'Type?';\n    const sub = k === 'adult' && L.goal !== 'daily' ? ' · ' + L.goal : '';\n    const title = k === 'unk' ? 'Learner type not known yet: set it on the trial report, or add the age / course on DATABASE' : t + (ie ? ' · IELTS' : sub) + ' · from the ' + (L.from || 'records');\n    return { k, html: '<span class=\"lt1588 ' + k + '\" data-lt=\"' + E(up(code)) + '\" title=\"' + E(title) + '\">' + t + (ie && k !== 'unk' ? ' · IELTS' : '') + (L.market === 'ph' ? ' <i class=\"ph\">PH</i>' : '') + '</span>' }; };",
  "  window.learnerTag1588 = function(code){ const L = coeLearner(code), ie = L.exam === 'ielts';   /* 1591: the four bands */\n    const k = L.band || 'unk', t = L.bandLabel || 'Type?';\n    const sub = k === 'adult' && L.goal !== 'daily' ? ' · ' + L.goal : '';\n    const why = { birthdate: 'age from the birthdate', age: 'the AGE column', 'trial report': 'the trial report', course: 'the course', grade: 'the grade', 'student list': 'the student list' }[L.from] || 'the records';\n    const title = k === 'unk' ? 'Learner type not known yet: add the birthdate or age on DATABASE, or set it on the trial report' : t + (ie ? ' · IELTS' : sub) + (L.age != null && (L.from === 'birthdate' || L.from === 'age') ? ' · ' + L.age + ' yrs' : '') + ' · from ' + why;\n    return { k, html: '<span class=\"lt1588 ' + k + '\" data-lt=\"' + E(up(code)) + '\" title=\"' + E(title) + '\">' + t + (ie && k !== 'unk' ? ' · IELTS' : '') + (L.market === 'ph' ? ' <i class=\"ph\">PH</i>' : '') + '</span>' }; };"
 ],
 [
  ".lt1588.yle{background:#EAF1FC;color:#2B5BA8}.lt1588.teen{background:#E4F4F1;color:#0F6A64}.lt1588.adult{background:#F3ECF9;color:#6A3A92}",
  ".lt1588.early{background:#FFF0D2;color:#7A4A00}.lt1588.young{background:#E7F5EE;color:#1F7A55}.lt1588.teen{background:#E6EEFB;color:#2456A6}.lt1588.adult{background:var(--coe-mgmt-bg,#EEEAF8);color:var(--coe-mgmt-fg,#5B4B9E)}.lt1588.yle{background:#E7F5EE;color:#1F7A55}"
 ],
 [
  "#v-astudents[data-ltf=\"yle\"] a.li.sa:not(:has(.lt1588.yle)),#v-astudents[data-ltf=\"teen\"] a.li.sa:not(:has(.lt1588.teen)),#v-astudents[data-ltf=\"adult\"] a.li.sa:not(:has(.lt1588.adult)){display:none!important}",
  "#v-astudents[data-ltf=\"early\"] a.li.sa:not(:has(.lt1588.early)),#v-astudents[data-ltf=\"young\"] a.li.sa:not(:has(.lt1588.young)),#v-astudents[data-ltf=\"teen\"] a.li.sa:not(:has(.lt1588.teen)),#v-astudents[data-ltf=\"adult\"] a.li.sa:not(:has(.lt1588.adult)){display:none!important}"
 ],
 [
  "OPT = [['', 'All'], ['yle', 'YLE'], ['teen', 'Teens'], ['adult', 'Adults']];",
  "OPT = [['', 'All'], ['early', 'Early Years'], ['young', 'Young Learners'], ['teen', 'Teens'], ['adult', 'Adults']];"
 ],
 [
  "const n = { '': rows.length, yle: 0, teen: 0, adult: 0 }; rows.forEach(r => { const c = r.querySelector('.lt1588'); if(!c) return; ['yle', 'teen', 'adult'].forEach(",
  "const n = { '': rows.length, early: 0, young: 0, teen: 0, adult: 0 }; rows.forEach(r => { const c = r.querySelector('.lt1588'); if(!c) return; ['early', 'young', 'teen', 'adult'].forEach("
 ],
 [
  "'Learner type not known (YLE / Teens / Adults) · '",
  "'Learner type not known (Early Years / Young Learners / Teens / Adults) · '"
 ],
 [
  " · set it on the trial report or add the age / course on DATABASE');",
  " · add the birthdate or age on DATABASE, or set it on the trial report');"
 ]
]);
