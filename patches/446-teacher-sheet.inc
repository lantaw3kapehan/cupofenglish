/* 20 Oct · 446 · Teacher card redesign (Misty: "when we click teachers it looks like this, improve it best, with graph/chart or best-fitting visual").
   Same data and the same buttons, laid out as a small dashboard (the card opens wide):
   · Header: avatar in the rank colour, name, rank · rate · lifetime units; the six buttons as one row of pills.
   · Five tiles: units this month (vs last month) · pay so far · students · time-ins on time % · feedback due.
   · Today (timeline with book colours) next to Units & pay (6-month columns, net pay on hover, paid/pending).
   · Time-ins: one line each (when · what · status, an amber "unstable network" chip when ping or jitter is high); device, speed and
     location open under "details" so nothing is lost.
   · Students: two-column cards sorted feedback first, then fewest lessons left; a small bar for lessons left (coral at 5 or fewer).
   · Recent class notes: date blocks, "Ended" as a chip, the plan underneath.
   · Pay history table kept under the chart. Also fixes the card not refreshing after it first opened from memory. */
(function(){
  const css = document.createElement('style');
  css.textContent = `
.t46 .hd{display:flex;align-items:center;gap:14px;padding-right:48px}
.t46 .av{width:52px;height:52px;border-radius:26px;background:var(--rc);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:17px;flex:none}
.t46 .hd h1{margin:0!important;font-size:28px!important}
.t46 .hd .sub{font-size:13px;color:#55526E;margin-top:2px}
.t46 .hd .rk{display:inline-block;font-size:11.5px;font-weight:800;letter-spacing:.04em;padding:2px 9px;border-radius:999px;background:var(--rb);color:var(--rt);margin-right:6px}
.t46 .act{display:flex;flex-wrap:wrap;gap:6px;margin:12px 0 4px}
.t46 .act .btn{font-size:12.5px!important;padding:6px 12px!important;min-height:0!important}
.t46 .kp{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px;margin-top:10px}
.t46 .kp div{background:var(--soft);border-radius:12px;padding:9px 12px}
.t46 .kp b{display:block;font-family:var(--brand);font-weight:400;font-size:22px;color:var(--ink);line-height:1.15}
.t46 .kp span{font-size:12px;color:#55526E}
.t46 .kp em{font-style:normal;font-weight:700;font-size:12px;margin-left:5px}
.t46 .g2{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.2fr);gap:12px;margin-top:12px}
.t46 .cd{border:1px solid var(--line);border-radius:14px;padding:12px 14px;background:#fff;min-width:0}
.t46 .cd>h3,.t46 .sh{display:flex;justify-content:space-between;align-items:baseline;font-size:11px!important;letter-spacing:.08em;text-transform:uppercase;color:#8A86A0!important;margin:0 0 8px!important;font-weight:400!important;font-family:inherit!important}
.t46 .sh{margin:18px 2px 8px!important}
.t46 .sh b{font-weight:700;color:var(--ink);letter-spacing:.04em}
.t46 .td46 .r{display:grid;grid-template-columns:48px 4px minmax(0,1fr) auto;gap:10px;align-items:center;padding:5px 0;font-size:13.5px}
.t46 .td46 .r i{height:22px;border-radius:2px;background:var(--c)}
.t46 .td46 .r.x{opacity:.45;text-decoration:line-through}
.t46 .td46 .r.past b{color:#8A86A0}
.t46 .pc .cs{display:flex;align-items:flex-end;gap:10px;height:120px;padding-top:16px}
.t46 .pc .cs>div{flex:1;position:relative;display:flex;align-items:flex-end;height:100%}
.t46 .pc .cs i{display:block;width:100%;border-radius:4px 4px 0 0;background:#9ED9DD}
.t46 .pc .cs>div.cur i{background:#00A3AD}
.t46 .pc .cs>div.pd i{background:#2E9E6F}
.t46 .pc .cs b{position:absolute;left:0;right:0;text-align:center;font-size:11px;color:var(--ink)}
.t46 .pc .ax{display:flex;gap:10px;font-size:11px;color:#8A86A0;margin-top:4px}
.t46 .pc .ax span{flex:1;text-align:center}
.t46 .pc .ax em{display:block;font-style:normal;color:#55526E}
.t46 .ti .r{border-bottom:1px solid #F1F0F6;padding:6px 2px}
.t46 .ti .l{display:grid;grid-template-columns:110px minmax(0,1fr) auto auto;gap:10px;align-items:center;font-size:13px}
.t46 .ti .l b{font-variant-numeric:tabular-nums}
.t46 .ti .l .w{color:#55526E;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.t46 .ti details>summary{font-size:11.5px;color:#2F6F77;cursor:pointer;margin-top:2px;list-style:none}
.t46 .ti details>summary::-webkit-details-marker{display:none}
.t46 .ti details .small{margin-top:2px}
.t46 .ti .un{font-size:11px;font-weight:700;padding:2px 8px;border-radius:999px;background:#FCF1DC;color:#9A6A10}
.t46 .tbar{display:flex;gap:3px;margin-bottom:8px}
.t46 .tbar i{flex:1;height:8px;border-radius:2px}
.t46 .st{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;align-items:stretch}
.t46 .st .s{border:1px solid var(--line);border-radius:12px;padding:8px 12px;background:#fff;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:2px 10px;align-items:center;cursor:pointer}
.t46 .st .s:hover{border-color:#BFE6E3}
.t46 .st .s.fb{border-left:4px solid #D4705A}
.t46 .st .s .n{font-size:13.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.t46 .st .s .n span{color:#8A86A0;font-size:12px}
.t46 .st .s .e{font-size:12px;color:#8A86A0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.t46 .st .s .lf{text-align:right;font-family:var(--brand);font-size:18px;line-height:1}
.t46 .st .s .lf small{display:block;font-family:inherit;font-size:10.5px;color:#8A86A0}
.t46 .st .s .bar{grid-column:1/-1;height:4px;border-radius:2px;background:var(--soft);overflow:hidden}
.t46 .st .s .bar i{display:block;height:100%}
.t46 .nt .n{display:grid;grid-template-columns:54px minmax(0,1fr);gap:12px;padding:8px 0;border-top:1px solid #F1F0F6}
.t46 .nt .n:first-child{border-top:0}
.t46 .nt .d{text-align:center;background:var(--soft);border-radius:10px;padding:5px 0;align-self:start}
.t46 .nt .d b{display:block;font-family:var(--brand);font-weight:400;font-size:18px;line-height:1.1}
.t46 .nt .d span{font-size:10.5px;color:#8A86A0}
.t46 .nt .t{font-size:13.5px}
.t46 .nt .t .ch{display:inline-block;font-size:11.5px;padding:1px 8px;border-radius:999px;background:var(--tint);color:#00737B;margin-left:6px}
.t46 .nt .t p{margin:3px 0 0;color:#55526E;font-size:13px;line-height:1.45}
.t46 table.py{display:table!important;width:100%!important;margin-left:0!important;border-collapse:collapse;font-size:13px;margin-top:6px}
.t46 table.py td{padding:5px 4px;border-top:1px solid #F1F0F6}
@media(max-width:820px){.t46 .kp{grid-template-columns:repeat(2,minmax(0,1fr))}.t46 .g2,.t46 .st{grid-template-columns:1fr}.t46 .ti .l{grid-template-columns:90px minmax(0,1fr) auto}}`;
  document.head.appendChild(css);
  const RK = [[/master/i, '#3F347E', '#EEEBFA', '#6C5FC7'], [/senior/i, '#00666D', '#E1F4F5', '#00A3AD'], [/junior/i, '#1F5E87', '#E5F0F8', '#3B82B5'], [/newly qualified/i, '#1C6B4C', '#E3F4EC', '#2E9E6F'], [/starting/i, '#8A5A00', '#FFF4DE', '#D9962B'], [/./, '#4C4868', '#F1F2F6', '#9A98A8']];
  const MN = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], WD = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const num = s => { const n = parseFloat(String(s == null ? '' : s).replace(/[^\d.-]/g, '')); return isNaN(n) ? 0 : n; };
  const _old = window.tchHtml;
  window.tchHtml = function(name, p){ try{
    const me = p.me || {}, k = RK.find(z => z[0].test(String(me.rank || ''))) || RK[RK.length - 1], q = s => esc(String(s).replace(/'/g, ''));
    const today = (p.schedule || []).filter(c => c.day === p.today).sort((a, b) => String(a.start).localeCompare(String(b.start)));
    const units = (me.nowReg || 0) + (me.nowTrial || 0) + (me.nowSub || 0), pay = (p.pay || []);
    const prev = pay.find(x => !/^\s*$/.test(String(x.month)) && pay.indexOf(x) > 0 && num(x.units)) || null;
    const T = p.timeIns || [], onT = T.filter(t => t.status === 'On time').length, tp = T.length ? Math.round(onT / T.length * 100) : null;
    const S = (p.students || []).slice(), fb = S.filter(s => s.feedbackDue).length;
    let h = '<div class="t46" style="--rt:' + k[1] + ';--rb:' + k[2] + ';--rc:' + k[3] + '">' +
      '<div class="hd"><div class="av">' + esc(String(name).replace(/^teacher\s+/i, '').slice(0, 2).toUpperCase()) + '</div><div><h1 data-tch="' + esc(name) + '">' + esc(tName(name)) + '</h1><div class="sub">' + (me.rank ? '<span class="rk">' + esc(me.rank) + '</span>' : '') + esc([me.rate ? peso(me.rate) + '/lesson' : '', (me.lifetime || 0).toLocaleString() + ' lifetime units'].filter(Boolean).join(' · ')) + '</div></div></div>' +
      '<div class="act"><button class="btn sm teal" onclick="growthSheet(\'' + q(name) + '\')">Growth</button><button class="btn ghost sm" onclick="payslip(\'' + q(name) + '\')">Payslip</button><button class="btn ghost sm" onclick="avOpen(\'' + q(name) + '\')">Open slots</button><button class="btn ghost sm" onclick="profOpen(\'' + q(name) + '\')">Profile card</button><button class="btn ghost sm" onclick="pwSet(\'' + q(name) + '\')">Password · access</button><button class="btn ghost sm" onclick="closeSheet();go(\'teachers\');loadTT(\'' + q(name) + '\')">TEACHERS tab</button></div>';
    const du = prev ? units - num(prev.units) : null;
    h += '<div class="kp"><div><b>' + units + (prev ? '<em style="color:#8A86A0;font-weight:400">' + esc(String(prev.month).split(' ')[0]) + ' ' + num(prev.units) + '</em>' : '') + '</b><span>units this month</span></div>' +
      '<div><b>' + peso(nowPayOf(me) + (me.monthBonus || 0) - (me.monthDeduct || 0)) + '</b><span>pay so far' + (me.monthBonus ? ' · <span style="color:#1E8A5E">+' + peso(me.monthBonus) + '</span>' : '') + (me.monthDeduct ? ' · <span style="color:#C0563F">−' + peso(me.monthDeduct) + '</span>' : '') + '</span></div>' +
      '<div><b>' + S.length + '</b><span>students</span></div>' +
      '<div><b style="color:' + (tp == null ? 'var(--ink)' : tp >= 90 ? '#1E8A5E' : tp >= 75 ? '#B07A10' : '#C0563F') + '">' + (tp == null ? '—' : tp + '%') + '</b><span>time-ins on time · last ' + T.length + '</span></div>' +
      '<div><b style="color:' + (fb ? '#C0563F' : '#1E8A5E') + '">' + fb + '</b><span>feedback due</span></div></div>';
    /* today + pay chart */
    const now = new Date(), hm = d => String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
    const tdy = today.length ? today.map(c => { const s = new Date(c.start), past = new Date(c.end || c.start) < now; return '<div class="r' + (c.cancelled ? ' x' : '') + (past ? ' past' : '') + '" style="--c:' + (c.cancelled ? '#C9C6D6' : bookCol(c.book)) + '"><b>' + tm(c.start) + '</b><i></i><span class="ell">' + esc(c.student || c.title) + (c.book ? ' <span class="mute">· ' + esc(c.book) + '</span>' : '') + '</span>' + (c.type && c.type !== 'Regular' ? '<span class="chip">' + esc(c.type) + '</span>' : '<span></span>') + '</div>'; }).join('') : '<div class="mute small">No classes today.</div>';
    const P6 = pay.slice(0, 6).reverse(), pm = Math.max(1, ...P6.map(x => num(x.units)));
    const chart = P6.length ? '<div class="cs">' + P6.map((x, i) => { const u = num(x.units), paid = /paid/i.test(x.status || ''); return '<div class="' + (i === P6.length - 1 && !paid ? 'cur' : paid ? 'pd' : '') + '" title="' + esc(x.month) + ': ' + u + ' units · ' + peso(x.net) + ' · ' + esc(paid ? (x.paidOn || 'Paid') : (x.status || 'Pending')) + '"><i style="height:' + Math.max(2, u / pm * 96) + 'px"></i><b style="bottom:' + (u / pm * 96 + 3) + 'px">' + u + '</b></div>'; }).join('') + '</div><div class="ax">' + P6.map(x => '<span>' + esc(String(x.month).split(' ')[0]) + '<em>' + peso(x.net) + '</em></span>').join('') + '</div>' : '<div class="mute small">No payroll rows yet.</div>';
    h += '<div class="g2"><div class="cd td46"><h3><span>Today · ' + today.length + ' class' + (today.length === 1 ? '' : 'es') + '</span><span>' + WD[now.getDay()] + ' ' + now.getDate() + ' ' + MN[now.getMonth()] + '</span></h3>' + tdy + '</div>' +
      '<div class="cd pc"><h3><span>Units &amp; pay · last ' + P6.length + ' months</span><span>green = paid</span></h3>' + chart + '</div></div>';
    /* time-ins */
    const bad = t => { const m = String(t.speed || '').match(/(\d+(?:\.\d+)?)\s*ms\s*·\s*jitter\s*(\d+(?:\.\d+)?)/); return m && (+m[1] > 300 || +m[2] > 100); };
    h += '<div class="sh"><span>Time-ins · last ' + Math.min(12, T.length) + '</span><span><b>' + onT + '</b> of ' + T.length + ' on time</span></div>';
    h += T.length ? '<div class="cd ti"><div class="tbar">' + T.slice(0, 12).reverse().map(t => '<i title="' + esc(String(t.date).slice(5) + ' ' + t.time + ' · ' + t.status) + '" style="background:' + (t.status === 'On time' ? '#2E9E6F' : /Late/.test(t.status) ? '#D4705A' : '#C9C6D6') + '"></i>').join('') + '</div>' +
      T.slice(0, 12).map(t => '<div class="r"><div class="l"><b>' + esc(String(t.date).slice(5)) + ' ' + esc(t.time) + '</b><span class="w">' + (t.type === 'Class' ? 'Class ' + esc(t.cls) : 'Day time-in') + '</span>' + (bad(t) ? '<span class="un">unstable network</span>' : '<span></span>') + '<span class="chip ' + (t.status === 'On time' ? 'green' : /Late/.test(t.status) ? 'red' : '') + '">' + esc(t.status) + '</span></div>' +
        (t.device || t.net || t.note || (typeof placeHtml === 'function' && placeHtml(t)) ? '<details><summary>details · device, speed, location</summary>' + (t.device || t.net ? '<div class="small mute">' + esc([t.device, t.ip, t.net, t.speed].filter(Boolean).join(' · ')) + '</div>' : '') + (typeof placeHtml === 'function' ? placeHtml(t) : '') + (t.note ? '<div class="small">' + esc(t.note) + '</div>' : '') + '</details>' : '') + '</div>').join('') + '</div>' : '<div class="mute small">No time-ins yet.</div>';
    /* students */
    S.sort((a, b) => (b.feedbackDue ? 1 : 0) - (a.feedbackDue ? 1 : 0) || (a.left == null ? 999 : a.left) - (b.left == null ? 999 : b.left));
    h += '<div class="sh"><span>Students · ' + S.length + '</span><span>' + (fb ? '<b style="color:#C0563F">' + fb + '</b> feedback due · ' : '') + 'fewest lessons left first</span></div><div class="st">' +
      S.map(s => { const lf = s.left, lc = lf == null ? '#C9C6D6' : lf <= 5 ? '#D4705A' : lf <= 10 ? '#E0A030' : '#2E9E6F';
        return '<div class="s' + (s.feedbackDue ? ' fb' : '') + '" onclick="closeSheet();openStudent(\'' + q(s.code) + '\')"><div style="min-width:0"><div class="n"><b>' + esc(s.name) + '</b> <span>' + esc(s.code) + (s.book ? ' · ' + esc(s.book) : '') + '</span></div><div class="e">' + (s.note ? 'ended ' + esc(s.note.ended) : '&nbsp;') + '</div></div>' +
          '<div class="lf" style="color:' + (lf != null && lf <= 5 ? '#C0563F' : 'var(--ink)') + '">' + (lf == null ? '<small>shared</small>' : lf + '<small>left</small>') + (s.feedbackDue ? '<small style="color:#C0563F;font-weight:700">feedback</small>' : '') + '</div>' +
          (lf != null ? '<div class="bar"><i style="width:' + Math.min(100, lf / 30 * 100) + '%;background:' + lc + '"></i></div>' : '') + '</div>'; }).join('') + '</div>';
    /* notes */
    if((p.notes || []).length){ h += '<div class="sh"><span>Recent class notes</span><span>last ' + Math.min(10, p.notes.length) + '</span></div><div class="cd nt">' + p.notes.slice(0, 10).map(n => { const d = new Date(String(n.date).slice(0, 10) + 'T12:00:00'), ok = !isNaN(d);
        return '<div class="n"><div class="d">' + (ok ? '<span>' + WD[d.getDay()] + '</span><b>' + d.getDate() + '</b><span>' + MN[d.getMonth()] + '</span>' : '<span>' + esc(n.date) + '</span>') + '</div><div class="t"><b>' + esc(n.student || n.code) + '</b>' + (n.ended ? '<span class="ch">ended ' + esc(n.ended) + '</span>' : '') + (n.next ? '<p>' + esc(n.next) + '</p>' : '') + '</div></div>'; }).join('') + '</div>'; }
    if(pay.length) h += '<div class="sh"><span>Pay history</span><span>net</span></div><div class="cd"><table class="py">' + pay.slice(0, 6).map(x => '<tr><td>' + esc(x.month) + '</td><td class="num">' + x.units + ' u</td><td class="num"><b>' + peso(x.net) + '</b></td><td style="text-align:right">' + paidChip(x) + '</td></tr>').join('') + '</table></div>';
    setTimeout(() => { try{ $('sheet').classList.add('wide'); }catch(e){} }, 0);
    return h + '</div>';
  }catch(e){ console.warn('t46', e); return _old.apply(this, arguments); } };
})();
