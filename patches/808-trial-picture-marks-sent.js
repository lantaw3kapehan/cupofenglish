// 808: (Misty) "yes" — copying or sharing the trial report picture marks the report as sent, so it cannot be forgotten.
// · Trials › a student › Copy picture / Share · save picture: once the picture is copied (or shared), the report is marked
//   "Sent · picture" (database, ~0.5 s; Google copies it into the sheet). Send on WeChat already did this.
// · Only for a report not marked yet; marking again never happens.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 808 · picture copied = report sent */
(function(){
  if(window.__808 || typeof window.pdfPic !== 'function' || typeof window.tlMark !== 'function') return; window.__808 = 1;
  const _pp = window.pdfPic;
  window.pdfPic = function(file, save, btn, after){
    try{ const t = (typeof TLD !== 'undefined') ? TLD : null;
      if(t && file && typeof TLB !== 'undefined' && file === TLB && t.status !== 'Sent' && !t.sent && typeof D !== 'undefined' && D && D.mgr && $('tlAct')){
        const a0 = after; after = function(){ try{ if(a0) a0.apply(this, arguments); }catch(e){} try{ if(TLD === t && t.status !== 'Sent') tlMark('picture'); }catch(e){} }; } }catch(e){}
    return _pp.call(this, file, save, btn, after); };
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
