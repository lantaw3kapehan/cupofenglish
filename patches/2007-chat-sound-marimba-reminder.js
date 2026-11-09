// 2007 (9 Nov 16:42, Misty: "messages should be the marimba sound in that 15 min before, I want that sound for all messages"):
//   every Team Chat sound is now the Marimba "15 min before" sample (C–G, two notes). New message: chat-marimba.wav, once.
//   Tagged / Needs reply / direct message: the same sound twice (chat-marimba-x2.wav), so those still stand out. Replaces 2005's files.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["AUN = new Audio('chat-msg-marimba.wav');", "AUN = new Audio('chat-marimba.wav');"],
  ["AU = new Audio('chat-alert-marimba.wav');", "AU = new Audio('chat-marimba-x2.wav');"],
]);
