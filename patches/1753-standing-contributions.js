// 1753: (Misty 4 Nov 17:12 "YES": SSS / Pag-IBIG / PhilHealth / BIR off the Google PAYROLL copy)
//   Payroll › Database › ✎ a person: "Monthly contributions · every month" — the standing amounts kept in the database
//   (coe_pay_people, from October 2026; seeded with the same amounts as the PAYROLL tab). Changing them changes every month from
//   October that has no correction of its own; one month only → use "What to correct" › SSS etc. as before.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["      + '<button class=\"btn ghost block\" style=\"margin-top:14px\" onclick=\"pdb1742Open()\">‹ Back to the list</button>'); };",
   "      + govBox1753(r, i)   /* 1753 */\n" +
   "      + '<button class=\"btn ghost block\" style=\"margin-top:14px\" onclick=\"pdb1742Open()\">‹ Back to the list</button>'); };\n" +
   "  function govBox1753(r, i){ if(String(PM) < '2026-10') return ''; const p = ((PD && PD.people) || []).find(x => String(x.teacher).toLowerCase() === String(r.teacher).toLowerCase()) || {};\n" +
   "    const f = (k, l) => '<div class=\"grow\" style=\"min-width:120px\"><label>' + l + '</label><input id=\"pg' + k + '1753\" class=\"in-t\" type=\"number\" min=\"0\" step=\"0.01\" inputmode=\"decimal\" value=\"' + (+p[k] || 0) + '\"></div>';\n" +
   "    return '<details class=\"card\" style=\"margin-top:16px;padding:10px 12px\"><summary><b>Monthly contributions · every month</b> <span class=\"small mute\">SSS ' + peso(p.sss) + ' · Pag-IBIG ' + peso(p.pagibig) + ' · PhilHealth ' + peso(p.philhealth) + (+p.bir ? ' · BIR ' + peso(p.bir) : '') + '</span></summary>'\n" +
   "      + '<div class=\"small mute\" style=\"margin:6px 0\">Saved in the database for ' + esc(r.teacher) + ' · used for every month from October 2026 (a month with its own correction keeps that) · for one month only, use What to correct above</div>'\n" +
   "      + '<div class=\"row\" style=\"gap:10px;flex-wrap:wrap\">' + f('sss', 'SSS') + f('pagibig', 'Pag-IBIG') + f('philhealth', 'PhilHealth') + f('bir', 'BIR') + '</div>'\n" +
   "      + '<button class=\"btn block\" id=\"pgGo1753\" style=\"margin-top:10px\" onclick=\"pdb1753Gov(' + i + ')\">Save monthly contributions</button></details>'; }\n" +
   "  window.pdb1753Gov = async function(i){ const r = PD && PD.rows && PD.rows[i]; if(!r) return; const v = k => ((($('pg' + k + '1753') || {}).value) || '0'), g = $('pgGo1753');\n" +
   "    const b = { op: 'person', teacher: r.teacher, sss: +v('sss'), pagibig: +v('pagibig'), philhealth: +v('philhealth'), bir: +v('bir') };\n" +
   "    if(['sss', 'pagibig', 'philhealth', 'bir'].some(k => !isFinite(b[k]) || b[k] < 0)) return toast('Check the amounts');\n" +
   "    if(g){ g.disabled = true; g.textContent = 'Saving…'; } let x = null; try{ x = await call(b); }catch(e){}\n" +
   "    if(!x || !x.ok){ if(g){ g.disabled = false; g.textContent = 'Save monthly contributions'; } return toast((x && x.error) || 'Not saved · check your internet'); }\n" +
   "    toast('✓ Monthly contributions saved · ' + r.teacher); const t = r.teacher; await pdb1742Load(); const j = (PD.rows || []).findIndex(y => y.teacher === t); pdb1742Open(); if(j > -1) setTimeout(() => pdb1742Edit(j), 50); };"],
]);
