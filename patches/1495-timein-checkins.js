// 1495: (Misty 17:59–18:02) class check-ins belong in Time-in, not All Teachers · teachers can post a picture with a short caption in
//   Time-in; a check-in picture in All Teachers ("In, Abner's class", "I'm in", check-in, or a bare picture near the teacher's class)
//   asks "Post in Time-in instead?" (Time-in is the main button; nothing is moved silently); descriptions say where check-ins go;
//   one sender for Time-in posts with a device queue on a weak signal (the server de-duplicates).
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
[
"all: 'Chat with teachers and management here. For official notices, leave requests, or pay-related inquiries, go to Notices & requests.', timein: 'Time-in cards are posted here automatically for management to review.'",
"all: 'Chat with teachers and management here. Class check-in screenshots go in Time-in. For official notices, leave requests, or pay-related inquiries, go to Notices & requests.', timein: 'Time-in pictures and class check-in screenshots go here for management to review.'"
],
[
"    if(S.gid === 'timein' && !M) return '<div class=\"ch-cmp\"><div class=\"ch-note\">Your time-in card is posted here automatically when you time in.</div></div>';",
"    var tiT = S.gid === 'timein' && !M;   /* 1495 (Misty 17:59): teachers post class check-in screenshots here · a picture with a short caption */"
],
[
"return '<div class=\"ch-cmp\">' + '<div id=\"chTyping\"",
"return '<div class=\"ch-cmp' + (tiT ? ' ti' : '') + '\">' + (tiT ? '<div class=\"ch-note ch-tin\">Post your class check-in here: add the screenshot (picture button or paste), write a short caption such as <b>In, Abner\\'s class</b>, then send. Your time-in picture is sent from Today.</div>' : '') + '<div id=\"chTyping\""
],
[
"<textarea id=\"chTx\" rows=\"1\" onpaste",
"<textarea id=\"chTx\" rows=\"1\"' + (tiT ? ' maxlength=\"140\"' : '') + ' onpaste"
],
[
"var PH = function(){ return 'Message…'; }",
"var PH = function(){ return S.gid === 'timein' && !isMgr() ? 'Caption, e.g. In, Abner\\'s class' : 'Message…'; }"
],
[
"send: async function(voice){ var t = document.getElementById('chTx'); if(!t || S.sending) return; var v = voice ? '' : t.value.trim(); if(!v && !S.img && !voice) return;",
"send: async function(voice){ var t = document.getElementById('chTx'); if(!t || S.sending) return; var v = voice ? '' : t.value.trim(); if(!v && !S.img && !voice) return;\n      var gs = S.gid; if(S.tiTo){ gs = S.tiTo; S.tiTo = null; }   /* 1495: a check-in in All Teachers asks first (nothing is moved silently) */\n      else if(gs === 'all' && !voice && S.img && !isMgr() && (!S.init.kind || S.init.kind === 'teacher') && ciLike1495(v)){ A.tiAsk(); return; }\n      if(gs === 'timein' && !isMgr()){ if(voice || !S.img){ toast2('Time-in takes a picture with a short caption · add your screenshot first'); return; } if(v.length > 140){ toast2('Keep the caption short (140 characters)'); return; } }"
],
[
"var tmp = { cid: cid, id: -Date.now(), gid: S.gid,",
"var tmp = { cid: cid, id: -Date.now(), gid: gs,"
],
[
"if(S.data && (!S.day || S.day === S.init.today)) S.data.msgs.push(tmp);",
"if(S.data && gs === S.gid && (!S.day || S.day === S.init.today)) S.data.msgs.push(tmp);"
],
[
"var r = await post('send', { gid: S.gid, body: v,",
"var r = await post('send', { gid: gs, body: v,"
],
[
"S.last = Math.max(S.last, r.msg.id); } render(true); load(true); }",
"S.last = Math.max(S.last, r.msg.id); } render(true); load(true); if(gs !== S.gid){ toast2(gs === 'timein' ? 'Posted in Time-in' : 'Posted'); A.open(gs); } }"
],
[
"else { tmp.pending = 0; tmp.failed = 1; render(true); toast2((r && r.error) || 'Not sent · check the internet and try again'); } }",
"else { tmp.pending = 0; tmp.failed = 1; if(gs !== S.gid){ S.imgs = imgs; S.img = img; } render(true); if(gs !== S.gid){ var t2 = document.getElementById('chTx'); if(t2) t2.value = v; } toast2((r && r.error) || 'Not sent · check the internet and try again'); } }"
],
[
"catch(e){ tmp.pending = 0; tmp.failed = 1; render(true); toast2('Not sent · check the internet and try again'); } finally{ S.sending = 0; } },",
"catch(e){ tmp.pending = 0; tmp.failed = 1; if(gs !== S.gid){ S.imgs = imgs; S.img = img; } render(true); if(gs !== S.gid){ var t3 = document.getElementById('chTx'); if(t3) t3.value = v; } toast2('Not sent · check the internet and try again'); } finally{ S.sending = 0; } },\n    tiAsk: function(){ if(typeof openSheet !== 'function'){ S.tiTo = 'all'; A.send(); return; }\n      openSheet('<h2 style=\"font-family:\\'Fredoka One\\',sans-serif;font-weight:400;margin:0 0 6px\">Post in Time-in instead?</h2><div style=\"color:#5E6272;font-size:14px;line-height:1.5\">This looks like a class check-in. Check-in screenshots go in <b>Time-in</b>, where management reviews them, so All Teachers stays for team talk.</div>'\n        + '<div style=\"display:flex;flex-direction:column;gap:8px;margin-top:16px\"><button type=\"button\" class=\"btn teal block\" onclick=\"chat1400.tiGo(\\'timein\\')\">Post in Time-in</button><button type=\"button\" class=\"btn ghost block\" onclick=\"chat1400.tiGo(\\'all\\')\">Post in All Teachers</button></div>'); },\n    tiGo: function(g){ try{ closeSheet(); }catch(e){} S.tiTo = g === 'timein' ? 'timein' : 'all'; A.send(); },"
],
[
"  var PH = function(){",
"  var ciLike1495 = function(v){ v = String(v || '').trim(); if(!v) return nearClass1495(); return v.length <= 140 && /^(i'?m in\\b|i am in\\b|in\\b|check(ed)?[ -]?in\\b|time[ -]?in\\b|class check)/i.test(v); };\n  var nearClass1495 = function(){ try{ var now = Date.now(); return (D.schedule || []).some(function(c){ if(c.day !== D.today || c.cancelled) return false; var st = new Date(c.start).getTime(); return now >= st - 60 * 6e4 && now <= st + 15 * 6e4; }); }catch(e){ return false; } };\n  var PH = function(){"
],
[
"  window.chatTimein1400 = async function(blob, x, redo){ if(!S.on || !hasD() || D.mgr || !blob) return; try{ var ti = D.timeIn || {}, img = await shrink(blob, 300000);\n      var meta = { time: ti.time || '', status: ti.status || '', speed: x && x.speed ? String(x.speed).slice(0, 80) : '' };\n      await post('timein', { img: img, meta: meta, redo: !!redo, body: 'Time-in ' + (ti.time || '') + (ti.status ? ' · ' + ti.status : '') + (redo ? ' · Redo' : '') }); }catch(e){} };",
"  window.chatTimein1400 = async function(blob, x, redo){ if(!hasD() || D.mgr || !blob) return false; var ti = D.timeIn || {}, img; try{ img = await shrink(blob, 300000); }catch(e){ return { error: 'The picture could not be read' }; }\n      var meta = { time: ti.time || '', status: ti.status || '', speed: x && x.speed ? String(x.speed).slice(0, 80) : '' };\n      return sendQ1495({ a: 'timein', w: redo ? 'Redo time-in picture' : 'Time-in picture', net: x && x.speed ? String(x.speed).slice(0, 80) : '', k: 'ti:' + (D.today || '') + (redo ? ':redo' : ''), o: { img: img, meta: meta, redo: !!redo, body: 'Time-in ' + (ti.time || '') + (ti.status ? ' · ' + ti.status : '') + (redo ? ' · Redo' : '') } }); };\n  /* 1495 (Misty 18:02): one sender for Time-in posts · true = sent · 'queued' = weak signal, kept on this device and sent by itself · { error } = refused */\n  var QK1495 = 'coe.chq1495', QM1495 = {};\n  function qRead(){ try{ return JSON.parse(localStorage.getItem(QK1495) || '{}') || {}; }catch(e){ return QM1495; } }\n  function qWrite(o){ QM1495 = o; try{ localStorage.setItem(QK1495, JSON.stringify(o)); }catch(e){} }\n  /* (Misty 18:06) management sees a post that is waiting or failed (a tiny note, sent even on a weak line); cleared when it arrives */\n  function pend(it, st){ try{ post('pend', { k: it.k, what: it.w || 'Time-in post', net: it.net || '', st: st }).then(function(r){ if(r && r.ok){ var o = qRead(); if(o[it.k]){ o[it.k].pn = 1; qWrite(o); } } }, function(){}); }catch(e){} }\n  async function sendQ1495(it){ var r = null; try{ r = await post(it.a, it.o); }catch(e){ r = null; }\n    var had = qRead()[it.k];\n    if(r && r.ok && !r.off){ var o = qRead(); if(o[it.k]){ delete o[it.k]; qWrite(o); } if(had || it.pn){ try{ post('pend', { k: it.k, off: 1 }).catch(function(){}); }catch(e){} } return true; }\n    if(r && r.off) return { error: 'Team Chat is off for you' };\n    if(r && r.error){ pend(it, 'failed'); return { error: String(r.error) }; }\n    var o2 = qRead(); o2[it.k] = { a: it.a, o: it.o, w: it.w || '', net: it.net || '', at: (had && had.at) || Date.now() }; qWrite(o2); pend(it, 'pending'); return 'queued'; }\n  window.chatQueued1495 = function(k){ return !!qRead()[k]; };\n  async function qFlush(){ if(!hasD() || qFlush.busy) return; var o = qRead(), ks = Object.keys(o); if(!ks.length) return; qFlush.busy = 1;\n    try{ for(var i = 0; i < ks.length; i++){ var k = ks[i], it = o[k]; if(!it || Date.now() - it.at > 18 * 36e5){ var q = qRead(); delete q[k]; qWrite(q); continue; }\n      var r = await sendQ1495({ a: it.a, o: it.o, k: k, w: it.w, net: it.net, pn: it.pn }); if(r === 'queued') break; if(r && r.error){ var q2 = qRead(); delete q2[k]; qWrite(q2); }\n      try{ window.dispatchEvent(new CustomEvent('chq1495', { detail: { k: k, ok: r === true, error: r && r.error } })); }catch(e){} } }\n    finally{ qFlush.busy = 0; } }\n  setInterval(function(){ qFlush(); }, 30000); window.addEventListener('online', function(){ setTimeout(qFlush, 1500); }); setTimeout(qFlush, 8000);\n  window.chatSend1495 = async function(a, o, k, w, net){ if(o && typeof o.img === 'string' && o.img.length * 0.75 > 380000){ try{ var bl = await (await fetch(o.img)).blob(); o = Object.assign({}, o, { img: await shrink(bl, 300000) }); }catch(e){} } return sendQ1495({ a: a, o: o, k: k, w: w, net: net }); };"
],
[
" <span>For official notices, leave requests, or pay-related inquiries, go to Notices &amp; requests.</span>') + '</div>'; }",
" <span>For official notices, leave requests, or pay-related inquiries, go to Notices &amp; requests.</span>') + '</div>'\n      + (S.gid === 'timein' && isMgr() && S.data && (S.data.pending || []).length ? '<div class=\"ch-pend\" role=\"status\"><b>Not arrived yet</b> · ' + S.data.pending.map(function(p){ return esc(p.name) + ': ' + esc(p.what) + (p.st === 'failed' ? ' (not sent)' : ' (weak internet since ' + tm(p.at) + ')') + (p.net ? ' · ' + esc(p.net) : ''); }).join(' · ') + '</div>' : ''); }"
],
[
"window.chatStatus1403 = function(m){",
"window.chatPend1495 = function(m){ var p = m && m.pend && m.pend[0]; return p ? p.what + (p.st === 'failed' ? ' not sent' : ' waiting · weak internet') + (p.net ? ' (' + p.net + ')' : '') : ''; };\n  window.chatStatus1403 = function(m){ if(m && m.pend && m.pend.length) return chatPend1495(m);"
],
[
"if(m.n && !nxc) ft += isMgr() ?",
"if(m.n && !nxc && (isMgr() || m.seen)) ft += isMgr() ?"
],
[
"</body>\n</html>",
"<style id=\"css1495\">\n/* 1495 · Time-in composer for teachers: picture + short caption */\n#v-chat .ch-cmp.ti #chMic,#v-chat .ch-cmp.ti #chEmoB{display:none}\n#v-chat .ch-pend{margin:6px 0 0;padding:8px 12px;border-radius:10px;background:#FFF4E5;color:#7A4A0E;font-size:13px;line-height:1.45}\n#v-chat .ch-note.ch-tin{padding:2px 2px 8px;color:#4C4868;font-size:13px;line-height:1.45}\n</style>\n</body>\n</html>"
]
]);
