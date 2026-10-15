(function(){
  // 15 Oct · Trials, refined (Misty: "refine and make the screen of trials best").
  //  · opens on the first tab with something in it (To send → Follow up → All), never on an empty "0" tab;
  //  · a conversion line on top: last 45 days · trials · enrolled (%) · following up · not enrolling, with one bar;
  //  · tabs with 0 are dimmed so the live ones stand out;
  //  · calmer rows: hover, softer status chip, the level and score kept on the right.
  const css = `
#v-trials .tp2{display:flex;flex-wrap:wrap;align-items:center;gap:6px 18px;margin-top:12px;padding:12px 16px;border-radius:16px;background:#fff;border:1px solid #EEF0F4;font-size:14px;color:#4C4868}
#v-trials .tp2 b{font-family:var(--brand);font-weight:400;font-size:21px;color:#2B2253;margin-right:4px}
#v-trials .tp2 .pct{color:#1C6B4C}
#v-trials .tp2 .bar{flex:1 1 220px;display:flex;height:10px;border-radius:5px;overflow:hidden;gap:2px;min-width:160px}
#v-trials .tp2 .bar i{display:block}
#v-trials .tp2 .k{display:inline-flex;align-items:center;gap:6px}
#v-trials .tp2 .k:before{content:'';width:9px;height:9px;border-radius:5px;background:var(--c)}
#v-trials #tpTabs .seg button.z{opacity:.45}
#v-trials #tpList{padding-top:6px;padding-bottom:6px}
#v-trials .rp-row{border-radius:14px;padding:12px 10px;transition:background .15s}
#v-trials .rp-row:hover{background:#F7F9FA}
#v-trials .rp-row .chip{font-size:12px}
#v-trials #tpAt{text-align:right}`;
  const st = document.createElement('style'); st.id = 'tp2css'; st.textContent = css; document.head.appendChild(st);
  let picked = false;
  const _r = window.renderTP;
  window.renderTP = function(){ const r = _r.apply(this, arguments);
    try{ const tabs = $('tpTabs'); if(!tabs) return r; const B = [...tabs.querySelectorAll('.seg button')]; if(!B.length) return r;
      const n = {}; B.forEach(b => { const m = b.textContent.match(/^(.*?)\s*·\s*(\d+)$/); if(!m) return; const k = (String(b.getAttribute('onclick') || '').match(/tpF\('(\w+)'\)/) || [])[1]; if(k){ n[k] = +m[2]; b.classList.toggle('z', +m[2] === 0 && !b.classList.contains('on')); } });
      // never open on an empty tab
      if(!picked && n.all){ picked = true; const on = B.find(b => b.classList.contains('on')), cur = on ? (String(on.getAttribute('onclick') || '').match(/tpF\('(\w+)'\)/) || [])[1] : '';
        if(cur && !n[cur]){ const go2 = ['send', 'follow', 'all'].find(k => n[k]); if(go2 && go2 !== cur){ setTimeout(() => tpF(go2), 0); return r; } } }
      const all = n.all || 0; if(!all) return r; const en = n.enrolled || 0, fo = n.follow || 0, no = n.not || 0, other = Math.max(0, all - en - fo - no);
      const old = $('tp2fun'); if(old) old.remove();
      tabs.insertAdjacentHTML('afterbegin', `<div class="tp2" id="tp2fun"><span>Last 45 days</span><span><b>${all}</b>trials</span><span><b class="pct">${en}</b>enrolled · <span class="pct">${Math.round(en / all * 100)}%</span></span><span><b>${fo}</b>following up</span><span><b>${no}</b>not enrolling</span>
<span class="bar" title="Enrolled · following up · not enrolling · other"><i style="flex:${en};background:#2E9E6F"></i><i style="flex:${fo};background:#D9962B"></i><i style="flex:${no};background:#D4705A"></i><i style="flex:${other};background:#E3E5EC"></i></span>
<span class="k" style="--c:#2E9E6F">Enrolled</span><span class="k" style="--c:#D9962B">Following up</span><span class="k" style="--c:#D4705A">Not enrolling</span></div>`);
    }catch(e){ console.warn('trials refine', e); }
    return r; };
  try{ if(VIEW === 'trials') renderTP(); }catch(e){}
})();
