// 20 Oct · Trial sheet, "After sending": the whole path from payment to the first class, in this screen (Misty: Elsa paid but there was no option;
// "no need to go to other screens, including scheduling, class notice, and all"). Elsa is a returning student (her old package made the app think
// "already enrolled", so the payment button was dropped). Now always, in order, each ✓ once used:
//   Paid (Renewed · paid for a returning student, Enrolled · paid for a new one) → Class schedule → Class notice → Agreement.
require('../tools/lib.js')(process.argv[2], [
  ["const en = enrol || enrolT; if(en){ const r = document.createElement('div'); r.className = 'tl4-r';",
   "const en = enrol || enrolT; if(en && !(D && D.mgr && t.code)){ const r = document.createElement('div'); r.className = 'tl4-r';"],
  ["if(sched || agree){ const r = document.createElement('div'); r.className = 'tl4-r';\n      r.innerHTML = '<div class=\"tl4-n\">·</div><div class=\"tl4-t\"><b>Get started</b>",
   "if(D && D.mgr && t.code){   /* 378 */\n" +
   "      const nm = esc(String(t.student || '').replace(/'/g, '')), tc = esc(String(t.teacher || '').replace(/'/g, '')), cd = esc(t.code);\n" +
   "      const has = (() => { try{ const i = AT.cols.indexOf('code'); return AT.rows.some(x => String(x[i]).toUpperCase() === String(t.code).toUpperCase()); }catch(e){ return false; } })();\n" +
   "      const row = (k, title, sub, btns) => { const r = document.createElement('div'); r.className = 'tl4-r' + (S[k] ? ' done' : ''); r.innerHTML = '<div class=\"tl4-n\">' + (S[k] ? '✓' : '·') + '</div><div class=\"tl4-t\"><b>' + title + '</b><span>' + sub + '</span></div><div class=\"tl4-a\">' + btns + '</div>';\n" +
   "        r.querySelectorAll('button').forEach(b => b.addEventListener('click', () => { mark(t, k); try{ window._tlRet = { i: (TRL.rows || []).indexOf(t), name: t.student, at: Date.now() }; }catch(e){} }, true)); A.appendChild(r); };\n" +
   "      row('paid', 'Paid', has ? 'A returning student · record the new package' : 'Record the first package · SALES, ACTIVE and DATABASE in one save',\n" +
   "        has ? '<button class=\"btn teal\" onclick=\"renPaidSheet(\\'' + cd + '\\',\\'' + nm + '\\',\\'' + tc + '\\')\">Renewed · paid</button><button class=\"btn ghost sm\" onclick=\"enSheet(\\'' + cd + '\\',\\'' + nm + '\\',\\'' + tc + '\\')\">First package</button>'\n" +
   "            : '<button class=\"btn teal\" onclick=\"enSheet(\\'' + cd + '\\',\\'' + nm + '\\',\\'' + tc + '\\')\">Enrolled · paid</button>');\n" +
   "      row('sched', 'Class schedule', 'The weekly classes of the package', '<button class=\"btn ghost\" onclick=\"tlSched()\">Set class schedule</button>');\n" +
   "      row('notice', 'Class notice', 'The schedule picture for the parent', '<button class=\"btn ghost\" onclick=\"cnOpen(\\'' + cd + '\\')\">Class notice</button>');\n" +
   "      row('agree', 'Agreement', 'The learning agreement to sign', '<button class=\"btn ghost\" onclick=\"agrOpen({code:\\'' + cd + '\\'})\">Agreement</button>');\n" +
   "      row('page', 'Student page', 'Package, classes and notes', '<button class=\"btn ghost\" onclick=\"closeSheet();openStudent(\\'' + cd + '\\')\">Open ' + nm + '\\'s page</button>'); }\n" +
   "    else if(sched || agree){ const r = document.createElement('div'); r.className = 'tl4-r';\n      r.innerHTML = '<div class=\"tl4-n\">·</div><div class=\"tl4-t\"><b>Get started</b>"],
  ["    const left = all.filter(x => !used.has(x));", "    const left = all.filter(x => !used.has(x) && !(D && D.mgr && t.code && /^(Class notice|Agreement|Set class schedule|Enrolled · paid|Open .*page)/.test(x.textContent.trim())));   /* 378: already in the steps */"],
  // ‹ Back to the trial on the sheets opened from these steps (payment, schedule, class notice, agreement)
  ["function openSheet(html){ if(!/class=\"paper/.test(html)) $('sheet').classList.remove('wide'); $('sheetBody').innerHTML = html; $('scrim').classList.add('on'); $('sheet').classList.add('on'); }",
   "function openSheet(html){ if(!/class=\"paper/.test(html)) $('sheet').classList.remove('wide'); $('sheetBody').innerHTML = html; $('scrim').classList.add('on'); $('sheet').classList.add('on');\n" +
   "  try{ const R = window._tlRet; if(R && R.i > -1 && Date.now() - R.at < 30 * 6e4 && !/<h1>Trial report|id=\"tlPdf\"|tl4/.test(html)) $('sheetBody').insertAdjacentHTML('afterbegin', '<button type=\"button\" class=\"btn ghost sm\" style=\"margin:0 0 10px\" onclick=\"window._tlRet=null;tlOpen(' + R.i + ')\">‹ Back to ' + esc(R.name || 'the') + '\\'s trial</button>'); }catch(e){} }"]
]);
