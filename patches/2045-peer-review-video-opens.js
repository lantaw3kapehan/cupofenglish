// 2045 (10 Nov 10:01, Misty: "Kat is not done yet with peer review and she can no longer open the video"): 2035 stopped teachers
//   opening class videos in Drive, but its test also caught the peer-review "▶ Watch the class" button (and would catch training
//   and coaching recordings), which teachers must open. Those links open again: anything inside a peer review, a training or a
//   coaching, or a link that says "Watch", is never blocked. Only a teacher's own class video / screen-proof links stay blocked.
const file = process.argv[2];
require('../tools/lib.js')(file, [
 ["if(!/video|screen ?proof|recording|v1880|vm-c|▶|📷|SCREENPROOF|\\.mp4|\\.mov|\\.webm/i.test(t)) return;",
  "if(/watch|training|coach|peer|review|recording/i.test(t) || (typeof PRF !== 'undefined' && PRF && a.closest('#sheetBody')) || a.closest('[class*=\"pr\"],[class*=\"peer\"],[class*=\"tr1\"],[class*=\"coach\"],[id*=\"peer\"],[id*=\"Peer\"],[id*=\"train\"],[id*=\"coach\"]')) return;   /* 2045: peer review, trainings and coaching always open */\n  if(!/video|screen ?proof|v1880|vm-c|▶|📷|SCREENPROOF|\\.mp4|\\.mov|\\.webm/i.test(t)) return;"]
]);
