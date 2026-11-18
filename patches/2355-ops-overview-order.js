// 2355 (QA 18 Nov): on Operations' Overview the From teachers / Christmas / Lates cards kept landing above her summary (other screens re-add them at the top); the layout now orders her summary first.
const file = process.argv[2];
require('../tools/lib.js')(file, [
['<script id="b2278">', "<style id=\"b2355\">\n/* 2355 \u00b7 Operations' Overview: her greeting and summary always come first, then the tiles, then any card other screens add (lates, from teachers, events) \u00b7 layout order, not moving cards around */\n#v-home:has(> #om2344){display:flex;flex-direction:column}\n#v-home > #om2344{order:-1;display:flex;flex-direction:column}\n#om2344 > .ov-hero{order:-3}\n#om2344 > .tiles{order:-2}\n#om2344 > .two{order:1}\n#om2344 > .cd{order:2}\n#om2344 > *:not(.ov-hero):not(.tiles):not(.two):not(.cd){order:0;margin-top:14px}\n#v-home > #lqmBox{margin-top:14px}\n</style>\n" + '<script id="b2278">']
]);
