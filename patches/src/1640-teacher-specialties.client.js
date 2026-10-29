<script>
/* 1640 · Teacher specialties (Misty 29 Oct 10:05–10:09 · "management control: edited in one place, the teacher page; partners see confirmed only").
   One source of truth: staff.specialties (database), read and saved through coe-partner-spec. On a teacher's page (Team & access → Open / Edit):
   age bands (Young learners 2–8 · Kids 8–12 · Teens · Adults/IELTS-TOEFL), Advanced level, books (the COURSE codes: OD1, OD2, ODF, REF, IELTS …),
   a subject chip (e.g. Debate · Public speaking) and one short line for the parent picture. Status: Confirmed = shown on the partner portal
   (Who's free, Teachers, copied pictures) · Draft = management only · Left = not listed for partners (history stays).
   "Suggested · confirm" = read-only suggestion from the teacher's active students (ages + COURSE); it is never shown to partners. */
(function(){
  const S = window.AS40; if(!S || S.v1640) return; S.v1640 = 1;
  const URL1640 = 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-partner-spec';
  const e = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const BANDS = [['yl', 'Young learners 2–8', '幼儿'], ['kids', 'Kids 8–12', '少儿'], ['teens', 'Teens', '青少年'], ['adults', 'Adults · IELTS/TOEFL', '成人']];
  const BOOKS = ['OD1', 'OD2', 'OD3', 'ODF', 'REF', 'RE1', 'RE2', 'IELTS', 'TOEFL'];
  const ST = [['confirmed', 'Confirmed · partners see it'], ['draft', 'Draft · management only'], ['left', 'Left · not listed for partners']];
  const css = document.createElement('style'); css.id = 'st1640';
  css.textContent = '.sp40{border:1px solid var(--line);border-radius:12px;padding:12px 14px;margin:12px 0 4px;background:#FCFCFE}.sp40 h3{margin:0 0 4px!important;font:400 15px "Fredoka One",var(--f)}' +
    '.sp40 .row2{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}.sp40 .row2 label{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--line);border-radius:999px;padding:6px 11px;font:600 13px Inter,var(--f);cursor:pointer;background:#fff}' +
    '.sp40 .row2 label.on{background:#E3F4F5;border-color:#9FD3D6;color:#00606A}.sp40 .row2 input{width:16px;height:16px;margin:0}.sp40 .sug{margin-top:10px;border:1px dashed #E2C98F;background:#FFF8E8;border-radius:10px;padding:8px 10px;font-size:12.5px;color:#6B4A00}' +
    '.sp40 .sug b{font-weight:800}.sp40 .st{font:700 11px Inter,var(--f);border-radius:999px;padding:2px 8px;margin-left:6px;vertical-align:2px}.sp40 .st.c{background:#E7F5EE;color:#1F7A55}.sp40 .st.d{background:#FFF0D2;color:#7A4A00}.sp40 .st.l{background:#EEF0F4;color:#4C4868}';
  document.head.appendChild(css);
  const P = { list: null, at: 0, busy: 0 };
  async function call(op, body){ const r = await fetch(URL1640, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(Object.assign({ op, token: TOKEN }, body || {})) }); return r.json().catch(() => ({ ok: false })); }
  async function list(force){ if(!force && P.list && Date.now() - P.at < 5 * 6e4) return P.list; const j = await call('list'); if(j && j.ok){ P.list = j.teachers || []; P.at = Date.now(); } return P.list || []; }
  const lc = s => String(s || '').trim().toLowerCase();
  const bandTxt = b => (BANDS.find(x => x[0] === b) || [b, b])[1];
  function sugHtml(g){ if(!g || !g.students) return '<div class="sug">No active students to suggest from.</div>';
    const ages = Object.keys(g.ages || {}).map(k => bandTxt(k) + ' ' + g.ages[k]).join(' · ');
    return '<div class="sug"><b>Suggested · confirm</b> (from ' + g.students + ' active student' + (g.students === 1 ? '' : 's') + (ages ? ': ' + e(ages) : '') + ')<br>' +
      e((g.bands || []).map(bandTxt).join(' · ') || 'no age band') + (g.books && g.books.length ? ' · ' + e(g.books.join(', ')) : '') +
      ' <button class="as40-b" style="margin-left:6px;height:30px;padding:0 10px" onclick="AS40.spUse()">Use this</button><div style="margin-top:4px;opacity:.8">Not shown to partners until you save it as Confirmed.</div></div>'; }
  function formHtml(t){ const s = t.spec || {}, B = s.bands || [], K = s.books || [], stc = s.status === 'confirmed' ? 'c' : s.status === 'left' ? 'l' : 'd';
    const chk = (name, val, on, txt) => '<label class="' + (on ? 'on' : '') + '"><input type="checkbox" data-sp="' + name + '" value="' + e(val) + '"' + (on ? ' checked' : '') + ' onchange="this.parentNode.classList.toggle(\'on\',this.checked)">' + e(txt) + '</label>';
    return '<h3>Specialties <small style="font:500 12px Inter,var(--f);color:var(--mute)">shown on the partner portal when Confirmed</small>' + (t.spec ? '<span class="st ' + stc + '">' + e((ST.find(x => x[0] === s.status) || ['', 'Draft'])[1].split(' · ')[0]) + '</span>' : '<span class="st d">Not set</span>') + '</h3>' +
      '<div class="as40-note" style="margin:0">Partners see one age chip + up to two book chips, and the short line on the copied picture.</div>' +
      '<div class="row2">' + BANDS.map(b => chk('band', b[0], B.includes(b[0]), b[1])).join('') + chk('adv', 'adv', s.level === 'adv', 'Advanced level') + '</div>' +
      '<div class="row2">' + [...new Set(BOOKS.concat(K))].map(b => chk('book', b, K.includes(b), b)).join('') + '</div>' +
      '<div class="as40-g" style="margin-top:10px"><label>Subject chip (optional)<input id="sp40s" maxlength="60" placeholder="辩论 · 演讲 Debate & public speaking" value="' + e(s.subj || '') + '"></label>' +
      '<label>Short line for the parent picture<input id="sp40l" maxlength="80" placeholder="擅长幼儿启蒙 · Young learners 2–8" value="' + e(s.line || '') + '"></label></div>' +
      '<div class="as40-g" style="margin-top:10px"><label>Status<select id="sp40st">' + ST.map(x => '<option value="' + x[0] + '"' + ((s.status || 'draft') === x[0] ? ' selected' : '') + '>' + e(x[1]) + '</option>').join('') + '<option value="">Clear (no specialty)</option></select></label>' +
      '<div style="display:flex;align-items:flex-end;gap:8px"><button class="as40-b pri" id="sp40go" onclick="AS40.spSave(' + t.id + ')">Save specialties</button><span class="small mute" id="sp40m">' + (s.by ? 'Last saved by ' + e(s.by) + (s.at ? ' · ' + e(String(s.at).slice(0, 10)) : '') : '') + '</span></div></div>' +
      (s.status === 'confirmed' ? '' : sugHtml(t.suggest)); }
  async function mount(p){ const f = document.getElementById('as40F'); if(!f || !p || p.status !== 'active' || !/^(teacher|admin|ops)$/.test(p.role)) return; if(p.role !== 'teacher' && !document.getElementById('as40F')) return;
    let box = document.getElementById('sp40'); if(!box){ const h2 = f.querySelector('h2'); if(!h2) return; h2.insertAdjacentHTML('afterend', '<div class="sp40" id="sp40"><h3>Specialties</h3><div class="sk"></div></div>'); box = document.getElementById('sp40'); }
    const L = await list(); const t = L.find(x => x.id === p.id) || L.find(x => lc(x.name) === lc(p.name));
    if(!t){ if(p.role === 'teacher') box.innerHTML = '<h3>Specialties</h3><div class="as40-note">Could not load — check the internet and open again.</div>'; else box.remove(); return; }
    S._sp = t; box.innerHTML = formHtml(t); }
  S.spUse = function(){ const t = S._sp, g = t && t.suggest; if(!g) return; document.querySelectorAll('#sp40 input[data-sp="band"]').forEach(x => { x.checked = (g.bands || []).includes(x.value); x.parentNode.classList.toggle('on', x.checked); });
    document.querySelectorAll('#sp40 input[data-sp="book"]').forEach(x => { x.checked = (g.books || []).includes(x.value); x.parentNode.classList.toggle('on', x.checked); }); toast('Suggestion filled in · check it, set Confirmed, then Save'); };
  S.spSave = async function(id){ if(P.busy) return; const q = s => Array.from(document.querySelectorAll('#sp40 input[data-sp="' + s + '"]:checked')).map(x => x.value);
    const spec = { status: document.getElementById('sp40st').value, bands: q('band'), level: q('adv').length ? 'adv' : '', books: q('book'), subj: document.getElementById('sp40s').value, line: document.getElementById('sp40l').value };
    const b = document.getElementById('sp40go'), m = document.getElementById('sp40m'); P.busy = 1; if(b) b.disabled = true; if(m) m.textContent = 'Saving…';
    try{ const j = await call('set', { id, spec }); if(!j || !j.ok){ if(m) m.textContent = (j && j.msg) || 'Not saved'; return; }
      const t = (P.list || []).find(x => x.id === id); if(t) t.spec = j.spec; toast(spec.status === 'confirmed' ? 'Saved · partners see it within a minute' : spec.status === 'left' ? 'Saved · not listed for partners' : spec.status ? 'Saved · management only' : 'Specialty cleared');
      const p = S.L && S.L.find(x => x.id === id); if(t){ S._sp = t; const box = document.getElementById('sp40'); if(box) box.innerHTML = formHtml(t); } }
    catch(x){ if(m) m.textContent = 'No connection · try again'; } finally { P.busy = 0; if(b) b.disabled = false; } };
  const _form = S.form;
  S.form = async function(id){ const r = await _form.apply(this, arguments); try{ const p = id && S.L && S.L.find(x => x.id === id); if(p) mount(p); }catch(x){} return r; };
})();
</script>
