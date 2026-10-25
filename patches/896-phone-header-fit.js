// 896: (audit, lead) On a 390 px phone the top bar was wider than the screen: "4 online" and "In 09:44" pushed ↻ (refresh) and
// the sign-out button off the right edge (the whole page could scroll sideways by ~50–75 px). Found by the preview check on every screen.
// Phones (≤520 px): the chips get tighter padding, the word "CupOfEnglish" next to the cup logo is hidden (the logo stays; "President · Live" stays),
// and the two icon buttons always stay on screen. Same buttons, same actions. CSS only.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8'); const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
(function(){ if(window.__896) return; window.__896 = 1;
  document.head.insertAdjacentHTML('beforeend', '<style>@media(max-width:520px){' +
    '.hd{gap:6px!important;min-width:0}.hd .who{min-width:0;flex:1 1 auto!important;overflow:hidden}.hd .who #hName{display:none}' +
    '.hd #onlN,.hd #tinNag{padding:5px 8px!important;font-size:12px!important;margin:0!important;flex:none;white-space:nowrap}' +
    '.hd .iconbtn{flex:none;margin:0!important}' +
    '}</style>');
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
