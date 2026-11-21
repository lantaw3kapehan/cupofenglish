// 2556 (Misty 21 Nov 09:29): "Course books" is the last trial step, after the Class notice: the Course Books picture
// (covers + Taobao search words) for the parent. Opening it ticks the step (coe-hw: trialMark k "books"). 11 steps now.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["      { k: 'welcome', title: 'Class notice', done: !!m.welcome, sub: mk('welcome'), undo: 1 }   /* 2555: Class notice (the welcome to the WeChat group) */",
   "      { k: 'welcome', title: 'Class notice', done: !!m.welcome, sub: mk('welcome'), undo: 1 },   /* 2555: Class notice (the welcome to the WeChat group) */\n      { k: 'books', title: 'Course books', done: !!m.books, sub: mk('books'), undo: 1 }   /* 2556: the Course Books picture, last */"],
  ["agree: 'Agreement', welcome: 'Class notice' };", "agree: 'Agreement', welcome: 'Class notice', books: 'Course books' };\n    { let br = rowOf(el, 'Course books'); const cn2 = rowOf(el, 'Class notice');   /* 2556: the Course books row, after the Class notice */\n      if(!br && cn2){ br = document.createElement('div'); br.className = 'tl4-r'; br.innerHTML = '<div class=\"tl4-n\">11</div><div class=\"tl4-t\"><b>Course books</b><span>The covers and the Taobao search words · so the parent buys the right books</span></div><div class=\"tl4-a\"><button class=\"btn ghost\">Open</button></div>';\n        br.querySelector('button').onclick = ev => { ev.preventDefault(); ev.stopPropagation(); const bk = window.bk2556 ? bk2556(t) : ''; if(!bk || !window.bbOpen){ toast('No book on the package yet · add it on the student\\'s package'); return; } mark(t, 'books', true); closeSheet(); bbOpen(bk, String(t.student || '').replace(/[\\u3000-\\u9fff\\uff00-\\uffef].*$/, '').trim() || t.code, t.cn || ''); };\n        cn2.after(br); } else if(br && cn2 && cn2.nextElementSibling !== br) cn2.after(br); }"],
  ["    p.innerHTML = '<div class=\"h\"><b>' + st.n + ' of 10 done</b>' + (st.nx ? '<span>Next: ' + E(st.nx.title) + '</span>' : '<span>All done ✓</span>') + '</div><div class=\"bar\"><i style=\"width:' + (st.n * 10) + '%\"></i></div>'; }",
   "    p.innerHTML = '<div class=\"h\"><b>' + st.n + ' of ' + st.L.length + ' done</b>' + (st.nx ? '<span>Next: ' + E(st.nx.title) + '</span>' : '<span>All done ✓</span>') + '</div><div class=\"bar\"><i style=\"width:' + Math.round(st.n * 100 / st.L.length) + '%\"></i></div>'; }"],
  ["'</span><b>' + st.n + ' of 10</b>'", "'</span><b>' + st.n + ' of ' + st.L.length + '</b>'"],
  ['<script id="b2278">', `<script id="b2556">
/* 21 Nov · 2556 · the book of a trial student's package, for the Course books step (newest package first) */
window.bk2556 = function(t){ try{ const code = String(t.code || '').toUpperCase();
    if(typeof AT !== 'undefined' && AT && AT.cols){ const C = {}; AT.cols.forEach((c, i) => C[c] = i); const R = AT.rows.filter(r => String(r[C.code] || '').toUpperCase() === code).sort((a, b) => String(b[C.start] || '').localeCompare(String(a[C.start] || '')));
      for(const r of R){ const b = (C.book != null && r[C.book]) || (C.course != null && r[C.course]); if(b) return String(b).split(/\\s*[,;/]\\s*/)[0]; } }
    if(typeof D !== 'undefined' && D && D.schedule){ const c = D.schedule.find(x => String(x.code || '').toUpperCase() === code && x.book); if(c) return String(c.book).split(/\\s*[,;/]\\s*/)[0]; }
    return t.book || ''; }catch(e){ return t.book || ''; } };
</script>
<script id="b2278">`],
]);
