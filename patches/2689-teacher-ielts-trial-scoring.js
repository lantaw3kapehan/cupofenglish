// 2689 (Misty 22 Nov 13:37, Yufan's IELTS trial): a teacher's own IELTS / KET / PET trial scoring opens again.
// The 1997 guard (teachers never open management screens) also caught 'assess', where a teacher scores their own online trial.
require('../tools/lib.js')(process.argv[2] || 'app.html', [
  [`if(typeof D !== 'undefined' && D && !D.mgr && MGMT_ONLY1997.test(String(v || ''))){`,
   `if(typeof D !== 'undefined' && D && !D.mgr && MGMT_ONLY1997.test(String(v || '')) && !(v === 'assess' && window.__ta2689)){`],
  [`openTrial: a => { S.a = Object.assign({ sp: {}, wr: {}, notes: {} }, a);`,
   `openTrial: a => { window.__ta2689 = 1; S.a = Object.assign({ sp: {}, wr: {}, notes: {} }, a);`],
]);
