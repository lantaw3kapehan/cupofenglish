// 20 Oct · Substitute (SC) classes saved in the database at once too (the regular class shows cancelled straight away; Google lodges the absence case).
// 20 Oct · Cancel with "Add a make-up class at the end" saved in the database at once (the make-up shows straight away, Google Calendar follows).
require('../tools/lib.js')(process.argv[2], [
  ["(!f.forward || f.action === 'cancel' || f.action === 'move') && !(f.action === 'cancel' && f.makeup)){   /* 353: Stop this schedule too · 361: move the later classes too */",
   "(!f.forward || f.action === 'cancel' || f.action === 'move') && !(f.action === 'cancel' && f.makeup && f.forward)){   /* 353: Stop this schedule too · 361: move the later classes too · 362: make-ups too */"],
  ["if(fn === 'addClass' && TOKEN && typeof D !== 'undefined' && D && D.mgr && f && f.kind !== 'SC'){",
   "if(fn === 'addClass' && TOKEN && typeof D !== 'undefined' && D && D.mgr && f){   /* 362: substitutes too */"]
]);
