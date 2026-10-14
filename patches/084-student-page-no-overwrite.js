// 14 Oct · Bug (Misty): tapping "Picture to send" on a student page the first time seemed to do nothing. The page's fresh data
// arrived a moment later and redrew the student page over the picture. Now the fresh data only redraws when the student page
// (or its loading screen) is still the one on screen, and only for the student last opened.
require('../tools/lib.js')(process.argv[2], [
["const k = 'coe.stu.' + code; let kept0 = null;",
 "window._stuOpen = code; const k = 'coe.stu.' + code; let kept0 = null;"],
["else openSheet(`<div class=\"paper\" style=\"display:none\"></div><h1>${esc(s.name)}</h1>",
 "else openSheet(`<div class=\"paper\" style=\"display:none\"></div><h1 id=\"stuLoad\">${esc(s.name)}</h1>"],
["if(!$('sheet').classList.contains('on')) return;\nSTU = {s, r, code,",
 "if(!$('sheet').classList.contains('on') || window._stuOpen !== code || (!$('stuSch') && !$('stuLoad'))) return;   /* 14 Oct: another card is open now (picture, agreement…) */\nSTU = {s, r, code,"],
]);
