(function(){
  // 15 Oct · Management To do, made faster to work through (Misty: "efficient and highly productive").
  //  · "Today's focus" becomes "Do next": each item carries its own buttons (Copy reminder / ✓ Sent, Copy message /
  //    ✓ Message sent, Send…), so the day's work is done from the top of the page without scrolling;
  //  · counts that are 0 and sections with nothing in them fold into one "✓ All clear" line;
  //  · rows are shorter: buttons side by side instead of stacked, smaller number badge;
  //  · the closed sections at the bottom are one even height.
  const css = `
#v-mtoday .tdsum{display:flex;flex-wrap:wrap;gap:10px}#v-mtoday .tdsum a{flex:0 1 230px;min-width:180px}
#v-mtoday .tdsum a.ok{display:none}
#v-mtoday .td2-ok{flex:1 1 260px;display:flex;flex-wrap:wrap;align-items:center;gap:4px 10px;padding:10px 16px;border-radius:14px;background:#F2F8F5;color:#2F6B4F;font-size:13.5px}
#v-mtoday .td2-ok b{font-weight:700}
#v-mtoday .td2-ok a{color:#2F6B4F;text-decoration:underline;text-underline-offset:2px;cursor:pointer}
#v-mtoday #tdFocus{border:1.5px solid #00A3AD;background:linear-gradient(180deg,#F3FBFB 0,#fff 90px)}
#v-mtoday #tdFocus h2{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap}
#v-mtoday #tdFocus .li{display:flex;align-items:center;gap:12px;padding:10px 8px;border-radius:14px;border-top:1px solid #EEF0F4}
#v-mtoday #tdFocus .li:first-of-type{border-top:0}
#v-mtoday #tdFocus .li:hover{background:#F6FAFA}
#v-mtoday #tdFocus .li .grow{white-space:normal;line-height:1.35}
#v-mtoday .td2-n{width:26px;height:26px;flex:none;border-radius:13px;background:#E3F6F6;color:#00737B;font-family:var(--brand);font-size:14px;display:flex;align-items:center;justify-content:center}
#v-mtoday .td2-a{display:flex;gap:6px;flex:none}
#v-mtoday .td2-a .btn{min-height:36px;padding:0 14px;font-size:13.5px;white-space:nowrap}
#v-mtoday .td2-done{opacity:.45;pointer-events:none}
#v-mtoday .tdr{padding:12px 6px;gap:14px}
#v-mtoday .tdr .tdn{width:48px;padding:6px 0 5px;border-radius:12px}
#v-mtoday .tdr .tdn b{font-size:18px}
#v-mtoday .tdb{flex-direction:row;flex-wrap:wrap;justify-content:flex-end;align-items:center;gap:6px;min-width:0;max-width:360px}
#v-mtoday .tdb .btn{width:auto;min-height:36px;padding:0 14px;font-size:13.5px;white-space:nowrap}
#v-mtoday .tdr .tags{margin-top:6px}
#v-mtoday details.sec.tdx{padding:4px 18px}
#v-mtoday details.tdx summary{min-height:56px}
#v-mtoday details.tdx summary h2{margin:0;font-size:18px;display:flex;align-items:baseline;gap:10px;flex-wrap:wrap}
#v-mtoday details.tdx[open]{padding-bottom:14px}
@media(max-width:720px){
  #v-mtoday #tdFocus .li{flex-wrap:wrap}
  #v-mtoday #tdFocus .li{gap:8px 10px}
  #v-mtoday #tdFocus .li .grow{flex-basis:100%;order:2}
  #v-mtoday #tdFocus .li>.mute{display:none}
  #v-mtoday .td2-a{width:100%;order:3}
  #v-mtoday .td2-a .btn{flex:1}
  #v-mtoday .tdr .tags .chip{white-space:normal;max-width:100%;box-sizing:border-box}
  #v-mtoday .tdb{max-width:none;width:100%;justify-content:stretch}
  #v-mtoday .tdb .btn{flex:1}
}`;
  const st = document.createElement('style'); st.id = 'td2css'; st.textContent = css; document.head.appendChild(st);

  const SKIP = /^(Update|Change|Parent replied|Open trial reports)$/i;
  const LBL = { reports: 'Trial reports', renew: 'Renewals', follow: 'Trial follow-ups', fix: 'Data to fix' };
  function tidy(){
    const v = $('v-mtoday'); if(!v || !D || !D.mgr) return;
    // 1 · what is clear, in one line
    const clear = [];
    v.querySelectorAll('.tdsum a.ok').forEach(a => { const m = String(a.getAttribute('onclick') || '').match(/tdJump\('(\w+)'\)/); if(!m || !LBL[m[1]]) return;
      const due = v.querySelectorAll('#td-' + m[1] + ' [data-focus]').length;   // something in it is due today → not "all clear"
      if(due){ a.classList.remove('ok'); a.classList.add('hot'); const sm = a.querySelector('small'); if(sm){ sm.className = ''; sm.textContent = due + ' due now'; } return; }
      clear.push(LBL[m[1]]); });
    v.querySelectorAll('section.sec').forEach(s => { if(s.id === 'tdFocus') return; if(s.querySelector('.tdok') && !s.querySelector('.tdr,.tdl')) s.remove(); });
    const sum = v.querySelector('.tdsum'), old = v.querySelector('.td2-ok'); if(old) old.remove();
    if(sum){ const left = sum.querySelectorAll('a:not(.ok)').length;
      if(clear.length) sum.insertAdjacentHTML('beforeend', `<div class="td2-ok"><b>✓ All clear</b><span>${clear.map(esc).join(' · ')}</span></div>`); }
    // 2 · "Do next" with the buttons of each item
    const box = v.querySelector('#tdFocus'); if(!box) return;
    const src = [...v.querySelectorAll('[data-focus]')].filter(r => !box.contains(r));
    const h2 = box.querySelector('h2'); if(h2) h2.innerHTML = `Do next <span class="c">${src.length} thing${src.length === 1 ? '' : 's'} · act right here, or tap a line to see the details</span>`;
    box.querySelectorAll('.li').forEach((li, i) => {
      const r = src[i]; if(!r || li.querySelector('.td2-a')) return;
      li.insertAdjacentHTML('afterbegin', `<span class="td2-n">${i + 1}</span>`);
      const btns = [...r.querySelectorAll('button.btn')].filter(b => !SKIP.test(b.textContent.trim()) && !b.disabled).slice(0, 2);
      if(!btns.length) return;
      const wrap = document.createElement('div'); wrap.className = 'td2-a'; wrap.onclick = e => e.stopPropagation();
      btns.forEach((b, k) => { const c = b.cloneNode(true); c.classList.remove('block'); c.classList.add('sm'); c.classList.toggle('teal', k === 0); c.classList.toggle('ghost', k > 0);
        c.addEventListener('click', () => { if(k > 0 || /✓/.test(c.textContent)) li.classList.add('td2-done'); }); wrap.appendChild(c); });
      const chev = li.querySelector('.mute'); li.insertBefore(wrap, chev || null);
    });
  }
  const _r = window.renderMToday;
  window.renderMToday = function(){ const x = _r.apply(this, arguments); try{ tidy(); }catch(e){ console.warn('todo tidy', e); } return x; };
  try{ if(typeof VIEW !== 'undefined' && VIEW === 'mtoday') renderMToday(); }catch(e){}
})();
