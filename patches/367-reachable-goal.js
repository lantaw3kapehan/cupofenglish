// 20 Oct · "8.5 points to Gold" with 11 days left read like a target for this month (Misty: "reaching gold is months away … is this best?").
// The goal line now shows what can be reached this month; Gold (or the next level) far away becomes a path with the biggest step.
//  · leading (1st) at Silver or Gold, month not over → "Keep Silver and 1st place → Teacher of the Month"
//  · next level within reach (≤ 3 points, or the month is over) → "x points to Silver/Gold" as before
//  · otherwise → "Path to Gold · biggest step: Trust (53)" (the part with the most room)
require('../tools/lib.js')(process.argv[2], [
  ["const gap = me => { const t = Number(me && me.total); if(!(t >= 0)) return '';",
   "const gap0 = me => { const t = Number(me && me.total); if(!(t >= 0)) return '';"],
  ["const isT = () => !!(typeof D !== 'undefined' && D && !D.mgr && TOKEN);\n  const cur = () =>",
   "const gap = me => { try{ const t = Number(me && me.total); if(!(t >= 0)) return '';\n" +
   "    const m = (K && K.months || []).find(x => x.me === me), live = m && !m.final;\n" +
   "    const nx = t < 65 ? ['Bronze', 65] : t < 78 ? ['Silver', 78] : t < 88 ? ['Gold', 88] : null, pts = nx ? Math.round((nx[1] - t) * 10) / 10 : 0;\n" +
   "    if(!live) return gap0(me);\n" +
   "    if(me.rank === 1 && (me.level === 'Silver' || me.level === 'Gold')) return 'Keep ' + me.level + ' and 1st place → Teacher of the Month';\n" +
   "    if(!nx) return 'Gold · keep it to the end of the month';\n" +
   "    if(pts <= 3) return pts + ' points to ' + nx[0] + ' · within reach this month';\n" +
   "    const P = me.pillars || {}, NM = { quality: 'Quality', progress: 'Progress', trust: 'Trust', reliability: 'Reliability' };\n" +
   "    const low = Object.keys(NM).filter(k => P[k] != null).sort((a, b) => P[a] - P[b])[0];\n" +
   "    return 'Path to ' + nx[0] + (low ? ' · biggest step: ' + NM[low] + ' (' + Math.round(P[low]) + ')' : ' · step by step'); }catch(e){ return gap0(me); } };\n" +
   "  const isT = () => !!(typeof D !== 'undefined' && D && !D.mgr && TOKEN);\n  const cur = () =>"]
]);
