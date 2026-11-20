// 2517 (Misty: option A): Speaking Activities in the side menu uses two speech bubbles (was a light bulb).
const file = process.argv[2];
require('../tools/lib.js')(file, [[
  `<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.3 1.1 2.2h5c0-.9.4-1.6 1.1-2.2A6 6 0 0 0 12 3z"/></svg>'; }`,
  `<path d="M21 14l-3-3h-7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v10"/><path d="M14 15v2a1 1 0 0 1-1 1H6l-3 3V11a1 1 0 0 1 1-1h2"/></svg>'; }`]]);
