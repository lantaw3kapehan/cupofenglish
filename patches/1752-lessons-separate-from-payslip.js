// 1752: (Misty 4 Nov 17:03, "You are not going to put the lesson count per student in the payslip it can be separate button")
//   The payslip is back to pay only. "Lessons by student" (from 1751) opens on its own from a button next to the payslip
//   (management and the teacher's own), with its own Copy picture. Teacher › Pay card: "My payslip" and "Lessons by student".
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["      + row('Gross compensation', '', pz(gross), 'tot') + '</table>' + lessHtml1751(S, r)",
   "      + row('Gross compensation', '', pz(gross), 'tot') + '</table>'"],
  ["  function slipHtml(S, forPrint){ const r = S.row,",
   "  function lessCard1752(S){ const h = slipHtml(S), css = h.slice(0, h.indexOf('</style>') + 8), p = S.person || {}, lg = (document.querySelector('#login img') || {}).src || '';   /* 1752 */\n" +
   "    return css + '<div class=\"ps1744\" style=\"background:#fff;padding:24px;border:1px solid #E7E5EE;border-radius:14px\"><div style=\"text-align:center\">' + (lg ? '<img src=\"' + lg + '\" alt=\"CupOfEnglish\" style=\"height:52px;display:block;margin:0 auto 6px\">' : '')\n" +
   "      + '<div class=\"m\"><b style=\"color:#2B2450\">' + esc(p.full || p.name || '') + '</b>' + (p.code ? ' · ' + esc(p.code) : '') + ' · ' + esc(lab(S.month)) + '</div></div>' + (lessHtml1751(S, S.row) || '<div class=\"empty\">No classes found for this month.</div>') + '</div>'; }\n" +
   "  window.ps1752Lessons = async function(name, ym){ if(!/^\\d{4}-\\d{2}$/.test(String(ym || ''))){ const m = String(ym || '').match(/([A-Za-z]+)\\s+(\\d{4})/); ym = m ? m[2] + '-' + ('0' + (MN.findIndex(x => x.toLowerCase().slice(0, 3) === m[1].toLowerCase().slice(0, 3)) + 1)).slice(-2) : ''; } if(!ym) return toast('Choose the month first');\n" +
   "    const MG = !!(typeof D !== 'undefined' && D && D.mgr);\n" +
   "    let S = SL && SL.ok && SL.month === ym && (!MG || String((SL.person && SL.person.name) || '').toLowerCase() === String(name).toLowerCase()) ? SL : null;\n" +
   "    if(!S){ openSheet('<h1>Lessons by student · ' + esc(name) + '</h1><div class=\"sk\" style=\"height:300px\"></div>'); try{ $('sheet').classList.add('wide'); }catch(e){}\n" +
   "      try{ S = await call(MG ? { op: 'slip', month: ym, teacher: name } : { op: 'myslip', month: ym }); }catch(e){}\n" +
   "      if(!S || !S.ok) return void ($('sheetBody').innerHTML = '<h1>Lessons by student · ' + esc(name) + '</h1><div class=\"empty\">' + esc((S && S.error) || 'Could not load') + '</div>'); }\n" +
   "    SL = S; const q = x => esc(String(x)).replace(/'/g, '');\n" +
   "    const h = '<div class=\"row\" style=\"gap:8px;flex-wrap:wrap;align-items:center\"><h1 class=\"grow\" style=\"margin:0\">Lessons by student · ' + esc(name) + '</h1><button class=\"btn sm teal\" id=\"psC1745\" onclick=\"ps1745Pic()\">Copy picture</button><button class=\"btn sm ghost\" onclick=\"ps1745Pic(1)\">' + (navigator.share ? 'Share · save' : 'Save picture') + '</button><button class=\"btn sm ghost\" onclick=\"ps1744Open(\\'' + q(name) + '\\',\\'' + q(ym) + '\\')\">Payslip →</button></div><div style=\"margin-top:10px\">' + lessCard1752(S) + '</div>';\n" +
   "    if($('sheetBody') && $('sheet') && $('sheet').classList.contains('open')) $('sheetBody').innerHTML = h; else openSheet(h); try{ $('sheet').classList.add('wide'); }catch(e){} };\n" +
   "  function slipHtml(S, forPrint){ const r = S.row,"],
  ["onclick=\"ps1745Pic(1)\">' + (navigator.share ? 'Share · save' : 'Save picture') + '</button>' + (MG ? '<button class=\"btn sm ghost\" onclick=\"pdb1742Open()\">‹ Payroll list</button>' : '')",
   "onclick=\"ps1745Pic(1)\">' + (navigator.share ? 'Share · save' : 'Save picture') + '</button><button class=\"btn sm ghost\" onclick=\"ps1752Lessons(\\'' + esc(name).replace(/'/g, '') + '\\',\\'' + esc(S.month) + '\\')\">Lessons by student →</button>' + (MG ? '<button class=\"btn sm ghost\" onclick=\"pdb1742Open()\">‹ Payroll list</button>' : '')"],
  ["const name = 'Payslip-' + SL.person.name + '-' + SL.month + '.png';",
   "const lz = /^Lessons/.test(((document.querySelector('#sheetBody h1') || {}).textContent || '')), name = (lz ? 'Lessons-' : 'Payslip-') + SL.person.name + '-' + SL.month + '.png';"],
  ["toast('Payslip picture copied · paste it in WeChat')", "toast((lz ? 'Lessons' : 'Payslip') + ' picture copied · paste it in WeChat')"],
  ["btn.textContent = 'My payslip · lessons by student →';", "btn.textContent = 'My payslip →';"],
  ["\\')\">My payslip · lessons by student →</button>';",
   "\\')\">My payslip →</button>' + '<button class=\"btn ghost block\" style=\"margin-top:8px\" onclick=\"ps1752Lessons((D.me && D.me.name) || \\'\\', \\'' + esc(String(PCK.month || '')).replace(/'/g, '') + '\\')\">Lessons by student →</button>';"],
["ym = m ? m[2] + '-' + ('0' + (MN.findIndex(x => x.toLowerCase() === m[1].toLowerCase()) + 1)).slice(-2) : ''; } if(!ym) return toast('Choose the month first'); openSheet('<h1>Payslip · '",
   "ym = m ? m[2] + '-' + ('0' + (MN.findIndex(x => x.toLowerCase().slice(0, 3) === m[1].toLowerCase().slice(0, 3)) + 1)).slice(-2) : ''; } if(!ym) return toast('Choose the month first'); openSheet('<h1>Payslip · '"],   /* 1752: \"October 2026\" (Pay card) was not read */
]);
