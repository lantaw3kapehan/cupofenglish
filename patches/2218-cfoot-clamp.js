// 2218: the calm Overview footer (Phone alerts › · App check text · App check ›) keeps a long App check message to 2 lines.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [[".c-foot{display:flex;flex-wrap:wrap;gap:8px 18px;font-size:13px;color:#6C6786;padding:0 4px}",
 ".c-foot{display:flex;flex-wrap:wrap;gap:8px 18px;font-size:13px;color:#6C6786;padding:0 4px}\n.c-foot>span{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;flex:1 1 100%;min-width:0}"]]);
