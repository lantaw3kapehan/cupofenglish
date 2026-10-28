// 1531 · Philippine market follow-up (28 Oct 2026, review of 1530):
// 1. Flyer thumbnails load and decode straight away (no lazy-load, no async decode): a tile below the fold could show empty
//    for a moment when scrolled to. Space stays
//    reserved (width/height + aspect-ratio), so nothing moves when a picture arrives.
// 2. The Enquiries subtitle follows the Market: China keeps "For parents asking … ready to paste in WeChat"; Philippines reads
//    "For enquiries from the Philippines · prices in pesos (₱) · flyer pictures and text for Messenger, Viber or e-mail".
// 3. The Market choice is remembered on this device (localStorage coe.enqMarket, every read/write in try/catch) — unchanged from
//    1530, now also re-applied when the screen is drawn from the saved copy.
// Display only.
const fs = require('fs'), file = process.argv[2];
require('../tools/lib.js')(file, [
  ["return '<div class=\"ph30-pic\"><img loading=\"lazy\" decoding=\"async\" width=\"640\" height=\"537\"",
   "return '<div class=\"ph30-pic\"><img decoding=\"sync\" width=\"640\" height=\"537\""]
]);
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 1531 · Enquiries subtitle follows the Market */
(function(){
  if(window.__1531) return; window.__1531 = 1;
  var PH = 'For enquiries from the Philippines · prices in pesos (₱) · flyer pictures and text for Messenger, Viber or e-mail';
  var mode = function(){ try{ return localStorage.getItem('coe.enqMarket') === 'ph' ? 'ph' : 'cn'; }catch(e){ return 'cn'; } };
  function sub(){ try{ var el = document.getElementById('v-enquiry'), t = el && el.querySelector('.lead .mute'); if(!t) return;
      if(!t.dataset.cn1531) t.dataset.cn1531 = t.textContent;
      var want = mode() === 'ph' ? PH : t.dataset.cn1531; if(t.textContent !== want) t.textContent = want; }catch(e){} }
  var _r = window.renderEnq; if(_r) window.renderEnq = function(){ var r = _r.apply(this, arguments); sub(); return r; };
  var _m = window.phMarket; if(_m) window.phMarket = function(){ var r = _m.apply(this, arguments); sub(); return r; };
  try{ if(typeof VIEW !== 'undefined' && VIEW === 'enquiry') sub(); }catch(e){}
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
console.log('1531 PH thumbnails eager · subtitle follows the Market');
