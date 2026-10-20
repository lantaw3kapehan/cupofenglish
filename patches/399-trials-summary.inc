/* 20 Oct · 399 · Trials screen top, tidied (Misty). One white card:
   "Last 45 days" · four number tiles that are also the colour key (Trials · Enrolled + % · Following up · Not enrolling),
   each tile filters the list when clicked · the coloured bar across the full width under them.
   Below it, two aligned rows with the same label width: "Status" pills and "Source" pills. Same counts and filters as before. */
(function(){
  const css = document.createElement('style');
  css.textContent = `
#v-trials .tp2{display:block!important;padding:16px 18px 14px!important;border:1px solid var(--line)!important;border-radius:var(--r-lg)!important;box-shadow:var(--sh1);background:#fff!important}
#v-trials .tp3h{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:10px}
#v-trials .tp3h span{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#8A86A0}
#v-trials .tp3t{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}
#v-trials .tp3t button{all:unset;cursor:pointer;display:block;padding:12px 14px;border-radius:var(--r-md);background:var(--soft);position:relative;transition:background .12s,box-shadow .12s}
#v-trials .tp3t button:hover{background:#EFEEF5}
#v-trials .tp3t button.on{background:#fff;box-shadow:0 0 0 2px var(--c) inset}
#v-trials .tp3t b{display:block;font-family:var(--brand);font-weight:400;font-size:28px;line-height:1.05;color:var(--ink)}
#v-trials .tp3t span{display:flex;align-items:center;gap:6px;font-size:13px;color:#4C4868;margin-top:4px}
#v-trials .tp3t span:before{content:'';width:9px;height:9px;border-radius:5px;background:var(--c);flex:none}
#v-trials .tp3t em{font-style:normal;font-weight:700;color:var(--c);margin-left:auto}
#v-trials .tp3b{display:flex;height:8px;border-radius:5px;overflow:hidden;gap:2px;margin-top:14px;background:var(--soft)}
#v-trials .tp3b i{display:block}
#v-trials #tpTabs>.seg,#v-trials #tpTabs .sk2{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin:12px 0 0!important;padding:0!important;background:transparent!important;border:0!important}
#v-trials #tpTabs>.seg:before,#v-trials #tpTabs .sk2>span{content:'Status';display:inline-block;width:64px;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#8A86A0;margin:0!important}
#v-trials #tpTabs .sk2>span{font-size:11px}
#v-trials #tpTabs .seg button,#v-trials #tpTabs .sk2 button{padding:7px 14px!important;font-size:13.5px!important;font-weight:600;border-radius:999px!important;border:1px solid var(--line)!important;background:#fff;box-shadow:none!important}
#v-trials #tpTabs .seg button.on{background:var(--ink)!important;border-color:var(--ink)!important;color:#fff!important}
#v-trials #tpTabs .seg button.z{opacity:.4}
#v-trials #tpTabs .sk2 button.on{border-color:currentColor!important}
@media(max-width:700px){#v-trials .tp3t{grid-template-columns:repeat(2,minmax(0,1fr))}}`;
  document.head.appendChild(css);
  const _r = window.renderTP;
  window.renderTP = function(){ const r = _r.apply(this, arguments);
    try{ const box = $('tp2fun'), tabs = $('tpTabs'); if(!box || !tabs) return r;
      const n = {}, on = {}; [...tabs.querySelectorAll('.seg button')].forEach(b => { const k = (String(b.getAttribute('onclick') || '').match(/tpF\('(\w+)'\)/) || [])[1], m = b.textContent.match(/·\s*(\d+)\s*$/); if(k && m){ n[k] = +m[1]; if(b.classList.contains('on')) on[k] = 1; } });
      const all = n.all || 0; if(!all) return r; const en = n.enrolled || 0, fo = n.follow || 0, no = n.not || 0, other = Math.max(0, all - en - fo - no);
      const tile = (k, c, num, lbl, extra) => '<button type="button" class="' + (on[k] ? 'on' : '') + '" style="--c:' + c + '" onclick="tpF(\'' + k + '\')"><b>' + num + '</b><span>' + lbl + (extra ? '<em>' + extra + '</em>' : '') + '</span></button>';
      box.innerHTML = '<div class="tp3h"><span>Last 45 days</span></div><div class="tp3t">' +
        tile('all', '#2B2253', all, 'Trials') + tile('enrolled', '#2E9E6F', en, 'Enrolled', Math.round(en / all * 100) + '%') + tile('follow', '#D9962B', fo, 'Following up') + tile('not', '#D4705A', no, 'Not enrolling') + '</div>' +
        '<div class="tp3b" title="Enrolled · following up · not enrolling · other"><i style="flex:' + en + ';background:#2E9E6F"></i><i style="flex:' + fo + ';background:#D9962B"></i><i style="flex:' + no + ';background:#D4705A"></i><i style="flex:' + other + ';background:#E3E5EC"></i></div>';
    }catch(e){ console.warn('trials 399', e); }
    return r; };
  try{ if(VIEW === 'trials') renderTP(); }catch(e){}
})();
