// 810: (Misty) "management screens … too many screens repeated … make it interconnected, especially time-ins; Latest changes should be a
//      different screen to monitor teachers easily … with sub-tabs" · "super productive and minimal … 1 Ops with 10+ teachers, easy and fast"
// New screen MONITOR (Today › Monitor, right under Overview) · from the database (coe-monitor), refreshed every minute:
// · Needs attention: late time-ins, classes with no "I'm in", no video, no homework, no class note (ended classes only) · tap = only those.
// · Teachers board: one line per teacher · Time-in · Classes · I'm in · Video · Homework · Note (x / classes ended so far, red when missing).
//   Tap a teacher → their classes today with each check; tap a class → the class card (tag late, open video, VooV …).
// · Sub-tabs: All · Time-ins · Classes · Videos · Homework & notes · Reports · Schedule · Leave & cases · Students · Money · Messages,
//   plus teacher chips: one teacher across every tab. The activity list follows the tab and the teacher.
// · Time-ins: ONE home. The Time-ins page is the "Time-ins" tab of Monitor (same tab bar on top); the sidebar has Monitor instead.
//   "Latest changes" is no longer repeated on the Time-ins page.
// · Today / Yesterday switch.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 810 · Monitor */
(function(){
  if(window.__810 || typeof NAV_M === 'undefined' || typeof VIEWS === 'undefined') return; window.__810 = 1;
  const css = document.createElement('style'); css.textContent = ['#v-monitor{padding-bottom:40px}',
'.mo-h{display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin:6px 0 10px}.mo-h h1{margin:0}.mo-h .grow{flex:1}',
'.mo-tabs{display:flex;gap:6px;overflow-x:auto;padding:2px 0 8px;margin:0 0 6px;border-bottom:1px solid var(--line);scrollbar-width:none}',
'.mo-tabs button{flex:none;border:0;background:none;padding:8px 12px;border-radius:10px;font:inherit;font-size:14px;font-weight:600;color:var(--ink2);cursor:pointer;white-space:nowrap}',
'.mo-tabs button.on{background:var(--ink);color:#fff}.mo-tabs button i{font-style:normal;opacity:.65;margin-left:4px;font-size:12px}',
'.mo-who{display:flex;gap:6px;flex-wrap:wrap;margin:8px 0 12px}.mo-who button{border:1px solid var(--line);background:#fff;border-radius:999px;padding:5px 12px;font:inherit;font-size:13px;font-weight:600;color:var(--ink2);cursor:pointer}',
'.mo-who button.on{background:var(--teal,#1F8F96);border-color:var(--teal,#1F8F96);color:#fff}',
'.mo-att{display:flex;gap:8px;flex-wrap:wrap;margin:4px 0 14px}.mo-att button{border:0;border-radius:12px;padding:9px 14px;font:inherit;font-size:13.5px;font-weight:700;cursor:pointer;background:#FDECEA;color:#B4442F}',
'.mo-att button.ok{background:#E8F6EE;color:#1C7A55;cursor:default}.mo-att button.on{outline:2px solid #B4442F}',
'.mo-b{background:#fff;border:1px solid var(--line);border-radius:16px;overflow:hidden}',
'.mo-r{display:grid;grid-template-columns:minmax(110px,1.3fr) .9fr .7fr .7fr .7fr .7fr .7fr;gap:6px;align-items:center;padding:11px 14px;border-top:1px solid #F1F0F6;cursor:pointer;font-size:14px}',
'.mo-r:first-child{border-top:0}.mo-r.hd{cursor:default;font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:#8A86A0;background:#FAFAFC}',
'.mo-r b{font-weight:700}.mo-r .ok{color:#1C7A55}.mo-r .bad{color:#B4442F;font-weight:700}.mo-r .mu{color:#A9A6B8}',
'.mo-cl{background:#FAFAFC;padding:4px 14px 10px}.mo-c{display:flex;gap:10px;align-items:center;padding:8px 0;border-top:1px dashed #E6E4EE;font-size:13.5px;cursor:pointer}',
'.mo-c:first-child{border-top:0}.mo-c .tm{width:44px;font-weight:700;color:#5C5876}.mo-c .grow{flex:1;min-width:0}.mo-c .x{text-decoration:line-through;color:#A9A6B8}',
'.mo-k{display:inline-block;font-size:11.5px;font-weight:700;border-radius:999px;padding:2px 8px;margin-left:4px;background:#E8F6EE;color:#1C7A55}.mo-k.no{background:#FDECEA;color:#B4442F}.mo-k.wait{background:#F1F0F6;color:#8A86A0}',
'.mo-f{margin-top:18px}.mo-f h2{font-size:15px;margin:0 0 6px}.mo-it{display:flex;gap:10px;align-items:baseline;padding:7px 2px;border-bottom:1px solid #F3F2F7;font-size:13.5px}',
'.mo-it .tm{width:44px;flex:none;color:#8A86A0;font-weight:600;font-size:12.5px}.mo-it .kd{font-size:11px;text-transform:uppercase;letter-spacing:.04em;background:#F1F0F6;color:#55526E;border-radius:999px;padding:2px 8px;flex:none}',
'.mo-it .er{color:#B4442F;font-size:12.5px}',
'@media(max-width:760px){.mo-r{grid-template-columns:1.2fr .9fr .6fr .6fr .6fr;font-size:13px}.mo-r .m-hw,.mo-r .m-nt{display:none}}',
'#v-team details.tgrp:has(#feed){display:none}'].join('\n');
  document.head.appendChild(css);
  // nav: Monitor right under Overview; Time-ins lives inside Monitor
  try{ if(!NAV_M.some(x => x[0] === 'monitor')){ const h = NAV_M.findIndex(x => x[0] === 'home'); NAV_M.splice(h + 1, 0, ['monitor', 'Monitor', 'team', 0, (NAV_M[h] || [])[4] || 'Today']); }
    const t = NAV_M.findIndex(x => x[0] === 'team'); if(t > -1) NAV_M.splice(t, 1);
    if(VIEWS.indexOf('monitor') < 0) VIEWS.push('monitor');
    if(!$('v-monitor')){ const d = document.createElement('div'); d.id = 'v-monitor'; d.className = 'hide'; const ref = $('v-team') || $('v-home'); ref.parentNode.insertBefore(d, ref); }
    }catch(e){ console.warn('810 nav', e); }
  const TABS = ['All', 'Time-ins', 'Classes', 'Videos', 'Homework & notes', 'Reports', 'Schedule', 'Leave & cases', 'Students', 'Money', 'Messages'];
  const M = { day: '', data: null, tab: 'All', who: '', att: '', open: {}, at: 0, busy: 0 };
  try{ const k = JSON.parse(localStorage.getItem('coe.mon') || 'null'); if(k && k.data){ M.data = k.data; M.day = k.data.day; } }catch(e){}
  try{ const p = JSON.parse(localStorage.getItem('coe.mon.ui') || 'null'); if(p){ M.tab = p.tab || 'All'; M.who = p.who || ''; } }catch(e){}
  const keepUi = () => { try{ localStorage.setItem('coe.mon.ui', JSON.stringify({ tab: M.tab, who: M.who })); }catch(e){} };
  const E = x => esc(String(x == null ? '' : x)), now = () => Date.now();
  const ended = c => Date.parse(c.end) <= now(), started = c => Date.parse(c.start) <= now();
  const isToday = () => M.data && M.data.day === M.data.today;
  async function load(force){ if(M.busy || typeof TOKEN === 'undefined' || !TOKEN) return; if(!force && M.data && now() - M.at < 45000) return; M.busy = 1;
    try{ const r = await fetch(FAST_URL + '-monitor', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, day: M.day || '' }) }).then(x => x.json());
      if(r && r.ok){ M.data = r; M.day = r.day; M.at = now(); if(r.day === r.today) try{ localStorage.setItem('coe.mon', JSON.stringify({ data: r })); }catch(e){} if(VIEW === 'monitor') paint(); } }
    catch(e){} M.busy = 0; }
  // per class: what is missing (only once the class has ended; video and notes are due by 23:59)
  const need = c => !c.cancelled && c.code && c.type !== 'Trial';
  function miss(c){ const o = {}; if(c.cancelled) return o; if(started(c) && !c.ci) o.ci = 1;
    if(ended(c)){ if(c.code && !c.vid && now() - Date.parse(c.end) > 15 * 6e4) o.vid = 1; if(need(c) && !c.hw) o.hw = 1; if(need(c) && !c.note) o.note = 1; } return o; }
  const lateT = t => t.timeIn && /late/i.test(t.timeIn.status || '');
  function counts(T){ const a = { late: 0, ci: 0, vid: 0, hw: 0, note: 0 }; T.forEach(t => { if(lateT(t)) a.late++; t.classes.forEach(c => { const m = miss(c); ['ci', 'vid', 'hw', 'note'].forEach(k => { if(m[k]) a[k]++; }); }); }); return a; }
  const ATT = [['late', 'Late time-in'], ['ci', 'No “I’m in”'], ['vid', 'No video'], ['hw', 'No homework'], ['note', 'No class note']];
  function cell(n, d, cls){ return d ? '<span class="' + (n < d ? 'bad' : 'ok') + ' ' + (cls || '') + '">' + n + ' / ' + d + '</span>' : '<span class="mu ' + (cls || '') + '">—</span>'; }
  function board(T){
    const rows = T.map((t, ti) => { const L = t.classes.filter(c => !c.cancelled), E2 = L.filter(ended), S2 = L.filter(started);
      const vidN = E2.filter(c => c.code), hwN = E2.filter(need), ti0 = t.timeIn;
      const tin = ti0 ? '<span class="' + (lateT(t) ? 'bad' : 'ok') + '">' + E(ti0.time || '✓') + (lateT(t) ? ' · late' : '') + (ti0.out ? ' → ' + E(ti0.out) : '') + '</span>' : (L.length && S2.length ? '<span class="bad">none</span>' : '<span class="mu">—</span>');
      let h = '<div class="mo-r" onclick="moOpen(' + ti + ')"><b>' + E(t.name) + '</b>' + tin + '<span>' + E2.length + ' / ' + L.length + '</span>' +
        cell(S2.filter(c => c.ci).length, S2.length) + cell(vidN.filter(c => c.vid).length, vidN.length) + cell(hwN.filter(c => c.hw).length, hwN.length, 'm-hw') + cell(hwN.filter(c => c.note).length, hwN.length, 'm-nt') + '</div>';
      if(M.open[t.name]) h += '<div class="mo-cl">' + (t.classes.map((c, ci) => { const m = miss(c), tag = (ok, k, l) => '<span class="mo-k ' + (ok ? '' : (k ? 'no' : 'wait')) + '">' + l + '</span>';
          const st = c.cancelled ? '<span class="mo-k wait">cancelled</span>' : [started(c) ? tag(!!c.ci, m.ci, c.ci ? 'In ' + (c.ci.time || '✓') + (/late/i.test(c.ci.status || '') ? ' late' : '') : 'No I’m in') : '',
            c.code ? tag(c.vid, m.vid, c.vid ? 'Video ✓' : 'Video') : '', need(c) ? tag(c.hw, m.hw, c.hw ? 'HW ✓' : 'HW') : '', need(c) ? tag(c.note, m.note, c.note ? 'Note ✓' : 'Note') : ''].join('');
          return '<div class="mo-c" onclick="event.stopPropagation();moClass(\'' + E(c.id) + '\')"><span class="tm">' + E(tm(c.start)) + '</span><span class="grow ell ' + (c.cancelled ? 'x' : '') + '">' + E(c.student || c.code) + ' <span class="mute small">' + E([c.book, c.type].filter(Boolean).join(' · ')) + '</span></span>' + st + '</div>'; }).join('') || '<div class="small mute" style="padding:8px 0">No classes</div>') + '</div>';
      return h; });
    return '<div class="mo-b"><div class="mo-r hd"><span>Teacher</span><span>Time-in</span><span>Classes</span><span>I’m in</span><span>Video</span><span class="m-hw">Homework</span><span class="m-nt">Note</span></div>' + (rows.join('') || '<div class="small mute" style="padding:14px">No classes on this day</div>') + '</div>'; }
  function feed(){ const F = (M.data && M.data.feed) || [], who = M.who.toLowerCase();
    let L = F.filter(x => (M.tab === 'All' || x.tab === M.tab) && (!who || String(x.who).toLowerCase() === who));
    if((M.tab === 'Schedule' || M.tab === 'All') && isToday()){ try{ const day = M.data.day; (PULSE.items || []).filter(x => x && !x.db && (!x.day || x.day === day) && /schedule|class|moved|cancel/i.test(String(x.kind || x.detail || '')) && (!who || String(x.detail || x.who || '').toLowerCase().indexOf(who) > -1))
        .forEach(x => L.push({ t: x.t, time: x.time, who: x.who || '', tab: 'Schedule', kind: 'Schedule', student: String(x.detail || '').replace(/^[^·]*·\s*/, '').slice(0, 90), status: 'done' })); }catch(e){} L.sort((a, b) => b.t - a.t); }
    if(!L.length) return '<div class="small mute" style="padding:10px 2px">Nothing yet.</div>';
    return L.slice(0, 300).map(x => '<div class="mo-it"><span class="tm">' + E(x.time) + '</span><span class="kd">' + E(x.kind) + '</span><span class="grow"><b>' + E(x.who) + '</b>' + (x.student ? ' · ' + E(x.student) : '') + (x.status === 'error' ? ' <span class="er">· not saved: ' + E(x.error || '') + '</span>' : x.status === 'new' ? ' <span class="mute small">· saving…</span>' : '') + '</span></div>').join(''); }
  function tabBar(cur){ const F = (M.data && M.data.feed) || [], n = {}; F.forEach(x => n[x.tab] = (n[x.tab] || 0) + 1);
    return '<div class="mo-tabs">' + TABS.filter(t => ['All', 'Time-ins', 'Classes', 'Videos', 'Homework & notes', 'Reports', 'Schedule'].indexOf(t) > -1 || n[t]).map(t => '<button class="' + (cur === t ? 'on' : '') + '" onclick="moTab(\'' + t + '\')">' + t + (t !== 'All' && t !== 'Time-ins' && n[t] ? '<i>' + n[t] + '</i>' : '') + '</button>').join('') + '</div>'; }
  function paint(){ const v = $('v-monitor'); if(!v) return; const d = M.data;
    if(!d){ v.innerHTML = '<div class="mo-h"><h1>Monitor</h1></div>' + tabBar(M.tab) + '<div class="sk"></div><div class="sk"></div>'; return; }
    let T = d.teachers || []; const who = M.who.toLowerCase();
    if(who) T = T.filter(t => t.name.toLowerCase() === who);
    if(M.att) T = T.map(t => Object.assign({}, t, { classes: M.att === 'late' ? t.classes : t.classes.filter(c => miss(c)[M.att]) })).filter(t => M.att === 'late' ? lateT(t) : t.classes.length);
    const showBoard = ['All', 'Classes', 'Videos', 'Homework & notes'].indexOf(M.tab) > -1, A = counts(who ? (d.teachers || []).filter(t => t.name.toLowerCase() === who) : (d.teachers || []));
    const tday = d.day === d.today, yd = new Date(Date.parse(d.today + 'T12:00:00Z') - 864e5).toISOString().slice(0, 10);
    v.innerHTML = '<div class="mo-h"><h1>Monitor</h1><div class="seg" style="margin:0"><button class="' + (tday ? 'on' : '') + '" onclick="moDay(\'\')">Today</button><button class="' + (d.day === yd ? 'on' : '') + '" onclick="moDay(\'' + yd + '\')">Yesterday</button></div><span class="grow"></span><span class="small mute">Updated ' + E(d.now) + '</span><button class="btn ghost sm" onclick="moLoad()">↻</button></div>' +
      tabBar(M.tab) +
      '<div class="mo-who"><button class="' + (M.who ? '' : 'on') + '" onclick="moWho(\'\')">All teachers</button>' + (d.teachers || []).map(t => '<button class="' + (M.who === t.name ? 'on' : '') + '" onclick="moWho(\'' + E(t.name) + '\')">' + E(t.name) + '</button>').join('') + '</div>' +
      (showBoard ? '<div class="mo-att">' + (ATT.some(([k]) => A[k]) ? ATT.filter(([k]) => A[k]).map(([k, l]) => '<button class="' + (M.att === k ? 'on' : '') + '" onclick="moAtt(\'' + k + '\')">' + l + ' · ' + A[k] + '</button>').join('') : '<button class="ok">✓ Nothing missing so far</button>') + (M.att ? '<button class="ok" style="cursor:pointer" onclick="moAtt(\'\')">Show all</button>' : '') + '</div>' + board(T) : '') +
      '<div class="mo-f"><h2>' + (M.tab === 'All' ? 'Everything done in the app' : E(M.tab)) + (M.who ? ' · ' + E(M.who) : '') + '</h2>' + feed() + '</div>'; }
  window.moLoad = () => load(true);
  window.moTab = t => { if(t === 'Time-ins'){ M.tab = 'Time-ins'; keepUi(); go('team'); return; } M.tab = t; keepUi(); if(VIEW !== 'monitor') go('monitor'); else paint(); };
  window.moWho = w => { M.who = w; keepUi(); paint(); };
  window.moAtt = k => { M.att = M.att === k ? '' : k; if(M.att){ (M.data.teachers || []).forEach(t => M.open[t.name] = 1); } paint(); };
  window.moOpen = i => { let T = (M.data.teachers || []); if(M.who) T = T.filter(t => t.name.toLowerCase() === M.who.toLowerCase()); if(M.att) T = T.filter(t => M.att === 'late' ? lateT(t) : t.classes.some(c => miss(c)[M.att])); const t = T[i]; if(!t) return; M.open[t.name] = !M.open[t.name]; paint(); };
  window.moDay = d => { M.day = d; M.data = null; paint(); load(true); };
  window.moClass = async id => { try{ if(typeof SC !== 'undefined' && SC && SC.events){ const k = SC.events.findIndex(e => e.id === id); if(k > -1) return classEdit(k, ''); }
      if(isToday()){ toast('Opening…'); await loadSchedule(0, true); const k = (SC && SC.events || []).findIndex(e => e.id === id); if(k > -1) return classEdit(k, ''); } }catch(e){} toast('Open it from Schedule'); };
  // the same tab bar on the Time-ins page, so Time-ins feels like part of Monitor
  function strip(){ const v = $('v-team'); if(!v || !D || !D.mgr) return; let b = v.querySelector(':scope > .mo-tabs'); const h = tabBar('Time-ins');
    if(!b){ v.insertAdjacentHTML('afterbegin', '<div class="mo-h"><h1>Monitor</h1></div>' + h); } else if(b.outerHTML !== h) b.outerHTML = h; }
  const hl = v => { try{ document.querySelectorAll('nav button').forEach(b => { if(b.dataset.v === 'monitor') b.classList.toggle('on', v === 'monitor' || v === 'team'); }); }catch(e){} };
  const _go = window.go; window.go = function(v){ const r = _go.apply(this, arguments); try{ if(v === 'monitor'){ if(M.tab === 'Time-ins') M.tab = 'All'; paint(); load(false); } if(v === 'team') setTimeout(strip, 0); hl(v); }catch(e){} return r; };
  const _rt = window.renderTeam; if(typeof _rt === 'function') window.renderTeam = function(){ const r = _rt.apply(this, arguments); try{ if(VIEW === 'team') strip(); }catch(e){} return r; };
  setInterval(() => { try{ if(VIEW === 'monitor' && !document.hidden) load(true); }catch(e){} }, 60000);
  const w0 = () => { if(typeof D !== 'undefined' && D && D.mgr){ try{ buildNav(); }catch(e){} if(VIEW === 'team') strip(); hl(VIEW); load(false); } else setTimeout(w0, 1500); }; setTimeout(w0, 1200);
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
