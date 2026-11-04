// 1756: (Misty 4 Nov 17:47 "But I dont see Government contributions in the app?") Payroll › Database · ✎ correct now opens with a
//   "Government contributions" box: each person's SSS / Pag-IBIG / PhilHealth / BIR every month (database, from October 2026),
//   whether it is deducted from pay or shown for the record only, the month's total, ✎ to change, and "+ Add a person".
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["    box.innerHTML = '<div class=\"small mute\" style=\"margin:6px 0 10px\">Database total ' + peso(tot)",
   "    box.innerHTML = govList1756(R) + '<div class=\"small mute\" style=\"margin:6px 0 10px\">Database total ' + peso(tot)"],
  ["  window.pdb1742Load = async function(){ PD = null; paint();",
   "  function govList1756(R){ if(String(PM) < '2026-10') return '';   /* 1756 */\n" +
   "    const P = (PD.people || []).filter(p => (+p.sss || 0) + (+p.pagibig || 0) + (+p.philhealth || 0) + (+p.bir || 0) > 0).sort((a, b) => String(a.teacher).localeCompare(String(b.teacher)));\n" +
   "    const q = x => esc(String(x)).replace(/'/g, ''), sum = p => (+p.sss || 0) + (+p.pagibig || 0) + (+p.philhealth || 0) + (+p.bir || 0);\n" +
   "    const others = R.map(r => r.teacher).filter(t => !P.some(p => String(p.teacher).toLowerCase() === String(t).toLowerCase()));\n" +
   "    return '<div class=\"card\" style=\"margin:4px 0 12px;padding:12px 14px\"><div class=\"row\" style=\"gap:8px;align-items:center\"><b class=\"grow\">Government contributions</b><span class=\"small mute\">every month · total ' + peso(P.reduce((a, p) => a + sum(p), 0)) + '</span></div>'\n" +
   "      + '<div class=\"small mute\" style=\"margin:2px 0 6px\">Saved in the database · used for every month from October 2026 · a one-month change is a ✎ correction below</div>'\n" +
   "      + '<table style=\"width:100%;border-collapse:collapse;font-variant-numeric:tabular-nums\"><tr class=\"small mute\"><td>Person</td><td style=\"text-align:right\">SSS</td><td style=\"text-align:right\">Pag-IBIG</td><td style=\"text-align:right\">PhilHealth</td><td style=\"text-align:right\">BIR</td><td></td></tr>'\n" +
   "      + (P.length ? P.map(p => '<tr style=\"border-top:1px solid var(--line,#eee)\"><td style=\"padding:6px 0\"><b>' + esc(p.teacher) + '</b><div class=\"small mute\">' + (p.gov_in_deduct ? 'for the record · not deducted' : 'deducted from pay') + '</div></td>'\n" +
   "        + ['sss', 'pagibig', 'philhealth', 'bir'].map(k => '<td style=\"text-align:right\">' + (+p[k] ? peso(p[k]) : '—') + '</td>').join('')\n" +
   "        + '<td style=\"text-align:right\">' + (PD.pres ? '<button class=\"btn ghost sm\" onclick=\"pdb1756Gov(\\'' + q(p.teacher) + '\\')\">✎</button>' : '') + '</td></tr>').join('') : '<tr><td colspan=\"6\" class=\"small mute\" style=\"padding:6px 0\">None saved yet</td></tr>') + '</table>'\n" +
   "      + (PD.pres && others.length ? '<div class=\"row\" style=\"gap:8px;margin-top:8px;align-items:center\"><select id=\"pgAdd1756\" class=\"in-t grow\"><option value=\"\">+ Add a person…</option>' + others.map(t => '<option>' + esc(t) + '</option>').join('') + '</select><button class=\"btn ghost sm\" onclick=\"const v=$(\\'pgAdd1756\\').value;if(v)pdb1756Gov(v)\">Add</button></div>' : '') + '</div>'; }\n" +
   "  window.pdb1756Gov = function(name){ const p = ((PD && PD.people) || []).find(x => String(x.teacher).toLowerCase() === String(name).toLowerCase()) || {};\n" +
   "    const f = (k, l) => '<div class=\"grow\" style=\"min-width:120px\"><label>' + l + '</label><input id=\"pq' + k + '1756\" class=\"in-t\" type=\"number\" min=\"0\" step=\"0.01\" inputmode=\"decimal\" value=\"' + (+p[k] || 0) + '\"></div>';\n" +
   "    openSheet('<h1>Government contributions · ' + esc(name) + '</h1><div class=\"small mute\">Every month from October 2026 · saved in the database · a month with its own ✎ correction keeps that</div>'\n" +
   "      + '<div class=\"row\" style=\"gap:10px;flex-wrap:wrap;margin-top:8px\">' + f('sss', 'SSS') + f('pagibig', 'Pag-IBIG') + f('philhealth', 'PhilHealth') + f('bir', 'BIR') + '</div>'\n" +
   "      + '<label style=\"display:flex;gap:8px;align-items:center;margin-top:12px;font-weight:400\"><input type=\"checkbox\" id=\"pqG1756\" style=\"width:auto;margin:0\"' + (p.gov_in_deduct ? ' checked' : '') + '> Shown for the record only · not deducted from pay</label>'\n" +
   "      + '<button class=\"btn block\" id=\"pqGo1756\" style=\"margin-top:12px\" onclick=\"pdb1756Save(\\'' + esc(String(name)).replace(/'/g, '') + '\\')\">Save</button>'\n" +
   "      + '<button class=\"btn ghost block\" style=\"margin-top:8px\" onclick=\"pdb1742Open()\">‹ Back to the list</button>'); };\n" +
   "  window.pdb1756Save = async function(name){ const v = k => +((($('pq' + k + '1756') || {}).value) || 0), g = $('pqGo1756');\n" +
   "    const b = { op: 'person', teacher: name, sss: v('sss'), pagibig: v('pagibig'), philhealth: v('philhealth'), bir: v('bir'), gov_in_deduct: !!($('pqG1756') || {}).checked };\n" +
   "    if(['sss', 'pagibig', 'philhealth', 'bir'].some(k => !isFinite(b[k]) || b[k] < 0)) return toast('Check the amounts');\n" +
   "    if(g){ g.disabled = true; g.textContent = 'Saving…'; } let x = null; try{ x = await call(b); }catch(e){}\n" +
   "    if(!x || !x.ok){ if(g){ g.disabled = false; g.textContent = 'Save'; } return toast((x && x.error) || 'Not saved · check your internet'); }\n" +
   "    toast('✓ Government contributions saved · ' + name); const pm = PM; pdb1742Open(); if(pm !== PM){ PM = pm; const t = $('pdbM1742'); if(t) t.textContent = label(PM); pdb1742Load(); } };\n" +
   "  window.pdb1742Load = async function(){ PD = null; paint();"],
]);
