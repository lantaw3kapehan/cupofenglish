// 1401: (Misty, 19:30–19:32) Team Chat for every teacher + "how we chat on the WeChat group":
//   alerts for every group message (several within a minute = one alert; Mute per group, tags still come through; quiet in class),
//   unread count on the Team Chat menu, opening a group jumps to the first unread ("New messages"), quote-reply (Reply button,
//   long-press on phone, right-click on laptop), your own message shows at once while it sends, scroll stays put when new messages
//   arrive while you read older ones, hold-to-record voice messages (up to 60 s). Management's own account shows as "Misty" (sys:chat alias).
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
[
"    send: async function(){ var t = document.getElementById('chTx'); if(!t || S.sending) return; var v = t.value.trim(); if(!v && !S.img) return;\n      var mem = (S.data && S.data.members) || [], men = []; (v.match(/@[A-Za-z]+/g) || []).forEach(function(x){ var n = x.slice(1); if(n.toLowerCase() === 'all') men.push('all'); else { var f = mem.find(function(m){ return m.toLowerCase() === n.toLowerCase(); }); if(f) men.push(f); } });\n      var by = null; if(S.opt.nr && S.opt.by){ var p = S.opt.by.split(':'); by = new Date(S.init.today + 'T' + ('0' + p[0]).slice(-2) + ':' + p[1] + ':00+08:00').toISOString(); }\n      S.sending = 1; try{ var r = await post('send', { gid: S.gid, body: v, mentions: men, needs_reply: !!S.opt.nr, reply_by: by, confirm: !!S.opt.cf, pin: !!S.opt.pin, img: S.img, parent_id: S.replyTo ? S.replyTo.id : null });\n        if(r && r.ok){ t.value = ''; S.img = null; S.replyTo = null; S.opt = {}; if(S.data){ S.data.msgs.push(r.msg); S.last = Math.max(S.last, r.msg.id); } render(); load(true); } else toast2((r && r.error) || 'Not sent · check the internet and try again'); }\n      catch(e){ toast2('Not sent · check the internet and try again'); } finally{ S.sending = 0; } },",
"    send: async function(voice){ var t = document.getElementById('chTx'); if(!t || S.sending) return; var v = voice ? '' : t.value.trim(); if(!v && !S.img && !voice) return;\n      var mem = (S.data && S.data.members) || [], men = []; (v.match(/@[A-Za-z]+/g) || []).forEach(function(x){ var n = x.slice(1); if(n.toLowerCase() === 'all') men.push('all'); else { var f = mem.find(function(m){ return m.toLowerCase() === n.toLowerCase() || String(AL()[m] || '').toLowerCase() === n.toLowerCase(); }); if(f) men.push(f); } });\n      var by = null; if(S.opt.nr && S.opt.by){ var p = S.opt.by.split(':'); by = new Date(S.init.today + 'T' + ('0' + p[0]).slice(-2) + ':' + p[1] + ':00+08:00').toISOString(); }\n      var img = voice ? null : S.img, rt = S.replyTo, op = S.opt;\n      var tmp = { id: -Date.now(), gid: S.gid, author: S.init.me, mgmt: isMgr(), kind: voice ? 'voice' : img ? 'image' : 'text', body: v, img: voice || img, at: new Date().toISOString(), n: 0, seen: 0, replied: 0, confirmed: 0, mentions: men, quote: rt ? { author: rt.author, body: rt.body } : null, pending: 1 };\n      if(S.data && (!S.day || S.day === S.init.today)) S.data.msgs.push(tmp); if(!voice){ t.value = ''; S.img = null; } S.replyTo = null; S.opt = {}; render();\n      S.sending = 1; try{ var r = await post('send', { gid: S.gid, body: v, mentions: men, needs_reply: !!op.nr, reply_by: by, confirm: !!op.cf, pin: !!op.pin, img: img, voice: voice || null, parent_id: rt ? rt.id : null });\n        if(r && r.ok){ if(S.data){ var ix = S.data.msgs.indexOf(tmp); if(ix > -1) S.data.msgs[ix] = r.msg; S.last = Math.max(S.last, r.msg.id); } render(true); load(true); }\n        else { if(S.data){ var k = S.data.msgs.indexOf(tmp); if(k > -1) S.data.msgs.splice(k, 1); } render(true); var t3 = document.getElementById('chTx'); if(t3 && v) t3.value = v; toast2((r && r.error) || 'Not sent · check the internet and try again'); } }\n      catch(e){ if(S.data){ var k2 = S.data.msgs.indexOf(tmp); if(k2 > -1) S.data.msgs.splice(k2, 1); } render(true); var t4 = document.getElementById('chTx'); if(t4 && v) t4.value = v; toast2('Not sent · check the internet and try again'); } finally{ S.sending = 0; } },\n    mute: async function(){ var M = S.init.muted || (S.init.muted = []), on = M.indexOf(S.gid) < 0; await post('mute', { gid: S.gid, on: on }); if(on) M.push(S.gid); else M.splice(M.indexOf(S.gid), 1); toast2(on ? 'Muted · you still get alerts when you are tagged' : 'Alerts on for this group'); render(true); },\n    lp: function(e, id){ clearTimeout(S.lpT); S.lpT = setTimeout(function(){ A.reply(id); }, 550); },\n    lpx: function(){ clearTimeout(S.lpT); },\n    rec: async function(e, on){ if(e && e.preventDefault) e.preventDefault(); var b = document.getElementById('chMic');\n      if(on){ if(S.recr) return; if(!window.MediaRecorder || !navigator.mediaDevices){ toast2('Voice messages are not supported in this browser'); return; }\n        try{ var st = await navigator.mediaDevices.getUserMedia({ audio: true }); var ty = ['audio/webm;codecs=opus', 'audio/mp4', 'audio/ogg'].find(function(x){ return MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(x); }) || '';\n          var R = new MediaRecorder(st, ty ? { mimeType: ty, audioBitsPerSecond: 32000 } : undefined), ch = [], t0 = Date.now(); S.recr = R;\n          R.ondataavailable = function(x){ if(x.data && x.data.size) ch.push(x.data); };\n          R.onstop = function(){ st.getTracks().forEach(function(x){ x.stop(); }); S.recr = null; if(b) b.classList.remove('rec'); var tx = document.getElementById('chTx'); if(tx) tx.placeholder = 'Message · type @ to tag';\n            if(Date.now() - t0 < 800 || !ch.length){ toast2('Hold the microphone to record'); return; } var bl = new Blob(ch, { type: (ch[0].type || ty || 'audio/webm').split(';')[0] }), fr = new FileReader(); fr.onload = function(){ A.send(String(fr.result)); }; fr.readAsDataURL(bl); };\n          R.start(); if(b) b.classList.add('rec'); var tx2 = document.getElementById('chTx'); if(tx2) tx2.placeholder = 'Recording… release to send (up to 60 s)'; S.recT = setTimeout(function(){ if(S.recr) S.recr.stop(); }, 60000); }\n        catch(err){ toast2('Microphone not allowed'); } }\n      else if(S.recr){ clearTimeout(S.recT); S.recr.stop(); } },"
],
[
"var disp = function(n){ var m = S.init",
"var AL = function(){ return (S.init && S.init.alias) || {}; };\n  var disp = function(n){ if(AL()[n]) return AL()[n]; var m = S.init"
],
[
"var mem = (S.init.members || []).map(function(x){ return x.name; }).concat(['All']);",
"var mem = (S.init.members || []).map(function(x){ return AL()[x.name] || x.name; }).concat(['All']);"
],
[
"var me = n.toLowerCase() === meLc() || n === 'All';",
"var me = n.toLowerCase() === meLc() || n === 'All' || n === AL()[S.init.me];"
],
[
"n.toLowerCase() !== meLc() && n.toLowerCase().indexOf(q) === 0",
"n.toLowerCase() !== meLc() && (AL()[n] || n).toLowerCase().indexOf(q) === 0"
],
[
"t.value = t.value.slice(0, a.at) + '@' + n + ' '",
"t.value = t.value.slice(0, a.at) + '@' + (AL()[n] || n) + ' '"
],
[
"t.value = '@' + S.replyTo.author + ' ';",
"t.value = '@' + (AL()[S.replyTo.author] || S.replyTo.author) + ' ';"
],
[
"esc(String(m.author).charAt(0))",
"esc(String(disp(m.author)).replace('Teacher ', '').charAt(0))"
],
[
"var par = m.parent_id && byId[m.parent_id]",
"var q0 = m.quote || (m.parent_id && byId[m.parent_id]); if(q0 && !m.quote) q0 = { author: q0.author, body: q0.body }; var par = q0 ? '<div class=\"ch-q\">' + esc(disp(q0.author)) + ': ' + esc(String(q0.body || 'Picture').slice(0, 90)) + '</div>' : ''; var par0 = m.parent_id && byId[m.parent_id]"
],
[
"if(m.img && !m.hidden) inner +=",
"if(m.kind === 'voice' && m.img && !m.hidden) inner = '<audio controls preload=\"none\" src=\"' + esc(m.img) + '\" style=\"max-width:100%\">Voice message</audio>'; else if(m.img && !m.hidden) inner +="
],
[
"if(!ro && !m.hidden){",
"if(m.pending) ft += '<span>Sending…</span>';\n    if(!ro && !m.hidden && !m.pending){"
],
[
"i.classList.toggle('hide', !unreadAll()); }",
"var un = unreadAll(); i.textContent = un > 99 ? '99+' : un ? String(un) : ''; i.classList.toggle('hide', !un); i.classList.add('chN'); }"
],
[
"if(r && r.ok && gid === S.gid){ S.data = r;",
"if(r && r.ok && gid === S.gid){ if(!quiet){ var fu = r.msgs.find(function(m){ return m.mine && !m.mine.seen; }); S.fu = fu && fu !== r.msgs[0] ? fu.id : (fu ? fu.id : 0); } S.data = r;"
],
[
"keep = L && quiet ? L.scrollHeight - L.scrollTop - L.clientHeight : 0,",
"keep = L && quiet ? L.scrollHeight - L.scrollTop - L.clientHeight : 0, top0 = L ? L.scrollTop : 0,"
],
[
"var L2 = R.querySelector('#chList'); if(L2){ L2.scrollTop = quiet ? L2.scrollHeight - L2.clientHeight - keep : L2.scrollHeight; }",
"var L2 = R.querySelector('#chList'); if(L2){ L2.scrollTop = quiet ? (keep < 60 ? L2.scrollHeight : top0) : L2.scrollHeight; if(S.fu && !quiet){ var fe = document.getElementById('chm' + S.fu); if(fe) L2.scrollTop = Math.max(0, fe.offsetTop - L2.offsetTop - 40); } }"
],
[
"return msgHtml(m, byId); }).join('')",
"return (S.fu && m.id === S.fu ? '<div class=\"ch-day\" style=\"background:#FDECEA;color:#9B2C1F\">New messages</div>' : '') + msgHtml(m, byId); }).join('')"
],
[
"'<button type=\"button\" class=\"ch-b' + (S.view === 'hist' ? ' on' : '') + '\" onclick=\"chat1400.hist()\">'",
"(S.gid !== 'ann' && S.view === 'chat' ? '<button type=\"button\" class=\"ch-b' + ((S.init.muted || []).indexOf(S.gid) > -1 ? ' on' : '') + '\" aria-pressed=\"' + ((S.init.muted || []).indexOf(S.gid) > -1) + '\" title=\"Mute alerts for this group (tags still come through)\" onclick=\"chat1400.mute()\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" aria-hidden=\"true\"><path d=\"M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9\"/><path d=\"M13.7 21a2 2 0 0 1-3.4 0\"/></svg><span>' + ((S.init.muted || []).indexOf(S.gid) > -1 ? 'Muted' : 'Mute') + '</span></button>' : '') + '<button type=\"button\" class=\"ch-b' + (S.view === 'hist' ? ' on' : '') + '\" onclick=\"chat1400.hist()\">'"
],
[
"'<button type=\"button\" class=\"ch-ib pri\" aria-label=\"Send\"",
"'<button type=\"button\" class=\"ch-ib\" id=\"chMic\" aria-label=\"Hold to record a voice message\" title=\"Hold to record\" onpointerdown=\"chat1400.rec(event,1)\" onpointerup=\"chat1400.rec(event,0)\" onpointerleave=\"chat1400.rec(event,0)\" oncontextmenu=\"return false\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" aria-hidden=\"true\"><rect x=\"9\" y=\"2\" width=\"6\" height=\"12\" rx=\"3\"/><path d=\"M5 10a7 7 0 0 0 14 0M12 19v3\"/></svg></button>' + '<button type=\"button\" class=\"ch-ib pri\" aria-label=\"Send\""
],
[
"return '<div class=\"ch-m\" id=\"chm' + m.id + '\">",
"return '<div class=\"ch-m\" id=\"chm' + m.id + '\"' + (m.id > 0 && !ro ? ' ontouchstart=\"chat1400.lp(event,' + m.id + ')\" ontouchend=\"chat1400.lpx()\" ontouchmove=\"chat1400.lpx()\" oncontextmenu=\"chat1400.reply(' + m.id + ');return false\"' : '') + '>"
],
[
".ch-dot{width:8px;",
".chN:not(.hide){position:static!important;min-width:18px;height:18px;width:auto!important;border-radius:9px!important;background:#C2410C!important;color:#fff;font:700 11px Inter,system-ui,sans-serif;display:inline-flex!important;align-items:center;justify-content:center;padding:0 5px;margin-left:auto;box-sizing:border-box}\n#chMic.rec{background:#C2410C;color:#fff}\n.ch-dot{width:8px;"
],
["window.chatOn1400 = function(){ return !!S.on; };", "window.chatOn1400 = function(){ return !!S.on; }; try{ if(typeof NAV_T !== 'undefined'){ var ci = NAV_T.findIndex(function(x){ return x[0] === 'chat'; }); if(ci > 1){ var cx = NAV_T.splice(ci, 1)[0]; NAV_T.splice(1, 0, cx); } } }catch(e){}"]
]);
