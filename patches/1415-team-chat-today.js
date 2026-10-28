// 1415: (Misty 23:27) Team Chat items on the teacher's Today: open Needs reply / @name / Confirm (server coe-chat v11 todo) as one To do
//   line each, tap opens it in its chat; cleared when answered; no extra sound or alert; not redrawn while a class is running.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
[
"if(window.ncTodo) { try { ncTodo().forEach(x => todo.push(x)); } catch(e) {} }",
"if(window.ncTodo) { try { ncTodo().forEach(x => todo.push(x)); } catch(e) {} }\nif(window.chatTodo1415) { try { chatTodo1415().forEach(x => todo.unshift(x)); } catch(e) {} }"
],
[
"      paintHdr(); if(open && ch) load(true); else if(open) paintSide(); }catch(e){} }",
"      S.inCl = !!r.inClass; if(!isMgr() && (ch || !S.todoAt || Date.now() - S.todoAt > 60000)) fetchTodo(); else if(!S.inCl && S.todoLater) refreshToday();\n      paintHdr(); if(open && ch) load(true); else if(open) paintSide(); }catch(e){} }"
],
[
"      if(!S.gid) S.gid = (r.groups[0] || {}).id || 'all'; if(VIEW === 'chat') load(); paintHdr(); }catch(e){} }",
"      if(!S.gid) S.gid = (r.groups[0] || {}).id || 'all'; if(VIEW === 'chat') load(); paintHdr(); fetchTodo(); }catch(e){} }\n  /* 1415 (Misty 23:27): open Team Chat items on the teacher's Today · one To do line each (\"Reply to CupOfEnglish in Team Chat\",\n     \"Confirm Celine's message in Team Chat\"), tap opens the message in its chat. Cleared as soon as it is answered (the server marks\n     replies and confirmations). No sound and no phone alert of its own (the chat alert already went out); while a class is running the\n     list is not redrawn, it updates when the class ends. */\n  S.todoSig = '[]';\n  async function fetchTodo(){ if(!S.on || !hasD() || isMgr()) return; S.todoAt = Date.now();\n    try{ var r = await post('todo'); if(!r || !r.ok || !Array.isArray(r.items)) return; S.todo = r.items; var sig = JSON.stringify(r.items.map(function(x){ return x.kind + x.id; }));\n      if(sig !== S.todoSig){ S.todoSig = sig; S.todoLater = 1; refreshToday(); } }catch(e){} }\n  function refreshToday(){ if(!S.todoLater) return; if(typeof VIEW === 'undefined' || VIEW !== 'today' || typeof renderToday !== 'function'){ S.todoLater = 0; return; }\n    var sh = document.getElementById('sheet'); if(S.inCl) return; if(sh && sh.classList.contains('on')){ clearTimeout(S.todoT); S.todoT = setTimeout(refreshToday, 3000); return; } S.todoLater = 0; try{ renderToday(); }catch(e){} }\n  window.chatTodo1415 = function(){ if(!S.todo || !S.todo.length || isMgr()) return [];\n    return S.todo.map(function(x){ var who = disp(x.author), where = x.gid.indexOf('dm:') === 0 ? 'Team Chat' : 'Team Chat · ' + x.chat;\n      var t = x.kind === 'confirm' ? 'Confirm ' + who + '\\u2019s message in ' + where : 'Reply to ' + who + ' in ' + where;\n      return '<div class=\"li\" onclick=\"chat1400.todoGo(\\'' + esc(x.gid) + '\\',\\'' + esc(x.day) + '\\',' + Number(x.id) + ')\"><span class=\"chip coral\">Team Chat</span><div class=\"grow\" style=\"min-width:0\"><div class=\"ell\"><b>' + esc(t) + '</b></div><div class=\"small mute ell\">' + esc(x.body || '') + (x.by ? ' · by ' + esc(tm(x.by)) : '') + '</div></div><span class=\"mute\">\\u203a</span></div>'; }); };"
],
[
"    jump: function(g, d, id){",
"    todoGo: function(g, d, id){ if(typeof go === 'function') go('chat'); setTimeout(function(){ A.jump(g, d, id); }, 0); },\n    jump: function(g, d, id){"
],
[
"var r = await post('confirm', { id: id }).catch(function(){ return null; }); if(r && r.ok) load(true);",
"var r = await post('confirm', { id: id }).catch(function(){ return null; }); if(r && r.ok){ load(true); fetchTodo(); }"
]
]);
