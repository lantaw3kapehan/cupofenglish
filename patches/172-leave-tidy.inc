(function(){
  // 15 Oct · Leave, tidied: when the three counts are all 0 they become one calm "all clear" line (and the empty
  // "On leave now" section goes); a request waiting for approval turns its tile coral; the 4-step flow becomes a small strip.
  const css = `
#v-leave .lv2-ok{display:flex;align-items:center;gap:10px;margin-top:14px;padding:12px 16px;border-radius:14px;background:#E3F4EC;color:#1C6B4C;font-size:14px}
#v-leave .lv2-ok b{font-family:var(--brand);font-weight:400;font-size:17px}
#v-leave .stat.lv2-hot{background:#FBEAE5;border-color:#F3C9BD}#v-leave .stat.lv2-hot b{color:#A1452F}
#v-leave .lv2-flow{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px;font-size:12.5px;color:#6F6B85}
#v-leave .lv2-flow span{padding:4px 10px;border-radius:999px;background:#F3F4F8}
#v-leave .lv2-flow i{font-style:normal;color:#B5B3C4;align-self:center}`;
  const st = document.createElement('style'); st.id = 'lv2css'; st.textContent = css; document.head.appendChild(st);
  const _r = window.renderLeave;
  window.renderLeave = function(){ const r = _r.apply(this, arguments);
    try{ const v = $('v-leave'); if(!v) return r; const S = v.querySelector('.stats'); if(!S) return r;
      const T = [...S.querySelectorAll('.stat')], n = T.map(t => +((t.querySelector('b') || {}).textContent || 0) || 0);
      if(T[2] && n[2] > 0) T[2].classList.add('lv2-hot');
      if(n.length && n.every(x => !x)){ S.outerHTML = '<div class="lv2-ok"><b>✓ All clear</b> · nobody on leave today · none coming up · nothing waiting for your approval</div>';
        const h = [...v.querySelectorAll('h2')].find(x => /On leave now/.test(x.textContent)); if(h && h.nextElementSibling && h.nextElementSibling.classList.contains('tdok')){ h.nextElementSibling.remove(); h.remove(); } }
      const fl = [...v.querySelectorAll('.small.mute')].find(x => /Teacher asks with proof/.test(x.textContent));
      if(fl) fl.outerHTML = '<div class="lv2-flow">' + ['Teacher asks with proof', 'Operations checks', 'President approves', 'Teacher sees it in the app'].map(s => '<span>' + s + '</span>').join('<i>→</i>') + '</div>';
    }catch(e){ console.warn('leave tidy', e); }
    return r; };
  try{ if(VIEW === 'leave') renderLeave(); }catch(e){}
})();
