// 19 Oct · 313 · My growth › Teacher Excellence card gets the same look as the side-menu corner (Misty loved it):
// a large medal in the level's colour with the score inside, the month and live line beside it, the level in big type and the place chip on the right.
const fs = require('fs'), file = process.argv[2], s = fs.readFileSync(file, 'utf8');
const a = s.indexOf('    return `<section class="card" id="kxCard"'), b = s.indexOf('${track}', a);
if(a < 0 || b < a) { console.error('card head not found'); process.exit(1); }
const nw = "    const G2 = { Gold: ['#f9e08b', '#d4a017'], Silver: ['#eef1f5', '#8f9bab'], Bronze: ['#f3cfa9', '#b8743a'], Developing: ['#e6eaee', '#9aa5b1'] }[me.level] || ['#e6eaee', '#9aa5b1'];\n"
 + "    return `<section class=\"card\" id=\"kxCard\" style=\"padding:18px 20px;margin:0 0 14px;border-radius:20px;box-shadow:0 6px 20px rgba(43,34,83,.06)\">\n"
 + "<div style=\"display:flex;gap:16px;align-items:center;flex-wrap:wrap\">\n"
 + "<div style=\"width:84px;height:84px;flex:none;border-radius:50%;background:radial-gradient(circle at 32% 28%,${G2[0]},${G2[1]});box-shadow:0 3px 10px rgba(0,0,0,.15),inset 0 -4px 0 rgba(0,0,0,.12);display:flex;flex-direction:column;align-items:center;justify-content:center;color:${me.level === 'Gold' || me.level === 'Bronze' ? '#3b2400' : '#2b2f3a'}\">${me.rank ? `<b style=\"font:800 24px/1 var(--brand,inherit)\">${t}</b><span style=\"font-size:10px;letter-spacing:.08em;opacity:.8;margin-top:3px\">SCORE</span>` : '<span style=\"font-size:30px\">🌱</span>'}</div>\n"
 + "<div style=\"flex:1;min-width:200px\"><div class=\"small mute\" style=\"letter-spacing:.08em;text-transform:uppercase;font-weight:600\">Teacher Excellence · this month</div>\n"
 + "<div style=\"font-size:22px;font-weight:700;margin:2px 0\">${esc(m.label)}${m.final ? '' : ' <span class=\"mute\" style=\"font-size:15px;font-weight:400\">so far</span>'}</div>${live}</div>\n"
 + "<div style=\"text-align:right;margin-left:auto\">${me.rank ? `<div style=\"font:800 26px/1 var(--brand,inherit);color:var(--ink)\">${esc(me.level)}</div><span style=\"display:inline-block;margin-top:6px;font-size:12px;font-weight:700;padding:3px 10px;border-radius:999px;background:#eef7f5;color:#1e7a6e\">${me.rank <= 3 ? ['🥇', '🥈', '🥉'][me.rank - 1] + ' ' : ''}${ord(me.rank)} place${m.final ? '' : ' so far'}</span>` : '<div class=\"small mute\">Not ranked this month<br>(20 hours or more to be ranked)</div>'}</div></div>\n";
require('../tools/lib.js')(file, [[s.slice(a, b), nw]]);
