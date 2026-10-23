// 732: (Misty) Management Trainings — same language as the teacher roadmap. The five tiles become one card:
//  left "Team ladder": the ranks as a climb (Master on top, First week at the bottom); every teacher sits on their rank as a chip with a
//  small bar of units toward the next rank, a red "ready · training missing" when units are enough but a training blocks them, and an amber
//  "! n" for trainings not recorded yet. Tap a teacher → their path. Right "To act on": Needs you · Blocked · Coming up · Coaching · Self-study.
//  The table (Path · Books · Specializations, quick tick) stays below as the working tool.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const R = String.raw;
const a = s.indexOf(R`    h += '<div class="tx-cnts c5">' + cnt('coming', 'Coming up', 'sessions scheduled')`);
const b = a < 0 ? -1 : s.indexOf('\n', a);
if (a < 0 || b < 0) { console.error('tiles not found'); process.exit(1); }
s = s.slice(0, a) + R`    h += teamLadder(d, T, CT, CR);` + s.slice(b);
const k = '  window.paintTrAll = () => paintAll();';
if (s.split(k).length !== 2) { console.error('paintTrAll anchor'); process.exit(1); }
s = s.replace(k, k + R`
  /* 732 · Team ladder (management) */
  function teamLadder(d, T, CT, CR){ const LS = window._trLists || {}, n = key => ((LS[key] || [])[1] || []).length;
    const chip = x => { const nx = x.next, units = nx ? (nx.units != null ? +nx.units : (+x.life || 0) + (+nx.need || 0)) : 0, pct = nx ? Math.min(100, Math.round((+x.life || 0) / Math.max(1, units) * 100)) : 100;
      const L = statusList(d, x.name, Math.max(0, x.ix)), miss = L.filter(y => y.st !== 'done' && y.st !== 'lock' && y.t.id !== 'spec' && y.t.id !== 'way' && y.gi <= x.ix).length;
      const blk = nx && +nx.need <= 0 && L.some(y => y.gi === x.ix + 1 && y.st !== 'done');
      return '<button type="button" class="tl-c' + (blk ? ' blk' : '') + '" onclick="trView(\'' + e(x.name) + '\')" title="' + e(nx ? Math.round((+x.life || 0) * 10) / 10 + ' / ' + Math.round(units) + ' units to ' + nx.name : 'Top rank') + '"><b>' + e(x.name) + '</b>'
        + (nx ? '<span class="tl-b"><i style="width:' + pct + '%"></i></span>' : '<span class="tl-top">top</span>') + (blk ? '<em class="r">ready · training missing</em>' : miss ? '<em>! ' + miss + '</em>' : '') + '</button>'; };
    const rows = RANKS.map((rk, ix) => ({ rk, ix, L: T.filter(x => x.ix === ix).sort((p, q) => (+q.life || 0) - (+p.life || 0)) })).reverse();
    const none = T.filter(x => x.ix < 0);
    const act = (key, lab, sub, warn) => '<button type="button" class="tl-a' + (warn && n(key) ? ' warn' : '') + '" onclick="trListOpen(\'' + key + '\')"><span class="grow"><b>' + lab + '</b><small>' + sub + '</small></span><strong>' + n(key) + '</strong><span class="mute">›</span></button>';
    return '<section class="tl"><div class="tl-l"><div class="tx-h"><b>Team ladder</b><span>' + T.filter(x => x.ix >= 0).length + ' teachers · tap a name for their path</span></div>'
      + rows.map(r => '<div class="tl-r" style="--c:' + (RC[r.rk] || '#00A3AD') + '"><div class="tl-rk"><span>' + e(RS[r.rk] || r.rk) + '</span><small>' + r.L.length + '</small></div><div class="tl-t">' + (r.L.length ? r.L.map(chip).join('') : '<span class="tl-e">—</span>') + '</div></div>').join('')
      + (none.length ? '<div class="tl-r" style="--c:#C9C6D6"><div class="tl-rk"><span>Rank not set</span><small>' + none.length + '</small></div><div class="tl-t">' + none.map(x => '<button type="button" class="tl-c" onclick="trView(\'' + e(x.name) + '\')"><b>' + e(x.name) + '</b></button>').join('') + '</div></div>' : '')
      + '<div class="tl-lg"><span><i class="tl-b"><i style="width:60%"></i></i> units to the next rank</span><span><em>! 2</em> trainings not recorded yet</span><span><em class="r">ready · training missing</em> units enough, training blocks the rank</span></div></div>'
      + '<div class="tl-rt"><div class="tx-h"><b>To act on</b></div>' + act('need', 'Needs you', 'approve reflections · tick recordings', 1) + act('blocked', 'Blocked from the next rank', 'enough units · a training is missing', 1)
      + act('coming', 'Coming up', 'scheduled sessions') + '<button type="button" class="tl-a" onclick="trListOpen(\'coach\')"><span class="grow"><b>Coaching</b><small>' + CR.filter(x => x).length + ' teachers coached</small></span><strong>' + CT + '</strong><span class="mute">›</span></button>'
      + act('self', 'Self-study', 'model lessons · + add') + '</div></section>'; }
  (function(){ const st = document.createElement('style'); st.textContent = '.tl{display:grid;grid-template-columns:minmax(0,1.7fr) minmax(0,1fr);gap:16px;margin-top:14px;align-items:start}'
    + '.tl-l,.tl-rt{background:#fff;border:1px solid rgba(236,234,241,.9);border-radius:20px;padding:16px 18px;box-shadow:0 1px 2px rgba(43,34,83,.04),0 12px 30px -20px rgba(43,34,83,.2)}'
    + '.tl-r{display:grid;grid-template-columns:132px 1fr;gap:12px;align-items:center;padding:8px 0;position:relative}'
    + '.tl-r:not(:last-of-type):before{content:"";position:absolute;left:18px;top:50%;height:100%;border-left:2px dashed #E4E2EC;z-index:0}'
    + '.tl-rk{position:relative;z-index:1;display:flex;align-items:center;gap:8px;background:#fff;border:2px solid var(--c);border-radius:12px;padding:6px 10px;font-size:12.5px;font-weight:700;color:#2B2253}'
    + '.tl-rk span{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.tl-rk small{background:var(--c);color:#fff;border-radius:99px;padding:1px 7px;font-size:11px}'
    + '.tl-t{display:flex;flex-wrap:wrap;gap:6px}.tl-e{color:#C9C6D6;font-size:13px}'
    + '.tl-c{display:inline-flex;flex-direction:column;align-items:flex-start;gap:3px;min-width:92px;padding:7px 10px;border-radius:12px;border:1px solid #ECEAF1;background:#FAFAFC;font:inherit;font-size:12.5px;color:#2B2253;cursor:pointer;text-align:left}'
    + '.tl-c:hover{border-color:var(--c);background:#fff}.tl-c.blk{border-color:#F0C9BD;background:#FFF6F3}'
    + '.tl-b{display:block;width:100%;height:5px;border-radius:99px;background:#EEEDF3;overflow:hidden}.tl-b i{display:block;height:100%;background:var(--c);border-radius:99px}'
    + '.tl-c em{font-style:normal;font-size:10.5px;font-weight:700;color:#C27A22}.tl-c em.r,.tl-lg em.r{color:#C2483A}.tl-top{font-size:10.5px;color:#9A97AE}'
    + '.tl-lg{display:flex;flex-wrap:wrap;gap:6px 16px;margin-top:10px;padding-top:10px;border-top:1px solid #F0EFF5;font-size:11.5px;color:#77738C}.tl-lg em{font-style:normal;font-weight:700;color:#C27A22}.tl-lg .tl-b{display:inline-block;width:36px;vertical-align:middle;--c:#00A3AD}'
    + '.tl-a{display:flex;gap:10px;align-items:center;width:100%;padding:11px 0;border:0;border-bottom:1px solid #F0EFF5;background:none;font:inherit;color:inherit;text-align:left;cursor:pointer}.tl-a:last-child{border-bottom:0}'
    + '.tl-a b{display:block;font-size:13.5px}.tl-a small{display:block;font-size:11.5px;color:#77738C}.tl-a strong{font-family:"Fredoka One",Fredoka,sans-serif;font-weight:400;font-size:22px;color:#2B2253;min-width:28px;text-align:right}.tl-a.warn strong{color:#C2483A}'
    + '@media(max-width:900px){.tl{grid-template-columns:1fr}.tl-r{grid-template-columns:104px 1fr}}'; document.head.appendChild(st); })();`);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
