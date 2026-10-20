// 20 Oct · Teachers: "Team map" — workload (units) against completion, bubble = students, colour = rank, four labelled zones.
require('../tools/lib.js')(process.argv[2], [["\n</script>\n\n</body>", "\n</script>\n<script>\n" + `/* 20 Oct · 443 · Misty: "can it still be better, like effective and strategic visual designs and graphics".
   Team map (under the team card): each teacher is a dot.
   Across = units this month (workload) · up = classes completed % · dot size = students · dot colour = rank.
   A dashed line at 85% (the completion goal) and one at the team's average units split it into four zones:
   "Carrying the team" (busy, completing) · "Busy · check completion" · "Room to take more" · "Needs a talk".
   Hover a dot for the numbers, click it to open the teacher. */
(function(){
  const css = document.createElement('style');
  css.textContent = \`
#v-teachers .mp43{background:#fff;border:1px solid var(--line);border-radius:var(--r-lg);box-shadow:var(--sh1);padding:12px 16px 10px;margin-top:12px}
#v-teachers .mp43 .h{display:flex;justify-content:space-between;align-items:baseline;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#8A86A0;margin-bottom:4px}
#v-teachers .mp43 svg{display:block;width:100%;height:auto}
#v-teachers .mp43 .dot{cursor:pointer;transition:r .12s}
#v-teachers .mp43 .dot:hover{stroke:#2B2253;stroke-width:2}
#v-teachers .mp43 .lg{display:flex;flex-wrap:wrap;gap:4px 14px;font-size:11.5px;color:#8A86A0;margin-top:4px}
#v-teachers .mp43 .lg i{display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:4px;vertical-align:-1px}\`;
  document.head.appendChild(css);
  const RK = [['Master', /master/i, '#6C5FC7'], ['Senior', /senior/i, '#00A3AD'], ['Junior', /junior/i, '#3B82B5'], ['Newly Qualified', /newly qualified/i, '#2E9E6F'], ['Newly Hired', /newly hired/i, '#8FA3B8'], ['Starting', /starting/i, '#D9962B'], ['No rank', /./, '#B9B6C8']];
  const rk = r => RK.find(k => k[1].test(String(r || ''))) || RK[RK.length - 1];
  function map(T){ const P = T.filter(x => +x.sch > 0); if(P.length < 3) return '';
    const W = 1000, H = 300, L = 46, R = 20, Tp = 16, B = 34, mx = Math.max(...P.map(x => +x.units || 0)) * 1.08 || 1;
    const lo = Math.max(0, Math.floor(Math.min(...P.map(x => x.done / x.sch * 100), 85) / 10) * 10 - 5), hi = 100;
    const X = u => L + (u / mx) * (W - L - R), Y = p => Tp + (hi - p) / (hi - lo) * (H - Tp - B);
    const avg = P.reduce((a, x) => a + (+x.units || 0), 0) / P.length, smax = Math.max(1, ...P.map(x => +x.students || 0));
    const xa = X(avg), yg = Y(85);
    const zone = (x, y, t, a) => '<text x="' + x + '" y="' + y + '" font-size="12" fill="#B4B1C4" text-anchor="' + a + '" font-weight="700" letter-spacing=".04em">' + t + '</text>';
    let g = '<rect x="' + xa + '" y="' + Tp + '" width="' + (W - R - xa) + '" height="' + (yg - Tp) + '" fill="#EEF8F3"/>' + '<rect x="' + L + '" y="' + yg + '" width="' + (xa - L) + '" height="' + (H - B - yg) + '" fill="#FDF3F0"/>';
    for(let p = Math.ceil(lo / 10) * 10; p <= 100; p += 10) g += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + Y(p) + '" y2="' + Y(p) + '" stroke="#F1F0F6"/><text x="' + (L - 8) + '" y="' + (Y(p) + 4) + '" font-size="11" fill="#8A86A0" text-anchor="end">' + p + '%</text>';
    const st = mx > 60 ? 20 : 10; for(let u = 0; u <= mx; u += st) g += '<text x="' + X(u) + '" y="' + (H - B + 16) + '" font-size="11" fill="#8A86A0" text-anchor="middle">' + u + '</text>';
    g += '<text x="' + (W - R) + '" y="' + (H - 4) + '" font-size="11" fill="#8A86A0" text-anchor="end">units this month →</text>';
    g += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + yg + '" y2="' + yg + '" stroke="#2E9E6F" stroke-dasharray="5 4"/><text x="' + (L + 4) + '" y="' + (yg - 5) + '" font-size="11" fill="#2E9E6F">goal 85%</text>';
    g += '<line x1="' + xa + '" x2="' + xa + '" y1="' + Tp + '" y2="' + (H - B) + '" stroke="#C9C6D6" stroke-dasharray="5 4"/><text x="' + (xa + 4) + '" y="' + (H - B - 6) + '" font-size="11" fill="#8A86A0">team average ' + Math.round(avg * 10) / 10 + '</text>';
    g += zone(W - R - 6, Tp + 16, 'CARRYING THE TEAM', 'end') + zone(W - R - 6, H - B - 8, 'BUSY · CHECK COMPLETION', 'end') + zone(L + 8, Tp + 16, 'ROOM TO TAKE MORE', 'start') + zone(L + 8, yg + 18, 'NEEDS A TALK', 'start');
    const pts = P.map(x => ({ x, cx: X(+x.units || 0), cy: Y(Math.round(x.done / x.sch * 100)), r: 6 + Math.sqrt((+x.students || 0) / smax) * 12 })).sort((a, b) => b.r - a.r);
    g += pts.map(p => { const c = rk(p.x.rank)[2], pc = Math.round(p.x.done / p.x.sch * 100), nm = String(p.x.name).replace(/^teacher\\s+/i, '');
      return '<g><circle class="dot" cx="' + p.cx + '" cy="' + p.cy + '" r="' + p.r + '" fill="' + c + '" fill-opacity=".85" stroke="#fff" stroke-width="1.5" onclick="openTeacher(\\'' + esc(p.x.name).replace(/'/g, '') + '\\')"><title>' + esc(nm) + ' · ' + p.x.units + ' units · ' + pc + '% completed · ' + p.x.students + ' students · ' + (p.x.late || 0) + ' late · ' + esc(rk(p.x.rank)[0]) + '</title></circle>' +
        '<text x="' + (p.cx + p.r + 4) + '" y="' + (p.cy + 4) + '" font-size="11.5" fill="#2B2253" pointer-events="none">' + esc(nm) + '</text></g>'; }).join('');
    const used = RK.filter(k => P.some(x => rk(x.rank) === k));
    return '<div class="mp43"><div class="h"><span>Team map · workload and completion</span><span>dot size = students · click a dot to open</span></div><svg viewBox="0 0 ' + W + ' ' + H + '">' + g + '</svg>' +
      '<div class="lg">' + used.map(k => '<span><i style="background:' + k[2] + '"></i>' + k[0] + '</span>').join('') + '</div></div>'; }
  function paint(){ const v = document.getElementById('v-teachers'); if(!v || v.querySelector('.mp43')) return; const T = ((typeof MO !== 'undefined' && MO && MO.teachers) || []); const tm = v.querySelector('.tm41'); if(!tm) return; const h = map(T); if(h) tm.insertAdjacentHTML('afterend', h); }
  const _r = window.renderTeachers; if(_r) window.renderTeachers = function(){ const r = _r.apply(this, arguments); try{ paint(); }catch(e){ console.warn('mp43', e); } return r; };
  try{ if(typeof VIEW !== 'undefined' && VIEW === 'teachers') renderTeachers(); }catch(e){}
})();
` + "</script>\n\n</body>"]]);
