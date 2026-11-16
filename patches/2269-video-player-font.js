// 2269 (Misty 16 Nov 17:43 screenshot): the in-app video player's title and buttons used a serif font; now the app's own font.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [["#vdOv{position:fixed;inset:0;z-index:9999;", "#vdOv{font-family:var(--f,system-ui,sans-serif);position:fixed;inset:0;z-index:9999;"]]);
