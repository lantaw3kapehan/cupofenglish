/* 19 Oct · 292 · Teacher Excellence for teachers (Misty: "build it for teacher's access now", all teachers)
   1 · Header, under the name: "Master Teacher · ₱200/lesson · 🥈 Silver · #3 of 8 · October so far" (tap → Growth)
   2 · My growth: this month's card (level, place, total, the four parts, strength and next focus from the latest QA, the top 3) and the timeline of every month since September 2026
   3 · Today: "Teacher of the Month" for last month, the first 7 days of a new month
   Only her own numbers and the top 3 (names, level, score) — never another teacher's details. Monthly recognition: separate from pay and from the teacher rank. */
(function(){
  const post = (fn, args) => fetch(FAST_URL + '-mgmt', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'screen', fn, args: args || [], token: TOKEN }) }).then(x => x.json()).then(r => { if(!(r && r.ok)) throw new Error(fn); return r.data; });
  let K = null, Kat = 0, Kbusy = false;
  try{ const c = JSON.parse(localStorage.getItem('coe.kx.me') || 'null'); if(c && c.on) K = c; }catch(e){}
  const LV = { Gold: 'background:#f6d365;color:#5a4300', Silver: 'background:#dfe4ea;color:#3a4250', Bronze: 'background:#e8b98a;color:#5b3412', Developing: 'background:#eef0f2;color:#555' };
  const MED = { Gold: '🥇', Silver: '🥈', Bronze: '🥉', Developing: '🌱' };
  const chip = l => l ? `<span class="chip" style="${LV[l] || ''};font-weight:600">${MED[l] || ''} ${esc(l)}</span>` : '';
  const mShort = ym => { try{ return new Date(ym + '-15T12:00:00').toLocaleDateString('en-GB', { month: 'long' }); }catch(e){ return ym; } };
  const isT = () => !!(typeof D !== 'undefined' && D && !D.mgr && TOKEN);
  const cur = () => K && K.months && K.months.length ? K.months[K.months.length - 1] : null;
  function load(force){ if(Kbusy || !isT() || (!force && Date.now() - Kat < 10 * 6e4)) return; Kbusy = true;
    post('tKpi').then(d => { K = d || null; Kat = Date.now(); try{ localStorage.setItem('coe.kx.me', JSON.stringify(K)); }catch(e){} paintAll(); }).catch(() => {}).finally(() => { Kbusy = false; }); }

  // 1 · the header badge
  function badge(){ const el = $('hRank'); if(!el || !isT()) return; const old = el.querySelector('.kxb'); if(old) old.remove(); const m = cur(); if(!K || !K.on || !m) return;
    const me = m.me || {}, when = mShort(m.month) + (m.final ? '' : ' so far');
    const txt = me.rank ? `${MED[me.level] || ''} ${esc(me.level || '')} · #${me.rank} of ${m.n} · ${when}` : `${when} · not ranked yet`;
    const s = document.createElement('span'); s.className = 'kxb'; s.style.cssText = 'cursor:pointer;white-space:nowrap'; s.title = 'Teacher Excellence · tap for details';
    s.innerHTML = ' · <u style="text-decoration-style:dotted;text-underline-offset:3px">' + txt + '</u>'; s.onclick = e => { e.stopPropagation(); try{ go('growth'); setTimeout(() => { const c = $('kxCard'); if(c) c.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 250); }catch(x){} };
    el.appendChild(s); }

  // 2 · the Growth card and timeline
  const P = [['quality', 'Quality', 'your QA and class visits'], ['progress', 'Progress', 'progress checks, class notes, new books'], ['trust', 'Trust', 'trials enrolled, students still with us, recognitions'], ['reliability', 'Reliability', 'time-ins, demerits, hours taught and opened']];
  const bar = v => v == null ? '<span class="mute small">no data yet</span>' : `<span style="display:inline-block;width:90px;height:8px;border-radius:4px;background:#e9ecef;vertical-align:middle;overflow:hidden"><span style="display:block;height:100%;width:${Math.max(0, Math.min(100, v))}%;background:${v >= 80 ? '#2a9d8f' : v >= 60 ? '#e9c46a' : '#e76f51'}"></span></span> <b class="small">${v}</b>`;
  const clip = (s, n) => { s = String(s || '').split(/\n/)[0].trim(); return s.length > n ? s.slice(0, n).replace(/\s+\S*$/, '') + '…' : s; };
  function cardHtml(){ const m = cur(); if(!K || !K.on || !m) return ''; const me = m.me || {}, pl = me.pillars || {}, q = K.qa;
    const head = me.rank ? `<div style="font-size:30px;font-weight:700;line-height:1">${me.total}</div><div class="small mute">#${me.rank} of ${m.n} teachers</div>` : `<div class="small mute">Not ranked this month (20 hours or more to be ranked)</div>`;
    const tl = K.months.slice().reverse().map(x => `<tr><td style="padding:5px 8px 5px 0">${esc(x.label)}${x.final ? '' : ' <span class="mute small">so far</span>'}</td><td>${x.me.rank ? chip(x.me.level) : '<span class="mute small">not ranked</span>'}</td><td class="num" style="text-align:right">${x.me.rank ? '#' + x.me.rank + ' of ' + x.n : ''}</td><td class="num" style="text-align:right"><b>${x.me.total == null ? '—' : x.me.total}</b></td></tr>`).join('');
    return `<section class="card" id="kxCard" style="padding:14px 16px;margin:0 0 14px">
<div class="small mute" style="letter-spacing:.06em;text-transform:uppercase">Teacher Excellence · ${esc(m.label)}${m.final ? '' : ' (so far)'}</div>
<div class="row" style="gap:14px;align-items:center;margin:8px 0 10px"><div class="grow">${me.rank ? chip(me.level) : ''}</div><div style="text-align:right">${head}</div></div>
${P.map(p => `<div class="row" style="gap:8px;align-items:center;margin:5px 0"><div style="min-width:92px"><b class="small">${p[1]}</b></div><div class="grow">${bar(pl[p[0]])}</div></div><div class="small mute" style="margin:-3px 0 4px 100px">${p[2]}</div>`).join('')}
${q && (q.strength || q.next) ? `<div style="margin-top:10px">${q.strength ? `<p class="small" style="margin:4px 0"><b>Keep doing</b> · ${esc(clip(q.strength, 220))}</p>` : ''}${q.next ? `<p class="small" style="margin:4px 0"><b>Next focus</b> · ${esc(clip(q.next, 220))}</p>` : ''}<div class="small mute">From your ${esc(q.period)} QA · the full notes are in QA feedback</div></div>` : ''}
${m.top && m.top.length ? `<div style="margin-top:12px"><b class="small">Top 3 · ${esc(mShort(m.month))}${m.final ? '' : ' so far'}</b><div class="row" style="gap:8px;margin-top:6px;flex-wrap:wrap">${m.top.map((t, i) => `<div class="card grow" style="padding:8px 10px;text-align:center;min-width:90px;${t.rank === me.rank && me.rank ? 'outline:2px solid #2a9d8f' : ''}"><div>${['🥇', '🥈', '🥉'][i] || ''}</div><b class="small">${esc(tName(t.name))}</b><div class="small mute">${esc(t.level || '')}</div></div>`).join('')}</div></div>` : ''}
<details style="margin-top:12px"><summary class="small"><b>My months</b> · every month, for transparency</summary><table class="small" style="width:100%;border-collapse:collapse;margin-top:6px">${tl}</table></details>
<details style="margin-top:6px"><summary class="small"><b>How it works</b></summary><p class="small mute" style="margin:6px 0">A monthly recognition worked out from what is already in the app: Quality 40 (your QA as on QA feedback, and class visits) · Progress 20 · Trust 20 · Reliability 20. Gold 85+ · Silver 70+ · Bronze 55+. A part with no data that month is left out, not counted as zero. Teachers with 20 hours or more are ranked. It is updated every day until the month ends. It does not change your pay or your teacher rank (Junior, Senior, Master…) — demerits and penalties for pay follow your contract as always.</p></details>
</section>`; }
  function growthCard(){ const el = $('v-growth'); if(!el || !isT()) return; const old = $('kxCard'); if(old) old.remove(); const h = cardHtml(); if(!h) return;
    const t = document.createElement('div'); t.innerHTML = h; const c = t.firstElementChild; const lead = el.querySelector('.lead');
    if(lead && lead.nextSibling) el.insertBefore(c, lead.nextSibling); else el.insertBefore(c, el.firstChild); }

  // 3 · Teacher of the Month on Today (first 7 days of the month, for last month)
  function totm(){ const el = $('v-today'); if(!el || !isT()) return; const old = $('kxTotm'); if(old) old.remove(); if(!K || !K.on || new Date().getDate() > 7) return;
    const L = (K.months || []).filter(x => x.final), m = L[L.length - 1]; if(!m || !m.top || !m.top.length) return;
    const ym = new Date(); ym.setDate(1); ym.setMonth(ym.getMonth() - 1); const want = ym.getFullYear() + '-' + String(ym.getMonth() + 1).padStart(2, '0'); if(m.month !== want) return;
    const w = m.top[0], mine = m.me && m.me.rank === 1;
    const t = document.createElement('div'); t.innerHTML = `<section class="card" id="kxTotm" style="padding:14px 16px;margin:0 0 14px;border:2px solid #f6d365">
<div style="font-size:26px">🏆</div><b>Teacher of the Month · ${esc(m.label)}</b>
<div style="font-size:20px;margin:4px 0">${mine ? 'Congratulations, you! 🎉' : 'Congratulations, Teacher ' + esc(tName(w.name)) + '!'}</div>
<div class="small mute">${m.top.map((t, i) => ['1st', '2nd', '3rd'][i] + ' · ' + esc(tName(t.name)) + ' (' + esc(t.level || '') + ')').join(' · ')}</div>
<button class="btn sm ghost" style="margin-top:8px" onclick="go('growth')">See my month</button></section>`;
    const c = t.firstElementChild, lead = el.querySelector('.lead'); if(lead && lead.nextSibling) el.insertBefore(c, lead.nextSibling); else el.insertBefore(c, el.firstChild); }

  function paintAll(){ try{ badge(); }catch(e){} try{ if(VIEW === 'growth') growthCard(); }catch(e){} try{ if(VIEW === 'today') totm(); }catch(e){} }
  const _r = window.render; if(_r) window.render = function(){ const x = _r.apply(this, arguments); try{ badge(); }catch(e){} try{ load(); }catch(e){} return x; };
  const _pg = window.paintGrowth; if(_pg) window.paintGrowth = function(){ const x = _pg.apply(this, arguments); try{ growthCard(); }catch(e){} try{ load(); }catch(e){} return x; };
  const _rt = window.renderToday; if(_rt) window.renderToday = function(){ const x = _rt.apply(this, arguments); try{ totm(); }catch(e){} return x; };
  window.kxMeReload = () => load(true);
  setTimeout(() => { try{ load(); paintAll(); }catch(e){} }, 1500);
})();
