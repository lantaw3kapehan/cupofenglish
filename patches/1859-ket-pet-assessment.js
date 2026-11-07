// 1859: (Misty 7 Nov "How about for PET, KET … following the PET assessment in speaking or writing, and KET" · "We plan to market this soon" ·
//   "ensure the criteria in scoring is updated and aligned with the global standard scoring of KET and PET" · build both · indicative CEFR only ·
//   the teacher is the partner in the paired parts)
//   · Walk-in test and online trials: a test choice — IELTS, KET (A2 Key) or PET (B1 Preliminary). New walk-in asks which; a trial booked with a
//     KET / PET book opens that test (any teacher, like IELTS).
//   · KET / PET follow the Cambridge format and assessment scales: Speaking parts (KET 2, PET 4) with the teacher as the partner; criteria 0–5
//     (KET: Grammar & Vocabulary, Pronunciation, Interactive Communication + Global Achievement; PET adds Discourse Management). Writing optional,
//     two parts (KET email + story: Content, Organisation, Language; PET email + article/story: + Communicative Achievement), each part on its own.
//   · The database averages the criteria and gives an indicative CEFR (band 3 = the exam's level). Result page, picture, her screen, essay page and
//     student portal follow the test.
const fs = require('fs'), path = require('path');
const lib = require('../tools/lib.js'), file = process.argv[2];
const INC = fs.readFileSync(path.join(__dirname, '1859-cam.inc.js'), 'utf8');
lib(file, [
  // the IELTS content becomes swappable
  ["  const Q_A = ['Could you introduce yourself", "  let Q_A = ['Could you introduce yourself"],
  ["  const CUE = { t: 'Describe a situation when you had difficulty", "  let CUE = { t: 'Describe a situation when you had difficulty"],
  ["  const Q_C = ['Why do some educated", "  let Q_C = ['Why do some educated"],
  ["  const ESSAY = 'Some people believe that universities should focus primarily", "  let ESSAY = 'Some people believe that universities should focus primarily"],
  ["  const SP = [['fc', 'Fluency and Coherence', 'Speaks at length", "  let SP = [['fc', 'Fluency and Coherence', 'Speaks at length"],
  ["  const WR = [['tr', 'Task Response', 'Discusses both views", "  let WR = [['tr', 'Task Response', 'Discusses both views"],
  ["  const BN = ['Did not attempt', 'Non-user'", "  let BN = ['Did not attempt', 'Non-user'"],
  ["  const GUIDE = [[4, 4.5, '4.0–4.5', 'Limited communication; frequent language difficulties', 'B1 range'], [5, 5.5, '5.0–5.5', 'Developing communication; noticeable limitations in accuracy and complexity', 'B1–B2'], [6, 6.5, '6.0–6.5', 'Generally effective communication; some inconsistencies', 'B2'], [7, 7.5, '7.0–7.5', 'Good command; can communicate complex ideas effectively', 'C1 range'], [8, 9, '8.0–9.0', 'Very good to expert command', 'C1–C2']];\n  const PATHS",
   "  let GUIDE = [[4, 4.5, '4.0–4.5', 'Limited communication; frequent language difficulties', 'B1 range'], [5, 5.5, '5.0–5.5', 'Developing communication; noticeable limitations in accuracy and complexity', 'B1–B2'], [6, 6.5, '6.0–6.5', 'Generally effective communication; some inconsistencies', 'B2'], [7, 7.5, '7.0–7.5', 'Good command; can communicate complex ideas effectively', 'C1 range'], [8, 9, '8.0–9.0', 'Very good to expert command', 'C1–C2']];\n  let PATHS"],
  ["  const DESC = {\"sp\":{\"fc\":{\"1\":\"No communication possible", "  let DESC = {\"sp\":{\"fc\":{\"1\":\"No communication possible"],
  ["  const CK = {\"sp\":{\"fc\":[[\"Speaks at length with little effort\"", "  let CK = {\"sp\":{\"fc\":[[\"Speaks at length with little effort\""],
  // the Cambridge block
  ["  const b1 = v => v == null || v === '' ? '—' : (+v).toFixed(1);\n  // ---------- nav ----------", "  const b1 = v => v == null || v === '' ? '—' : (+v).toFixed(1);\n" + INC + "  // ---------- nav ----------"],
  // list + new walk-in: which test
  ["IELTS-aligned diagnostic · Speaking (15 min, 3 parts) and Academic Writing Task 2 (40 min) · scored by the IELTS criteria · saved to the database as you go.",
   "IELTS, KET (A2 Key) or PET (B1 Preliminary) · Speaking and Writing, scored by that test’s official criteria · saved to the database as you go."],
  ["    return tg + chip0(a); }", "    const xg = a && a.exam && a.exam !== 'ielts' ? '<span class=\"as-k\" style=\"background:#FFF1E6;color:#9A4A12\">' + (a.exam === 'ket' ? 'KET · A2 Key' : 'PET · B1 Preliminary') + '</span>' : '';\n    return xg + tg + chip0(a); }"],
  ["<input class=\"as-in\" id=\"as-np\" placeholder=\"Purpose, e.g. IELTS plan, study abroad, work (optional)\"></div>",
   "<input class=\"as-in\" id=\"as-np\" placeholder=\"Purpose, e.g. IELTS plan, study abroad, work (optional)\"><select class=\"as-in\" id=\"as-nx\"><option value=\"ielts\">IELTS · Speaking + Academic Writing</option><option value=\"ket\">KET · Cambridge A2 Key</option><option value=\"pet\">PET · Cambridge B1 Preliminary</option></select></div>"],
  ["purpose: (document.getElementById('as-np') || {}).value || '' });", "purpose: (document.getElementById('as-np') || {}).value || '', exam: (document.getElementById('as-nx') || {}).value || 'ielts' });"],
  // scoring buttons, band guide, hints, summary
  ["[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => '<button class=\"' + (v[k] === n ? 'on' : '') + '\" onclick=\"as1778.band(", "RNG().map(n => '<button class=\"' + (v[k] === n ? 'on' : '') + '\" onclick=\"as1778.band("],
  ["'<details class=\"as-gd\"><summary>Band guide</summary>' + [9, 8, 7, 6, 5, 4, 3, 2, 1].map(", "'<details class=\"as-gd\"><summary>Band guide</summary>' + (CAMX() ? [5, 4, 3, 2, 1] : [9, 8, 7, 6, 5, 4, 3, 2, 1]).map("],
  ["'<div class=\"as-m\" style=\"padding:6px 10px 0\">Short guide in our own words from the public IELTS band descriptors. 0 = did not attempt.</div></details>'",
   "'<div class=\"as-m\" style=\"padding:6px 10px 0\">' + (CAMX() ? 'Short guide in our own words from the public Cambridge ' + CAMX().long + ' assessment scales. 0 = below band 1.' : 'Short guide in our own words from the public IELTS band descriptors. 0 = did not attempt.') + '</div></details>'"],
  ["  const sumHint = a => { const n = o =>", "  const sumHint = a => { if(CAMX()) return camHint(a); const n = o =>"],
  ["  function sumHtml(){ const a = S.a; return sumHint(a)", "  function sumHtml(){ const a = S.a; if(CAMX()) return camSum(a); return sumHint(a)"],
  ["  const shLabel = k => SHL[k] != null ?", "  const shLabel = k => CAMX() && camLab(k) ? camLab(k) : SHL[k] != null ?"],
  ["  function show(k){ put('notes.show', k);", "  function show(k){ put('notes.show', k); put('notes.sx', sxOf(k));"],
  ["  function review(){ const L = [[", "  function review(){ if(CAMX()) return camReview(); const L = [["],
  ["  function essayLive(){ const a = S.a,", "  function essayLive(){ if(CAMX()) return camEss(); const a = S.a,"],
  ["  function factsHtml(){ const f = S.a.essay_facts", "  function factsHtml(){ if(CAMX()) return ''; const f = S.a.essay_facts"],
  ["  function guideHtml(){ const c =", "  function guideHtml(){ if(CAMX()) return camGuide(); const c ="],
  ["[['sp', ['fc', 'lr', 'gra', 'p']], ['wr', ['tr', 'cc', 'lr', 'gra']]].forEach(([sk, K]) =>", "[['sp', SP.map(x => x[0])], ['wr', WR.map(x => x[0])]].forEach(([sk, K]) =>"],
  ["  function homeMsg(){ const a = S.a,", "  function homeMsg(){ if(CAMX()) return camHome(); const a = S.a,"],
  ["  function msg(){ const a = S.a,", "  function msg(){ if(CAMX()) return camMsg(); const a = S.a,"],
  // editor: the test choice, and the Cambridge parts
  ["  function paint(){ const a = S.a; if(!a) return paintList(); clearTimers();", "  function paint(){ const a = S.a; if(!a) return paintList(); clearTimers(); xm();"],
  ["'<div class=\"as-tabs\">' + tabs.map(t =>", "xBar() + '<div class=\"as-tabs\">' + tabs.map(t =>"],
  ["    if(S.tab === 'speak'){\n      h += '<div class=\"as-card\"><h2>Part 1 — Introduction and interview", "    if(CAMX() && S.tab !== 'result'){ h += camTab(); }\n    else if(S.tab === 'speak'){\n      h += '<div class=\"as-card\"><h2>Part 1 — Introduction and interview"],
  // picture
  ["c.fillText('Initial English Proficiency Assessment · IELTS-aligned', PAD, 248);", "c.fillText(CAMX() ? CAMX().title : 'Initial English Proficiency Assessment · IELTS-aligned', PAD, 248);"],
  ["[['Speaking', a.sp_band, a.cefr_sp, '#EEF7F7'], ['Academic Writing · Task 2', a.wr_band, a.cefr_wr, '#F2F0FA']]", "[['Speaking' + (CAMX() ? ' · out of 5' : ''), a.sp_band, a.cefr_sp, '#EEF7F7'], [CAMX() ? 'Writing · out of 5' : 'Academic Writing · Task 2', a.wr_band, a.cefr_wr, '#F2F0FA']]"],
  ["Math.max(24, bw * v[k] / 9)", "Math.max(24, bw * v[k] / TOP())"],
  ["y = wrap('Internal estimate aligned with IELTS band descriptors · not an official IELTS result · CEFR levels are approximate',", "y = wrap(CAMX() ? 'Following the Cambridge ' + CAMX().long + ' assessment scales (0–5) · indicative level only · not an official Cambridge English result' : 'Internal estimate aligned with IELTS band descriptors · not an official IELTS result · CEFR levels are approximate',"],
  // exports
  ["window.as1778 = { openTrial: a => {", "window.as1778 = { exam: setExam, openTrial: a => {"],
  // trials (1854 / 1855 / 1858): KET / PET books open that test; labels follow the test
  ["const lab = a => { const b = a.combined != null ? a.combined : a.sp_band; return 'IELTS' + (b != null ? ' ' + (+b).toFixed(1) : '')",
   "const lab = a => { const b = a.combined != null ? a.combined : a.sp_band, x = a.exam && a.exam !== 'ielts'; return (x ? a.exam.toUpperCase() : 'IELTS') + (b != null ? ' ' + (+b).toFixed(1) + (x ? '/5' : '') : '')"],
  ["const r = await C('tnew', { date: q.date, time: q.time || '', student: q.student, code: q.code || '' });", "const r = await C('tnew', { date: q.date, time: q.time || '', student: q.student, code: q.code || '', exam: q.ex || 'ielts' });"],
  ["toast(ex ? 'Opening the IELTS assessment…' : 'Making the IELTS assessment…');", "toast((ex ? 'Opening' : 'Making') + ' the ' + (q.ex && q.ex !== 'ielts' ? q.ex.toUpperCase() : 'IELTS') + ' assessment…');"],
  ["time:tm(c.start),ie:/ielts/i.test(c.title||''),ieW:/ielts\\s*writing/i.test(c.title||'')})})", "time:tm(c.start),ie:/ielts/i.test(c.title||'')||/^(ket|pet)/i.test(c.book||''),ieW:/ielts\\s*writing|^(ket|pet)\\s*writing/i.test(c.book||c.title||''),ex:/^ket/i.test(c.book||'')?'ket':/^pet/i.test(c.book||'')?'pet':'ielts'})})"],
  ["time:x.time,ie:/ielts/i.test(x.book||''),ieW:/ielts\\s*writing/i.test(x.book||'')})})", "time:x.time,ie:/ielts|^(ket|pet)/i.test(x.book||''),ieW:/(ielts|^ket|^pet)\\s*writing/i.test(x.book||''),ex:/^ket/i.test(x.book||'')?'ket':/^pet/i.test(x.book||'')?'pet':'ielts'})})"],
  ["time:t.time,ie:/ielts/i.test(t.book||''),ieW:/ielts\\s*writing/i.test(t.book||'')})})", "time:t.time,ie:/ielts|^(ket|pet)/i.test(t.book||''),ieW:/(ielts|^ket|^pet)\\s*writing/i.test(t.book||''),ex:/^ket/i.test(t.book||'')?'ket':/^pet/i.test(t.book||'')?'pet':'ielts'})})"],
  ["time: t.time, ie: /ielts/i.test(t.book || ''), ieW: /ielts\\s*writing/i.test(t.book || '') })})", "time: t.time, ie: /ielts|^(ket|pet)/i.test(t.book || ''), ieW: /(ielts|^ket|^pet)\\s*writing/i.test(t.book || ''), ex: /^ket/i.test(t.book || '') ? 'ket' : /^pet/i.test(t.book || '') ? 'pet' : 'ielts' })})"],
  ["t: 'Online IELTS trial assessments',", "t: 'Online trial assessments (IELTS / KET / PET)',"]]);
