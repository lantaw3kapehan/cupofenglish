// 1497: (Misty 19:58) fix-forward for 1496 · only the very first time-in of the day posts to Team Chat › Time-in: "I'm in" for later
//   classes is recorded exactly as before but never offers or posts a picture (queued ones are dropped); the screen picture waits
//   for a fresh frame after the cover blanks (time-in rules unchanged: it is never blocked), and a picture that only shows this
//   app's cover is not sent to Time-in ("Retake screen picture"). (Misty 20:06) No WeChat in the teacher time-in channel: Copy for
//   WeChat and Save picture are gone (Send to Time-in is the single action); management's chips say Sent to Time-in.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
[
"const cap = ('In, ' + nm + \"'s class · \" + (x.time || hmNow()) + (x.status ? ' · ' + x.status : '')).slice(0, 140), can = !!(SHOT && window.chatSend1495);",
"const cap = ('In, ' + nm + \"'s class · \" + (x.time || hmNow()) + (x.status ? ' · ' + x.status : '')).slice(0, 140), can = false;   /* 1497 (Misty 19:58): only the first time-in of the day posts to Time-in · later classes are recorded as before, never posted */"
],
[
"if(!it || Date.now() - it.at > 18 * 36e5){ var q = qRead(); delete q[k]; qWrite(q); continue; }",
"if(!it || /^ci:/.test(k) || Date.now() - it.at > 18 * 36e5){ var q = qRead(); delete q[k]; qWrite(q); if(/^ci:/.test(k)){ try{ post('pend', { k: k, off: 1 }).catch(function(){}); }catch(e){} } continue; }   /* 1497: queued class check-ins are dropped */"
],
[
"if(ob) ob.innerHTML = '';   /* blank cover",
"if(ob) ob.innerHTML = ''; await new Promise(function(z){ setTimeout(z, 900); });   /* 1497: a fresh frame, never the cover text · blank cover"
],
[
"st.x = x; var rdy = !x.measuring && !!x.shot && !!x.time && !!x.status;",
"st.x = x; if(x.shot && st.selfFor !== x.shot){ st.selfFor = x.shot; st.self = await selfShot1497(x.shot); } x.self = !!(x.shot && st.self); var rdy = !x.measuring && !!x.shot && !x.self && !!x.time && !!x.status;\n      var rb = document.getElementById('wcRetake'); if(rb) rb.hidden = !x.self;"
],
[
"var nm = document.getElementById('wcNet'); if(nm) nm.textContent = x.measuring ?",
"var nm = document.getElementById('wcNet'); if(nm) nm.textContent = x.self ? 'Your screen picture shows this app, not your class · tap Retake screen picture, Share, then click your VooV window' : x.measuring ?"
],
[
"<div class=\"wc-alt\"><button type=\"button\" id=\"wcCopy\" onclick=\"wcCopy1270()\" disabled>Copy picture for WeChat</button><span aria-hidden=\"true\">·</span><button type=\"button\" id=\"wcSave\" onclick=\"wcSave1270()\" disabled>Save picture</button></div>",
"<div class=\"wc-alt\"><button type=\"button\" id=\"wcRetake\" onclick=\"wcRetake1497()\" hidden>Retake screen picture</button></div>"
],
[
"No WeChat copy and no speed-test screenshot needed.",
"No speed-test screenshot needed."
],
[
"im.alt = 'Time-in picture for the WeChat corner';",
"im.alt = 'Time-in picture for Team Chat';"
],
[
"s.textContent = 'Team Chat is not available here · use Copy picture for WeChat'; }",
"s.textContent = 'Team Chat is not available here · open Team Chat once, then tap Send to Time-in again'; }"
],
[
"re-checks internet, screen and location, and posts a new picture in the WeChat corner.</div>'",
"re-checks internet, screen and location, and sends a new picture to Team Chat › Time-in.</div>'"
],
[
"(o.posted ? '<span class=\"wc-chip ok\" title=\"Posted the time-in picture in the WeChat corner\">WeChat ✓ ' + E(o.posted) + '</span>' : '<span class=\"wc-chip no\">WeChat not posted</span>')",
"(o.posted ? '<span class=\"wc-chip ok\" title=\"Sent the time-in picture to Team Chat › Time-in\">Sent to Time-in ✓ ' + E(o.posted) + '</span>' : '<span class=\"wc-chip no\">Not sent to Time-in</span>')"
],
[
"(o.posted ? '<span class=\"wc-chip ok\">WeChat ✓</span>' : '<span class=\"wc-chip no\">WeChat –</span>')",
"(o.posted ? '<span class=\"wc-chip ok\">Time-in ✓</span>' : '<span class=\"wc-chip no\">Time-in –</span>')"
],
[
"!mgr && SHOT ? '<button class=\"btn teal block\" onclick=\"tapCopyShot()\">Copy picture for WeChat</button>' : ''",
"''"
],
[
"return toast('Post your screenshot in the WeChat corner first');",
"return toast('Tap Time in again');"
],
[
"  window.wcSend1496 = async function(){",
"  window.wcRetake1497 = async function(){ if(!STEP || typeof window.grabScreen !== 'function') return; var r = await window.grabScreen(); if(r && r.b64){ STEP.shot = r.b64; STEP.self = null; STEP.selfFor = null; PIC = null; var pv = document.getElementById('wcPrev'); if(pv) pv.innerHTML = '<div class=\"wc-wait\">Making the picture…</div>'; render(); } };\n  window.wcSend1496 = async function(){"
],
[
"</body>\n</html>",
"<script>\n/* 1497 (Misty 19:58) · the screen picture must show the class, never this app */\nwindow.selfShot1497 = function(b64){ return new Promise(function(z){ if(!b64) return z(false); var im = new Image(); im.onload = function(){ try{ var c = document.createElement('canvas'); c.width = 64; c.height = 36; var g = c.getContext('2d'); g.drawImage(im, 0, 0, 64, 36);\n    var d = g.getImageData(0, 0, 64, 36).data, n = 0, cov = 0, lt = 0; for(var i = 0; i < d.length; i += 4){ n++; var r = d[i], gg = d[i + 1], bb = d[i + 2]; if(r > 225 && gg > 225 && bb > 225) lt++; if(Math.abs(r - 243) < 10 && Math.abs(gg - 246) < 10 && Math.abs(bb - 247) < 10) cov++; }\n    z(lt / n > 0.8 && cov / n > 0.3); }catch(e){ z(false); } }; im.onerror = function(){ z(false); }; im.src = 'data:image/jpeg;base64,' + b64; }); };\n</script>\n</body>\n</html>"
]
]);
