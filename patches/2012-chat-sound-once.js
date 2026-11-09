// 2012 (9 Nov 17:11, Misty: "for the messages on chat, 1 sound is enough, no need double or triple"): every Team Chat sound plays the
//   marimba once. Tags, Needs reply and direct messages used chat-marimba-x2.wav (two notes twice) AND played it twice (four times).
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["n = kind === 'msg' ? 1 : 2;", "n = 1;   /* 2012: once */"],
  ["AU = new Audio('chat-marimba-x2.wav');", "AU = new Audio('chat-marimba.wav');   /* 2012 */"],
]);
