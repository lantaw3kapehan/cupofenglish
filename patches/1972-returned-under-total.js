// 1972: (Misty 9 Nov 13:17, pointing at "Shared package total (68 + 3.5 carried)": "perhaps show here?")
//   The returned lessons now show right under the package total on both Lesson Summary pictures, instead of a separate section:
//   "Returned: 0.5 (Nov 8; class not held by the teacher)" / "已退回 0.5 课时（11月8日；因老师原因未能上课）". On a shared package the child is named.
//   The total itself does not change: a returned lesson was never counted as completed, so it is already inside Remaining.
const file = process.argv[2];
const LINE = "${(() => { try{ return window.retLine1972 ? retLine1972(G, C, code, st) : ''; }catch(e){ return ''; } })()}";
const FN = [
  "  window.retList1972 = function(G, C, code, st){ if(!R) return [];",
  "    const up = x => String(x || '').trim().toUpperCase(), nm = {};",
  "    ((G && G.members) ? G.members.concat(G.owner ? [G.owner] : []) : []).forEach(x => { const k = up(x[C.code]); if(k && !nm[k]) nm[k] = String(x[C.name] || ''); });",
  "    if(code && !(up(code) in nm)) nm[up(code)] = '';",
  "    const from = st && !isNaN(st) ? st.getFullYear() + '-' + ('0' + (st.getMonth() + 1)).slice(-2) + '-' + ('0' + st.getDate()).slice(-2) : '';",
  "    const L = []; Object.keys(nm).forEach(k => (R[k] || []).forEach(x => { if(!from || x.d >= from) L.push(Object.assign({ k, n: nm[k] }, x)); })); return L.sort((a, b) => (a.d + a.t).localeCompare(b.d + b.t)); };",
  "  window.retLine1972 = function(G, C, code, st){ const L = retList1972(G, C, code, st); if(!L.length) return '';",
  "    const up = x => String(x || '').trim().toUpperCase(), all = (G && G.members) ? G.members.concat(G.owner ? [G.owner] : []) : [];",
  "    const tot = Math.round(L.reduce((a, x) => a + (+x.u || 0), 0) * 10) / 10, many = new Set(all.map(x => up(x[C.code]))).size > 1, cn = {};",
  "    all.forEach(x => { const k = up(x[C.code]); if(k && C.cn != null && x[C.cn] && !cn[k]) cn[k] = String(x[C.cn]); });",
  "    const M = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];",
  "    const en = x => { const p = x.d.split('-'); return (many && x.n ? x.n + ', ' : '') + M[+p[1] - 1] + ' ' + (+p[2]); };",
  "    const zh = x => { const p = x.d.split('-'); return (many ? (cn[x.k] || x.n) + '，' : '') + (+p[1]) + '月' + (+p[2]) + '日'; };",
  "    const e = s => String(s).replace(/[&<>\"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;' }[c]));",
  "    return '<div style=\"margin-top:6px;font-size:11px;color:#2B7F80\"><b>Returned: ' + tot + '</b> (' + e(L.map(en).join('; ')) + '; class not held by the teacher)<br>已退回 ' + tot + ' 课时（' + e(L.map(zh).join('；')) + '；因老师原因未能上课）</div>'; };",
  "  window.ret1969 = function(G, C, code, st){ return '';   /* 1972: shown under the package total instead */"
].join('\n');
require('../tools/lib.js')(file, [
  ["Shared package total${totX}<br>共享课程包总课时${inc ? '（含赠送 ' + inc + ' 课时）' : ''}</div>",
   "Shared package total${totX}<br>共享课程包总课时${inc ? '（含赠送 ' + inc + ' 课时）' : ''}</div>" + LINE],
  ["<br>当前课程包总课时${inc ? '（含赠送 ' + inc + ' 课时）' : ''}</div>",
   "<br>当前课程包总课时${inc ? '（含赠送 ' + inc + ' 课时）' : ''}</div>" + LINE],
  ["  window.ret1969 = function(G, C, code, st){ if(!R) return '';", FN],
]);
