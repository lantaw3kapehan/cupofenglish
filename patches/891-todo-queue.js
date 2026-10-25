// 891: (Misty brief, UI minimalism) To do = one clear priority queue first, details underneath.
// · "Do next" (the queue, one line per item with its buttons) moves to the top, right under the title — it was below
//   "Trial reports to send" when that list had items. Items with "overdue N days" go first (most overdue first); the rest keep
//   their order. Numbers 1, 2, 3… follow the new order.
// · The sections below (Trial reports, Renewals, Trial follow-ups, and any other To do section) are the supporting details:
//   each has a Show/Hide button with its item count. When the queue has items they start folded; when nothing is due they start
//   open. Your choice per section is remembered on this device. Tapping a queue line, a count tile, or any "jump" link opens the
//   section first, then scrolls to the item. No item, button or count is removed.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 891 · To do: queue first, details foldable */
(function(){
  if(window.__891) return; window.__891 = 1;
  document.head.insertAdjacentHTML('beforeend', '<style id="g891css">' + [
    '#v-mtoday section.sec.g891-c>:not(:first-child){display:none!important}',
    '#v-mtoday section.sec.g891-c{padding-bottom:14px}',
    '#v-mtoday .g891-t{margin-left:auto;flex:none;border:1px solid var(--line,#E4E2EC);background:#fff;border-radius:999px;padding:4px 12px;font:inherit;font-size:13px;font-weight:700;color:#00808A;cursor:pointer;white-space:nowrap}',
    '#v-mtoday .g891-t:focus-visible{outline:2px solid #01b0bf;outline-offset:2px}',
    '#v-mtoday section.sec>h2.g891-h{display:flex;align-items:center;gap:10px;flex-wrap:wrap}',
    '#v-mtoday h2.g891-h>.g891-t{order:2}#v-mtoday h2.g891-h>.c{order:3;flex-basis:100%}',
    '@media(max-width:640px){#v-mtoday section.sec>.row:first-child{flex-wrap:wrap;gap:8px}#v-mtoday section.sec>.row:first-child>h2{flex-basis:100%}}',
    '#v-mtoday #tdFocus{margin-top:6px}'].join('') + '</style>');
  const KEY = 'coe.td891';
  const pref = () => { try{ return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; }catch(e){ return {}; } };
  const save = (id, open) => { try{ const o = pref(); o[id] = open ? 1 : 0; localStorage.setItem(KEY, JSON.stringify(o)); }catch(e){} };
  const items = sec => sec.querySelectorAll('.tdr,.tdl,.li').length;
  function setBtn(sec){ const b = sec.querySelector(':scope > :first-child .g891-t, :scope > .g891-t'); if(!b) return; const c = sec.classList.contains('g891-c'), n = items(sec);
    b.textContent = (c ? 'Show' : 'Hide') + (c && n ? ' · ' + n : ''); b.setAttribute('aria-expanded', c ? 'false' : 'true'); }
  function openSec(sec){ if(sec && sec.classList.contains('g891-c')){ sec.classList.remove('g891-c'); setBtn(sec); save(sec.id, 1); } }
  window.td891Toggle = function(id){ const sec = document.getElementById(id); if(!sec) return; sec.classList.toggle('g891-c'); const open = !sec.classList.contains('g891-c'); save(id, open); setBtn(sec); };
  let busy = 0;
  function arrange(){ const v = document.getElementById('v-mtoday'); if(!v || busy || !(typeof D !== 'undefined' && D && D.mgr)) return; busy = 1;
    try{
      const focus = v.querySelector(':scope > #tdFocus'), lead = v.querySelector(':scope > .lead');
      // 1 · the queue right under the title
      if(focus && lead && lead.nextElementSibling !== focus) lead.after(focus);
      // 2 · most overdue first (only re-orders lines that say "overdue N days"; the rest keep their order)
      if(focus && !focus._s891){ const L = [...focus.querySelectorAll(':scope > .li')], od = li => { const m = /overdue (\d+) day/.exec(li.textContent); return m ? +m[1] : -1; };
        const S = L.map((li, k) => ({ li, k, o: od(li) })).sort((a, b) => (b.o > -1 || a.o > -1) ? (b.o - a.o) || (a.k - b.k) : a.k - b.k);
        if(S.some((x, k) => x.k !== k)){ const after = L[L.length - 1].nextSibling; S.forEach(x => focus.insertBefore(x.li, after)); }
        [...focus.querySelectorAll(':scope > .li')].forEach((li, k) => { const n = li.querySelector('.td2-n'); if(n) n.textContent = String(k + 1); });
        focus._s891 = 1; }
      // 3 · supporting sections: Show/Hide with count
      const P = pref(), hasQ = !!(focus && focus.querySelector('.li'));
      v.querySelectorAll(':scope > section.sec').forEach((sec, k) => { if(sec.id === 'tdFocus') return; if(!sec.id) sec.id = 'td891s' + k;
        const head = sec.firstElementChild; if(!head || sec.querySelector(':scope > :first-child .g891-t')) { setBtn(sec); return; }
        if(!items(sec) && sec.children.length < 2) return;
        const h2 = head.tagName === 'H2' ? head : null, holder = h2 || head;
        if(h2) h2.classList.add('g891-h');
        holder.insertAdjacentHTML('beforeend', '<button type="button" class="g891-t" aria-controls="' + sec.id + '" onclick="event.stopPropagation();td891Toggle(\'' + sec.id + '\')"></button>');
        const open = sec.id in P ? !!P[sec.id] : !hasQ; sec.classList.toggle('g891-c', !open); setBtn(sec); });
    }catch(e){ console.warn('891', e); }
    busy = 0; }
  window.td891 = arrange;
  // open the right section before any jump or queue tap scrolls to it
  document.addEventListener('click', e => { try{ const li = e.target.closest && e.target.closest('#v-mtoday #tdFocus .li'); if(!li || e.target.closest('button')) return;
    const m = /getElementById\('([^']+)'\)/.exec(li.getAttribute('onclick') || ''), row = m && document.getElementById(m[1]); if(row) openSec(row.closest('#v-mtoday section.sec')); }catch(x){} }, true);
  const tj = window.tdJump; if(typeof tj === 'function') window.tdJump = tdJump = function(id){ try{ openSec(document.getElementById('td-' + id)); }catch(e){} return tj.apply(this, arguments); };
  const rt = window.renderMToday; if(typeof rt === 'function') window.renderMToday = function(){ const r = rt.apply(this, arguments); arrange(); return r; };
  let t = 0; const later = () => { if(busy) return; clearTimeout(t); t = setTimeout(arrange, 30); };
  const hook = () => { const v = document.getElementById('v-mtoday'); if(!v){ setTimeout(hook, 1000); return; } new MutationObserver(later).observe(v, { childList: true }); };
  hook();
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
