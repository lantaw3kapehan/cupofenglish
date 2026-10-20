/* 20 Oct · 405 · To do and Time-ins, calmer (Misty: "chaotic · stressful"). Nothing is removed.
   To do: tags are outlined instead of filled (the colour stays in the word only), quieter row numbers, one button style;
          the top cards in the app card style.
   Time-ins: today first — the counts as tiles, To review, My time-in, Teachers today, Office. The rest folds into
          closed rows at the bottom you open when needed (remembered): Management hours · Class checks & visits ·
          System health · Latest changes. */
(function(){
  const css = document.createElement('style');
  css.textContent = `
#v-mtoday .tdr .tags .chip{background:#fff!important;border:1px solid var(--line)!important;font-weight:500!important}
#v-mtoday .tdr .tdn{background:var(--soft)!important;color:var(--ink)!important}
#v-mtoday .tdr .tdn b{color:var(--ink)!important}
#v-mtoday .tdr .tdn.hot,#v-mtoday .tdr .tdn.red{background:#FBECE8!important}
#v-mtoday .tdb .btn{background:#fff!important;color:var(--ink)!important;border:1px solid var(--line)!important;box-shadow:none!important}
#v-mtoday .tdb .btn:hover{border-color:var(--ink)!important}
#v-mtoday .tdsum a,#v-mtoday .tdsum>div{border:1px solid var(--line)!important;border-radius:var(--r-lg)!important;box-shadow:var(--sh1)!important;background:#fff!important}
#v-mtoday section.sec,#v-mtoday details.sec{border:1px solid var(--line)!important;border-radius:var(--r-lg)!important;box-shadow:var(--sh1)!important}
#v-team .ti-sum{display:grid!important;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px!important}
#v-team .ti-s{display:block!important;padding:12px 14px!important;border-radius:var(--r-md)!important;border:1px solid var(--line)!important;background:#fff!important;box-shadow:var(--sh1);font-size:13px!important;color:#6F6B85!important}
#v-team .ti-s b{display:block;font-family:var(--brand);font-weight:400;font-size:26px;line-height:1.1;color:var(--ink)}
#v-team .ti-s.bad b{color:#C0533D} #v-team .ti-s.warn b{color:#B7791F} #v-team .ti-s.ok b{color:#00737B}
#v-team .ti-list{border:1px solid var(--line);border-radius:var(--r-lg);box-shadow:var(--sh1);background:#fff;overflow:hidden}
#v-team details.tgrp{margin-top:14px;background:#fff;border:1px solid var(--line);border-radius:var(--r-lg);box-shadow:var(--sh1)}
#v-team details.tgrp>summary{list-style:none;cursor:pointer;display:flex;align-items:center;gap:10px;padding:14px 18px;font-weight:600;color:var(--ink)}
#v-team details.tgrp>summary::-webkit-details-marker{display:none}
#v-team details.tgrp>summary span{font-weight:400;font-size:13px;color:#8A86A0}
#v-team details.tgrp>summary:after{content:'›';margin-left:auto;color:#8A86A0;transition:transform .15s;font-size:18px}
#v-team details.tgrp[open]>summary:after{transform:rotate(90deg)}
#v-team details.tgrp>div{padding:0 18px 16px}
#v-team details.tgrp h2:first-child,#v-team details.tgrp .row:first-child h2{margin-top:4px}
#v-team .tgrp-h{margin:30px 2px 0;font-size:11.5px;letter-spacing:.08em;text-transform:uppercase;color:#8A86A0}`;
  document.head.appendChild(css);
  const KEY = 'coe.tgrp';
  const openSet = () => { try{ return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; }catch(e){ return {}; } };
  window.tgrpT = function(k, d){ try{ const o = openSet(); o[k] = d.open ? 1 : 0; localStorage.setItem(KEY, JSON.stringify(o)); }catch(e){} };
  function fold(){ const v = $('v-team'); if(!v || v.querySelector('.tgrp-h')) return; const O = openSet();
    const wrap = (k, title, sub, nodes) => { nodes = nodes.filter(Boolean); if(!nodes.length) return null; const d = document.createElement('details'); d.className = 'tgrp'; if(O[k]) d.open = true; d.setAttribute('ontoggle', "tgrpT('" + k + "',this)");
      d.innerHTML = '<summary>' + title + (sub ? '<span>' + sub + '</span>' : '') + '</summary><div></div>'; const box = d.querySelector('div'); nodes[0].parentNode.insertBefore(d, nodes[0]); nodes.forEach(n => box.appendChild(n)); return d; };
    const hrs = $('hrsBox'), ng = $('ngBox'), hl = $('hlBox'), feed = $('feed'), fh = feed && feed.previousElementSibling && feed.previousElementSibling.tagName === 'H2' ? feed.previousElementSibling : null;
    const first = hrs || ng || hl || fh; if(!first) return;
    const head = document.createElement('div'); head.className = 'tgrp-h'; head.textContent = 'More'; first.parentNode.insertBefore(head, first);
    wrap('hrs', 'Management hours', 'days, hours and late this month', [hrs]);
    wrap('ng', 'Class checks & visits', 'videos, homework, notes · who to visit next', [ng]);
    wrap('hl', 'System health', 'speed and Google allowance', [hl]);
    wrap('feed', 'Latest changes', 'what was done in the app today', [fh, feed]); }
  const r0 = window.renderTeam; if(r0) window.renderTeam = function(){ const r = r0.apply(this, arguments); try{ fold(); }catch(e){ console.warn('tgrp', e); } return r; };
  try{ if(typeof VIEW !== 'undefined' && VIEW === 'team') renderTeam(); }catch(e){}
})();
