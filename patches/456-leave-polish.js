// 20 Oct · Leave polish: colours by leave type, labelled tiles, tighter cards, compact history.
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + `/* 20 Oct · 456 · Misty: "can you polish it visually" (Leave).
   · Each leave type has a colour: Personal teal · Sick coral · Emergency amber · Vacation blue · Other purple. The date block's top, a thin
     left edge on the card and the type word use it, so the kind of leave reads at a glance; a key sits under the tiles.
   · Tiles: a coloured label (On leave today teal · Coming up purple · Waiting amber/coral when something waits).
   · Cards are tighter; the reason is one quiet line; History cards are smaller still. */
(function(){
  const css = document.createElement('style');
  css.textContent = \`
#v-leave .stats .stat{border-left:4px solid var(--c56)!important;padding:10px 16px!important}
#v-leave .stats .stat:before,#v-leave .stats .stat:after{display:none!important}
#v-leave .stats .stat:nth-child(1){--c56:#00A3AD}#v-leave .stats .stat:nth-child(2){--c56:#6C5FC7}#v-leave .stats .stat:nth-child(3){--c56:#E0A030}
#v-leave .stats .stat b{font-size:26px!important}
#v-leave .tk56{display:flex;flex-wrap:wrap;gap:4px 16px;font-size:12px;color:#55526E;margin:10px 2px 0}
#v-leave .tk56 span{display:inline-flex;align-items:center;gap:6px}#v-leave .tk56 i{width:10px;height:10px;border-radius:3px;display:inline-block}
#v-leave .li[onclick^="lvSheet"]{padding:10px 14px!important;margin:8px 0!important;border-left:4px solid var(--t56,#ECEAF3)!important}
#v-leave .li[onclick^="lvSheet"] .lv3-date span{background:var(--t56,#2B2253)!important}
#v-leave .li[onclick^="lvSheet"] .lv3-date.now{box-shadow:0 0 0 2px var(--t56)}
#v-leave .li[onclick^="lvSheet"] .ty56{font-weight:700;color:var(--t56)}
#v-leave .li[onclick^="lvSheet"] .small.mute.ell{font-style:normal!important;color:#8A86A0}
#v-leave .li[onclick^="lvSheet"] .small.mute.ell:empty{display:none}
#v-leave .hs56 .li[onclick^="lvSheet"]{padding:7px 12px!important;margin:6px 0!important;box-shadow:none!important}
#v-leave .hs56 .lv3-date{width:52px!important}#v-leave .hs56 .lv3-date b{font-size:16px!important}
#v-leave .hs56 .li .grow>.row b{font-size:14.5px}
#v-leave .lv3-bar em u{background:var(--t56,#2A9D8F)!important}\`;
  document.head.appendChild(css);
  const TY = [[/sick|medical|ill/i, '#D4705A', 'Sick'], [/emerg|bereave|death|funeral/i, '#E0A030', 'Emergency'], [/vacation|holiday|annual/i, '#3B82B5', 'Vacation'], [/personal/i, '#00A3AD', 'Personal'], [/./, '#6C5FC7', 'Other']];
  const ty = s => TY.find(x => x[0].test(String(s || ''))) || TY[TY.length - 1];
  function run(){ const v = document.getElementById('v-leave'); if(!v || typeof LV === 'undefined' || !LV || !LV.rows) return;
    v.querySelectorAll('.li[onclick^="lvSheet"]').forEach(li => { if(li.dataset.t56) return; const m = String(li.getAttribute('onclick')).match(/lvSheet\\('([^']*)'\\)/), r = m && LV.rows.find(x => String(x.id) === m[1]); if(!r) return; li.dataset.t56 = 1;
      const k = ty(r.type); li.style.setProperty('--t56', k[1]); const sm = li.querySelector('.grow > .small.ell'); if(sm && r.type && sm.firstChild && sm.firstChild.nodeType === 3 && sm.firstChild.nodeValue.indexOf(r.type) === 0){ sm.firstChild.nodeValue = sm.firstChild.nodeValue.slice(r.type.length); sm.insertAdjacentHTML('afterbegin', '<span class="ty56">' + esc(r.type) + '</span>'); } });
    const st = v.querySelector('.stats'); if(st && !v.querySelector('.tk56')){ const used = [...new Set(LV.rows.map(r => ty(r.type)))]; st.insertAdjacentHTML('afterend', '<div class="tk56">' + TY.filter(k => used.includes(k)).map(k => '<span><i style="background:' + k[1] + '"></i>' + k[2] + '</span>').join('') + '</div>'); }
    const hh = [...v.querySelectorAll('h2')].find(h => /^History/.test(h.textContent.trim())); if(hh){ let x = hh.nextElementSibling; while(x){ if(x.tagName === 'DIV' && x.querySelector('.li')){ x.classList.add('hs56'); break; } x = x.nextElementSibling; } }
    v.querySelectorAll('.lv3-bar').forEach(b => { if(b.dataset.t56) return; b.dataset.t56 = 1; const n = (b.querySelector('b') || {}).textContent || ''; const R = LV.rows.filter(r => r.status === 'Approved' && tName(r.teacher) === n); const c = {}; R.forEach(r => { const k = ty(r.type); c[k[1]] = (c[k[1]] || 0) + (+r.days || 1); }); const top = Object.keys(c).sort((p, q) => c[q] - c[p])[0]; if(top) b.style.setProperty('--t56', top); }); }
  const _r = window.renderLeave; if(_r) window.renderLeave = function(){ const r = _r.apply(this, arguments); try{ run(); }catch(e){ console.warn('lv56', e); } return r; };
  try{ if(typeof VIEW !== 'undefined' && VIEW === 'leave') renderLeave(); }catch(e){}
})();
` + "</script>\n\n</body>"]]);
