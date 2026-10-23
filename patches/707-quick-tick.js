// 707: (Misty) Quick tick on the management Trainings table: pick a status once (Qualified · Completed · In training · Further training,
// or Done · Assign · Excuse on the Path), then tap dots — each changes at once, saves in the background (permanent record, same as the sheet).
// "Done ticking" goes back to the detailed sheet per dot.
require('../tools/lib.js')(process.argv[2], [
["<span class=\"grow\"></span><span class=\"small mute\">Tap a heading to tick many · tap a dot for one · tap a name for the path</span></div>';",
 "<span class=\"grow\"></span>' + brushBar(tab) + '</div>' + (window._trBrush ? '' : '<div class=\"small mute\" style=\"margin:-4px 0 8px\">Tap a heading to tick many · tap a dot for one · tap a name for the path · ⚡ Quick tick to tap many dots fast</div>');"],
["'<div class=\"tx-tb\"><table>", "'<div class=\"tx-tb' + (window._trBrush ? ' brush' : '') + '\"><table>"],
[".tx .d.x{background:#CFCDD9}", `.tx .d.x{background:#CFCDD9}
.tx .d.a{border:2px solid #B8742A;background:#FFF4E6}
.tx-brush{display:flex;align-items:center;gap:6px;flex-wrap:wrap}.tx-brush button{display:inline-flex;align-items:center;gap:6px;font:inherit;font-size:13px;font-weight:700;border:1.5px solid var(--line);background:#fff;color:var(--ink);border-radius:99px;padding:6px 12px;cursor:pointer}
.tx-brush button.on{border-color:var(--ink);box-shadow:0 0 0 2px rgba(43,34,83,.12)}.tx-brush button.qt{background:#EEF8F7;border-color:#BFE6E3;color:#00626A}.tx-brush button.qt.on{background:#2B2253;border-color:#2B2253;color:#fff;box-shadow:none}
.tx-tb.brush td{cursor:copy}.tx-tb.brush td:hover{background:#F2FBFA}`],
["  window.trTick = async function(name, id, via, status){", `  /* 707: quick tick */
  const BR = { path: [['done', 'Done', 'y'], ['assigned', 'Assign', 'a'], ['excused', 'Excuse', 'x']], books: [['done', 'Qualified', 'y'], ['completed', 'Completed', 'c'], ['assigned', 'In training', 'a'], ['further', 'Further training', 'f']] }; BR.spec = BR.books;
  let QN = 0, QT = 0;
  function brushBar(tab){ const L = BR[tab] || BR.path; let b = window._trBrush; if(b && !L.some(x => x[0] === b)) b = window._trBrush = L[0][0];
    return '<div class="tx-brush">' + (b ? L.map(x => '<button type="button" class="' + (x[0] === b ? 'on' : '') + '" onclick="trBrush(\\'' + x[0] + '\\')"><i class="d ' + x[2] + '"></i>' + x[1] + '</button>').join('') + '<span class="small mute" id="trQ" style="min-width:70px">' + (QN ? 'Saving ' + QN + '…' : '') + '</span>' : '')
      + '<button type="button" class="qt' + (b ? ' on' : '') + '" onclick="trBrushOn()">' + (b ? '✓ Done ticking' : '⚡ Quick tick') + '</button></div>'; }
  window.trBrush = st => { window._trBrush = st; paintAll(); };
  window.trBrushOn = () => { const tab = ['path', 'books', 'spec'].includes(window._trTab) ? window._trTab : 'path'; window._trBrush = window._trBrush ? null : BR[tab][0][0]; paintAll(); };
  const qShow = () => { const q = $('trQ'); if(q) q.textContent = QN ? 'Saving ' + QN + '…' : 'Saved ✓'; };
  const _cell = window.trCell;
  window.trCell = function(name, id){ const st = window._trBrush; if(!st || !AL) return _cell(name, id);
    const t = (AL.trainings || []).find(x => x.id === id); if(!t) return;
    if(id === 'facil' && st === 'done') return _cell(name, id);   // asks which trainings
    const lab = ((BR[t.kind === 'unlock' ? 'books' : 'path'].find(x => x[0] === st)) || [])[1]; if(!lab) return toast('Not used here');
    const cur = latestRec(AL.records, name, id); if(cur && cur.status === st && cur.training_id === id) return toast(tName(name) + ' · already ' + lab);
    const today = new Date(Date.now() + 8 * 3600e3).toISOString().slice(0, 10);
    const r = { teacher: name, training_id: id, status: st, via: st === 'assigned' ? 'assigned' : 'manual', note: '', done_at: ['done', 'completed'].includes(st) ? today + 'T12:00:00+08:00' : null };
    const loc = Object.assign({}, r, { created_at: new Date().toISOString(), by_who: (D.me || {}).name || '' }); AL.records.push(loc); QN++; paintAll();
    call('rec_add', r).catch(x => { const i = AL.records.indexOf(loc); if(i >= 0) AL.records.splice(i, 1); toast('Not saved · ' + tName(name) + ' · ' + t.title + ' — tap again'); paintAll(); })
      .finally(() => { QN--; qShow(); if(!QN){ clearTimeout(QT); QT = setTimeout(() => { if(!QN) loadAll(true).then(() => paintAll()).catch(() => {}); }, 5000); } }); };
  window.trTick = async function(name, id, via, status){`],
]);
