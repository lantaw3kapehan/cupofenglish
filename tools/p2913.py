p='tools/b2911.js'; s=open(p).read()
def R(a,b):
  global s
  assert s.count(a)==1, a[:90]; s=s.replace(a,b)

# ---------- CSS: navy hero (B) ----------
R("""    '.x11-back{display:none;""","""    /* 2913 · B Navy Hero (Misty 16:28) */
    '.x11-hero{background:radial-gradient(900px 260px at 92% -30%,rgba(1,176,191,.34),transparent 60%),linear-gradient(135deg,#2F2752 0%,#3D3470 100%);color:#fff;border-radius:22px;padding:24px 28px 22px;margin:0 0 18px;box-shadow:0 10px 30px rgba(47,39,82,.18)}',
    '.x11-hero .x11-h{margin:0}.x11-hero h1{color:#fff!important}.x11-hero .x11-sub{color:#CFCBE6}',
    '.x11-hero .x11-ib,.x11-hero .x11-tb{background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.22);color:#fff}.x11-hero .x11-ib:hover{border-color:#7FE3EC}.x11-hero .x11-nav b{color:#fff}',
    '.x11-hero .x11-k{gap:0;margin:22px 0 0;border-top:1px solid rgba(255,255,255,.14);padding-top:16px}',
    '.x11-hero .x11-t{background:none;border:0;border-left:1px solid rgba(255,255,255,.14);border-radius:0;padding:0 20px}.x11-hero .x11-t:first-child{border-left:0;padding-left:0}',
    '.x11-hero .x11-t > span{color:#B9B4D6}.x11-hero .x11-t b{color:#fff;font-size:32px}.x11-hero .x11-t b.sm{font-size:19px;margin:10px 0 6px}.x11-hero .x11-t small{color:#D8D5EA}',
    '.x11-hero .x11-t.warn{background:none}.x11-hero .x11-t.warn b{color:#FFB7A3}',
    '.x11-hero .x11-av{box-shadow:0 0 0 2px #3A3169}',
    '.x11-hero .x11-fh{display:flex;align-items:center;gap:16px}.x11-hero .x11-fn{color:#fff;font-size:26px;font-family:"Fredoka One",Inter,sans-serif;font-weight:400}',
    '#v-mcal .x11-chip{border:0;font-weight:700;font-size:12.5px;padding:5px 11px}#v-mcal .x11-chip i{display:none}',
    '.x11-ag{display:flex;gap:12px;align-items:flex-start;padding:11px 0;border-top:1px solid #F4F3F8}.x11-ag:first-of-type{border-top:0}',
    '.x11-ag .dd{width:44px;text-align:center;flex:none}.x11-ag .dd b{display:block;font-size:20px;color:#2F2752;line-height:1.05;font-variant-numeric:tabular-nums}.x11-ag .dd small{font-size:10.5px;font-weight:700;color:#8A879C;letter-spacing:.06em;text-transform:uppercase}',
    '.x11-ag .dd.t b{color:#0E6F68}.x11-ag .x{min-width:0;flex:1}.x11-ag .x b{display:block;color:#2F2752;font-weight:600;font-size:14.5px}.x11-ag .x small{display:block;color:#6F6B85;font-size:13px}',
    '.x11-ag .x i{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:7px;vertical-align:1px}',
    '.x11-list{background:#fff;border:1px solid #ECEAF1;border-radius:18px;overflow:hidden}.x11-list .x11-q{margin:0;border-radius:10px}.x11-list .qw{padding:12px;border-bottom:1px solid #F4F3F8}',
    '.x11-list .x11-f{border:0;border-bottom:1px solid #F4F3F8;border-radius:0;margin:0;padding:12px 16px;background:#fff}.x11-list .x11-f:hover{background:#FAFCFD}',
    '.x11-list .x11-f.on{background:#F4FBFC;box-shadow:inset 3px 0 0 #01B0BF;border-color:#F4F3F8}.x11-list .x11-fl{max-height:calc(100vh - 300px);margin:0;padding:0}',
    '.x11-kids2{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:14px;margin:0 0 16px}',
    '.x11-kd{background:#fff;border:1px solid #ECEAF1;border-radius:18px;padding:16px 18px;display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:14px;align-items:center;cursor:pointer}.x11-kd:hover{border-color:#B9E8EC}',
    '.x11-kd b{color:#2F2752;font-size:16px}.x11-kd .cn{color:#6F6B85;margin-left:4px}.x11-kd small{display:block;color:#6F6B85;font-size:13px}',
    '.x11-kd .big{font-size:28px;font-weight:700;color:#2F2752;text-align:right;line-height:1;font-variant-numeric:tabular-nums}.x11-kd .big small{font-size:12px;font-weight:600;margin-top:4px}',
    '.x11-av.big{width:44px;height:44px;font-size:18px}',
    '#v-families .x11-two{gap:0 16px}#v-families .x11-sec{margin-top:0;margin-bottom:16px}',
    '.x11-back{display:none;""")
R(".x11-t b{font-size:22px}",".x11-t b{font-size:22px}.x11-hero{padding:20px 18px;border-radius:18px}.x11-hero .x11-k{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:16px 0}.x11-hero .x11-t:nth-child(odd){border-left:0;padding-left:0}.x11-hero .x11-t b{font-size:26px}.x11-hero .x11-fn{font-size:21px}")

# ---------- Deadlines: hero ----------
R("""    let h = '<div class="x11-h"><div><h1>Deadlines</h1><div class="x11-sub">Pay, dues, reports, memos, trainings, holidays and package ends in one month</div></div>'""",
  """    let h = '<div class="x11-hero"><div class="x11-h"><div><h1>Deadlines</h1><div class="x11-sub">Pay, dues, reports, memos, trainings, holidays and package ends in one month.</div></div>'""")
R("""    if(!r){ v.innerHTML = h + (C.err""","""    if(!r){ h = h.replace('<div class="x11-chips">', '</div><div class="x11-chips">'); v.innerHTML = h + (C.err""")
R("""<small>' + all.filter(x => x.kind === 'tr').length + ' training · ' + all.filter(x => x.kind === 'hol').length + ' holiday days</small></div></div><div class="x11-chips">'); }""",
  """<small>' + all.filter(x => x.kind === 'tr').length + (all.filter(x => x.kind === 'tr').length === 1 ? ' training' : ' trainings') + ', ' + all.filter(x => x.kind === 'hol').length + ' holiday days</small></div></div></div><div class="x11-chips">'); }""")
R("""<div class="x11-t' + (late.length ? ' warn' : '') + '"><span>Needs you</span>""","""<div class="x11-t' + (late.length ? ' warn' : '') + '"><span>Needs You</span>""")
R("<span>Next deadline</span>","<span>Next Deadline</span>")
R("<span>Packages ending</span>","<span>Packages Ending</span>")
R("""(nx.day === t ? 'Today' : dLong(nx.day)) + ' · ' + E(nx.sub)""","""(nx.day === t ? 'Today' : dLong(nx.day)) + ', ' + E(nx.sub)""")
# chips: tinted tags
R("""return '<button class="x11-chip' + (C.off[k] ? ' off' : '') + '" onclick="dl2911.tg(\\'' + k + '\\')"><i style="background:' + KIND[k].c + '"></i>' + KIND[k].l + ' <small>' + n + '</small></button>';""",
  """return '<button class="x11-chip' + (C.off[k] ? ' off' : '') + '" style="background:' + KIND[k].bg + ';color:' + KIND[k].c + '" onclick="dl2911.tg(\\'' + k + '\\')"><i style="background:' + KIND[k].c + '"></i>' + KIND[k].l + ' ' + n + '</button>';""")
# agenda rows with date block
R("""  const row = x => { return""","""  const WDS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const agRow = x => { const t = today(), d = new Date(x.day + 'T00:00:00Z'), k = KIND[x.kind]; return '<div class="x11-ag"' + (x.code ? ' style="cursor:pointer" onclick="openStudent(\\'' + E(x.code) + '\\')"' : '') + '><div class="dd' + (x.day === t ? ' t' : '') + '"><b>' + d.getUTCDate() + '</b><small>' + (x.day === t ? 'Today' : x.day.slice(0, 7) !== C.m ? MS3[d.getUTCMonth()] : WDS[d.getUTCDay()]) + '</small></div><div class="x"><b><i style="background:' + k.c + '"></i>' + E(x.title) + '</b><small>' + E(x.sub) + '</small></div>' + (x.st ? '<span class="x11-st ' + x.st[0] + '">' + E(x.st[1] === 'Not recorded' ? 'Overdue' : x.st[1]) + '</span>' : '') + '</div>'; };
  const row = x => { return""")
R("""+ X.map(row).join(''); }""","""+ X.map(agRow).join(''); }""")
R("""      s = '<h2>' + (m === t.slice(0, 7) ? 'Coming up' : 'This month') + '</h2><div class="x11-sub">' + (late.length ? late.length + ' past and not done' : 'Tap a day to see it') + '</div>';
      if(late.length) s += '<div class="x11-day">Needs you</div>' + late.map(row).join('');
      let last = ''; U.filter(x => !(x.st && x.st[0] === 'late')).forEach(x => { if(x.day !== last){ s += '<div class="x11-day">' + (x.day === t ? 'Today' : dLong(x.day)) + '</div>'; last = x.day; } s += row(x); });""",
"""      s = '<h2>' + (m === t.slice(0, 7) ? 'Coming Up' : 'This Month') + '</h2><div class="x11-sub">' + (late.length ? late.length + ' past and not done.' : 'Tap a day to see it.') + '</div>';
      s += late.map(agRow).join('') + U.filter(x => !(x.st && x.st[0] === 'late')).map(agRow).join('');
      if(m === t.slice(0, 7)){ const n2 = items(addM(m, 1)).filter(x => x.due && !x.done)[0]; if(n2) s += agRow(n2); }""")
R("""s = '<h2>' + dLong(C.sel) + '</h2><div class="x11-sub">' + (X.length ? X.length + (X.length === 1 ? ' item' : ' items') : 'Nothing due') + ' · <a""","""s = '<h2>' + dLong(C.sel) + '</h2><div class="x11-sub">' + (X.length ? X.length + (X.length === 1 ? ' item. ' : ' items. ') : 'Nothing due. ') + '<a""")

# ---------- Families ----------
R("""    let h = '<div class="x11-h"><div><h1>Families</h1><div class="x11-sub">Each family on one page: children, packages, payments, reports and the parent\\'s requests</div></div></div>';""",
  """    let h = '<div class="x11-h"><div><h1>Families</h1><div class="x11-sub">Each family on one page: children, packages, payments, reports and the parent\\'s requests.</div></div></div>';""")
R("""'<div class="x11-fw"><div class="x11-fcol">' + fl + '<input class="x11-q" id="q2911" placeholder="Search a child, Chinese name, code or teacher" value="' + E(F.q) + '" oninput="fam2911.q(this.value)"><div class="x11-fl">' + list + '</div></div>""",
  """'<div class="x11-fw"><div class="x11-fcol">' + fl + '<div class="x11-list"><div class="qw"><input class="x11-q" id="q2911" placeholder="Search a child, Chinese name, code or teacher" value="' + E(F.q) + '" oninput="fam2911.q(this.value)"></div><div class="x11-fl">' + list + '</div></div></div>""")
R("""['multi', 'Several teachers', multi.length]""","""['multi', 'Several Teachers', multi.length]""")
# detail hero
R("""    h += '<div class="x11-card"><div style="display:flex;align-items:center;gap:14px"><span class="x11-avs">' + f.kids.slice(0, 3).map(k => av(k.name, 1)).join('') + '</span><div style="min-width:0"><div class="x11-fn">' + E(f.name) + '</div><div class="x11-sub" style="margin:2px 0 0">' + (f.kids.length > 1 ? f.kids.length + ' children' : '1 child') + ' · ' + E(f.teachers.join(', ') || 'No teacher yet') + '</div></div></div>';""",
  """    const tn = a => a.map(x => 'Teacher ' + x).join(', ');
    h += '<div class="x11-hero"><div class="x11-fh"><span class="x11-avs">' + f.kids.slice(0, 3).map(k => av(k.name, 1)).join('') + '</span><div style="min-width:0"><div class="x11-fn">' + E(f.name) + '</div><div class="x11-sub" style="margin:2px 0 0">' + (f.kids.length > 1 ? f.kids.length + ' children with ' : '1 child with ') + E(tn(f.teachers) || 'no teacher yet') + '.</div></div></div>';""")
R("""<div class="x11-t"><span>Units left</span>""","""<div class="x11-t"><span>Units Left</span>""")
R("""'<div class="x11-t"><span>Next class</span>""","""'<div class="x11-t"><span>Next Class</span>""")
R("""f.kids.map(k => E(k.name) + ' ' + (k.left == null ? '–' : (+k.left).toLocaleString('en-US'))).join(' · ')""","""f.kids.map(k => E(k.name) + ' ' + (k.left == null ? '–' : (+k.left).toLocaleString('en-US'))).join(', ')""")
R("""(pays[0] ? ' · last ' + dShort(pays[0].day) : '')""","""(pays[0] ? ', last ' + dShort(pays[0].day) : '')""")
R("""      + '<div class="x11-t"><span>Requests</span><b>' + (d.asks ? d.asks.length : 0) + '</b><small>Last 4 months</small></div></div>';""",
  """      + '<div class="x11-t"><span>Parent Requests</span><b>' + (d.asks ? d.asks.length : 0) + '</b><small>Last 4 months</small></div></div>';
    h += '</div>';""")
# kids: B cards (replace the old kids block)
i0 = s.index("    h += '<div class=\"x11-kids\">'"); i1 = s.index("\n", i0)
s = s[:i0] + """    h += '<div class="x11-kids2">' + f.kids.map(k => { const nx = d.next && d.next[String(k.code).toUpperCase()]; return '<div class="x11-kd" onclick="openStudent(\\'' + E(k.code) + '\\')">' + av(k.name, 1) + '<div style="min-width:0"><b>' + E(k.name) + '</b><span class="cn">' + E(k.cn || '') + '</span>' + (k.left != null && +k.left <= 8 ? '<span class="x11-low">Renew Soon</span>' : '') + '<small>' + E(k.code) + ', ' + E(tn(k.teachers || [])) + '</small><small>' + (k.book ? E(k.book) + '. ' : '') + (nx ? 'Next class ' + dLong(dOf(nx.at)) + ', ' + hm(nx.at) : 'No class booked') + '</small></div><div class="big">' + (k.left == null ? '–' : (+k.left).toLocaleString('en-US')) + '<small>units left</small></div></div>'; }).join('') + '</div>';""" + s[i1:]
# sections: two cards
R("""    return h + '<div class="x11-two">' + '<div>' + sec('Packages', pk, (d.packages || []).length) + sec('Payments', pay, (d.payments || []).length) + '</div><div>' + sec('Reports', rep, (d.reports || []).length + (d.trials || []).length) + sec('Parent requests', msg, (d.asks || []).length) + '</div></div>';""",
  """    return h + '<div class="x11-two">' + '<div>' + sec('Packages', pk, (d.packages || []).length) + sec('Payments', pay, (d.payments || []).length) + '</div><div>' + sec('Reports', rep, (d.reports || []).length + (d.trials || []).length) + sec('Parent Requests', msg, (d.asks || []).length) + '</div></div>';""")
R("""const SI = { Packages: 'pkg', Payments: 'pay', Reports: 'fb', 'Parent requests': 'memo' };""","""const SI = { Packages: 'pkg', Payments: 'pay', Reports: 'fb', 'Parent Requests': 'memo' };""")
# skeleton while detail loads: hero closes already; ok

# ---------- Growth: wrap header and tiles in the navy band ----------
R("""  const _go = window.go; window.go = function(v){ if((v === 'mcal'""","""  /* 2913: Growth gets the same navy band (header and the four numbers) */
  try{ const gcss = document.createElement('style'); gcss.id = 's2913'; gcss.textContent = [
    '#v-mgrowth .gw-hero{margin-bottom:18px}#v-mgrowth .gw-hero .gw-h{margin:0}#v-mgrowth .gw-hero h1{color:#fff}#v-mgrowth .gw-hero .gw-sub{color:#CFCBE6}',
    '#v-mgrowth .gw-hero .btn,#v-mgrowth .gw-hero button{background:rgba(255,255,255,.12)!important;border-color:rgba(255,255,255,.22)!important;color:#fff!important}',
    '#v-mgrowth .gw-hero .gw-k{gap:0;margin:22px 0 0;border-top:1px solid rgba(255,255,255,.14);padding-top:16px}',
    '#v-mgrowth .gw-hero .gw-t{background:none;border:0;border-left:1px solid rgba(255,255,255,.14);border-radius:0;padding:0 20px}#v-mgrowth .gw-hero .gw-t:first-child{border-left:0;padding-left:0}',
    '#v-mgrowth .gw-hero .gw-t > span{color:#B9B4D6}#v-mgrowth .gw-hero .gw-t b{color:#fff}#v-mgrowth .gw-hero .gw-t small{color:#D8D5EA}#v-mgrowth .gw-hero .gw-t b small{color:#7FE3EC!important;font-size:16px}',
    '#v-mgrowth .gw-hero .gw-d.up{background:rgba(127,227,170,.18);color:#9BE8C1}#v-mgrowth .gw-hero .gw-d.dn{background:rgba(255,183,163,.18);color:#FFB7A3}#v-mgrowth .gw-hero .gw-d.eq{background:rgba(255,255,255,.12);color:#D8D5EA}',
    '@media(max-width:899px){#v-mgrowth .gw-hero .gw-k{grid-template-columns:repeat(2,minmax(0,1fr));gap:16px 0}#v-mgrowth .gw-hero .gw-t:nth-child(odd){border-left:0;padding-left:0}}'
  ].join(''); document.head.appendChild(gcss);
    const wrapG = () => { const v = document.getElementById('v-mgrowth'); if(!v) return; const h = v.querySelector(':scope > .gw-h'), k = v.querySelector(':scope > .gw-k'); if(!h || h.parentNode.classList.contains('gw-hero')) return; const w = document.createElement('div'); w.className = 'x11-hero gw-hero'; v.insertBefore(w, h); w.appendChild(h); if(k) w.appendChild(k); };
    const gv = document.getElementById('v-mgrowth'); if(gv) new MutationObserver(wrapG).observe(gv, { childList: true }); wrapG();
  }catch(e){ console.warn('2913 growth', e); }

  const _go = window.go; window.go = function(v){ if((v === 'mcal'""")
open(p,'w').write(s); print('ok')
