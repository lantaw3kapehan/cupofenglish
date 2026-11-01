// 1684: (Misty, 1 Nov 10:38, Yoyo's calendar picture) "It should show 9 classes of 25 minutes, since our 1 unit = 1 class of 50
//   minutes, to avoid confusion." + "check the footer design, there are floating and covered texts."
//   · Month counts say the class length: "9 classes × 25 min · 9节 × 25分钟" (mixed lengths: "9 classes · 25 / 50 min").
//   · The summary box is laid out in rows that fit the width: "13 classes × 25 min booked · 6.5 units" (+ Chinese), then
//     Next / Last class side by side (English + Chinese). A small line explains 1 unit = 50 min, China time and the date.
//   · Footer: a divider, then the tagline below the text (it used to sit on top of the "China time" line).
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["for(let d = 1; d <= days; d++) (by[ymd(new Date(yy, mm, d))] || []).forEach(e => { if(!e.cancelled) n++; });",
   "const ms1684 = []; for(let d = 1; d <= days; d++) (by[ymd(new Date(yy, mm, d))] || []).forEach(e => { if(!e.cancelled){ n++; ms1684.push(len1684(e)); } });"],
  ["c.textAlign = 'right'; c.fillText(n + ' class' + (n === 1 ? '' : 'es') + ' · ' + n + '节课', WD - PAD, y + 44); c.textAlign = 'center';",
   "c.textAlign = 'right'; { const lm = lens1684(ms1684); c.fillText(n ? n + ' class' + (n === 1 ? '' : 'es') + (lm.one ? ' × ' + lm.t + ' min · ' + n + '节 × ' + lm.t + '分钟' : ' · ' + lm.t + ' min · ' + n + '节') : '0 classes · 0节', WD - PAD, y + 44); } c.textAlign = 'center';"],
  ["      y += 60; c.fillStyle = '#EEF7F7'; rr(PAD, y, WD - PAD * 2, 120, 22); c.fill();\n",
   "      y += 60; c.fillStyle = '#EEF7F7'; rr(PAD, y, WD - PAD * 2, live.length ? 224 : 100, 22); c.fill();\n"],
  ["      c.fillStyle = NAVY; c.font = '700 26px ' + F; c.fillText(live.length ? live.length + ' classes booked · next ' + fd(new Date(nx.start)) + ' · last ' + fd(new Date(last.start)) : 'No classes booked yet', PAD + 28, y + 50);\n" +
   "      c.fillStyle = '#4A4766'; c.font = '400 24px ' + F; c.fillText(live.length ? '已约' + live.length + '节课 · 下节课 ' + fz(new Date(nx.start)) + ' · 最后一节 ' + fz(new Date(last.start)) : '暂无已约课程', PAD + 28, y + 92);\n" +
   "      y += 150; c.fillStyle = MUTE; c.font = '400 21px ' + F; c.textAlign = 'center'; c.fillText('China time",
   "      const LM = lens1684(live.map(len1684)), UN = Math.round(live.reduce((a, e) => a + len1684(e) / 50, 0) * 10) / 10, X = LM.one ? ' × ' + LM.t + ' min' : '', XZ = LM.one ? ' × ' + LM.t + '分钟' : '';\n" +
   "      if(!live.length){ c.fillStyle = NAVY; c.font = '700 28px ' + F; c.fillText('No classes booked yet · 暂无已约课程', PAD + 30, y + 60); y += 130; }\n" +
   "      else { const X0 = PAD + 30, X1 = WD / 2 + 10;\n" +
   "        c.fillStyle = NAVY; c.font = '700 30px ' + F; c.fillText(live.length + ' classes' + X + ' booked · ' + UN + ' unit' + (UN === 1 ? '' : 's'), X0, y + 50);\n" +
   "        c.fillStyle = '#4A4766'; c.font = '400 24px ' + F; c.fillText('已约' + live.length + '节' + XZ + ' · ' + UN + '课时', X0, y + 86);\n" +
   "        c.fillStyle = '#CFE6E6'; c.fillRect(X0, y + 108, WD - PAD * 2 - 60, 2);\n" +
   "        [[X0, 'Next class · 下节课', new Date(nx.start)], [X1, 'Last booked · 最后一节', new Date(last.start)]].forEach(([x, lab, d]) => { c.fillStyle = MUTE; c.font = '400 21px ' + F; c.fillText(lab, x, y + 142); c.fillStyle = NAVY; c.font = '700 26px ' + F; c.fillText(fd(d), x, y + 178); c.fillStyle = '#4A4766'; c.font = '400 22px ' + F; c.fillText(fz(d), x, y + 208); });\n" +
   "        y += 254; }\n" +
   "      y += 20; c.fillStyle = MUTE; c.font = '400 20px ' + F; c.textAlign = 'center'; c.fillText('1 unit = 50 min · 1课时 = 50分钟  ·  China time"],
  ["if(tag){ const tw = 260, th = tw * tag.height / tag.width; c.drawImage(tag, WD / 2 - tw / 2, H - 40 - th - 20, tw, th); }",
   "c.fillStyle = '#E8E6EF'; c.fillRect(PAD, y + 34, WD - PAD * 2, 2); if(tag){ const tw = 240, th = tw * tag.height / tag.width; c.drawImage(tag, WD / 2 - tw / 2, y + 62, tw, th); }"],
  ["H = head + mH[0] + mH[1] + 40 + 300;",
   "H = head + mH[0] + mH[1] + 40 + 520;"],
  ["  window.swMine1676 = ",
   "  /* 1684 · class length helpers for the calendar picture */\n" +
   "  window.len1684 = e => { const m = Math.round((new Date(e.end || e.start) - new Date(e.start)) / 6e4); return m > 0 ? m : 25; };\n" +
   "  window.lens1684 = L => { const u = [...new Set(L)].sort((a, b) => a - b); return { one: u.length === 1, t: u.length ? u.join(' / ') : '25' }; };\n" +
   "  window.swMine1676 = "]
]);
