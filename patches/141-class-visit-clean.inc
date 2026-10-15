(function(){
  const ST = s => /Needs work|Not yet/.test(s) ? ['#C0573A', '#FCEEE9'] : /Partly/.test(s) ? ['#A86A00', '#FFF4DE'] : /OK/.test(s) ? ['#5C6B73', '#F2F4F5'] : ['#1E7A55', '#EAF7F1'];
  const fd = d => { const x = new Date(String(d).slice(0, 10) + 'T12:00:00'); return isNaN(x) ? String(d || '') : x.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }); };
  const _va = window.vaOpen; window.vaOpen = function(id){ const r = _va.apply(this, arguments);
    try{ const b = $('sheetBody'); if(!b || !/Class visit/.test((b.querySelector('h1') || {}).textContent || '')) return r;
      if(!document.getElementById('vaCss')) document.head.insertAdjacentHTML('beforeend', '<style id="vaCss">.va-g{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px 18px;margin-top:14px}.va-r{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:6px 0;border-bottom:1px solid #EEF1F3;font-size:14px}.va-s{font-size:12px;font-weight:800;border-radius:99px;padding:2px 10px;white-space:nowrap}.va-fu{margin-top:12px;border:1px solid #EEE3C8;background:#FFFBF2;border-radius:14px;padding:10px 12px}.va-fu .small{margin-top:2px}@media(max-width:480px){.va-g{grid-template-columns:1fr}}</style>');
      const sub = b.querySelector('h1 + .mute.small'), box = [...b.children].find(x => x.tagName === 'DIV' && /display:\s*flex/.test(x.getAttribute('style') || '') && x.querySelector('.chip'));
      if(box){ const rows = [], extra = [];
        box.querySelectorAll('.chip').forEach(c => { const t = c.textContent.trim(), m = t.match(/^(.*?):\s*(.+)$/); if(m){ if(!(/^Follow-up$/i.test(m[1].trim()) && /Follow-up on /.test(b.textContent))) rows.push([m[1], m[2]]); } else extra.push(t); });
        rows.sort((a, c) => (/Needs work|Not yet/.test(c[1]) ? 2 : /Partly/.test(c[1]) ? 1 : 0) - (/Needs work|Not yet/.test(a[1]) ? 2 : /Partly/.test(a[1]) ? 1 : 0));
        if(sub && extra.length) sub.textContent += ' · ' + extra.join(' · ').toLowerCase();
        const g = document.createElement('div'); g.className = 'va-g';
        g.innerHTML = rows.map(([k, s]) => { const [fg, bg] = ST(s); return '<div class="va-r"><span>' + esc(k) + '</span><span class="va-s" style="color:' + fg + ';background:' + bg + '">' + esc(s) + '</span></div>'; }).join('');
        box.replaceWith(g); }
      const fu = [...b.querySelectorAll(':scope > .small')].find(x => /^Follow-up on /.test(x.textContent.trim()));
      if(fu){ const m = fu.textContent.trim().match(/^Follow-up on (\S+)\s*\(([\s\S]*)\):\s*(.+)$/);
        if(m){ const [fg, bg] = ST(m[3]); const d = document.createElement('div'); d.className = 'va-fu';
          d.innerHTML = '<div class="row" style="justify-content:space-between;gap:8px;align-items:center"><b class="small" style="margin:0">Follow-up from the ' + esc(fd(m[1])) + ' visit</b><span class="va-s" style="color:' + fg + ';background:' + bg + '">' + esc(m[3]) + '</span></div><div class="small mute">' + esc(m[2].trim()) + '</div>';
          fu.replaceWith(d); } }
    }catch(e){ console.warn('visit look', e); } return r; };
})();
