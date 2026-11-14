// 2217 (14 Nov): (1) the lesson-summary "lessons before the start date" step wrote to a bare _adj1886, which only exists in a browser;
// the student/partner portal re-runs this code on the server, so 31 students showed 核对中 Being checked ("_adj1886 is not defined").
// Now it writes window._adj1886 (same object in the browser). (2) Overview footer: a long App check message stays on 2 lines.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
 ["if(t > 0){ _adj1886[x.i] = t;", "if(t > 0){ window._adj1886[x.i] = t;"],
 [".ov2 .o2-foot a{color:#00707A}", ".ov2 .o2-foot a{color:#00707A}\n.ov2 .o2-foot>span:not(:first-child){display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;flex:1 1 300px;min-width:0}"]
]);
