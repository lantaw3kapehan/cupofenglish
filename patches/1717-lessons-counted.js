// 1717: (Misty, 3 Nov 13:29) "for teacher's monthly lesson count, can we also have a summary history to know those students that were counted?
//   ... in this payslip of April ... I want to know who are these students that accumulated here because when we check excel it's different"
//   · New "Lessons counted" sheet (Teacher page and Payslip): for one teacher and one month, every student whose lessons were counted, with
//     the dates and units — the same <MONTH>-DAILY rows the payslip's Regular Lessons come from — plus the trial and sub classes (TC&SUB).
//   · At the top, each total is compared with PAYROLL (what the payslip uses): ✓ when equal, otherwise the difference to check.
//     Trials listed twice for the same student and time are marked "listed twice".
//   · "By month": the teacher's students × months (units per month), like the STUDENTS tab, from the same rows.
//   Data: database docs mgmt:tunits (index) + mgmt:tunits:YYYY-MM (detail), rebuilt every 15 min by pg_cron job coe-tunits (coe_tunits_split()).
const file = process.argv[2];
const JS = String.raw`<script>
/* 1717 · Lessons counted: the students behind a teacher's monthly units (payslip tally) */
(function(){
  if(window.__1717) return; window.__1717 = 1;
  const MN = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const lab = ym => { const m = String(ym || '').match(/^(\d{4})-(\d{2})$/); return m ? MN[+m[2] - 1] + ' ' + m[1] : ym; };
  const sh = ym => { const m = String(ym || '').match(/^(\d{4})-(\d{2})$/); return m ? MN[+m[2] - 1].slice(0, 3) + (m[1] !== String(new Date().getFullYear()) ? ' ' + m[1].slice(2) : '') : ym; };
  const n1 = x => { const v = Math.round((+x || 0) * 10) / 10; return String(v); };
  const dd = d => { const t = new Date(d + 'T12:00:00'); return isNaN(t) ? d : t.getDate() + ' ' + MN[t.getMonth()].slice(0, 3); };
  const H = x => (typeof esc === 'function' ? esc(x) : String(x == null ? '' : x).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])));
  let IDX = null, DET = {};
  async function get(keys){ const r = await fetch(FAST_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'docs', token: TOKEN, keys }) }).then(x => x.json());
    if(!r || !r.ok) throw new Error((r && r.error) || 'Could not load'); return r.docs || {}; }
  const ymOf = v => { const s = String(v || ''); let m = s.match(/(\d{4})-(\d{2})/); if(m) return m[1] + '-' + m[2];
    m = s.match(/([A-Za-z]+)\D+(\d{4})/); if(m){ const i = MN.findIndex(x => x.toLowerCase().startsWith(m[1].toLowerCase().slice(0, 3))); if(i > -1) return m[2] + '-' + String(i + 1).padStart(2, '0'); } return ''; };
  const chk = (list, pay) => pay == null || pay === '' ? '<span class="chip">payslip: —</span>' : Math.abs((+list || 0) - (+pay || 0)) < 0.01 ? '<span class="chip" style="background:#E6F4EA;color:#1E7B34">✓ payslip ' + n1(pay) + '</span>'
    : '<span class="chip" style="background:#FDECEA;color:#B3261E">payslip ' + n1(pay) + ' · differs by ' + n1((+list || 0) - (+pay || 0)) + '</span>';
  function draw(name, ym, view){
    const k = String(name || '').trim().toLowerCase(), months = (IDX && IDX.months) || [], D = DET[ym], T = D && D.teachers && D.teachers[k];
    const chips = months.slice().reverse().map(m => '<button class="btn sm ' + (m === ym && view !== 'grid' ? 'teal' : 'ghost') + '" onclick="unitsSheet(\'' + H(name).replace(/'/g, "\\'") + '\',\'' + m + '\')">' + H(sh(m)) + '</button>').join('');
    let h = '<h1 style="padding-right:48px">Lessons counted · ' + H(name) + '</h1><p class="small mute" style="margin:2px 0 8px">The students behind the payslip units. Regular lessons come from the month\'s DAILY tab, trials and subs from TC&amp;SUB; each total is checked against PAYROLL.</p>' +
      '<div class="row" style="gap:6px;flex-wrap:wrap;margin-bottom:10px">' + chips + '<button class="btn sm ' + (view === 'grid' ? 'teal' : 'ghost') + '" onclick="unitsSheet(\'' + H(name).replace(/'/g, "\\'") + '\',\'' + ym + '\',\'grid\')">By month</button></div>';
    if(view === 'grid'){ const rows = {}, cols = months.filter(m => IDX.by[m] && IDX.by[m][k]);
      cols.forEach(m => { const u = (IDX.by[m][k].u) || {}; Object.keys(u).forEach(c => { const r = rows[c] = rows[c] || { name: u[c][0], v: {} }; r.v[m] = +u[c][1] || 0; if(u[c][0]) r.name = u[c][0]; }); });
      const R = Object.keys(rows).map(c => ({ code: c, name: rows[c].name, v: rows[c].v, t: Object.values(rows[c].v).reduce((a, b) => a + b, 0) })).sort((a, b) => String(a.name).localeCompare(String(b.name)));
      if(!R.length) return h + '<div class="empty">No counted lessons for ' + H(name) + ' in the DAILY tabs.</div>';
      h += '<div style="overflow-x:auto;-webkit-overflow-scrolling:touch"><table class="tbl" style="width:100%;border-collapse:collapse;font-size:13px"><thead><tr><th style="text-align:left;position:sticky;left:0;background:var(--card,#fff)">Student</th>' + cols.map(m => '<th style="text-align:right;padding:4px 6px">' + H(sh(m)) + '</th>').join('') + '<th style="text-align:right;padding:4px 6px">Total</th></tr></thead><tbody>' +
        R.map(r => '<tr style="border-top:1px solid var(--line)"><td style="position:sticky;left:0;background:var(--card,#fff);padding:4px 6px 4px 0;white-space:nowrap"><b>' + H(r.name || r.code) + '</b> <span class="mute small">' + H(r.code) + '</span></td>' + cols.map(m => '<td style="text-align:right;padding:4px 6px">' + (r.v[m] ? n1(r.v[m]) : '<span class="mute">0</span>') + '</td>').join('') + '<td style="text-align:right;padding:4px 6px"><b>' + n1(r.t) + '</b></td></tr>').join('') +
        '<tr style="border-top:2px solid var(--line)"><td style="position:sticky;left:0;background:var(--card,#fff)"><b>Regular units</b></td>' + cols.map(m => '<td style="text-align:right;padding:4px 6px"><b>' + n1(IDX.by[m][k].reg) + '</b></td>').join('') + '<td></td></tr>' +
        '<tr><td style="position:sticky;left:0;background:var(--card,#fff)" class="small mute">Payslip (PAYROLL)</td>' + cols.map(m => { const p = IDX.by[m][k].payroll; const ok = p && p.reg != null && Math.abs((+p.reg || 0) - (+IDX.by[m][k].reg || 0)) < 0.01;
          return '<td style="text-align:right;padding:4px 6px;' + (p && p.reg != null && !ok ? 'color:#B3261E;font-weight:600' : 'color:var(--mute)') + '">' + (p && p.reg != null ? n1(p.reg) : '—') + '</td>'; }).join('') + '<td></td></tr></tbody></table></div>' +
        '<p class="small mute" style="margin-top:8px">Red = the payslip\'s Regular Lessons differ from the DAILY tab for that month; open the month to see the students.</p>';
      return h; }
    if(!T) return h + '<div class="empty">No counted lessons for ' + H(name) + ' in ' + H(lab(ym)) + '.</div>';
    const P = T.payroll || {}, S = T.students || [], seen = {};
    const twice = x => { const key = (x.code || x.name) + '|' + x.d + '|' + x.t; if(seen[key]) return true; seen[key] = 1; return false; };
    h += '<div class="stats" style="margin:4px 0 10px"><div class="stat"><b class="num">' + n1(T.reg) + '</b><span>regular · ' + S.length + ' students</span></div><div class="stat"><b class="num">' + n1(T.trial) + '</b><span>trial units · ' + (T.trials || []).length + ' classes</span></div><div class="stat"><b class="num">' + n1(T.sub) + '</b><span>sub units · ' + (T.subs || []).length + ' classes</span></div></div>' +
      '<div class="row" style="gap:6px;flex-wrap:wrap;margin-bottom:10px"><span class="small">Regular</span>' + chk(T.reg, P.reg) + '<span class="small">Trial</span>' + chk(T.trial, P.trial) + '<span class="small">Sub</span>' + chk(T.sub, P.sub) + (P.status ? '<span class="chip">' + H(P.status) + '</span>' : '') + '</div>';
    h += '<h3 style="margin:12px 0 6px">Regular lessons · ' + H(lab(ym)) + '</h3>' + S.map(s => '<div style="padding:8px 0;border-top:1px solid var(--line)"><div class="row" style="justify-content:space-between;gap:8px"><div><b>' + H(s.name || s.code) + '</b> <span class="mute small">' + H(s.code) + (s.book ? ' · ' + H(s.book) : '') + '</span></div><b>' + n1(s.units) + '</b></div>' +
      '<div class="small mute" style="margin-top:3px;line-height:1.7">' + (s.days || []).map(x => '<span class="chip" style="margin:0 4px 2px 0">' + H(dd(x.d)) + (Math.abs((+x.u) - 1) > 0.01 ? ' · ' + n1(x.u) : '') + '</span>').join('') + '</div></div>').join('') +
      '<div class="row" style="justify-content:space-between;padding:8px 0;border-top:2px solid var(--line)"><b>Total regular</b><b>' + n1(T.reg) + '</b></div>';
    const lst = (L, title, tot) => !L.length ? '' : '<h3 style="margin:14px 0 6px">' + title + '</h3>' + L.map(x => { const tw = twice(x);
      return '<div class="row" style="justify-content:space-between;gap:8px;padding:6px 0;border-top:1px solid var(--line)"><div><b>' + H(x.name || x.code) + '</b> <span class="mute small">' + H(x.code) + ' · ' + H(dd(x.d)) + ' ' + H(x.t || '') + (x.for ? ' · for ' + H(x.for) : '') + (x.status ? ' · ' + H(x.status) : '') + '</span>' + (tw ? ' <span class="chip" style="background:#FFF4E5;color:#9A5B00">listed twice</span>' : '') + '</div><b>' + n1(x.u) + '</b></div>'; }).join('') +
      '<div class="row" style="justify-content:space-between;padding:8px 0;border-top:2px solid var(--line)"><b>Total</b><b>' + n1(tot) + '</b></div>';
    h += lst(T.trials || [], 'Trial classes', T.trial) + lst(T.subs || [], 'Sub classes', T.sub);
    const sy = IDX && IDX.synced && IDX.synced[ym]; h += '<p class="small mute" style="margin-top:10px">Copied from Google ' + (sy ? new Date(sy).toLocaleString('en-PH', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : '—') + ' · refreshed every 15 min.</p>';
    return h; }
  window.unitsSheet = async function(name, ym, view){
    name = String(name || '').trim(); if(!name) return;
    if(!ym) ym = (function(){ const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'); })();
    const paint = () => { try{ if(typeof openSheet === 'function') openSheet(draw(name, ym, view)); }catch(e){} };
    if(IDX && (view === 'grid' || DET[ym])) return paint();
    openSheet('<h1>Lessons counted · ' + H(name) + '</h1><div class="sk"></div><div class="sk"></div>');
    try{ const keys = []; if(!IDX) keys.push('mgmt:tunits'); if(view !== 'grid' && !DET[ym]) keys.push('mgmt:tunits:' + ym);
      const d = await get(keys); if(d['mgmt:tunits']) IDX = d['mgmt:tunits'].data; if(d['mgmt:tunits:' + ym]) DET[ym] = d['mgmt:tunits:' + ym].data;
      if(view !== 'grid' && !DET[ym]) DET[ym] = { teachers: {} }; paint();
    }catch(e){ try{ $('sheetBody').innerHTML = '<h1>Lessons counted</h1><div class="empty">Could not load (' + H(e.message) + '). Try again.</div>'; }catch(x){} } };
  window.unitsFromPayslip = function(){ try{ const n = $('psN'), p = $('psP'); const nm = n ? String(n.options[n.selectedIndex].textContent || '').split(' · ')[0].trim() : ''; unitsSheet(nm, ymOf(p ? p.value.split(SL2).join(' ') : '')); }catch(e){} };
})();
</script>
`;
require('../tools/lib.js')(file, [
  ["onclick=\"payslip('${esc(name)}')\">Payslip</button><button class=\"btn sm teal\" onclick=\"growthSheet",
   "onclick=\"payslip('${esc(name)}')\">Payslip</button><button class=\"btn ghost sm\" onclick=\"unitsSheet('${esc(name)}')\">Lessons counted</button><button class=\"btn sm teal\" onclick=\"growthSheet"],
  ["onclick=\"tabSheet('PAYSLIP','Payslip',$('psN').value,$('psP').value)\">Show payslip</button>`);",
   "onclick=\"tabSheet('PAYSLIP','Payslip',$('psN').value,$('psP').value)\">Show payslip</button><button class=\"btn ghost block\" style=\"margin-top:8px\" onclick=\"unitsFromPayslip()\">Lessons counted · which students →</button>`);"],
  ["<script>\n/* 1250 · feedback helper (tFbPlus) from the database */", JS + "<script>\n/* 1250 · feedback helper (tFbPlus) from the database */"]
]);
