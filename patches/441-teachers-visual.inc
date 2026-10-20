/* 20 Oct · 441 · Teachers screen (Misty: "let's move on to TEACHERS' screen").
   · "Team this month" card on top: units · teachers teaching · completion (all classes) · late classes · students,
     and one bar of this month's units split by rank (Master · Senior · Junior · Newly Qualified · Newly Hired · Starting · No rank), click a rank to group.
   · New sort "Rank": teachers grouped under their rank with the group's units.
   · Rows are shorter; completion % is coloured (green 80%+, amber 60–79%, coral below); late is a small coral chip.
   · A teacher's Attendance chart starts at their first month with classes (no empty months). */
(function(){
  const css = document.createElement('style');
  css.textContent = `
#v-teachers .tm41{background:#fff;border:1px solid var(--line);border-radius:var(--r-lg);box-shadow:var(--sh1);padding:14px 18px;margin-top:12px}
#v-teachers .tm41 .h{display:flex;justify-content:space-between;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#8A86A0;margin-bottom:8px}
#v-teachers .tm41 .k{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px}
#v-teachers .tm41 .k div{background:var(--soft);border-radius:12px;padding:8px 12px}
#v-teachers .tm41 .k b{display:block;font-family:var(--brand);font-weight:400;font-size:22px;color:var(--ink);line-height:1.15}
#v-teachers .tm41 .k span{font-size:12.5px;color:#4C4868}
#v-teachers .tm41 .rb{display:flex;height:14px;border-radius:7px;overflow:hidden;gap:2px;margin-top:12px}
#v-teachers .tm41 .rb i{display:block;cursor:pointer}
#v-teachers .tm41 .rl{display:flex;flex-wrap:wrap;gap:4px 14px;margin-top:6px;font-size:12px;color:#55526E}
#v-teachers .tm41 .rl span{display:inline-flex;align-items:center;gap:5px;cursor:pointer}
#v-teachers .tm41 .rl i{width:9px;height:9px;border-radius:3px;display:inline-block}
#v-teachers .tm41 .rl b{color:var(--ink)}
body #v-teachers .tc2{padding:9px 20px!important}
body #v-teachers .tc2-av{width:34px!important;height:34px!important;font-size:12.5px!important}
body #v-teachers .tc2 .tc2-u b{font-size:22px!important}
body #v-teachers .tc2 .tc2-f .p41g{color:#1E8A5E;font-weight:700}body #v-teachers .tc2 .tc2-f .p41a{color:#B07A10;font-weight:700}body #v-teachers .tc2 .tc2-f .p41c{color:#C0563F;font-weight:700}
body #v-teachers .tc2 .tc2-f .late{background:#FDF1EE;color:#B4442F!important;border-radius:999px;padding:1px 8px;font-size:12px}
#v-teachers .rk41{grid-column:1/-1;display:flex;align-items:baseline;gap:10px;padding:10px 20px 6px;background:#FAFAFC;border-bottom:1px solid #F1F2F6;font-size:12px;color:#8A86A0}
#v-teachers .rk41 b{font-size:13px;letter-spacing:.06em;text-transform:uppercase;color:var(--c)}
@media(max-width:820px){#v-teachers .tm41 .k{grid-template-columns:repeat(2,minmax(0,1fr))}}`;
  document.head.appendChild(css);
  const RK = [['Master', /master/i, '#6C5FC7'], ['Senior', /senior/i, '#00A3AD'], ['Junior', /junior/i, '#3B82B5'], ['Newly Qualified', /newly qualified/i, '#2E9E6F'], ['Newly Hired', /newly hired/i, '#8FA3B8'], ['Starting', /starting/i, '#D9962B'], ['No rank', /./, '#B9B6C8']];
  const rkOf = r => RK.find(k => k[1].test(String(r || ''))) || RK[RK.length - 1];
  const cp = x => x.sch ? Math.round(x.done / x.sch * 100) : null;
  let SORT = (() => { try{ return localStorage.getItem('coe.tSort') || 'units'; }catch(e){ return 'units'; } })();
  window.tc41 = function(k){ try{ localStorage.setItem('coe.tSort', k); }catch(e){} SORT = k; if(k === 'rank') renderTeachers(); else tcSort(k); };
  function paint(){ const v = $('v-teachers'); if(!v) return; const T = ((typeof MO !== 'undefined' && MO && MO.teachers) || []); if(!T.length) return;
    const bar = v.querySelector('.tc2-bar'), g = v.querySelector('.tc2-g'); if(!bar || !g) return;
    /* summary */
    if(!v.querySelector('.tm41')){ const u = T.reduce((a, x) => a + (+x.units || 0), 0), act = T.filter(x => +x.units > 0).length, sch = T.reduce((a, x) => a + (+x.sch || 0), 0), done = T.reduce((a, x) => a + (+x.done || 0), 0), late = T.reduce((a, x) => a + (+x.late || 0), 0), st = T.reduce((a, x) => a + (+x.students || 0), 0);
      const by = RK.map(k => ({ k, u: T.filter(x => rkOf(x.rank) === k).reduce((a, x) => a + (+x.units || 0), 0), n: T.filter(x => rkOf(x.rank) === k).length })).filter(o => o.n);
      const c = sch ? Math.round(done / sch * 100) : 0, cc = c >= 80 ? '#1E8A5E' : c >= 60 ? '#B07A10' : '#C0563F';
      bar.insertAdjacentHTML('beforebegin', '<div class="tm41"><div class="h"><span>Team · ' + new Date().toLocaleDateString('en-GB', { month: 'long' }) + ' so far</span><span>units by rank</span></div><div class="k">' +
        '<div><b>' + (Math.round(u * 10) / 10) + '</b><span>units</span></div><div><b>' + act + '<small style="font-size:13px;color:#8A86A0"> of ' + T.length + '</small></b><span>teachers teaching</span></div>' +
        '<div><b style="color:' + cc + '">' + c + '%</b><span>classes completed</span></div><div><b style="color:' + (late ? '#C0563F' : 'var(--ink)') + '">' + late + '</b><span>late classes</span></div><div><b>' + st + '</b><span>students</span></div></div>' +
        '<div class="rb">' + by.filter(o => o.u).map(o => '<i style="flex:' + o.u + ';background:' + o.k[2] + '" title="' + o.k[0] + ': ' + o.u + ' units · ' + o.n + ' teachers" onclick="tc41(\'rank\')"></i>').join('') + '</div>' +
        '<div class="rl">' + by.map(o => '<span onclick="tc41(\'rank\')"><i style="background:' + o.k[2] + '"></i>' + o.k[0] + ' <b>' + (Math.round(o.u * 10) / 10) + '</b> units · ' + o.n + (o.n === 1 ? ' teacher' : ' teachers') + '</span>').join('') + '</div></div>'); }
    /* rank sort button */
    if(!bar.querySelector('[data-r41]')) bar.insertAdjacentHTML('beforeend', '<button data-r41 onclick="tc41(\'rank\')">Rank</button>');
    const rb = bar.querySelector('[data-r41]'); if(SORT === 'rank'){ bar.querySelectorAll('button').forEach(b => b.classList.toggle('on', b === rb)); }
    bar.querySelectorAll('button:not([data-r41])').forEach(b => { const k = (String(b.getAttribute('onclick') || '').match(/tcSort\('(\w+)'\)/) || [])[1]; if(k) b.setAttribute('onclick', 'tc41(\'' + k + '\')'); });
    /* rows: colour completion */
    g.querySelectorAll('.tc2').forEach(r => { r.querySelectorAll('.tc2-f span').forEach(s => { const m = s.textContent.match(/^(\d+)% completed$/); if(m) s.className = +m[1] >= 80 ? 'p41g' : +m[1] >= 60 ? 'p41a' : 'p41c'; }); });
    /* group by rank */
    if(SORT === 'rank' && !g.querySelector('.rk41')){ const rows = [...g.querySelectorAll('.tc2')], nm = r => { const m = (r.getAttribute('onclick') || '').match(/openTeacher\('([^']+)'\)/); return m ? m[1] : ''; };
      const by = {}; T.forEach(x => by[x.name] = x);
      RK.forEach(k => { const R = rows.filter(r => by[nm(r)] && rkOf(by[nm(r)].rank) === k).sort((a, b) => (+by[nm(b)].units || 0) - (+by[nm(a)].units || 0)); if(!R.length) return;
        const u = R.reduce((a, r) => a + (+by[nm(r)].units || 0), 0); g.insertAdjacentHTML('beforeend', '<div class="rk41" style="--c:' + k[2] + '"><b>' + k[0] + '</b>' + R.length + ' teacher' + (R.length === 1 ? '' : 's') + ' · ' + (Math.round(u * 10) / 10) + ' units</div>'); R.forEach(r => g.appendChild(r)); }); } }
  const _r = window.renderTeachers; if(_r) window.renderTeachers = function(){ const r = _r.apply(this, arguments); try{ paint(); }catch(e){ console.warn('tc41', e); } return r; };
  /* attendance: start at the first month with classes */
  const _a = window.attHtml; if(_a) window.attHtml = function(A, mine){ try{ A = (A || []).filter(Boolean); const i = A.findIndex(a => a.s); if(i > 0) A = A.slice(i); }catch(e){} return _a.call(this, A, mine); };
  try{ if(typeof VIEW !== 'undefined' && VIEW === 'teachers') renderTeachers(); }catch(e){}
})();
