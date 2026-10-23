// 663: (Misty) one click — Course books opens straight to the finished picture with Copy picture / Copy search words / Copy covers.
// The edit screen (title, search words, replace covers, all books) is behind "Edit" (management). No covers yet → the edit screen as before.
require('../tools/lib.js')(process.argv[2], [
[
"CUR = { code: key(book), en: en || '', cn: cn || '' }; if(!rowOf(CUR.code)) await load(true); else load(); sheet();",
"CUR = { code: key(book), en: en || '', cn: cn || '' }; if(!rowOf(CUR.code)) await load(true); else load();\n    if((rowOf(CUR.code) || {}).sb_cover) return bbPic();   /* 663: straight to the picture */\n    sheet();"
],
[
"if(z && z.msg) toast(z.msg); if(CUR) sheet();",
"if(z && z.msg) toast(z.msg); if(CUR){ if((rowOf(CUR.code) || {}).sb_cover) bbPic(); else sheet(); }"
],
[
"<button class=\"btn ghost block\" style=\"margin-top:10px\" onclick=\"bbOpen(\\'' + esc(CUR.code) + '\\',\\'' + esc(CUR.en) + '\\',\\'' + esc(CUR.cn) + '\\')\">Back</button>",
"' + (mgr() ? '<div style=\"text-align:center;margin-top:10px\"><a class=\"link small\" onclick=\"bbEdit()\">Edit title, search words or covers</a> · <a class=\"link small\" onclick=\"bbAll()\">All books</a></div>' : '') + '"
],
[
"window.bbGive = () =>",
"window.bbEdit = () => { if(CUR) sheet(); };\n  window.bbGive = () =>"
]
]);
