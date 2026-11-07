// 1856: the online IELTS trial label shows the Speaking CEFR when there is no Writing ("IELTS 6.0 · B2"; coe-assess v6 lists cefr_sp).
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [["(a.cefr ? ' \\u00b7 ' + a.cefr : '')", "((a.cefr || a.cefr_sp) ? ' \\u00b7 ' + (a.cefr || a.cefr_sp) : '')"]]);
