// 1733: (Misty 4 Nov 12:01–12:04, "easily fix and edit or add on SCHEDULE … ensure no schedule will be affected") a class that was
//   added by mistake can be deleted in the app (management): only the one class tapped, only before it starts, never a class that is
//   part of a repeating Google series (Cancel stays for those). Google keeps a full copy in the database first (coe_class_trash), then
//   removes the event; "Deleted classes" lists them with Undo, which puts the class back. Server: DELCLS1104 (web app v460).
const file = process.argv[2];
const JS = String.raw`<script>
/* 1733 · delete a class added by mistake · Deleted classes with Undo */
(function(){
  if(window.__1733) return; window.__1733 = 1;
  const H = x => (typeof esc === 'function' ? esc(x) : String(x == null ? '' : x));
  const when = t => { const d = new Date(t); return isNaN(d) ? '' : d.toLocaleString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false }); };
  window.ceDelHtml = function(e){ try{ if(!(typeof D !== 'undefined' && D && D.mgr) || !e || !e.id || Date.parse(e.start) <= Date.now()) return ''; }catch(x){ return ''; }
    return '<div style="margin-top:22px;padding-top:12px;border-top:1px solid var(--line)"><a class="link small" onclick="this.style.display=\'none\';document.getElementById(\'ceDel\').classList.remove(\'hide\')">Added by mistake? Delete this class</a>' +
      '<div id="ceDel" class="hide"><h2 style="margin-top:8px">Delete this class</h2><p class="small mute">Only this one class is removed from the calendar. A copy is kept: <b>Deleted classes</b> has Undo. For a class that did not happen, use Cancel instead.</p>' +
      '<label for="ceDelWhy">Why (one line)</label><input id="ceDelWhy" class="in-t" placeholder="e.g. added twice by mistake">' +
      '<button class="btn ghost block" style="margin-top:10px;color:#B4513B;border-color:#E8B4A8" id="ceDelGo" onclick="ceDel()">Delete this class</button>' +
      '<button class="btn ghost block sm" style="margin-top:6px" onclick="ceTrash()">Deleted classes · Undo</button></div></div>'; };
  window.ceDel = async function(){ const e = (typeof CE !== 'undefined' && CE && CE.e) || null; if(!e) return; const why = ((document.getElementById('ceDelWhy') || {}).value || '').trim();
    if(!why){ toast('Write why (one line)'); const w = document.getElementById('ceDelWhy'); if(w) w.focus(); return; }
    if(!confirm('Delete this class?\n\n' + (e.title || '') + '\n' + when(e.start) + '\n\nOnly this one class. Undo is under Deleted classes.')) return;
    const b = document.getElementById('ceDelGo'); if(b){ b.disabled = true; b.textContent = 'Deleting…'; }
    let r; try{ r = await apiNow('delClass', TOKEN, e.id, { start: e.start, reason: why }); }catch(x){ r = { ok: false, msg: (x && x.message) || 'No connection · nothing deleted' }; }
    if(!r || !r.ok){ if(b){ b.disabled = false; b.textContent = 'Delete this class'; } return toast((r && r.msg) || 'Not deleted'); }
    toast('✓ ' + (r.note || 'Deleted')); try{ SC_PEND = 1; }catch(x){} try{ Object.keys(SCC).forEach(k => { SCC[k]._t = 0; }); }catch(x){} closeSheet();
    try{ const code = e.code || (typeof STU !== 'undefined' && STU && STU.code); if(code) api('mgmtStuClasses', TOKEN, code).then(x => { if(!Array.isArray(x)) return; CLSM[code] = x; if(STU && STU.code === code){ STU.cls = x; const el = $('stuSch'); if(el) el.innerHTML = stuSched(x); } }).catch(() => {}); }catch(x){} };
  window.ceTrash = async function(){ openSheet('<h1>Deleted classes</h1><div class="sk"></div><div class="sk" style="width:70%"></div>');
    let r; try{ r = await apiNow('mgmtClassTrash', TOKEN); }catch(x){ r = { ok: false }; } if(!r || !r.ok) return openSheet('<h1>Deleted classes</h1><div class="empty">Could not load · try again</div>');
    const L = r.list || []; openSheet('<h1>Deleted classes</h1><p class="small mute">Classes deleted in the app (added by mistake). Undo puts the class back in the calendar.</p>' + (L.length ? L.map(x =>
      '<div style="padding:10px 0;border-top:1px solid var(--line)"><b>' + H(x.title) + '</b><div class="small">' + when(x.starts_at) + '</div><div class="small mute">Deleted by ' + H(x.made_by) + ' · ' + when(x.made_at) + ' · ' + H(x.reason) + '</div>' +
      (x.restored_at ? '<div class="small" style="color:#1E7A55">Back in the calendar · ' + H(x.restored_by || '') + ' · ' + when(x.restored_at) + '</div>' : '<button class="btn ghost sm" style="margin-top:6px" onclick="ceUndel(' + Number(x.id) + ',this)">Undo · put back</button>') + '</div>').join('') : '<div class="empty">No deleted classes.</div>')); };
  window.ceUndel = async function(id, btn){ if(btn){ btn.disabled = true; btn.textContent = 'Putting back…'; }
    let r; try{ r = await apiNow('undelClass', TOKEN, id); }catch(x){ r = { ok: false, msg: 'No connection' }; }
    if(!r || !r.ok){ if(btn){ btn.disabled = false; btn.textContent = 'Undo · put back'; } return toast((r && r.msg) || 'Not put back'); }
    toast('✓ ' + (r.note || 'Back in the calendar')); try{ SC_PEND = 1; Object.keys(SCC).forEach(k => { SCC[k]._t = 0; }); }catch(x){} ceTrash(); };
})();
</script>
`;
require('../tools/lib.js')(file, [
  ['like the team does by hand.</p></div>`);', 'like the team does by hand.</p></div>${window.ceDelHtml ? ceDelHtml(e) : \'\'}`);'],
  ["</style>\n</body>\n</html>", "</style>\n" + JS + "</body>\n</html>"],
]);
