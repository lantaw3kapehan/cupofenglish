// 20 Oct · Enquiries toolkit: Kids & teens and Adults cards get their own colour and label so the wrong form or message is not copied.
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + `/* 20 Oct · 434 · Misty: "make ADULTS and Young learners & Teens have a distinguishing mark/label/colour to avoid copying wrong information".
   A card for kids & teens (title says kids, teens or young learners) gets a blue "KIDS & TEENS · 4–17" label, a blue left edge and a blue button;
   a card for adults gets a plum "ADULTS · 18+" label, plum edge and plum button. Cards for everyone stay as they are.
   Inside the Price picture and Inquiry form: the learner buttons are blue (kids & teens), plum (adults) or amber (IELTS, PET, KET); a banner
   under the title says which price or form is on, and the Copy button names it (\"Copy picture · Adults\"). */
(function(){
  const css = document.createElement('style');
  css.textContent = \`
#v-enquiry .eq2-t.au-k{--c:#2F6FD0!important;box-shadow:inset 4px 0 0 #2F6FD0}
#v-enquiry .eq2-t.au-a{--c:#8A4FB8!important;box-shadow:inset 4px 0 0 #8A4FB8}
#v-enquiry .eq2-t .au34{align-self:flex-start;display:inline-flex;align-items:center;gap:5px;font-size:10.5px;font-weight:800;letter-spacing:.08em;padding:3px 9px;border-radius:999px;color:#fff;background:var(--c)}
#v-enquiry .eq2-t .au34 svg{width:12px;height:12px}\`;
  document.head.appendChild(css);
  const KID = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="7" r="3.2"/><path d="M7 21v-4.5a5 5 0 0 1 10 0V21"/></svg>';
  const ADU = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="6" r="3"/><path d="M6 22v-7a6 6 0 0 1 12 0v7"/><path d="M9 22v-5M15 22v-5"/></svg>';
  function mark(){ document.querySelectorAll('#v-enquiry .eq2-t').forEach(c => { if(c.dataset.au34) return; c.dataset.au34 = 1;
    const b = c.querySelector('b, strong'); if(!b) return; const box = b.parentElement.cloneNode(true); box.querySelectorAll('.small, .mute, button').forEach(x => x.remove());
    const s = box.textContent.slice(0, 90);   /* the title only, never the description */
    const k = /adult/i.test(s) ? 'a' : /kid|teen|young learner/i.test(s) ? 'k' : ''; if(!k) return;
    c.classList.add('au-' + k);
    b.parentElement.insertAdjacentHTML('beforebegin', '<span class="au34">' + (k === 'a' ? ADU + 'ADULTS · 18+' : KID + 'KIDS &amp; TEENS · 4–17') + '</span>'); }); }
  /* Price picture and Inquiry form cards: a coloured banner says which price / form is on, the copy button says it too */
  const G = { k: ['#2F6FD0', '#EAF1FC', 'KIDS & TEENS · 4–17'], a: ['#8A4FB8', '#F4ECFA', 'ADULTS · 18+'], x: ['#C27C0E', '#FCF3E2', 'EXAM COURSE'] };
  function sheet(){ const sb = document.getElementById('sheetBody'); if(!sb) return; const h1 = sb.querySelector('h1'); if(!h1) return;
    let seg = null, k = '', what = '';
    if(/^Price picture/i.test(h1.textContent) && (seg = document.getElementById('ppAd'))){ const B = [...seg.querySelectorAll('button')], i = B.findIndex(x => x.classList.contains('on')); k = i === 1 ? 'a' : i === 0 || i < 0 ? 'k' : 'x'; what = i >= 2 ? B[i].textContent.trim() + ' price' : 'price';
      B.forEach((x, j) => { const g = G[j === 1 ? 'a' : j === 0 ? 'k' : 'x']; x.style.boxShadow = 'inset 0 0 0 1.5px ' + g[0]; if(x.classList.contains('on')){ x.style.background = g[0]; x.style.color = '#fff'; } else { x.style.background = '#fff'; x.style.color = g[0]; } }); }
    else if(/^Inquiry form/i.test(h1.textContent) && (seg = sb.querySelector('.seg'))){ const B = [...seg.querySelectorAll('button')], i = B.findIndex(x => x.classList.contains('on')); k = i === 1 ? 'a' : 'k'; what = 'form';
      B.forEach((x, j) => { const g = G[j === 1 ? 'a' : 'k']; x.style.boxShadow = 'inset 0 0 0 1.5px ' + g[0]; x.style.background = x.classList.contains('on') ? g[0] : '#fff'; x.style.color = x.classList.contains('on') ? '#fff' : g[0]; }); }
    if(!k) return; const g = G[k], sig = k + what;
    let bn = document.getElementById('au34b'); if(bn && bn.dataset.k === sig) return; if(bn) bn.remove();
    h1.insertAdjacentHTML('afterend', '<div id="au34b" data-k="' + sig + '" style="margin:8px 0 4px;padding:9px 14px;border-radius:12px;background:' + g[1] + ';border-left:5px solid ' + g[0] + ';color:' + g[0] + ';font-weight:800;letter-spacing:.04em;font-size:13.5px">' + g[2] + ' · ' + esc(what) + ' <span style="font-weight:600;letter-spacing:0;color:#55526E">· check this matches the learner before you copy</span></div>');
    const cb = document.getElementById('ppC') || [...sb.querySelectorAll('button')].find(x => /^Copy form/i.test(x.textContent));
    if(cb){ cb.style.background = g[0]; cb.style.borderColor = g[0]; cb.style.color = '#fff'; const lab = k === 'a' ? 'Adults' : k === 'k' ? 'Kids & teens' : 'Exam'; if(cb.dataset.lab !== lab){ cb.dataset.base = cb.dataset.base || cb.textContent; cb.textContent = cb.dataset.base + ' · ' + lab; cb.dataset.lab = lab; } } }
  let q = 0; new MutationObserver(() => { if(q) return; q = requestAnimationFrame(() => { q = 0; try{ sheet(); }catch(e){} }); }).observe(document.body, { childList: true, subtree: true });
  const _r = window.renderEnq; if(_r) window.renderEnq = function(){ const r = _r.apply(this, arguments); try{ mark(); }catch(e){ console.warn('au34', e); } return r; };
  try{ if(typeof VIEW !== 'undefined' && VIEW === 'enquiry') mark(); }catch(e){}
})();
` + "</script>\n\n</body>"]]);
