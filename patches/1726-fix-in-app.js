// 1726: (Misty, 3 Nov 23:04 / 4 Nov) corrections inside the app, straight to the database, no waiting for Google.
//   Student card › "✎ Fix" opens one sheet: the student record, each package (ACTIVE) and the student's sales (SALES), each with Edit,
//   plus the history of changes with Undo. Saves go to coe-edit (database first, every screen sees it at once); the Teacher App script
//   writes the same change into the Google sheet within a minute. All management; every change needs a one-line reason.
const file = process.argv[2];
const JS = String.raw`<script>
/* 1726 · Fix in the app (database first) */
(function(){
  if(window.__1726) return; window.__1726 = 1;
  const URL_ = FAST_URL + '-edit', H = x => (typeof esc === 'function' ? esc(x) : String(x == null ? '' : x));
  const call = (op, b) => fetch(URL_, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(Object.assign({ token: TOKEN, op }, b || {})) }).then(r => r.json());
  const when = t => { const d = new Date(t); return isNaN(d) ? '' : d.toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }); };
  let FX = null;   // { code, list, rec }
  const fresh = code => { try{ Object.keys(SB_FRESH).forEach(k => { if(/(mgmtActive|mgmtStudents?|mgmtRenewals|mgmtDatabase|dbRecord|moneyLists|mgmtStuClasses)\|/.test(k)) delete SB_FRESH[k]; }); }catch(e){}
    try{ AT = null; MS = null; DB = null; store('del', 'coe.m.db'); }catch(e){} };
  const hist = L => !L || !L.length ? '<div class="small mute">No changes yet.</div>' : L.map(x => '<div style="padding:8px 0;border-top:1px solid var(--line)">' +
      '<div class="small"><b>' + H(x.made_by) + '</b> · ' + when(x.made_at) + (x.undone_at ? ' · <span class="chip">undone by ' + H(x.undone_by || '') + '</span>' : x.sheet_done_at ? ' · <span class="mute">in the sheet ✓</span>' : x.sheet_err ? ' · <span style="color:#B4513B">sheet: ' + H(x.sheet_err) + '</span>' : ' · <span class="mute">sheet updating…</span>') + '</div>' +
      '<div class="small" style="margin-top:2px">' + H(String(x.label || '').split(' · ').slice(-3).join(' · ')) + '</div><div class="small mute">Why: ' + H(x.reason) + '</div>' +
      (!x.undone_at ? '<button class="btn ghost sm" style="margin-top:4px" onclick="fxUndo(' + x.id + ')">Undo</button>' : '') + '</div>').join('');
  window.fxOpen = async function(code){ code = String(code || (typeof STU !== 'undefined' && STU && STU.code) || '').toUpperCase(); if(!code) return;
    openSheet('<h1>Fix · ' + H(code) + '</h1><div class="sk"></div><div class="sk" style="width:70%"></div>');
    let r; try{ r = await call('list', { code }); }catch(e){ r = { ok: false, error: 'No connection' }; } if(!r || !r.ok) return openSheet('<h1>Fix</h1><div class="empty">' + H((r && r.error) || 'Could not open') + '</div>');
    FX = { code, list: r };
    const row = (t, s, k, key) => '<div class="row" style="justify-content:space-between;gap:8px;padding:8px 0;border-top:1px solid var(--line)"><div><b>' + H(t) + '</b>' + (s ? '<div class="small mute">' + H(s) + '</div>' : '') + '</div><button class="btn sm" onclick="fxRec(\'' + k + '\',\'' + encodeURIComponent(key) + '\')">Edit</button></div>';
    openSheet('<h1>Fix · ' + H(r.name || code) + (r.cn ? ' ' + H(r.cn) : '') + '</h1><p class="small mute" style="margin:2px 0 10px">Changes save straight to the database and show everywhere at once. The Google sheet follows within a minute.</p>' +
      '<h3 style="margin:10px 0 4px">Student record</h3>' + row('Names, city, source, referral, trial, first class', code, 'student', code) +
      '<h3 style="margin:14px 0 4px">Packages</h3>' + (r.packages.length ? r.packages.map(p => row('Teacher ' + p.teacher, (p.enrolled !== '' ? p.enrolled + ' lessons' : '') + (p.left !== '' && p.left != null ? ' · ' + p.left + ' left' : ''), 'package', p.key)).join('') : '<div class="small mute">No package in ACTIVE.</div>') +
      '<h3 style="margin:14px 0 4px">Sales</h3>' + (r.sales.length ? r.sales.map(s => row(s.invoice, s.date + ' · ' + s.pkg + (+s.free ? ' + ' + s.free : '') + ' lessons · ' + s.partner, 'sale', s.key)).join('') : '<div class="small mute">No sale found with this name in the last two years.</div>') +
      '<h3 style="margin:14px 0 4px">Changes</h3>' + hist(r.history)); };
  window.fxRec = async function(kind, key){ key = decodeURIComponent(key); openSheet('<h1>Edit</h1><div class="sk"></div><div class="sk"></div>');
    let r; try{ r = await call('rec', { kind, key }); }catch(e){ r = { ok: false, error: 'No connection' }; } if(!r || !r.ok) return openSheet('<h1>Edit</h1><div class="empty">' + H((r && r.error) || 'Could not open') + '</div><button class="btn ghost block" onclick="fxOpen()">‹ Back</button>');
    FX = Object.assign(FX || {}, { rec: r });
    const inp = f => { const t = f.type === 'date' ? 'date' : f.type === 'time' ? 'time' : f.type === 'num' ? 'number' : 'text';
      return '<label for="fx_' + f.f + '">' + H(f.label) + '</label><input id="fx_' + f.f + '" class="in-t" type="' + t + '"' + (t === 'number' ? ' step="0.5"' : '') + ' value="' + H(f.value) + '" data-old="' + H(f.value) + '" oninput="this.classList.toggle(\'fx-ch\', this.value !== this.dataset.old)">'; };
    openSheet('<button class="btn ghost sm" onclick="fxOpen()">‹ Back</button><h1 style="margin-top:8px">' + H(r.label) + '</h1>' + r.fields.map(inp).join('') +
      '<label for="fx_why">Why (one line)</label><input id="fx_why" class="in-t" placeholder="e.g. wrong student on the confirmation">' +
      '<button class="btn teal block" style="margin-top:14px" onclick="fxSave()">Save</button><h3 style="margin:16px 0 4px">Changes to this record</h3>' + hist(r.history) +
      '<style>.fx-ch{outline:2px solid #00A6A6;background:#F1FAF9}</style>'); };
  window.fxSave = async function(){ const R = FX && FX.rec; if(!R) return; const ch = {}; R.fields.forEach(f => { const el = document.getElementById('fx_' + f.f); if(el && el.value !== el.dataset.old) ch[f.f] = el.value; });
    if(!Object.keys(ch).length) return toast('Nothing changed'); const why = ((document.getElementById('fx_why') || {}).value || '').trim(); if(!why) return toast('Write why (one line)');
    if(ch.code && !confirm('Move this package to ' + ch.code.toUpperCase() + '?')) return;
    let r; try{ r = await call('save', { kind: R.kind, key: R.key, changes: ch, reason: why }); }catch(e){ r = { ok: false, error: 'No connection · not saved' }; }
    if(!r || !r.ok) return toast((r && r.error) || 'Not saved');
    toast('✓ Saved · ' + (r.said || []).join(' · ')); fresh(); const code = FX.code;
    setTimeout(() => { try{ if(code) openStudent(code); }catch(e){} }, 400); };
  window.fxUndo = async function(id){ if(!confirm('Undo this change everywhere?')) return; let r; try{ r = await call('undo', { id }); }catch(e){ r = { ok: false, error: 'No connection' }; }
    if(!r || !r.ok) return toast((r && r.error) || 'Not undone'); toast('✓ Undone'); fresh(); const R = FX && FX.rec; if(R) fxRec(R.kind, encodeURIComponent(R.key)); else fxOpen(); };
  // the button on the student card (management), next to "Update · add a note"
  const add = () => { try{ if(!(D && D.mgr)) return; const st = document.getElementById('stuStat'); if(!st) return; const row = st.querySelector('.row'); if(!row || row.querySelector('.fx1726')) return;
      row.insertAdjacentHTML('beforeend', '<button class="btn sm ghost fx1726" onclick="fxOpen()">✎ Fix</button>'); }catch(e){} };
  const mo = new MutationObserver(() => add()); (function w(){ const b = document.getElementById('sheetBody'); if(b) mo.observe(b, { childList: true, subtree: true }); else setTimeout(w, 1500); })();
})();
</script>
`;
require('../tools/lib.js')(file, [["</script>\n</body>\n</html>", "</script>\n" + JS + "</body>\n</html>"]]);
