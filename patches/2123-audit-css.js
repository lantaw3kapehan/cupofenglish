// 2123 (12 Nov audit · small layout fixes, CSS only)
// · Teachers list: "· 1 late" wrapped onto a new line that began with a dot. "late" now always sits on its own line, without the dot.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [['<script id="t2060">', '<style id="d2123">\n/* 2123 audit */\n#v-teachers .tc2-f .late{flex-basis:100%}#v-teachers .tc2-f .late:before{content:none!important}\n</style>\n<script id="t2060">']]);
