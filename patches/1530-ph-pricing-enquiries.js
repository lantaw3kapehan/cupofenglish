// 1530 · Philippine market prices in Enquiries + marking Philippine-market learners for the Student portal (28 Oct 2026, Misty 21:16:
// "In ENQUIRIES, can you also put our PHILIPPINE MARKET PRICE? … for ADULT ENGLISH 1:1 and its learning system, and ADULT IELTS").
// 1. Enquiries › "Pictures & messages" gets a market switch: China · WeChat (the existing toolkit, unchanged, the default) or
//    Philippines · ₱. Philippines shows Adult English 1:1 and IELTS 1:1: the three tracks (lessons, hours, CEFR / band target, price,
//    outcome), the 4-skill learning system / IELTS roadmaps (focus areas per track), Misty's flyer pictures (ph/*.webp, Copy picture /
//    Save picture each) and a short English text with the prices to copy. Data = docs sys:pricing_ph (one source; this file holds none).
// 2. New enquiry: "Interested in" adds PH Adult English 1:1 and PH IELTS 1:1, with the track picked and its price shown. A PH enquiry's
//    Price / Roadmap buttons open the Philippine price list on its programme and track, and its row shows the track price.
// 3. Students › Student access: each student has Market (China by default / Philippines + programme + track), saved by coe-student
//    op sMarket (docs sys:ph_learners). A Philippine learner gets the portal in English (student/ 1530) and an English welcome message.
// China prices, partner rates, calculations and the China toolkit are not changed. Display + the new Market setting only.
const fs = require('fs'), file = process.argv[2];
require('../tools/lib.js')(file, [
  ["window.psMsg1354 = msg;", "window.psMsg1354 = msg; window.__ps1350 = { P: P, call: call, load: load, paint: paint, URLS: URLS };   /* 1530 · the Market setting below */"],
  ["function msg(x){ var n = String(x.name || '').trim() || '学员', ad = !!x.adult, L = [];",
   "function msg(x){ if(x && x.ph && window.phMsg1530) return phMsg1530(x, URLS); var n = String(x.name || '').trim() || '学员', ad = !!x.adult, L = [];"],
  ["' · ' + (x.adult ? 'Adult' : 'Young learner') + (x.enrolled ? '' : ' · not enrolled') + '</span>'",
   "' · ' + (x.adult ? 'Adult' : 'Young learner') + (x.enrolled ? '' : ' · not enrolled') + '</span>' + (x.ph && window.phChip1530 ? phChip1530(x) : '')"],
  ["+ '<button class=\"btn teal sm\" onclick=\"psCopy(\\'' + x.code + '\\')\">Copy WeChat message</button>'",
   "+ '<button class=\"btn teal sm\" onclick=\"psCopy(\\'' + x.code + '\\')\">' + (x.ph ? 'Copy message (English)' : 'Copy WeChat message') + '</button>' + '<button class=\"btn ghost sm\" onclick=\"psPh(\\'' + x.code + '\\')\">Market</button>'"],
  ["+ (x.access ? 'Switch off' : 'Switch on') + '</button></div></div>'; }).join('')",
   "+ (x.access ? 'Switch off' : 'Switch on') + '</button></div><div class=\"ph30-slot\" id=\"psPh_' + x.code + '\"></div></div>'; }).join('')"],
  ["'<div class=\"small mute\" style=\"margin:8px 0\">' + on + ' student'",
   "'<div class=\"small mute\" style=\"margin:8px 0 0\">Philippine-market learners: tap <b>Market</b> › Philippines and pick the programme and track. They sign in the same way (ST code + English name) and see the portal in English with their learning roadmap.</div><div class=\"small mute\" style=\"margin:8px 0\">' + on + ' student'"],
  ["window.ENQ_GO = function(){ ENQ_F = 'follow'; go('enquiry'); };", "window.ENQ_GO = function(){ ENQ_F = 'follow'; go('enquiry'); }; window.__enq1530 = () => ENQ;"],
  ["const PROGS = ['Kids & teens', 'Adults', 'IELTS', 'PET', 'KET'], SRCS", "const PROGS = ['Kids & teens', 'Adults', 'IELTS', 'PET', 'KET', 'PH Adult English 1:1', 'PH IELTS 1:1'], SRCS"]
]);
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<style id="css1530">
/* 1530 · Philippine market (Enquiries) */
#v-enquiry .ph30-sw{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:22px 0 4px}
#v-enquiry .ph30-sw>span{font-size:13px;color:var(--ui-mute,#6B6880);font-weight:600}
#v-enquiry .ph30-sw .seg{margin:0}
#v-enquiry .ph30-sw .seg button{min-height:36px;display:inline-flex;align-items:center;gap:6px}
#v-enquiry .ph30-hide{display:none!important}
#ph30{margin-top:14px}
#ph30 .ph30-intro{font-size:13px;color:var(--ui-mute,#6B6880);margin:0 2px 12px;line-height:1.5}
#ph30 .ph30-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}
@media(max-width:980px){#ph30 .ph30-grid{grid-template-columns:minmax(0,1fr)}}
.ph30-card{background:#fff;border:1px solid var(--ui-line,#E6E8EE);border-radius:var(--ui-r,14px);padding:16px 18px;min-width:0}
.ph30-card h3{margin:0;font-family:var(--brand,'Fredoka One');font-weight:400;font-size:21px;color:#2B2253;display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.ph30-card h3 .chip{font-family:var(--ui-font,Inter);font-size:11px;font-weight:700;letter-spacing:.04em}
.ph30-sub{font-size:13px;color:var(--ui-mute,#6B6880);margin:3px 0 10px}
.ph30-tr{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:2px 12px;padding:10px 0;border-top:1px solid #EEF0F4;align-items:center}
.ph30-tr b.ph30-n{font-size:15px;color:#2B2253}
.ph30-tr .ph30-p{font-size:18px;font-weight:700;color:#00737B;font-variant-numeric:tabular-nums;text-align:right;white-space:nowrap}
.ph30-tr .ph30-m{font-size:12.5px;color:#4A4860;grid-column:1/-1}
.ph30-tr .ph30-g{font-size:12.5px;color:#6B6880;grid-column:1/-1}
.ph30-tr.on{background:#F1FAFA;margin:0 -10px;padding:10px;border-radius:10px;border-top-color:transparent}
.ph30-tg{display:inline-block;font-size:11.5px;font-weight:700;color:#5B4B9E;background:#EEEAF8;border-radius:999px;padding:1px 8px;margin-left:6px;vertical-align:1px}
.ph30-sk{display:flex;flex-wrap:wrap;gap:6px;margin:12px 0 4px}
.ph30-sk span{font-size:12px;font-weight:600;color:#00737B;background:#E3F4F5;border-radius:999px;padding:3px 10px}
.ph30-act{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}
.ph30-act .btn{min-height:38px}
.ph30-pics{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px;margin-top:12px}
.ph30-pic{border:1px solid #EEF0F4;border-radius:12px;padding:6px;background:#FAFBFC;min-width:0}
.ph30-pic img{display:block;width:100%;aspect-ratio:2000/1677;height:auto;border-radius:8px;background:#E9F6F6;cursor:zoom-in;object-fit:cover}
.ph30-pic .ph30-pt{font-size:12px;font-weight:600;color:#2B2253;margin:6px 2px 4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ph30-pic .ph30-pr{display:flex;gap:6px}
.ph30-pic .ph30-pr button{flex:1;min-height:32px;padding:4px 6px;font-size:12px}
.ph30-sk0{height:420px;border-radius:var(--ui-r,14px);background:linear-gradient(90deg,#F2F4F7,#F8F9FB,#F2F4F7);border:1px solid var(--ui-line,#E6E8EE)}
.ph30-ic{width:15px;height:15px;flex:none;vertical-align:-3px}
/* sheet */
.ph30-sh .ph30-tracks{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:12px 0}
@media(max-width:700px){.ph30-sh .ph30-tracks{grid-template-columns:minmax(0,1fr)}}
.ph30-sh .ph30-t{border:1px solid #E6E8EE;border-radius:14px;padding:12px 14px;background:#fff}
.ph30-sh .ph30-t.on{border-color:#00A3AD;box-shadow:0 0 0 2px #CDEFF0 inset}
.ph30-sh .ph30-t h4{margin:0;font-family:var(--brand,'Fredoka One');font-weight:400;font-size:18px;color:#2B2253}
.ph30-sh .ph30-t .ph30-p{font-size:22px;font-weight:700;color:#00737B;margin:4px 0;font-variant-numeric:tabular-nums}
.ph30-sh .ph30-t .ph30-m{font-size:13px;color:#4A4860;line-height:1.5}
.ph30-sh .ph30-t .ph30-o{font-size:13px;margin-top:6px;line-height:1.5}
.ph30-sh h2{font-size:16px;margin:18px 0 8px;color:#2B2253}
.ph30-sh .ph30-skills{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
@media(max-width:700px){.ph30-sh .ph30-skills{grid-template-columns:minmax(0,1fr)}}
.ph30-sh .ph30-s{border:1px solid #E6E8EE;border-radius:14px;padding:12px 14px;background:#fff}
.ph30-sh .ph30-s b.ph30-h{font-size:15px;color:#2B2253}
.ph30-sh .ph30-s .ph30-a{font-size:13px;color:#4A4860;margin:2px 0 6px}
.ph30-sh .ph30-s ul{margin:0;padding-left:18px;font-size:13px;line-height:1.6}
.ph30-sh .ph30-s .ph30-res{font-size:12.5px;color:#00737B;font-weight:600;margin-top:6px}
.ph30-sh .ph30-fa{margin-top:8px;border-top:1px dashed #DDE3E8;padding-top:8px}
.ph30-sh .ph30-fa div{font-size:12.5px;line-height:1.5;margin-bottom:4px}
.ph30-sh .ph30-txt{white-space:pre-wrap;font-size:13px;line-height:1.55;background:#F4FAFA;border:1px solid #DCEFEF;border-radius:12px;padding:12px;margin:8px 0;max-height:280px;overflow:auto}
.ph30-big{display:block;width:100%;height:auto;aspect-ratio:2000/1677;border-radius:12px;border:1px solid #E6EEF0;background:#E9F6F6}
/* Student access · Market */
.ph30-slot:empty{display:none}
.ph30-ed{margin-top:10px;padding:12px;border-radius:12px;background:#F6F8FA;border:1px solid #E6E8EE}
.ph30-ed .seg{margin:6px 0}
.ph30-ed label.l{display:block;font-size:12px;font-weight:700;color:#6B6880;margin-top:8px}
.ph30-chip{display:inline-block;margin-left:6px;font-size:11.5px;font-weight:700;color:#5B4B9E;background:#EEEAF8;border-radius:999px;padding:1px 8px}
#eqPhT .seg button{height:auto;min-height:44px;display:inline-flex;flex-direction:column;align-items:flex-start;line-height:1.25;padding:6px 12px}
#eqPhT .seg button small{font-size:11.5px;opacity:.85}
</style>
<script>
/* 1530 · Philippine market prices (Enquiries) + Market setting (Student access) */
(function(){
  if(window.__1530) return; window.__1530 = 1;
  var KEY = 'coe.pricing_ph', MK = 'coe.enqMarket', PHD = null, at = 0, busy = 0;
  try{ PHD = JSON.parse(localStorage.getItem(KEY) || 'null'); }catch(e){}
  var e = function(x){ return typeof esc === 'function' ? esc(x) : String(x == null ? '' : x).replace(/[&<>"']/g, function(c){ return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var peso = function(n){ return '\u20B1' + Number(n || 0).toLocaleString('en-US'); };
  var IC = { copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>', save: '<path d="M12 4v11M7 10l5 5 5-5"/><path d="M5 20h14"/>', text: '<path d="M5 6h14M5 11h14M5 16h9"/>', map: '<path d="M4 6l5-2 6 2 5-2v14l-5 2-6-2-5 2z"/><path d="M9 4v14M15 6v14"/>', flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>', globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.6 2.5 14.4 0 17M12 3.5c-2.5 2.6-2.5 14.4 0 17"/>' };
  var ic = function(k){ return '<svg class="ph30-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + IC[k] + '</svg>'; };
  var prog = function(id){ return PHD && (PHD.programs || []).find(function(p){ return p.id === id; }) || null; };
  var track = function(P, id){ return P && (P.tracks || []).find(function(t){ return t.id === id; }) || null; };
  var img = function(id, small){ return 'ph/' + id + (small ? '-s' : '') + '.webp'; };
  var lc = function(t){ t = String(t || ''); return t.charAt(0).toLowerCase() + t.slice(1); };
  var tgt = function(P, t){ return (P.measure === 'Band' ? 'Band ' : 'CEFR ') + t.target; };

  /* ── data: docs sys:pricing_ph (the one source) ── */
  function load(force){ if(busy || typeof TOKEN === 'undefined' || !TOKEN || typeof FAST_URL === 'undefined') return; if(!force && PHD && Date.now() - at < 5 * 6e4) return; busy = 1;
    fetch(FAST_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'docs', token: TOKEN, keys: ['sys:pricing_ph'] }) }).then(function(r){ return r.json(); })
      .then(function(j){ var d = j && j.ok && j.docs && j.docs['sys:pricing_ph']; if(d && d.data && Array.isArray(d.data.programs)){ var ch = JSON.stringify(d.data) !== JSON.stringify(PHD); PHD = d.data; at = Date.now(); try{ localStorage.setItem(KEY, JSON.stringify(PHD)); }catch(x){} if(ch) repaint(); } })
      .catch(function(){}).finally(function(){ busy = 0; }); }
  window.phPricing1530 = function(){ return PHD; };

  /* ── text with prices (Messenger / Viber / e-mail) ── */
  function text(P, tid){ var T = (P.tracks || []).filter(function(t){ return !tid || t.id === tid; }), L = [];
    L.push('CupOfEnglish · ' + P.name);
    L.push('One-to-one online lessons · ' + P.lessonMins + ' minutes each' + (P.system && P.system.skills ? ' · ' + P.system.skills.map(function(k){ return k.name; }).join(', ') : ''));
    if(P.measure === 'Band') L.push(P.tagline);
    T.forEach(function(t){ L.push(''); L.push(t.name + ' Track · ' + peso(t.price));
      L.push(t.lessons + ' lessons' + (t.extra ? ' + ' + t.extra : '') + ' (\u2248' + t.hours + ' hours) · ' + (P.measure === 'Band' ? 'target band ' : 'CEFR ') + t.target + (t.gain ? ' · expected band gain ' + t.gain : ''));
      L.push(String(t.goal || '').replace(/\.$/, '') + ': ' + lc(t.outcome)); });
    L.push(''); L.push(P.method); L.push(P.small); L.push(''); L.push('Message us to book a trial class or to enrol. ' + (P.closing || ''));
    return L.join('\n'); }
  function copyText(t, what){ (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(function(){ toast((what || 'Text') + ' copied · paste it in Messenger, Viber or e-mail'); }, function(){ try{ prompt('Copy this text', t); }catch(x){ toast('Could not copy · select the text and copy it'); } }); }
  window.phCopyText = function(pid, tid){ var P = prog(pid); if(!P) return toast('Price list still loading · try again'); copyText(text(P, tid || ''), 'Prices'); };

  /* ── pictures: Copy picture (PNG to the clipboard) / Save picture (JPEG; the phone's share sheet on phones) ── */
  function blob(id, type){ return new Promise(function(ok, no){ var im = new Image(); im.onload = function(){ try{ var c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight; var x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.drawImage(im, 0, 0); c.toBlob(function(b){ b ? ok(b) : no(new Error('blob')); }, type, 0.92); }catch(err){ no(err); } }; im.onerror = no; im.src = img(id); }); }
  window.phCopyPic = function(id){ try{ var it = new ClipboardItem({ 'image/png': blob(id, 'image/png') }); navigator.clipboard.write([it]).then(function(){ toast('Picture copied · paste it in Messenger, Viber or e-mail'); }, function(){ toast('Could not copy the picture here · use Save picture'); }); }catch(x){ toast('Could not copy the picture here · use Save picture'); } };
  window.phSavePic = function(id){ blob(id, 'image/jpeg').then(function(b){ var f = new File([b], 'CupOfEnglish-' + id + '.jpg', { type: 'image/jpeg' });
      if(/Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) && navigator.share && navigator.canShare && navigator.canShare({ files: [f] })){ navigator.share({ files: [f] }).catch(function(){}); return; }
      var a = document.createElement('a'); a.href = URL.createObjectURL(f); a.download = f.name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function(){ URL.revokeObjectURL(a.href); }, 5000); toast('Picture saved'); })
    .catch(function(){ toast('Could not make the picture · try again'); }); };
  window.phPic = function(pid, id){ var P = prog(pid), f = P && (P.flyers || []).find(function(x){ return x.id === id; }); if(!f) return;
    openSheet('<div class="ph30-sh"><h1>' + e(f.title) + '</h1><div class="mute small">Philippine market · ' + e(P.short) + '</div><img class="ph30-big" style="margin-top:12px" src="' + img(id) + '" alt="' + e(f.title) + '">'
      + '<div class="row" style="gap:8px;margin-top:12px"><button class="btn teal grow" onclick="phCopyPic(\'' + id + '\')">' + ic('copy') + ' Copy picture</button><button class="btn ghost grow" onclick="phSavePic(\'' + id + '\')">' + ic('save') + ' Save picture</button></div>'
      + '<button class="btn ghost block" style="margin-top:8px" onclick="phOpen(\'' + pid + '\')">‹ Back to ' + e(P.short) + '</button></div>'); try{ $('sheet').classList.add('wide'); }catch(x){} };
  function pics(P){ return '<div class="ph30-pics">' + (P.flyers || []).map(function(f){ return '<div class="ph30-pic"><img loading="lazy" decoding="async" width="640" height="537" src="' + img(f.id, 1) + '" alt="' + e(f.title) + '" onclick="phPic(\'' + P.id + '\',\'' + f.id + '\')"><div class="ph30-pt" title="' + e(f.title) + '">' + e(f.title) + '</div><div class="ph30-pr"><button class="btn ghost sm" onclick="phCopyPic(\'' + f.id + '\')" aria-label="Copy picture: ' + e(f.title) + '">' + ic('copy') + ' Copy</button><button class="btn ghost sm" onclick="phSavePic(\'' + f.id + '\')" aria-label="Save picture: ' + e(f.title) + '">' + ic('save') + ' Save</button></div></div>'; }).join('') + '</div>'; }

  /* ── Enquiries: the Philippine section ── */
  function card(P, tid){ return '<div class="ph30-card"><h3>' + e(P.short) + ' <span class="chip">' + (P.measure === 'Band' ? 'IELTS BAND' : 'CEFR') + '</span></h3><div class="ph30-sub">' + e(P.tagline) + ' · ' + P.lessonMins + '-minute lessons</div>'
      + (P.tracks || []).map(function(t){ return '<div class="ph30-tr' + (t.id === tid ? ' on' : '') + '"><div><b class="ph30-n">' + e(t.name) + '</b><span class="ph30-tg">' + e(tgt(P, t)) + '</span></div><div class="ph30-p">' + peso(t.price) + '</div><div class="ph30-m">' + t.lessons + ' lessons' + (t.extra ? ' + ' + e(t.extra) : '') + ' · \u2248' + t.hours + ' hours' + (t.gain ? ' · band gain ' + e(t.gain) : '') + '</div><div class="ph30-g">' + e(t.goal) + '</div></div>'; }).join('')
      + '<div class="ph30-sk">' + ((P.system && P.system.skills) || []).map(function(k){ return '<span>' + e(k.name) + '</span>'; }).join('') + '</div>'
      + '<div class="ph30-act"><button class="btn teal sm" onclick="phCopyText(\'' + P.id + '\')">' + ic('text') + ' Copy prices (text)</button><button class="btn ghost sm" onclick="phOpen(\'' + P.id + '\')">' + ic('map') + ' ' + (P.measure === 'Band' ? 'Skills & roadmaps' : 'Learning system') + '</button></div>'
      + pics(P) + '</div>'; }
  function section(){ if(!PHD) return '<section id="ph30"><div class="ph30-intro">Loading the Philippine price list…</div><div class="ph30-sk0" aria-busy="true"></div></section>';
    return '<section id="ph30"><div class="ph30-intro">For enquiries from the Philippines · prices in pesos (\u20B1), separate from the China price list · send a flyer picture or the price text on Messenger, Viber or e-mail. Price list updated ' + e(PHD.updated || '') + '.</div><div class="ph30-grid">' + (PHD.programs || []).map(function(P){ return card(P); }).join('') + '</div></section>'; }
  var mode = function(){ try{ return localStorage.getItem(MK) === 'ph' ? 'ph' : 'cn'; }catch(x){ return 'cn'; } };
  function apply(el){ var m = mode(), sw = el.querySelector('#ph30sw');
    if(!sw){ var box = el.querySelector('#enqBox'); if(!box) return;
      box.insertAdjacentHTML('afterend', '<div class="ph30-sw" id="ph30sw"><span>' + ic('globe') + ' Market</span><div class="seg" role="group" aria-label="Market"><button type="button" data-m="cn" onclick="phMarket(\'cn\')">China · WeChat (\u00A5)</button><button type="button" data-m="ph" onclick="phMarket(\'ph\')">Philippines (\u20B1)</button></div></div>');
      sw = el.querySelector('#ph30sw'); }
    sw.querySelectorAll('button').forEach(function(b){ var on = b.getAttribute('data-m') === m; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
    var after = [], n = sw.nextElementSibling; while(n){ if(n.id !== 'ph30') after.push(n); n = n.nextElementSibling; }
    after.forEach(function(x){ x.classList.toggle('ph30-hide', m === 'ph'); });
    var cur = el.querySelector('#ph30');
    if(m === 'ph'){ var h = section(); if(cur){ if(cur.outerHTML !== h) cur.outerHTML = h; } else sw.insertAdjacentHTML('afterend', h); load(); }
    else if(cur) cur.remove(); }
  function repaint(){ try{ var el = $('v-enquiry'); if(el && mode() === 'ph' && el.querySelector('#ph30')) apply(el); }catch(x){} }
  window.phMarket = function(m){ try{ localStorage.setItem(MK, m === 'ph' ? 'ph' : 'cn'); }catch(x){} var el = $('v-enquiry'); if(el) apply(el); };

  /* PH enquiries: the price on the row; Price / Roadmap open the Philippine list */
  var parse = function(p){ p = String(p || ''); if(!/^PH /i.test(p)) return null; var t = (p.match(/(Foundation|Professional|Mastery)/i) || [])[1]; return { pid: /ielts/i.test(p) ? 'ielts' : 'adult', tid: t ? t.toLowerCase() : '' }; };
  var ENQS = function(){ try{ return (window.__enq1530 && window.__enq1530()) || []; }catch(x){ return []; } };
  function rows(el){ var L = ENQS(); if(!L.length) return; el.querySelectorAll('#enqBox button[onclick^="enqPic(\'"]').forEach(function(b){ var m = String(b.getAttribute('onclick')).match(/^enqPic\('([^']+)','([pr])'\)/); if(!m) return;
      var q = L.find(function(x){ return x && String(x.id) === m[1]; }), ph = q && parse(q.prog); if(!ph) return;
      if(m[2] === 'p'){ b.textContent = 'PH price'; var P = prog(ph.pid), T = track(P, ph.tid), tags = b.closest('.tdr') && b.closest('.tdr').querySelector('.tags');
        if(tags && T && !tags.querySelector('.ph30-chip')) tags.insertAdjacentHTML('afterbegin', '<span class="chip ph30-chip">' + e(T.name) + ' · ' + peso(T.price) + '</span>'); }
      else b.textContent = 'PH roadmap'; }); }
  var _p = window.enqPic; if(_p) window.enqPic = function(id, k){ if(k === 'p' || k === 'r'){ var q = ENQS().find(function(x){ return x && String(x.id) === String(id); }), ph = q && parse(q.prog); if(ph) return phOpen(ph.pid, ph.tid, k === 'r'); } return _p.apply(this, arguments); };

  var _r = window.renderEnq; if(_r) window.renderEnq = function(){ var r = _r.apply(this, arguments); try{ var el = $('v-enquiry'); if(el){ apply(el); rows(el); } }catch(x){ console.warn('ph1530', x); } return r; };

  /* ── the full sheet: tracks, learning system / roadmaps, pictures, text ── */
  window.phOpen = function(pid, tid, sys){ var P = prog(pid); if(!P){ load(true); return toast('Price list still loading · try again in a moment'); } tid = tid || '';
    var S = P.system || {}, ft = tid || 'foundation';
    var trk = '<div class="ph30-tracks">' + (P.tracks || []).map(function(t){ return '<div class="ph30-t' + (t.id === tid ? ' on' : '') + '"><h4>' + e(t.name) + ' Track</h4><div class="ph30-p">' + peso(t.price) + '</div><div class="ph30-m">' + t.lessons + ' lessons' + (t.extra ? ' + ' + e(t.extra) : '') + ' · \u2248' + t.hours + ' hours<br>' + e(tgt(P, t)) + (t.gain ? '<br>Expected band gain ' + e(t.gain) : '') + '</div><div class="ph30-o"><b>' + e(t.goal) + '</b> ' + e(t.outcome) + '</div></div>'; }).join('') + '</div>';
    var fsel = P.measure === 'Band' ? '<div class="seg" role="group" aria-label="Track focus" style="margin:4px 0 10px">' + (P.tracks || []).map(function(t){ return '<button type="button" class="' + (t.id === ft ? 'on' : '') + '" onclick="phOpen(\'' + pid + '\',\'' + tid + '\',1,\'' + t.id + '\')">' + e(t.name) + '</button>'; }).join('') + '</div>' : '';
    var f4 = arguments[3] || ft;
    var skills = '<div class="ph30-skills">' + (S.skills || []).map(function(k){ var fa = k.focus && k.focus[f4];
        return '<div class="ph30-s"><b class="ph30-h">' + e(k.name) + '</b><div class="ph30-a">' + e(k.aim) + '</div><ul>' + (k.core || []).map(function(c){ return '<li>' + e(c) + '</li>'; }).join('') + '</ul><div class="ph30-res">' + e(k.result) + '</div>'
          + (fa ? '<div class="ph30-fa"><div class="small mute" style="margin-bottom:6px">Key focus · ' + e((track(P, f4) || {}).name || '') + ' Track</div>' + fa.map(function(x){ return '<div><b>' + e(x[0]) + '</b> – ' + e(x[1]) + '</div>'; }).join('') + (k.coach && k.coach.length ? '<div class="small mute" style="margin-top:6px">' + k.coach.map(function(c){ return e(c[0]); }).join(' · ') + '</div>' : '') + '</div>' : '') + '</div>'; }).join('') + '</div>';
    var t0 = text(P, tid);
    openSheet('<div class="ph30-sh"><h1>' + e(P.name) + '</h1><div class="mute small">Philippine market · prices in pesos · ' + e(P.small) + '</div>' + trk
      + '<h2 id="ph30sys">' + e(S.title || 'Learning system') + '</h2><div class="small mute" style="margin-bottom:8px">' + e(S.sub || '') + ' · ' + e(P.method) + '</div>' + fsel + skills
      + (S.footer && S.footer.length ? '<div class="small" style="margin-top:10px;color:#4A4860">' + S.footer.map(e).join(' · ') + '</div>' : '')
      + '<h2>Pictures</h2>' + pics(P)
      + '<h2>Text to send</h2><div class="ph30-txt" id="ph30txt">' + e(t0) + '</div><div class="row" style="gap:8px"><button class="btn teal grow" onclick="phCopyText(\'' + pid + '\',\'' + tid + '\')">' + ic('text') + (tid ? ' Copy this track (text)' : ' Copy prices (text)') + '</button>' + (tid ? '<button class="btn ghost grow" onclick="phCopyText(\'' + pid + '\')">All three tracks</button>' : '') + '</div></div>');
    try{ $('sheet').classList.add('wide'); }catch(x){}
    if(sys || arguments[3]) setTimeout(function(){ var h = document.getElementById('ph30sys'); if(h && h.scrollIntoView) h.scrollIntoView({ block: 'start' }); }, 30); };

  /* ── New enquiry: PH programmes get a track with its price ── */
  var _n = window.enqNew; if(_n) window.enqNew = function(){ var r = _n.apply(this, arguments); try{ load();
      var g = $('eqP'); if(!g || $('eqPhT')) return r;
      g.insertAdjacentHTML('afterend', '<div id="eqPhT" style="display:none"><div class="small" style="margin-top:12px"><b>Track</b> · Philippine price list</div><div class="seg" style="flex-wrap:wrap" id="eqPhS"></div></div>');
      var paint = function(){ var b = g.querySelector('button.on'), ph = b && parse(b.textContent), box = $('eqPhT'); if(!box) return; box.style.display = ph ? '' : 'none'; if(!ph) return;
        var P = prog(ph.pid), cur = (box.querySelector('#eqPhS button.on') || {}).getAttribute ? box.querySelector('#eqPhS button.on').getAttribute('data-t') : '';
        $('eqPhS').innerHTML = P ? (P.tracks || []).map(function(t){ return '<button type="button" data-t="' + t.id + '" class="' + (t.id === cur ? 'on' : '') + '" onclick="this.parentNode.querySelectorAll(\'button\').forEach(function(x){ x.classList.remove(\'on\'); }); this.classList.add(\'on\')">' + e(t.name) + '<small>' + peso(t.price) + ' · ' + t.lessons + ' lessons · ' + e(tgt(P, t)) + '</small></button>'; }).join('') + '<button type="button" data-t="" class="' + (!cur ? 'on' : '') + '" onclick="this.parentNode.querySelectorAll(\'button\').forEach(function(x){ x.classList.remove(\'on\'); }); this.classList.add(\'on\')">Not sure yet<small>pick later</small></button>' : '<span class="small mute">Price list loading…</span>'; };
      g.addEventListener('click', function(){ setTimeout(paint, 0); }); paint(); }catch(x){ console.warn('ph1530 new', x); } return r; };
  var _s = window.enqSave; if(_s) window.enqSave = function(){ var b = document.querySelector('#eqP button.on'), ph = b && parse(b.textContent), old = b ? b.textContent : '';
    if(ph){ var t = document.querySelector('#eqPhS button.on'), T = t && t.getAttribute('data-t') ? track(prog(ph.pid), t.getAttribute('data-t')) : null; if(T) b.textContent = old + ' · ' + T.name; }
    try{ return _s.apply(this, arguments); } finally { if(b && b.isConnected) b.textContent = old; } };

  /* ── Student access: Market (China by default / Philippines + programme + track) ── */
  var PE = {};
  window.phChip1530 = function(x){ var P = prog(x.ph.prog), T = track(P, x.ph.track); return '<span class="ph30-chip">Philippines' + (P ? ' · ' + e(P.short) : '') + (T ? ' · ' + e(T.name) : '') + '</span>'; };
  function ed(code){ var s = PE[code], slot = document.getElementById('psPh_' + code); if(!slot) return; if(!s){ slot.innerHTML = ''; return; }
    var seg = function(k, opts){ return '<div class="seg" role="group" style="flex-wrap:wrap">' + opts.map(function(o){ return '<button type="button" class="' + (s[k] === o[0] ? 'on' : '') + '" onclick="psPhSet(\'' + code + '\',\'' + k + '\',\'' + o[0] + '\')">' + e(o[1]) + '</button>'; }).join('') + '</div>'; };
    var progs = (PHD && PHD.programs || [{ id: 'adult', short: 'Adult English 1:1' }, { id: 'ielts', short: 'IELTS 1:1' }]).map(function(p){ return [p.id, p.short]; });
    var P = prog(s.prog), trs = (P ? P.tracks : [{ id: 'foundation', name: 'Foundation' }, { id: 'professional', name: 'Professional' }, { id: 'mastery', name: 'Mastery' }]).map(function(t){ return [t.id, t.name + (t.lessons ? ' · ' + t.lessons + ' lessons' : '')]; }).concat([['', 'Not set']]);
    slot.innerHTML = '<div class="ph30-ed"><label class="l">Market</label>' + seg('m', [['cn', 'China (default)'], ['ph', 'Philippines']])
      + (s.m === 'ph' ? '<label class="l">Programme</label>' + seg('prog', progs) + '<label class="l">Track</label>' + seg('track', trs) + '<div class="small mute" style="margin-top:6px">The portal shows this learner in English: programme, track, target, the 4-skill roadmap, lessons, schedule and reports. No prices.</div>' : '<div class="small mute" style="margin-top:6px">The Chinese-first portal, as today.</div>')
      + '<div class="row" style="gap:8px;margin-top:10px"><button class="btn teal sm" ' + (s.busy ? 'disabled ' : '') + 'onclick="psPhSave(\'' + code + '\')">' + (s.busy ? 'Saving…' : 'Save market') + '</button><button class="btn ghost sm" onclick="psPh(\'' + code + '\')">Close</button></div></div>'; }
  window.psPh = function(code){ if(PE[code]){ delete PE[code]; ed(code); return; } load(); var A = window.__ps1350, x = A && (A.P.list || []).find(function(y){ return y.code === code; }); if(!x) return;
    PE[code] = { m: x.ph ? 'ph' : 'cn', prog: x.ph ? x.ph.prog : 'adult', track: x.ph ? x.ph.track : '' }; ed(code); };
  window.psPhSet = function(code, k, v){ var s = PE[code]; if(!s) return; s[k] = v; if(k === 'prog') s.track = s.track || ''; ed(code); };
  window.psPhSave = function(code){ var s = PE[code], A = window.__ps1350; if(!s || !A || s.busy) return; if(s.m === 'ph' && !s.prog) return toast('Pick the programme');
    s.busy = 1; ed(code);
    A.call('sMarket', { code: code, ph: s.m === 'ph', prog: s.prog, track: s.track }).then(function(r){ s.busy = 0; if(r && r.ok){ delete PE[code]; toast(s.m === 'ph' ? 'Saved · ' + code + ' sees the portal in English' : 'Saved · ' + code + ' back to the China portal'); A.load(); } else { toast((r && r.msg) || 'Not saved · try again'); ed(code); } })
      .catch(function(){ s.busy = 0; toast('No connection · try again'); ed(code); }); };
  window.phMsg1530 = function(x, U){ var n = String(x.name || '').trim() || 'there', P = x.ph && prog(x.ph.prog), T = P && track(P, x.ph.track), L = [];
    L.push('CupOfEnglish · Student Portal');
    L.push('Hello ' + n + '! Your classes, lessons left, class notes, monthly reports' + (P ? ' and your ' + P.short + (T ? ' ' + T.name + ' Track' : '') + ' learning roadmap' : '') + ' are now on your phone.');
    L.push(''); L.push('Link: ' + U + '?lang=en'); L.push('Student code: ' + x.code); L.push(x.own ? 'Password: the password you set (message us if you need it reset)' : 'Password: ' + n + ' (your first name, not case-sensitive)');
    L.push(''); L.push('Add it to your home screen so it opens like an app:'); L.push('iPhone: open the link in Safari › Share › Add to Home Screen.'); L.push('Android: open the link in Chrome › menu (\u22EE) › Add to Home screen.');
    L.push(''); L.push('You stay signed in for 30 days. Message us anytime if you need help!'); return L.join('\n'); };

  try{ if(typeof VIEW !== 'undefined' && VIEW === 'enquiry') renderEnq(); }catch(x){}
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
console.log('1530 Philippine market prices · Enquiries + Student access Market');
