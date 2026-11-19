// 2394 (Misty 19 Nov 10:42, Elowen's calendar: the trial on 18 Nov looked like a regular lesson) · on the parent's calendar picture
//   a trial class (-TC) is an amber "Trial 19:30" box, the legend has "Trial · 试听课", and the month count shows lessons only (+ trial).
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["const ms1684 = []; for(let d = 1; d <= days; d++) (by[ymd(new Date(yy, mm, d))] || []).forEach(e => { if(!e.cancelled){ n++; ms1684.push(len1684(e)); } });",
   "const ms1684 = []; let tr2394 = 0; for(let d = 1; d <= days; d++) (by[ymd(new Date(yy, mm, d))] || []).forEach(e => { if(!e.cancelled){ if(/-TC(\\s+X)?$/i.test(String(e.title || ''))){ tr2394++; return; } n++; ms1684.push(len1684(e)); } });"],
  ["c.fillText(n ? n + ' class' + (n === 1 ? '' : 'es') + (lm.one ? ' × ' + lm.t + ' min · ' + n + '节 × ' + lm.t + '分钟' : ' · ' + lm.t + ' min · ' + n + '节') : '0 classes · 0节', WD - PAD, y + 44); }",
   "c.fillText((n ? n + ' class' + (n === 1 ? '' : 'es') + (lm.one ? ' × ' + lm.t + ' min · ' + n + '节 × ' + lm.t + '分钟' : ' · ' + lm.t + ' min · ' + n + '节') : (tr2394 ? '' : '0 classes · 0节')) + (tr2394 ? (n ? ' + ' : '') + 'trial · 试听课' : ''), WD - PAD, y + 44); }"],
  ["c.fillStyle = e.cancelled ? '#fff' : isNx ? NAVY : done ? '#C9C7D3' : TEAL; rr(x + 6, by0, CW - 12, bh, 7); c.fill();",
   "const tr = /-TC(\\s+X)?$/i.test(String(e.title || ''));   /* 2394 */\n            c.fillStyle = e.cancelled ? '#fff' : tr ? '#E39A2D' : isNx ? NAVY : done ? '#C9C7D3' : TEAL; rr(x + 6, by0, CW - 12, bh, 7); c.fill();"],
  ["c.fillText(hm(s0), x + CW / 2, by0 + bh / 2 + 1); c.textBaseline = 'alphabetic';",
   "c.fillText((tr && !e.cancelled ? 'Trial ' : '') + hm(s0), x + CW / 2, by0 + bh / 2 + 1); c.textBaseline = 'alphabetic';"],
  ["['cx', 'Cancelled · 已取消'], ['mk', 'Make-up · 补课']]",
   "['cx', 'Cancelled · 已取消'], ['mk', 'Make-up · 补课']].concat(L.some(e => !e.cancelled && /-TC(\\s+X)?$/i.test(String(e.title || ''))) ? [['#E39A2D', 'Trial · 试听课']] : [])"]
]);
