// 779: (Misty) "If parents cancelled tonight and tomorrow's class, how to show just 1 poster? … cancel multiple class schedules … efficient."
// · Opening the cancellation picture for a class also looks at the student's other cancelled classes (yesterday → 3 weeks ahead).
//   When there are more, ONE picture lists them all: "Cancelled classes · 2 · 已取消课程 2节" with each date and time (EN + 中文),
//   the teacher(s) and the reason. A button switches between "all N in one picture" and "only this class".
// · "Copy as text" follows the same choice.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>'); if (i < 0) { console.error('no body'); process.exit(1); }
s = s.slice(0, i) + String.raw`<script>
/* 779 · several cancelled classes in one picture */
(function(){
  if(window.__779 || typeof window.cxProof !== 'function') return; window.__779 = 1;
  const up = x => String(x || '').trim().toUpperCase();
  const WD = '日一二三四五六';
  const hm = d => String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  const mins = x => Math.round((new Date(x.end) - new Date(x.start)) / 6e4);
  const tN = t => String(t || '').split(/\s*[,&/]\s*/).filter(Boolean);
  window.cxMultiRows = function(P){ const L = P.multi.slice().sort((a, b) => new Date(a.start) - new Date(b.start));
    const en = L.map(x => { const d = new Date(x.start), e2 = new Date(x.end); return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) + ' · ' + hm(d) + '–' + hm(e2) + ' · ' + mins(x) + ' min'; });
    const zh = L.map(x => { const d = new Date(x.start), e2 = new Date(x.end); return (d.getMonth() + 1) + '月' + d.getDate() + '日 星期' + WD[d.getDay()] + ' · ' + hm(d) + '–' + hm(e2); });
    const T = [...new Set(L.flatMap(x => tN(x.teacher)).map(t => t.replace(/^teacher\s+/i, '').trim()).filter(Boolean))];
    return [['Cancelled classes · ' + L.length + ' · Beijing time', '已取消 ' + L.length + ' 节课', en, zh], [T.length > 1 ? 'Teachers' : 'Teacher', '老师', [T.map(t => tName(t)).join(' · ')], [T.map(t => tZh(t)).join(' · ')]]]; };
  window.cxMultiText = function(P){ const L = P.multi.slice().sort((a, b) => new Date(a.start) - new Date(b.start));
    const T = [...new Set(L.flatMap(x => tN(x.teacher)).map(t => t.replace(/^teacher\s+/i, '').trim()).filter(Boolean))];
    return 'Cancelled classes 已取消课程: ' + L.length + '节\n' + L.map(x => { const d = new Date(x.start), e2 = new Date(x.end); return '• ' + d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }) + ' · ' + (d.getMonth() + 1) + '月' + d.getDate() + '日 星期' + WD[d.getDay()] + ' · ' + hm(d) + '–' + hm(e2) + ' (' + mins(x) + ' min 分钟)'; }).join('\n')
      + '\nBeijing time 北京时间\nTeacher 老师: ' + T.map(t => tName(t) + ' · ' + tZh(t)).join(' / '); };
  function bar(){ const P = CXP, img = document.getElementById('cxImg'); if(!P || P.kind !== 'cancel' || !img) return; let b = document.getElementById('cxMulti');
    const n = (P.allX || []).length; if(n < 2){ if(b) b.remove(); return; }
    const on = P.multi && P.multi.length > 1;
    const h = '<div id="cxMulti" style="margin:12px 0 4px;padding:10px 12px;border-radius:12px;background:#FFF4EC;border:1px solid #F3D3BE;font-size:13px;display:flex;gap:10px;align-items:center;flex-wrap:wrap"><span class="grow">'
      + (on ? '📋 <b>' + n + ' cancelled classes in one picture</b> · ' + esc(P.allX.map(x => new Date(x.start).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })).join(', ')) : 'This student has <b>' + n + ' cancelled classes</b> coming up')
      + '</span><button type="button" class="btn sm ' + (on ? 'ghost' : 'teal') + '" onclick="cxMultiToggle()">' + (on ? 'Only this class' : 'All ' + n + ' in one picture') + '</button></div>';
    if(b) b.outerHTML = h; else img.insertAdjacentHTML('beforebegin', h); }
  window.cxMultiToggle = () => { const P = CXP; if(!P) return; P.multi = P.multi && P.multi.length > 1 ? null : P.allX.slice(); P.url = ''; bar(); cxDraw(); };
  const _sh = window.cxSheet; window.cxSheet = function(){ const r = _sh.apply(this, arguments); try{ bar(); }catch(e){} return r; };
  const _p = window.cxProof;
  window.cxProof = function(i, src){ const r = _p.apply(this, arguments);
    try{ const P = CXP; if(!P || P.kind !== 'cancel') return r; const e = P.e, code = up(e.code || (String(e.title || '').match(/ST-\d{4}-\d{3}/i) || [''])[0]); if(!code) return r;
      const go = L => { if(CXP !== P || !Array.isArray(L)) return; const a = Date.now() - 2 * 864e5, b = Date.now() + 21 * 864e5, t0 = new Date(e.start).getTime();
        const X = L.filter(c => c && c.cancelled && (x => x >= a && x <= b)(new Date(c.start).getTime()) && Math.abs(new Date(c.start).getTime() - t0) > 6e4);
        if(!X.length) return; P.allX = [Object.assign({}, e)].concat(X.map(c => Object.assign({ teacher: c.teacher || (c.teachers || []).join(', ') }, c))).sort((p, q) => new Date(p.start) - new Date(q.start));
        P.multi = P.allX.slice(); P.url = ''; bar(); cxDraw(); };
      if(Array.isArray(CLSM[code])) go(CLSM[code]);
      api('mgmtStuClasses', TOKEN, code).then(L => { if(Array.isArray(L)){ CLSM[code] = L; if(!(P.allX && P.allX.length > 1)) go(L); } }).catch(() => {}); }catch(e){}
    return r; };
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, [
  [": [['Date', '日期', [date], [dateZh]], ['Time', '时间', [tl(e)], ['Beijing time · 北京时间 · ' + dur(e) + '分钟']], ['Teacher', '老师', [tName(e.teacher || '')], [tZh(e.teacher)]]];",
   ": (P.kind === 'cancel' && P.multi && P.multi.length > 1 && window.cxMultiRows) ? cxMultiRows(P) : [['Date', '日期', [date], [dateZh]], ['Time', '时间', [tl(e)], ['Beijing time · 北京时间 · ' + dur(e) + '分钟']], ['Teacher', '老师', [tName(e.teacher || '')], [tZh(e.teacher)]]];"],
  [": `Date 日期: ${dl(s)}\\nTime 时间:",
   ": (CXP.kind === 'cancel' && CXP.multi && CXP.multi.length > 1 && window.cxMultiText) ? cxMultiText(CXP) : `Date 日期: ${dl(s)}\\nTime 时间:"]
]);
