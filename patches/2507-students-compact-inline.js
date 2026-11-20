// 2507: 2506 follow-up · the grid measured the wrapping flex line at its narrowest (rows stayed 113 px on a laptop);
//   the details under the name now sit inline, so a row is two lines when there is room and wraps (never cuts) when there is not.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["#v-astudents .li.sa .grow{display:flex;flex-wrap:wrap;align-items:center;gap:3px 8px}", "#v-astudents .li.sa .grow{display:block}"],
  ["#v-astudents .li.sa .grow>.row{flex:1 1 100%;min-width:0}", "#v-astudents .li.sa .grow>.row{margin-bottom:2px}"],
  ["#v-astudents .li.sa .grow>.small.mute{flex:0 1 auto;white-space:normal;overflow:visible;text-overflow:clip}", "#v-astudents .li.sa .grow>.small.mute{display:inline;white-space:normal;overflow:visible;text-overflow:clip;margin-right:8px;vertical-align:middle}"],
  ["#v-astudents .li.sa .grow>.tags{margin-top:0!important;display:inline-flex;flex-wrap:wrap;gap:4px}", "#v-astudents .li.sa .grow>.tags{margin:0 8px 0 0!important;display:inline-flex;flex-wrap:wrap;gap:4px;vertical-align:middle}"],
  ["#v-astudents .li.sa .grow>div:has(>.sa-src){display:inline-flex;max-width:100%}", "#v-astudents .li.sa .grow>div:has(.sa-src){display:inline-flex;max-width:100%;vertical-align:middle}"]
]);
