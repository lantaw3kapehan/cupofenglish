/* 19 Oct · 328 · Trial results per teacher + first 90 days for new teachers (Misty: "do all")
   Performance (management): "Trials by teacher · last 120 days" (trials, enrolled %, median hours to the trial report, reports later than 12 h,
   not-enrolled trials with a follow-up) from TR-DATA (coe_trial_stats), and "New teachers · first 90 days" (coe_first90).
   Teacher · My growth: "My first 90 days" checklist while she is in her first 120 days. */
(function(){
  const post = (fn, args) => fetch(FAST_URL + '-mgmt', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'screen', fn, args: args || [], token: TOKEN }) }).then(x => x.json()).then(r => { if(!(r && r.ok)) throw new Error(fn); return r.data; });
  const isT = () => !!(typeof D !== 'undefined' && D && !D.mgr && TOKEN), isM = () => !!(typeof D !== 'undefined' && D && D.mgr && TOKEN);
  let TS = null, TSat = 0, F9 = null, F9at = 0, ME = null, MEat = 0;
  const bar = (n, t) => `<span style="display:inline-block;width:90px;height:8px;border-radius:4px;background:#e9ecef;vertical-align:middle;overflow:hidden"><span style="display:block;height:100%;width:${Math.round(100 * n / Math.max(1, t))}%;background:${n / t >= .8 ? '#2a9d8f' : n / t >= .5 ? '#e9c46a' : '#e76f51'}"></span></span>`;
  function itemsH(x){ return x.items.map(i => `<div class="small" style="padding:3px 0">${i.done ? '<b style="color:#1E7A55">✓</b>' : '<span style="color:#B03A2E">○</span>'} ${esc(i.label)}${i.n != null && !i.done ? ` <span class="mute">(${i.n} so far)</span>` : ''}</div>`).join(''); }
  // management
  function perf(){ const v = $('v-perf'); if(!v || VIEW !== 'perf') return;
    if(TS){ let p = $('trialStats'); if(!p){ p = document.createElement('section'); p.id = 'trialStats'; p.className = 'card'; p.style.cssText = 'padding:12px 14px;margin:0 0 14px'; v.appendChild(p); }
      const L = (TS.teachers || []).filter(x => x.trials >= 2);
      p.innerHTML = `<details><summary><b>🎯 Trials by teacher · last ${TS.days} days</b> <span class="small mute">· who turns trials into students, and how fast the report goes out</span></summary>
<table class="small" style="width:100%;border-collapse:collapse;margin-top:8px"><tr class="mute"><td style="padding:4px 6px 4px 0">Teacher</td><td>Trials</td><td>Enrolled</td><td>Report after</td><td>Late &gt;12 h</td><td>Not enrolled · followed up</td></tr>
${L.map(x => `<tr style="border-top:1px solid var(--line)"><td style="padding:6px 6px 6px 0"><b>${esc(x.teacher)}</b></td><td>${x.trials}</td><td><b style="color:${x.rate >= 75 ? '#1E7A55' : x.rate >= 50 ? '#7a5a00' : '#B03A2E'}">${x.rate}%</b> <span class="mute">(${x.enrolled})</span></td><td>${x.reportHrs == null ? '—' : x.reportHrs + ' h'}</td><td>${x.late ? `<b style="color:#B03A2E">${x.late}</b>` : '0'}</td><td>${x.notEnrolled ? x.followUp + ' of ' + x.notEnrolled : '—'}</td></tr>`).join('')}</table>
<div class="small mute" style="margin-top:6px">From TR-DATA · "Enrolled? (auto)" and "Follow-up (pick)" · report time is from the trial start to the report submitted (middle value).</div></details>`; }
    if(F9){ let p = $('first90'); if(!F9.length){ if(p) p.remove(); } else { if(!p){ p = document.createElement('section'); p.id = 'first90'; p.className = 'card'; p.style.cssText = 'padding:12px 14px;margin:0 0 14px'; v.appendChild(p); }
      p.innerHTML = `<details open><summary><b>🌱 New teachers · first 90 days</b> <span class="small mute">· hired in the last 120 days</span></summary>${F9.map(x => `<details style="margin-top:8px;border-top:1px solid var(--line);padding-top:6px"><summary class="small"><b>${esc(x.name)}</b> · day ${x.days} · ${bar(x.done, x.total)} ${x.done} of ${x.total} <span class="mute">· still open: ${esc(x.items.filter(i => !i.done).map(i => i.label.split(' (')[0]).slice(0, 3).join(', '))}${x.items.filter(i => !i.done).length > 3 ? '…' : ''}</span></summary>${itemsH(x)}</details>`).join('')}</details>`; } } }
  function loadM(){ if(!isM()) return; if(Date.now() - TSat > 10 * 6e4){ TSat = Date.now(); post('mgmtTrialStats', [120]).then(d => { TS = d; perf(); }).catch(() => { TSat = 0; }); }
    if(Date.now() - F9at > 10 * 6e4){ F9at = Date.now(); post('mgmtFirst90', ['']).then(d => { F9 = d || []; perf(); }).catch(() => { F9at = 0; }); } }
  const _rp = window.renderPerf; if(_rp) window.renderPerf = function(){ const x = _rp.apply(this, arguments); try{ perf(); loadM(); }catch(e){} return x; };
  // teacher
  try{ ME = JSON.parse(localStorage.getItem('coe.first90') || 'null'); }catch(e){}
  function mine(){ const v = $('v-growth'); if(!v || !isT()) return; let c = $('first90Me'); const x = ME && ME[0];
    if(!x || x.days > 120){ if(c) c.remove(); return; }
    if(!c){ c = document.createElement('section'); c.id = 'first90Me'; c.className = 'card'; c.style.cssText = 'padding:14px 16px;margin:0 0 14px'; const k = $('kxCard') || v.querySelector('.lead'); if(k) k.after(c); else v.prepend(c); }
    c.innerHTML = `<div class="small mute" style="letter-spacing:.06em;text-transform:uppercase">My first 90 days · day ${x.days}</div><div class="row" style="align-items:center;gap:10px;margin:6px 0 8px"><b style="font-size:22px">${x.done} of ${x.total}</b> ${bar(x.done, x.total)}<span class="small mute">${x.done === x.total ? 'All done · well done! 🎉' : 'steps done'}</span></div>${itemsH(x)}<div class="small mute" style="margin-top:6px">Your start at CupOfEnglish, step by step. Ask Operations if anything is unclear.</div>`; }
  function loadT(){ if(!isT() || Date.now() - MEat < 10 * 6e4) return; MEat = Date.now(); post('tFirst90').then(d => { ME = d || []; try{ localStorage.setItem('coe.first90', JSON.stringify(ME)); }catch(e){} mine(); }).catch(() => { MEat = 0; }); }
  const _pg = window.paintGrowth; if(_pg) window.paintGrowth = function(){ const x = _pg.apply(this, arguments); try{ mine(); loadT(); }catch(e){} return x; };
  setTimeout(() => { if(isT()) loadT(); }, 5000);
})();
