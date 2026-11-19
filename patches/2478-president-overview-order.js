// 2478 (Misty 20:32 "make live the fix and improvements" · audit D): the President's Overview puts oversight first:
//   greeting → Needs you → From Operations (was 1,768 px down) → Lates → Teachers today → From teachers → Business → Quality → footer → Christmas → China dates.
const file = process.argv[2];
const CSS = `<style id="u2478">#v-home:has(> #pd2360) .x-top{order:1!important}#v-home:has(> #pd2360) .nd37{order:2!important}#v-home:has(> #pd2360) > #pd2360{order:3!important}
#v-home:has(> #pd2360) > #lqmBox{order:4!important}#v-home:has(> #pd2360) .ovMon{order:5!important}#v-home:has(> #pd2360) > #fd1806{order:6!important}
#v-home:has(> #pd2360) .ov-two{order:7!important}#v-home:has(> #pd2360) .g890-risk{order:8!important}#v-home:has(> #pd2360) .c-foot{order:9!important}
#v-home:has(> #pd2360) > #x21c{order:10!important}#v-home:has(> #pd2360) > .cn95{order:11!important}</style>
`;
require('../tools/lib.js')(file, [
  ["schedule: 'Classes by day and by teacher (Google Calendar)'", "schedule: 'Classes by day and by teacher'"],   // audit P3: we no longer use Google
  ['<script id="b2278">', CSS + '<script id="b2278">']
]);
