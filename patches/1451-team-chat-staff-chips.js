// 1451: (Misty 12:53–12:55) Team Chat members from the staff table · teachers keep their own groups (All Teachers, Time-in, Substitutes);
//   staff who don't teach (In Team Chat ticked) only have a direct chat with management and appear only in management's Direct list.
//   Chips (display only): Management (CupOfEnglish, no "President") · Management · Operations (Celine) · Teacher (teal) · Staff · position
//   (grey, ≤18 characters). Chat management comes from the server, not from the sign-in type. Manage members shows each person's chip,
//   "Direct chat only" for staff and "No app access yet" with a link to Give app access. Online now uses the same chips.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
[
"var isMgr = function(){ return hasD() && !!D.mgr; };",
"var isMgr = function(){ return S.init && typeof S.init.mgmt === 'boolean' ? S.init.mgmt : hasD() && !!D.mgr; };"
],
[
"return m && !m.mgmt ? 'Teacher ' + n : n; };",
"return m && (m.kind ? m.kind === 'teacher' : !m.mgmt) ? 'Teacher ' + n : n; };\n  /* 1451 (Misty 12:54–12:55): team · designation chip · Management / Operations purple, Teacher teal, Staff grey · display only */\n  var memOf = function(n){ var k = String(n || '').toLowerCase(), A = (S.mem || []).concat((S.init && S.init.members) || []); for(var i = 0; i < A.length; i++) if(A[i] && String(A[i].name).toLowerCase() === k && A[i].team) return A[i]; return null; };\n  var chip = function(n, mg){ var m = memOf(n), t = m ? m.team : (mg ? 'Management' : 'Teacher'), d = m ? String(m.des || '') : '';\n    if(/president/i.test(d)) d = ''; var dd = d.length > 18 ? d.slice(0, 17) + '\\u2026' : d;\n    return '<span class=\"ch-tag ch-k' + (t === 'Management' ? 'm' : t === 'Staff' ? 's' : 't') + '\"' + (d ? ' title=\"' + esc(t + ' · ' + d) + '\"' : '') + '><b>' + esc(t) + '</b>' + (dd ? '<i> · ' + esc(dd) + '</i>' : '') + '</span>'; };\n  window.chatChip1451 = function(n, mg){ return S.init ? chip(n, mg) : ''; };"
],
[
"var who = '<div class=\"ch-who\"><b>' + esc(disp(m.author)) + '</b>' + (m.mgmt ? '<span class=\"ch-tag\">Management</span>' : '')",
"var who = '<div class=\"ch-who\"><b>' + esc(AL()[m.author] || m.author) + '</b>' + chip(m.author, m.mgmt)"
],
[
"var L = S.mem || (S.init.members || []).map(function(m){ return { name: m.name, mgmt: m.mgmt }; });",
"var L = S.mem || (S.init.members || []).map(function(m){ return { name: m.name, mgmt: m.mgmt, kind: m.kind, team: m.team, des: m.des }; });"
],
[
"esc(disp(m.name).replace(/^Teacher /, '')) + '</span>' + (m.mgmt ? '<span class=\"ch-tag\">Management</span>' : '') + '<small'",
"esc(disp(m.name).replace(/^Teacher /, '')) + '</span>' + chip(m.name, m.mgmt) + '<small'"
],
[
"esc(disp(m.name).replace(/^Teacher /, '')) + '</span>' + (m.mgmt ? '<span class=\"ch-tag\">Management</span>' : '') + '</div>'; }).join('');",
"esc(disp(m.name).replace(/^Teacher /, '')) + '</span>' + chip(m.name, m.mgmt) + '</div>'; }).join('');"
],
[
"'<span class=\"nm\">' + esc(g.kind === 'direct' ? g.name.replace(/^Teacher /, '') : g.name) + '</span>' + n + '</button>'; };",
"'<span class=\"nm\">' + esc(g.kind === 'direct' ? g.name.replace(/^Teacher /, '') : g.name) + '</span>' + (isMgr() && g.kind === 'direct' && (memOf(g.id.slice(3)) || {}).kind === 'staff' ? chip(g.id.slice(3)) : '') + n + '</button>'; };"
],
[
"<span class=\"vh\">Find a teacher</span><input type=\"search\" placeholder=\"Find a teacher\"",
"<span class=\"vh\">Find a person</span><input type=\"search\" placeholder=\"Find a person\""
],
[
"aria-label=\"Find a teacher\"></label>",
"aria-label=\"Find a person\"></label>"
],
[
"'<div class=\"ch-note\">No teacher matches \"' + esc(S.dmq) + '\".</div>'",
"'<div class=\"ch-note\">No one matches \"' + esc(S.dmq) + '\".</div>'"
],
[
"(isMgr() ? 'Private chat with this teacher. Only management and the teacher can read it.'",
"(isMgr() ? ((memOf(S.gid.slice(3)) || {}).kind === 'staff' ? 'Private chat with ' + (memOf(S.gid.slice(3)) || {}).name + '. Only management and ' + (memOf(S.gid.slice(3)) || {}).name + ' can read it.' : 'Private chat with this teacher. Only management and the teacher can read it.')"
],
[
"window.chatTodo1415 = function(){ if(!S.todo || !S.todo.length || isMgr()) return [];",
"window.chatTodo1415 = function(){ if(!S.todo || !S.todo.length || isMgr() || (S.init && S.init.kind && S.init.kind !== 'teacher')) return [];"
],
[
"if(x.confirmed_at) s.push('Confirmed ' + tm(x.confirmed_at));",
"if(x.confirmed_at) s.push('Acknowledged ' + tm(x.confirmed_at));"
],
[
"var GL = r.groups || [], row = function(t){ var gs = t.groups || GL.map(function(g){ return g.id; });\n        return '<div class=\"ch-rd ch-rd2\"><span class=\"nm\">Teacher ' + esc(t.name) + '</span>' + (t.in && GL.length ?",
"S.rk = {}; r.teachers.forEach(function(t){ S.rk[t.name] = t.kind; });\n      var GL = r.groups || [], row = function(t){ var gs = t.groups || GL.map(function(g){ return g.id; }), st = t.kind === 'staff';\n        var who = '<span class=\"nm\">' + esc(t.name) + '<span class=\"ch-tag ch-k' + (t.team === 'Management' ? 'm' : st ? 's' : 't') + '\"><b>' + esc(t.team || (st ? 'Staff' : 'Teacher')) + '</b>' + (t.des && !/president/i.test(t.des) ? '<i> · ' + esc(t.des.length > 18 ? t.des.slice(0, 17) + '\\u2026' : t.des) + '</i>' : '') + '</span>'\n          + (t.access ? '' : '<small class=\"ch-acc\">No app access yet' + (t.sid ? ' · <a href=\"#\" onclick=\"chat1400.giveAccess(' + Number(t.sid) + ');return false\">Give app access</a>' : '') + '</small>') + '</span>';\n        if(t.off) return '<div class=\"ch-rd ch-rd2\">' + who + '<span class=\"ch-note\" style=\"padding:0\">In Team Chat is unticked in their staff record (Teachers)</span></div>';\n        return '<div class=\"ch-rd ch-rd2\">' + who + (st && t.in ? '<span class=\"ch-note\" style=\"padding:0\">Direct chat with management only</span>' : '') + (!st && t.in && GL.length ?"
],
[
"aria-label=\"Groups for Teacher ' + esc(t.name) + '\"",
"aria-label=\"Groups for ' + esc(t.name) + '\""
],
[
"(t.in ? 'Remove from all' : 'Add') + '</button></div>'; };",
"(t.in ? (st ? 'Remove' : 'Remove from all') : 'Add') + '</button></div>'; };"
],
[
"Tap a group to add or remove a teacher there only (for example Time-in only). Remove from all takes them out of every group and their chat with management. Past messages stay in the history.",
"Teachers: tap a group to add or remove them there only (for example Time-in only). Remove from all takes them out of every group and their chat with management. Staff who don\\'t teach are not in the teacher groups; they only have a direct chat with management. Past messages stay in the history."
],
[
"toast2((on ? 'Added Teacher ' + n + ' to ' : 'Removed Teacher ' + n + ' from ') + g.name);",
"toast2((on ? 'Added ' : 'Removed ') + (S.rk && S.rk[n] === 'staff' ? '' : 'Teacher ') + n + (on ? ' to ' : ' from ') + g.name);"
],
[
"toast2((on ? 'Added ' : 'Removed ') + 'Teacher ' + n);",
"toast2((on ? 'Added ' : 'Removed ') + (S.rk && S.rk[n] === 'staff' ? '' : 'Teacher ') + n);"
],
[
"    noimg: function(i){",
"    giveAccess: function(id){ try{ closeSheet(); }catch(e){} if(typeof go === 'function') go('teachers'); var t0 = Date.now();   /* 1451: the existing Give app access form (Teachers) */\n      (function w(){ if(window.AS40 && AS40.L && typeof AS40.access === 'function'){ AS40.access(id); return; } if(Date.now() - t0 < 8000) setTimeout(w, 250); else toast2('Open Teachers and tap Give app access'); })(); },\n    noimg: function(i){"
],
[
"const row = p => { const r = p.rows.filter(on).concat(p.rows.filter(x => !on(x)))[0], t = p.mode === 'mgmt' ? 'Management' : 'Teacher';",
"const row = p => { const r = p.rows.filter(on).concat(p.rows.filter(x => !on(x)))[0], t = (window.chatChip1451 && chatChip1451(p.name, p.mode === 'mgmt')) || (p.mode === 'mgmt' ? 'Management' : 'Teacher');"
],
[
"</body>\n</html>",
"<style id=\"css1451\">\n/* 1451 · team · designation chips (display only) */\n.ch-tag.ch-km,.ch-tag.ch-kt,.ch-tag.ch-ks{display:inline-flex;align-items:baseline;max-width:190px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;font-size:11px;line-height:16px;padding:0 7px;border-radius:999px;margin:0 0 0 6px;font-style:normal;vertical-align:1px}\n.ch-tag.ch-km{background:#F1ECFA!important;color:#5B3FA6!important}.ch-tag.ch-kt{background:#E6F4F3!important;color:#0B6867!important}.ch-tag.ch-ks{background:#EEEFF2!important;color:#4A4F5C!important}\n.ch-tag.ch-km b,.ch-tag.ch-kt b,.ch-tag.ch-ks b{font-weight:700}\n.ch-tag.ch-km i,.ch-tag.ch-kt i,.ch-tag.ch-ks i{font-style:normal;color:#5E6272!important;font-weight:500;overflow:hidden;text-overflow:ellipsis}\n#v-chat .ch-g .nm{flex:0 1 auto;min-width:3.5em}#v-chat .ch-g .ch-tag{margin-left:auto;margin-right:4px;flex:none}#v-chat .ch-g .ch-tag i{display:none}\n#v-chat .ch-mi .nm{flex:0 0 auto;max-width:55%}#v-chat .ch-mi .ch-tag{flex:0 1 auto;min-width:0}\n.ch-rd2 .nm{display:flex;flex-wrap:wrap;align-items:center;gap:2px 0;min-width:0;flex:1 1 220px}\n.ch-acc{flex-basis:100%;color:#9B5A14;font-size:12.5px;font-weight:500}.ch-acc a{color:#0E7C7B;font-weight:600;text-decoration:underline}\n.onl-it .ch-tag{margin-left:4px}\n@media (max-width:640px){.ch-tag.ch-km i,.ch-tag.ch-kt i,.ch-tag.ch-ks i{display:none}.ch-tag.ch-km,.ch-tag.ch-kt,.ch-tag.ch-ks{max-width:110px}}\n</style>\n</body>\n</html>"
]
]);
