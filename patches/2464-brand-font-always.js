// 2464 (Misty 18:35 "I feel the fonts have changed?") · the brand headings (Fredoka One: "Good evening", the name in the header) were loaded
//   with display=optional: on a slow first load the browser gives up after ~0.1 s and shows a plain system font for that whole visit. Many
//   refreshes today + the slow database made that happen often. Fredoka One now always swaps in as soon as it arrives.
const file = process.argv[2];
const L = '<link href="https://fonts.googleapis.com/css2?family=Arvo:wght@400;700&amp;family=Fredoka&#43;One&amp;family=Inter:wght@400;500;600&amp;family=Noto&#43;Sans&#43;SC:wght@400;500;600&amp;display=optional" rel="stylesheet">';
require('../tools/lib.js')(file, [[L, L + '\n<link href="https://fonts.googleapis.com/css2?family=Fredoka&#43;One&amp;display=swap" rel="stylesheet">']]);
