// 1977: (Misty 9 Nov 13:51 "the management screen is on" → the same check as 1965 on every management screen, laptop 1440 and phone 390)
//   Result: no screen scrolls sideways on laptop or phone (the wide rows are the tab and filter strips, which scroll inside themselves),
//   no AM/PM times, no page errors. Fixed: the learner chips on Students (Early Years, Young Learners, Teens, Adults) and the "Learner"
//   label were 11 px; they are now 12 px, like the other chips.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ['<style id="s1965">/* 1965: website feel */\n', '<style id="s1965">/* 1965: website feel */\n.lt1588,.ltf1590>span{font-size:12px!important}\n'],
]);
