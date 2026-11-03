// 1720: (Misty, 3 Nov 14:26–14:28) "how do we integrate like management can remove or add or what's real class or not ... directly on the app ...
//   when we remove or add, it is synced to all ... like Max (listed twice), we can delete or correct it, and once corrected it reflects to all,
//   even to the lesson count of students"
//   Lessons counted (management) › "Fix" on each student line and on each trial / sub class:
//   · Student line → that student's classes with this teacher in the month (from the database class table, same as the Schedule):
//       counted → "Don't count" with a reason (cancels the class in Google Calendar, the existing cancel); cancelled → "Count it" (restore);
//       "+ Add a missed class" (date, time, length; the existing Add class).
//   · Trial / sub → "Remove duplicate" (same calendar event listed twice in TC&SUB) or "Not a real class" (cancels the calendar event and
//       removes the TC&SUB row; written to the APP-EDITS tab).
//   · Every change: the class table (student lessons left) changes at once; Google Calendar follows; then the day is recounted in the
//       DAILY tab + S-MONTHLY (Google SYNC-REQ, Excel Daily's 10-minute run) and copied back, so pay, Lessons counted and the parent/partner
//       pages follow within about 10–15 minutes.
//   · Open months only: this month, and last month until the 10th (payday). Paid months are read-only.
const file = process.argv[2];
const JS = String.raw`<script>
/* 1720 · Lessons counted › Fix: cancel / restore / add a class, remove a duplicate trial — from the app */
(function(){
  if(window.__1720) return; window.__1720 = 1;
  const R = window.__u17r = window.__u17r || [];
  window.R17 = o => { R.push(o); return R.length - 1; };
  const H = x => (typeof esc === 'function' ? esc(x) : String(x == null ? '' : x));
  const MN = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const dd = d => { const t = new Date(String(d).slice(0, 10) + 'T12:00:00'); return isNaN(t) ? d : t.getDate() + ' ' + MN[t.getMonth()].slice(0, 3); };
  const ymdM = iso => new Date(Date.parse(iso) + 8 * 3600e3).toISOString().slice(0, 10), hmM = iso => new Date(Date.parse(iso) + 8 * 3600e3).toISOString().slice(11, 16);
  const openFrom = () => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth() - (d.getDate() <= 10 ? 1 : 0), 1); };
  const ymdL = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  const isOpen = ymd => ymd >= ymdL(openFrom()) && ymd <= ymdL(new Date());
  const REASONS = ['CupOfEnglish · parent told us in time (not counted)', 'CupOfEnglish · cancelled by management', 'Teacher absent / internet / power (not counted)', 'CupOfEnglish · entered by mistake (not a real class)'];
  const lc = x => String(x || '').trim().toLowerCase();
  async function classes(code){ const r = await fetch(FAST_URL + '-mgmt', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'stuClasses', code: code, token: TOKEN }) }).then(x => x.json());
    if(!r || !r.ok || !Array.isArray(r.data)) throw new Error((r && r.error) || 'Could not load the classes'); return r.data; }
  async function resync(dates){ try{ const r = await api('mgmtResyncDay', TOKEN, dates); return r && r.ok ? r.note : (r && r.msg) || ''; }catch(e){ return ''; } }
  let CUR = null;
  async function paintStu(o){ CUR = o; openSheet('<h1>Fix · ' + H(o.name || o.code) + '</h1><div class="sk"></div><div class="sk"></div>');
    let L = []; try{ L = await classes(o.code); }catch(e){ $('sheetBody').innerHTML = '<h1>Fix</h1><div class="empty">' + H(e.message) + '</div>'; return; }
    const now = Date.now(), M = L.filter(c => ymdM(c.start).slice(0, 7) === o.ym && Date.parse(c.start) < now && lc(c.teacher).split(/[,/&]| and /).map(s => s.trim()).indexOf(lc(o.teacher)) > -1 && !/\b(TC|SC)\s*$/i.test(String(c.title || '').replace(/\s+X\s*$/i, '')))
      .sort((a, b) => a.start.localeCompare(b.start));
    const open = o.ym >= ymdL(openFrom()).slice(0, 7);
    let h = '<h1 style="padding-right:48px">Fix · ' + H(o.name || o.code) + '</h1><p class="small mute" style="margin:2px 0 8px">' + H(o.code) + ' · Teacher ' + H(o.teacher) + ' · ' + H(MN[+o.ym.slice(5, 7) - 1] + ' ' + o.ym.slice(0, 4)) +
      (open ? ' · changes go to Google Calendar, then the day is recounted for pay and lessons left.' : ' · <b>paid month · read-only</b>') + '</p>';
    h += M.length ? M.map((c, i) => { const day = ymdM(c.start), mins = Math.round((Date.parse(c.end) - Date.parse(c.start)) / 6e4) || 25, can = open && isOpen(day);
      return '<div style="padding:8px 0;border-top:1px solid var(--line)"><div class="row" style="justify-content:space-between;gap:8px;align-items:center"><div><b>' + H(dd(day)) + ' · ' + H(hmM(c.start)) + '</b> <span class="mute small">' + mins + ' min' + (c.book ? ' · ' + H(c.book) : '') + '</span>' +
        (c.cancelled ? ' <span class="chip" style="background:#FDECEA;color:#B3261E">not counted' + (c.why ? ' · ' + H(String(c.why).split(' · ')[0]) : '') + '</span>' : ' <span class="chip" style="background:#E6F4EA;color:#1E7B34">counted</span>') + '</div>' +
        (can ? (c.cancelled ? '<button class="btn sm teal" onclick="u20Do(' + i + ',\'restore\')">Count it</button>' : '<button class="btn sm ghost" onclick="u20Ask(' + i + ')">Don\'t count…</button>') : '') + '</div><div id="u20a' + i + '"></div></div>'; }).join('')
      : '<div class="empty">No classes with ' + H(o.teacher) + ' in this month in the class table.</div>';
    if(open){ const from = ymdL(openFrom()) > o.ym + '-01' ? ymdL(openFrom()) : o.ym + '-01', last = new Date(+o.ym.slice(0, 4), +o.ym.slice(5, 7), 0), to = ymdL(last) < ymdL(new Date()) ? ymdL(last) : ymdL(new Date());
      h += '<h3 style="margin:16px 0 6px">+ Add a missed class</h3><div class="row" style="gap:8px;flex-wrap:wrap"><div class="grow"><label>Date</label><input type="date" id="u20d" class="in-t" min="' + from + '" max="' + to + '" value="' + to + '"></div>' +
        '<div class="grow"><label>Time</label>' + (typeof timeSel === 'function' ? timeSel('u20t', '19:00') : '<input id="u20t" class="in-t" value="19:00">') + '</div><div class="grow"><label>Length</label><select id="u20m" class="in-t"><option value="25">25 min (0.5)</option><option value="50">50 min (1)</option><option value="80">80 min (1.5)</option><option value="110">110 min (2)</option></select></div></div>' +
        '<label>Why (kept with the change)</label><input id="u20w" class="in-t" placeholder="e.g. taught but not in the calendar"><button class="btn block" id="u20go" style="margin-top:10px" onclick="u20Add()">Add class</button>'; }
    h += '<p class="small mute" style="margin-top:12px">Student lessons left change at once. Pay and Lessons counted follow after the recount (about 10–15 minutes).</p>';
    window._u20L = M; openSheet(h); }
  window.u20Ask = function(i){ const el = $('u20a' + i); if(!el) return; el.innerHTML = '<div class="row" style="gap:8px;margin-top:6px;flex-wrap:wrap"><select id="u20r' + i + '" class="in-t grow">' + REASONS.map(r => '<option>' + H(r) + '</option>').join('') + '</select><button class="btn sm" onclick="u20Do(' + i + ',\'cancel\')">Confirm · don\'t count</button></div>'; };
  window.u20Do = async function(i, action){ const c = (window._u20L || [])[i], o = CUR; if(!c || !o) return; const day = ymdM(c.start); if(!isOpen(day)) return toast('That month is closed (paid)');
    const reason = action === 'cancel' ? (($('u20r' + i) || {}).value || REASONS[0]) : '';
    const f = { action, start: c.start, date: day, time: hmM(c.start), mins: String(Math.round((Date.parse(c.end) - Date.parse(c.start)) / 6e4) || 25), teacher: c.teacher || o.teacher, reason, makeup: false, forward: false };
    toast(action === 'cancel' ? 'Saving · not counted…' : 'Saving · counted…');
    try{ const r = await api('editClass', TOKEN, c.id, f); if(!r || !r.ok) throw r; const n = await resync([day]); toast('✓ ' + (action === 'cancel' ? 'Not counted' : 'Counted') + ' · ' + dd(day) + (n ? ' · ' + n : '')); }
    catch(e){ toast((e && (e.msg || e.message)) || 'Not saved. Try again.'); }
    paintStu(o); };
  window.u20Add = async function(){ const o = CUR; if(!o) return; const d = ($('u20d') || {}).value, t = ($('u20t') || {}).value, m = ($('u20m') || {}).value, w = (($('u20w') || {}).value || '').trim();
    if(!d || !isOpen(d)) return toast('Choose a date in an open month'); if(!/^\d\d:\d\d$/.test(t || '')) return toast('Choose a time'); if(!w) return toast('Write why the class is added');
    const b = $('u20go'); if(b){ b.disabled = true; b.textContent = 'Adding…'; }
    const f = { code: o.code, student: o.name || o.code, kind: '', fresh: false, cn: '', book: String(o.book || '').split(',').pop().trim(), teacher: o.teacher, date: d, time: t, mins: m, days: [], count: 1, force: true, note: 'Added from Lessons counted · ' + w };
    try{ const r = await api('addClass', TOKEN, f); if(!r || !r.ok) throw r; const n = await resync([d]); toast('✓ Class added · ' + dd(d) + ' ' + t + (n ? ' · ' + n : '')); paintStu(o); }
    catch(e){ toast((e && (e.msg || e.message)) || 'Not added. Try again.'); if(b){ b.disabled = false; b.textContent = 'Add class'; } } };
  async function paintTc(o){ const x = o.x, day = String(x.d || '').slice(0, 10), open = isOpen(day);
    let h = '<h1 style="padding-right:48px">Fix · ' + H(o.kind === 'sub' ? 'sub' : 'trial') + ' class</h1><p class="small mute" style="margin:2px 0 10px"><b>' + H(x.name || x.code) + '</b> ' + H(x.code) + ' · ' + H(dd(day)) + ' ' + H(x.t || '') + ' · Teacher ' + H(o.teacher) + (x.for ? ' · for ' + H(x.for) : '') + '</p>';
    if(!open) h += '<div class="empty">Paid month · read-only.</div>';
    else { if(o.twice) h += '<button class="btn block teal" onclick="u20Tc(\'dup\')">Remove duplicate (keep one)</button><p class="small mute" style="margin:4px 0 12px">The same calendar class was listed twice in TC&amp;SUB. One row stays.</p>';
      h += '<label>Not a real class? Why</label><input id="u20tw" class="in-t" placeholder="e.g. trial did not happen / entered by mistake"><button class="btn block" style="margin-top:8px" onclick="u20Tc(\'remove\')">Not a real class · cancel it and remove</button><p class="small mute" style="margin-top:4px">Cancels the class in Google Calendar and removes it from TC&amp;SUB. Written to APP-EDITS.</p>'; }
    CUR = o; openSheet(h); }
  window.u20Tc = async function(mode){ const o = CUR; if(!o || !o.x) return; const x = o.x, day = String(x.d || '').slice(0, 10), why = (($('u20tw') || {}).value || '').trim();
    if(mode === 'remove' && !why) return toast('Write why it is not a real class');
    toast('Saving…');
    try{
      if(mode === 'remove'){ try{ const L = await classes(x.code), c = L.find(c => ymdM(c.start) === day && hmM(c.start) === String(x.t || '').slice(0, 5) && !c.cancelled);
          if(c){ const r = await api('editClass', TOKEN, c.id, { action: 'cancel', start: c.start, date: day, time: hmM(c.start), mins: String(Math.round((Date.parse(c.end) - Date.parse(c.start)) / 6e4) || 25), teacher: c.teacher || o.teacher, reason: 'CupOfEnglish · ' + why, makeup: false, forward: false }); if(!r || !r.ok) throw r; } }catch(e){ throw e; } }
      const r = await api('mgmtTcSubFix', TOKEN, { eid: x.eid, date: day, mode, reason: why }); if(!r || !r.ok) throw r;
      toast('✓ ' + (r.note || 'Done') + ' · pay and Lessons counted update in a few minutes'); closeSheet(); }
    catch(e){ toast((e && (e.msg || e.message)) || 'Not saved. Try again.'); } };
  window.unitsFix = function(i){ const o = R[i]; if(!o) return; if(o.kind === 'stu') paintStu(o); else paintTc(o); };
})();
</script>
`;
require('../tools/lib.js')(file, [
  ["'</h3>' + S.map(s => '<div style=\"padding:8px 0;border-top:1px solid var(--line)\"><div class=\"row\" style=\"justify-content:space-between;gap:8px\"><div><b>' + H(s.name || s.code) + '</b> <span class=\"mute small\">' + H(s.code) + (s.book ? ' · ' + H(s.book) : '') + '</span></div><b>' + n1(s.units) + '</b></div>'",
   "'</h3>' + S.map(s => '<div style=\"padding:8px 0;border-top:1px solid var(--line)\"><div class=\"row\" style=\"justify-content:space-between;gap:8px;align-items:center\"><div><b>' + H(s.name || s.code) + '</b> <span class=\"mute small\">' + H(s.code) + (s.book ? ' · ' + H(s.book) : '') + '</span></div><div class=\"row\" style=\"gap:8px;align-items:center\"><b>' + n1(s.units) + '</b>' + (window.R17 ? '<button class=\"btn sm ghost\" onclick=\"unitsFix(' + R17({ kind: 'stu', teacher: name, ym, code: s.code, name: s.name, book: s.book }) + ')\">Fix</button>' : '') + '</div></div>'"],
  ["listed twice</span>' : '') + '</div><b>' + n1(x.u) + '</b></div>'; }).join('')",
   "listed twice</span>' : '') + '</div><div class=\"row\" style=\"gap:8px;align-items:center\"><b>' + n1(x.u) + '</b>' + (window.R17 && x.eid ? '<button class=\"btn sm ghost\" onclick=\"unitsFix(' + R17({ kind: /^sub/i.test(title) ? 'sub' : 'trial', teacher: name, ym, x, twice: tw }) + ')\">Fix</button>' : '') + '</div></div>'; }).join('')"],
  ["<script>\n/* 1717 · Lessons counted: the students behind", JS + "<script>\n/* 1717 · Lessons counted: the students behind"]
]);
