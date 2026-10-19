/* 19 Oct · 345 · Performance screen polished (Misty: "please polish the design")
   · QA read receipts: one calm line when everyone confirmed ("✓ All 4 confirmed"), names as small tiles; anyone not confirmed is listed first in coral
   · Teaching setup, Phone reminders, Trials by teacher and First 90 days sit together as "Team check-ins" tiles (2 per row, open one to read it)
   · slimmer number tiles, chevrons instead of ▶, 24-hour times */
(function(){
  const css = document.createElement('style'); css.textContent = `
#v-perf #qaRc{padding:14px 18px!important;border-radius:18px}
#v-perf #qaRc .pf3-rh{display:flex;align-items:center;gap:10px;cursor:pointer}
#v-perf #qaRc .pf3-rh b{font-family:var(--brand);font-weight:400;font-size:18px}
#v-perf #qaRc .pf3-ok{color:#1E7A55;background:#E3F4EC;border-radius:999px;padding:3px 12px;font-size:13px;font-weight:700}
#v-perf #qaRc .pf3-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:8px;margin-top:10px}
#v-perf #qaRc .pf3-t{border:1px solid #EEEDF3;border-radius:12px;padding:8px 10px;font-size:13px;line-height:1.35}
#v-perf #qaRc .pf3-t b{display:block;font-size:14px}#v-perf #qaRc .pf3-t.bad{border-color:#F3C9BD;background:#FDF3EF}
#v-perf #qaRc.pf3-closed .pf3-grid{display:none}
#v-perf #pf3Hub{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:0 0 16px}
#v-perf #pf3Hub>section{margin:0!important;border-radius:18px;padding:14px 16px!important;border:1px solid #EEEDF3;box-shadow:none;transition:border-color .15s}
#v-perf #pf3Hub>section:hover{border-color:#CFE9E5}
#v-perf #pf3Hub>section:has(details[open]){grid-column:1/-1}
#v-perf #pf3Hub summary,#v-perf #pf3Hub details>summary{list-style:none;cursor:pointer;line-height:1.45}
#v-perf #pf3Hub summary::-webkit-details-marker{display:none}
#v-perf #pf3Hub summary{position:relative;padding-right:22px}
#v-perf #pf3Hub summary::after{content:"›";position:absolute;right:0;top:0;color:#9C98B0;font-size:22px;line-height:1;transition:transform .15s}
#v-perf #pf3Hub details[open]>summary::after{transform:rotate(90deg)}
#v-perf #pf3Hub summary b{font-family:var(--brand);font-weight:400;font-size:17px}
#v-perf #pf3Hub summary .small{display:block;margin-top:2px}
#v-perf .pf3-hubh{grid-column:1/-1;font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:#8A86A0;margin:6px 2px -2px}
#v-perf .stats .stat{padding:14px 18px 12px;border-radius:18px;min-height:0}
#v-perf .stats .stat b{font-family:var(--brand);font-weight:400;font-size:30px}
#v-perf .stats .stat span{font-size:13.5px;color:#6F6B85}
#v-perf h2 .c{font-size:12px;padding:1px 8px;border-radius:999px;background:#EEEDF5;color:#5C5876;vertical-align:middle}
@media(max-width:760px){#v-perf #pf3Hub{grid-template-columns:1fr}}`;
  document.head.appendChild(css);
  let busy = false;
  function polish(){ const v = $('v-perf'); if(!v || busy) return; busy = true;
    try{
      const rc = $('qaRc');
      if(rc && !rc.querySelector('.pf3-grid')){
        const rows = [...rc.children].slice(1), T = rows.map(r => { const ok = !!r.querySelector('.chip.green'), b = r.querySelector('b'), chip = r.querySelector('.chip');
          const txt = r.textContent.replace(b ? b.textContent : '', '').replace(chip ? chip.textContent : '', '').replace(/^\s*·\s*/, '').trim();
          return { name: b ? b.textContent : '', meta: txt.replace(/\s*·\s*$/, ''), st: chip ? chip.textContent : '', ok }; });
        if(T.length){ const nOk = T.filter(x => x.ok).length, all = nOk === T.length;
          rc.classList.toggle('pf3-closed', all && !rc.dataset.open);
          rc.innerHTML = `<div class="pf3-rh" onclick="this.parentNode.dataset.open=this.parentNode.classList.contains('pf3-closed')?'1':'';this.parentNode.classList.toggle('pf3-closed')"><b class="grow">QA read receipts</b>${all ? `<span class="pf3-ok">✓ All ${T.length} confirmed</span>` : `<span class="chip coral">${T.length - nOk} not confirmed</span> <span class="small mute">${nOk} of ${T.length}</span>`}<span class="mute" style="font-size:20px">›</span></div>
<div class="pf3-grid">${T.filter(x => !x.ok).concat(T.filter(x => x.ok)).map(x => `<div class="pf3-t ${x.ok ? '' : 'bad'}"><b>${esc(x.name)}</b><span class="mute">${esc(x.meta)}</span><div style="color:${x.ok ? '#1E7A55' : '#B03A2E'};margin-top:2px">${esc(x.st)}</div></div>`).join('')}</div>`; } }
      const parts = ['setupPanel', 'pushWho', 'trialStats', 'first90'].map(id => $(id)).filter(Boolean);
      if(parts.length){ let hub = $('pf3Hub'); if(!hub){ hub = document.createElement('div'); hub.id = 'pf3Hub'; hub.innerHTML = '<div class="pf3-hubh">Team check-ins</div>'; const a = $('qaRc') || v.querySelector('.lead'); if(a) a.after(hub); else v.prepend(hub); }
        parts.forEach(p => { if(p.parentNode !== hub) hub.appendChild(p); const sm = p.querySelector('summary .small'); if(sm && /^\s*·\s*/.test(sm.textContent)) sm.textContent = sm.textContent.replace(/^\s*·\s*/, ''); }); }
    }catch(e){} busy = false; }
  const _rp = window.renderPerf; if(_rp) window.renderPerf = function(){ const x = _rp.apply(this, arguments); try{ polish(); }catch(e){} return x; };
  let t = 0; new MutationObserver(() => { if(busy || typeof VIEW === 'undefined' || VIEW !== 'perf') return; clearTimeout(t); t = setTimeout(polish, 80); }).observe(document.body, { childList: true, subtree: true });
})();
