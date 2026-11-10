// 2057 (10 Nov, Misty: "do all 1-5", item 5): Notices & requests (management) showed 10 filter buttons on two rows, several of
//   them empty. A filter with nothing in it is hidden (unless it is the one open); All always shows. Display only.
const file = process.argv[2];
require('../tools/lib.js')(file, [["let h = '<div class=\"row\" style=\"gap:6px;flex-wrap:wrap;margin-top:14px\">' + tabs.map(", "let h = '<div class=\"row\" style=\"gap:6px;flex-wrap:wrap;margin-top:14px\">' + tabs.filter(([k, l, c]) => c || F === k || k === 'all').map("]]);
