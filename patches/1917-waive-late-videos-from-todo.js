// 1917: (Misty 8 Nov 16:50 / 16:52 — Mayi's 3 late videos are in To do, but tapping opens the payslip; no way to waive there)
//   To do › Class videos: under each teacher, her open late-video cases this month are listed (case ID, student, day, amount)
//   with "Waive". It opens the same case card as Cases (reason + "Waive · no penalty, keep on record"), saved in the database (1901).
//   The list comes from the database's case records (coe-cases), so it shows as soon as the case is made.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  ["/* 1882 · Class videos card on management To do */\n(function(){\n  let V = null, at = 0, busy = false;",
   "/* 1882 · Class videos card on management To do */\n(function(){\n  let V = null, at = 0, busy = false, CS1917 = [];\n" +
   "  /* 1917: open late-video cases this month, with Waive */\n" +
   "  const lateCases = (t, ym) => { const mo = new Date(ym + '-15T12:00:00').toLocaleDateString('en-US', { month: 'short' }), yr = ym.slice(0, 4);\n" +
   "    const L = CS1917.filter(c => /Late Class Video/i.test(c.subject) && String(c.employee).toLowerCase() === String(t).toLowerCase() && c.amount && !/^Waived/.test(c.action || '') && new RegExp('-' + mo + '-' + yr + '$').test(c.when || ''));\n" +
   "    if(!L.length) return '';\n" +
   "    return '<div style=\"margin-top:6px;display:grid;gap:5px\">' + L.map(c => '<div style=\"display:flex;align-items:center;gap:8px;background:#FFF6EE;border:1px solid #F3D3B5;border-radius:10px;padding:6px 10px\" onclick=\"event.stopPropagation()\"><span class=\"small\" style=\"flex:1;min-width:0\"><b>' + esc(c.id) + '</b> · ' + esc(String(c.student || '').replace(/^ST-\\d{4}-\\d{3}\\s*/, '')) + ' · ' + esc(c.when) + ' · <b>' + esc(c.amount) + '</b></span><button class=\"btn sm ghost\" onclick=\"event.stopPropagation();cw1917(\\'' + esc(c.id) + '\\')\">Waive</button></div>').join('') + '</div>'; };\n" +
   "  window.cw1917 = async id => { try{ if(typeof AC === 'undefined' || !AC || !AC.rows || !AC.rows.find(r => r.id === id)){ AC = await api('mgmtActions', TOKEN); } caseView(id);\n" +
   "      let n = 0; const t = setInterval(() => { const a = AC && AC.rows && AC.rows.find(r => r.id === id); if((a && /^Waived/.test(a.action || '')) || ++n > 80){ clearInterval(t); if(a && /^Waived/.test(a.action || '')){ CS1917 = CS1917.filter(c => c.id !== id); at = 0; try{ card(); }catch(x){} } } }, 1500);\n" +
   "    }catch(e){ toast('Open Cases to waive ' + id); } };"],
  ["const r = await fetch(FAST_URL + '-stuvid', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, vidsum: true }) }).then(x => x.json());",
   "const [r, cs] = await Promise.all([fetch(FAST_URL + '-stuvid', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, vidsum: true }) }).then(x => x.json()),\n" +
   "      fetch(FAST_URL + '-cases', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN }) }).then(x => x.json()).catch(() => null)]);\n" +
   "    if(cs && cs.ok && cs.data && Array.isArray(cs.data.rows)) CS1917 = cs.data.rows;"],
  ["' · tap for the lessons</div></div>';",
   "' · tap for the lessons</div>' + lateCases(x.teacher, ym) + '</div>';"],
]);
