// 2415 (Misty 19 Nov 13:19, Celine: the text typed on a screenshot is too big) · the markup text was 8 × the line width (128 px on a
//   laptop screenshot, many times bigger than the screenshot's own words). It is now 3 × (about 48 px on a laptop screenshot, near the
//   size of a heading there), never under 16 px.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["else if(o.t === 'text'){ var fs = Math.round(o.w * 8);", "else if(o.t === 'text'){ var fs = Math.max(16, Math.round(o.w * 3));"]
]);
