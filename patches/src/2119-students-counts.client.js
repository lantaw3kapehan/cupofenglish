/* 2119 (12 Nov audit): Students showed the first 60 rows only (2058), so the Source and Learner counts (60 instead of 223) and the
   Learner filter (it hid rows among those 60 only) were wrong. Now every row is drawn (light: rows off screen are not painted), the
   counts and filters see everyone, and only the length is kept short: rows after the 60th stay folded until "Show all" or a filter. */
(function(){
  if(window.__as2119) return; window.__as2119 = 1;
  window.ASLIM2058 = 1e4;
  const fold = () => { try{ const v = document.getElementById('v-astudents'); if(!v) return; const rows = v.querySelectorAll('.li.sa[onclick^="openStudent"], .li[onclick^="openStudent"]');
      let b = v.querySelector('.as2119'); if(v.classList.contains('all2119') || rows.length <= 60){ if(b) b.remove(); rows.forEach(r => r.classList.remove('f2119')); return; }
      rows.forEach((r, i) => r.classList.toggle('f2119', i >= 60));
      if(!b){ b = document.createElement('button'); b.type = 'button'; b.className = 'as2058 as2119'; b.onclick = () => { v.classList.add('all2119'); fold(); }; }
      b.textContent = 'Show all ' + rows.length + ' students'; if(b.previousElementSibling !== rows[59]) rows[59].after(b); }catch(e){} };
  const r0 = window.renderAStudents; if(typeof r0 === 'function') window.renderAStudents = function(){ const r = r0.apply(this, arguments); fold(); return r; };
  document.head.insertAdjacentHTML('beforeend', '<style id="d2119">#v-astudents .li.f2119{display:none!important}#v-astudents[data-ltf] .li.f2119{display:revert!important}#v-astudents[data-ltf] .as2119{display:none}#v-astudents .li[onclick^="openStudent"]{content-visibility:auto;contain-intrinsic-size:auto 92px}</style>');
  fold();
})();
