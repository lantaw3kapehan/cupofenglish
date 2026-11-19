// 2458 (Misty 18:05 "the teacher's screen … not opening in a new tab but still in the same app screen · we solved this already") ·
//   teachers: Talk of the Day opens in a new tab again (as 2433 · full screen "Open in class" for the student) · management keeps
//   the in-app screen (2455).
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["window.talk2455 = function(id){ try{ ensure();", "window.talk2455 = function(id){ if(!(typeof D !== 'undefined' && D && D.mgr)){ window.open('talk/' + (id ? '?t=' + encodeURIComponent(id) : ''), '_blank'); return false; }   /* 2458: teachers · new tab */\n    try{ ensure();"]
]);
