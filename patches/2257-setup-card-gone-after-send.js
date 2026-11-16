// 2257 (Misty 16 Nov 11:04): once the Teaching setup picture is sent to Operations, the card leaves the teacher's Today.
// It comes back only when Operations asks for a fix ("Fix needed", with the note and Take a new picture), or next month.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [[
 "if(!ME || st === 'Approved'){ if(c) c.remove(); return; }",
 "if(!ME || st === 'Approved' || st === 'Waiting'){ if(c) c.remove(); return; }   /* 2257: sent = off Today until Operations asks for a fix */"
]]);
