// 1402: (Misty, 19:56–19:57) Team Chat follows the management design: one three-pane surface that fills the screen (chats ≈260 px ·
//   conversation · members ≈260 px, members become a toggle under 1280 px and a sheet on phones), sidebar-sized list (15 px, no "Teacher"
//   prefix), one-line member rows (green online · amber in class · grey away), Reply/Edit/Pin/Hide as a small icon toolbar on hover / long-press,
//   quiet "Seen by", consecutive messages grouped, own/management bubbles teal, one row of composer chips, "No more messages today".
//   Mention sound: a short chime (chime.wav, 7 KB, served with the app) when someone tags me / @All / Needs reply / a direct message — any
//   screen, held while my class runs, "Tap to turn on chat sounds" if the browser blocks it; purple pulsing badge; Sound on/off in the header.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
[
"return '<h2>Team Chat</h2><div class=\"ch-sec\">GROUPS</div>'",
"return '<div class=\"ch-sec\">GROUPS</div>'"
],
[
"'<span class=\"nm\">' + esc(g.name) + '</span>'",
"'<span class=\"nm\">' + esc(g.kind === 'direct' ? g.name.replace(/^Teacher /, '') : g.name) + '</span>'"
],
[
"style=\"width:26px;height:26px;font-size:12px\"",
"data-sm=\"1\""
],
[
"function msgHtml(m, byId){",
"function msgHtml(m, byId, pv){ var cont = !!(pv && pv.author === m.author && !m.quote && !m.parent_id && !pv.hidden && pv.kind !== 'timein' && m.kind !== 'timein' && Date.parse(m.at) - Date.parse(pv.at) < 300000);"
],
[
"d.msgs.map(function(m){ return (S.fu",
"d.msgs.map(function(m, i){ return (S.fu"
],
[
"msgHtml(m, byId); }).join('') : '<div class=\"ch-empty\">'",
"msgHtml(m, byId, i ? d.msgs[i - 1] : null); }).join('') + (d.day === S.init.today ? '<div class=\"ch-end\">No more messages today</div>' : '') : '<div class=\"ch-empty\">'"
],
[
"var act = '';",
"var act = '', tl = '';"
],
[
"act += '<button type=\"button\" class=\"ch-b sm\" onclick=\"chat1400.reply(' + m.id + ')\">Reply</button>';",
"tl += '<button type=\"button\" class=\"ch-tb\" aria-label=\"Reply\" title=\"Reply\" onclick=\"chat1400.reply(' + m.id + ')\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" aria-hidden=\"true\"><path d=\"M9 14L4 9l5-5\"/><path d=\"M4 9h11a5 5 0 0 1 0 10h-2\"/></svg></button>';"
],
[
"if(me && m.kind === 'text') act += '<button type=\"button\" class=\"ch-b sm\" onclick=\"chat1400.edit(' + m.id + ')\">Edit</button>';",
"if(me && m.kind === 'text') tl += '<button type=\"button\" class=\"ch-tb\" aria-label=\"Edit\" title=\"Edit\" onclick=\"chat1400.edit(' + m.id + ')\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" aria-hidden=\"true\"><path d=\"M12 20h9\"/><path d=\"M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z\"/></svg></button>';"
],
[
"if(M) act += '<button type=\"button\" class=\"ch-b sm\" onclick=\"chat1400.pin(' + m.id + ',' + (m.pinned ? 0 : 1) + ')\">' + (m.pinned ? 'Unpin' : 'Pin') + '</button><button type=\"button\" class=\"ch-b sm\" onclick=\"chat1400.hide(' + m.id + ',1)\">Hide</button>';",
"if(M) tl += '<button type=\"button\" class=\"ch-tb' + (m.pinned ? ' on' : '') + '\" aria-label=\"' + (m.pinned ? 'Unpin' : 'Pin') + '\" title=\"' + (m.pinned ? 'Unpin' : 'Pin') + '\" onclick=\"chat1400.pin(' + m.id + ',' + (m.pinned ? 0 : 1) + ')\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" aria-hidden=\"true\"><path d=\"M12 17v5M5 3h14l-2 7 3 4H4l3-4-2-7z\"/></svg></button><button type=\"button\" class=\"ch-tb\" aria-label=\"Hide\" title=\"Hide (kept in the history)\" onclick=\"chat1400.hide(' + m.id + ',1)\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" aria-hidden=\"true\"><path d=\"M17.9 17.9A10 10 0 0 1 12 19c-7 0-11-7-11-7a18 18 0 0 1 5.1-5.9M9.9 4.2A9 9 0 0 1 12 4c7 0 11 7 11 7a18 18 0 0 1-2.2 3.2M1 1l22 22\"/></svg></button>';"
],
[
"'<button type=\"button\" class=\"ch-chip\" onclick=\"chat1400.readers('",
"'<button type=\"button\" class=\"ch-chip seen\" onclick=\"chat1400.readers('"
],
[
"'<div class=\"ch-bub' + (me ? ' me' : '')",
"'<div class=\"ch-bub' + (me || m.mgmt ? ' me' : '')"
],
[
"return '<div class=\"ch-m\" id=\"chm' + m.id + '\"'",
"return '<div class=\"ch-m' + (cont ? ' cont' : '') + '\" id=\"chm' + m.id + '\"'"
],
[
"'><span class=\"ch-av' + (m.mgmt ? ' mg' : '') + '\">' + esc(String(disp(m.author)).replace('Teacher ', '').charAt(0)) + '</span><div style=\"min-width:0;flex:1\">' + who + par",
"'><span class=\"ch-av' + (m.mgmt ? ' mg' : '') + (cont ? ' ghost' : '') + '\" aria-hidden=\"' + cont + '\">' + esc(String(disp(m.author)).replace('Teacher ', '').charAt(0)) + '</span><div class=\"ch-body\">' + (tl ? '<div class=\"ch-tools\">' + tl + '</div>' : '') + (cont ? '' : who) + par"
],
[
"S.lpT = setTimeout(function(){ A.reply(id); }, 550);",
"S.lpT = setTimeout(function(){ var el = document.getElementById('chm' + id); document.querySelectorAll('#v-chat .ch-m.tools').forEach(function(x){ if(x !== el) x.classList.remove('tools'); }); if(el) el.classList.toggle('tools'); }, 500);"
],
[
"' members</small></div>'",
"' members' + (S.mem ? ' · ' + S.mem.filter(function(x){ return x.online || x.inClass; }).length + ' online' : '') + '</small></div>'"
],
[
"'\" aria-label=\"Search\" onclick=\"chat1400.search()\">' + I.search + '</button></div>'",
"'\" aria-label=\"Search\" onclick=\"chat1400.search()\">' + I.search + '<span>Search</span></button>' + '<button type=\"button\" class=\"ch-b ch-memb' + (S.memOpen ? ' on' : '') + '\" aria-label=\"Members\" onclick=\"chat1400.memT()\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" aria-hidden=\"true\"><path d=\"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2\"/><circle cx=\"9\" cy=\"7\" r=\"4\"/><path d=\"M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75\"/></svg><span>Members</span></button>' + '<button type=\"button\" class=\"ch-b ch-snd' + (sndOn() ? ' on' : '') + '\" aria-pressed=\"' + sndOn() + '\" title=\"Mention sound\" onclick=\"chat1400.snd()\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.8\" stroke-linecap=\"round\" aria-hidden=\"true\"><path d=\"M11 5L6 9H2v6h4l5 4z\"/><path d=\"M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14\"/></svg><span>' + (sndOn() ? 'Sound on' : 'Sound off') + '</span></button></div>'"
],
[
"    noimg: function(){",
"    memT: function(){ if(window.innerWidth < 700 && typeof openSheet === 'function'){ openSheet('<div class=\"ch-mem ch-sheet\">' + memHtml() + '</div>'); return; } S.memOpen = !S.memOpen; render(true); },\n    snd: function(){ try{ localStorage.setItem('coe.chatSnd', sndOn() ? '0' : '1'); }catch(e){} if(sndOn()) chime(true); toast2(sndOn() ? 'Mention sound on' : 'Mention sound off'); render(true); },\n    noimg: function(){"
],
[
"'<div class=\"ch-mi\"><span class=\"ch-dot' + (m.inClass ? ' cl' : m.online ? ' on' : '') + '\"></span>' + esc(disp(m.name)) + '<small>'",
"'<div class=\"ch-mi\"><span class=\"ch-dot' + (m.inClass ? ' cl' : m.online ? ' on' : '') + '\"></span><span class=\"nm\">' + esc(disp(m.name).replace(/^Teacher /, '')) + '</span>' + (m.mgmt ? '<span class=\"ch-tag\">Mgmt</span>' : '') + '<small>'"
],
[
"var on = L.filter(function(m){ return m.online; }), off = L.filter(function(m){ return !m.online; });",
"var on = L.filter(function(m){ return m.online || m.inClass; }).sort(function(a, b){ return (b.online ? 1 : 0) - (a.online ? 1 : 0); }), off = L.filter(function(m){ return !m.online && !m.inClass; });"
],
[
"var ch = r.last !== S.last; S.last = r.last;",
"var ch = r.last !== S.last; S.last = r.last; try{ ding(r); }catch(e){}"
],
[
"var LS = 'coe.chat1400',",
"var sndOn = function(){ try{ return localStorage.getItem('coe.chatSnd') !== '0'; }catch(e){ return true; } };\n  var AU = null, AUOK = false, ATN = -1, HOLD = 0;\n  function chime(force){ if(!force && !sndOn()) return; try{ if(!AU){ AU = new Audio('chime.wav'); AU.preload = 'auto'; } AU.currentTime = 0; var p = AU.play(); if(p && p.catch) p.catch(function(){ showTap(); }); else AUOK = true; window.__chime1402 = (window.__chime1402 || 0) + 1; }catch(e){} }\n  function showTap(){ if(AUOK || document.getElementById('chSnd')) return; document.body.insertAdjacentHTML('beforeend', '<button type=\"button\" id=\"chSnd\" onclick=\"this.remove()\">Tap to turn on chat sounds</button>'); }\n  function unlock(){ if(AUOK) return; try{ if(!AU){ AU = new Audio('chime.wav'); AU.preload = 'auto'; } AU.muted = true; var p = AU.play(); var ok = function(){ AU.pause(); AU.currentTime = 0; AU.muted = false; AUOK = true; var b = document.getElementById('chSnd'); if(b) b.remove(); if(HOLD === 2){ HOLD = 0; chime(); } }; if(p && p.then) p.then(ok).catch(function(){ AU.muted = false; }); else ok(); }catch(e){} }\n  ['pointerdown', 'keydown', 'touchstart'].forEach(function(ev){ document.addEventListener(ev, unlock, { capture: true, passive: true }); });\n  /* mention chime: someone tagged me / @All / Needs reply / a direct message → the tagged count grows. Not for ordinary group messages. Held while my class runs. */\n  function ding(r){ var G = r.groups || [], n = G.reduce(function(a, g){ return a + (g.tagged || 0) + (g.kind === 'direct' ? (g.unread || 0) : 0); }, 0);\n    var nav = document.querySelector('nav button[data-v=\"chat\"] .dot'); if(nav) nav.classList.toggle('at', n > 0);\n    if(ATN < 0){ ATN = n; return; } var up = n > ATN; ATN = n;\n    if(r.inClass){ if(up) HOLD = 1; return; } if(up || HOLD === 1){ HOLD = 0; if(!AUOK){ HOLD = 2; showTap(); } chime(); } }\n  var LS = 'coe.chat1400',"
],
[
"S.init = r; setOn(true);",
"S.init = r; setOn(true); try{ ATN = -1; ding(r); }catch(e){}"
],
[
"</body>\n</html>",
"<style>\n/* 1402 · Team Chat redesign (management tokens) + mention sound */\n#v-chat{min-height:0}\n#v-chat .ch{grid-template-columns:260px minmax(0,1fr) 260px;height:calc(100vh - 132px);min-height:480px;border:1px solid var(--line,#E6E9EE);border-radius:14px;background:#fff;box-shadow:none;font:15px/1.45 Inter,system-ui,sans-serif}\n#v-chat .ch-side{padding:12px 8px;gap:1px;background:#FBFCFC}\n#v-chat .ch-sec{font:600 12px Inter,system-ui,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#6A6F7E;padding:14px 10px 6px}\n#v-chat .ch-g{font:500 15px/1.3 Inter,system-ui,sans-serif;min-height:44px;padding:6px 10px;gap:10px;border-radius:10px;color:#1F1D3A}\n#v-chat .ch-g.on{font-weight:600;background:#E6F3F2;color:#0B5F63}\n#v-chat .ch-g svg{width:18px;height:18px}\n#v-chat .ch-av{width:28px;height:28px;font-size:12px}\n#v-chat .ch-g .ch-av{width:28px;height:28px;font-size:12px}\n#v-chat .ch-n{min-width:20px;height:20px;font-size:11.5px;background:#00737B}\n#v-chat .ch-n.at{background:#5B4B9A}\n#v-chat .ch-hd{min-height:64px;padding:10px 18px;gap:8px}\n#v-chat .ch-hd .chT{font:400 20px/1.2 'Fredoka One','Fredoka',system-ui,sans-serif}\n#v-chat .ch-hd small{font-size:13px}\n#v-chat .ch-b{height:40px;font:600 13.5px Inter,system-ui,sans-serif;border-radius:10px}\n#v-chat .ch-b svg{width:16px;height:16px}\n#v-chat .ch-list{gap:2px;padding:16px 20px}\n#v-chat .ch-m{max-width:680px;gap:10px;margin-top:12px}\n#v-chat .ch-m.cont{margin-top:2px}\n#v-chat .ch-av.ghost{visibility:hidden;height:0}\n#v-chat .ch-body{position:relative;min-width:0;flex:1}\n#v-chat .ch-who{font-size:13px;color:#5E6272;display:flex;align-items:center;gap:6px;flex-wrap:wrap}\n#v-chat .ch-who b{color:#1F1D3A;font-weight:600}\n#v-chat .ch-tag{font-size:11px;padding:1px 7px;margin:0}\n#v-chat .ch-bub{max-width:640px;width:fit-content;background:#fff;border:1px solid #E3E7EB;border-radius:14px;padding:9px 12px;margin-top:3px;font-size:15px}\n#v-chat .ch-bub.me{background:#EEF7F6;border-color:#D4EAE8}\n#v-chat .ch-at{color:#5B4B9A;background:#EFEBF9}\n#v-chat .ch-at.me{background:#5B4B9A;color:#fff}\n#v-chat .ch-ft{margin-top:4px;gap:6px}\n#v-chat .ch-chip.seen{background:none;padding:0;color:#6A6F7E;font-weight:500;font-size:12.5px}\n#v-chat .ch-chip.seen:hover{color:#0B5F63;text-decoration:underline}\n#v-chat .ch-act{margin-top:6px;gap:6px}\n#v-chat .ch-act .ch-b.sm{height:34px;font-size:13px;border-radius:999px;padding:0 14px}\n#v-chat .ch-tools{position:absolute;top:-4px;right:0;display:none;gap:2px;background:#fff;border:1px solid #E3E7EB;border-radius:10px;padding:2px;box-shadow:0 4px 14px rgba(20,40,40,.10);z-index:2}\n#v-chat .ch-m:hover .ch-tools,#v-chat .ch-m.tools .ch-tools,#v-chat .ch-m:focus-within .ch-tools{display:flex}\n#v-chat .ch-tb{width:34px;height:34px;border:0;border-radius:8px;background:none;color:#1F1D3A;display:flex;align-items:center;justify-content:center;cursor:pointer}\n#v-chat .ch-tb:hover,#v-chat .ch-tb.on{background:#E6F3F2;color:#0B5F63}\n#v-chat .ch-tb svg{width:17px;height:17px}\n#v-chat .ch-day{margin:6px 0 2px;font-size:12px}\n#v-chat .ch-end{align-self:center;margin:18px 0 6px;font-size:12px;color:#8A8F9C;display:flex;align-items:center;gap:10px;width:100%;justify-content:center}\n#v-chat .ch-end:before,#v-chat .ch-end:after{content:\"\";height:1px;background:#EEF0F3;flex:1;max-width:120px}\n#v-chat .ch-opts{flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;gap:6px;margin-bottom:8px;padding-bottom:2px}\n#v-chat .ch-opts::-webkit-scrollbar{display:none}\n#v-chat .ch-opts .ch-b.sm,#v-chat .ch-opts .ch-chip{flex:none;height:32px;padding:0 12px;border:1px solid #DCE1E6;border-radius:999px;background:#fff;color:#1F1D3A;font:600 12.5px Inter,system-ui,sans-serif;white-space:nowrap;display:inline-flex;align-items:center}\n#v-chat .ch-opts .ch-b.sm.on{background:#E6F3F2;border-color:#9FCFCB;color:#0B5F63}\n#v-chat .ch-opts label{flex:none;white-space:nowrap}\n#v-chat .ch-row textarea{min-height:44px;height:44px;border-radius:12px;font-size:15px;padding:11px 12px}\n#v-chat .ch-ib{width:44px;height:44px;border-radius:12px}\n#v-chat .ch-ib.pri{background:#00737B}\n#v-chat .ch-mem{padding:14px 14px;background:#FBFCFC}\n#v-chat .ch-mem h2{font:400 17px 'Fredoka One','Fredoka',system-ui,sans-serif}\n#v-chat .ch-mi,.ch-sheet .ch-mi{display:flex;align-items:center;gap:8px;min-height:36px;padding:0;white-space:nowrap}\n#v-chat .ch-mi .nm,.ch-sheet .ch-mi .nm{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;font-size:14px}\n#v-chat .ch-mi small,.ch-sheet .ch-mi small{margin-left:0;flex:none;color:#6A6F7E;font-size:13px}\n#v-chat .ch-dot.cl,.ch-sheet .ch-dot.cl{background:#E0A100}\n#v-chat .ch-memb{display:none}\n.ch-sheet .ch-mi{min-height:44px}\nnav button[data-v=\"chat\"] .dot.at{background:#5B4B9A!important;animation:chPulse 1.4s ease-in-out infinite}\nnav button[data-v=\"chat\"] .dot.at.chN:not(.hide){background:#5B4B9A!important}\n@keyframes chPulse{0%,100%{box-shadow:0 0 0 0 rgba(91,75,154,.45)}50%{box-shadow:0 0 0 6px rgba(91,75,154,0)}}\n@media (prefers-reduced-motion:reduce){nav button[data-v=\"chat\"] .dot.at{animation:none}}\n#chSnd{position:fixed;left:16px;bottom:84px;z-index:60;border:0;border-radius:999px;background:#5B4B9A;color:#fff;font:600 13px Inter,system-ui,sans-serif;padding:10px 14px;box-shadow:0 6px 18px rgba(0,0,0,.18);cursor:pointer}\n@media(max-width:1279px){#v-chat .ch{grid-template-columns:240px minmax(0,1fr)}#v-chat .ch-mem{display:none}#v-chat .ch.mem .ch-mem{display:block;position:absolute;right:0;top:0;bottom:0;width:260px;z-index:6;box-shadow:-8px 0 24px rgba(0,0,0,.08)}#v-chat .ch-memb{display:inline-flex}}\n@media(max-width:900px){#v-chat .ch-hd .ch-b span{display:none}#v-chat .ch-hd .ch-b{width:40px;padding:0;justify-content:center}}\n@media(max-width:700px){#v-chat .ch{grid-template-columns:minmax(0,1fr);height:calc(100dvh - 150px);border-radius:14px}#v-chat .ch-list{padding:12px}#v-chat .ch-hd{padding:8px 10px}#v-chat .ch-hd .ch-b{width:44px;height:44px}#v-chat .ch-tb{width:40px;height:40px}#v-chat .ch-g{min-height:52px}}\n</style>\n</body>\n</html>"
]
]);
