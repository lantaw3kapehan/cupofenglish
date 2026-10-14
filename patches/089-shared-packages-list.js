// 14 Oct · Shared packages (Misty): one list of every shared package (siblings on one package) under Management › Students
// › "Shared packages": children, codes, teachers, lessons left, ends; tap → the Shared lesson summary. Pairs linked only halfway
// in ACTIVE (a row's AY points to a sibling, but both rows hold their own package, e.g. Andy ↔ Joy) are listed under "Check in ACTIVE".
// Also: the shared summary total now adds carried-over / transferred / free lessons, so completed + remaining = total
// (Freya & Jasper 18.5 + 52, Vanessa & Annie 55 + 14).
require('../tools/lib.js')(process.argv[2], [
["['stale', 'No check in 30+ days'], ['past', 'Finished / not active']];",
 "['stale', 'No check in 30+ days'], ['past', 'Finished / not active'], ['shared', 'Shared packages']]; { const SA = shAll(); F.shared = SA ? SA.P : []; }   /* 14 Oct */"],
["h += L.slice(0, 250).map(it => { const s = it.s, o = it.o, left",
 "if(STF === 'shared' && !q){ el.innerHTML = h + shListHtml('') + '</div>'; return; }   /* 14 Oct: one list of all shared packages */\n    h += L.slice(0, 250).map(it => { const s = it.s, o = it.o, left"],
["function shHtml(code){",
 "function shAll(){ if(!AT || !AT.cols) return null; const C = {}; AT.cols.forEach((c, i) => C[c] = i); const up = s => String(s || '').trim().toUpperCase(), cd = s => (up(s).match(/ST-\\d{4}-\\d{3}/) || [''])[0];\n" +
 "  const P = [], seen = new Set(); AT.rows.forEach(r => { if(!r[C.active]) return; let G; try{ G = pkgGroup(r, C); }catch(e){ return; } const o = G.owner; if(seen.has(o)) return; const codes = [...new Set(G.members.map(x => up(x[C.code])))]; if(codes.length < 2) return; seen.add(o);\n" +
 "    const nm = {}; G.members.forEach(x => { const k = up(x[C.code]); if(!nm[k]) nm[k] = String(x[C.name] || k); }); const T = [...new Set(G.members.map(x => String(x[C.teacher] || '')).filter(Boolean))];\n" +
 "    P.push({ code: String(o[C.code]), codes, names: codes.map(k => nm[k]), T, left: shLeft(G, C), end: String(o[C.deadline] || '').slice(0, 10), live: !(o[C.available] !== '' && +o[C.available] <= 0) }); });\n" +
 "  const half = [], hs = new Set(); AT.rows.forEach(r => { if(!r[C.active]) return; const a = up(r[C.code]), b = cd(r[C.shared]); if(!b || b === a || hs.has([a, b].sort().join())) return; if(P.some(p => p.codes.includes(a) && p.codes.includes(b))) return; hs.add([a, b].sort().join());\n" +
 "    const br = AT.rows.find(x => up(x[C.code]) === b); half.push({ a, b, an: String(r[C.name] || a), bn: br ? String(br[C.name] || b) : b, row: r[C.row], own: r[C.enrolled] !== '' && r[C.enrolled] != null }); });\n" +
 "  P.sort((x, y) => x.names.join().localeCompare(y.names.join())); return { P, half }; }\n" +
 "function shLeft(G, C){ const o = G.owner, n1 = x => Math.round(x * 10) / 10, td = x => (C.today != null && +x[C.today]) || 0; const others = G.members.filter(x => x !== o).reduce((a, x) => a + td(x), 0) + G.unlinked.reduce((a, x) => a + ((+x[C.finished] || 0) - td(x)), 0);\n" +
 "  if(o[C.available] === '' || o[C.available] == null){ const tot = (+o[C.enrolled] || 0) + (+o[C.carry] || 0) + (C.transfer != null ? +o[C.transfer] || 0 : 0) + (C.incentive != null ? +o[C.incentive] || 0 : 0); return Math.max(0, n1(tot - G.members.reduce((a, x) => a + (+x[C.finished] || 0), 0))); }\n" +
 "  return Math.max(0, n1(+o[C.available] - others + (G.extra || 0))); }\n" +
 "function shListHtml(q){ const A = shAll(); if(!A) return '<div class=\"empty\">Getting the packages from ACTIVE…</div>';\n" +
 "  const fD = s => { const d = new Date(s + 'T00:00:00'); return isNaN(d) ? '' : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); };\n" +
 "  const L = A.P.filter(p => !q || (p.names.join(' ') + ' ' + p.codes.join(' ') + ' ' + p.T.join(' ')).toLowerCase().includes(q));\n" +
 "  let h = '<div class=\"small mute\" style=\"margin:6px 0 8px\">' + A.P.length + ' shared packages · siblings on one package · tap for the shared lesson summary</div>';\n" +
 "  h += L.map(p => '<div class=\"li\" onclick=\"shSummary(\\'' + esc(p.code) + '\\')\"><div class=\"av\">' + esc((p.names[0] || '?')[0]) + '</div><div class=\"grow\"><b class=\"ell\">' + esc(p.names.join(' & ')) + '</b><div class=\"small mute ell\">' + esc(p.codes.join(' · ')) + ' · ' + esc(p.T.join(', ')) + '</div></div>' +\n" +
 "    '<div style=\"text-align:right\"><div class=\"num ' + (p.left <= 5 ? 'minus' : '') + '\"><b>' + p.left + '</b> left</div><div class=\"small mute\">' + (p.end ? 'ends ' + esc(fD(p.end)) : '') + '</div></div></div>').join('') || '<div class=\"empty\">No shared packages match.</div>';\n" +
 "  if(A.half.length) h += '<div style=\"margin-top:16px\"><b>Check in ACTIVE · ' + A.half.length + '</b><div class=\"small mute\">These rows point to a sibling (AY) but are not on one package, so their summary shows one child only. On the sibling\\'s row, AY = the owner\\'s code and leave Enrolled empty.</div></div>' +\n" +
 "    A.half.map(x => '<div class=\"li\" onclick=\"shSummary(\\'' + esc(x.a) + '\\')\"><div class=\"av\">!</div><div class=\"grow\"><b class=\"ell\">' + esc(x.an) + ' → ' + esc(x.bn) + '</b><div class=\"small mute ell\">' + esc(x.a) + ' (row ' + esc(x.row) + ') · AY ' + esc(x.b) + (x.own ? ' · has its own Enrolled' : '') + '</div></div></div>').join('');\n" +
 "  return h; }\n" +
 "function shHtml(code){"],
["const kids = Object.values(byC), enrolled = +o[C.enrolled] || 0, done = n1(kids.reduce((a, k) => a + k.finished, 0)), left = o[C.available] === '' ? Math.max(0, n1(enrolled - done)) : Math.max(0, n1(+o[C.available] - others + (G.extra || 0)));\nconst pct = enrolled ? Math.min(100, Math.round(done / enrolled * 100)) : 0,",
 "const kids = Object.values(byC), enrolled = +o[C.enrolled] || 0, carry = +o[C.carry] || 0, trf = C.transfer != null ? +o[C.transfer] || 0 : 0, inc = C.incentive != null ? +o[C.incentive] || 0 : 0, tot = n1(enrolled + carry + trf + inc), done = n1(kids.reduce((a, k) => a + k.finished, 0)), left = shLeft(G, C);   /* 14 Oct: total includes carried / transferred / free */\n" +
 "const totX = (carry || trf || inc) ? ' (' + enrolled + (carry ? ' + ' + carry + ' carried' : '') + (trf ? ' ' + (trf > 0 ? '+ ' : '− ') + Math.abs(trf) + ' transferred' : '') + (inc ? ' + ' + inc + ' free' : '') + ')' : '';\n" +
 "const pct = tot ? Math.min(100, Math.round(done / tot * 100)) : 0,"],
["<div style=\"${H};font-size:34px\">${enrolled}</div><div style=\"font-size:11px\">Shared package total<br>共享课程包总课时</div>",
 "<div style=\"${H};font-size:34px\">${tot}</div><div style=\"font-size:11px\">Shared package total${totX}<br>共享课程包总课时${inc ? '（含赠送 ' + inc + ' 课时）' : ''}</div>"],
["have completed <b>${done}</b> of <b>${enrolled}</b> lessons in their shared package",
 "have completed <b>${done}</b> of <b>${tot}</b> lessons in their shared package"],
["共享课程包已完成 ${done} / ${enrolled} 课时",
 "共享课程包已完成 ${done} / ${tot} 课时"],
]);
