// 1407p (Misty 21:45): Profile "With us" timeline — "Renewed · cycle 2" wrapped to two lines and its date fell below the card.
//   Labels and dates stay on one line (on a phone every other label sits above the line, so neighbours never collide); the line is tall enough for label + date, so nothing overflows.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  [".pf29 .ms b{display:block;font-size:12px;color:var(--ink)}",
   ".pf29 .ms b{display:block;font-size:12px;color:var(--ink);white-space:nowrap}\n@media(max-width:560px){.pf29 .ln{height:118px}.pf29 .ln:before{top:56px}.pf29 .ms{top:34px}.pf29 .ms:nth-child(even){top:auto;bottom:52px;display:flex;flex-direction:column-reverse}.pf29 .ms:nth-child(even) i{margin:6px auto 0}.pf29 .ms.l:nth-child(even) i{margin-right:0}.pf29 .ms b{font-size:11.5px}}"],
]);
