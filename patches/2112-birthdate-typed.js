// 2112 (12 Nov 11:56): a birthdate typed in the student form is always sent with the save. Source: patches/src/2112-birthdate-typed.client.js
const lib = require("../tools/lib.js"), fs = require("fs"), path = require("path"), file = process.argv[2];
const JS = fs.readFileSync(path.join(__dirname, "src/2112-birthdate-typed.client.js"), "utf8");
lib(file, [
  ['<script id="t2060">', '<style id="d2112">\n/* 2112: the parent email on the student page is never cut ("348699202@qq.co"): it stays on one line and moves down whole */\n#sheetBody .em-chip{white-space:nowrap!important;overflow-wrap:normal!important;word-break:keep-all!important;flex:0 0 auto;max-width:none!important}\n</style>\n<script id="b2112">\n' + JS + '</script>\n<script id="t2060">'],
  ["          else if(!ISO.test(String(f.birth == null ? '' : f.birth).trim()) && !f.birthClear){ f.birth = ''; f.birthKeep = 1; } } }catch(e){ console.warn('960 save', e); } }",
   "          else if(!ISO.test(String(f.birth == null ? '' : f.birth).trim()) && !f.birthClear){ f.birth = ''; f.birthKeep = 1; }\n" +
   "          try{ const K = String(f.code || '').toUpperCase(), TY = window.__bd2112T && window.__bd2112T[K]; if(TY && Date.now() - TY.t < 9e5 && !f.birthClear){ f.birth = TY.v; delete f.birthKeep; delete window.__bd2112T[K]; } }catch(e){}   /* 2112: a typed date always goes */ } }catch(e){ console.warn('960 save', e); } }"]
]);
