// 2639: on Operations' "From the President", the note is signed "President" (the President's account name is CupOfEnglish).
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["'<div class=\"fpn\"><b>' + E(x.by || 'President') + '</b>", "'<div class=\"fpn\"><b>President</b>"],
]);
