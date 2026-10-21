// 21 Oct · Teacher Today: "Coming up" removed (Misty: "since we already have schedule, maybe we can remove this now to avoid redundancy and repetition").
// The same days, counts and classes are on Schedule (week tiles, tap a day). The 494 week strip simply finds nothing to draw.
require('../tools/lib.js')(process.argv[2], [[
"if(later.length){\nh += `<h2>Coming up</h2>`;",
"if(later.length && false){   /* 502 · 21 Oct: the coming days live on Schedule now (no repeat on Today) */\nh += `<h2>Coming up</h2>`;"]]);
