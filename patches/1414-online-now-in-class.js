// 1414: (Misty 23:27) management · Online now gets an "In class" section with the same rule as the Team Chat members list
//   (a class running now, from the database, with its end time); people in class are listed there instead of under Online / Earlier.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
[
"  setInterval(function(){ if(S.on && VIEW === 'chat') A.members(); }, 60000);",
"  /* 1414: management's Online now uses the same In class rule as the Team Chat members list (a class running now, from the database) */\n  window.chatMem1414 = async function(){ if(!S.on || !isMgr()) return null; await A.members(); return S.mem; };\n  window.chatInClass1414 = function(){ var o = {}; (S.mem || []).forEach(function(m){ if(m && m.inClass) o[String(m.name).toLowerCase()] = m; }); return o; };\n  setInterval(function(){ if(S.on && VIEW === 'chat') A.members(); }, 60000);"
],
[
"const [j] = await Promise.all([post('online'), pload()]);",
"const [j] = await Promise.all([post('online'), pload(), window.chatMem1414 ? chatMem1414().catch(() => null) : null]);"
],
[
"const P = people(), me = (D.me || {}).name || '', on1 = P.filter(p => p.on), off = P.filter(p => !p.on);",
"const P = people(), me = (D.me || {}).name || '', CL = window.chatInClass1414 ? chatInClass1414() : {}, inC = p => !!CL[String(p.name).toLowerCase()], on1 = P.filter(p => p.on && !inC(p)), off = P.filter(p => !p.on && !inC(p)),\n      cls = Object.keys(CL).sort().map(k => ({ m: CL[k], p: P.find(x => String(x.name).toLowerCase() === k) })),\n      crow = x => '<div class=\"onl-it\"><span class=\"d\" style=\"background:#D99A00\"></span><div style=\"flex:1\"><b>' + e(x.m.name) + '</b> <span class=\"mute small\">Teacher</span><small>In class' + (x.m.until ? ' · until ' + hm(x.m.until) : '') + (x.p && x.p.on ? ' · app open · ' + devL((x.p.rows.filter(on)[0] || x.p.rows[0]).dev) : '') + '</small></div></div>';"
],
[
"+ '<div style=\"margin-top:10px\">' + (on1.length ? on1.map(row).join('') : '<div class=\"small mute\" style=\"padding:10px 0\">No one right now.</div>') + '</div>'",
"+ '<div style=\"margin-top:10px\">' + (on1.length ? on1.map(row).join('') : '<div class=\"small mute\" style=\"padding:10px 0\">' + (cls.length ? 'No one else right now.' : 'No one right now.') + '</div>') + '</div>'\n      + (cls.length ? '<h2 style=\"font-size:15px;margin-top:16px\">In class · ' + cls.length + '</h2>' + cls.map(crow).join('') : '')"
]
]);
