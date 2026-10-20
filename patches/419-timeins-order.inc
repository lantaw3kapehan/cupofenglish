/* 20 Oct · 419 · Time-ins final order (Misty: "organise and sort it best").
   1 Today: summary · timeline · needs a look · office   2 Checks: class records, visits, health, today in the app
   3 Full details, most used first: Teachers' time-ins · Each teacher's details · Management hours · Class records by teacher ·
     Latest changes · System health. Small labels mark the three parts. */
(function(){
  const css = document.createElement('style');
  css.textContent = `#v-team .lb19{margin:26px 2px 0;font-size:11.5px;letter-spacing:.08em;text-transform:uppercase;color:#8A86A0;display:flex;align-items:center;gap:10px}
#v-team .lb19:after{content:'';flex:1;border-top:1px solid var(--line)}
#v-team .tgrp-h{margin-top:26px!important;display:flex;align-items:center;gap:10px}#v-team .tgrp-h:after{content:'';flex:1;border-top:1px solid var(--line)}`;
  document.head.appendChild(css);
  function order(){ const v = $('v-team'); if(!v) return;
    const bd = v.querySelector('.bd14'); if(bd && !(bd.previousElementSibling && bd.previousElementSibling.classList.contains('lb19'))){ bd.insertAdjacentHTML('beforebegin', '<div class="lb19">Checks</div>'); }
    const t11 = v.querySelector('.t11'); if(t11 && !v.querySelector('.lb19.td')) t11.insertAdjacentHTML('beforebegin', '<div class="lb19 td" style="margin-top:16px">Today</div>');
    const h = v.querySelector('.tgrp-h'); if(!h) return; if(h.textContent !== 'Full details') h.textContent = 'Full details';
    const D = [...v.querySelectorAll('details.tgrp')], rank = d => { const t = (d.querySelector('summary') || {}).textContent || '';
      return /^Teachers’ time-ins/.test(t) ? 1 : /^Each teacher/.test(t) ? 2 : /^Management hours/.test(t) ? 3 : /^Class records/.test(t) ? 4 : /^Latest changes/.test(t) ? 5 : /^System health/.test(t) ? 6 : 9; };
    const S = D.slice().sort((a, b) => rank(a) - rank(b)); let at = h; S.forEach(d => { if(at.nextElementSibling !== d) at.insertAdjacentElement('afterend', d); at = d; }); }
  const r0 = window.renderTeam; if(r0) window.renderTeam = function(){ const r = r0.apply(this, arguments); try{ order(); }catch(e){} setTimeout(() => { try{ order(); }catch(e){} }, 300); return r; };
  try{ if(typeof VIEW !== 'undefined' && VIEW === 'team') renderTeam(); }catch(e){}
})();
