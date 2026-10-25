// 898: (audit #5, lead) ROOT CAUSE of "time-in points at almost the same horizontal position":
// the timeline track uses class "tr", and an unrelated global rule ".tr{max-width:760px;margin:0 auto}" (another screen's class)
// also matches it. "margin:auto" on the grid cell shrinks the track to 0 px wide, so every dot (left: N%) lands on the same spot.
// Measured in the preview before this fix: track width 0 px, all 6 dots at x=773 px although times run 07:22 → 09:57.
// The same collision hides the Leave "Team leave · next 6 weeks" bars: 42 of 44 bar tracks measured 0 px wide (only the "N teachers away"
// overview row showed). Same fix for #v-leave rows.
// Fix: the timeline track fills its column again (width 100%, no auto margin, no max-width). Positions keep their existing % values.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8'); const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
(function(){ if(window.__898) return; window.__898 = 1;
  document.head.insertAdjacentHTML('beforeend', '<style>#v-team .tl11 .r>.tr,#v-leave .g>.tr{margin:0!important;max-width:none!important;width:100%!important;justify-self:stretch}</style>');
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
