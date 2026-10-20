// 20 Oct · Leave: a team leave calendar (next 6 weeks, who is away which days, overlaps stand out) and leave by type this year.
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + `/* 20 Oct · 455 · Misty: "now, let's do the LEAVE screen".
   · "Team leave · next 6 weeks": one line per teacher with leave in the window, days across; approved = teal bar, waiting = amber striped,
     weekends shaded, a line for today; a red mark above any day when 2 or more teachers are away (plan cover). Click a bar to open that leave.
   · "Leave in <year> by type": one bar split by type (Personal · Sick · Emergency · Other …) with days, next to the per-teacher bars. */
(function(){
  const css = document.createElement('style');
  css.textContent = \`
#v-leave .lc55{background:#fff;border:1px solid var(--line);border-radius:var(--r-lg);padding:12px 16px 10px;margin-top:14px}
#v-leave .lc55 .h{display:flex;justify-content:space-between;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#8A86A0;margin-bottom:6px}
#v-leave .lc55 .g{display:grid;grid-template-columns:120px minmax(0,1fr);row-gap:4px;align-items:center}
#v-leave .lc55 .nm{font-size:13px;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#v-leave .lc55 .tr{position:relative;height:22px;background:#FCFCFE;border-radius:4px}
#v-leave .lc55 .we{position:absolute;top:0;bottom:0;background:#F1F0F6;font-style:normal}
#v-leave .lc55 .bar{position:absolute;top:3px;bottom:3px;border-radius:5px;cursor:pointer;font-size:10.5px;color:#fff;font-weight:700;padding:0 6px;display:flex;align-items:center;overflow:hidden;white-space:nowrap;font-style:normal;z-index:1}
#v-leave .lc55 .bar.ap{background:#00A3AD}
#v-leave .lc55 .bar.pd{background:repeating-linear-gradient(45deg,#E0A030 0 6px,#EDB95A 6px 12px)}
#v-leave .lc55 .now{position:absolute;top:-2px;bottom:-2px;width:2px;background:#2B2253;z-index:2}
#v-leave .lc55 .ax{position:relative;height:30px}
#v-leave .lc55 .ax span{position:absolute;transform:translateX(-50%);font-size:10.5px;color:#8A86A0;text-align:center;line-height:1.2}
#v-leave .lc55 .ax span b{display:block;color:var(--ink);font-size:11px}
#v-leave .lc55 .ov{position:relative;height:8px}
#v-leave .lc55 .ov i{position:absolute;top:1px;height:6px;border-radius:3px;background:#D4705A}
#v-leave .lc55 .lg{display:flex;flex-wrap:wrap;gap:4px 14px;font-size:11.5px;color:#8A86A0;margin-top:8px}
#v-leave .lc55 .lg i{display:inline-block;width:14px;height:8px;border-radius:3px;margin-right:5px;vertical-align:0}
#v-leave .ty55{margin-top:10px}
#v-leave .ty55 .bb{display:flex;height:14px;border-radius:7px;overflow:hidden;gap:2px;margin:6px 0}
#v-leave .ty55 .bb i{display:block}
#v-leave .ty55 .k{display:flex;flex-wrap:wrap;gap:4px 16px;font-size:12.5px;color:#55526E}
#v-leave .ty55 .k span{display:inline-flex;align-items:center;gap:6px}#v-leave .ty55 .k i{width:9px;height:9px;border-radius:3px;display:inline-block}\`;
  document.head.appendChild(css);
  const TC = ['#00A3AD', '#6C5FC7', '#D4705A', '#E0A030', '#3B82B5', '#2E9E6F', '#9A98A8'];
  const D0 = s => new Date(String(s).slice(0, 10) + 'T12:00:00');
  function paint(){ const el = document.getElementById('v-leave'); if(!el || typeof LV === 'undefined' || !LV || el.querySelector('.lc55')) return;
    const R = (LV.rows || []).filter(r => r.from && r.to && (r.status === 'Approved' || r.status === 'Pending'));
    const t0 = new Date(); t0.setHours(12, 0, 0, 0); const a = new Date(t0.getTime() - 3 * 864e5), N = 45, b = new Date(a.getTime() + N * 864e5), ix = d => Math.round((d - a) / 864e5);
    const W = R.filter(r => D0(r.to) >= a && D0(r.from) < b); const names = [...new Set(W.map(r => r.teacher))];
    const pc = i => (i / N * 100);
    const cnt = new Array(N).fill(0); W.forEach(r => { for(let i = Math.max(0, ix(D0(r.from))); i <= Math.min(N - 1, ix(D0(r.to))); i++) cnt[i]++; });
    let we = ''; for(let i = 0; i < N; i++){ const d = new Date(a.getTime() + i * 864e5); if(d.getDay() === 0 || d.getDay() === 6) we += '<i class="we" style="left:' + pc(i) + '%;width:' + pc(1) + '%"></i>'; }
    let ax = ''; for(let i = 0; i < N; i += 7){ const d = new Date(a.getTime() + i * 864e5); ax += '<span style="left:' + pc(i + .5) + '%"><b>' + d.getDate() + '</b>' + d.toLocaleDateString('en-GB', { month: 'short' }) + '</span>'; }
    const nowL = '<i class="now" style="left:' + pc(ix(t0) + .5) + '%"></i>';
    let ov = ''; cnt.forEach((c, i) => { if(c >= 2) ov += '<i style="left:' + pc(i) + '%;width:' + pc(1) + '%" title="' + c + ' teachers away"></i>'; });
    const cal = '<section class="lc55"><div class="h"><span>Team leave · next 6 weeks</span><span>' + (ov ? '<b style="color:#C0563F">red = 2 or more away · plan cover</b>' : 'no overlaps') + '</span></div>' +
      (names.length ? '<div class="g"><span></span><div class="ov">' + ov + '</div>' + names.map(n => '<span class="nm">' + esc(tName(n)) + '</span><div class="tr" style="--d:' + pc(1) + '%">' + we + nowL +
        W.filter(r => r.teacher === n).map(r => { const s = Math.max(0, ix(D0(r.from))), e = Math.min(N - 1, ix(D0(r.to))); return '<i class="bar ' + (r.status === 'Approved' ? 'ap' : 'pd') + '" style="left:' + pc(s) + '%;width:' + pc(e - s + 1) + '%" title="' + esc(tName(r.teacher) + ' · ' + r.type + ' · ' + lvDates(r) + ' · ' + r.status) + '" onclick="lvSheet(\\'' + esc(r.id) + '\\')">' + (e - s >= 2 ? esc(r.type || '') : '') + '</i>'; }).join('') + '</div>').join('') +
        '<span></span><div class="ax">' + ax + '</div></div>' : '<div class="small mute">Nobody is on leave in the next 6 weeks.</div>') +
      '<div class="lg"><span><i style="background:#00A3AD"></i>approved</span><span><i style="background:#E0A030"></i>waiting</span><span><i style="background:#F6F5FA;border:1px solid #E3E1EC"></i>weekend</span><span><i style="background:#2B2253;width:2px"></i>today</span></div></section>';
    const h2 = [...el.querySelectorAll('h2')].find(h => /On leave now/.test(h.textContent)); if(h2) h2.insertAdjacentHTML('beforebegin', cal);
    /* by type */
    const y = String(new Date().getFullYear()), T = {}; (LV.rows || []).filter(r => r.status === 'Approved' && String(r.from).slice(0, 4) === y).forEach(r => { const k = r.type || 'Other'; T[k] = (T[k] || 0) + (+r.days || 0); });
    const ks = Object.keys(T).sort((p, q) => T[q] - T[p]), tot = ks.reduce((s, k) => s + T[k], 0);
    const dh = [...el.querySelectorAll('h2')].find(h => /^Days of leave/.test(h.textContent.trim()));
    if(dh && tot){ let x = dh.nextElementSibling; while(x && x.tagName !== 'H2' && !x.classList.contains('lv-tot') && !/lv/.test(x.className)) x = x.nextElementSibling;
      const box = '<div class="ty55"><div class="small mute">By type · ' + tot + ' day' + (tot === 1 ? '' : 's') + '</div><div class="bb">' + ks.map((k, i) => '<i style="flex:' + T[k] + ';background:' + TC[i % TC.length] + '" title="' + esc(k) + ' · ' + T[k] + ' days"></i>').join('') + '</div><div class="k">' + ks.map((k, i) => '<span><i style="background:' + TC[i % TC.length] + '"></i>' + esc(k) + ' <b>' + T[k] + '</b></span>').join('') + '</div></div>';
      (x || dh).insertAdjacentHTML('afterend', box); } }
  const _r = window.renderLeave; if(_r) window.renderLeave = function(){ const r = _r.apply(this, arguments); try{ paint(); }catch(e){ console.warn('lc55', e); } return r; };
  try{ if(typeof VIEW !== 'undefined' && VIEW === 'leave') renderLeave(); }catch(e){}
})();
` + "</script>\n\n</body>"]]);
