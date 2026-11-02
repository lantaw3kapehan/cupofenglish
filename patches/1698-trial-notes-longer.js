// 1698: (Misty, 2 Nov 09:33, trial class report as Teacher Misty) "there is a word count limit" · each "What did you see?" line was a
//   one-line box limited to 220 characters (≈ 35–40 words) and the end of a longer sentence was hidden. Now it is a box that grows
//   with the text (all of it visible), up to 600 characters (≈ 100 words), with a small counter "123 / 600" that turns orange near
//   the end. The report keeps every word (a longer page is fitted onto the A4 sheet as before).
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["<input class=\"in-t trn\" id=\"trn' + k + '\" maxlength=\"220\" placeholder=\"' + esc(EX[k] || 'e.g. what the student said or did') + '\" value=\"' + esc(TRS.notes[k] || '') + '\" oninput=\"trNote(' + k + ',this.value)\">",
   "<textarea class=\"in-t trn\" id=\"trn' + k + '\" rows=\"2\" maxlength=\"600\" placeholder=\"' + esc(EX[k] || 'e.g. what the student said or did') + '\" oninput=\"trNote(' + k + ',this.value);trGrow1698(this)\">' + esc(TRS.notes[k] || '') + '</textarea><div class=\"trn-n\" id=\"trnN' + k + '\">' + String(TRS.notes[k] || '').length + ' / 600</div>"],
  [".trn-l{font-size:12px;color:#6C6883;margin-top:8px}</style>');",
   ".trn-l{font-size:12px;color:#6C6883;margin-top:8px}textarea.trn{resize:vertical;min-height:44px;line-height:1.45;overflow:hidden;font-family:inherit}.trn-n{font-size:11px;color:#8A86A0;text-align:right;margin-top:2px}.trn-n.near{color:#C2410C;font-weight:600}</style>');\n" +
   "  window.trGrow1698 = el => { try{ el.style.height = 'auto'; el.style.height = (el.scrollHeight + 2) + 'px'; const n = document.getElementById('trnN' + String(el.id).slice(3)); if(n){ const L = el.value.length; n.textContent = L + ' / 600'; n.classList.toggle('near', L >= 540); } }catch(e){} };"],
  ["TRF.form.rate.forEach((x, k) => { const c = document.getElementById('trc' + k); if(!c || document.getElementById('trn' + k)) return;",
   "setTimeout(() => { try{ document.querySelectorAll('textarea.trn').forEach(el => trGrow1698(el)); }catch(e){} }, 60);   /* 1698 */\n      TRF.form.rate.forEach((x, k) => { const c = document.getElementById('trc' + k); if(!c || document.getElementById('trn' + k)) return;"]
]);
