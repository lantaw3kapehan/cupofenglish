// 1966: (follow-up to 1965, Misty 9 Nov "Go ahead do it now") Pay screen on a phone.
//   · Pay history was 5 px wider than the screen because each status chip read "Paid · Nov 7, 2026". The chip now reads "Paid 7 Nov"
//     (the month column gives the year; hover shows the full date), dates follow the app's day-month style ("Paid on 7 Nov 2026"),
//     and the table fits the screen with amounts kept on one line.
//   · Bonuses & deductions chart: a month with both printed the two amounts on top of each other ("+₱300₱300"); the deduction
//     amount now sits one line higher.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["const payDay = d => { const t = new Date(String(d||'').slice(0,10) + 'T00:00:00'); return isNaN(t) ? '' : t.toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' }); };",
   "const payDay = d => { const t = new Date(String(d||'').slice(0,10) + 'T00:00:00'); return isNaN(t) ? '' : t.toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' }); };\n" +
   "const payDayS = d => { const t = new Date(String(d||'').slice(0,10) + 'T00:00:00'); return isNaN(t) ? '' : t.toLocaleDateString('en-GB', { day:'numeric', month:'short' }); };"],
  ["const paidChip = x => /paid/i.test(x.status) ? `<span class=\"chip green\">Paid${x.paidOn ? ' · ' + payDay(x.paidOn) : ''}</span>`",
   "const paidChip = x => /paid/i.test(x.status) ? `<span class=\"chip green\" title=\"${x.paidOn ? 'Paid on ' + payDay(x.paidOn) : 'Paid'}\">Paid${x.paidOn ? ' ' + payDayS(x.paidOn) : ''}</span>`"],
  ['<style id="s1965">/* 1965: website feel */\n',
   '<style id="s1965">/* 1965: website feel */\n#v-pay>table{width:100%;max-width:100%}#v-pay>table td:nth-child(2),#v-pay>table td:nth-child(3){white-space:nowrap}\n.b513 .bars i.p:has(> s) + i.m > s{top:-40px!important}\n'],
]);
