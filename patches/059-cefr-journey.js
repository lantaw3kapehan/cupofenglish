// Student page: "CEFR journey · 学习进阶" right under the header, for parents at a glance (also in Print / Save PDF).
// A level ladder (start → now, next step) plus a short timeline: trial assessment, the level they started with us,
// later levels from DATABASE › ENROLLMENT · CEFR & BOOKS ("B1+ → B2"), and each progress check.
require('../tools/lib.js')(process.argv[2], [
[
"function stuRender(){\n",
`const CJ_L = ['Pre-A1','A1','A1+','A2','A2+','B1','B1+','B2','B2+','C1','C2'];
function cjLv(x){ const m = String(x || '').match(/(pre-?\\s*a1|[abc][12])\\s*(\\+)?/i); if(!m) return -1; const b = /pre/i.test(m[1]) ? 'Pre-A1' : m[1].toUpperCase(); return CJ_L.indexOf(b + (m[2] && b !== 'Pre-A1' ? '+' : '')); }
function cjDay(d){ if(!d) return ''; if(/^\\d{4}-\\d{2}-\\d{2}/.test(String(d))) return String(d).slice(0, 10); const x = new Date(d); return isNaN(x) ? '' : ymdLocal(x); }
function cjHtml(S){ try{
const r = (S && S.r) || {}, P = r.profile, col = re => { if(!P || !P.head) return ''; const j = P.head.findIndex(h => re.test(String(h || ''))); return j > -1 ? P.row[j] : ''; };
const mon = d => { const x = new Date(cjDay(d) + 'T12:00:00'); return isNaN(x) ? '' : x.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }); };
const chain = String(col(/CEFR\\s*&\\s*BOOKS/i) || '').split(/→|->/).map(cjLv).filter(i => i >= 0);
const first = cjDay(col(/FIRST CLASS/i)), tr = r.trial && cjLv(r.trial.cefr) >= 0 ? r.trial : null, T = [];
if(tr) T.push({ d: cjDay(tr.date), i: cjLv(tr.cefr), en: 'Trial class assessment', zh: '试听评估' });
if(chain.length) T.push({ d: first || (tr && cjDay(tr.date)) || '', i: chain[0], en: 'Started with us', zh: '入学起点', start: 1 });
chain.slice(1).forEach(i => T.push({ d: '', i, en: 'Levelled up', zh: '升级' }));
(r.checks || []).slice().sort((a, b) => String(a.date).localeCompare(String(b.date))).forEach(c => { const i = cjLv(c.cefr); if(i >= 0) T.push({ d: cjDay(c.date), i, en: 'Progress check', zh: '阶段测评' }); });
if(!T.length) return '';
const st = T.find(x => x.start) || T[0], C = (r.checks || []).filter(c => cjLv(c.cefr) >= 0).sort((a, b) => String(b.date).localeCompare(String(a.date)));
const now = C.length && cjDay(C[0].date) >= (st.d || '') ? cjLv(C[0].cefr) : chain.length ? chain[chain.length - 1] : T[T.length - 1].i;
const nxt = Math.min(CJ_L.length - 1, now + 1), up = now - st.i;
const lo = Math.max(0, Math.min(st.i, now, ...T.map(x => x.i)) - 1), hi = Math.min(CJ_L.length - 1, Math.max(now, nxt, ...T.map(x => x.i)) + (nxt > now ? 0 : 1));
const cells = []; for(let i = lo; i <= hi; i++){ const on = i >= Math.min(st.i, now) && i <= Math.max(st.i, now);
cells.push('<div class="cj-c' + (on ? ' on' : '') + (i === now ? ' now' : '') + (i === nxt && nxt > now ? ' nx' : '') + '"><b>' + CJ_L[i] + '</b><span>' + (i === now ? 'Now 现在' : i === st.i ? 'Start 起点' : i === nxt && nxt > now ? 'Next 下一步' : '') + '</span></div>'); }
const head = up > 0 ? '<b>Up ' + up + ' level step' + (up === 1 ? '' : 's') + '</b> since ' + esc(mon(st.d) || 'starting') + ' · 进步 ' + up + ' 个级别'
: '<b>' + CJ_L[now] + '</b> · building towards ' + CJ_L[nxt] + ' · 正在向 ' + CJ_L[nxt] + ' 迈进';
return '<section class="sec cj"><style>.cj-l{display:flex;gap:4px;margin:10px 0 6px;overflow-x:auto}.cj-c{flex:1 0 54px;min-width:54px;text-align:center;padding:10px 4px 8px;border-radius:12px;background:#F1F3F6;color:#8A8799}.cj-c b{display:block;font-size:15px}.cj-c span{display:block;font-size:11px;min-height:14px;margin-top:2px}.cj-c.on{background:#DDF2F1;color:#00737B}.cj-c.now{background:#00737B;color:#fff;box-shadow:0 4px 12px rgba(0,115,123,.25)}.cj-c.nx{background:#fff;border:2px dashed #E08A6F;color:#B4513B}.cj-t{display:flex;flex-direction:column;gap:6px;margin-top:10px}.cj-t div{display:flex;gap:10px;align-items:baseline;font-size:13px}.cj-t i{font-style:normal;min-width:74px;color:#8A8799}.cj-t em{font-style:normal;font-weight:700;min-width:46px;color:#00737B}</style>' +
'<h2>CEFR journey <span class="c">学习进阶</span></h2><div class="small">' + head + '</div><div class="cj-l">' + cells.join('') + '</div>' +
'<div class="cj-t">' + T.map(x => '<div><i>' + esc(mon(x.d) || '—') + '</i><em>' + CJ_L[x.i] + '</em><span>' + x.en + ' · ' + x.zh + '</span></div>').join('') + '</div></section>';
}catch(e){ return ''; } }
function stuRender(){
`
],
[
"h += `<div id=\"stuSch\">",
"h += cjHtml(STU);\nh += `<div id=\"stuSch\">"
]
]);
