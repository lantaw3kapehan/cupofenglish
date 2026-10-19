// 19 Oct · 294 · Teacher Excellence (Misty): instead of "#6 of 7", show the place in words and how far to the next level — "🥉 Bronze · 3.4 points to Silver".
require('../tools/lib.js')(process.argv[2], [
  ["  const isT = () => !!(",
   "  const ord = n => n + (n % 100 >= 11 && n % 100 <= 13 ? 'th' : (['th', 'st', 'nd', 'rd'][n % 10] || 'th'));\n"
 + "  const gap = me => { const t = Number(me && me.total); if(!(t >= 0)) return ''; const nx = t < 55 ? ['Bronze', 55] : t < 70 ? ['Silver', 70] : t < 85 ? ['Gold', 85] : null; return nx ? (Math.round((nx[1] - t) * 10) / 10) + ' points to ' + nx[0] : 'top level reached'; };\n"
 + "  const isT = () => !!("],
  ["const txt = me.rank ? `${MED[me.level] || ''} ${esc(me.level || '')} · #${me.rank} of ${m.n} · ${when}` : `${when} · not ranked yet`;",
   "const txt = me.rank ? `${MED[me.level] || ''} ${esc(me.level || '')} · ${gap(me)} · ${when}` : `${when} · not ranked yet`;"],
  ["<div class=\"small mute\">#${me.rank} of ${m.n} teachers</div>",
   "<div class=\"small mute\">${ord(me.rank)} place${m.final ? '' : ' so far'}</div><div class=\"small\" style=\"color:#2a9d8f;font-weight:600\">${gap(me)}</div>"],
  ["${x.me.rank ? '#' + x.me.rank + ' of ' + x.n : ''}", "${x.me.rank ? ord(x.me.rank) + ' place' : ''}"]]);
