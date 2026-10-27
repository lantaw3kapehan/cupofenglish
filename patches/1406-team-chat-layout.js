// 1406: Team Chat layout (Misty 21:05 screenshots): header title + subtitle on one line, icon-only buttons with tooltips (labels only on
//   very wide screens), "N online" counts only people in this chat, channel description 2 lines (tap for all), short "Message…"
//   placeholder with a small hint under the box, ready-made messages in a Templates menu.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
[
"(S.mem && isMgr() ? ' · ' + S.mem.filter(function(x){ return x.online || x.inClass; }).length + ' online' : '')",
"(S.mem && isMgr() ? ' · ' + (function(){ var inC = ((d && d.members) || []).map(function(n){ return String(n).toLowerCase(); }); return S.mem.filter(function(x){ return (x.online || x.inClass) && inC.indexOf(String(x.name).toLowerCase()) > -1; }).length; })() + ' online' : '')"
],
[
"'\" onclick=\"chat1400.hist()\">' + I.hist + '<span>History</span>",
"'\" title=\"History · earlier days\" onclick=\"chat1400.hist()\">' + I.hist + '<span>History</span>"
],
[
"aria-label=\"Search\" onclick=\"chat1400.search()\">",
"aria-label=\"Search\" title=\"Search messages\" onclick=\"chat1400.search()\">"
],
[
"aria-label=\"Members\" onclick=\"chat1400.memT()\">",
"aria-label=\"Members\" title=\"Show or hide who is in this chat\" onclick=\"chat1400.memT()\">"
],
[
"return '<div class=\"ch-desc\">' + esc(t) + ' <span>Formal requests, leave and notices stay in Messages.</span></div>'; }",
"return '<div class=\"ch-desc' + (S.descOpen ? ' open' : '') + '\" role=\"button\" tabindex=\"0\" aria-expanded=\"' + !!S.descOpen + '\" title=\"' + (S.descOpen ? 'Show less' : 'Show all') + '\" onclick=\"chat1400.descT()\" onkeydown=\"if(event.key===\\'Enter\\'||event.key===\\' \\'){event.preventDefault();chat1400.descT();}\">' + esc(t) + ' <span>Formal requests, leave and notices stay in Messages.</span></div>'; }"
],
[
"ready: function(i){ var t = document.getElementById('chTx'); if(t){ t.value = (S.init.ready || [])[i] || ''; t.focus(); } }",
"ready: function(i){ S.tplOpen = 0; var M0 = document.querySelector('#v-chat .ch-tplm'); if(M0) M0.remove(); var B0 = document.querySelector('#v-chat .ch-tplb'); if(B0) B0.setAttribute('aria-expanded', 'false'); var t = document.getElementById('chTx'); if(t){ t.value = (S.init.ready || [])[i] || ''; t.focus(); if(typeof syncSend === 'function') syncSend(); } },\n    tpl: function(){ S.tplOpen = !S.tplOpen; var dr = document.getElementById('chTx'), keep = dr ? dr.value : ''; render(true); var t2 = document.getElementById('chTx'); if(t2) t2.value = keep; if(typeof syncSend === 'function') syncSend(); },\n    formal: async function(){ var t = document.getElementById('chTx'), v = t ? t.value.trim() : '', g = (S.init.groups || []).find(function(x){ return x.id === S.gid; }) || {};\n      var pre = S.gid && S.gid.indexOf('dm:') === 0 ? [String(g.name || '').replace(/^Teacher /, '')] : null;\n      try{ if((typeof MSG === 'undefined' || !MSG) && typeof loadMsgs === 'function') await loadMsgs(true); }catch(e){}\n      if(typeof msgNew !== 'function'){ toast2('Open Notices & requests to send a formal notice'); return; } msgNew(pre); var mt = document.getElementById('mnT'); if(mt){ mt.value = v; mt.focus(); } },\n    descT: function(){ S.descOpen = !S.descOpen; var el = document.querySelector('#v-chat .ch-desc'); if(el){ el.classList.toggle('open', !!S.descOpen); el.setAttribute('aria-expanded', String(!!S.descOpen)); el.title = S.descOpen ? 'Show less' : 'Show all'; } }"
],
[
"      + (S.init.ready || []).map(function(t, i){ return '<button type=\"button\" class=\"ch-chip\" onclick=\"chat1400.ready(' + i + ')\">' + esc(['Redo time-in', 'Late for class', 'Substitute needed'][i] || t.slice(0, 24)) + '</button>'; }).join('') + '</div>' : '';",
"      + ((S.init.ready || []).length ? '<button type=\"button\" class=\"ch-chip ch-tplb' + (S.tplOpen ? ' on' : '') + '\" aria-expanded=\"' + !!S.tplOpen + '\" aria-controls=\"chTpl\" onclick=\"chat1400.tpl()\">Templates <svg viewBox=\"0 0 24 24\" width=\"14\" height=\"14\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" aria-hidden=\"true\"><path d=\"' + (S.tplOpen ? 'M6 15l6-6 6 6' : 'M6 9l6 6 6-6') + '\"/></svg></button>' : '') + '<button type=\"button\" class=\"ch-chip\" onclick=\"chat1400.formal()\" title=\"Send as formal notice: opens the Notices &amp; requests form with this text (Got it) · nothing is posted in Team Chat\" aria-label=\"Send as formal notice\">Formal notice</button></div>'\n      + (S.tplOpen ? '<div class=\"ch-tplm\" id=\"chTpl\" role=\"group\" aria-label=\"Templates\">' + (S.init.ready || []).map(function(t, i){ return '<button type=\"button\" onclick=\"chat1400.ready(' + i + ')\"><b>' + esc(['Redo time-in', 'Late for class', 'Substitute needed'][i] || t.slice(0, 24)) + '</b><span>' + esc(t) + '</span></button>'; }).join('') + '</div>' : '') : '';"
],
[
"var PH = function(){ return /Mobi|Android|iPhone/i.test(navigator.userAgent) ? 'Message · @ to tag' : 'Message · Enter sends · Shift+Enter new line · @ to tag'; };",
"var PH = function(){ return 'Message…'; }, HINT = function(){ return /Mobi|Android|iPhone/i.test(navigator.userAgent) ? 'Type @ to tag someone' : 'Enter to send · Shift+Enter new line · @ to tag'; };"
],
[
"' onclick=\"chat1400.send()\">' + I.send + '</button></div></div>'; }",
"' onclick=\"chat1400.send()\">' + I.send + '</button></div><div class=\"ch-hint\" aria-hidden=\"true\">' + HINT() + '</div></div>'; }"
],
[
"tx.placeholder = 'Message · type @ to tag'",
"tx.placeholder = PH()"
],
[
"  function paintSide(){ var s = document.querySelector('#v-chat .ch-side'); if(s) s.innerHTML = sideHtml(); }",
"  /* 1406 · patch the page in place (only what changed) instead of rebuilding it: clicks never land on a replaced button, pictures are not\n     reloaded, scroll / focus / typing stay put. A poll that brings nothing new changes nothing. */\n  function morph(a, b){\n    if(a.nodeType !== b.nodeType || a.nodeName !== b.nodeName || (a.nodeType === 1 && (a.id || '') !== (b.id || ''))){ a.parentNode.replaceChild(b, a); return; }\n    if(a.nodeType !== 1){ if(a.nodeValue !== b.nodeValue) a.nodeValue = b.nodeValue; return; }\n    var bA = b.attributes, aA = a.attributes, i;\n    for(i = 0; i < bA.length; i++){ var n = bA[i].name, v = bA[i].value; if(a.getAttribute(n) !== v){ a.setAttribute(n, v); if(n === 'value' && 'value' in a) a.value = v; } }\n    for(i = aA.length - 1; i >= 0; i--){ var nm = aA[i].name; if(!b.hasAttribute(nm) && nm.indexOf('data-') !== 0){ a.removeAttribute(nm); if(nm === 'value' && 'value' in a) a.value = ''; } }\n    if(a.nodeName === 'TEXTAREA') return;\n    var ac = a.childNodes, bc = Array.prototype.slice.call(b.childNodes);\n    for(i = 0; i < bc.length; i++){ if(i < ac.length) morph(ac[i], bc[i]); else a.appendChild(bc[i]); }\n    while(ac.length > bc.length) a.removeChild(a.lastChild); }\n  var MORPH = (function(){ try{ return localStorage.getItem('coe.chatMorph') !== '0'; }catch(e){ return true; } })();\n  function setHtml(R, h){ var cur = R.firstElementChild; if(MORPH && cur && cur.classList.contains('ch') && R.__h === h) return; R.__h = h;\n    if(!MORPH || !cur || !cur.classList.contains('ch')){ R.innerHTML = h; return; } var t = document.createElement('div'); t.innerHTML = h; if(t.firstElementChild) morph(cur, t.firstElementChild); }\n  function patchEl(el, h){ if(!el || el.__h === h) return; el.__h = h; if(!MORPH){ el.innerHTML = h; return; } var t = el.cloneNode(false); t.innerHTML = h; morph(el, t); }\n  function findM(id){ return ((S.data && S.data.msgs) || []).find(function(x){ return x.id === id; }) || ((S.data && S.data.pinned) || []).find(function(x){ return x.id === id; }) || null; }\n  function reuse(r){ var U = S.urls || (S.urls = {}), t = Date.now(); [r.msgs, r.pinned, r.open].forEach(function(L){ (L || []).forEach(function(m){ if(!m || !m.img_path || !m.img) return; var c = U[m.img_path];\n      if(c && t - c.at < 45 * 6e4 && (!m.imgs || (c.imgs && c.imgs.length === m.imgs.length))){ m.img = c.img; if(m.imgs) m.imgs = c.imgs; } else U[m.img_path] = { img: m.img, imgs: m.imgs || null, at: t }; }); }); }\n  function paintSide(){ patchEl(document.querySelector('#v-chat .ch-side'), sideHtml()); }"
],
[
"S.data = r; S.last = Math.max(S.last, (r.msgs.slice(-1)[0] || {}).id || 0);",
"reuse(r); S.data = r; (S.cache || (S.cache = {}))[gid + '|' + day] = r; S.last = Math.max(S.last, (r.msgs.slice(-1)[0] || {}).id || 0);"
],
[
"    R.innerHTML = '<div class=\"' + cls + '\"><div class=\"ch-side\">'",
"    setHtml(R, '<div class=\"' + cls + '\"><div class=\"ch-side\">'"
],
[
"'</div><div class=\"ch-mem\">' + memHtml() + '</div></div>';",
"'</div><div class=\"ch-mem\">' + memHtml() + '</div></div>');"
],
[
"S.gid = g; S.day = null; S.view = 'chat'; S.data = null;",
"S.gid = g; S.day = null; S.view = 'chat'; S.data = (S.cache || {})[g + '|' + ((S.init && S.init.today) || '')] || null;"
],
[
"today: function(){ S.day = null; S.view = 'chat'; S.data = null; render(); load(); },",
"today: function(){ S.day = null; S.view = 'chat'; S.data = (S.cache || {})[S.gid + '|' + ((S.init && S.init.today) || '')] || null; render(); load(); },"
],
[
"day: function(d){ S.day = d; S.view = 'chat'; S.data = null; render(); load(); },",
"day: function(d){ S.day = d; S.view = 'chat'; S.data = (S.cache || {})[S.gid + '|' + d] || null; render(); load(); },"
],
[
"hist: async function(){ S.view = S.view === 'hist' ? 'chat' : 'hist'; S.days = null; render(); if(S.view === 'hist'){ var r = await post('days', { gid: S.gid }); S.days = r && r.ok ? r.days : []; render(); } },",
"hist: async function(){ S.view = S.view === 'hist' ? 'chat' : 'hist'; var g0 = S.gid; S.days = (S.daysC || {})[g0] || null; render(); if(S.view === 'hist'){ var r = await post('days', { gid: g0 }).catch(function(){ return null; }); if(r && r.ok){ (S.daysC || (S.daysC = {}))[g0] = r.days; } if(S.gid === g0 && S.view === 'hist'){ S.days = r && r.ok ? r.days : (S.days || []); render(true); } } },"
],
[
"No earlier days yet. Messages are kept in CupOfEnglish\\'s database; nothing is deleted by the app.</div>') : '<div class=\"ch-empty\">Loading…</div>')",
"No earlier days yet. Messages are kept in CupOfEnglish\\'s database; nothing is deleted by the app.</div>') : SKEL(4))"
],
[
"'</div>') : '<div class=\"ch-empty\">Loading…</div>';\n      mid = chanDesc()",
"'</div>') : SKEL(5);\n      mid = chanDesc()"
],
[
"  function memHtml(){",
"  document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && S.memOpen && !isMgr()){ S.memOpen = false; render(true); var mb = document.querySelector('#v-chat .ch-memb'); if(mb) mb.focus(); } });\n  document.addEventListener('click', function(e){ if(!S.memOpen || isMgr() || !e.target || !e.target.closest) return; if(e.target.closest('#v-chat .ch-mem') || e.target.closest('#v-chat .ch-memb')) return; S.memOpen = false; render(true); }, true);\n  function SKEL(n){ var h = '<div class=\"ch-skel\" role=\"status\" aria-label=\"Loading\">'; for(var i = 0; i < n; i++) h += '<div style=\"width:' + [72, 54, 86, 64, 48][i % 5] + '%\"></div>'; return h + '</div>'; }\n  function memHtml(){"
],
[
"      var r = await post('search', S.q); S.res = r && r.ok ? r.msgs : []; render(); },",
"      S.searching = 1; render(true); var r = await post('search', S.q).catch(function(){ return null; }); S.searching = 0; S.res = r && r.ok ? r.msgs : []; if(!r || !r.ok) toast2('Search did not finish · check the internet'); render(); },"
],
[
"S.res ? (S.res.length ? '<div class=\"ch-note\" style=\"padding:0 0 6px\">'",
"S.searching ? SKEL(3) : S.res ? (S.res.length ? '<div class=\"ch-note\" style=\"padding:0 0 6px\">'"
],
[
"if(r && r.ok){ S.mem = r.members; var m = document.querySelector('#v-chat .ch-mem'); if(m) m.innerHTML = memHtml(); }",
"if(r && r.ok){ S.mem = r.members; if(S.init && document.querySelector('#v-chat .ch')) render(true); }"
],
[
"    quick: async function(id, q){ var r = await post('quick', { id: id, text: q }); if(r && r.ok) load(true); else toast2((r && r.error) || 'Not sent'); },\n    confirm: async function(id){ var r = await post('confirm', { id: id }); if(r && r.ok){ toast2('Confirmed'); load(true); } },\n    pin: async function(id, on){ await post('pin', { id: id, on: !!on }); load(true); },\n    hide: async function(id, on){ await post('hide', { id: id, on: !!on }); load(true); },",
"    /* 1406: every button shows its result at once; the server is told in the background and the change is undone if it fails */\n    quick: async function(id, q){ var p = findM(id), tmp = null, old = p && p.mine ? p.mine.replied : null;\n      if(S.data && p){ tmp = { id: -Date.now(), gid: S.gid, author: S.init.me, mgmt: isMgr(), kind: 'quick', body: q, parent_id: id, quote: { author: p.author, body: String(p.body || '').slice(0, 120) }, at: new Date().toISOString(), n: 0, seen: 0, replied: 0, confirmed: 0, mentions: [], pending: 1, day: S.data.day }; S.data.msgs.push(tmp); if(p.mine) p.mine.replied = p.mine.replied || new Date().toISOString(); render(true); }\n      var r = await post('quick', { id: id, text: q }).catch(function(){ return null; });\n      if(r && r.ok){ if(tmp && S.data){ var ix = S.data.msgs.indexOf(tmp); if(ix > -1){ if(r.msg) S.data.msgs[ix] = r.msg; else S.data.msgs.splice(ix, 1); } render(true); } load(true); }\n      else { if(tmp && S.data){ var i2 = S.data.msgs.indexOf(tmp); if(i2 > -1) S.data.msgs.splice(i2, 1); if(p && p.mine) p.mine.replied = old; render(true); } toast2((r && r.error) || 'Not sent · check the internet and try again'); } },\n    confirm: async function(id){ var m = findM(id), was = m && m.mine ? m.mine.confirmed : null; if(m){ m.mine = m.mine || {}; m.mine.confirmed = m.mine.confirmed || new Date().toISOString(); render(true); } toast2('Confirmed');\n      var r = await post('confirm', { id: id }).catch(function(){ return null; }); if(r && r.ok) load(true); else { if(m && m.mine) m.mine.confirmed = was; render(true); toast2((r && r.error) || 'Not saved · check the internet and try again'); } },\n    pin: async function(id, on){ var m = findM(id), old = m ? m.pinned : null, oldP = S.data ? (S.data.pinned || []).slice() : null;\n      if(m && S.data){ m.pinned = !!on; S.data.pinned = (S.data.pinned || []).filter(function(x){ return x.id !== id; }); if(on) S.data.pinned.unshift(m); render(true); }\n      var r = await post('pin', { id: id, on: !!on }).catch(function(){ return null; }); if(r && r.ok) load(true); else { if(m) m.pinned = old; if(S.data && oldP) S.data.pinned = oldP; render(true); toast2((r && r.error) || 'Not saved · check the internet and try again'); } },\n    hide: async function(id, on){ var m = findM(id), old = m ? m.hidden : null; if(m){ m.hidden = !!on; render(true); }\n      var r = await post('hide', { id: id, on: !!on }).catch(function(){ return null; }); if(r && r.ok) load(true); else { if(m) m.hidden = old; render(true); toast2((r && r.error) || 'Not saved · check the internet and try again'); } },"
],
[
"    mute: async function(){ var M = S.init.muted || (S.init.muted = []), on = M.indexOf(S.gid) < 0; await post('mute', { gid: S.gid, on: on }); if(on) M.push(S.gid); else M.splice(M.indexOf(S.gid), 1);",
"    mute: async function(){ var M = S.init.muted || (S.init.muted = []), g0 = S.gid, on = M.indexOf(g0) < 0; if(on) M.push(g0); else M.splice(M.indexOf(g0), 1); render(true); var r0 = await post('mute', { gid: g0, on: on }).catch(function(){ return null; }); if(!r0 || !r0.ok){ if(on) M.splice(M.indexOf(g0), 1); else M.push(g0); render(true); toast2((r0 && r0.error) || 'Not saved · check the internet and try again'); return; }"
],
[
"var cls = 'ch' + (S.ph === 'conv' ? ' conv' : '') + (S.memOpen ? ' mem' : '') + (S.memHide ? ' nomem' : '');",
"var cls = 'ch' + (S.ph === 'conv' ? ' conv' : '') + (S.memOpen ? ' mem' : '') + (S.memHide ? ' nomem' : '') + (isMgr() ? '' : ' tch');"
],
[
"    memT: function(){ if(window.innerWidth < 700 && typeof openSheet === 'function'){",
"    memT: function(){ if(!isMgr() && window.innerWidth >= 700){ S.memOpen = !S.memOpen; render(true); return; } if(window.innerWidth < 700 && typeof openSheet === 'function'){"
],
[
"    return '<div class=\"ch-sec\">GROUPS</div>' + g1.map(it).join('')",
"    g1 = g1.filter(function(g){ return g.id !== 'ann'; });\n    return '<div class=\"ch-sec\">GROUPS</div>' + g1.map(it).join('')"
],
[
"  function unreadAll(){ return ((S.init && S.init.groups) || []).reduce(function(a, g){ return a + (g.unread || 0); }, 0); }",
"  function unreadAll(){ return ((S.init && S.init.groups) || []).reduce(function(a, g){ return a + (g.id === 'ann' ? 0 : (g.unread || 0)); }, 0); }"
],
[
"    if(S.gid === 'ann' && !M) return '<div class=\"ch-cmp\"><div class=\"ch-note\">Only management posts announcements. Use the buttons under a message to answer.</div></div>';",
"    if(S.gid === 'ann') return '<div class=\"ch-cmp\"><div class=\"ch-note\">Earlier announcements · read-only. Formal notices now go in Notices &amp; requests. Use the buttons under a message to answer.</div></div>';"
],
[
"var DESC = { all: 'Everyday team talk with every teacher and management.', timein: 'Time-in cards post here by themselves. Management checks them.', ann: 'Official notices from management. Answer with the buttons under each one.', subs: 'Ask for or offer a substitute class.' };",
"var DESC = { all: 'Everyday team talk with every teacher and management.', timein: 'Time-in cards post here by themselves. Management checks them.', ann: 'Earlier announcements (read-only).', subs: 'Ask for or offer a substitute class.' };"
],
[
"' <span>Formal requests, leave and notices stay in Messages.</span></div>'; }",
"' <span>For formal notices, leave or pay use Notices &amp; requests.</span></div>'; }"
],
[
"['msgs','Messages','send',1,'Today']",
"['msgs','Notices & requests','send',1,'Today']"
],
[
"NAV_T.splice(2, 0, ['tinbox', 'Messages', 'send'])",
"NAV_T.splice(2, 0, ['tinbox', 'Notices & requests', 'send'])"
],
[
"tinbox: 'Messages',",
"tinbox: 'Notices & requests',"
],
[
"msgs: 'Messages', astudents:",
"msgs: 'Notices & requests', astudents:"
],
[
"go:\"go('msgs')\", okLabel:'Messages' }",
"go:\"go('msgs')\", okLabel:'Notices & requests' }"
],
[
"let h = '<div class=\"lead row\"><div class=\"grow\"><h1>Messages</h1><div class=\"mute small\">Notices and replies · one row per notice, tap it to see each person’s status</div>",
"let h = '<div class=\"lead row\"><div class=\"grow\"><h1>Notices &amp; requests</h1><div class=\"mute small\">Formal notices and requests · teachers tap Got it so you know they have read it · tap a row to see each person’s status</div>"
],
[
"v.innerHTML = '<div class=\"lead row\"><div class=\"grow\"><h1>Messages</h1><div class=\"mute small\">Notices and replies · one row per notice, tap it to see each person’s status</div>",
"v.innerHTML = '<div class=\"lead row\"><div class=\"grow\"><h1>Notices &amp; requests</h1><div class=\"mute small\">Formal notices and requests · teachers tap Got it so you know they have read it · tap a row to see each person’s status</div>"
],
[
"<h1>Messages</h1><div class=\"mute small\">With management · every message and memo is kept here · ⭐ saves one on this device</div>",
"<h1>Notices &amp; requests</h1><div class=\"mute small\">Formal notices and requests. Tap Got it so management knows you’ve read it. Everything is kept here · the star saves one on this device</div>"
],
[
"<h1>Messages</h1><div class=\"mute small\">With management · every message and memo is kept here</div>",
"<h1>Notices &amp; requests</h1><div class=\"mute small\">Formal notices and requests. Tap Got it so management knows you’ve read it. Everything is kept here</div>"
],
[
"'<span class=\"nlL\">Messages</span><span class=\"nlS\">Inbox</span>'",
"'<span class=\"nlL\">Notices &amp; requests</span>'"
],
[
"onclick=\"msgNew()\">+ New message</button></div>' + (window.msgTabs",
"onclick=\"msgNew()\">+ New notice</button></div>' + (window.msgTabs"
],
[
"'<button class=\"btn teal sm\" onclick=\"msgNew()\">+ New message</button>' : ''",
"'<button class=\"btn teal sm\" onclick=\"msgNew()\">+ New notice</button>' : ''"
],
[
"openSheet('<h1>New message</h1>",
"openSheet('<h1>New notice</h1>"
],
[
"    var L2 = R.querySelector('#chList'); if(L2){",
"    var OO = R.querySelector('.ch-opts'); if(OO) OO.classList.toggle('ovf', OO.scrollWidth > OO.clientWidth + 1);\n    var L2 = R.querySelector('#chList'); if(L2){"
],
[
"</body>\n</html>",
"<style id=\"css1406\">\n/* 1406 · Team Chat layout (Misty 21:05): one-line header with icon buttons, 2-line description, short placeholder + hint, Templates menu */\n#v-chat .ch-hd{flex-wrap:nowrap}\n#v-chat .ch-hd>div:nth-child(2){flex:1 1 auto!important;min-width:120px}\n#v-chat .ch-hd .chT,#v-chat .ch-hd small{white-space:nowrap!important;overflow:hidden;text-overflow:ellipsis;display:block}\n@container (max-width:899px){#v-chat .ch-hd .ch-b span{display:block!important;position:absolute!important;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}#v-chat .ch-hd .ch-b{width:40px;padding:0;justify-content:center;flex:none}}\n@media(max-width:1599px){#v-chat .ch-hd .ch-b span{display:block!important;position:absolute!important;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}#v-chat .ch-hd .ch-b{width:40px;padding:0;justify-content:center;flex:none}}\n#v-chat .ch-hd .ch-b.pri{width:auto!important;padding:0 12px!important;white-space:nowrap}\n@media(max-width:600px){#v-chat .ch-hd{flex-wrap:wrap}#v-chat .ch-hd>div:nth-child(2){flex:1 1 calc(100% - 60px)!important}}\n#v-chat .ch-desc{white-space:normal!important;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;text-overflow:clip;cursor:pointer;line-height:1.45}\n#v-chat .ch-desc.open{-webkit-line-clamp:unset;display:block}\n#v-chat .ch-desc:focus-visible{outline:2px solid #0B5F63;outline-offset:-2px}\n#v-chat .ch-hint{font-size:11.5px;color:#7A7F8C;margin:4px 2px 0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n#v-chat .ch-opts .ch-tplb{gap:4px}\n#v-chat .ch-opts.ovf{-webkit-mask-image:linear-gradient(90deg,#000 calc(100% - 28px),transparent);mask-image:linear-gradient(90deg,#000 calc(100% - 28px),transparent);padding-right:24px}\n#v-chat .ch-opts .ch-tplb.on{background:#E6F3F2;border-color:#9FCFCB;color:#0B5F63}\n#v-chat .ch-tplm{display:flex;flex-direction:column;gap:4px;margin:0 0 8px;padding:6px;border:1px solid #DCE1E6;border-radius:12px;background:#fff;max-height:200px;overflow:auto}\n#v-chat .ch-tplm button{display:block;text-align:left;border:0;background:none;padding:8px 10px;border-radius:8px;cursor:pointer;font:13px Inter,system-ui,sans-serif;color:#1F1D3A}\n#v-chat .ch-tplm button:hover,#v-chat .ch-tplm button:focus-visible{background:#F2F7F7}\n#v-chat .ch-tplm b{display:block;font-weight:600}\n#v-chat .ch-tplm span{display:block;color:#5E6272;font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n/* 1406 · teachers: no side panel; Members opens a small list */\n#v-chat .ch.tch{grid-template-columns:260px minmax(0,1fr);position:relative}\n#v-chat .ch.tch .ch-mem{display:none}\n#v-chat .ch.tch.mem .ch-mem{display:block;position:absolute;right:16px;top:60px;bottom:auto;left:auto;width:240px;max-height:min(60vh,520px);overflow:auto;z-index:8;border:1px solid #DCE1E6;border-radius:12px;box-shadow:0 12px 32px rgba(31,29,58,.14);background:#fff;padding:12px 14px}\n@media(max-width:1279px){#v-chat .ch.tch{grid-template-columns:240px minmax(0,1fr)}}\n@media(max-width:699px){#v-chat .ch.tch{grid-template-columns:minmax(0,1fr)}}\n#v-chat .ch-skel{padding:14px 18px;display:flex;flex-direction:column;gap:12px}\n#v-chat .ch-skel div{height:14px;border-radius:7px;background:linear-gradient(90deg,#EEF2F4 0%,#F6F9FA 50%,#EEF2F4 100%);background-size:200% 100%;animation:chSk 1.2s linear infinite}\n@keyframes chSk{from{background-position:200% 0}to{background-position:-200% 0}}\n@media(prefers-reduced-motion:reduce){#v-chat .ch-skel div{animation:none}}\n</style>\n</body>\n</html>"
]
]);
