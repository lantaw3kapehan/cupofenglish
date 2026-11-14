// 2198 (14 Nov · Misty's screenshot): in the China dates list the purple "school exams" rows were squeezed into a narrow column,
// because the class name "x" is already used elsewhere in the app. The four kinds now use their own class names (k-h, k-x, k-i, k-w).
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
 [".cn95 .h{background:#FFF3EF}.cn95 .h b{color:#A4402A}\n.cn95 .x{background:#F1EFFB}.cn95 .x b{color:#4A3FA8}\n.cn95 .i{background:#E8F5F4}.cn95 .i b{color:#00626A}\n.cn95 .w{background:#fff;border:1.5px dashed #8A80D6}.cn95 .w b{color:#4A3FA8}",
  ".cn95 .it.k-h{background:#FFF3EF}.cn95 .k-h b{color:#A4402A}\n.cn95 .it.k-x{background:#F1EFFB}.cn95 .k-x b{color:#4A3FA8}\n.cn95 .it.k-i{background:#E8F5F4}.cn95 .k-i b{color:#00626A}\n.cn95 .it.k-w{background:#fff;border:1.5px dashed #8A80D6}.cn95 .k-w b{color:#4A3FA8}"],
 [".cn95t.h{background:#FFF3EF;color:#A4402A}.cn95t.x{background:#F1EFFB;color:#4A3FA8}.cn95t.i{background:#E8F5F4;color:#00626A}.cn95t.w{background:#fff;color:#4A3FA8;border:1px dashed #8A80D6}",
  ".cn95t.k-h{background:#FFF3EF;color:#A4402A}.cn95t.k-x{background:#F1EFFB;color:#4A3FA8}.cn95t.k-i{background:#E8F5F4;color:#00626A}.cn95t.k-w{background:#fff;color:#4A3FA8;border:1px dashed #8A80D6}"],
 ["const item = x => '<div class=\"it ' + x.k + '\">", "const item = x => '<div class=\"it k-' + x.k + '\">"],
 ["'<span class=\"cn95t ' + x.k + '\">'", "'<span class=\"cn95t k-' + x.k + '\">'"]
]);
