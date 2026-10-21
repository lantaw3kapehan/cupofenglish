/* 21 Oct · 510 · Teacher Growth, QA feedback and the student page, final polish (Misty: "LET US DO ALL NOW").
   Growth
   · A row of section chips under the title (Attendance · Class record · Career · Timeline · Peer feedback · Class visits ·
     Recognition): one tap jumps to that part of a long page.
   · Peer feedback: the newest review shows its scores and overall comment; the five area comments fold under "Read each area".
   · Class visits: the newest 3 show; the rest fold into "Older visits" (was 6 open cards).
   QA feedback (and Growth)
   · Lines written as steps in capitals ("NOTICE → LISTEN → CONNECT → FOLLOW UP") show as step pills with arrows.
   Student page
   · Teachers: "Progress report" and "Class note" sit together in one action row (no WRITE / MORE labels).
   · Age: teachers saw "Age ? · add birthdate" even when Profile had the birthdate (the age chip only read management's
     DATABASE copy). It now also reads the student's own profile row, so the header shows "10 yrs old · G4". Nothing removed. */
(function(){
  const css = document.createElement('style'); css.textContent = `
#v-growth .jp510{display:flex;flex-wrap:wrap;gap:6px;margin:12px 0 2px}
#v-growth .jp510 a{padding:6px 12px;border-radius:999px;background:#fff;border:1px solid rgba(43,34,83,.1);font-size:12.5px;font-weight:600;color:#4A4766;cursor:pointer;text-decoration:none;transition:border-color .15s,color .15s}
#v-growth .jp510 a:hover{border-color:#00A3AD;color:#00737B}
#v-growth section.sec,#v-growth .gr-kpi,#v-growth .gr-mini{scroll-margin-top:84px}
details.ar510{margin-top:8px}
details.ar510>summary{list-style:none;cursor:pointer;font-size:13px;font-weight:700;color:#00808A;padding:4px 0}
details.ar510>summary::-webkit-details-marker{display:none}
details.ar510[open]>summary{color:#8A87A0}
details.ov510{margin-top:8px}
details.ov510>summary{list-style:none;cursor:pointer;font-size:13px;font-weight:700;color:#00808A;padding:6px 0}
details.ov510>summary::-webkit-details-marker{display:none}
.st510{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin:6px 0 4px}
.st510 span{padding:4px 11px;border-radius:999px;background:#EAF6F7;color:#00646B;font-size:12px;font-weight:700;letter-spacing:.03em}
.st510 i{font-style:normal;color:#9ACFD3;font-weight:700}
body:not(.mgr) .stu-bar{gap:8px!important;align-items:center!important;flex-direction:row!important;flex-wrap:wrap!important;padding:8px 10px!important}
body:not(.mgr) .stu-bar .grp{border:0!important;padding:0!important;background:none!important;width:auto!important}
body:not(.mgr) .stu-bar .grp>span{display:none!important}`;
  document.head.appendChild(css);
  const isT = () => typeof D !== 'undefined' && D && !D.mgr;
  const J = [['Attendance', /^Attendance/], ['Class record', /^My class record/], ['To fix', /^To fix/], ['Career', /^Career path/], ['Timeline', /^Teaching timeline/], ['Peer feedback', /^Peer feedback/], ['Class visits', /^Class visits/], ['Recognition', /^Recognition/]];
  const h2Of = (v, re) => [...v.querySelectorAll('h2')].find(h => re.test(h.textContent.trim()));
  window.gr510Go = i => { const v = document.getElementById('v-growth'), h = v && h2Of(v, J[i][1]); if(!h) return; const s = h.closest('section') || h; s.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  const STEP = /^[A-Z0-9][A-Z0-9 &'’\/().,–-]*( *(→|->) *[A-Z0-9][A-Z0-9 &'’\/().,–-]*){2,}$/;
  function steps(root){ root.querySelectorAll('.gr-text:not([data-s510])').forEach(t => { t.dataset.s510 = 1; const P = t.innerHTML.split(/<br\s*\/?>/i); let ch = false;
    const out = P.map(l => { const txt = l.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim(); if(!STEP.test(txt)) return l; ch = true; return '<div class="st510">' + txt.split(/\s*(?:→|->)\s*/).map(x => '<span>' + esc(x) + '</span>').join('<i>→</i>') + '</div>'; });
    if(ch) t.innerHTML = out.join('<br>').replace(/<br>(<div class="st510">)/g, '$1').replace(/(<\/div>)<br>/g, '$1'); }); }
  function growth(){ const v = document.getElementById('v-growth'); if(!v || !isT()) return;
    /* jump chips */
    const lead = v.querySelector('.lead'); const have = J.map((j, i) => [j[0], i, !!h2Of(v, j[1])]).filter(x => x[2]);
    const jh = have.length > 2 ? `<div class="jp510">${have.map(x => `<a onclick="gr510Go(${x[1]})">${esc(x[0])}</a>`).join('')}</div>` : '';
    let jp = v.querySelector('.jp510'); if(jh && lead){ if(!jp){ lead.insertAdjacentHTML('afterend', jh); } else if(jp.outerHTML !== jh) jp.outerHTML = jh; }
    /* peer feedback: fold the area comments of the open review */
    const hp = h2Of(v, /^Peer feedback/), ps = hp && hp.closest('section');
    if(ps) ps.querySelectorAll('details.fbold[open]').forEach(d => { if(d.querySelector('.ar510')) return; const ks = [...d.querySelectorAll(':scope > .gr-k')]; const first = ks.find(k => !/^overall$/i.test(k.textContent.trim())); if(!first) return;
      const box = document.createElement('details'); box.className = 'ar510'; box.innerHTML = '<summary>Read each area ›</summary>'; first.before(box); let n = first; while(n){ const nx = n.nextElementSibling; box.appendChild(n); n = nx; } });
    /* class visits: newest 3, the rest folded */
    const hv = h2Of(v, /^Class visits/), vs = hv && hv.closest('section');
    if(vs){ const cards = [...vs.querySelectorAll(':scope > .gx-goal')]; if(cards.length > 3){ let old = vs.querySelector(':scope > details');
        if(!old){ old = document.createElement('details'); old.className = 'ov510'; old.innerHTML = '<summary></summary>'; vs.appendChild(old); }
        const extra = cards.slice(3); const sm = old.querySelector('summary'); const anchor = sm ? sm.nextSibling : null; extra.forEach(c => old.insertBefore(c, anchor));
        const n = old.querySelectorAll('.gx-goal').length; if(sm && /Older visits|^$/.test(sm.textContent.trim())) sm.textContent = 'Older visits · ' + n + ' ›'; } }
    steps(v); }
  function qa(){ const v = document.getElementById('v-qa'); if(v && isT()) steps(v); }
  let busy = false, tm = 0;
  const run = () => { if(busy) return; busy = true; try{ growth(); qa(); }catch(e){ console.warn('510', e); } finally{ setTimeout(() => { busy = false; }, 0); } };
  const _pg = window.paintGrowth; if(_pg) window.paintGrowth = function(){ const x = _pg.apply(this, arguments); run(); setTimeout(run, 500); return x; };
  const _gp = window.grPick; if(_gp) window.grPick = function(){ const x = _gp.apply(this, arguments); setTimeout(run, 0); return x; };
  ['v-growth', 'v-qa'].forEach(id => { const el = document.getElementById(id); if(el && window.MutationObserver) new MutationObserver(() => { if(busy) return; clearTimeout(tm); tm = setTimeout(run, 120); }).observe(el, { childList: true, subtree: true }); });
})();
