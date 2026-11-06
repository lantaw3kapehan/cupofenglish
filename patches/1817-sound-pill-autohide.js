// 1817: final QA · the "Tap to turn on chat sounds" pill stayed over the screen content (above the bottom bar) on every screen until
//   tapped. It now hides by itself after 10 seconds and shows at most once a day per device (any tap on the page still turns sound on).
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [["function showTap(){ if(AUOK || document.getElementById('chSnd')) return; document.body.insertAdjacentHTML('beforeend', '<button type=\"button\" id=\"chSnd\" onclick=\"this.remove()\">Tap to turn on chat sounds</button>'); }",
  "function showTap(){ if(AUOK || document.getElementById('chSnd')) return; const d1817 = new Date().toISOString().slice(0, 10); try{ if(localStorage.getItem('coe.snd1817') === d1817) return; localStorage.setItem('coe.snd1817', d1817); }catch(e){}   /* 1817 */\n"
  + "    document.body.insertAdjacentHTML('beforeend', '<button type=\"button\" id=\"chSnd\" onclick=\"this.remove()\">Tap to turn on chat sounds</button>'); setTimeout(() => { const b = document.getElementById('chSnd'); if(b) b.remove(); }, 10000); }"]]);
