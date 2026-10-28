// 1533 · Philippine payment through UnionBank (28 Oct 2026, Misty 23:03): "payment is through CupOfEnglish's UnionBank account or QR,
// not the China 'Payment with' name". + "Found us through" gets Facebook.
// 1. Enquiries › Philippines › 2 Enrolling › Payment QR (UnionBank · InstaPay): Misty's QR (ph/unionbank-qr.png, lossless PNG, decodes
//    to the same payload as her original) with Copy QR / Save QR, and the English payment message
//    (as China's Payment · Alipay), and "Payment details" (bank, account name, account number, QR upload) saved by management through
//    coe-student op sPhPay into docs sys:pricing_ph.payment (prefilled 28 Oct: CUPOFENGLISH ONLINE TUTORIAL SERVICES · **** **** 8123 ·
//    UnionBank of the Philippines · InstaPay QR · "Transfer fees may apply."; the full account number is never stored). Empty → the line reads
//    "Payment: UnionBank account or QR · details from CupOfEnglish".
// 2. PH price picture sheet: the "Payment with" name (China's helper) is replaced by the UnionBank status line with "Payment details";
//    the PH message's payment line comes from the same setting. China: unchanged (same HTML, same message).
// 3. New enquiry › Found us through: + Facebook.
const fs = require('fs'), file = process.argv[2], R = String.raw;
const ROW = R`<div class="row" style="gap:8px;align-items:center;margin-top:6px"><span class="small mute">Payment with</span><input id="ppPayNm" class="in-t grow" style="margin:0" value="' + esc(ppPayNm()) + '" onchange="try{localStorage.setItem(\'coe.ppPay\',this.value.trim())}catch(e){}"></div>`;
const s0 = fs.readFileSync(file, 'utf8');
const exA = s0.slice(s0.indexOf("if(PP.m === 'ph'){ const P = phPrg() || {}, ex = ppExtra()"), s0.indexOf("/* the English lines of the same enrolment / payment text */"));
if (!exA || exA.length > 300) { console.error('1532 message anchor not found'); process.exit(1); }
require('../tools/lib.js')(file, [
  ["SRCS = ['WeChat', '小红书', 'Referral', 'Partner', 'Website', 'Other'];", "SRCS = ['WeChat', '小红书', 'Facebook', 'Referral', 'Partner', 'Website', 'Other'];"],
  [ROW, R`' + (PP.m === 'ph' ? phPayRow1533() : '` + ROW + R`') + '`],
  [exA, "if(PP.m === 'ph'){ const P = phPrg() || {}, ex = phPayText1533();   "]
]);
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + R`<script>
/* 1533 · Philippine payment: UnionBank account / QR (docs sys:pricing_ph.payment, set in Enquiries › Philippines › Payment · UnionBank) */
(function(){
  if(window.__1533) return; window.__1533 = 1;
  var D = function(){ return window.phPricing1530 ? phPricing1530() : null; };
  var PAY = function(){ var d = D(); return (d && d.payment) || {}; };
  var ready = function(p){ p = p || PAY(); return !!(p.name && (p.number || p.qr)); };
  var PEND = 'Payment: UnionBank account or QR · details from CupOfEnglish.';
  function line(p){ p = p || PAY(); if(!ready(p)) return PEND; var bank = p.bank || 'UnionBank';
    return 'For payment, kindly send it to our ' + bank + ' account ' + p.name + (p.number ? ' (' + p.number + ')' : '') + (p.qr ? (p.method ? ' by ' + p.method : '') + ': scan the QR code we send you' : '') + '.' + (p.note ? ' ' + p.note : '') + ' After paying, please send us a screenshot so we can confirm your enrolment.'; }
  window.phPayLine1533 = line;
  /* the price-picture message: the same checkbox ("Add the enrolment and payment lines") decides */
  window.phPayText1533 = function(){ var on = $('ppPayOn'); if(on ? !on.checked : (window.PP_PAY_OFF === true)) return ''; return '\n\nFor enrolment, kindly refer to the attached course packages. You are welcome to choose whichever package best suits your preferences and learning goals.\n\n' + line(); };
  window.phPayRow1533 = function(){ return '<div class="small" style="margin-top:6px;line-height:1.5"><span class="mute">Payment ·</span> ' + esc(ready() ? (PAY().bank || 'UnionBank') + (PAY().name ? ' · ' + PAY().name : '') + (PAY().number ? ' · ' + PAY().number : '') + (PAY().qr ? ' · ' + (PAY().method || 'QR') : '') : 'UnionBank account or QR · details from CupOfEnglish') + ' <a class="lk" onclick="phPayOpen()">Payment details</a></div>'; };
  function msg(){ var p = PAY(); if(!ready(p)) return PEND; var bank = p.bank || 'UnionBank';
    return 'For enrolment and payment, you can pay ' + (p.qr ? (p.method ? 'by ' + p.method + ' ' : '') + 'to our ' + bank + ' account: please scan the QR code.' : 'to our ' + bank + ' account.')
      + '\n\nAccount name: ' + p.name + (p.number ? '\nAccount: ' + p.number : '') + '\nBank: ' + bank + (p.note ? '\n' + p.note : '')
      + '\n\nAfter paying, kindly send us a screenshot here so we can confirm your enrolment. Thank you!\nCupOfEnglish'; }
  var QR = null;   // a picture chosen in the form, not saved yet
  window.phPayOpen = function(){ var d = D(); if(!d) return toast('Philippine price list still loading · try again in a moment'); var p = PAY(); QR = null;
    openSheet('<h1>Payment QR · ' + esc(p.bank || 'UnionBank') + '</h1><div class="mute small">Philippine enquiries · send the QR picture first, then the message.</div>'
      + (p.qr ? '<img id="ppqImg" src="' + p.qr + '" alt="CupOfEnglish UnionBank QR" style="display:block;width:100%;max-width:420px;margin:12px auto;border-radius:12px;border:1px solid #E6EEF0"><div class="row" style="gap:8px"><button class="btn teal grow" onclick="phPayQr(0)">Copy QR picture</button><button class="btn ghost grow" onclick="phPayQr(1)">' + (navigator.share ? 'Share / save QR' : 'Save QR') + '</button></div>' : '<div class="card" style="margin-top:12px;padding:12px;color:#8A5300;background:#FFF0D2;border:0">No QR picture yet · add it under Payment details below.</div>')
      + '<p class="small" style="white-space:pre-line;margin-top:12px;padding:12px;border-radius:12px;background:#F4FAFA;border:1px solid #DCEFEF">' + esc(msg()) + '</p><button class="btn teal" style="width:100%" onclick="phPayCopy()">Copy message</button>'
      + '<h2 style="margin-top:20px;font-size:16px">Payment details</h2><div class="mute small">Shown to Philippine enquiries in the payment message and the price-picture message. Management only.</div>'
      + '<label>Bank</label><input id="ppqB" class="in-t" value="' + esc(p.bank || 'UnionBank') + '">'
      + '<label>Account name</label><input id="ppqN" class="in-t" value="' + esc(p.name || '') + '" placeholder="As shown on the account" autocomplete="off">'
      + '<label>Account <span class="mute small">· as printed on the QR (masked is fine)</span></label><input id="ppqA" class="in-t" value="' + esc(p.number || '') + '" autocomplete="off">'
      + '<label>Method</label><input id="ppqM" class="in-t" value="' + esc(p.method || '') + '" placeholder="e.g. InstaPay QR">'
      + '<label>Note</label><input id="ppqT" class="in-t" value="' + esc(p.note || '') + '" placeholder="e.g. Transfer fees may apply.">'
      + '<label>QR picture</label><input id="ppqF" type="file" accept="image/png,image/jpeg,image/webp" onchange="phPayPick(this)"><div id="ppqP" class="small mute" style="margin-top:4px">' + (p.qr ? 'A QR picture is saved · choose a new one to replace it (kept full size, lossless)' : 'PNG or JPEG of the UnionBank QR · kept full size, lossless') + '</div>'
      + (p.qr ? '<label class="check" style="margin-top:6px"><input type="checkbox" id="ppqX"><span>Remove the saved QR picture</span></label>' : '')
      + '<button class="btn teal" id="ppqS" style="width:100%;margin-top:12px" onclick="phPaySave()">Save payment details</button>'
      + (p.at ? '<div class="small mute" style="margin-top:6px">Last saved ' + esc(String(p.at).slice(0, 16).replace('T', ' ')) + (p.by ? ' by ' + esc(p.by) : '') + '</div>' : '')); };
  window.phPayPick = function(inp){ var f = inp.files && inp.files[0], P = $('ppqP'); if(!f) return; var im = new Image(), u = URL.createObjectURL(f);
    im.onload = function(){ var k = Math.min(1, 1600 / Math.max(im.naturalWidth, im.naturalHeight)), c = document.createElement('canvas'); c.width = Math.round(im.naturalWidth * k); c.height = Math.round(im.naturalHeight * k);   /* full size up to 1600 px, PNG (lossless), never JPEG: the QR keeps scanning */
      var x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.imageSmoothingEnabled = k < 1; x.drawImage(im, 0, 0, c.width, c.height); var d = c.toDataURL('image/png'); URL.revokeObjectURL(u);
      if(d.length > 590000){ QR = null; if(P) P.textContent = 'That picture is too large · use a smaller PNG of the QR (a screenshot of the QR card is fine)'; return; }
      QR = d; if(P) P.textContent = 'New QR picture ready (' + c.width + ' × ' + c.height + ', lossless) · tap Save payment details'; };
    im.onerror = function(){ if(P) P.textContent = 'That file is not a picture'; }; im.src = u; };
  window.phPaySave = function(){ var b = $('ppqS'); if(!b || b.disabled) return; var body = { op: 'sPhPay', token: TOKEN, bank: ($('ppqB').value || '').trim() || 'UnionBank', name: ($('ppqN').value || '').trim(), number: ($('ppqA').value || '').trim(), method: ($('ppqM').value || '').trim(), note: ($('ppqT').value || '').trim() };
    if(QR) body.qr = QR; else if($('ppqX') && $('ppqX').checked) body.qr = '';
    b.disabled = true; b.textContent = 'Saving…';
    fetch(FAST_URL + '-student', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(body) }).then(function(r){ return r.json(); }).then(function(r){
      if(!r || !r.ok){ b.disabled = false; b.textContent = 'Save payment details'; return toast((r && r.msg) || 'Not saved · try again'); }
      var d = D(), old = (d && d.payment) || {}; if(d){ d.payment = { bank: body.bank, name: body.name, number: body.number, method: body.method, note: body.note, qr: body.qr === undefined ? (old.qr || '') : body.qr, at: (r.payment && r.payment.at) || new Date().toISOString(), by: (r.payment && r.payment.by) || '' }; try{ localStorage.setItem('coe.pricing_ph', JSON.stringify(d)); }catch(x){} }
      toast('Payment details saved'); phPayOpen(); })
      .catch(function(){ b.disabled = false; b.textContent = 'Save payment details'; toast('No connection · try again'); }); };
  window.phPayCopy = function(){ if(!ready()) return toast('Add the UnionBank details under Payment details first'); var t = msg(); (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(function(){ toast('Message copied · paste it in Messenger, Viber or e-mail'); }, function(){ try{ prompt('Copy this message', t); }catch(x){} }); };
  window.phPayQr = function(save){ var im = document.getElementById('ppqImg'); if(!im) return;   /* lossless PNG of the picture as shown, full natural size */
    var go = function(){ var c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight; c.getContext('2d').drawImage(im, 0, 0); return new Promise(function(ok){ c.toBlob(ok, 'image/png'); }); };
    if(!save){ try{ navigator.clipboard.write([new ClipboardItem({ 'image/png': go() })]).then(function(){ toast('QR picture copied · paste it in Messenger, Viber or e-mail'); }, function(){ toast('Could not copy the picture here · use Save QR'); }); }catch(x){ toast('Could not copy the picture here · use Save QR'); } return; }
    go().then(function(png){ var f = new File([png], 'CupOfEnglish-UnionBank-QR.png', { type: 'image/png' });
      if(/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) && navigator.share && navigator.canShare && navigator.canShare({ files: [f] })) return navigator.share({ files: [f] }).catch(function(){});
      var a = document.createElement('a'); a.href = URL.createObjectURL(f); a.download = f.name; document.body.appendChild(a); a.click(); a.remove(); toast('QR saved'); }).catch(function(){ toast('Could not make the picture · try again'); }); };
  /* the Philippine toolkit gets stage 2 "Enrolling" with Payment · UnionBank (as China's stage 3) */
  var _k = window.phKit1532; if(_k) window.phKit1532 = function(){ var h = _k.apply(this, arguments), A = '<div class="small mute" style="margin-top:18px;line-height:1.6"><b>Suggested order:</b>';
    var C = '<section class="eq2-g s3"><h3><span class="n31">2</span>Enrolling <span>payment</span></h3><div class="eq2-grid"><div style="background:#fff;border:1px solid #E6EEF0;border-radius:18px;padding:16px 18px;margin-top:12px;display:flex;gap:14px;align-items:center" class="eq2-t"><div style="width:36px;height:36px;border-radius:50%;background:#E3F6F6;color:#00737B;font-weight:700;display:flex;align-items:center;justify-content:center;flex:none">5</div><div class="grow" style="min-width:0"><b>Payment QR · UnionBank</b><div class="small mute" style="margin-top:3px">When they decide to enrol: our UnionBank InstaPay QR (Copy / Save) + a short English message with the account name · payment details are set here.</div></div><button class="btn teal sm x1101-sec" style="flex:none" onclick="phPayOpen()">Open</button></div></div></section>';
    return h.indexOf(A) > -1 ? h.replace(A, C + A) : h; };
  try{ if(typeof VIEW !== 'undefined' && VIEW === 'enquiry') renderEnq(); }catch(x){}
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
console.log('1533 PH payment UnionBank · Facebook source');
