// 2063 (10 Nov 20:19, Misty: "for the near class reminder can you remove the headphone message … Just like this:
//   Class starts at 20:00. / 20:00开始上课。 then the meeting id"). One of the four "starts soon" wordings mentioned headphones.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
  ["['Class starts at {t}. Please have your headphones ready.', '{t}开始上课，请准备好耳机。']",
   "['Class starts at {t}.', '{t}开始上课。']"]
]);
