// 2092 (11 Nov 20:12, Misty's screenshot: a sent Team Chat message squeezed into a narrow column, words split "plea se").
//   Cause: the sent-message row sizes to its content, and two limits were percentages of it: the bubble frame (100% − 210 px, room for the
//   ⋯ menu) and the bubble (82%, from 2087). Measured live at 1300 px: row 416 → frame 206 → bubble 169 px; a short row gave a 54 px bubble.
//   Fix: the sent row takes the full width (still right-aligned, up to 680 px), the frame keeps 48 px for the ⋯ menu, the bubble stops at 520 px.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [['#v-chat .ch-bub{max-width:min(520px,82%)!important}', '#v-chat .ch-bub{max-width:520px!important;overflow-wrap:break-word}\n/* 2092: limits in pixels, never a percentage of a row that sizes to its content (that squeezed sent messages to a few letters a line) */\n#v-chat .ch-m.mine{width:100%}\n@media (min-width:761px){#v-chat .ch-bw9{max-width:calc(100% - 48px)}}']]);
