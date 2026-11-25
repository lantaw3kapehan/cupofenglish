p='tools/b2911.js'; s=open('tools/b2911.base.js').read()
def R(a,b):
  global s
  assert s.count(a)==1, a[:80]; s=s.replace(a,b)

R("""    pkg:  { l: 'Packages', c: '#5E5A76', bg: '#F1F0F5' }
  };""","""    pkg:  { l: 'Packages', c: '#5E5A76', bg: '#F1F0F5' }
  };
  const sv = d => '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>';
  const KI = {
    pay: sv('<rect x="3" y="6" width="18" height="13" rx="2.5"/><path d="M3 10h18M7 15h3"/>'),
    gov: sv('<path d="M3 9.5L12 4l9 5.5M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3.5 20h17"/>'),
    fb:  sv('<path d="M7 3.5h7l4.5 4.5V20a.5.5 0 0 1-.5.5H7a1.5 1.5 0 0 1-1.5-1.5V5A1.5 1.5 0 0 1 7 3.5z"/><path d="M14 3.5V8h4.5M9 12.5h6M9 16h4"/>'),
    memo: sv('<path d="M4 10v4h3l6 4V6L7 10H4z"/><path d="M16.5 9a4 4 0 0 1 0 6"/>'),
    tr:  sv('<path d="M3 9l9-4 9 4-9 4-9-4z"/><path d="M7 11v4.5c1.5 1.3 3.2 2 5 2s3.5-.7 5-2V11M21 9v5"/>'),
    hol: sv('<path d="M5 21V4M5 4.5h11l-2 3.5 2 3.5H5"/>'),
    pkg: sv('<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z"/><path d="M4 7.5l8 4.5 8-4.5M12 12v9"/>')
  };
  const ico = k => '<span class="x11-ic" style="background:' + KIND[k].bg + ';color:' + KIND[k].c + '">' + KI[k] + '</span>';
  const PAL = [['#E6F6F7', '#0E6F68'], ['#EEEDFE', '#3C3489'], ['#FCF1E3', '#8A4B0F'], ['#E3F4EC', '#1D7A52'], ['#FCECE7', '#B4472F'], ['#EEEDF5', '#2F2752']];
  const av = (n, big) => { const t = String(n || '?'), h = [...t].reduce((a, c) => a + c.charCodeAt(0), 0), p = PAL[h % PAL.length]; return '<span class="x11-av' + (big ? ' big' : '') + '" style="background:' + p[0] + ';color:' + p[1] + '">' + E(t.trim().charAt(0).toUpperCase()) + '</span>'; };""")

R("""    '.x11-back{display:none;""","""    '.x11-ic{width:30px;height:30px;border-radius:9px;display:inline-flex;align-items:center;justify-content:center;flex:none}',
    '.x11-av{width:30px;height:30px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;flex:none;box-shadow:0 0 0 2px #fff}.x11-av.big{width:44px;height:44px;font-size:18px}',
    '.x11-avs{display:inline-flex;flex:none}.x11-avs .x11-av + .x11-av{margin-left:-8px}',
    '.x11-k{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin:0 0 14px}',
    '.x11-t{background:#fff;border:1px solid #ECEAF1;border-radius:16px;padding:14px 16px;min-width:0}',
    '.x11-t > span{display:block;font-size:11.5px;letter-spacing:.06em;text-transform:uppercase;font-weight:700;color:#8A879C}',
    '.x11-t b{display:block;font-size:26px;line-height:1.15;color:#2F2752;margin:6px 0 2px;font-variant-numeric:tabular-nums;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.x11-t b.sm{font-size:16px;margin:8px 0 4px}',
    '.x11-t small{display:block;font-size:12.5px;color:#6F6B85;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.x11-t.warn{border-color:#F3C9BD;background:#FFF9F7}.x11-t.warn b{color:#B4472F}',
    '.x11-sh{display:flex;align-items:center;gap:10px;margin:0 0 6px}.x11-sh h3{margin:0}',
    '.x11-low{display:inline-block;font-size:11px;font-weight:700;border-radius:999px;padding:1px 8px;background:#FCF1E3;color:#8A4B0F;margin-left:6px;vertical-align:2px}',
    '.x11-fn{font-size:21px;font-weight:700;color:#2F2752;line-height:1.2}',
    '.x11-back{display:none;""")

R(".x11-d:hover{background:#FAFCFD}",".x11-d:hover{background:#F7FCFD}.x11-d.we{background:#FCFCFE}.x11-d.past .x11-n{color:#B5B2C3}.x11-d.past .x11-p{opacity:.6}")
R(".x11-p{font-size:11.5px;line-height:1.3;border-radius:6px;padding:2px 6px;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;font-weight:600;border-left:3px solid}",
  ".x11-p{font-size:11.5px;line-height:1.3;border-radius:7px;padding:3px 7px;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;font-weight:600}")
R("""'<div class="x11-p' + (x.done ? ' done' : '') + '" style="background:' + k.bg + ';color:' + k.c + ';border-color:' + k.c + '" title=""","""'<div class="x11-p' + (x.done ? ' done' : '') + (x.st && x.st[0] === 'late' ? ' late' : '') + '" style="background:' + k.bg + ';color:' + k.c + '" title=""")
R(".x11-p.done{opacity:.55;text-decoration:line-through}",".x11-p.done{opacity:.55;text-decoration:line-through}.x11-p.late{box-shadow:inset 0 0 0 1.5px #E2876F}")
R("""g += '<div class="x11-d' + (d === t ? ' t' : '')""","""const wd = (lead + dn - 1) % 7; g += '<div class="x11-d' + (d === t ? ' t' : '') + (d < t ? ' past' : '') + (wd > 4 ? ' we' : '')""")

R(".x11-it{display:grid;grid-template-columns:4px minmax(0,1fr) auto;gap:10px;padding:9px 0;border-top:1px solid #F4F3F8;align-items:start}",".x11-it{display:grid;grid-template-columns:30px minmax(0,1fr) auto;gap:11px;padding:9px 0;border-top:1px solid #F4F3F8;align-items:center}")
R(".x11-it > i{border-radius:4px;align-self:stretch}","")
R("""'><i style="background:' + k.c + '"></i><div><b>'""","""'>' + ico(x.kind) + '<div><b>'""")
R("const row = x => { const k = KIND[x.kind]; return","const row = x => { return")

R("""    const by = {}; L.forEach(x => (by[x.day] = by[x.day] || []).push(x));""","""    const by = {}; L.forEach(x => (by[x.day] = by[x.day] || []).push(x));
    { const late = all.filter(x => x.st && x.st[0] === 'late'), nx = all.filter(x => x.day >= t && x.due && !x.done)[0] || (m === t.slice(0, 7) ? items(addM(m, 1)).filter(x => x.due && !x.done)[0] : null), pk = all.filter(x => x.kind === 'pkg');
      h = h.replace('<div class="x11-chips">', '<div class="x11-k"><div class="x11-t' + (late.length ? ' warn' : '') + '"><span>Needs you</span><b>' + late.length + '</b><small>' + (late.length ? E(late.map(x => x.title).join(', ')) : 'Nothing past and undone') + '</small></div>'
        + '<div class="x11-t"><span>Next deadline</span><b class="sm">' + (nx ? E(nx.title) : 'None this month') + '</b><small>' + (nx ? (nx.day === t ? 'Today' : dLong(nx.day)) + ' · ' + E(nx.sub) : '&nbsp;') + '</small></div>'
        + '<div class="x11-t"><span>Packages ending</span><b>' + pk.length + '</b><small>' + (pk.length ? E(pk.slice(0, 3).map(x => x.s.replace(/ ends$/, '')).join(', ')) + (pk.length > 3 ? ' and ' + (pk.length - 3) + ' more' : '') : 'None this month') + '</small></div>'
        + '<div class="x11-t"><span>Trainings and holidays</span><b>' + all.filter(x => x.kind === 'tr' || x.kind === 'hol').length + '</b><small>' + all.filter(x => x.kind === 'tr').length + ' training · ' + all.filter(x => x.kind === 'hol').length + ' holiday days</small></div></div><div class="x11-chips">'); }""")
R(".x11-hideph{display:none}",".x11-hideph{display:none}.x11-k{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:10px}.x11-t b{font-size:22px}#v-mcal .x11-chips{flex-wrap:nowrap;overflow-x:auto;margin-right:-16px;padding-right:16px;scrollbar-width:none}#v-mcal .x11-chip{flex:none}")

R("""    const list = L.map(f => '<button class="x11-f' + (f.id === F.sel ? ' on' : '') + '" onclick="fam2911.open(\\'' + f.id + '\\')"><b>' + E(f.name) + '</b>' + (f.kids.length > 1 ? '<span class="x11-tag">' + f.kids.length + ' children</span>' : '') + '<small>' + E(f.teachers.join(', ') || 'No teacher') + ' · ' + f.left.toLocaleString('en-US') + ' units left</small></button>').join('')""",
"""    const list = L.map(f => '<button class="x11-f' + (f.id === F.sel ? ' on' : '') + '" onclick="fam2911.open(\\'' + f.id + '\\')"><span class="x11-avs">' + f.kids.slice(0, 3).map(k => av(k.name)).join('') + '</span><span class="x11-fm"><b>' + E(f.name) + '</b><small>' + E(f.teachers.join(', ') || 'No teacher') + '</small></span><span class="x11-fu"><b>' + f.left.toLocaleString('en-US') + '</b><small>units left</small></span></button>').join('')""")
R(".x11-f{display:block;width:100%;",".x11-f{display:flex;align-items:center;gap:11px;width:100%;")
R(".x11-f b{font-size:14.5px;color:#2F2752}.x11-f small{display:block;color:#6F6B85;font-size:12.5px;margin-top:3px}",
  ".x11-fm{flex:1;min-width:0}.x11-fm b,.x11-fm small{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.x11-f b{font-size:14.5px;color:#2F2752}.x11-f small{color:#6F6B85;font-size:12.5px;margin-top:2px}.x11-fu{text-align:right;flex:none}.x11-fu b{font-variant-numeric:tabular-nums}.x11-fu small{display:block;font-size:11px}")

R("""    h += '<div class="x11-card"><h2 style="margin:0;font-size:20px;color:#2F2752">' + E(f.name) + '</h2><div class="x11-sub">' + (f.kids.length > 1 ? f.kids.length + ' children' : '1 child') + ' · ' + E(f.teachers.join(', ') || 'No teacher yet') + '</div>';""",
"""    const nexts = f.kids.map(k => d.next && d.next[String(k.code).toUpperCase()]).filter(Boolean).sort((a, b) => a.at.localeCompare(b.at)), pays = (d.payments || []), cur = {}; pays.forEach(p => { cur[p.currency || 'PHP'] = (cur[p.currency || 'PHP'] || 0) + (+p.total || 0); });
    const src = [...new Set((d.packages || []).map(p => p.source).filter(Boolean))];
    h += '<div class="x11-card"><div style="display:flex;align-items:center;gap:14px"><span class="x11-avs">' + f.kids.slice(0, 3).map(k => av(k.name, 1)).join('') + '</span><div style="min-width:0"><div class="x11-fn">' + E(f.name) + '</div><div class="x11-sub" style="margin:2px 0 0">' + (f.kids.length > 1 ? f.kids.length + ' children' : '1 child') + ' · ' + E(f.teachers.join(', ') || 'No teacher yet') + '</div></div></div>';
    if(d.packages) h += '<div class="x11-k" style="margin:16px 0 4px"><div class="x11-t"><span>Units left</span><b>' + f.left.toLocaleString('en-US') + '</b><small>' + f.kids.map(k => E(k.name) + ' ' + (k.left == null ? '–' : (+k.left).toLocaleString('en-US'))).join(' · ') + '</small></div>'
      + '<div class="x11-t"><span>Next class</span><b class="sm">' + (nexts[0] ? dLong(dOf(nexts[0].at)) : 'None booked') + '</b><small>' + (nexts[0] ? hm(nexts[0].at) + ' with ' + E(String(nexts[0].t || '').replace(/^./, c => c.toUpperCase())) : '&nbsp;') + '</small></div>'
      + '<div class="x11-t"><span>Paid</span><b class="sm">' + (Object.keys(cur).length ? Object.keys(cur).map(c => money(cur[c], c)).join(' + ') : 'None recorded') + '</b><small>' + pays.length + (pays.length === 1 ? ' payment' : ' payments') + (pays[0] ? ' · last ' + dShort(pays[0].day) : '') + '</small></div>'
      + '<div class="x11-t"><span>Requests</span><b>' + (d.asks ? d.asks.length : 0) + '</b><small>Last 4 months</small></div></div>';""")
R("""return '<div class="x11-kid" onclick="openStudent(\\'' + E(k.code) + '\\')"><b>' + E(k.name) + '</b><span class="cn">' + E(k.cn || '') + '</span>""",
  """return '<div class="x11-kid" onclick="openStudent(\\'' + E(k.code) + '\\')"><div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">' + av(k.name) + '<div style="min-width:0"><b>' + E(k.name) + '</b><span class="cn">' + E(k.cn || '') + '</span>' + (k.left != null && +k.left <= 8 ? '<span class="x11-low">Renew soon</span>' : '') + '</div></div>""")
R("""const sec = (t, body, n) => '<div class="x11-card x11-sec"><h3>' + t + (n != null ? ' · ' + n : '') + '</h3>'""",
  """const SI = { Packages: 'pkg', Payments: 'pay', Reports: 'fb', 'Parent requests': 'memo' };
    const sec = (t, body, n) => '<div class="x11-card x11-sec"><div class="x11-sh">' + ico(SI[t]) + '<h3>' + t + (n != null ? ' · ' + n : '') + '</h3></div>'""")
open(p,'w').write(s)

a=open('app.html').read()
a=a.replace("v: [['home', 'Overview'], ['mtoday', 'To do'], ['schedule', 'Schedule'], ['monitor', 'Monitor']] }","v: [['home', 'Overview'], ['mtoday', 'To do'], ['schedule', 'Schedule'], ['mcal', 'Deadlines'], ['monitor', 'Monitor']] }")
a=a.replace("v: [['astudents', 'Students'], ['trials', 'Trials'],","v: [['astudents', 'Students'], ['families', 'Families'], ['trials', 'Trials'],")
a=a.replace("const MGMT_ONLY1997 = /^(mgrowth|","const MGMT_ONLY1997 = /^(mcal|families|mgrowth|",1)
k='<script id="b2909">'; a=a.replace(k,s+'\n'+k)
open('mock-2911.html','w').write(a)
print('ok')
