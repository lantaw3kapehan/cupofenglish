// 2131 (12 Nov audit, phone width 390): 
// · Overview was 415 px wide on a phone (a hidden "Trends" line did not wrap), so the page slid sideways. It wraps now.
// · Overview › Needs you: the second line ("October 2026 pay, ₱15,200 still to send, 1 ready t…") was cut. It wraps on a phone.
// · Schedule: a class's line "April · ST-2025-080 · ShortVowels · 466-0677-7638" lost the meeting ID on a phone. It wraps on a phone.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [['<script id="t2060">', '<style id="d2131">\n/* 2131 phone wrap */\n#v-home .x-h{min-width:0;flex-wrap:wrap}#v-home .x-h>span,#v-home .x-h .sc1996{white-space:normal!important;min-width:0;max-width:100%}\n@media(max-width:620px){#v-home .nd-t small{white-space:normal!important;overflow:visible!important;text-overflow:clip!important}#v-schedule .grow>.small.mute.ell{white-space:normal!important;overflow:visible!important;text-overflow:clip!important;overflow-wrap:anywhere}}\n</style>\n<script id="t2060">']]);
