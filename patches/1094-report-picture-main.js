// 1094: (Misty, 25 Oct 21:50) "I want it like the LESSON SUMMARY copy picture, that it auto-adjusts when copying, and
//      mobile-friendly since Chinese parents read it on the phone".
// · Parent reports › "Copy picture" and "Share / save picture" now make the phone picture (1090: one tall image the width
//   of a phone, big English + Chinese text, total and the four skills, strengths · areas · next steps) instead of a
//   shrunken photo of the A4 PDF. The picture is as long as the feedback — nothing is cut and nothing is tiny.
// · The separate "Picture for parent" row is gone (it is now the main button). The PDF stays for "Send on WeChat" / "Save PDF".
// · Copy works on iPhone/Safari too (the picture is handed to the clipboard while it is being made, so the tap still counts).
// · Reports with no feedback scores in the app keep the PDF picture as before.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<style id="d1094">#rpAct .pic1090{display:none!important}</style>
<script>
/* 1094 · parent report "Copy picture" = the phone picture */
(function(){
  if(window.__1094) return; window.__1094 = 1;
  var ok = function(){ return typeof RPD !== 'undefined' && RPD && RPD.fb && typeof window.rpPicHtml === 'function'; };
  async function png(){ var H = await h2c(); try{ await document.fonts.ready; }catch(e){}
    var box = document.createElement('div'); box.style.cssText = 'position:fixed;left:-20000px;top:0;z-index:-1'; box.innerHTML = rpPicHtml(); document.body.appendChild(box);
    try{ var im = box.querySelectorAll('img'); await Promise.all([].map.call(im, function(x){ return x.complete ? 0 : new Promise(function(z){ x.onload = x.onerror = z; }); }));
      var cv = await H(box.firstChild, { scale: 1, backgroundColor: '#ffffff', useCORS: true, logging: false });
      return await new Promise(function(z){ cv.toBlob(z, 'image/png'); }); } finally{ box.remove(); } }
  var nm = function(){ var x = RPD.report; return 'CupOfEnglish-' + String(x.student || 'report').replace(/[^\w一-鿿-]+/g, '') + '-' + (window.fbClsKey ? fbClsKey(x.month) : x.month) + '.png'; };
  window.rpPic94 = async function(save, btn){
    if(!ok()) return;
    var b = btn, t = b && b.textContent; if(b){ b.disabled = true; b.textContent = 'Making picture…'; }
    try{
      if(!save && window.ClipboardItem && navigator.clipboard){ try{ await navigator.clipboard.write([new ClipboardItem({ 'image/png': png() })]); toast('Picture copied · paste it in the parent’s WeChat chat'); return; }catch(x){} }
      var blob = await png(), f = new File([blob], nm(), { type: 'image/png' });
      if(navigator.canShare && navigator.canShare({ files: [f] })){ try{ await navigator.share({ files: [f] }); return; }catch(x){ if(x && x.name === 'AbortError') return; } }
      var u = URL.createObjectURL(blob), a = document.createElement('a'); a.href = u; a.download = f.name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function(){ URL.revokeObjectURL(u); }, 4000); toast('Picture saved');
    }catch(e){ toast('Could not make the picture. Use the PDF instead.'); }
    finally{ if(b){ b.disabled = false; b.textContent = t; } } };
  function swap(){ try{ var el = document.getElementById('rpAct'); if(!el || !ok()) return;
    el.querySelectorAll('button').forEach(function(x){ var o = x.getAttribute('onclick') || '';
      if(/^pdfPic\(RPB,0/.test(o)){ x.setAttribute('onclick', 'rpPic94(0,this)'); x.textContent = 'Copy picture'; }
      else if(/^pdfPic\(RPB,1/.test(o)){ x.setAttribute('onclick', 'rpPic94(1,this)'); } });
    if(!el.querySelector('[onclick^="rpPic94"]') && !el.querySelector('#rpNote')) el.insertAdjacentHTML('afterbegin', '<div class="row" style="gap:8px;width:100%"><button class="btn teal grow" onclick="rpPic94(0,this)">Copy picture</button><button class="btn ghost grow" onclick="rpPic94(1,this)">' + (navigator.share ? 'Share / save picture' : 'Save picture') + '</button></div>');
  }catch(e){} }
  var _b = window.rpBtns;
  if(typeof _b === 'function') window.rpBtns = function(){ var r = _b.apply(this, arguments); swap(); return r; };
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
