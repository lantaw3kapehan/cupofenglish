/* 19 Oct · 343 · Leave screen polished (Misty: "please polish the design of this screen")
   · each request shows a calendar tile with its dates (OCT · 23–25) instead of the teacher's initial
   · the three counts are slimmer tiles; a request waiting for you stays coral
   · the 4-step flow is a numbered strip
   · "Days of leave in 2026" becomes small bars (tap a name to see that teacher's history)
   · cards, headings and the search field use the same quiet, roomy style */
(function(){
  const css = document.createElement('style'); css.textContent = `
#v-leave .stats{gap:12px;margin-top:18px}
#v-leave .stats .stat{padding:14px 18px 12px;border-radius:18px;min-height:0;box-shadow:0 1px 0 rgba(43,34,83,.04);position:relative;overflow:hidden}
#v-leave .stats .stat b{font-family:var(--brand);font-weight:400;font-size:30px;line-height:1.1}
#v-leave .stats .stat span{font-size:13.5px;color:#6F6B85}
#v-leave .lv2-flow{gap:0;margin:14px 0 4px;counter-reset:lv3;font-size:12.5px}
#v-leave .lv2-flow span{counter-increment:lv3;background:none;padding:2px 4px 2px 0;color:#6F6B85;display:flex;align-items:center;gap:6px}
#v-leave .lv2-flow span::before{content:counter(lv3);display:inline-grid;place-items:center;width:20px;height:20px;border-radius:50%;background:#E3F4F2;color:#00737B;font-weight:700;font-size:11px}
#v-leave .lv2-flow i{margin:0 10px;color:#C9C6D6}
#v-leave h2{margin-top:30px;font-size:19px;letter-spacing:.01em}
#v-leave h2 .c{font-size:12px;padding:1px 8px;border-radius:999px;background:#EEEDF5;color:#5C5876;vertical-align:middle;margin-left:4px}
#v-leave .li[onclick^="lvSheet"]{background:#fff;border:1px solid #EEEDF3;border-radius:18px;padding:14px 16px;margin:10px 0;gap:16px;align-items:center;transition:border-color .15s,box-shadow .15s}
#v-leave .li[onclick^="lvSheet"]:hover{border-color:#CFE9E5;box-shadow:0 6px 18px rgba(43,34,83,.06)}
#v-leave .lv3-date{flex:none;width:64px;border-radius:14px;overflow:hidden;text-align:center;background:#F6F5FA;border:1px solid #ECEAF3}
#v-leave .lv3-date span{display:block;background:#2B2253;color:#fff;font-size:10.5px;letter-spacing:.12em;font-weight:700;padding:3px 0}
#v-leave .lv3-date b{display:block;font-family:var(--brand);font-weight:400;font-size:20px;color:#2B2253;padding:5px 2px 0;line-height:1.1}
#v-leave .lv3-date i{display:block;font-style:normal;font-size:11px;color:#6F6B85;padding:0 2px 6px}
#v-leave .lv3-date.now span{background:#2A9D8F}
#v-leave .li[onclick^="lvSheet"] .small{line-height:1.5}
#v-leave .li[onclick^="lvSheet"] .small.mute.ell{font-style:italic}
#v-leave .lv3-bars{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:8px 22px;margin-top:10px}
#v-leave .lv3-bar{display:grid;grid-template-columns:110px 1fr auto;align-items:center;gap:10px;font-size:13.5px;cursor:pointer;padding:6px 8px;border-radius:10px}
#v-leave .lv3-bar:hover{background:#F6F5FA}
#v-leave .lv3-bar em{height:8px;border-radius:8px;background:#ECEAF3;overflow:hidden;font-style:normal}
#v-leave .lv3-bar em u{display:block;height:100%;border-radius:8px;background:linear-gradient(90deg,#2A9D8F,#52B7AC)}
#v-leave .lv3-bar small{color:#6F6B85;white-space:nowrap}
#v-leave input.search{border-radius:14px;padding:11px 14px 11px 40px;font-size:15px}
@media(max-width:620px){#v-leave .lv3-date{width:54px}#v-leave .lv3-date b{font-size:17px}#v-leave .lv2-flow i{margin:0 6px}}`;
  document.head.appendChild(css);
  const MON = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  const dd = s => { const m = String(s || '').match(/^(\d{4})-(\d{2})-(\d{2})/); return m ? { m: +m[2] - 1, d: +m[3] } : null; };
  function tile(r){ const a = dd(r.from), b = dd(r.to) || a; if(!a) return null; const t = ymdLocal(new Date()), on = r.status === 'Approved' && r.from <= t && r.to >= t;
    const el = document.createElement('div'); el.className = 'lv3-date' + (on ? ' now' : '');
    const same = b.m === a.m && b.d === a.d;
    el.innerHTML = `<span>${MON[a.m]}${b.m !== a.m ? '–' + MON[b.m] : ''}</span><b>${a.d}${same ? '' : '–' + b.d}</b><i>${on ? 'on leave' : same ? '1 day' : (r.days || '') + (r.days ? ' days' : '')}</i>`; return el; }
  function polish(){ const v = $('v-leave'); if(!v || !LV || !LV.rows) return;
    v.querySelectorAll('.li[onclick^="lvSheet"]').forEach(li => { if(li.dataset.lv3) return; li.dataset.lv3 = 1;
      const m = String(li.getAttribute('onclick')).match(/lvSheet\('([^']*)'\)/), r = m && LV.rows.find(x => String(x.id) === m[1]); const av = li.querySelector('.av');
      if(r && av){ const t = tile(r); if(t) av.replaceWith(t); } });
    const tot = v.querySelector('.lv-tot'); if(tot && !tot.dataset.lv3){ tot.dataset.lv3 = 1;
      const L = [...tot.querySelectorAll('.chip')].map(c => { const m = c.textContent.match(/^(.*) · ([\d.]+) day/); return m ? { n: m[1], d: +m[2], on: c.getAttribute('onclick') } : null; }).filter(Boolean);
      const mx = Math.max(1, ...L.map(x => x.d));
      tot.className = 'lv3-bars'; tot.innerHTML = L.map(x => `<div class="lv3-bar" onclick="${x.on}"><b class="ell">${esc(x.n)}</b><em><u style="width:${Math.max(6, Math.round(100 * x.d / mx))}%"></u></em><small>${x.d} day${x.d === 1 ? '' : 's'}</small></div>`).join(''); } }
  const _r = window.renderLeave; window.renderLeave = function(){ const x = _r.apply(this, arguments); try{ polish(); }catch(e){} return x; };
  try{ if(VIEW === 'leave') renderLeave(); }catch(e){}
})();
