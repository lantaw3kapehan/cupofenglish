/* 20 Oct · 429 · Student page aligned with the calendar (Misty: "can they be better to match it and aligned").
   · The Overview / Progress / Notes / Profile tabs keep a white band when they stick at the top, so text no longer shows through.
   · Status: one calm line (status · buttons on the right), smaller buttons, the notes underneath.
   · Changes · step by step: a slim folded row with an arrow, like List view.
   · Schedule: coming up / done / cancelled become small pills in one row; "Weekly picture" sits next to "+ Class" instead of a full-width button;
     "Last 45 days" reads like "List view".
   · Calendar: the day the package runs out is marked "pkg ends" (coral), classes booked after it get a coral outline, and a warning
     says how many are beyond the lessons left and when the package ends.
   · Package: each ACTIVE row gets a bar (done / left) and the deadline as a chip (amber within 30 days, coral when passed). */
(function(){
  const css = document.createElement('style');
  css.textContent = `
#sheetBody.stu2 .stu-tabs{background:#fff!important;box-shadow:-30px 0 0 #fff,30px 0 0 #fff,0 8px 10px -10px rgba(45,42,74,.18);z-index:7;padding:8px 0!important}
#stuStat{display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;column-gap:14px;row-gap:4px;padding-top:14px!important;padding-bottom:14px!important}
#stuStat>h2{margin:0!important}
#stuStat>div.small{margin:0!important;font-size:14px;color:var(--ink)}
#stuStat>div.row{justify-content:flex-end}
#stuStat>div.row .btn{font-size:13px!important;padding:7px 14px!important;min-height:0!important}
#stuStat>div:last-child{grid-column:1/-1;margin-top:2px!important}
#stuStat>div:last-child .small.mute{font-size:12.5px}
#stuRn{padding-top:12px!important;padding-bottom:12px!important}
#stuRn details.rn4>summary{list-style:none;cursor:pointer;display:flex;align-items:baseline;gap:6px;font-size:15px}
#stuRn details.rn4>summary::-webkit-details-marker{display:none}
#stuRn details.rn4>summary:before{content:'›';display:inline-block;color:var(--teal);font-weight:700;transition:transform .15s;width:12px}
#stuRn details.rn4[open]>summary:before{transform:rotate(90deg)}
#stuRn details.rn4[open]>summary{margin-bottom:6px}
#stuSch .stats{display:flex!important;flex-wrap:wrap;gap:8px;margin-top:4px}
#stuSch .stats .stat{flex:0 0 auto!important;display:flex;align-items:baseline;gap:6px;padding:6px 14px!important;border-radius:999px!important;min-height:0!important;background:var(--soft)}
#stuSch .stats .stat b.num{font-size:17px!important;line-height:1.2}
#stuSch .stats .stat span{font-size:12.5px!important;margin:0!important}
#stuSch .stats .stat:first-child{background:var(--tint)}
#stuSch details.fbold>summary,#stuSch details.lv28>summary{font-size:12.5px!important;font-weight:700;color:#2F6F77!important}
#stuSch details.lv28{margin-top:12px}
.cal28 .d.ped{box-shadow:inset 0 -3px 0 #C0563F}
.cal28 .d.ped:after{content:'pkg ends';font-size:9px;color:#C0563F;font-weight:700;text-align:center;margin-top:auto}
.cal28 .d.ped.lsd:after{content:'pkg ends · last'}
.cal28 .k.ov:not(.cx){box-shadow:inset 0 0 0 1.5px #C0563F;background:#fff!important;color:#C0563F}
.cal28 .ft .ow{margin-top:6px;padding:8px 12px;border-radius:10px;background:#FDF1EE;color:#8A3B2A;font-size:12.5px}
.cal28 .ft .ow b{color:#8A3B2A}
#stuPkg .mini{border:1px solid var(--line);background:#fff!important;border-radius:14px!important}
#stuPkg .pb29{display:flex;align-items:center;gap:10px;margin-top:8px}
#stuPkg .pb29 .tr{flex:1;height:8px;border-radius:4px;background:var(--soft);overflow:hidden;display:flex;gap:2px}
#stuPkg .pb29 .tr i{display:block;height:100%}
#stuPkg .pb29 span{font-size:12px;color:#8A86A0;white-space:nowrap}
#stuPkg .dl29{display:inline-block;font-size:11.5px;padding:2px 9px;border-radius:999px;margin-left:6px;background:var(--soft);color:#55526E;font-weight:700}
#stuPkg .dl29.soon{background:#FCF1DC;color:#9A6A10}#stuPkg .dl29.past{background:#FDF1EE;color:#B4442F}
@media(max-width:700px){#stuStat{grid-template-columns:1fr}#stuStat>div.row{justify-content:flex-start}}`;
  document.head.appendChild(css);
  /* Schedule header: the weekly picture button next to + Class */
  const _ss = window.stuSched;
  if(_ss) window.stuSched = function(L){ let h = _ss.apply(this, arguments);
    try{ const big = '<button class="btn teal block noprint" style="margin-top:10px" onclick="wkPic()">New weekly schedule · picture to send</button>';
      if(h.indexOf(big) >= 0){ h = h.replace(big, '');
        h = h.replace('<button class="btn sm teal noprint" style="margin-left:auto;letter-spacing:0;text-transform:none" onclick="classForm(',
          '<button class="btn sm ghost noprint" style="margin-left:auto;letter-spacing:0;text-transform:none" title="New weekly schedule · picture to send" onclick="wkPic()">Weekly picture</button><button class="btn sm teal noprint" style="margin-left:8px;letter-spacing:0;text-transform:none" onclick="classForm('); } }catch(e){}
    return h; };
  /* Package bar + deadline chip */
  const num = s => +String(s).replace(/[^\d.]/g, '');
  function deco(){ const box = document.getElementById('stuPkg'); if(!box) return;
    box.querySelectorAll('.mini').forEach(m => { if(m.querySelector('.pb29')) return; const t = m.querySelector('.small.mute'); if(!t) return;
      const x = t.textContent.match(/Lessons ([\d.]+) · done ([\d.]+) · ([\d.]+) left/); if(!x) return;
      const tot = num(x[1]), done = num(x[2]), left = num(x[3]); if(!tot) return;
      const dm = t.textContent.match(/deadline (\d{4}-\d{2}-\d{2})/); let chip = '';
      if(dm){ const days = Math.round((new Date(dm[1] + 'T00:00:00') - new Date(new Date().toDateString())) / 864e5);
        chip = '<span class="dl29 ' + (days < 0 ? 'past' : days <= 30 ? 'soon' : '') + '">' + (days < 0 ? 'Deadline passed ' + (-days) + ' days ago' : 'Valid ' + days + ' more days') + '</span>'; }
      const pd = Math.min(100, done / tot * 100), pl = Math.max(0, Math.min(100 - pd, left / tot * 100)), lc = left <= 3 ? '#D4705A' : left <= 8 ? '#E0A030' : '#00A3AD';
      t.insertAdjacentHTML('afterend', '<div class="pb29"><div class="tr"><i style="width:' + pd + '%;background:#9ED9DD"></i><i style="width:' + pl + '%;background:' + lc + '"></i></div><span><b style="color:var(--ink)">' + done + '</b> done · <b style="color:' + lc + '">' + left + '</b> left of ' + tot + '</span>' + chip + '</div>'); }); }
  let q = 0; new MutationObserver(() => { if(q) return; q = requestAnimationFrame(() => { q = 0; try{ deco(); }catch(e){} }); }).observe(document.body, { childList: true, subtree: true });
})();
/* 429b · Profile tab with a focus (Misty: "too simple, you don't know where to focus").
   · Top: "With us 1 year, 5 months" and a journey line: Trial → First class → Renewed (cycle) → Today, each with its date.
   · Two cards side by side: Student (names, type, birthdate · age, gender, grade, city) as a tidy list, and Lessons
     (lesson, total, free lessons, renewal cycle as big numbers; CEFR & books and source as chips).
   · Trial class on one line (date · time · book · CEFR · Teacher). Every other DATABASE field is still shown under "More details". */
(function(){
  const css = document.createElement('style');
  css.textContent = `
.pf29{margin-top:12px;display:flex;flex-direction:column;gap:12px}
.pf29 .cd{border:1px solid var(--line);border-radius:14px;background:#fff;padding:14px 16px}
.pf29 .cd>h3{font-size:11.5px;letter-spacing:.08em;text-transform:uppercase;color:#2F6F77;margin:0 0 10px}
.pf29 .jy .top{display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;margin-bottom:6px}
.pf29 .jy .top b{font-family:var(--brand);font-weight:400;font-size:22px;color:var(--ink)}
.pf29 .jy .top span{font-size:12.5px;color:#8A86A0}
.pf29 .ln{position:relative;height:74px;margin:6px 18px 0}
.pf29 .ln:before{content:'';position:absolute;left:0;right:0;top:22px;height:4px;border-radius:2px;background:linear-gradient(90deg,#9ED9DD,#00A3AD)}
.pf29 .ms{position:absolute;top:0;transform:translateX(-50%);text-align:center;width:120px}
.pf29 .ms i{display:block;width:16px;height:16px;border-radius:8px;margin:16px auto 6px;background:#fff;box-shadow:inset 0 0 0 4px var(--c)}
.pf29 .ms b{display:block;font-size:12px;color:var(--ink)}
.pf29 .ms span{display:block;font-size:11.5px;color:#8A86A0;white-space:nowrap}
.pf29 .two{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px}
.pf29 dl{margin:0;display:grid;grid-template-columns:auto minmax(0,1fr);column-gap:0;row-gap:0}
.pf29 dt{padding-right:16px!important}
.pf29 .rc{display:flex;flex-direction:column;gap:12px}
.pf29 dt,.pf29 dd{padding:7px 0;border-bottom:1px solid #F3F2F7;font-size:13.5px}
.pf29 dt{color:#8A86A0}
.pf29 dd{margin:0;color:var(--ink);font-weight:700;text-align:right;overflow-wrap:anywhere}
.pf29 dl>*:nth-last-child(-n+2){border-bottom:0}
.pf29 .nums{display:grid;grid-template-columns:repeat(auto-fit,minmax(90px,1fr));gap:8px}
.pf29 .nums div{background:var(--soft);border-radius:12px;padding:10px 12px}
.pf29 .nums div:first-child{background:var(--tint)}
.pf29 .nums b{display:block;font-family:var(--brand);font-weight:400;font-size:24px;color:var(--ink);line-height:1.1}
.pf29 .nums span{font-size:12px;color:#8A86A0}
.pf29 .tg{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}
.pf29 .tg span{font-size:12.5px;padding:4px 11px;border-radius:999px;background:var(--soft);color:#3F3B5C}
.pf29 .tg span em{font-style:normal;color:#8A86A0;margin-right:4px}
.pf29 .tg span.t{background:var(--tint);color:#00737B;font-weight:700}
.pf29 .tr1{display:flex;flex-wrap:wrap;gap:6px 18px;font-size:13.5px;color:var(--ink)}
.pf29 .tr1 span em{font-style:normal;color:#8A86A0;margin-right:6px;font-size:12px}
.pf29 .tr1 b{font-weight:700}
.pf29 details.more>summary{font-size:12.5px;font-weight:700;color:#2F6F77;cursor:pointer}
.pf29 details.more .pgrp:first-of-type{margin-top:8px}
@media(max-width:760px){.pf29 .two{grid-template-columns:1fr}.pf29 .ms{width:84px}}
@media print{.pf29 details.more{display:block}}`;
  document.head.appendChild(css);
  const MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  function pd(v){ v = String(v || '').trim(); let m = v.match(/^(\d{4})-(\d{2})-(\d{2})/); if(m) return new Date(+m[1], +m[2] - 1, +m[3]);
    m = v.match(/^(\d{1,2})[-\s\/]([A-Za-z]{3})[a-z]*[-\s\/,]*(\d{4})$/); if(m){ const i = MON.map(x => x.toLowerCase()).indexOf(m[2].toLowerCase()); if(i >= 0) return new Date(+m[3], i, +m[1]); } return null; }
  const fd = d => d ? d.getDate() + ' ' + MON[d.getMonth()] + ' ' + d.getFullYear() : '';
  const _dp = window.dbProfile; if(!_dp) return;
  window.dbProfile = function(P){ const h = _dp.apply(this, arguments);
    try{ const t = document.createElement('template'); t.innerHTML = h; const h2 = t.content.querySelector('h2'); const G = [...t.content.querySelectorAll('.pgrp')];
      if(!h2 || !G.length) return h;
      const F = []; G.forEach(g => { const gn = (g.querySelector('h3') || {}).textContent || ''; g.querySelectorAll('.facts>div').forEach(d => F.push({ g: gn.trim(), k: ((d.querySelector('span') || {}).textContent || '').trim(), v: ((d.querySelector('b') || {}).textContent || '').trim(), el: d })); });
      const used = new Set(), take = (gr, kr) => { const f = F.find(x => !used.has(x) && gr.test(x.g) && kr.test(x.k)); if(f){ used.add(f); return f.v; } return ''; };
      const S = /^student$/i, TR = /trial/i, EN = /enrol/i;
      const cn = take(S, /chinese/i), en = take(S, /english/i), ty = take(S, /type/i), bd = take(S, /birth/i), age = take(S, /^age/i), gen = take(S, /gender/i), gr = take(S, /grade/i), city = take(S, /city/i);
      let cyc = '', cv; while((cv = take(/./, /renewal cycle/i)) !== '') cyc = cv; /* DATABASE has two RENEWAL CYCLE columns: the last filled one counts */
      const tD = take(TR, /date/i), tT = take(TR, /time/i), tB = take(TR, /book/i), tC = take(TR, /cefr/i), tTe = take(TR, /teacher/i);
      const len = take(EN, /length/i), fc = take(EN, /first class/i), les = take(EN, /^lesson/i), tot = take(EN, /^total/i), cb = take(EN, /cefr/i), src = take(/./, /^source/i), fr = take(/./, /free/i), rd = take(/./, /renewal date/i);
      /* journey */
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const M = [[pd(tD), 'Trial', '#E0A030'], [pd(fc), 'First class', '#00A3AD'], [pd(rd), 'Renewed' + (cyc ? ' · cycle ' + cyc : ''), '#2B2253'], [today, 'Today', '#00808A']].filter(x => x[0]);
      let jy = '';
      if(M.length >= 2){ const a = Math.min(...M.map(x => +x[0])), b = Math.max(...M.map(x => +x[0])), sp = Math.max(1, b - a);
        let last = -99; const pos = M.map(x => { let p = (x[0] - a) / sp * 100; if(p - last < 14) p = Math.min(100, last + 14); last = p; return p; });
        jy = '<div class="cd jy"><div class="top"><b>' + esc(len ? 'With us ' + len.replace(/,\s*\d+\s*days?$/i, '').replace(/\b1 years\b/, '1 year').replace(/\b1 months\b/, '1 month') : 'Journey') + '</b><span>' + (fc ? 'since ' + esc(fd(pd(fc))) : '') + '</span></div><div class="ln">' +
          M.map((x, i) => '<div class="ms" style="left:' + pos[i] + '%;--c:' + x[2] + '"><i></i><b>' + esc(x[1]) + '</b><span>' + esc(fd(x[0])) + '</span></div>').join('') + '</div></div>'; }
      const row = (k, v) => v ? '<dt>' + k + '</dt><dd>' + esc(v) + '</dd>' : '';
      const stu = '<div class="cd"><h3>Student</h3><dl>' + row('Chinese name', cn) + row('English name', en) + row('Student type', ty) + row('Birthdate', bd ? fd(pd(bd)) || bd : '') + row('Age', age) + row('Gender', gen) + row('School grade', gr) + row('Living city', city) + '</dl></div>';
      const num = (v, l) => v !== '' ? '<div><b>' + esc(v) + '</b><span>' + l + '</span></div>' : '';
      const lsn = '<div class="cd"><h3>Lessons</h3><div class="nums">' + num(les, 'lesson') + num(tot, 'total') + num(fr, 'free lessons') + num(cyc, 'renewal cycle') + '</div><div class="tg">' +
        (cb ? '<span class="t"><em>CEFR &amp; books</em>' + esc(cb) + '</span>' : '') + (src ? '<span><em>Source</em>' + esc(src) + '</span>' : '') + (rd ? '<span><em>Renewal date</em>' + esc(fd(pd(rd)) || rd) + '</span>' : '') + (fc ? '<span><em>First class</em>' + esc(fd(pd(fc)) || fc) + '</span>' : '') + '</div></div>';
      const ti = (k, v) => v ? '<span><em>' + k + '</em><b>' + esc(v) + '</b></span>' : '';
      const trial = (tD || tC || tB) ? '<div class="cd"><h3>Trial class</h3><div class="tr1">' + ti('Date', fd(pd(tD)) || tD) + ti('Time', tT) + ti('Book', tB) + ti('CEFR', tC) + ti('Teacher', tTe ? 'Teacher ' + tTe : '') + '</div></div>' : '';
      used.forEach(f => f.el.remove()); G.forEach(g => { if(!g.querySelector('.facts>div')) g.remove(); });
      const rest = [...t.content.querySelectorAll('.pgrp')].map(g => g.outerHTML).join('');
      return h2.outerHTML + '<div class="pf29">' + jy + '<div class="two">' + stu + '<div class="rc">' + lsn + trial + '</div></div>' + (rest ? '<details class="more cd"><summary>More details</summary>' + rest + '</details>' : '') + '</div>';
    }catch(e){ console.warn('pf29', e); return h; } };
})();
