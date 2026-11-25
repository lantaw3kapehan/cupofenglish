p='tools/b2911.js'; s=open(p).read()
def R(a,b):
  global s
  assert s.count(a)==1, a[:90]; s=s.replace(a,b)

R("""    pkg:  { l: 'Packages', c: '#5E5A76', bg: '#F1F0F5' }
  };""","""    pkg:  { l: 'Packages', c: '#5E5A76', bg: '#F1F0F5' },
    evt:  { l: 'Team Events', c: '#0B7F8A', bg: '#DDF4F6' }
  };""")
R("""    pkg: sv('<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z"/><path d="M4 7.5l8 4.5 8-4.5M12 12v9"/>')
  };""","""    pkg: sv('<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z"/><path d="M4 7.5l8 4.5 8-4.5M12 12v9"/>'),
    evt: sv('<path d="M12 4l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 16.4l-4.8 2.5.9-5.4-3.9-3.8 5.4-.8L12 4z"/>')
  };""")
# items: team events
R("""    (r.expiries || []).forEach(x => add(""","""    (r.events || []).forEach(x => add(x.day, 'evt', x.title, (x.start ? x.start + (x.end ? ' to ' + x.end : '') : 'All day') + (x.note ? '. ' + x.note : ''), { s: x.title, ev: x }));
    (r.expiries || []).forEach(x => add(""")
R("const ord = { pay: 0, gov: 1, fb: 2, tr: 3, memo: 4, pkg: 5, hol: 6 };","const ord = { evt: 0, pay: 1, gov: 2, fb: 3, tr: 4, memo: 5, pkg: 6, hol: 7 };")
# Events tile counts team events too
R("""'<div class="x11-t"><span>Events</span><b>' + all.filter(x => x.kind === 'tr' || x.kind === 'hol').length + '</b><small>' + all.filter(x => x.kind === 'tr').length + (all.filter(x => x.kind === 'tr').length === 1 ? ' training' : ' trainings') + ', ' + all.filter(x => x.kind === 'hol').length + ' holiday days</small></div>""",
  """'<div class="x11-t"><span>Events</span><b>' + all.filter(x => x.kind === 'tr' || x.kind === 'hol' || x.kind === 'evt').length + '</b><small>' + (all.filter(x => x.kind === 'evt').length ? all.filter(x => x.kind === 'evt').map(x => x.title).slice(0, 2).join(', ') : all.filter(x => x.kind === 'tr').length + (all.filter(x => x.kind === 'tr').length === 1 ? ' training' : ' trainings') + ', ' + all.filter(x => x.kind === 'hol').length + ' holiday days') + '</small></div>""")
# Add Event button in the hero
R("""      + (m !== t.slice(0, 7) ? '<button class="x11-tb" onclick="dl2911.mv(0)">This month</button>' : '') + '</div></div>';""",
  """      + (m !== t.slice(0, 7) ? '<button class="x11-tb" onclick="dl2911.mv(0)">This Month</button>' : '') + '<button class="x11-tb x11-add" onclick="dl2911.ev()">+ Add Event</button></div></div>';""")
# agenda: events open their edit form
R("""return '<div class="x11-ag"' + (x.code ? ' style="cursor:pointer" onclick="openStudent(\\'' + E(x.code) + '\\')"' : '') + '>""",
  """return '<div class="x11-ag"' + (x.code ? ' style="cursor:pointer" onclick="openStudent(\\'' + E(x.code) + '\\')"' : x.ev ? ' style="cursor:pointer" onclick="dl2911.ev(null,\\'' + E(x.ev.id) + '\\')"' : '') + '>""")
# chosen day: add on this day
R("""'<a style="cursor:pointer;color:#0E6F68" onclick="dl2911.pick(null)">Show the month</a></div>' + X.map(agRow).join(''); }""",
  """'<a style="cursor:pointer;color:#0E6F68" onclick="dl2911.pick(null)">Show the month</a></div>' + X.map(agRow).join('') + '<button class="x11-tb" style="margin-top:12px" onclick="dl2911.ev(\\'' + C.sel + '\\')">+ Add an Event on This Day</button>'; }""")
# CSS
R("""    '.x11-back{display:none;""","""    '.x11-hero .x11-add{background:#01B0BF!important;border-color:#01B0BF!important;color:#fff!important;margin-left:4px}',
    '.x11-ef label{display:block;font-size:13px;font-weight:600;color:#6F6B85;margin:14px 0 6px}.x11-ef .r2{display:grid;grid-template-columns:1fr 1fr;gap:12px}',
    '.x11-ef .in{width:100%;box-sizing:border-box}.x11-ef .acts{display:flex;gap:8px;margin-top:20px;flex-wrap:wrap}',
    '.x11-back{display:none;""")
# form + save
R("""    pick(d){ C.sel = d; paintC(); }, re(){""","""    pick(d){ C.sel = d; paintC(); },
    ev(day, id){
      const cur = id ? (((C.r[C.m] || {}).events) || []).find(x => x.id === id) : null, e = cur || { day: day || (C.sel || today()), title: '', start: '', end: '', note: '' };
      const T = ['']; for(let h = 6; h <= 23; h++) for(const mm of ['00', '30']) T.push(String(h).padStart(2, '0') + ':' + mm);
      const opt = v => T.map(x => '<option value="' + x + '"' + (x === v ? ' selected' : '') + '>' + (x || 'No time') + '</option>').join('');
      openSheet('<h1>' + (cur ? 'Edit Event' : 'Add an Event') + '</h1><p class="small mute">Shows on Deadlines for management only. Teachers do not see it.</p><div class="x11-ef">'
        + '<label>Title</label><input class="in" id="ev11t" maxlength="80" placeholder="Christmas Party" value="' + E(e.title) + '">'
        + '<label>Date</label><input class="in" type="date" id="ev11d" value="' + E(e.day) + '">'
        + '<div class="r2"><div><label>Starts</label><select class="in" id="ev11s">' + opt(e.start) + '</select></div><div><label>Ends</label><select class="in" id="ev11e">' + opt(e.end) + '</select></div></div>'
        + '<label>Note (optional)</label><input class="in" id="ev11n" maxlength="300" placeholder="Venue, what to bring" value="' + E(e.note) + '">'
        + '<div class="acts"><button class="btn teal grow" onclick="dl2911.evSave(\\'' + E(cur ? cur.id : '') + '\\')">Save</button>' + (cur ? '<button class="btn ghost" onclick="dl2911.evDel(\\'' + E(cur.id) + '\\')">Delete</button>' : '') + '</div></div>');
      setTimeout(() => { const i = document.getElementById('ev11t'); if(i && !cur) i.focus(); }, 60);
    },
    async evSave(id){
      const g = k => (document.getElementById(k) || {}).value || '', e = { id, title: g('ev11t').trim(), day: g('ev11d'), start: g('ev11s'), end: g('ev11e'), note: g('ev11n').trim() };
      if(!e.title || !e.day) return toast('Add a title and a date');
      if(e.start && e.end && e.end <= e.start) return toast('The end time is before the start');
      try{ await API({ op: 'event', e }); closeSheet(); toast('Saved'); const mm = e.day.slice(0, 7); delete C.r[mm]; if(C.m !== mm) delete C.r[C.m]; C.m = mm; C.sel = e.day; paintC(); loadM(mm); }
      catch(x){ toast((x && x.message) || 'Not saved. Try again.'); }
    },
    async evDel(id){ try{ await API({ op: 'event', del: id }); closeSheet(); toast('Deleted'); delete C.r[C.m]; paintC(); loadM(C.m); }catch(x){ toast((x && x.message) || 'Not deleted. Try again.'); } },
    re(){""")
open(p,'w').write(s); print('ok')
