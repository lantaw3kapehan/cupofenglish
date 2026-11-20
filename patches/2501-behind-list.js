// 2501 (audit #3, mock approved by Misty 12:51 "go ahead and build it"): one "Behind" list on the management Overview.
//   One row per teacher: what is missing, with its real due date where there is one.
//   · Monthly feedback: due on the 25th before the report month (overdue red after it, "not due yet" grey before)
//   · No time-in yet: the first class time (red once it has started)
//   · Notices without "Got it" (last 7 days) and peer reviews not done: "waiting since <date>" (no due date in the data, so none is shown)
//   "Copy WeChat nudge" copies a short, polite reminder for that teacher. The old "Waiting on teachers" group in Needs you is folded into this.
const file = process.argv[2];
const CSS = `<style id="u2501">
#be2501{background:#fff;border:1px solid #ECEAF2;border-radius:18px;padding:16px 18px;margin:14px 0}
#v-home:has(> #pd2360) #be2501{order:2!important}
#be2501 .h{display:flex;align-items:baseline;gap:10px;margin:0 0 6px}#be2501 .h b{font-size:17px;color:#2B2253}#be2501 .h span{font-size:12.5px;color:#6B6880}
#be2501 .t{border-top:1px solid #F1F0F5;padding:10px 0}#be2501 .t:first-of-type{border-top:0}
#be2501 .tn{display:flex;align-items:center;gap:8px;font-weight:700;color:#2B2253;font-size:14.5px}
#be2501 .tn .nb{margin-left:auto;font:600 12px Inter,sans-serif;border:1px solid #E3E1EA;background:#fff;color:#2E6B73;border-radius:999px;padding:4px 10px;cursor:pointer}
#be2501 .pl{font-size:11px;font-weight:700;border-radius:6px;padding:2px 7px}#be2501 .pl.r{background:#FCEBEB;color:#9C2F2F}#be2501 .pl.a{background:#FFF1D6;color:#8A5A00}#be2501 .pl.g{background:#F1F0F5;color:#5F5E5A}
#be2501 .it{display:flex;align-items:center;gap:10px;font-size:13.5px;color:#2B2253;margin-top:5px;cursor:pointer}#be2501 .it:hover{color:#00737B}
#be2501 .dd{margin-left:auto;font-size:12.5px;white-space:nowrap}#be2501 .od{color:#A32D2D;font-weight:600}#be2501 .td{color:#8A5A00}#be2501 .nd{color:#8A869C}
#be2501 .more{font-size:12.5px;color:#00737B;cursor:pointer;margin-top:8px;display:inline-block}
#v-home:has(#be2501) #nd37 .nd-wait{display:none}
</style>`;
const JS = String.raw`<script id="b2501">
(function(){ let OPEN = false;
  const e = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const nm = t => { try{ return typeof tName === 'function' ? tName(t) : String(t || ''); }catch(x){ return String(t || ''); } };
  const mnl = () => new Date(Date.now() + 8 * 3600e3), ymd = d => d.toISOString().slice(0, 10), today = () => ymd(mnl());
  const short = s => { try{ const d = new Date(String(s).slice(0, 10) + 'T00:00:00Z'); return d.getUTCDate() + ' ' + ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getUTCMonth()]; }catch(x){ return ''; } };
  const days = s => Math.round((new Date(today() + 'T00:00:00Z') - new Date(String(s).slice(0, 10) + 'T00:00:00Z')) / 864e5);
  function data(){ const T = {}, add = (t, it) => { const k = nm(t); if(!k) return; (T[k] = T[k] || []).push(it); };
    try{ (typeof MO !== 'undefined' && MO && MO.team || []).filter(x => x.status === 'Missing').forEach(x => { const f = x.first ? new Date(x.first) : null, hm = f ? new Date(f.getTime() + 8 * 3600e3).toISOString().slice(11, 16) : '';
      const st = f && f.getTime() <= Date.now(); add(x.name || x.teacher, { w: 'No time-in yet' + (hm ? ' · first class ' + hm : ''), d: st ? 'class started' : 'before ' + hm, s: st ? 'r' : 'a', go: "go('team')", nudge: 'please time in for your ' + hm + ' class' }); }); }catch(x){}
    try{ if(typeof RP !== 'undefined' && RP && RP.waiting && RP.waiting.length){ const cy = String(RP.month || RP.current || ''), m = /^(\d{4})-(\d{2})$/.exec(cy); let due = '';
        if(m){ const y = +m[1], mo = +m[2]; const py = mo === 1 ? y - 1 : y, pm = mo === 1 ? 12 : mo - 1; due = py + '-' + String(pm).padStart(2, '0') + '-25'; }
        const by = {}; RP.waiting.forEach(x => { by[x.teacher] = (by[x.teacher] || 0) + 1; });
        Object.keys(by).forEach(t => { const late = due && today() > due, dueToday = due === today(); add(t, { w: 'Monthly feedback · ' + by[t] + ' student' + (by[t] === 1 ? '' : 's') + (RP.label ? ' · ' + RP.label : ''), d: due ? (late ? 'due ' + short(due) + ' · ' + days(due) + ' day' + (days(due) === 1 ? '' : 's') + ' late' : dueToday ? 'due today' : 'due ' + short(due)) : '', s: late ? 'r' : dueToday ? 'a' : 'g', go: "RP_K='month';RP_F='wait';go('reports')", nudge: 'monthly feedback for ' + by[t] + ' student' + (by[t] === 1 ? '' : 's') + (due ? ', due ' + short(due) : '') }); }); } }catch(x){}
    try{ const since = ymd(new Date(Date.now() - 7 * 864e5)); (typeof MSG !== 'undefined' && MSG && MSG.threads || []).filter(t => t.root && t.root.role === 'mgmt' && t.root.need && !t.root.ack && String(t.root.at).slice(0, 10) >= since).forEach(t => {
        const sub = String(t.root.subject || t.root.text || 'Notice').replace(/^\W+/, '').slice(0, 48), dd = days(t.root.at); add(t.teacher, { w: 'Notice · ' + sub + ' · no “Got it”', d: 'sent ' + short(t.root.at) + (dd > 0 ? ' · ' + dd + ' day' + (dd === 1 ? '' : 's') : ''), s: dd >= 2 ? 'a' : 'g', go: "go('msgs')", nudge: 'please read the notice "' + sub + '" and tap Got it' }); }); }catch(x){}
    try{ (typeof PM !== 'undefined' && PM && PM.rows || []).filter(x => x.status === 'Assigned').forEach(x => { const dd = days(x.at); add(x.evaluator, { w: 'Peer review of Teacher ' + nm(x.teacher), d: 'assigned ' + short(x.at) + ' · ' + dd + ' day' + (dd === 1 ? '' : 's'), s: dd >= 7 ? 'a' : 'g', go: "go('perf')", nudge: 'the peer review of Teacher ' + nm(x.teacher) }); }); }catch(x){}
    const rk = { r: 0, a: 1, g: 2 };
    return Object.keys(T).map(t => { const L = T[t].sort((a, b) => rk[a.s] - rk[b.s]); return { t, L, top: L[0].s }; }).sort((a, b) => rk[a.top] - rk[b.top] || b.L.length - a.L.length || a.t.localeCompare(b.t)); }
  function html(){ const R = data(); if(!R.length) return ''; const od = R.filter(r => r.top === 'r').length, N = OPEN ? R : R.slice(0, 6);
    return '<div class="h"><b>Behind</b><span>' + R.length + ' teacher' + (R.length === 1 ? '' : 's') + (od ? ' · ' + od + ' overdue' : '') + ' · tap a line to open it</span></div>'
      + N.map(r => '<div class="t"><div class="tn">' + e(r.t) + ' <span class="pl ' + r.top + '">' + (r.top === 'r' ? 'overdue' : r.top === 'a' ? 'needs a nudge' : 'not due yet') + '</span><button type="button" class="nb" data-nudge="' + e(r.t) + '">Copy WeChat nudge</button></div>'
        + r.L.slice(0, 4).map(i => '<div class="it" onclick="' + e(i.go) + '"><span>' + e(i.w) + '</span><span class="dd ' + (i.s === 'r' ? 'od' : i.s === 'a' ? 'td' : 'nd') + '">' + e(i.d) + '</span></div>').join('') + (r.L.length > 4 ? '<div class="it nd" style="color:#8A869C">+ ' + (r.L.length - 4) + ' more</div>' : '') + '</div>').join('')
      + (R.length > 6 ? '<span class="more" data-more="1">' + (OPEN ? 'Show fewer' : 'Show all ' + R.length + ' teachers') + '</span>' : ''); }
  function nudge(t){ const r = data().find(x => x.t === t); if(!r) return; const txt = 'Hi Teacher ' + t + ', a quick reminder: ' + r.L.map(i => i.nudge).join('; ') + '. Thank you!';
    try{ navigator.clipboard.writeText(txt).then(() => { try{ toast('Copied. Paste it in WeChat to Teacher ' + t + '.'); }catch(x){} }); }catch(x){ prompt('Copy this message:', txt); } }
  function place(){ try{ if(!(typeof D !== 'undefined' && D && D.mgr)) return; const home = document.getElementById('v-home'); if(!home) return;
      let box = document.getElementById('be2501'); const h = html();
      if(!h){ if(box) box.remove(); return; }
      if(!box){ box = document.createElement('section'); box.id = 'be2501'; const nd = home.querySelector('#nd37, .nd37'); if(nd && nd.parentElement === home) nd.after(box); else home.prepend(box);
        box.addEventListener('click', ev => { const b = ev.target.closest('[data-nudge]'); if(b){ ev.stopPropagation(); nudge(b.dataset.nudge); return; } if(ev.target.closest('[data-more]')){ OPEN = !OPEN; place(); } }); }
      if(box.dataset.h !== h){ box.innerHTML = h; box.dataset.h = h; } }catch(x){ console.warn('2501', x); } }
  const rh = window.renderHome; if(typeof rh === 'function') window.renderHome = function(){ const r = rh.apply(this, arguments); place(); return r; };
  setInterval(() => { if(typeof VIEW !== 'undefined' && VIEW === 'home') place(); }, 20000);
})();
</script>
`;
require('../tools/lib.js')(file, [['<script id="b2278">', CSS + JS + '<script id="b2278">']]);
