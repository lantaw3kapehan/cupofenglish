// 1564 · Enquiries: correct days, tidy links as names, summary cards open what they count, Philippine rows use the English templates
// (29 Oct 2026, Misty's audit). Stored enquiries are not changed (names, links, status, trial links all as saved).
// · Days since logged: counted in Philippine calendar days and never below 0 (an enquiry logged between midnight and 8 am showed "-1").
//   "1 day" / "N days"; the follow-up chip "1 day quiet" / "N days quiet".
// · A name or contact that is a web link (e.g. a Messenger conversation URL) shows as "Messenger · …last digits" and stays a link (opens
//   in a new tab, full address on hover). Sheet titles use the same short text; any sheet title wraps a long word instead of running off the card. Long words wrap instead of widening the row.
// · Summary cards: Logged (all, ever) now opens all logged enquiries (it opened Open, which leaves out enrolled and Not now), Reached
//   trial opens everyone who reached a trial (it opened Trial booked only). Enrolled / Not now unchanged. The card you opened is marked.
// · Phone: the row actions wrap as compact buttons (were 11 full-width buttons per enquiry).
// · A Philippine enquiry ("PH Adult English 1:1 / PH IELTS 1:1 …"): Trial invite copies the English invitation (the PH toolkit's own text),
//   Inquiry form is the English form, the China-only CEFR picture button is not shown. China rows: unchanged. The Market switch and
//   the PH toolkit are unchanged.
require('../tools/lib.js')(process.argv[2], [
  ["const days = s => { const t = Date.parse(String(s || '').slice(0, 10)); return isNaN(t) ? 0 : Math.floor((Date.now() - t) / 864e5); };",
   "const days = s => { const d = String(s || '').slice(0, 10), t = Date.parse(d), n = Date.parse(new Date(Date.now() + 8 * 3600e3).toISOString().slice(0, 10)); return isNaN(t) ? 0 : Math.max(0, Math.round((n - t) / 864e5)); };"],
  ["<div class=\"tdn\"><b class=\"num\">' + days(e.at) + '</b><span>days</span></div>", "<div class=\"tdn\"><b class=\"num\">' + days(e.at) + '</b><span>' + (days(e.at) === 1 ? 'day' : 'days') + '</span></div>"],
  ["'<span class=\"chip coral\">Follow up · ' + d + ' days quiet</span>'", "'<span class=\"chip coral\">Follow up · ' + d + (d === 1 ? ' day' : ' days') + ' quiet</span>'"],
  ["<div><b>' + esc(e.name) + '</b> <span class=\"mute small\">' + esc([e.wechat, e.age ? e.age + ' yrs' : ''].filter(Boolean).join(' · ')) + '</span></div>",
   "<div class=\"en64\"><b>' + enqNm1564(e.name) + '</b> <span class=\"mute small\">' + [e.wechat ? enqNm1564(e.wechat) : '', e.age ? esc(e.age + ' yrs') : ''].filter(Boolean).join(' · ') + '</span></div>"],
  ["openSheet('<h1>Note · ' + esc(e.name) + '</h1>", "openSheet('<h1>Note · ' + esc(enqTx1564(e.name)) + '</h1>"],
  ["openSheet('<h1>Inquiry form · ' + esc(e.name) + '</h1>", "openSheet('<h1>Inquiry form · ' + esc(enqTx1564(e.name)) + '</h1>"],
  ["openSheet('<h1>Link a trial · ' + esc(e.name) + '</h1>", "openSheet('<h1>Link a trial · ' + esc(enqTx1564(e.name)) + '</h1>"],
  ["if(q) bits.push('<b>From enquiry</b> · ' + esc(q.name) +", "if(q) bits.push('<b>From enquiry</b> · ' + esc(enqTx1564(q.name)) +"],
  ["const L = ENQ || [], F = { follow: L.filter(isFollow),", "const L = ENQ || [], F = { every: L, reached: L.filter(e => e.st === 'Trial booked' || e.st === 'Enrolled' || e.trial), follow: L.filter(isFollow),"],
  ["+ st('all', 'Logged', n, '#2B2253', 'enquiries · ever', 1, 'Every enquiry ever logged · opens the Open tab (not enrolled and not set to Not now)') + st('trial', 'Reached trial', tb, '#00A3AD', pc(tb) + '% of logged · ' + tbNow + ' at trial now', 1, 'Ever reached a trial: Trial booked, Enrolled or a linked trial · opens the Trial booked tab (status is Trial booked now)')",
   "+ st('every', 'Logged', n, '#2B2253', 'enquiries · ever', 1, 'Every enquiry ever logged · opens all of them') + st('reached', 'Reached trial', tb, '#00A3AD', pc(tb) + '% of logged · ' + tbNow + ' at trial now', 1, 'Ever reached a trial: Trial booked, Enrolled or a linked trial · opens all of them')"]
]);
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8'); const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<style id="en64css">
#v-enquiry .en64{overflow-wrap:anywhere}
#sheetBody h1{overflow-wrap:anywhere}
#v-enquiry .en64 a.lk{color:inherit;text-decoration:underline;text-decoration-color:#B9B7C6;text-underline-offset:2px}
#v-enquiry .fn31 .st[data-enq-card]{cursor:pointer}
#v-enquiry .fn31 .st.on{box-shadow:0 0 0 2px var(--c) inset;border-radius:var(--ui-r,14px)}
@media(max-width:720px){#v-enquiry #enqBox .tdr .row .btn.sm{width:auto;height:36px;padding:0 12px;font-size:13.5px}}
</style>
<script>
/* 1564 · Enquiries fixes */
(function(){ if(window.__1564) return; window.__1564 = 1;
  var E = function(x){ return typeof esc === 'function' ? esc(x) : String(x == null ? '' : x).replace(/[&<>"']/g, function(c){ return '&#' + c.charCodeAt(0) + ';'; }); };
  var isUrl = function(x){ return /^\s*(https?:\/\/|www\.|m\.me\/)/i.test(String(x || '')); };
  window.enqTx1564 = function(x){ var v = String(x || '').trim(); if(!isUrl(v)) return v;
    var u = v.replace(/^\s*/, ''), h = (u.replace(/^https?:\/\//i, '').split(/[/?#]/)[0] || '').replace(/^www\./i, '').toLowerCase(), tail = (u.split('?')[0].match(/[A-Za-z0-9._-]+\/?$/) || [''])[0].replace(/\/$/, '');
    var site = /messenger\.com|m\.me$|^m\.me/.test(h) ? 'Messenger' : /facebook\.com|fb\.com/.test(h) ? 'Facebook' : /wa\.me|whatsapp/.test(h) ? 'WhatsApp' : /viber/.test(h) ? 'Viber' : h;
    return site + (tail ? ' · …' + tail.slice(-6) : ''); };
  window.enqNm1564 = function(x){ var v = String(x || '').trim(); if(!isUrl(v)) return E(v); var href = /^https?:\/\//i.test(v) ? v : 'https://' + v;
    return '<a class="lk" href="' + E(href) + '" target="_blank" rel="noopener noreferrer" title="' + E(v) + '" onclick="event.stopPropagation()">' + E(enqTx1564(v)) + '</a>'; };
  var CUR = '';
  var _f = window.enqF; if(typeof _f === 'function') window.enqF = function(f){ CUR = f; return _f.apply(this, arguments); };
  var isPh = function(e){ return !!e && /^PH\s/i.test(String(e.prog || '')); };
  var get = function(id){ var L = (window.__enq1530 && __enq1530()) || []; return L.find(function(x){ return x && String(x.id) === String(id); }); };
  var _p = window.enqPic; if(typeof _p === 'function') window.enqPic = function(id, k){ var e = get(id);
    if(k === 'i' && isPh(e) && typeof window.phInv === 'function'){ var o = window.enqInv; window.enqInv = function(){ return phInv(); }; try{ return _p.apply(this, arguments); } finally{ window.enqInv = o; } }   /* same "sent" log, English text */
    return _p.apply(this, arguments); };
  var PHF = 'TRIAL CLASS INQUIRY\n\nMay we know these details?\n\nFull name:\n\nOccupation / Industry:\n\nMain goal for learning English:\n(work · business · travel · daily conversation · IELTS)\n\nEnglish tests taken, if any (leave blank if none):\ne.g. IELTS · score & date\n\nEnglish learning experience:\n\nPreferred class days & times:';
  window.enqFormPh1564 = function(){ (navigator.clipboard ? navigator.clipboard.writeText(PHF) : Promise.reject()).then(function(){ toast('Form copied · paste it in Messenger or Viber'); }, function(){ toast('Could not copy · select the text and copy it'); }); };
  var _fo = window.enqForm; if(typeof _fo === 'function') window.enqForm = function(id, kind){ var e = get(id); if(!isPh(e)) return _fo.apply(this, arguments);
    openSheet('<h1>Inquiry form · ' + E(enqTx1564(e.name)) + '</h1><div class="mute small">English · Philippine enquiry</div><div class="mini small" style="white-space:pre-line;margin-top:8px">' + E(PHF) + '</div><button class="btn teal block" style="margin-top:10px" onclick="enqFormPh1564()">Copy form</button><div class="small" style="margin-top:14px"><b>Their answers</b> <span class="mute">· paste the reply here so the trial teacher can see it</span></div><textarea id="eqDt" style="width:100%;min-height:140px;margin-top:6px;padding:10px 12px;border:1px solid #DDE6E8;border-radius:12px;font:inherit">' + E(e.details || '') + '</textarea><button class="btn block" style="margin-top:10px" onclick="enqDetSave(\'' + E(id) + '\')">Save answers</button>'); };
  function decorate(){ var el = document.getElementById('v-enquiry'); if(!el) return;
    el.querySelectorAll('.fn31 .st[onclick]').forEach(function(t){ var k = (String(t.getAttribute('onclick')).match(/enqF\('(\w+)'\)/) || [])[1]; if(!k) return; t.dataset.enqCard = k;
      var b = t.querySelector('b'); t.dataset.n = b ? String(+b.textContent || 0) : '0'; t.classList.toggle('on', CUR === k); t.setAttribute('role', 'button'); t.tabIndex = 0; });
    var L = (window.__enq1530 && __enq1530()) || [];
    el.querySelectorAll('#enqBox button[onclick^="enqPic(\'"]').forEach(function(b){ var m = String(b.getAttribute('onclick')).match(/^enqPic\('([^']+)','c'\)/); if(!m) return; var e = L.find(function(x){ return x && String(x.id) === m[1]; }); if(isPh(e)) b.style.display = 'none'; }); }
  var _r = window.renderEnq; if(typeof _r === 'function') window.renderEnq = function(){ var r = _r.apply(this, arguments); try{ decorate(); }catch(x){ console.warn('en64', x); } return r; };
  var _l = window.enqLoad; if(typeof _l === 'function') window.enqLoad = function(){ var p = _l.apply(this, arguments); Promise.resolve(p).then(function(){ setTimeout(function(){ try{ decorate(); }catch(x){} }, 0); }); return p; };
  try{ if(typeof VIEW !== 'undefined' && VIEW === 'enquiry') renderEnq(); }catch(x){}
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
console.log('1564 Enquiries fixes');
