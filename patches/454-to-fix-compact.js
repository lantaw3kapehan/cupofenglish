// 20 Oct · Growth page "To fix · last 7 days": a summary by type (click to filter) and one line per class, grouped by day.
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + `/* 20 Oct · 454 · Misty: "how about this part?" (To fix · last 7 days was one tall card per class).
   · Top: one coloured chip per kind of miss with its count (No "I'm in" · No class note · Late time-in · Video late …); click to show only that kind.
   · Then the classes grouped by day ("Wed 14 Oct · 5"), one short line each: time · student · what to fix. Same items, nothing removed. */
(function(){
  const css = document.createElement('style');
  css.textContent = \`
.tf54 .sm{display:flex;flex-wrap:wrap;gap:6px;margin:4px 0 10px}
.tf54 .sm button{all:unset;cursor:pointer;display:inline-flex;align-items:center;gap:6px;padding:5px 12px;border-radius:999px;font-size:12.5px;background:var(--bg);color:var(--c);border:1.5px solid transparent}
.tf54 .sm button b{font-size:14px}
.tf54 .sm button.on{border-color:var(--c)}
.tf54 .dy{font-size:11px;letter-spacing:.07em;text-transform:uppercase;color:#8A86A0;margin:10px 2px 4px}
.tf54 .r{display:grid;grid-template-columns:52px minmax(0,1fr) auto;gap:10px;align-items:center;padding:6px 10px;border-radius:10px;font-size:13.5px}
.tf54 .r:nth-child(even){background:#FAFAFC}
.tf54 .r b{font-variant-numeric:tabular-nums}
.tf54 .r .ch{display:flex;flex-wrap:wrap;gap:4px;justify-content:flex-end}
.tf54 .r .ch span{font-size:11.5px;padding:2px 9px;border-radius:999px;background:var(--bg);color:var(--c);font-weight:600}\`;
  document.head.appendChild(css);
  const KC = t => /I.m in|time-in/i.test(t) ? (/Late/i.test(t) ? ['#B07A10', '#FCF1DC'] : ['#C0563F', '#FDF1EE']) : /note/i.test(t) ? ['#6C5FC7', '#F2F0FB'] : /video/i.test(t) ? ['#3B82B5', '#EEF4FA'] : /homework/i.test(t) ? ['#00808A', '#E8F6F7'] : ['#55526E', '#F1F0F6'];
  function run(root){ if(!root) return; root.querySelectorAll('section.sec').forEach(s => { const h = s.querySelector('h2'); if(!h || !/^To fix/.test(h.textContent.trim()) || s.dataset.f54) return;
      const L = [...s.querySelectorAll(':scope > .li')]; if(!L.length) return; s.dataset.f54 = 1;
      const R = L.map(li => { const t = (li.querySelector('b') || {}).textContent || '', m = t.match(/^(\\w{3},? \\d{1,2} \\w{3})\\s+(\\d{1,2}:\\d{2})\\s*·\\s*(.*)$/); return { day: m ? m[1].replace(",", "") : t, at: m ? m[2] : '', who: m ? m[3] : '', items: [...li.querySelectorAll('.chip')].map(c => c.textContent.trim()) }; });
      const cnt = {}; R.forEach(r => r.items.forEach(i => cnt[i] = (cnt[i] || 0) + 1));
      const days = []; R.forEach(r => { let d = days.find(x => x.d === r.day); if(!d){ d = { d: r.day, L: [] }; days.push(d); } d.L.push(r); });
      const box = document.createElement('div'); box.className = 'tf54';
      box.innerHTML = '<div class="sm">' + Object.keys(cnt).sort((a, b) => cnt[b] - cnt[a]).map(k => { const c = KC(k); return '<button type="button" data-k="' + esc(k) + '" style="--c:' + c[0] + ';--bg:' + c[1] + '"><b>' + cnt[k] + '</b>' + esc(k) + '</button>'; }).join('') + '</div>' +
        days.map(d => '<div class="dg"><div class="dy">' + esc(d.d) + ' · ' + d.L.length + '</div>' + d.L.map(r => '<div class="r" data-i="' + esc(r.items.join('|')) + '"><b>' + esc(r.at) + '</b><span class="ell">' + esc(r.who) + '</span><span class="ch">' + r.items.map(i => { const c = KC(i); return '<span style="--c:' + c[0] + ';--bg:' + c[1] + '">' + esc(i) + '</span>'; }).join('') + '</span></div>').join('') + '</div>').join('');
      L.forEach(li => li.remove()); h.after(box);
      box.querySelectorAll('.sm button').forEach(b => b.onclick = () => { const on = !b.classList.contains('on'); box.querySelectorAll('.sm button').forEach(x => x.classList.remove('on')); if(on) b.classList.add('on');
        box.querySelectorAll('.r').forEach(r => r.style.display = !on || r.dataset.i.split('|').includes(b.dataset.k) ? '' : 'none');
        box.querySelectorAll('.dg').forEach(g => g.style.display = [...g.querySelectorAll('.r')].some(r => r.style.display !== 'none') ? '' : 'none'); }); }); }
  let q = 0; new MutationObserver(() => { if(q) return; q = requestAnimationFrame(() => { q = 0; try{ run(document.getElementById('sheetBody')); run(document.getElementById('v-growth')); }catch(e){ console.warn('f54', e); } }); }).observe(document.body, { childList: true, subtree: true });
})();
` + "</script>\n\n</body>"]]);
