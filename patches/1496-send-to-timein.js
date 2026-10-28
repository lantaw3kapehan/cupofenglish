// 1496: (Misty 18:02–18:06) "Copy to WeChat" becomes one tap: Send to Time-in · the time-in picture sheet shows exactly what will be
//   sent, with one main button that stays off until the picture, time, status and internet check are all there; Sending / Sent /
//   weak internet + Try again (kept on the card until it is sent, with the internet reading; it also retries by itself); no
//   duplicates (one time-in card per teacher per day; class check-ins by key). "I'm in" gets the same Send to Time-in with a preview
//   (In, <student>'s class · time · status). Copy for WeChat stays as a small extra. Today and reminder texts point to Time-in.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
[
"    var inner = '<ol><li>Tap <b>Copy picture</b></li><li>Open the <b>WeChat corner</b> and paste it (<b>Ctrl+V</b> · Mac <b>⌘V</b>)</li><li><b>Send</b></li><li>Come back and tick <b>Posted in WeChat</b></li></ol><div class=\"wc-note\">You no longer need to send the speed-test screenshot — this picture has everything.</div>';\n    return n < 3 || redo ? '<div class=\"wc-steps\"><b>Post it in the WeChat corner</b>' + inner + '</div>' : '<details class=\"wc-steps\"><summary>How to post it in the WeChat corner</summary>' + inner + '</details>'; }",
"    var inner = '<ol><li>Check the picture below · it has your time-in, the internet check and your screen proof</li><li>Tap <b>Send to Time-in</b> · it goes straight to Team Chat › Time-in for management</li></ol><div class=\"wc-note\">No WeChat copy and no speed-test screenshot needed.</div>';\n    return n < 3 || redo ? '<div class=\"wc-steps\"><b>Send it to Team Chat › Time-in</b>' + inner + '</div>' : '<details class=\"wc-steps\"><summary>How to send it</summary>' + inner + '</details>'; }"
],
[
"  function tickHtml(p){ return '<button type=\"button\" class=\"wc-tick' + (p ? ' on' : '') + '\" id=\"wcTick\" aria-pressed=\"' + (p ? 'true' : 'false') + '\" onclick=\"wcTick1270()\"><span class=\"bx\">' + (p ? '✓' : '') + '</span><span>' + (p ? 'Posted in WeChat · ' + E(p.time || '') : 'Posted in WeChat') + '</span></button>'; }",
"  function tickHtml(p){ return '<div class=\"wc-st' + (p ? ' ok' : '') + '\" id=\"wcTick\" role=\"status\" aria-live=\"polite\">' + (p ? 'Sent to Time-in · ' + E(p.time || '') : 'Not sent yet') + '</div>'; }   /* 1496: the send state (was the \"Posted in WeChat\" tick) */"
],
[
"      ['wcCopy', 'wcSave'].forEach(function(id){ var b = document.getElementById(id); if(b) b.disabled = !!x.measuring; });\n      var nm = document.getElementById('wcNet'); if(nm) nm.textContent = x.measuring ? 'Checking internet… a few seconds · Copy picture turns on when it is done' : '';",
"      st.x = x; var rdy = !x.measuring && !!x.shot && !!x.time && !!x.status;   /* 1496 (Misty 18:02): nothing is sent until every part is there */\n      ['wcSend', 'wcCopy', 'wcSave'].forEach(function(id){ var b = document.getElementById(id); if(b) b.disabled = id === 'wcSend' ? (!rdy || !!st.busy) : !!x.measuring; });\n      var nm = document.getElementById('wcNet'); if(nm) nm.textContent = x.measuring ? 'Checking internet… a few seconds · Send to Time-in turns on when it is done' : !x.shot ? 'Your screen picture is kept on the laptop you timed in on · open Today there to send it' : !x.time || !x.status ? 'Your time-in is still saving… Send to Time-in turns on when it is saved' : '';"
],
[
"      st.measuring = x.measuring; if(!x.measuring && !st.chat1400 && window.chatTimein1400){ st.chat1400 = 1; try{ chatTimein1400(P.blob, x, st.redo); }catch(e){} } }",
"      st.measuring = x.measuring; if(window.chatQueued1495 && chatQueued1495('ti:' + (D.today || '') + (st.redo ? ':redo' : ''))) weak1496(x); }"
],
[
"<div class=\"wc-net\" id=\"wcNet\" aria-live=\"polite\">' + (!redo && !ti.speed && window.__netRun1273 ? 'Checking internet… a few seconds · Copy picture turns on when it is done' : '') + '</div>'",
"<div class=\"wc-net\" id=\"wcNet\" aria-live=\"polite\">' + (!redo && !ti.speed && window.__netRun1273 ? 'Checking internet… a few seconds · Send to Time-in turns on when it is done' : '') + '</div>'"
],
[
"      + '<div class=\"wc-btns\"><button class=\"btn teal\" id=\"wcCopy\" onclick=\"wcCopy1270()\" disabled>Copy picture</button><button class=\"btn ghost\" id=\"wcSave\" onclick=\"wcSave1270()\" disabled>Save picture</button></div>'",
"      + tickHtml(p) + '<div class=\"wc-btns\"><button class=\"btn teal\" id=\"wcSend\" onclick=\"wcSend1496()\" disabled>' + (p ? 'Send again' : 'Send to Time-in') + '</button></div><div class=\"wc-alt\"><button type=\"button\" id=\"wcCopy\" onclick=\"wcCopy1270()\" disabled>Copy picture for WeChat</button><span aria-hidden=\"true\">·</span><button type=\"button\" id=\"wcSave\" onclick=\"wcSave1270()\" disabled>Save picture</button></div>'"
],
[
"if(m) m.textContent = 'Copied ✓ · now paste it in the WeChat corner (Ctrl+V · ⌘V) and send' + (STEP && STEP.measuring ? ' · the internet check is still running: copy again in a few seconds for the full picture' : ''); }",
"if(m) m.textContent = 'Copied ✓ · you can paste it in WeChat too · Send to Time-in is what management checks'; }"
],
[
"  window.wcSave1270 = function(){ if(!PIC) return;",
"  /* 1496 (Misty 18:02–18:06): one tap sends the picture to Team Chat › Time-in · Sending / Sent / weak internet + Try again (kept until sent) */\n  /* (review 18:20) say \"weak\" only when the last reading is poor; a good reading means the connection dropped · the reading is labelled with its time */\n  window.failMsg1496 = function(sp, at){ sp = String(sp || ''); var q = typeof netQ === 'function' ? netQ(sp) : { lvl: '' }, e = typeof esc === 'function' ? esc : function(t){ return String(t); };\n    return q.lvl === 'weak' ? '<b>Your internet is weak · not sent yet.</b> Check your LAN cable / Wi-Fi, then tap Try again.<span class=\"wc-q\">Internet' + (at ? ' checked ' + e(at) : '') + ': ' + e(sp) + '</span><span class=\"wc-q\">It also keeps trying by itself.</span>'\n      : '<b>Not sent yet · connection dropped.</b> Check your LAN cable / Wi-Fi, then tap Try again.<span class=\"wc-q\">It also keeps trying by itself.</span>'; };\n  function weak1496(x){ var s = document.getElementById('wcTick'), b = document.getElementById('wcSend'); if(b){ b.disabled = false; b.textContent = 'Try again'; }\n    var at = STEP && STEP.redo ? STEP.redo.time : ((D && D.timeIn) || {}).time; if(s){ s.className = 'wc-st warn'; s.innerHTML = failMsg1496(x && x.speed, at || ''); } }\n  window.wcSend1496 = async function(){ var st = STEP; if(!st || !PIC || st.busy) return; var x = st.x || {}, b = document.getElementById('wcSend'), s = document.getElementById('wcTick');\n    if(x.measuring || !x.shot || !x.time || !x.status){ if(s){ s.className = 'wc-st'; s.textContent = 'Not ready yet · wait until the picture is complete'; } return; }\n    if(!window.chatTimein1400){ if(s){ s.className = 'wc-st no'; s.textContent = 'Team Chat is not available here · use Copy picture for WeChat'; } return; }\n    st.busy = 1; if(b){ b.disabled = true; b.textContent = 'Sending…'; } if(s){ s.className = 'wc-st'; s.textContent = 'Sending to Time-in…'; }\n    var r = await chatTimein1400(PIC.blob, x, st.redo); st.busy = 0; if(STEP !== st) return; b = document.getElementById('wcSend'); s = document.getElementById('wcTick');\n    if(r === true){ try{ window.wcTick1270(); }catch(e){} s = document.getElementById('wcTick'); if(s){ s.className = 'wc-st ok'; s.textContent = 'Sent to Time-in · ' + hmM(Date.now()); } if(b){ b.disabled = false; b.textContent = 'Send again'; } }\n    else if(r === 'queued') weak1496(x);\n    else { if(b){ b.disabled = false; b.textContent = 'Try again'; } if(s){ s.className = 'wc-st no'; s.textContent = 'Not sent' + (r && r.error ? ' · ' + r.error : '') + ' · tap Try again'; } } };\n  window.addEventListener('chq1495', function(ev){ var d = ev.detail || {}; if(!/^ti:/.test(d.k || '') || !d.ok) return; try{ window.wcTick1270(); }catch(e){} var s = document.getElementById('wcTick'), b = document.getElementById('wcSend');\n    if(s){ s.className = 'wc-st ok'; s.textContent = 'Sent to Time-in · ' + hmM(Date.now()); } if(b){ b.textContent = 'Send again'; b.disabled = false; } try{ if(VIEW === 'today') renderToday(); }catch(e){} });\n  window.wcSave1270 = function(){ if(!PIC) return;"
],
[
"    var mk = function(fn){ var li = document.createElement('div'); li.onclick = fn; return li; };",
"    var mk = function(fn){ var li = document.createElement('div'); li.onclick = fn; return li; }, wk = window.chatQueued1495 && chatQueued1495('ti:' + (D.today || ''));"
],
[
"v.push({ label: 'WeChat', red: false, title: 'Post your redo picture in the WeChat corner', sub: 'Internet re-checked ' + (MINE.redone.done_time || '') + ' · copy · paste · tick Posted', verb: 'Open',",
"v.push({ label: 'Time-in', red: false, title: 'Send your redo picture to Team Chat', sub: 'Internet re-checked ' + (MINE.redone.done_time || '') + ' · check it · tap Send to Time-in', verb: 'Open',"
],
[
"if(!posted()) v.push({ label: 'WeChat', red: false, title: 'Post your time-in picture in the WeChat corner', sub: 'Copy picture · paste it in the WeChat corner · tick Posted in WeChat', verb: 'Open',",
"if(!posted()) v.push({ label: 'Time-in', red: !!wk, title: wk ? 'Your time-in picture is not sent yet' : 'Send your time-in picture to Team Chat', sub: wk ? 'Check your LAN cable / Wi-Fi, then tap Try again' : 'Check the picture · tap Send to Time-in', verb: wk ? 'Try again' : 'Open',"
],
[
"Only the internet check, the screen picture and the location are taken again, then you post the new picture in the WeChat corner.",
"Only the internet check, the screen picture and the location are taken again, then you send the new picture to Team Chat › Time-in."
],
[
"<div class=\"small mute\">Time in here · then copy the time-in picture to our WeChat corner</div>",
"<div class=\"small mute\">Time in here · then send your time-in picture to Team Chat › Time-in</div>"
],
[
"After you time in, the app makes one picture for the WeChat corner · no speed-test screenshot needed.",
"After you time in, the app makes one picture and you send it to Team Chat › Time-in · no speed-test screenshot needed."
],
[
"' (30 min before class). Post your screenshot in the WeChat corner, then tap Time in.'",
"' (30 min before class). Time in on the app, then send your time-in picture to Team Chat › Time-in.'"
],
[
"(mgr ? '' : '<br>Post the same picture in the WeChat corner.'),",
"(mgr ? '' : '<br>Send your time-in picture to Team Chat › Time-in from Today.'),"
],
[
"  let RES_T = 0;\n  function res(",
"  let RES_T = 0, CI_CAP = null;\n  function res("
],
[
"      if(x && !x.pending){         res('ok', \"I'm in · \" + esc(nm), (x.time || hmNow()) + ' · ' + (x.status || 'saved') + (x.flag ? ' · ' + esc(x.flag) : '') + (x.proof || SHOT ? ' · screen proof saved' : '')); return; }",
"      if(x && !x.pending){ const cap = ('In, ' + nm + \"'s class · \" + (x.time || hmNow()) + (x.status ? ' · ' + x.status : '')).slice(0, 140), can = !!(SHOT && window.chatSend1495);   /* 1496: the class check-in goes to Time-in in one tap */\n        res('ok', \"I'm in · \" + esc(nm), (x.time || hmNow()) + ' · ' + (x.status || 'saved') + (x.flag ? ' · ' + esc(x.flag) : '') + (x.proof || SHOT ? ' · screen proof saved' : '')\n          + (can ? '<div class=\"ci-pv\"><img alt=\"Screen proof that will be sent\" src=\"data:image/jpeg;base64,' + SHOT + '\"><div><span>Will be sent to Team Chat › Time-in</span>' + esc(cap) + '</div></div>' : ''),\n          can ? '<button class=\"btn teal block\" id=\"ciSend\" onclick=\"ciSend1496(\\'' + esc(id) + '\\')\">Send to Time-in</button><div class=\"ci-st\" id=\"ciSt\" role=\"status\" aria-live=\"polite\"></div>' : '');\n        if(can){ clearTimeout(RES_T); CI_CAP = { id: id, cap: cap, shot: SHOT, day: D.today || '', time: x.time || '', net: x.speed || (x.net && x.net.speed) || '' }; } return; }"
],
[
"  window.tapResClose = () => {",
"  window.ciSend1496 = async function(id){ const c = CI_CAP; if(!c || c.id !== id || c.busy || c.sent) return; c.busy = 1; let b = document.getElementById('ciSend'), s = document.getElementById('ciSt');\n    if(b){ b.disabled = true; b.textContent = 'Sending…'; } if(s){ s.className = 'ci-st'; s.textContent = ''; }\n    const k = 'ci:' + c.day + ':' + id, r = await window.chatSend1495('send', { gid: 'timein', body: c.cap, img: 'data:image/jpeg;base64,' + c.shot, cid: ('ci-' + c.day + '-' + id).slice(0, 40) }, k, 'Class check-in', typeof c.net === 'string' ? c.net : '');\n    c.busy = 0; b = document.getElementById('ciSend'); s = document.getElementById('ciSt');\n    if(r === true){ c.sent = 1; if(b){ b.textContent = 'Sent to Time-in ✓'; } if(s){ s.className = 'ci-st ok'; s.textContent = ''; } RES_T = setTimeout(tapResClose, 2500); }\n    else if(r === 'queued'){ if(b){ b.disabled = false; b.textContent = 'Try again'; } if(s){ s.className = 'ci-st warn'; s.innerHTML = window.failMsg1496 ? failMsg1496(typeof c.net === 'string' ? c.net : '', c.time || '') : 'Not sent yet · tap Try again'; } }\n    else { if(b){ b.disabled = false; b.textContent = 'Try again'; } if(s){ s.className = 'ci-st no'; s.textContent = 'Not sent' + (r && r.error ? ' · ' + r.error : '') + ' · tap Try again'; } } };\n  window.addEventListener('chq1495', ev => { const d = ev.detail || {}, c = CI_CAP; if(!c || !d.ok || d.k !== 'ci:' + c.day + ':' + c.id) return; c.sent = 1; const b = document.getElementById('ciSend'), s = document.getElementById('ciSt'); if(b){ b.disabled = true; b.textContent = 'Sent to Time-in ✓'; } if(s){ s.className = 'ci-st ok'; s.textContent = ''; } });\n  window.tapResClose = () => {"
],
[
"      + '<div class=\"wc-copied\" id=\"wcMsg\" aria-live=\"polite\"></div>' + tickHtml(p) + '</div>');",
"      + '<div class=\"wc-copied\" id=\"wcMsg\" aria-live=\"polite\"></div></div>');"
],
[
"</body>\n</html>",
"<style id=\"css1496\">\n/* 1496 · Send to Time-in (time-in picture and \"I'm in\") */\n.wc70 .wc-btns #wcSend{min-width:200px}\n.wc70 .wc-alt{display:flex;gap:6px;align-items:center;justify-content:center;margin-top:6px;color:#8A879E;font-size:13px}\n.wc70 .wc-alt button{background:none;border:0;padding:4px 2px;color:#5E5A76;font:500 13px Inter,sans-serif;text-decoration:underline;cursor:pointer}.wc70 .wc-alt button:disabled{opacity:.45;cursor:default}\n.wc-st{margin:10px 0 2px;padding:10px 12px;border-radius:12px;background:#F3F4F7;color:#4C4868;font-size:14px;line-height:1.45;text-align:left}\n.wc-st.ok{background:#E7F6EF;color:#16704C;font-weight:600}.wc-st.no{background:#FDECEA;color:#9B2C1F}\n.wc-st.warn{background:#FFF1DC;color:#7A4A0E;border:1.5px solid #E7A33E}.wc-st .wc-q{display:block;margin-top:4px;font-size:13px}\n#tapRes .ci-pv{display:flex;gap:10px;align-items:center;margin-top:12px;padding:8px;border:1px solid #E8ECF0;border-radius:12px;text-align:left}\n#tapRes .ci-pv img{width:96px;height:60px;object-fit:cover;border-radius:8px;flex:none}#tapRes .ci-pv div{font-size:13px;color:#2B2253;line-height:1.35}#tapRes .ci-pv span{display:block;font-size:11px;color:#6E6A85;margin-bottom:2px}\n#tapRes .ci-st{font-size:13px;line-height:1.45;text-align:left;border-radius:10px}#tapRes .ci-st.warn{background:#FFF1DC;color:#7A4A0E;border:1.5px solid #E7A33E;padding:9px 11px}#tapRes .ci-st .wc-q{display:block;margin-top:4px}#tapRes .ci-st.no{background:#FDECEA;color:#9B2C1F;padding:9px 11px}\n</style>\n</body>\n</html>"
]
]);
