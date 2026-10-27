// 1342: Partner access button (management › Students) uses the app's line icon (people, stroke 1.8, round caps, currentColor)
//        instead of plain text — matches the partner page, which now uses the same icon set and 1101 colours (no emojis).
const file = process.argv[2];
require('../tools/lib.js')(file, [[
  `onclick="paOpen()">Partner access</button>`,
  `onclick="paOpen()"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:-3px;margin-right:4px"><circle cx="9" cy="8" r="3.2"/><path d="M3 20a6 6 0 0 1 12 0M16 4.8a3.2 3.2 0 0 1 0 6.4M17.5 14.2A6 6 0 0 1 21 20"/></svg>Partner access</button>`
]]);
