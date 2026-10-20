/* 20 Oct · 413 · Time-ins below the timeline, calmer and without repeats (Misty: "the parts below still feel off").
   The timeline already shows every teacher, so the long teacher list no longer repeats it:
   · "Needs a look" (only when something is wrong): the teacher rows that are late, missing, not on the app, on weak
     internet or past due — with their internet, place and proof.
   · "Office": My time-in (with Time out) and the office staff, side by side as small cards.
   · "Each teacher's details" (internet, place, device, proof for everyone) folds into the closed rows under More. */
(function(){
  const css = document.createElement('style');
  css.textContent = `
#v-team .t13h{display:flex;align-items:baseline;gap:10px;margin:22px 2px 8px}
#v-team .t13h b{font-size:16px;color:var(--ink)}
#v-team .t13h span{font-size:12.5px;color:#8A86A0}
#v-team .t13-look{border:1px solid var(--line);border-left:4px solid #D4705A;border-radius:var(--r-lg);box-shadow:var(--sh1);background:#fff;overflow:hidden}
#v-team .t13-off{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:12px}
#v-team .t13-off>*{margin:0!important;border:1px solid var(--line)!important;border-radius:var(--r-lg)!important;box-shadow:var(--sh1)!important;background:#fff!important}
#v-team .t13-off .ti-r{display:flex!important;flex-wrap:wrap;align-items:center;gap:6px 14px;padding:12px 14px!important}
#v-team .t13-off .ti-r .ti-who{flex:1 1 160px;min-width:0}
#v-team .t13-off .ti-r .ti-in{flex:0 0 auto}
#v-team .t13-off .ti-r .ti-tags{flex:1 1 100%;order:5}
#v-team .t13-off .ti-r .ti-d{flex:1 1 100%;order:6}
#v-team .t13-off .tin{display:flex;align-items:center;gap:12px;padding:12px 16px!important}`;
  document.head.appendChild(css);
  function h2With(v, re){ return [...v.querySelectorAll(':scope > h2')].find(h => re.test(h.textContent)); }
  function tidy(){ const v = $('v-team'); if(!v || v.querySelector('.t13h')) return;
    const more = v.querySelector('.tgrp-h');
    const tH = h2With(v, /^Teachers today/), tL = tH && tH.nextElementSibling && tH.nextElementSibling.classList.contains('ti-list') ? tH.nextElementSibling : null;
    const off = tL && tL.nextElementSibling && /^No class today/.test(tL.nextElementSibling.textContent || '') ? tL.nextElementSibling : null;
    const mH = h2With(v, /^My time-in/), mB = mH ? mH.nextElementSibling : null;
    const oH = h2With(v, /^Office/), oL = oH && oH.nextElementSibling && oH.nextElementSibling.classList.contains('ti-list') ? oH.nextElementSibling : null;
    const anchor = tH || mH || oH; if(!anchor) return;
    /* needs a look */
    if(tL){ const bad = [...tL.querySelectorAll('.ti-r')].filter(r => r.classList.contains('bad') || r.querySelector('.ti-in.ti2-over') || r.querySelector('.ti-q.weak, .ti-q.bad') || /Not on app/.test(r.textContent));
      if(bad.length){ anchor.insertAdjacentHTML('beforebegin', '<div class="t13h"><b>Needs a look</b><span>' + bad.length + ' teacher' + (bad.length === 1 ? '' : 's') + ' · late, missing, not on the app or weak internet</span></div><div class="t13-look ti-list"></div>'); const box = anchor.previousElementSibling; bad.forEach(r => box.appendChild(r.cloneNode(true))); } }
    /* office: my time-in + office staff */
    if(mB || oL){ anchor.insertAdjacentHTML('beforebegin', '<div class="t13h"><b>Office</b><span>your time-in and the office team</span></div><div class="t13-off"></div>'); const g = anchor.previousElementSibling;
      if(mB && mB.classList.contains('tin')) g.appendChild(mB); if(oL) [...oL.children].forEach(r => g.appendChild(r)); [mH, oH, oL].forEach(x => { if(x) x.remove(); }); }
    /* teacher details → folded under More */
    if(tH && tL){ const O = (() => { try{ return JSON.parse(localStorage.getItem('coe.tgrp') || '{}') || {}; }catch(e){ return {}; } })();
      const d = document.createElement('details'); d.className = 'tgrp'; if(O.tdet) d.open = true; d.setAttribute('ontoggle', "tgrpT('tdet',this)");
      d.innerHTML = '<summary>Each teacher’s details<span>time-in, internet, place, device and proof for everyone</span></summary><div></div>'; const box = d.querySelector('div'); box.appendChild(tL); if(off) box.appendChild(off);
      if(more) more.insertAdjacentElement('afterend', d); else v.appendChild(d); tH.remove(); }
  }
  const r0 = window.renderTeam; if(r0) window.renderTeam = function(){ const r = r0.apply(this, arguments); try{ tidy(); }catch(e){ console.warn('t13', e); } return r; };
  try{ if(typeof VIEW !== 'undefined' && VIEW === 'team') renderTeam(); }catch(e){}
})();
