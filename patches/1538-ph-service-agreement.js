// 1538 · Philippine Learner Service Agreement in English only (28 Oct 2026, Misty 23:14 / 23:15).
// The same flow (student page / trial "Enrolling" › Service agreement › picture + message › Mark as sent › on file in S-AGREE) and the same
// layout, with only the English text, no Chinese lines and no gaps, for a Philippine learner: Student access › Market = Philippines
// (docs sys:ph_learners), or an enquiry logged as "PH Adult English 1:1" / "PH IELTS 1:1" with the same name, or "Philippines (English)"
// chosen in the sheet. PH details:
//   · Lesson package = the PH tracks with ₱ prices (docs sys:pricing_ph: Foundation 15 · Professional 30 · Mastery 60) and the programme name;
//   · payment = UnionBank (account transfer or InstaPay QR, from sys:pricing_ph.payment) instead of WeChat Pay / Alipay;
//   · cancellation notice = sys:pricing_ph.cancel_hours (4) hours; contact = Messenger / Viber or our group chat (instead of WeChat);
//   · no partner lines (the China agreement has none either). Every other clause (validity, refund, conduct, 1-on-1 rules, acceptance)
//     and the signature box are the English text of the current agreement.
// China agreement: agrHtml / agrMsg / the sheet are unchanged (the PH version is chosen by a wrapper; China output byte-identical).
// Signed agreements already stored (S-AGREE rows, Drive files) are not touched; "how" values saved stay the same.
const fs = require('fs'), file = process.argv[2], R = String.raw;
let s = fs.readFileSync(file, 'utf8');
for (const k of ['function agrHtml(a){', 'function agrMsg(a){', 'function agrPaint(){', 'window.__1535']) if (s.indexOf(k) < 0) { console.error('1538 anchor missing: ' + k); process.exit(1); }
require('../tools/lib.js')(file, [
  // the sheet's "Copy message" and picture read the market from the agreement record; China path unchanged
  ["AGS.nat = 'China 中国'; const first = AGS;", "AGS.nat = 'China 中国'; if(window.agrPh1538 && agrPh1538(AGS)) AGS.nat = 'Philippines'; const first = AGS;"],
  ["if(r && r.ok){ const nat = /philippin|manila|cebu|davao|pangasinan|urdaneta|\\bPH\\b/i.test(r.city || '') ? 'Philippines 菲律宾' : 'China 中国'",
   "if(r && r.ok){ const nat = window.agrPh1538 && agrPh1538(AGS) ? 'Philippines' : /philippin|manila|cebu|davao|pangasinan|urdaneta|\\bPH\\b/i.test(r.city || '') ? 'Philippines 菲律宾' : 'China 中国'"]
]);
s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + R`<script>
/* 1538 · Philippine Learner Service Agreement · English only (same flow and layout as the China agreement) */
(function(){
  if(window.__1538) return; window.__1538 = 1;
  var D = function(){ return window.phPricing1530 ? phPricing1530() : null; };
  var lc = function(x){ return String(x || '').trim().toLowerCase(); };
  function enqProg(a){ try{ var n = lc(a && a.name); if(!n || typeof ENQ === 'undefined' || !ENQ) return ''; var e = ENQ.find(function(x){ return /^PH /.test(String(x.prog || '')) && lc(x.name) === n; }); return e ? (/IELTS/.test(e.prog) ? 'ielts' : 'adult') : ''; }catch(x){ return ''; } }
  window.agrPh1538 = function(a){ if(!a) return false; if(a.mk) return a.mk === 'ph'; if(a.code && window.isPhLearner && isPhLearner(a.code)) return true; return !!enqProg(a); };
  function progOf(a){ var L = window.phLearners1535 ? phLearners1535() : {}, m = a && a.code && L[String(a.code).toUpperCase()]; var id = (m && m.prog) || enqProg(a) || 'adult', d = D(); return (d && (d.programs || []).find(function(p){ return p.id === id; })) || null; }
  var peso = function(n){ return '₱' + Number(n || 0).toLocaleString('en-US'); };
  function phHtml(a){ var L = (document.querySelector('#login img') || {}).src || '', d = new Date(), pk = +a.pkg || 0, k = pk >= 60 ? 60 : pk >= 30 ? 30 : pk ? 15 : 0, P = progOf(a), DOC = D() || {}, pay = DOC.payment || {}, H = window.phCxHours ? phCxHours() : 4;
    var ds = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    var row = function(l, v){ return '<tr><td style="padding:9px 10px;font-weight:700;width:120px">' + l + '</td><td style="padding:9px 10px">' + v + '</td></tr>'; };
    var sec = function(n, t, body){ return '<div style="margin-top:14px"><div style="font-weight:700;font-size:16px">' + n + '.&nbsp;&nbsp;' + t + '</div><div style="margin:4px 0 0 22px;font-size:13.5px;line-height:1.5">' + body + '</div></div>'; };
    var T = (P && P.tracks) || [], tr = function(n){ return T.find(function(t){ return +t.lessons === n; }); };
    var box = function(n){ var t = tr(n); return agBox(k === n) + '<b>' + (t ? esc(t.name) + ' · ' : '') + n + ' lessons</b>' + (t && t.price ? ' <span style="color:#4C4868">' + peso(t.price) + '</span>' : ''); };
    var bank = pay.bank || 'UnionBank', how = pay.name ? 'our ' + esc(bank) + ' account (' + esc(pay.name) + (pay.number ? ', ' + esc(pay.number) : '') + ') by account transfer or ' + esc(pay.method || 'InstaPay QR') : 'our ' + esc(bank) + ' account by account transfer or QR';
    var who = a.members && a.members.length > 1 ? a.members.map(function(x){ return esc(x.name) + ' <span style="color:#6F6B85">' + esc(x.code) + '</span>'; }).join('<br>') + '<br><span style="color:#6F6B85">shared package</span>' : esc(a.name || '') + (a.code ? '<br><span style="color:#6F6B85">' + esc(a.code) + '</span>' : '');
    return '<div style="font-family:Poppins,Inter,Arial,sans-serif;color:#2B2253;width:828px">'
      + '<div style="display:flex;justify-content:space-between;align-items:flex-start"><div>' + (L ? '<img src="' + L + '" style="height:54px">' : '<b>CupOfEnglish</b>') + '<div style="font-family:\'Fredoka One\',Arial;font-size:34px;margin-top:10px">Learner Service Agreement</div></div>'
      + '<div style="text-align:right;font-size:13px;margin-top:40px">This Learner Service Agreement is made on:<br><b>Date:</b> ' + ds + '<br><b>Place of Signing:</b> Online</div></div>'
      + '<div style="display:flex;gap:18px;margin-top:16px;font-size:13px">'
      + '<table style="flex:1;border-collapse:collapse;background:#F1F2F5"><tr><td colspan="2" style="padding:9px 10px;font-weight:700;border-bottom:2px solid #16BCB0">Service Provider</td></tr>' + row('Name', 'CupOfEnglish Online Tutorial Services OPC') + row('Registered in', 'Republic of the Philippines') + row('Address', 'San Vicente East, Urdaneta, Pangasinan, Philippines 2428') + row('Contact', '+63 962 644 9091') + '</table>'
      + '<table style="flex:1;border-collapse:collapse;background:#F1F2F5"><tr><td colspan="2" style="padding:9px 10px;font-weight:700;border-bottom:2px solid #16BCB0">Learner / Parent / Guardian</td></tr>' + row(a.members && a.members.length > 1 ? 'Learners' : 'Learner', who) + row('Parent', '<span style="color:#9A97AE">(sign below)</span>') + row('Contact', 'Messenger / Viber or our group chat') + row('Nationality', esc(a.nat || 'Philippines') + (a.city ? '<br><span style="color:#6F6B85">' + esc(a.city) + '</span>' : '')) + '</table></div>'
      + sec(1, 'Services', 'Mode of Learning: ' + agBox(1) + '<b>Online</b> &nbsp; ' + agBox(0) + 'Face-to-Face &nbsp; ' + agBox(0) + 'Blended<br>Class Delivery: <b>Live instructor-led sessions</b><br>Lesson Package: ' + box(15) + ' &nbsp; ' + box(30) + ' &nbsp; ' + box(60) + (pk && pk !== k ? ' <span style="color:#6F6B85">(' + pk + ' lessons incl. free)</span>' : '') + '<br>Learning Focus: <b>' + esc((P && P.name) || 'English Language Instruction Program') + '</b>')
      + sec(2, 'Enrollment &amp; Payment', 'Full payment is required before classes begin; payment to ' + how + ' confirms enrollment.')
      + sec(3, 'Lesson Package Validity', '15 lessons – 4 months · 30 lessons – 8 months · 60 lessons – 12 months<br>Validity counts from the first class of the package.<br>Unused lessons beyond validity are forfeited unless prior approval for long holidays or vacations is granted.')
      + sec(4, 'Scheduling &amp; Attendance', '• Cancellations or rescheduling must be made at least ' + H + ' hours before class.<br>• Learner late arrival or notice under ' + H + ' hours is counted as a completed class and deducted per the scheduled lesson.<br>• Provider cancellation or lateness under ' + H + ' hours results in the lesson being returned to the package.<br>• Force majeure interruptions are adjusted based on responsibility and class duration.<br>• Class times are Philippine time.')
      + sec(5, 'Refund &amp; Transfer', 'Fees are non-refundable once classes start; lesson transfers require management approval.')
      + sec(6, 'Conduct, Recording &amp; Privacy', 'Both learners and teachers are expected to maintain respectful conduct; misconduct may result in termination without refund, and classes are recorded for internal use only.')
      + sec(7, '1-on-1 Class Rules', 'All classes are one-on-one (50 minutes, or 25 minutes for younger learners); lateness does not extend class time, student-side technical issues count as completed lessons, teacher changes or learning pace are not refund grounds, official communication is via Messenger / Viber or our group chat only, and these rules form an integral part of this Agreement.')
      + sec(8, 'Acceptance', 'Payment and/or signature confirms that the learner/parent has read, understood, and agrees to this Agreement; specific program details, if any, are stated in the official invoice and enrollment record.')
      + '<div style="display:flex;gap:16px;margin-top:18px;align-items:stretch"><div style="flex:1;padding:14px 16px;border-radius:14px;background:#E3F6F6;font-size:13.5px;line-height:1.55"><b style="font-size:15px">How to sign</b><br><b>1.</b> Long-press this picture › <b>Edit</b> › write your signature, name and date in the box › send it back here.<br><b>2.</b> Or reply: <span style="font-weight:700;color:#00737B">“I have read and agree”</span></div>'
      + '<div style="flex:1;border:2px solid #2B2253;border-radius:14px;padding:12px 16px;font-size:13px;color:#2B2253"><b>Learner / Parent / Guardian signature</b><div style="height:70px;border-bottom:1.5px solid #9A97AE"></div><div style="margin-top:10px">Name: <span style="display:inline-block;width:76%;border-bottom:1.5px solid #9A97AE">&nbsp;</span></div><div style="margin-top:10px">Date: <span style="display:inline-block;width:78%;border-bottom:1.5px solid #9A97AE">&nbsp;</span></div></div></div>'
      + '<div style="margin-top:10px;font-size:12px;color:#4C4868">For CupOfEnglish Online Tutorial Services OPC · Ref. ' + esc(a.ref || '') + ' · Agreement version 2026-10 (Philippines)</div>'
      + '<div style="margin-top:14px;font-size:11px;color:#6F6B85;text-align:center;font-style:italic">Office Address: MS2-102&amp;103 Bayani Hall Centralé, San Vicente East, Urdaneta City, Pangasinan 2428 · Email: works@cupofenglishatph.com</div></div>'; }
  window.agrHtmlPh1538 = phHtml;
  var _h = window.agrHtml; if(typeof _h === 'function') window.agrHtml = function(a){ return window.agrPh1538(a) ? phHtml(a) : _h.apply(this, arguments); };
  var _m = window.agrMsg; if(typeof _m === 'function') window.agrMsg = function(a){ if(!window.agrPh1538(a)) return _m.apply(this, arguments); var n = String((a && a.name) || '').trim().split(/\s+/)[0] || 'there';
    return 'Hi ' + n + '! Before your classes begin, please read our Learner Service Agreement (picture above). To sign, long-press the picture › Edit, write your signature, name and date in the box and send it back here, or simply reply “I have read and agree”. Thank you!\nCupOfEnglish'; };
  var _p = window.agrPaint; if(typeof _p === 'function') window.agrPaint = function(){ var r = _p.apply(this, arguments); try{ var a = AGS, sb = document.getElementById('sheetBody'); if(!a || !sb || !document.getElementById('agImg')) return r;
      var ph = window.agrPh1538(a), c1 = sb.querySelector('.card');
      if(c1 && !document.getElementById('ag38')) c1.insertAdjacentHTML('afterbegin', '<div id="ag38" class="row" style="gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:8px"><span class="small mute">Agreement</span><div class="seg pp37-w" style="margin:0!important"><button type="button" class="' + (ph ? '' : 'on') + '" onclick="agrMk1538(\'cn\')">China · bilingual</button><button type="button" class="' + (ph ? 'on' : '') + '" onclick="agrMk1538(\'ph\')">Philippines · English</button></div></div>');
      if(ph){ var b = c1 && c1.querySelector('b'); if(b && /WeChat/.test(b.textContent)) b.textContent = '1 · Send it on Messenger / Viber';
        var m = c1 && c1.querySelector('.small.mute:not(span)'); if(m && /Parents in China/.test(m.textContent)) m.textContent = 'The agreement with ' + (a.name || 'the learner') + '\'s name, today\'s date and the package ticked, in English, as a picture.';
        sb.querySelectorAll('.rno').forEach(function(x){ var bb = x.querySelector('b'), sp = x.querySelector('span'); if(x.dataset.k === 'WeChat reply'){ if(bb) bb.textContent = 'Replied “I have read and agree”'; if(sp) sp.textContent = 'in Messenger / Viber · most learners'; } }); } }catch(x){ console.warn('1538', x); } return r; };
  window.agrMk1538 = function(m){ if(!AGS) return; AGS.mk = m; AGS.nat = m === 'ph' ? 'Philippines' : (/Philippines/.test(AGS.nat || '') && !/菲律宾/.test(AGS.nat || '') ? 'China 中国' : AGS.nat); AGPIC = null; agrPaint(); var im = document.getElementById('agImg'); if(im) im.removeAttribute('src'); agrPic(); };
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
console.log('1538 PH Learner Service Agreement (English)');
