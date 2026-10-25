// 960 (R1 · Students): saving "Edit student" can no longer blank a birthdate it could not show.
// Found (audit agent B, confirmed by R1):
// · DATABASE › BIRTHDATE holds real dates, but some cells are formatted to show month and year only ("April//2018",
//   5 rows on 25 Oct) or "7-April-2008". The Students › Database list (DB.rows) carries the text as the sheet shows it.
// · stuForm fills the form from that list first (dbLocal), and dbLocal only reads "2015-03-12" / "12-Mar-2015", so the
//   date box (<input type=date>) came up EMPTY for those students. The fresh record (dbRecord) arrives later and
//   dbPatch fills the box with the stored date ("2018-04-01").
// · Save was clickable straight away. sendStu sends birth: <the date box> → a Save before the fresh record arrived
//   sent birth: "" and Google wrote "" over the stored birthdate (fast path: coe op "write" → writes table → Apps Script
//   SB_REPLAY → saveStudent; direct path: Apps Script saveStudent). An empty date box also meant "remove", with no warning.
// Now (Edit student only, i.e. a save into an existing DATABASE row; New student / New row are unchanged):
// · Save stays disabled — "Loading the latest record…" — until the fresh record for THAT row and code has arrived and
//   the form has been filled from it. If it cannot be loaded the button says so and tapping it loads it again.
// · The form keeps the stored value (hidden #sBirthO, exactly as the record gave it). Untouched birthdate → the save
//   sends that stored value again plus birthKeep: 1 (the server keeps what is in the cell — see
//   audit/SERVER-BIRTHDATE-paste.md and audit/server-birthdate.diff). An edited full date is sent as the new value.
// · A birthdate the date box cannot show truthfully (shown by the sheet as month + year or year only, or stored as text
//   or a number) is shown read-only: "April 2018 (month and year only)", with "Change birthdate" (a real date box,
//   empty — no day or month is made up) and "Remove birthdate".
// · Removing needs the explicit "Remove birthdate" action (birth: "", birthClear: 1). An emptied date box keeps the
//   stored birthdate.
// · A form that is no longer the open one (closed, other student, other screen) cannot send: sendStu checks the
//   ready stamp (#sBirthR = "row|code") of the open form.
const lib = require('../tools/lib.js'), fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 960 · Edit student: Save waits for the fresh record; the birthdate is never sent blank by accident */
(function(){
  if(window.__960 || typeof window.stuForm !== 'function' || typeof window.sendStu !== 'function' || typeof window.api !== 'function') return; window.__960 = 1;
  const bd = () => document.getElementById('sheetBody'), sh = () => document.getElementById('sheet');
  const on = () => { const x = sh(); return !!(x && x.classList.contains('on')); };
  const q = (b, id) => b ? b.querySelector('#' + id) : null;
  const ISO = /^\d{4}-\d{2}-\d{2}$/;
  const say = m => { try{ (window.toast || window.tst)(m); }catch(e){} };
  const ex = x => String(x == null ? '' : x).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const MON = ['January','February','March','April','May','June','July','August','September','October','November','December'], M3 = MON.map(m => m.slice(0, 3));
  const parse = v => { try{ return typeof window.coeParseBirth === 'function' ? window.coeParseBirth(v) : null; }catch(e){ return null; } };
  /* the open Edit form for row|code, or null */
  function formFor(row, code){ const b = bd(); if(!on() || !b || b.hidden) return null; const go = q(b, 'sGo'), el = q(b, 'sBirth'); if(!go || !el) return null;
    const m = String(go.getAttribute('onclick') || '').match(/sendStu\((\d+),'([^']*)'\)/); if(!m || +m[1] !== row || m[2] !== String(code)) return null; return b; }
  const keyOf = (row, code) => row + '|' + code;

  /* every dbRecord request: keep its promise, so the form knows when ITS fresh record has arrived */
  const REC = {};
  let PB = null;   /* the birthdate decision of the save that is being sent right now */
  const a0 = window.api;
  window.api = function(fn){
    if(fn === 'saveStudent'){ try{ const f = arguments[2], row = Number(arguments[3]) || 0;
        if(f && typeof f === 'object' && row > 0){ const P = PB;
          if(P && P.row === row && String(f.code || '') === P.code){ f.birth = P.birth; delete f.birthKeep; delete f.birthClear; if(P.keep) f.birthKeep = 1; if(P.clear) f.birthClear = 1; }
          else if(!ISO.test(String(f.birth == null ? '' : f.birth).trim()) && !f.birthClear){ f.birth = ''; f.birthKeep = 1; } } }catch(e){ console.warn('960 save', e); } }   /* no decision (should not happen): never a blank or odd value, the server keeps the cell */
    const p = a0.apply(this, arguments);
    if(fn === 'dbRecord'){ try{ REC[keyOf(Number(arguments[2]) || 0, String(arguments[3] || ''))] = { p: Promise.resolve(p), t: Date.now() }; }catch(e){} }
    return p; };

  /* the save button while the record is loading */
  function wait(b){ const go = q(b, 'sGo'); if(!go) return; go.disabled = true; go.dataset.bd960w = '1'; delete go.dataset.bd960f; go.textContent = 'Loading the latest record…'; go.style.opacity = '.55'; go.setAttribute('aria-busy', 'true'); }
  function failed(b){ const go = q(b, 'sGo'); if(!go) return; go.disabled = false; delete go.dataset.bd960w; go.dataset.bd960f = '1'; go.removeAttribute('aria-busy'); go.style.opacity = '';
    go.textContent = 'Could not load the latest record · tap to try again'; }
  const sb0 = window.stuBtn;
  if(typeof sb0 === 'function') window.stuBtn = function(){ const r = sb0.apply(this, arguments); try{ const go = q(bd(), 'sGo'); if(go && go.dataset.bd960w) go.textContent = 'Loading the latest record…'; else if(go && go.dataset.bd960f) go.textContent = 'Could not load the latest record · tap to try again'; }catch(e){} return r; };

  if(!document.getElementById('bd960css')) document.head.insertAdjacentHTML('beforeend', '<style id="bd960css">.bd960-ro{padding:11px 12px;border-radius:12px;background:var(--tint,#EEF7F8);color:#2E2650;font-size:15px;line-height:1.35}.bd960-ro small{color:#6B6785;font-size:12.5px}.bd960-act{display:flex;flex-wrap:wrap;gap:6px 14px;margin-top:6px}.bd960-act button{background:none;border:0;padding:4px 0;font:inherit;font-size:13px;font-weight:600;color:#017f8a;cursor:pointer;text-decoration:underline;text-underline-offset:2px}.bd960-act button.rm{color:#B8553D}.bd960-note{font-size:12.5px;color:#6B6785;margin-top:4px}</style>');

  /* how the stored birthdate can be shown: { mode: 'input' | 'ro', label } */
  function judge(O, disp){
    O = String(O == null ? '' : O).trim(); disp = String(disp == null ? '' : disp).trim();
    if(!O) return { mode: 'input', label: '' };
    const lab = b => !b ? '' : b.d ? b.d + ' ' + M3[b.m - 1] + ' ' + b.y : b.m ? MON[b.m - 1] + ' ' + b.y + ' (month and year only)' : b.y + ' (year only)';
    const pd = disp ? parse(disp) : null;
    if(pd && pd.y && !pd.d) return { mode: 'ro', label: lab(pd) };                        /* the sheet shows month+year / year only */
    if(ISO.test(O)) return { mode: 'input', label: '' };
    const po = parse(O);
    if(po && po.y) return { mode: 'ro', label: po.d ? lab(po) + ' (as stored in DATABASE)' : lab(po) };
    return { mode: 'ro', label: '“' + O + '” (as written in DATABASE)' }; }

  function paint(b){
    const el = q(b, 'sBirth'), M = q(b, 'sBirthM'), O = q(b, 'sBirthO'), B = q(b, 'sBirthB'), L = q(b, 'sBirthL'); if(!el || !M || !O) return;
    const m = M.value, o = O.value, ro = q(b, 'sBirthRO'), x = q(b, 'sBirthX'), hint = q(b, 'sBirthH'), act = q(b, 'sBirthA');
    if(m === 'input' || m === 'edit'){ if(el.type !== 'date') el.type = 'date'; el.hidden = false; }
    else { if(el.type !== 'text') el.type = 'text'; el.hidden = true; }
    ro.hidden = m !== 'ro'; x.hidden = m !== 'clear'; hint.hidden = m !== 'edit';
    const btn = (a, t, c) => '<button type="button"' + (c ? ' class="' + c + '"' : '') + ' onclick="bd960Act(this,\'' + a + '\')">' + t + '</button>';
    act.innerHTML = m === 'ro' ? btn('change', 'Change birthdate') + btn('remove', 'Remove birthdate', 'rm')
      : m === 'edit' ? btn('keep', 'Keep ' + ex(String(L.value).replace(/ \(.*\)$/, '')) + ' as it is') + btn('remove', 'Remove birthdate', 'rm')
      : m === 'clear' ? btn('keep', 'Keep the birthdate')
      : o ? btn('remove', 'Remove birthdate', 'rm') : '';
    act.hidden = !act.innerHTML; }
  window.bd960Act = function(btn, a){ const b = btn && btn.closest('#sheetBody'); if(!b) return; const el = q(b, 'sBirth'), M = q(b, 'sBirthM'), O = q(b, 'sBirthO'), B = q(b, 'sBirthB'), L = q(b, 'sBirthL'); if(!el || !M) return;
    if(a === 'change'){ M.value = 'edit'; paint(b); el.value = ''; try{ el.focus(); }catch(e){} }
    else if(a === 'remove'){ M.value = 'clear'; paint(b); el.value = '(remove)'; }   /* a marker so "what changed" sees it; never sent (the save hook decides) */
    else if(a === 'keep'){ M.value = B.value; paint(b); el.value = B.value === 'ro' ? L.value : O.value; delete el.dataset.t; }
    try{ el.dispatchEvent(new Event('change', { bubbles: true })); }catch(e){} };

  /* the fresh record has arrived and dbPatch has filled the form: set up the birthdate and let Save through */
  function ready(row, code, v2){
    const b = formFor(row, code); if(!b) return;                       /* closed, or another student's form is open now */
    if(!v2 || !v2.ok) return;                                           /* dbPatch has closed the card with its message */
    if(String(v2.code || code) !== String(code) || (v2.row && Number(v2.row) !== row)) return;
    const el = q(b, 'sBirth'), go = q(b, 'sGo'); if(!el || !go) return;
    const O = String(v2.birth == null ? '' : v2.birth).trim();
    const lr = ((typeof DB !== 'undefined' && DB && DB.rows) || []).find(x => x[0] === code && x[x.length - 1] === row);
    const J = judge(O, lr ? lr[5] : '');
    if(!q(b, 'sBirthO')) el.insertAdjacentHTML('afterend', '<input type="hidden" id="sBirthO"><input type="hidden" id="sBirthM"><input type="hidden" id="sBirthB"><input type="hidden" id="sBirthL"><input type="hidden" id="sBirthR">'
      + '<div id="sBirthRO" class="bd960-ro" hidden></div><div id="sBirthX" class="bd960-ro" hidden>The birthdate will be removed when you save.</div>'
      + '<div id="sBirthH" class="bd960-note" hidden>Pick the full date of birth. Leave it empty to keep the birthdate as it is.</div><div id="sBirthA" class="bd960-act" hidden></div>');
    const touched = !!el.dataset.t && String(el.value || '').trim() !== '';
    q(b, 'sBirthO').value = O; q(b, 'sBirthB').value = J.mode; q(b, 'sBirthL').value = J.label;
    q(b, 'sBirthM').value = J.mode === 'ro' && touched ? 'edit' : J.mode;
    q(b, 'sBirthRO').innerHTML = ex(J.label).replace(/ (\(.*\))$/, ' <small>$1</small>');
    paint(b);
    if(q(b, 'sBirthM').value === 'ro') el.value = J.label;
    else if(!touched) el.value = ISO.test(O) ? O : '';
    q(b, 'sBirthR').value = keyOf(row, code);
    go.disabled = false; delete go.dataset.bd960w; delete go.dataset.bd960f; go.removeAttribute('aria-busy'); go.style.opacity = '';
    try{ window.stuBtn(1); }catch(e){}
    try{ el.dispatchEvent(new Event('change', { bubbles: true })); }catch(e){} }

  function load(row, code, rec){
    const b = formFor(row, code); if(!b) return; wait(b);
    const p = rec ? rec.p : Promise.resolve(window.api('dbRecord', typeof TOKEN !== 'undefined' ? TOKEN : window.TOKEN, row, code)).then(v2 => { if(formFor(row, code) && typeof window.dbPatch === 'function') window.dbPatch(v2, code); return v2; });
    /* stuForm's own dbPatch runs in a setTimeout after the record arrives: run after it */
    p.then(v2 => setTimeout(() => ready(row, code, v2), 0), () => setTimeout(() => { const b2 = formFor(row, code); if(b2 && !q(b2, 'sBirthR')) failed(b2); }, 0)); }
  window.bd960Load = load;

  const sf0 = window.stuForm;
  window.stuForm = async function(row, code){
    const r = Number(row) || 0, c = String(code || ''), t0 = Date.now();
    const p = sf0.apply(this, arguments);
    /* Edit student: block Save from the very first frame (the loading card has no button, the form gets one) */
    if(r > 0){ const obs = new MutationObserver(() => { const b = formFor(r, c); if(b && !q(b, 'sBirthR') && !(q(b, 'sGo').dataset.bd960w || q(b, 'sGo').dataset.bd960f)) wait(b); });
      try{ const b = bd(); if(b) obs.observe(b, { childList: true }); }catch(e){}
      try{ await p; }catch(e){} obs.disconnect();
      const rec = REC[keyOf(r, c)]; load(r, c, rec && rec.t >= t0 ? rec : null);
      return; }
    return p; };

  /* sendStu: only the open, loaded form for that row may send; the birthdate is decided here */
  const ss0 = window.sendStu;
  window.sendStu = function(row, code){
    const r = Number(row) || 0, c = String(code || '');
    if(r > 0){
      const b = formFor(r, c), R = b && q(b, 'sBirthR');
      if(!b){ say('This form is no longer open · nothing was saved'); return; }
      if(!R || R.value !== keyOf(r, c)){ const go = q(b, 'sGo'); if(go && go.dataset.bd960f){ load(r, c, null); return; } say('Still loading the latest record · try again in a moment'); return; }
      const el = q(b, 'sBirth'), M = q(b, 'sBirthM').value, O = q(b, 'sBirthO').value, x = String(el.value || '').trim();
      let d;
      if(M === 'clear') d = { birth: '', clear: 1 };
      else if((M === 'input' || M === 'edit') && ISO.test(x) && x !== O) d = { birth: x };
      else d = { birth: O, keep: 1 };
      PB = Object.assign({ row: r, code: c }, d);
      try{ return ss0.apply(this, arguments); } finally { PB = null; } }
    return ss0.apply(this, arguments); };
})();
</script>` + s.slice(i);
fs.writeFileSync(file, s);
lib(file, []);
