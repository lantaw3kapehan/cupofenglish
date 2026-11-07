// 1876: (Misty 7 Nov 20:05 "for celine, on her payslip, the count of days she worked should also be shown" · 20:06 "like appropriate
// for operations working at the office") the base pay line shows the office days worked and the daily rate (coe-payedit v15 `days`),
// with a separate holiday pay line when there is one. Falls back to the old line when the server sends no days.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  [`+ (+r.base ? row('Base pay (days worked)', '', pz(r.base)) : '')`,
   `+ (+r.base ? (() => { const D = S.days; if(!D || !(+D.n)) return row('Base pay (days worked)', '', pz(r.base));   /* 1876 */
        const hp = Math.round((+D.holPay || 0) * 100) / 100, dp = Math.round(((+r.base || 0) - hp) * 100) / 100, part = (+D.n) - (+D.full || 0);
        return row('Office days worked' + (+D.rate ? ' @ ' + pz(D.rate) + ' per day' : '') + (part > 0 ? ' <span class="m">(' + (+D.full) + ' full · ' + part + ' partial ' + (part === 1 ? 'day' : 'days') + ')</span>' : ''), (+D.n) + ' ' + ((+D.n) === 1 ? 'day' : 'days'), pz(dp))
          + (hp ? row('Holiday pay', (+D.hol || '') + ((+D.hol) ? ((+D.hol) === 1 ? ' day' : ' days') : ''), pz(hp)) : ''); })() : '')`],
]);
