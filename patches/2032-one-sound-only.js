// 2032 (9 Nov 21:04, Misty: "messages marimba once, soft bell for time-ins … I'm hearing an extra sound but not on Team Chat"):
//   the extra sound was the computer's / phone's own notification sound, which played on top of the app's marimba (messages) or
//   soft bell (class and time-in reminders). While the app is on screen, its notifications now come silently, so only the app's own
//   sound plays. When the app is closed or hidden, the notification keeps the system sound (the app cannot play there).
//   The same rule is in sw.js for notifications sent by the database.
const file = process.argv[2];
require('../tools/lib.js')(file, [
 [
  "const o = { body, tag, renotify: true, silent: !!hush, vibrate: hush ? [] : [200,100,200],",
  "if(!hush && document.visibilityState === 'visible') hush = true;   /* 2032: on screen → the app's own sound only */\nconst o = { body, tag, renotify: true, silent: !!hush, vibrate: hush ? [] : [200,100,200],"
 ]
]);
