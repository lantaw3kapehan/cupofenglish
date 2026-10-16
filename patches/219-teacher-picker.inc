/* 16 Oct · Misty: the teacher chips ran off the screen (Virg…). Schedule now has one tidy row: By time / By teacher, and a
   "Teacher" picker next to it (every teacher with today's class count; type a letter to jump). Choosing a teacher shows
   her classes and her open slots; × goes back to all teachers. */
(function(){
  document.head.insertAdjacentHTML('beforeend', `<style>
  .sctb{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:6px 0 4px}.sctb .seg{margin:0}
  .scpk{position:relative;display:inline-flex;align-items:center}
  .scsel{appearance:none;-webkit-appearance:none;border:1.5px solid var(--line,#E4E2EC);border-radius:999px;padding:9px 36px 9px 16px;font:inherit;font-weight:700;font-size:14px;
    color:var(--ink,#2B2253);background:#fff;cursor:pointer;min-width:170px;max-width:100%}
  .scpk::after{content:"";position:absolute;right:15px;top:50%;width:7px;height:7px;border:solid currentColor;border-width:0 2px 2px 0;transform:translateY(-70%) rotate(45deg);pointer-events:none;opacity:.55}
  .scsel.on{border-color:#16BCB0;background:#F2FAF9;color:#0B5F59}
  .scx{border:0;background:none;font:inherit;font-size:18px;line-height:1;color:var(--mute,#6F6B85);cursor:pointer;padding:4px 6px}
  </style>`);
  const base = window.renderSchedule;
  window.renderSchedule = function(){ const r = base.apply(this, arguments);
    try{ const v = $('v-schedule'); if(!v || !SC) return r;
      const fl = [...v.querySelectorAll('.fl')].find(f => /teacher/i.test((f.querySelector('.lbl') || {}).textContent || '')), seg = v.querySelector('.seg');
      if(!fl || !seg) return r;
      const T = [...fl.querySelectorAll('button')].map(b => b.textContent.trim()).filter(t => t && t !== 'All'), n = {};
      SC.events.forEach(e => { if(!e.cancelled) n[e.teacher] = (n[e.teacher] || 0) + 1; });
      const box = document.createElement('div'); box.className = 'sctb'; seg.parentNode.insertBefore(box, seg); box.appendChild(seg);
      box.insertAdjacentHTML('beforeend', `<span class="scpk"><select class="scsel ${SC_T ? 'on' : ''}" aria-label="Teacher" onchange="SC_T=this.value;renderSchedule()"><option value="">All teachers</option>${T.map(t => `<option value="${esc(t)}"${SC_T === t ? ' selected' : ''}>Teacher ${esc(t)} · ${n[t] || 0}</option>`).join('')}</select></span>${SC_T ? '<button class="scx" title="All teachers" onclick="SC_T=\'\';renderSchedule()">×</button>' : ''}`);
      fl.style.display = 'none';   /* kept (hidden): the open-slots box is placed after it */
    }catch(e){}
    return r; };
  try{ if(typeof VIEW !== 'undefined' && VIEW === 'schedule') renderSchedule(); }catch(e){}
})();
