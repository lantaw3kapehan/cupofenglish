// 1674: (Misty, 30 Oct 23:41) "We have no option in management to edit it [the trial CEFR level] before sending to parent".
// The "Level on the report" buttons (Pre-A1 … C1) existed, but at the very bottom of the trial report sheet (1,918 px down), under
// all the send buttons, so nobody saw them before sending. They now sit right under the score card (Speaking / Listening / Reading /
// Total · level), where the level is read. If the report was already sent, a line under the buttons says to send the new picture again.
const file = process.argv[2];
require('../tools/lib.js')(file, []);
const fs = require('fs');
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 1674 · trial report: "Level on the report" right under the score card */
(function(){
  if(window.__1674) return; window.__1674 = 1;
  const base = window.tlBtns; if(typeof base !== 'function') return;
  window.tlBtns = tlBtns = function(){ const r = base.apply(this, arguments);
    try{ const sb = document.getElementById('sheetBody'), lv = document.getElementById('lvB'), sk = sb && sb.querySelector('.rp-sk');
      if(lv && sk && lv.previousElementSibling !== sk){ lv.style.margin = '10px 0 4px'; sk.insertAdjacentElement('afterend', lv); }
      if(lv && !document.getElementById('lvS') && typeof TLD !== 'undefined' && TLD && TLD.status === 'Sent')
        lv.insertAdjacentHTML('beforeend', '<div id="lvS" class="small mute" style="margin-top:4px">Already sent to the parent. After changing the level, copy the new picture and send it again.</div>');
    }catch(e){}
    return r; };
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
