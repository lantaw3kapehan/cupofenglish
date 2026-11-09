// 2008 (9 Nov 16:45–16:49, Misty: teachers "tend to be chatting while having classes" · "emphasize chat apps like Facebook and focus only
//   in class" · "if there are messages from management they should see it" · "if it's an important message from management they
//   should see and attend to it"). The app cannot see Facebook or other apps (browsers keep them apart); what it can do:
//   · Class reminders say to close Facebook, Messenger and other chat apps and focus on the student.
//   · Team Chat stays quiet during the teacher's own class, as before, EXCEPT messages from management: they sound at once, with a
//     message on screen, and reach the phone (coe_chat_out, 2008). Server: coe-chat v21 sends fromMg per chat.
//   · A teacher who posts in a group chat during her own class gets a "Focus on your class" reminder (server answers cls; the
//     database notes it in coe_class_chat). Her chat with management, Time-in posts and replies to management do not count.
const file = process.argv[2];
const FN = "  /* 2008 \u00b7 \"Focus on your class\": a teacher posted in a group chat while her own class is running (one sheet per class, then a short message) */\n  window.focus2008 = function(c){ try{\n    var until = c && c.until ? new Date(c.until).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Manila' }) : '';\n    var who = c && c.student ? c.student : 'your student', k = 'coe.focus2008.' + (c && c.until || ''), seen = false;\n    try{ seen = sessionStorage.getItem(k) === '1'; sessionStorage.setItem(k, '1'); }catch(e){}\n    var line = 'You are in class with ' + who + (until ? ' until ' + until : '') + '.';\n    if(seen || typeof openSheet !== 'function'){ toast2(line + ' Please focus on your class.'); return; }\n    var e = function(s){ return String(s).replace(/[&<>\"]/g, function(x){ return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;' }[x]; }); };\n    openSheet('<h2 style=\"font-family:\\'Fredoka One\\',sans-serif;font-weight:400;margin:0 0 6px\">Focus on your class</h2>' +\n      '<div style=\"font-size:16px;line-height:1.55\">' + e(line) + ' Team Chat can wait until the class ends.</div>' +\n      '<div style=\"font-size:16px;line-height:1.55;margin-top:8px\">Please close Facebook, Messenger and other chat apps. Your student deserves your full attention.</div>' +\n      '<div style=\"color:#5E6272;font-size:14px;line-height:1.5;margin-top:8px\">Messages from management still reach you during class. Chat posts during class are noted.</div>' +\n      '<button class=\"btn teal\" style=\"margin-top:14px;width:100%\" onclick=\"closeSheet()\">Back to my class</button>');\n  }catch(e){} };";
require('../tools/lib.js')(file, [
  ["var AU = null, AUOK = false, ATN = -1, HOLD = 0;", "var AU = null, AUOK = false, ATN = -1, HOLD = 0, FMN = -1;   /* 2008: FMN = unread from management */\n" + FN],
  ["    if(ATN < 0){ ATN = n; UN = u; return; } var up = n > ATN, upU = u > UN; ATN = n; UN = u;\n    if(up || upU) flash(unreadAll());\n    if(r.inClass){ if(up) HOLD = 1; return; }",
   "    var fmN = G.reduce(function(a, g){ return a + (g.fromMg || 0); }, 0), upM = FMN >= 0 && fmN > FMN; FMN = fmN;   /* 2008 */\n" +
   "    if(ATN < 0){ ATN = n; UN = u; return; } var up = n > ATN, upU = u > UN; ATN = n; UN = u;\n    if(up || upU || upM) flash(unreadAll());\n" +
   "    if(r.inClass){ if(upM){ HOLD = 0; if(!AUOK){ HOLD = 2; showTap(); } chime(true); try{ toast2('New message from management. Please read it in Team Chat now.'); }catch(e){} return; } if(up) HOLD = 1; return; }   /* 2008: management gets through during class */"],
  ["        if(r && r.ok){ if(S.data){ var ix = S.data.msgs.indexOf(tmp);",
   "        if(r && r.ok && r.cls) try{ focus2008(r.cls); }catch(e){}   /* 2008 */\n        if(r && r.ok){ if(S.data){ var ix = S.data.msgs.indexOf(tmp);"],
  ["(c === first && !D.timeIn ? ' · laptop, LAN, share entire screen' : ''));",
   "(c === first && !D.timeIn ? ' · laptop, LAN, share entire screen' : '') + ' · close Facebook and chat apps');   /* 2008 */"],
  [". Open VooV and tap I\\'m in.', 'coe-now-' + c.id, true); }",
   ". Open VooV and tap I\\'m in. Close Facebook, Messenger and other chat apps, and focus on your student until the class ends.', 'coe-now-' + c.id, true); }   /* 2008 */"],
]);
