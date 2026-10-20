// 20 Oct · The follow-up box flickered (red "Final warning" for a moment, then the green "plan is with management"): it was drawn before the teacher's
// messages and class visits had loaded. Now it waits for both; while they load, the last box shown stays as it was.
require('../tools/lib.js')(process.argv[2], [
  ["const old = $('ftBox'); if(old) old.remove(); if(R.level < 2) return;",
   "const old = $('ftBox'); if(old) old.remove();\n" +
   "    if(!(MYV && typeof TMSG !== 'undefined' && TMSG && TMSG.threads)){ if(window._FTLAST){ const l0 = root.querySelector('.lead'); if(l0) l0.insertAdjacentHTML('afterend', window._FTLAST); } return; }   /* 374: not loaded yet */\n" +
   "    if(R.level < 2){ window._FTLAST = ''; return; }"],
  ["const lead = root.querySelector('.lead'); if(lead) lead.insertAdjacentHTML('afterend', box); else root.insertAdjacentHTML('afterbegin', box); }",
   "window._FTLAST = box; const lead = root.querySelector('.lead'); if(lead) lead.insertAdjacentHTML('afterend', box); else root.insertAdjacentHTML('afterbegin', box); }"]
]);
