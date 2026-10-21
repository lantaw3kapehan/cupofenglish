// 21 Oct · Header is solid white on every screen (rows no longer show through it while scrolling; Misty's To do screenshot).
require('../tools/lib.js')(process.argv[2], [
["body:not(.mgr) header{background:rgba(255,255,255,.94)!important;backdrop-filter:saturate(1.4) blur(14px);-webkit-backdrop-filter:saturate(1.4) blur(14px);",
 "body:not(.mgr) header{background:#fff!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;"]
]);
