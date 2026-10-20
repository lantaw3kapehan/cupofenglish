// 20 Oct · Student page: Progress tab gets "at a glance" tiles and skill bars; Notes tab becomes a visual timeline with a pages-reached chart.
const inc = require('fs').readFileSync(require('path').join(__dirname, '430-progress-notes.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [
  ["let last = -99; const pos = M.map(x => { let p = (x[0] - a) / sp * 100; if(p - last < 14) p = Math.min(100, last + 14); last = p; return p; });",
   "for(let i = M.length - 1; i > 0; i--) if(+M[i][0] === +M[i - 1][0]){ M[i - 1][1] += ' · ' + M[i][1]; M.splice(i, 1); }   /* 430: same day (trial and first class) = one dot */\n        const pos = M.map((x, i) => M.length > 1 ? i / (M.length - 1) * 100 : 0);   /* 430: evenly spaced so labels never overlap */"],
  ["M.map((x, i) => '<div class=\"ms\" style=\"left:' + pos[i] + '%;--c:' + x[2] + '\">",
   "M.map((x, i) => '<div class=\"ms' + (i === 0 ? ' f' : i === M.length - 1 ? ' l' : '') + '\" style=\"left:' + pos[i] + '%;--c:' + x[2] + '\">"],
  [".replace(/\\b1 years\\b/, '1 year')", ".replace(/^0 years?,\\s*/, '').replace(/,\\s*0 months?$/, '').replace(/\\b1 years\\b/, '1 year')"],
  ["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
