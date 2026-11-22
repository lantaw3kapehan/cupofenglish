// 2691 (Misty 22 Nov 13:46, Yufan): the IELTS trial report uses the questions the class actually used.
// When the lesson was taught from Speaking Activities (IELTS sets), the scoring form shows that set's Part 1 questions, cue card and
// Part 3 questions, and only the parts reached ("we only reached Part 2"). Saved with the assessment (notes.kq, notes.reach).
// The talk page now remembers the last IELTS set it ran (coe.kit.ieltsLast), so the form picks it by itself; it can be changed.
require('../tools/lib.js')(process.argv[2] || 'app.html', [
  [`  function paint(){ const a = S.a; if(!a) return paintList(); clearTimers(); xm();`,
   `  /* 2691 · questions from the Speaking Activities set used in class, and the parts reached */
  const DQ2691 = { a: Q_A, b: CUE, c: Q_C };
  const KQ2691 = () => { try{ return JSON.parse(((S.a && S.a.notes) || {}).kq || 'null'); }catch(e){ return null; } };
  const RCH2691 = () => { const r = +(((S.a && S.a.notes) || {}).reach || 3); return r >= 1 && r <= 3 ? r : 3; };
  function kq2691(){ const k = !CAMX() && KQ2691(); Q_A = k && k.p1 && k.p1.length ? k.p1 : DQ2691.a; CUE = k && k.cue ? { t: k.cue.t, say: k.cue.say || [], end: k.cue.end || '' } : DQ2691.b; Q_C = k && k.p3 && k.p3.length ? k.p3 : DQ2691.c;
    try{ const n = (S.a && S.a.notes) || {}; if(!CAMX() && !n.kq && !S.a.__kq2691){ S.a.__kq2691 = 1; const L = JSON.parse(localStorage.getItem('coe.kit.ieltsLast') || 'null');
      const same = L && Date.now() - L.at < 18 * 3600e3 && (!L.stu || String(L.stu).trim().toLowerCase() === String(S.a.name || '').trim().toLowerCase());
      if(same){ const j = JSON.stringify({ id: L.id, theme: L.theme, zh: L.zh, p1: L.p1, cue: L.cue, p3: L.p3 }); put('notes.kq', j); if(!n.reach) put('notes.reach', String(L.reach || 3)); setTimeout(paint, 0); } } }catch(e){} }
  function sets2691(){ return (window.KITS && window.KITS.ielts2) || null; }
  function loadSets2691(){ if(sets2691() || window.__ks2691) return; window.__ks2691 = 1; const s = document.createElement('script'); s.src = 'talk/ielts-2542.js?v=2691'; s.onload = () => { try{ if(VIEW === 'assess' && S.tab === 'speak') paint(); }catch(e){} }; document.head.appendChild(s); }
  function kqBar2691(){ if(CAMX()) return ''; loadSets2691(); const k = KQ2691(), r = RCH2691(), L = sets2691() || [];
    const opt = '<option value="">Standard trial questions</option>' + L.map(t => '<option value="' + E(t.id) + '"' + (k && k.id === t.id ? ' selected' : '') + '>Speaking Activities · ' + E(t.theme) + (t.zh ? ' · ' + E(t.zh) : '') + '</option>').join('') + (k && !L.some(t => t.id === k.id) ? '<option selected>' + E(k.theme || 'Class set') + '</option>' : '');
    return '<div class="as-card" style="padding:14px 18px"><h2 style="margin-bottom:6px">Questions used in class</h2><div class="as-m">Choose the set you taught from; the parts below show those questions. Only the parts you reached are kept in the report.</div>' +
      '<div class="as-row" style="align-items:center;gap:10px;flex-wrap:wrap"><select class="as-in" style="max-width:420px" onchange="as1778.kq2691(this.value)">' + opt + '</select>' +
      (k ? '<span class="as-m" style="margin:0">' + (k.p1 || []).length + ' Part 1 questions · cue card · ' + (k.p3 || []).length + ' Part 3</span>' : '') + '</div>' +
      '<div class="as-row" style="align-items:center;gap:8px"><span class="as-m" style="margin:0">Reached</span>' + [[1, 'Part 1'], [2, 'Parts 1–2'], [3, 'All three parts']].map(x => '<button class="btn sm ' + (r === x[0] ? 'teal' : 'ghost') + '" onclick="as1778.reach2691(' + x[0] + ')">' + x[1] + '</button>').join('') + '</div></div>'; }
  function setKq2691(id){ if(!id){ put('notes.kq', ''); paint(); return; } const t = (sets2691() || []).find(x => x.id === id); if(!t) return;
    let len = '25'; try{ len = localStorage.getItem('coe.kit.len') || '25'; }catch(e){}
    const Q1 = []; (t.p1 || []).forEach(g => (g.q || []).forEach(q => Q1.push(q.q))); const c = (t.p2 || [])[0];
    put('notes.kq', JSON.stringify({ id: t.id, theme: t.theme, zh: t.zh || '', p1: len === '25' ? Q1.slice(0, 3) : Q1, cue: c ? { t: c.task, say: c.points || [], end: c.explain || '' } : null, p3: (t.p3 || []).map(q => q.q).slice(0, len === '25' ? 2 : 99) })); paint(); }
  window.__as2691 = { kq: setKq2691, reach: r => { put('notes.reach', String(r)); paint(); } };
  function paint(){ const a = S.a; if(!a) return paintList(); clearTimers(); xm(); kq2691();`],
  [`    else if(S.tab === 'speak'){
      h += '<div class="as-card"><h2>Part 1 — Introduction and interview`,
   `    else if(S.tab === 'speak'){
      h += kqBar2691() + '<div class="as-card"><h2>Part 1 — Introduction and interview`],
  [`'<div class="as-card"><h2>Part 2 — Individual long turn`, `(RCH2691() < 2 ? '' : '<div class="as-card"><h2>Part 2 — Individual long turn`],
  [`note('b', 'Notes on the long turn') + '</div></div>' +`, `note('b', 'Notes on the long turn') + '</div></div>') +`],
  [`'<div class="as-card"><h2>Part 3 — Discussion`, `(RCH2691() < 3 ? '' : '<div class="as-card"><h2>Part 3 — Discussion`],
  [`note('c' + (i + 1)) + '</div>').join('') + '</div>' +`, `note('c' + (i + 1)) + '</div>').join('') + '</div>') +`],
  [`    return L.map(([h, qs]) => '<h3>'`, `    return L.filter((x, i) => i === 3 || i < RCH2691()).map(([h, qs]) => '<h3>'`],
  [`  window.as1778 = { vers: vers2583,`, `  window.as1778 = { kq2691: id => window.__as2691.kq(id), reach2691: r => window.__as2691.reach(r), vers: vers2583,`],
  // the student screen ("Show student") only knows the standard questions, so it is hidden while a class set is used
  [`showB('a' + (i + 1))`, `(KQ2691() ? '' : showB('a' + (i + 1)))`],
  [`showB('b') + timerHtml('b'`, `(KQ2691() ? '' : showB('b')) + timerHtml('b'`],
  [`showB('c' + (i + 1))`, `(KQ2691() ? '' : showB('c' + (i + 1)))`],
]);
