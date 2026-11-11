// 2098 (11 Nov 21:09, Misty: Briefing "the texts cannot be read fully"). The Briefing's two bars ("Coming in / Going out this month") share the
//   class name bz-bar with the Overview profit chart, whose rule (width 62%, max 30 px, teal fill, column layout) squeezed them into thin
//   teal posts with the words cut. The Briefing's own bars are now reset to full width (style only).
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [['<script id="t2060">', '<style id="d2098">\n/* 2098: the Briefing bars are not the Overview chart columns (shared class name bz-bar) */\n#v-finbrief .bz-bar{width:auto;max-width:none;background:none;border-radius:0;display:block;overflow:visible;filter:none}\n#v-finbrief .bz-bar>div:first-child{gap:12px}\n#v-finbrief .bz-bar>div:first-child span{white-space:normal}\n</style>\n<script id="t2060">']]);
