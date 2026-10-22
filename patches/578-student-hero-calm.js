// 22 Oct · Misty: "When opening the STUDENT, it feels bland, can we redesign better, and I want the city also above.
// Make it minimal while maintaining necessary info is there."
// The top card is regrouped in two quiet lines with small icons instead of a wall of grey pills:
//   line 1 · who:      ST code · age · grade · city · with us since
//   line 2 · learning: teachers · book · partner · email
// Name + status stay on top; the three numbers become one slim strip; the week row is unchanged.
// Elements are only moved (not rebuilt), so every tap (copy email, add birthdate) keeps working.
require('../tools/lib.js')(process.argv[2], [
["</body>", `<script>
/* 22 Oct · 578 · Student page top card: calmer, two lines, city added (management only) */
(function(){
  const I = p => '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + '</svg>';
  const IC = {
    id: I('<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M7 10h5M7 14h3"/><circle cx="16.5" cy="11.5" r="2"/>'),
    age: I('<path d="M5 21h14"/><path d="M6 21v-7h12v7"/><path d="M6 17c2 1.3 4 1.3 6 0s4-1.3 6 0"/><path d="M12 14v-3"/><path d="M12 8.5c-1-1-1-2.2 0-3.5 1 1.3 1 2.5 0 3.5z"/>'),
    city: I('<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>'),
    len: I('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>'),
    tch: I('<circle cx="12" cy="8" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/>'),
    book: I('<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/>'),
    mail: I('<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m4 7 8 6 8-6"/>')
  };
  const css = document.createElement('style');
  css.textContent = \`
#sheetBody.stu2 .shero{align-items:flex-start;gap:14px 18px;padding:20px 22px!important}
#sheetBody.stu2 .shero .av.big{width:54px;height:54px;font-size:22px;background:#EEF8F7!important;color:#00737B!important;box-shadow:none!important;border:0!important;margin-top:2px}
#sheetBody.stu2 .shero h1{font-size:27px!important;gap:8px 10px!important;margin:0}
#sheetBody.stu2 .shero h1 .cn{font-size:17px}
#sheetBody.stu2 .shero h1 .stp{font-size:11.5px;padding:5px 9px}
#sheetBody.stu2 .shero h1 .vn{font-size:12px!important;font-weight:600!important;background:none!important;border:0!important;padding:0!important;color:#B05A16!important;font-family:inherit!important;letter-spacing:0!important}
#sheetBody.stu2 .shero h1 .vn i{display:none}
#sheetBody.stu2 .shero .grow .hl{display:flex;flex-wrap:wrap;align-items:center;gap:6px 18px;margin-top:8px!important}
#sheetBody.stu2 .shero .grow .hl+.hl{margin-top:6px!important}
#sheetBody.stu2 .shero .grow .hl>*{display:inline-flex!important;align-items:center;gap:6px;background:none!important;border:0!important;box-shadow:none!important;padding:0!important;border-radius:0!important;font-size:13.5px!important;font-weight:500!important;color:#4A4566!important;line-height:1.35;white-space:nowrap}
#sheetBody.stu2 .shero .grow .hl>* svg{flex:none;color:#A5A1B8;opacity:1!important}
#sheetBody.stu2 .shero .grow .hl .h-code{font-variant-numeric:tabular-nums;letter-spacing:.02em;color:#2B2253!important;font-weight:700!important}
#sheetBody.stu2 .shero .grow .hl .teal{color:#00737B!important;font-weight:600!important}
#sheetBody.stu2 .shero .grow .hl .teal svg{color:#7CC3C0}
#sheetBody.stu2 .shero .grow .hl .teal+.teal{margin-left:-12px}
#sheetBody.stu2 .shero .grow .hl .teal+.teal::before{content:"·";color:#B9B6C8;margin-right:2px}
#sheetBody.stu2 .shero .grow .hl .sa-src{color:#5B4FA0!important;font-weight:600!important}
#sheetBody.stu2 .shero .grow .hl .sa-src svg{color:#9C93CF}
#sheetBody.stu2 .shero .grow .hl .age-chip.q{color:#B05A16!important;cursor:pointer}
#sheetBody.stu2 .shero .grow .hl .em-chip:hover,#sheetBody.stu2 .shero .grow .hl .age-chip.q:hover{text-decoration:underline}
#sheetBody.stu2 .shero .grow .hl .len-chip{color:#00737B!important}
#sheetBody.stu2 .shero .kpis{gap:0!important;background:#F7F7FA;border-radius:16px;padding:4px;align-self:center}
#sheetBody.stu2 .shero .kpis>div{background:transparent!important;border:0!important;box-shadow:none!important;border-radius:12px!important;padding:8px 14px!important;min-width:74px}
#sheetBody.stu2 .shero .kpis>div+div{position:relative}
#sheetBody.stu2 .shero .kpis>div+div::before{content:"";position:absolute;left:0;top:22%;bottom:22%;border-left:1px solid #E6E4EE}
#sheetBody.stu2 .shero .kpis>div.k-soon{background:#FDF4E3!important}
#sheetBody.stu2 .shero .kpis>div.k-now{background:#FBECE8!important}
#sheetBody.stu2 .shero .kpis>div.k-soon+div::before,#sheetBody.stu2 .shero .kpis>div.k-now+div::before{display:none}
#sheetBody.stu2 .shero .kpis b{font-size:21px!important;line-height:1.1}
#sheetBody.stu2 .shero .kpis span{font-size:11.5px!important}
#sheetBody.stu2 .shero .kpis em{font-size:10.5px!important}
@media(max-width:620px){#sheetBody.stu2 .shero{padding:16px!important}#sheetBody.stu2 .shero .grow .hl{gap:6px 14px}#sheetBody.stu2 .shero .grow .hl>*{font-size:13px!important}#sheetBody.stu2 .shero .kpis{width:100%}#sheetBody.stu2 .shero h1{font-size:23px!important}}
\`;
  document.head.appendChild(css);
  const cityOf = code => { try{ if(!(D && D.mgr) || typeof DB === 'undefined' || !DB || !DB.rows) return ''; const r = DB.rows.find(x => String(x[0]).trim().toUpperCase() === String(code).toUpperCase()); const v = r ? String(r[9] || '').trim() : ''; return /^n\\/?a$/i.test(v) ? '' : v; }catch(e){ return ''; } };
  const kind = el => el.classList.contains('h-city') ? 'city' : el.classList.contains('age-chip') ? 'age' : el.classList.contains('len-chip') ? 'len'
    : el.classList.contains('em-chip') ? 'mail' : el.classList.contains('sa-src') ? 'src' : el.classList.contains('teal') ? 'tch' : el.classList.contains('coral') ? 'shared'
    : /^ST-\\d{4}-\\d+$/i.test(el.textContent.trim()) ? 'id' : 'book';
  const LINE = { id: 0, age: 0, city: 0, len: 0, tch: 1, book: 1, shared: 1, src: 1, mail: 1 };
  const ORD = ['id', 'age', 'city', 'len', 'tch', 'book', 'shared', 'src', 'mail'];
  let busy = 0;
  function tidy(){
    const body = $('sheetBody'); if(!body || typeof STU === 'undefined' || !STU || !STU.code) return; const hero = body.querySelector('.shero'); if(!hero) return;
    const grow = hero.querySelector('.grow'); if(!grow) return;
    busy = 1;
    try{
      let L = [...grow.querySelectorAll(':scope>.hl')];
      if(L.length < 2){
        const first = grow.querySelector(':scope>.row'); if(!first) return;
        const a = document.createElement('div'); a.className = 'row hl h-who'; first.parentNode.insertBefore(a, first);
        first.classList.add('hl', 'h-learn'); first.removeAttribute('style'); L = [a, first]; }
      if(!grow.querySelector('.h-city')){ const c = cityOf(STU.code); if(c){ const s = document.createElement('span'); s.className = 'chip h-city'; s.title = 'Living city'; s.textContent = c; L[0].appendChild(s); } }
      const items = []; grow.querySelectorAll(':scope>.row>*').forEach(el => items.push(el));
      items.sort((x, y) => ORD.indexOf(kind(x)) - ORD.indexOf(kind(y)));
      items.forEach(el => { const k = kind(el), dst = L[LINE[k] == null ? 1 : LINE[k]];
        const fix = (re, to) => { const tx = el.textContent; if(re.test(tx)){ const sv = el.querySelector('svg'); el.textContent = tx.replace(re, to); if(sv) el.prepend(sv); } };
        if(k === 'tch'){ fix(/^\\s*Teacher\\s+/i, ''); el.title = 'Teacher'; }
        if(k === 'mail') fix(/^\\s*✉\\s*/, '');
        if(k === 'age') fix(/\\s*yrs old/i, ' yrs');
        if(!el.dataset.hi){ el.dataset.hi = 1; if(k === 'id') el.classList.add('h-code');
          const ic = k === 'tch' ? (el.previousElementSibling && kind(el.previousElementSibling) === 'tch' ? '' : IC.tch) : IC[k];
          if(ic && !el.querySelector('svg')) el.insertAdjacentHTML('afterbegin', ic); }
        dst.appendChild(el); });
      /* only the first teacher keeps the icon */
      L[1].querySelectorAll('.teal').forEach((el, i) => { const s = el.querySelector('svg'); if(i > 0 && s) s.remove(); if(i === 0 && !s) el.insertAdjacentHTML('afterbegin', IC.tch); });
      L.forEach(l => { l.style.display = l.children.length ? '' : 'none'; });
    } finally { setTimeout(() => { busy = 0; }, 0); }
  }
  let t = 0, mo = null;
  function watch(){ const hero = document.querySelector('#sheetBody .shero'); if(!hero || hero.dataset.hw) return; hero.dataset.hw = 1;
    try{ mo = new MutationObserver(() => { if(busy) return; clearTimeout(t); t = setTimeout(tidy, 30); }); mo.observe(hero.querySelector('.grow') || hero, { childList: true, subtree: true }); }catch(e){} }
  const _sr = window.stuRender; if(_sr) window.stuRender = function(){ const r = _sr.apply(this, arguments); try{ tidy(); watch(); setTimeout(tidy, 450); setTimeout(tidy, 1500); }catch(e){} return r; };
})();
</script>
</body>`],
]);
