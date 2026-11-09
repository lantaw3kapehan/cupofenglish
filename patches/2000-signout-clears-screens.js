// 2000: (Misty 9 Nov · QA: after a same-tab President → sign out → Teacher switch, #payroll showed team pay under a Teacher header)
//   Cause: signing out cleared the saved data and some in-memory lists, but not the screens already drawn. The Payroll screen stayed in the
//   page, only hidden; the next sign-in in the same tab could show it again. Now signing out:
//   · empties every drawn screen and the open sheet, and clears the remaining management lists in memory (pay checks, ready-to-pay,
//     parent reports, leave, messages, trials, renewals, cases, money);
//   · after a sign-out you chose, reloads the page so nothing from the previous person stays in memory at all.
//   (1997 already keeps teachers off management screens, and the server refuses teachers' management requests.)
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["TOKEN = null; D = null; MO = null; MS = null; TD = TT = AT = SC = MN = AC = DB = PL = null; MYP = null; NAVKEY = '';\nhide('app'); show('login'); show('lg1'); hide('lg2');\n}",
   "TOKEN = null; D = null; MO = null; MS = null; TD = TT = AT = SC = MN = AC = DB = PL = null; MYP = null; NAVKEY = '';\nhide('app'); show('login'); show('lg1'); hide('lg2');\ntry{ document.querySelectorAll('[id^=\"v-\"]').forEach(v => { v.innerHTML = ''; }); const sb = document.getElementById('sheetBody'); if(sb) sb.innerHTML = ''; const sh = document.getElementById('sheet'); if(sh) sh.classList.remove('on'); }catch(e){}   /* 2000: no drawn screen survives a sign-out */\n['PCK', 'PCKM', 'RDY', 'RP', 'LV', 'MSG', 'TRL', 'REN', 'TFU', 'PF', 'GR', 'HL', 'MYR', 'STU', 'RPT'].forEach(n => { try{ window.eval(n + ' = null'); }catch(e){} });\ntry{ VIEW = ''; history.replaceState(null, '', location.pathname); }catch(e){}\nif(!silent) setTimeout(() => { try{ location.reload(); }catch(e){} }, 150);   /* 2000: a sign-out you chose starts a clean page */\n}"],
]);
