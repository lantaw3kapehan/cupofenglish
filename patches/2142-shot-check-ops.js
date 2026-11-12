// 2142 (12 Nov, Misty 17:45: "let Celine check and mark"): the picture check never locks by itself. When it sees a Wi-Fi icon,
// To do › Fix these shows "Teacher X · the picture check sees a Wi-Fi icon …" with three buttons:
//   See picture (opens it) · Wi-Fi · warn the teacher (the 2135 warning + lock, with the picture as proof) · It's the LAN cable (dismiss).
// Server: coe_ops_check lists coe_shot_read rows read as wifi today (kind 'shot'), unless the teacher is already flagged that day.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
  ["(x.kind === 'wifi' ? '<button type=\"button\" class=\"go\" onclick=\"wf2135Close(",
   "(x.kind === 'shot' ? '<a class=\"btn\" style=\"text-decoration:none\" target=\"_blank\" rel=\"noopener\" href=\"' + String(x.proof || '').replace(/[\"<>]/g, '') + '\">See picture</a>'"
   + " + '<button type=\"button\" class=\"go\" onclick=\"wf2135Flag(\\'' + String(x.teacher || '').replace(/[^A-Za-z .-]/g, '') + '\\',\\'' + String(x.proof || '').replace(/[^A-Za-z0-9:\\/._%-]/g, '') + '\\')\">Wi-Fi · warn the teacher</button>'"
   + " + '<button type=\"button\" onclick=\"o2091ok(' + i + ', this)\">It\\'s the LAN cable</button></div></div>' : "
   + "x.kind === 'wifi' ? '<button type=\"button\" class=\"go\" onclick=\"wf2135Close("],
]);
