// 2508: rows not yet drawn hold the compact height (76 px laptop, 120 px phone) so the scroll bar matches the compact list.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["#v-astudents a.li.sa{content-visibility:auto;contain-intrinsic-size:auto 96px}", "#v-astudents a.li.sa{content-visibility:auto;contain-intrinsic-size:auto 76px}"],
  ["@media(max-width:620px){#v-astudents a.li.sa{contain-intrinsic-size:auto 150px}}", "@media(max-width:620px){#v-astudents a.li.sa{contain-intrinsic-size:auto 120px}}"]
]);
