// 1413: (Misty 23:27) Team Chat · Manage members per group (e.g. Time-in only) next to the all-groups Add / Remove. Server (coe-chat v11)
//   keeps the list in sys:chat gx and checks it on every action (list, send, history, search, mute, alerts).
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
[
"      var row = function(t){ return '<div class=\"ch-rd\"><span>Teacher ' + esc(t.name) + '</span><button type=\"button\" class=\"ch-b sm' + (t.in ? '' : ' pri') + '\" onclick=\"chat1400.memberSet(\\'' + esc(t.name) + '\\',' + (t.in ? 0 : 1) + ')\">' + (t.in ? 'Remove' : 'Add') + '</button></div>'; };",
"      /* 1413: per group (e.g. Time-in only) next to the all-groups Add / Remove; the server checks every action */\n      var GL = r.groups || [], row = function(t){ var gs = t.groups || GL.map(function(g){ return g.id; });\n        return '<div class=\"ch-rd ch-rd2\"><span class=\"nm\">Teacher ' + esc(t.name) + '</span>' + (t.in && GL.length ? '<span class=\"ch-gsw\" role=\"group\" aria-label=\"Groups for Teacher ' + esc(t.name) + '\">' + GL.map(function(g){ var on = gs.indexOf(g.id) > -1;\n          return '<button type=\"button\" class=\"ch-gt' + (on ? ' on' : '') + '\" aria-pressed=\"' + on + '\" title=\"' + (on ? 'In ' : 'Not in ') + esc(g.name) + ' · tap to ' + (on ? 'remove' : 'add') + '\" onclick=\"chat1400.groupSet(\\'' + esc(t.name) + '\\',\\'' + esc(g.id) + '\\',' + (on ? 0 : 1) + ',this)\">' + (on ? '<svg viewBox=\"0 0 24 24\" width=\"13\" height=\"13\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.6\" stroke-linecap=\"round\" aria-hidden=\"true\"><path d=\"M5 12.5l4.5 4.5L19 7.5\"/></svg>' : '') + esc(g.name) + '</button>'; }).join('') + '</span>' : '')\n          + '<button type=\"button\" class=\"ch-b sm' + (t.in ? '' : ' pri') + '\" onclick=\"chat1400.memberSet(\\'' + esc(t.name) + '\\',' + (t.in ? 0 : 1) + ')\">' + (t.in ? 'Remove from all' : 'Add') + '</button></div>'; };"
],
[
"Adding or removing applies to every group and to the teacher\\'s chat with management. Past messages stay in the history.",
"Tap a group to add or remove a teacher there only (for example Time-in only). Remove from all takes them out of every group and their chat with management. Past messages stay in the history."
],
[
"    memberSet: async function(n, on){",
"    groupSet: async function(n, gid, on, el){ if(el){ el.disabled = true; el.classList.toggle('on', !!on); el.setAttribute('aria-pressed', String(!!on)); }\n      var r = await post('member', { name: n, gid: gid, on: !!on }).catch(function(){ return null; });\n      if(!r || !r.ok){ toast2((r && r.error) || 'Not saved · check the internet and try again'); A.roster(); return; }\n      var g = (r.groups || []).find(function(x){ return x.id === gid; }) || { name: gid }; toast2((on ? 'Added Teacher ' + n + ' to ' : 'Removed Teacher ' + n + ' from ') + g.name); A.roster(); load(true); },\n    memberSet: async function(n, on){"
],
[
"</body>\n</html>",
"<style id=\"css1413\">\n/* 1413 · Manage members: per-group toggles */\n.ch-rd2{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:8px 0}\n.ch-rd2 .nm{flex:1 1 140px;min-width:120px;font-weight:600}\n.ch-gsw{display:flex;gap:6px;flex-wrap:wrap}\n.ch-gt{display:inline-flex;align-items:center;gap:4px;min-height:32px;padding:0 10px;border:1px solid #DCE1E6;border-radius:999px;background:#fff;color:#5E6272;font:600 12.5px Inter,system-ui,sans-serif;cursor:pointer}\n.ch-gt.on{background:#E6F3F2;border-color:#9FCFCB;color:#0B5F63}\n.ch-gt:disabled{opacity:.6;cursor:progress}\n.ch-gt:focus-visible{outline:2px solid #0B5F63;outline-offset:2px}\n</style>\n</body>\n</html>"
]
]);
