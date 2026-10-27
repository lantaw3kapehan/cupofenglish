// 1404: (Misty, 20:06 brief + 20:12 + 20:24) Team Chat clarity: the side panel shows who is in THIS chat ("In this chat · N people can read this
//   chat"); one-line description under each conversation (and "Formal requests, leave and notices stay in Messages"); Reply hidden where teachers
//   can't post (Time-in, Announcements) with a clear note; "Back to Today" from History/Search, "View history" on an empty day; labelled search
//   (Keyword, Person, From date, To date) with scope, Clear filters, result count, helpful no-results; members panel collapsible on laptop too;
//   composer: Send disabled when empty, Enter / Shift+Enter hint, a draft per conversation, Sending / Not sent + Retry (never posts twice),
//   picture preview, voice preview with Send / Cancel; "New messages below" instead of pulling you down while you read older messages.
//   Management: "Manage members" (add / remove a teacher from Team Chat; logged as a line in All Teachers).
//   Privacy (20:24): teachers see names only (no online / in class / last seen), "Seen by N" only on their own messages, no per-person lists.
//   Retention text: "kept in CupOfEnglish's database; nothing is deleted by the app".
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
[
"else if(S.view === 'search'){ var Q = S.q || {}; mid = '<div class=\"ch-srch\"><input id=\"chQ\" placeholder=\"Word\" value=\"' + esc(Q.q || '') + '\" style=\"flex:1 1 160px\" aria-label=\"Search word\"><select id=\"chQw\" aria-label=\"Person\"><option value=\"\">Anyone</option>' + (S.init.members || []).map(function(m){ return '<option' + (Q.who === m.name ? ' selected' : '') + ' value=\"' + esc(m.name) + '\">' + esc(disp(m.name)) + '</option>'; }).join('') + '</select><input type=\"date\" id=\"chQf\" aria-label=\"From\" value=\"' + esc(Q.from || '') + '\"><input type=\"date\" id=\"chQt\" aria-label=\"To\" value=\"' + esc(Q.to || '') + '\"><button type=\"button\" class=\"ch-b pri\" onclick=\"chat1400.find()\">Search</button></div>'\n      + '<div class=\"ch-list\">' + (S.res ? (S.res.length ? S.res.map(function(m){ var gg = (S.init.groups || []).find(function(x){ return x.id === m.gid; }) || {}; return '<button type=\"button\" class=\"ch-g\" style=\"align-items:flex-start\" onclick=\"chat1400.jump(\\'' + esc(m.gid) + '\\',\\'' + m.day + '\\',' + m.id + ')\"><span style=\"min-width:0\"><b>' + esc(disp(m.author)) + '</b> · ' + esc(gg.name || '') + ' · ' + esc(dayName(m.day)) + ' ' + tm(m.at) + '<br><span style=\"color:#5E6272\">' + esc(String(m.body || 'Picture').slice(0, 140)) + '</span></span></button>'; }).join('') : '<div class=\"ch-empty\">Nothing found.</div>') : '<div class=\"ch-empty\">Search every message ever posted, by word, person and date.</div>') + '</div>'; }\n",
"else if(S.view === 'search'){ var Q = S.q || {}, lab = function(f, t, h){ return '<label class=\"ch-fl\" for=\"' + f + '\"><span>' + t + '</span>' + h + '</label>'; };\n      mid = '<div class=\"ch-srch\">' + lab('chQ', 'Keyword', '<input id=\"chQ\" placeholder=\"e.g. homework\" value=\"' + esc(Q.q || '') + '\" onkeydown=\"if(event.key===\\'Enter\\')chat1400.find()\">')\n        + lab('chQw', 'Person', '<select id=\"chQw\"><option value=\"\">Anyone</option>' + (S.init.members || []).map(function(m){ return '<option' + (Q.who === m.name ? ' selected' : '') + ' value=\"' + esc(m.name) + '\">' + esc(disp(m.name)) + '</option>'; }).join('') + '</select>')\n        + lab('chQf', 'From date', '<input type=\"date\" id=\"chQf\" value=\"' + esc(Q.from || '') + '\">') + lab('chQt', 'To date', '<input type=\"date\" id=\"chQt\" value=\"' + esc(Q.to || '') + '\">')\n        + '<div class=\"ch-fa\"><button type=\"button\" class=\"ch-b pri\" onclick=\"chat1400.find()\">Search</button><button type=\"button\" class=\"ch-b\" onclick=\"chat1400.clearQ()\">Clear filters</button></div>'\n        + '<div class=\"ch-note\" style=\"flex-basis:100%;padding:0\">Searches every chat you are in, all days. Open a result to see it in its conversation.</div></div>'\n        + '<div class=\"ch-list\" role=\"region\" aria-live=\"polite\">' + (S.res ? (S.res.length ? '<div class=\"ch-note\" style=\"padding:0 0 6px\">' + S.res.length + (S.res.length >= 60 ? '+ ' : ' ') + 'result' + (S.res.length === 1 ? '' : 's') + (S.res.length >= 60 ? ' · showing the newest 60, narrow the dates to see more' : '') + '</div>' + S.res.map(function(m){ var gg = (S.init.groups || []).find(function(x){ return x.id === m.gid; }) || {}; return '<button type=\"button\" class=\"ch-g ch-res\" onclick=\"chat1400.jump(\\'' + esc(m.gid) + '\\',\\'' + m.day + '\\',' + m.id + ')\"><span style=\"min-width:0\"><b>' + esc(disp(m.author)) + '</b> · ' + esc(gg.name || '') + ' · ' + esc(dayName(m.day)) + ' ' + tm(m.at) + '<br><span style=\"color:#5E6272\">' + esc(String(m.body || (m.kind === 'voice' ? 'Voice message' : 'Picture')).slice(0, 140)) + '</span></span><small>Open</small></button>'; }).join('') : '<div class=\"ch-empty\">No messages match' + (Q.q ? ' \"' + esc(Q.q) + '\"' : '') + (Q.who ? ' from ' + esc(disp(Q.who)) : '') + (Q.from || Q.to ? ' in those dates' : '') + '.<br>Try fewer words, another person, or wider dates.</div>') : '<div class=\"ch-empty\">Search messages by keyword, person and date.</div>') + '</div>'; }\n"
],
[
"    noimg: function(){",
"    clearQ: function(){ S.q = {}; S.res = null; render(); },\n    toBottom: function(){ var L = document.getElementById('chList'); if(L) L.scrollTop = L.scrollHeight; S.newBelow = false; var nb = document.getElementById('chNewB'); if(nb) nb.remove(); },\n    sendVoice: function(){ var v = S.voice; S.voice = null; A.send(v); },\n    noVoice: function(){ S.voice = null; render(true); },\n    retry: function(id){ var m = S.data && S.data.msgs.find(function(x){ return x.id === id; }); if(!m) return; S.data.msgs.splice(S.data.msgs.indexOf(m), 1); var t = document.getElementById('chTx'); if(t){ t.value = m.body; } S.cid = m.cid; render(true); A.send(); },\n    roster: async function(){ var r = await post('roster'); if(!r || !r.ok || typeof openSheet !== 'function'){ toast2((r && r.error) || 'Could not load the team'); return; } var ins = r.teachers.filter(function(t){ return t.in; }), outs = r.teachers.filter(function(t){ return !t.in; });\n      var row = function(t){ return '<div class=\"ch-rd\"><span>Teacher ' + esc(t.name) + '</span><button type=\"button\" class=\"ch-b sm' + (t.in ? '' : ' pri') + '\" onclick=\"chat1400.memberSet(\\'' + esc(t.name) + '\\',' + (t.in ? 0 : 1) + ')\">' + (t.in ? 'Remove' : 'Add') + '</button></div>'; };\n      openSheet('<h2 style=\"font-family:\\'Fredoka One\\',sans-serif;font-weight:400;margin:0 0 4px\">Team Chat members</h2><div style=\"color:#5E6272;font-size:13px;margin-bottom:10px\">Adding or removing applies to every group and to the teacher\\'s chat with management. Past messages stay in the history.</div><div class=\"ch-sec\" style=\"padding-left:0\">IN TEAM CHAT · ' + ins.length + '</div>' + ins.map(row).join('') + '<div class=\"ch-sec\" style=\"padding-left:0;margin-top:10px\">NOT IN TEAM CHAT · ' + outs.length + '</div>' + (outs.map(row).join('') || '<div class=\"ch-note\">Everyone is in.</div>')); },\n    memberSet: async function(n, on){ var r = await post('member', { name: n, on: !!on }); if(!r || !r.ok){ toast2((r && r.error) || 'Not saved'); return; } toast2((on ? 'Added ' : 'Removed ') + 'Teacher ' + n); var i0 = await post('init'); if(i0 && i0.ok && !i0.off){ S.init = i0; } S.mem = null; A.members(); A.roster(); load(true); },\n    noimg: function(){"
],
[
"reply: function(id){",
"reply: function(id){ if(id && !isMgr() && (S.gid === 'timein' || S.gid === 'ann')){ toast2(S.gid === 'ann' ? 'Answer announcements with the buttons under them' : 'Replies are off in Time-in · write in All Teachers or Management'); return; }"
],
[
"tl += '<button type=\"button\" class=\"ch-tb\" aria-label=\"Reply\"",
"if(M || (S.gid !== 'timein' && S.gid !== 'ann')) tl += '<button type=\"button\" class=\"ch-tb\" aria-label=\"Reply\""
],
[
"function msgHtml(m, byId, pv){",
"function msgHtml(m, byId, pv){ if(m.kind === 'system') return '<div class=\"ch-sys\">' + esc(m.body) + ' · ' + tm(m.at) + '</div>';"
],
[
"function memHtml(){ var L = S.mem || (S.init.members || []).map(function(m){ return { name: m.name, mgmt: m.mgmt }; });",
"function memHtml(){ var L = S.mem || (S.init.members || []).map(function(m){ return { name: m.name, mgmt: m.mgmt }; }); var P = S.data && S.data.members; if(P && S.view === 'chat'){ var ps = P.map(function(x){ return String(x).toLowerCase(); }); L = L.filter(function(m){ return ps.indexOf(String(m.name).toLowerCase()) > -1; }); }"
],
[
"return '<h2>Members</h2>' + sec(",
"if(!isMgr()) return '<h2>In this chat</h2><div class=\"ch-note\" style=\"padding:0 0 4px\">' + L.length + ' people can read this chat</div>' + L.map(function(m){ return '<div class=\"ch-mi\"><span class=\"nm\">' + esc(disp(m.name).replace(/^Teacher /, '')) + '</span>' + (m.mgmt ? '<span class=\"ch-tag\">Management</span>' : '') + '</div>'; }).join('');\n    return '<h2>In this chat</h2><div class=\"ch-note\" style=\"padding:0 0 4px\">' + L.length + ' people can read this chat</div>' + (isMgr() ? '<button type=\"button\" class=\"ch-b sm\" style=\"margin:4px 0 2px\" onclick=\"chat1400.roster()\">Manage members</button>' : '') + sec("
],
[
"  function render(quiet){ var R = root();",
"  var DESC = { all: 'Everyday team talk with every teacher and management.', timein: 'Time-in cards post here by themselves. Management checks them.', ann: 'Official notices from management. Answer with the buttons under each one.', subs: 'Ask for or offer a substitute class.' };\n  function chanDesc(){ var t = S.gid && S.gid.indexOf('dm:') === 0 ? (isMgr() ? 'Private chat with this teacher. Only management and the teacher can read it.' : 'Private chat between you and management.') : (DESC[S.gid] || '');\n    return '<div class=\"ch-desc\">' + esc(t) + ' <span>Formal requests, leave and notices stay in Messages.</span></div>'; }\n  function syncSend(){ var b = document.getElementById('chSend'), t = document.getElementById('chTx'); if(b) b.disabled = !((t && t.value.trim()) || S.img); }\n  var PH = function(){ return /Mobi|Android|iPhone/i.test(navigator.userAgent) ? 'Message · @ to tag' : 'Message · Enter sends · Shift+Enter new line · @ to tag'; };\n  function render(quiet){ var R = root();"
],
[
"mid = pin + op + '<div class=\"ch-list\" id=\"chList\">'",
"mid = chanDesc() + pin + op + '<div class=\"ch-list\" id=\"chList\">'"
],
[
"No earlier days yet. Everything posted stays here for good.",
"No earlier days yet. Messages are kept in CupOfEnglish\\'s database; nothing is deleted by the app."
],
[
"'No messages today yet.'",
"'No messages today yet. <button type=\"button\" class=\"ch-b sm\" onclick=\"chat1400.hist()\">View history</button>'"
],
[
"' online' : '') + '</small></div>'",
"' online' : '') + '</small></div>' + (S.view !== 'chat' || (S.day && S.day !== S.init.today) ? '<button type=\"button\" class=\"ch-b pri\" onclick=\"chat1400.today()\">Back to Today</button>' : '')"
],
[
"S.memOpen = !S.memOpen; render(true); },",
"if(window.innerWidth >= 1280){ S.memHide = !S.memHide; try{ localStorage.setItem('coe.chatMem', S.memHide ? '0' : '1'); }catch(e){} } else S.memOpen = !S.memOpen; render(true); },"
],
[
"var cls = 'ch' + (S.ph === 'conv' ? ' conv' : '') + (S.memOpen ? ' mem' : '');",
"if(S.memHide === undefined){ try{ S.memHide = localStorage.getItem('coe.chatMem') === '0'; }catch(e){ S.memHide = false; } }\n    if(quiet && keep >= 60 && d && S.lastN && d.msgs.length > S.lastN && S.lastG === S.gid) S.newBelow = true; S.lastN = d ? d.msgs.length : 0; S.lastG = S.gid;\n    var cls = 'ch' + (S.ph === 'conv' ? ' conv' : '') + (S.memOpen ? ' mem' : '') + (S.memHide ? ' nomem' : '');"
],
[
"'</div><div class=\"ch-main\">' + head + mid + '</div>",
"'</div><div class=\"ch-main\">' + head + mid + (S.newBelow && S.view === 'chat' ? '<button type=\"button\" id=\"chNewB\" class=\"ch-newb\" onclick=\"chat1400.toBottom()\">New messages below</button>' : '') + '</div>"
],
[
"var t2 = document.getElementById('chTx'); if(t2 && draft){ t2.value = draft; }",
"var t2 = document.getElementById('chTx'); if(t2){ if(S.restore){ t2.value = (S.drafts || {})[S.gid] || ''; S.restore = 0; } else if(draft) t2.value = draft; } syncSend(); if(L2) L2.onscroll = function(){ if(S.newBelow && L2.scrollHeight - L2.scrollTop - L2.clientHeight < 60){ S.newBelow = false; var nb = document.getElementById('chNewB'); if(nb) nb.remove(); } };"
],
[
"    open: function(g){ S.gid = g;",
"    open: function(g){ var tx0 = document.getElementById('chTx'); S.drafts = S.drafts || {}; if(tx0) S.drafts[S.gid] = tx0.value; S.restore = 1; S.newBelow = false; S.lastN = 0; S.voice = null; S.gid = g;"
],
[
"typing: function(t){ t.style.height = 'auto';",
"typing: function(t){ syncSend(); t.style.height = 'auto';"
],
[
"placeholder=\"Message · type @ to tag\"",
"placeholder=\"' + PH() + '\""
],
[
"'<button type=\"button\" class=\"ch-ib pri\" aria-label=\"Send\" onclick=\"chat1400.send()\">'",
"'<button type=\"button\" class=\"ch-ib pri\" id=\"chSend\" aria-label=\"Send\" title=\"Send\"' + (S.img ? '' : ' disabled') + ' onclick=\"chat1400.send()\">'"
],
[
"var im = S.img ? '<div class=\"ch-q\" style=\"margin-bottom:6px\">Picture ready (",
"var vo = S.voice ? '<div class=\"ch-q ch-vo\"><audio controls src=\"' + S.voice + '\"></audio><button type=\"button\" class=\"ch-b sm pri\" onclick=\"chat1400.sendVoice()\">Send voice</button><button type=\"button\" class=\"ch-b sm\" onclick=\"chat1400.noVoice()\">Cancel</button></div>' : '';\n    var im = S.img ? '<div class=\"ch-q\" style=\"margin-bottom:6px;display:flex;align-items:center;gap:8px\"><img src=\"' + S.img + '\" alt=\"Picture to send\" style=\"height:56px;border-radius:8px\">Picture ready ("
],
[
"return '<div class=\"ch-cmp\">' + opts + rp + im +",
"return '<div class=\"ch-cmp\">' + opts + rp + im + vo +"
],
[
"fr.onload = function(){ A.send(String(fr.result)); };",
"fr.onload = function(){ S.voice = String(fr.result); render(true); };"
],
[
"var tmp = { id: -Date.now(),",
"var cid = S.cid || (Date.now().toString(36) + Math.random().toString(36).slice(2, 6)); S.cid = null; var tmp = { cid: cid, id: -Date.now(),"
],
[
"voice: voice || null, parent_id: rt ? rt.id : null });",
"voice: voice || null, parent_id: rt ? rt.id : null, cid: cid });"
],
[
"else { if(S.data){ var k = S.data.msgs.indexOf(tmp); if(k > -1) S.data.msgs.splice(k, 1); } render(true); var t3 = document.getElementById('chTx'); if(t3 && v) t3.value = v; toast2(",
"else { tmp.pending = 0; tmp.failed = 1; render(true); toast2("
],
[
"catch(e){ if(S.data){ var k2 = S.data.msgs.indexOf(tmp); if(k2 > -1) S.data.msgs.splice(k2, 1); } render(true); var t4 = document.getElementById('chTx'); if(t4 && v) t4.value = v; toast2(",
"catch(e){ tmp.pending = 0; tmp.failed = 1; render(true); toast2("
],
[
"if(m.pending) ft += '<span>Sending…</span>';",
"if(m.pending) ft += '<span>Sending…</span>'; if(m.failed) ft += '<span style=\"color:#9B2C1F;font-weight:600\">Not sent</span>' + (m.kind === 'text' ? '<button type=\"button\" class=\"ch-chip\" onclick=\"chat1400.retry(' + m.id + ')\">Retry</button>' : '');"
],
[
"' · ' + m.replied + ' of ' + m.n + ' replied</span>';",
"(m.n ? ' · ' + m.replied + ' of ' + m.n + ' replied' : (m.mine && m.mine.replied ? ' · you replied' : '')) + '</span>';"
],
[
"'\">' + m.confirmed + ' of ' + m.n + ' confirmed</span>';",
"'\">' + (m.n ? m.confirmed + ' of ' + m.n + ' confirmed' : (m.mine && m.mine.confirmed ? 'You confirmed' : 'Please confirm')) + '</span>';"
],
[
"if(m.n) ft += '<button type=\"button\" class=\"ch-chip seen\" onclick=\"chat1400.readers(' + m.id + ')\">' + I.eye.replace('<svg', '<svg width=\"13\" height=\"13\" style=\"vertical-align:-2px\"') + ' Seen by ' + m.seen + ' of ' + m.n + '</button>';",
"if(m.n) ft += isMgr() ? '<button type=\"button\" class=\"ch-chip seen\" onclick=\"chat1400.readers(' + m.id + ')\">' + I.eye.replace('<svg', '<svg width=\"13\" height=\"13\" style=\"vertical-align:-2px\"') + ' Seen by ' + m.seen + ' of ' + m.n + '</button>' : '<span class=\"ch-chip seen\">' + I.eye.replace('<svg', '<svg width=\"13\" height=\"13\" style=\"vertical-align:-2px\"') + ' Seen by ' + m.seen + '</span>';"
],
[
"' members' + (S.mem ? ' · '",
"' members' + (S.mem && isMgr() ? ' · '"
],
[
"</body>\n</html>",
"<style>\n/* 1404 · Team Chat clarity (Misty 20:06) */\n#v-chat .ch-desc{padding:7px 18px;border-bottom:1px solid #EEF0F3;font-size:13px;color:#4F5465;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-height:34px;box-sizing:border-box}\n#v-chat .ch-desc span{color:#8A8F9C}\n#v-chat .ch-sys{align-self:center;margin:10px 0;font-size:12.5px;color:#6A6F7E;background:#F4F6F7;border-radius:999px;padding:4px 12px}\n#v-chat .ch-srch{align-items:flex-end;gap:10px}\n#v-chat .ch-fl{display:flex;flex-direction:column;gap:4px;font-size:12px;font-weight:600;color:#4F5465;flex:1 1 140px;min-width:120px}\n#v-chat .ch-fl input,#v-chat .ch-fl select{height:40px;font:14px Inter,system-ui,sans-serif}\n#v-chat .ch-fa{display:flex;gap:6px}\n#v-chat .ch-res{align-items:flex-start;border-bottom:1px solid #F0F1F4;border-radius:0}\n#v-chat .ch-res small{margin-left:auto;color:#00737B;font-weight:600;font-size:12.5px}\n#v-chat .ch-main{position:relative}\n#v-chat .ch-newb{position:absolute;left:50%;transform:translateX(-50%);bottom:132px;z-index:4;border:0;border-radius:999px;background:#5B4B9A;color:#fff;font:600 13px Inter,system-ui,sans-serif;padding:9px 16px;box-shadow:0 6px 18px rgba(0,0,0,.16);cursor:pointer}\n#v-chat .ch-vo{display:flex;align-items:center;gap:8px;margin-bottom:6px}#v-chat .ch-vo audio{height:36px;max-width:240px}\n#v-chat .ch-ib.pri:disabled{background:#B9C7C8;cursor:not-allowed}\n#v-chat .ch-memb{display:inline-flex}\n@media(min-width:1280px){#v-chat .ch.nomem{grid-template-columns:260px minmax(0,1fr)}#v-chat .ch.nomem .ch-mem{display:none}}\n#v-chat button:focus-visible,#v-chat textarea:focus-visible,#v-chat input:focus-visible,#v-chat select:focus-visible{outline:2px solid #5B4B9A;outline-offset:2px}\n@media(max-width:700px){#v-chat .ch-desc{white-space:normal;font-size:12.5px;padding:6px 10px}#v-chat .ch-desc span{display:none}#v-chat .ch-newb{bottom:110px}}\n</style>\n</body>\n</html>"
]
]);
