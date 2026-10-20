/* 20 Oct · 408 · To do with clear categories (Misty: "arranged strategically with colours, labels and design · too plain").
   Each kind of work has one colour and one icon, used everywhere it appears (top cards, section, row numbers):
     Renewals = amber (money coming in) · Trial follow-ups = purple (new students) · Trial reports = teal (parents) ·
     Data to fix = slate · Package deadlines = grey (no action).
   Tags speak by colour too: green = done (✓, sent, got it) · amber = needs attention (not saved, not followed up,
   validity ended, needed) · grey = information. */
(function(){
  const I = { renew: '<path d="M4 12a8 8 0 0 1 14-5.3L20 9M20 4v5h-5M20 12a8 8 0 0 1-14 5.3L4 15M4 20v-5h5"/>',
    follow: '<path d="M4 5h16v11H8l-4 4z"/><path d="M8 9h8M8 12h5"/>', reports: '<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
    fix: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-2.4z"/>', ref: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>' };
  const svg = k => 'url("data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + I[k] + '</svg>') + '")';
  const C = { renew: ['#B7791F', '#FDF4E3', 'Renewals'], follow: ['#6C5FC7', '#EEEBFA', 'New students'], reports: ['#00808A', '#E3F6F6', 'Parents'], fix: ['#5E6A7D', '#EEF1F5', 'Data'], ref: ['#8A86A0', '#F4F3F8', 'Deadlines'] };
  let css = '';
  Object.keys(C).forEach(k => { const [c, t, lab] = C[k];
    css += `#td-${k}{--cat:${c};--catT:${t}}
#td-${k}>h2,#td-${k}>.row>h2,#td-${k}>summary>h2{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
#td-${k}>h2:before,#td-${k}>.row>h2:before,#td-${k}>summary>h2:before{content:'';width:34px;height:34px;flex:none;border-radius:11px;background:var(--catT) center/18px no-repeat;-webkit-mask:none;box-shadow:inset 0 0 0 1px rgba(0,0,0,.02)}
#td-${k}>h2:after,#td-${k}>.row>h2:after,#td-${k}>summary>h2:after{content:'${lab}';order:-1;display:none}
#td-${k} h2 .ic8{display:inline-block;width:18px;height:18px;background:var(--cat);-webkit-mask:${svg(k)} center/contain no-repeat;mask:${svg(k)} center/contain no-repeat;position:absolute;margin-left:8px}
.tdsum a[onclick*="'${k}'"]{--cat:${c};--catT:${t}}
`; });
  css += `
#v-mtoday section.sec[id^="td-"],#v-mtoday details.sec[id^="td-"]{box-shadow:inset 4px 0 0 var(--cat),var(--sh1)!important;padding-left:22px!important}
#v-mtoday [id^="td-"] h2{position:relative;color:var(--ink)}
#v-mtoday [id^="td-"] h2 .c{flex-basis:100%;margin-left:44px;margin-top:-6px;font-size:13px}
#v-mtoday [id^="td-"] .tdr .tdn{background:var(--catT)!important;color:var(--cat)!important}
#v-mtoday [id^="td-"] .tdr .tdn b{color:var(--cat)!important}
#v-mtoday [id^="td-"] .tdr .tdn.hot{background:#FBECE8!important}#v-mtoday [id^="td-"] .tdr .tdn.hot b{color:#B4442F!important}
#v-mtoday .tdr{border-radius:14px}
#v-mtoday .tdr:hover{background:#FAFAFC}
#v-mtoday .tdr .tags .chip.t-ok{color:#1C7A55!important;border-color:#CFE9DC!important;background:#F3FAF6!important}
#v-mtoday .tdr .tags .chip.t-warn{color:#8A5A0F!important;border-color:#F2DDB0!important;background:#FFFBF2!important}
#v-mtoday .tdr .tags .chip.t-bad{color:#A13C28!important;border-color:#F0C9BF!important;background:#FFF7F5!important}
#v-mtoday .tdr .tags .chip.t-info{color:#55526E!important}
#v-mtoday .tdb .btn.tdp{background:var(--cat)!important;color:#fff!important;border-color:var(--cat)!important}
.tdsum{gap:12px!important}
.tdsum a{position:relative;border:1px solid var(--line)!important;border-radius:var(--r-lg)!important;box-shadow:var(--sh1)!important;background:#fff!important;padding:14px 16px 14px 18px!important;overflow:hidden}
.tdsum a:before{content:'';position:absolute;left:0;top:0;bottom:0;width:4px;background:var(--cat,#C9C6D6)}
.tdsum a b{color:var(--cat,var(--ink))!important}
.tdsum a span{color:var(--ink)!important}
.tdsum a small{color:#B4442F!important}
.tdsum a.hot{background:#fff!important}
.tdsum a.hot:after{content:'needs you';position:absolute;top:10px;right:12px;font-size:10.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#B4442F;background:#FBECE8;border-radius:999px;padding:3px 8px}`;
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  function paint(){ const v = $('v-mtoday'); if(!v) return;
    Object.keys(C).forEach(k => { const s = $('td-' + k); if(!s) return; const h = s.querySelector('h2'); if(h && !h.querySelector('.ic8')){ h.insertAdjacentHTML('afterbegin', '<i class="ic8" style="left:0;top:17px;transform:translateY(-50%);margin-left:8px"></i>'); } });
    v.querySelectorAll('.tdr .tags .chip').forEach(c => { if(c.dataset.t8) return; c.dataset.t8 = 1; const t = c.textContent;
      const k = /✓|\bsent\b|got it|done|enrolling|renewing|agreement ✓/i.test(t) && !/not sent|not followed/i.test(t) ? 't-ok' : /not saved|not followed|needed|no reply|ran out|overdue|missing/i.test(t) ? 't-bad' : /validity ended|extended|deadline|asked|waiting|following up|day \d+/i.test(t) ? 't-warn' : 't-info'; c.classList.add(k); });
    v.querySelectorAll('[id^="td-"] .tdr').forEach(r => { const b = [...r.querySelectorAll('.tdb .btn, .tdb button')].find(x => /^(copy|send)/i.test(x.textContent.trim())); if(b && !b.classList.contains('tdp')) b.classList.add('tdp'); }); }
  const r0 = window.renderMToday; if(r0) window.renderMToday = function(){ const r = r0.apply(this, arguments); try{ paint(); }catch(e){} setTimeout(() => { try{ paint(); }catch(e){} }, 200); return r; };
  try{ if(typeof VIEW !== 'undefined' && VIEW === 'mtoday') renderMToday(); }catch(e){}
})();
