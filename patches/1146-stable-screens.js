// 1146: (Misty, 26 Oct 21:37 "always ensure that both management and teacher screens do not keep on moving, adjusting and flickering")
//   Found with the new tools/stability-check.js (every screen, laptop + phone, refresh / open / first open):
//   1. Every screen jumped ~14 px whenever its top box was redrawn: the first box's top margin "leaked" out of the screen into the page
//      (CSS margin collapsing), so when a tidy-up briefly put a different box first, the whole page moved. Screens now keep their own margins.
//   2. The teacher's Time-in button in the header was 2 px taller than the header buttons, so the header grew when it appeared.
//   3. Management on a phone: the header grew from one line to two when "5 online" / Time-in appeared ~4 s after opening. The second line is
//      now kept from the start.
//   4. Trials: see below.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.indexOf('</head>');   // in <head>, so it applies from the very first paint (at the end of the page it arrived ~3 s late)
s = s.slice(0, i) + String.raw`<style id="st1146">
:where(main.wrap>[id^="v-"]:not(.hide)){display:flow-root}
header .hd #tinNag{box-sizing:border-box;max-height:40px}
@media(max-width:560px){body.is-mgr header .hd{min-height:calc(40px + 8px + 31px)}
 body.is-mgr header .hd .sp{min-height:0}
 body.is-mgr header .hd::after{content:"";order:6;flex:0 0 0;height:31px}}
</style>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, [
  // 4. Trials: "Booked trial classes" appeared ~0.1 s after the screen opened and pushed the list down 190 px. The last list is kept on
  //    the device and shown at once; the fresh one replaces it in place.
  ["let TPA = null, TPA_AT = 0, busy = false;", "let TPA = (function(){ try{ const j = JSON.parse(localStorage.getItem('coe.tpa') || 'null'); return Array.isArray(j) ? j : null; }catch(e){ return null; } })(), TPA_AT = 0, busy = false;"],
  ["TPA = r.rows || []; TPA_AT = Date.now();", "TPA = r.rows || []; TPA_AT = Date.now(); try{ localStorage.setItem('coe.tpa', JSON.stringify(TPA)); }catch(e){}"]]);
