// 2246 (Misty): Schedule › Month: the "This month" button squeezed onto two lines and slid under the ‹ › arrows.
// It keeps its width on one line, with a small gap before the arrows.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [["\n</body>\n</html>", "\n<style id=\"d2246\">#v-schedule .mo04 .top .tdy{white-space:nowrap;flex:none;min-width:max-content;margin-right:8px;position:relative;z-index:1}#v-schedule .mo04 .top .nav{flex:none}</style>\n</body>\n</html>"]]);
