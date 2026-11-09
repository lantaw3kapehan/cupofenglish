// 2005 (9 Nov, Misty: "for all messages marimba · so it's distinctive to CupOfEnglish chat"): Team Chat sounds are now our own marimba.
//   chat-msg-marimba.wav: an ordinary group message (two quick notes, E–A). chat-alert-marimba.wav: tagged, Needs reply or a direct
//   message (C–E–G, played twice). New file names, so phones that kept the old sounds load the new ones. Class/time-in sound unchanged.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["AUN = new Audio('chat-msg.wav');", "AUN = new Audio('chat-msg-marimba.wav');   /* 2005 */"],
  ["AU = new Audio('chat-alert.wav');", "AU = new Audio('chat-alert-marimba.wav');   /* 2005 */"],
]);
