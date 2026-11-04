// 1745: (Misty 4 Nov 16:25 "the logo on the payslip now is gone, also better copy picture instead of PDF") the database payslip gets
//   the CupOfEnglish logo and the company lines (as the PAYSLIP tab), and "Copy picture" / "Share · save picture" instead of Print / PDF.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["return css + '<div class=\"ps1744\"><div style=\"text-align:center\"><b style=\"font-size:20px;letter-spacing:.12em\">PAYSLIP</b>",
   "const lg = (document.querySelector('#login img') || {}).src || '';   /* 1745: logo + company lines */\n" +
   "    return css + '<div class=\"ps1744\" style=\"background:#fff;padding:18px 20px\"><div style=\"text-align:center\">' + (lg ? '<img src=\"' + lg + '\" alt=\"CupOfEnglish\" style=\"height:64px;display:block;margin:0 auto 6px\">' : '') + '<div class=\"m\" style=\"line-height:1.35;margin-bottom:8px\">MS2-102&amp;103 Bayani Hall Centrale, San Vicente East, Urdaneta City, Pangasinan, Philippines 2428<br>Mobile: +63-962-644-9091 · Email: works@cupofenglishatph.com · SEC Reg. No. 2022050053289-14</div><b style=\"font-size:20px;letter-spacing:.12em\">PAYSLIP</b>"],
  ["<button class=\"btn sm teal\" onclick=\"ps1744Print()\">Print / Save PDF</button>",
   "<button class=\"btn sm teal\" id=\"psC1745\" onclick=\"ps1745Pic()\">Copy picture</button><button class=\"btn sm ghost\" onclick=\"ps1745Pic(1)\">' + (navigator.share ? 'Share · save' : 'Save picture') + '</button>"],
  ["  window.ps1744Print = function(){",
   "  /* 1745: the payslip as a picture (WeChat) */\n" +
   "  window.ps1745Pic = async function(save){ const el = document.querySelector('#sheetBody .ps1744'), b = $('psC1745'); if(!el || !SL) return; if(b){ b.disabled = true; b.textContent = 'Making the picture…'; }\n" +
   "    try{ const H = await h2c(); const cv = await H(el, { scale: 2, backgroundColor: '#ffffff', useCORS: true, logging: false }); const blob = await new Promise(z => cv.toBlob(z, 'image/png'));\n" +
   "      const name = 'Payslip-' + SL.person.name + '-' + SL.month + '.png';\n" +
   "      if(!save && window.ClipboardItem){ try{ await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]); toast('Payslip picture copied · paste it in WeChat'); return; }catch(x){} }\n" +
   "      const f = new File([blob], name, { type: 'image/png' }); if(navigator.canShare && navigator.canShare({ files: [f] })){ try{ await navigator.share({ files: [f] }); return; }catch(x){ if(x && x.name === 'AbortError') return; } }\n" +
   "      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); a.remove(); toast('Payslip picture saved');\n" +
   "    }catch(e){ toast('Could not make the picture · try again'); } finally { if(b){ b.disabled = false; b.textContent = 'Copy picture'; } } };\n" +
   "  window.ps1744Print = function(){"],
]);
