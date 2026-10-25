// 890: (Misty brief, UI minimalism) Overview reads top to bottom in the order of what needs you:
//   1 · decisions and exceptions — lates to decide / video checks (already above), greeting + "N things need you", Teachers today (Monitor)
//   2 · business and payroll   — Business card + this month's pay
//   3 · student / package risks — Packages (healthy · 5 or fewer · ran out)
//   4 · quality / teacher issues — Quality (QA average, parent reports, peer reviews)
//   5 · trends, folded          — Where students come from · Students per teacher · trials & enrolment (one tap to open, remembered)
// Nothing is removed: every card, number and link is the same element, only moved. Calm look: the coloured KPI tiles and
// coloured status tiles become plain white tiles with a thin border (text colours kept), card shadows removed.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 890 · Overview order: decisions → business/payroll → student risks → quality → trends (folded) */
(function(){
  if(window.__890) return; window.__890 = 1;
  document.head.insertAdjacentHTML('beforeend', '<style id="g890css">' + [
    '#v-home .ovc .x-top{background:#fff!important}',
    '#v-home .ovc .x-top,#v-home .ovc .x-c,#v-home .ovc .x-pay,#v-home .ovc .ov-card,#v-home .ovc .ov-mon{box-shadow:none!important}',
    '#v-home .ovc .x-st a{background:#fff!important;border:1px solid var(--line,#E4E2EC)!important;border-left-width:1px!important}',
    '#v-home .ovc .bz2-k>div{background:#fff!important;border:1px solid var(--line,#E4E2EC)!important;border-left-width:1px!important}',
    '#v-home .ovc .g890-risk{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;align-items:start}',
    '#v-home .ovc .g890-risk>*{min-width:0}',
    '#v-home .ovc details.g890-tr{border:1px solid var(--line,#E4E2EC);border-radius:var(--r-lg,18px);background:#fff;padding:0}',
    '#v-home .ovc details.g890-tr>summary{list-style:none;cursor:pointer;display:flex;align-items:baseline;gap:10px;padding:14px 18px;font-weight:700;color:var(--ink,#2B2253)}',
    '#v-home .ovc details.g890-tr>summary::-webkit-details-marker{display:none}',
    '#v-home .ovc details.g890-tr>summary span{font-weight:400;font-size:13px;color:var(--mute,#8A86A0)}',
    '#v-home .ovc details.g890-tr>summary::after{content:"Show";margin-left:auto;font-size:13px;color:#00808A}',
    '#v-home .ovc details.g890-tr[open]>summary::after{content:"Hide"}',
    '#v-home .ovc details.g890-tr>summary:focus-visible{outline:2px solid #01b0bf;outline-offset:2px;border-radius:12px}',
    '#v-home .ovc details.g890-tr>.g890-in{padding:0 18px 18px;display:grid;gap:18px}',
    '#v-home .ovc details.g890-tr .x-grid{margin:0}',
    '@media(max-width:900px){#v-home .ovc .g890-risk{grid-template-columns:minmax(0,1fr)}}'].join('') + '</style>');
  const KEY = 'coe.ov890.trends';
  const getOpen = () => { try{ return localStorage.getItem(KEY) === '1'; }catch(e){ return false; } };
  const setOpen = v => { try{ localStorage.setItem(KEY, v ? '1' : '0'); }catch(e){} };
  const title = el => { const h = el && el.querySelector('h2, .x-h b, b'); return h ? h.textContent.trim() : ''; };
  let busy = 0;
  function arrange(){
    const v = document.getElementById('v-home'), box = v && v.querySelector(':scope > .ovc'); if(!box || busy) return;
    busy = 1;
    try{
      const top = box.querySelector(':scope > .x-top');
      const mon = v.querySelector('#ovMon');
      const two = box.querySelector(':scope > .ov-two');
      const cards = [...box.querySelectorAll('section.ov-card')];
      const quality = cards.find(c => /^Quality/.test(title(c)));
      const grid = box.querySelector(':scope > .x-grid') || box.querySelector('.g890-tr .x-grid');
      const xc = grid ? [...grid.querySelectorAll(':scope > .x-c')] : [];
      const pk = xc.find(c => /^Packages/.test(c.textContent.trim())) || box.querySelector('.g890-risk .x-c');
      const extra = [box.querySelector('.sf24'), box.querySelector('.ov-te')].filter(Boolean);
      const foot = box.querySelector(':scope > .c-foot');
      // 3 · student/package risks + 4 · quality in one row (DOM order = reading order)
      let risk = box.querySelector(':scope > .g890-risk');
      if(!risk && (pk || quality)){ risk = document.createElement('div'); risk.className = 'g890-risk'; }
      if(risk){ if(pk && pk.parentNode !== risk) risk.insertBefore(pk, risk.firstChild);
        if(quality && quality.parentNode !== risk) risk.appendChild(quality);
        if(!risk.children.length){ risk.remove(); risk = null; } }
      // 5 · trends folded
      let tr = box.querySelector(':scope > details.g890-tr');
      const rest = grid ? [...grid.querySelectorAll(':scope > .x-c')].filter(c => c !== pk) : [];
      if(!tr && (rest.length || extra.length)){ tr = document.createElement('details'); tr.className = 'g890-tr'; tr.open = getOpen();
        tr.innerHTML = '<summary>Trends <span>where students come from · students per teacher · trials</span></summary><div class="g890-in"></div>';
        tr.addEventListener('toggle', () => setOpen(tr.open)); }
      if(tr){ const inn = tr.querySelector('.g890-in');
        if(grid && grid.parentNode !== inn && rest.length) inn.appendChild(grid);
        extra.forEach(x => { if(x.parentNode !== inn) inn.appendChild(x); }); }
      if(grid && !grid.querySelector('.x-c')) grid.remove();
      // order the known blocks; anything else stays where it is
      const order = [top, mon, two, risk, tr, foot].filter(Boolean);
      let prev = null;
      order.forEach(el => { if(prev){ if(prev.nextElementSibling !== el) prev.after(el); } else if(el.parentNode !== box || box.firstElementChild !== el) box.insertBefore(el, box.firstChild); prev = el; });
      // the Business side column keeps only the pay card (Quality and Teachers today moved)
      const side = two && two.querySelector('.ov-side'); if(side && !side.children.length) side.remove();
    }catch(e){ console.warn('890', e); }
    busy = 0;
  }
  window.ov890 = arrange;
  const rh = window.renderHome; if(typeof rh === 'function') window.renderHome = function(){ const r = rh.apply(this, arguments); arrange(); return r; };
  let t = 0; const later = () => { if(busy) return; clearTimeout(t); t = setTimeout(arrange, 30); };
  const hook = () => { const v = document.getElementById('v-home'); if(!v){ setTimeout(hook, 1000); return; } new MutationObserver(later).observe(v, { childList: true, subtree: true }); };
  hook();
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
