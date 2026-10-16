// 16 Oct · (1) Overview: the month's sales tile is gone (it repeats Sales & costs); the President sees Renewals due there instead, like Ops.
// (2) Every screen sits in the middle of the window on wide screens (equal space left and right), and no longer shifts a few pixels when a screen has a scroll bar.
const css = "html{scrollbar-gutter:stable}\n@media(min-width:1512px){body:not(.tw) .wrap,body:not(.tw) .hd{margin-left:calc((100vw - 1040px) / 2 - 236px);margin-right:auto}}\n@media(min-width:1752px){body.tw .wrap{margin-left:calc((100vw - 1280px) / 2 - 236px);margin-right:auto}}";
require('../tools/lib.js')(process.argv[2], [
["still to come</span>` : ''}</div></a>\n${isPres() ? (() => { const dim", "still to come</span>` : ''}</div></a>\n${false ? (() => { const dim"],
["\n</script>\n\n</body>", "\n</script>\n<script>\n(function(){ const s = document.createElement('style'); s.textContent = " + JSON.stringify(css) + "; document.head.appendChild(s); })();\n</script>\n\n</body>"],
]);
