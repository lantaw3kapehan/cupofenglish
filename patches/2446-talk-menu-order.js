// 2446 (Misty 19 Nov 16:33: "Talk of the Day should not be under FINANCE") · the menu places items by CSS order; Talk of the Day had
//   none, so it fell to the end. Management: TODAY group, after Monitor. Teachers: right after Books.
const file = process.argv[2];
const CSS = '<style id="u2446">body:not(.role-t) #navIn > [data-v="talk"]{order:5}\nbody.role-t #navIn>button[data-v="talk"]{order:4}</style>\n';
require('../tools/lib.js')(file, [['<script id="b2278">', CSS + '<script id="b2278">']]);
