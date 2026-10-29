// 1624: design system · labelled colours, Finance. The "Insights · for information, nothing to fix" cards on Sales & costs used a
// blue icon (★ one-off sale, ◐ sales from two sources). Blue has no meaning in the colour map; information is teal
// (server/DESIGN-SYSTEM-2026-10-29.md). Icon colour only; same words, same links. Chart series colours are not statuses and stay.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  ["info('#2F6FD0', '★',", "info('#00707A', '★',"],
  ["info('#2F6FD0', '◐',", "info('#00707A', '◐',"],
]);
