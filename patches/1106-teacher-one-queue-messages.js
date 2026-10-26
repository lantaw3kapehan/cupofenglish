// 1106: (Misty, 26 Oct · stages D + E) teacher Today · one "Needs your action" list, and management messages with their real state.
// E · ONE list, each item once, most urgent first: everything that was spread over "Management is waiting", the To do list,
//     the late time-in notice, signatures (addendum / contract), video checks and messages. Order: overdue / penalties →
//     messages that need an acknowledgement → management is waiting → deadlines (soonest first) → updates to read.
//     Every row keeps its own action (the same button / screen as before: Check your pay, Write the report, Explain,
//     Read message…). An item leaves the list only when the app's own data says it is done (pay checked, report sent,
//     message acknowledged…) — the list is rebuilt from that data, nothing is ticked off by this screen.
// D · Messages from management on Today show their state, kept apart (an acknowledgement counts once the server confirmed it):
//       "Unread · needs your acknowledgement" → "Read · not acknowledged yet" (stays until acknowledged) → gone when acknowledged;
//       ordinary replies / announcements: "New · unread" until read (then only in Messages, with the full conversation).
//     "Read message" opens the conversation exactly as before (reading still marks it read; acknowledging is still the
//     button inside). Memos keep "please read and acknowledge". Nothing about sending, acknowledgement rules or
//     notification settings changes.
// The original boxes stay in the page (hidden) so every button they had still works.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
const css = `
#v-today .td1104.q1106-on>:is(#mustBox,#txLate,.ct-ban,#vcBox){display:none!important}
#v-today .q1106-hid{display:none!important}
#v-today .q1106{background:#fff;border:1px solid #E7E5EE;border-radius:14px;overflow:hidden}
#v-today .q1106 .qr{display:flex;align-items:center;gap:12px;padding:12px 14px;border-top:1px solid #F0EEF5;cursor:pointer}
#v-today .q1106 .qr:first-child{border-top:0}
#v-today .q1106 .qr:hover{background:#FAFAFD}
#v-today .q1106 .qr:focus-visible{outline:3px solid rgba(0,112,122,.55);outline-offset:-3px}
#v-today .q1106 .qr .qm{flex:1;min-width:0}
#v-today .q1106 .qr .qt{font-weight:600;color:#2B2450;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#v-today .q1106 .qr .qs{font-size:.875rem;color:#5E5A76;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#v-today .q1106 .qr .qk{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-bottom:3px}
#v-today .q1106 .qr .qd{font-size:.8125rem;font-weight:600;color:#5E5A76}
#v-today .q1106 .qr .qd.soon{color:#7A4A00}
#v-today .q1106 .qr .qd.late{color:#B42318}
#v-today .q1106 .qr .st{font-size:.75rem;font-weight:600;border-radius:999px;padding:2px 8px;background:#F0EEF5;color:#3A3556}
#v-today .q1106 .qr .st.un{background:#E8F1FB;color:#1D5FA8}
#v-today .q1106 .qr .st.ak{background:#FFF4DE;color:#7A4A00}
#v-today .q1106 .qr .btn{flex:none;white-space:nowrap}
#v-today .q1106 .q-more{display:block;width:100%;text-align:center;padding:10px;border:0;border-top:1px solid #F0EEF5;background:#FAFAFD;color:#00616A;font-weight:600;cursor:pointer}
#v-today .td1104>h2 .qn{font-size:.875rem;font-weight:600;color:#5E5A76;margin-left:6px}
@media(max-width:640px){#v-today .q1106 .qr{flex-wrap:wrap}#v-today .q1106 .qr .btn{width:100%}#v-today .q1106 .qr .qt,#v-today .q1106 .qr .qs{white-space:normal}}
`;
const js = String.raw`
(function(){
  if(window.__1106) return; window.__1106 = 1;
  var E = function(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var MON = { jan:0,feb:1,mar:2,apr:3,may:4,jun:5,jul:6,aug:7,sep:8,oct:9,nov:10,dec:11 };
  function dueOf(t){ t = String(t || ''); var m;
    if(/overdue|waited|not answered since|not fixed/i.test(t)){ m = t.match(/(\d+)\s*days?/i); return { d: -(m ? +m[1] : 1), txt: 'Overdue' }; }
    if(/\btoday\b|by 23:59/i.test(t)) return { d: 0, txt: 'Today' };
    if((m = t.match(/within\s+(\d+)\s*(hours?|days?)/i))){ var dd = /hour/i.test(m[2]) ? 0 : +m[1]; return { d: dd, txt: dd ? 'Within ' + m[1] + ' day' + (+m[1] === 1 ? '' : 's') : 'Within ' + m[1] + ' h' }; }
    if((m = t.match(/(\d+)\s*days?\s*left/i))) return { d: +m[1], txt: m[1] + ' day' + (+m[1] === 1 ? '' : 's') + ' left' };
    if((m = t.match(/(?:due|by|respond by)\s+([A-Z][a-z]{2})[a-z]*\s+(\d{1,2})/))){ var mo = MON[m[1].toLowerCase()]; if(mo != null){ var now = new Date(), y = now.getFullYear(), dt = new Date(y, mo, +m[2]); if(dt - now < -180 * 864e5) dt = new Date(y + 1, mo, +m[2]); var days = Math.ceil((dt - now) / 864e5); return { d: days, txt: 'Due ' + m[1] + ' ' + m[2] }; } }
    return { d: 99, txt: '' }; }
  var CONF = {};   /* acknowledgements the server confirmed (the app keeps "now" until the next refresh) */
  var _ak = window.tMsgAck; if(typeof _ak === 'function') window.tMsgAck = async function(id){ var p = _ak.apply(this, arguments); try{ return await p; } finally{ try{ var t = TMSG.threads.find(function(x){ return x.root.id === id; }); if(t && t.root.ack === 'now') CONF[id] = 1; else delete CONF[id]; }catch(e){} setTimeout(function(){ build(true); }, 50); } };
  var isTask = function(r){ return !!r && r.role === 'mgmt' && r.kind !== 'memo' && /^📌\s*Task/.test(String(r.text || '')); };
  var ACT = [];
  window.q1106Go = function(k){ var a = ACT[k]; if(a) try{ a(); }catch(e){ console.warn(e); } };
  var EXP = false; window.q1106More = function(){ EXP = true; build(true); };
  function items(v, td){
    var out = [], seen = {};
    var add = function(x){ var key = (x.kind + '|' + x.title).toLowerCase().replace(/\s+/g, ' '); if(seen[key]) return; seen[key] = 1; out.push(x); };
    /* messages from management, with their state */
    var T = (typeof TMSG !== 'undefined' && TMSG && TMSG.threads) || [];
    T.forEach(function(t){ var r = t.root; if(!r || isTask(r)) return; var all = [r].concat(t.replies || []), mg = all.filter(function(x){ return x.role === 'mgmt'; }), unseen = mg.filter(function(x){ return !x.seen; });
      var need = r.role === 'mgmt' && r.need && !(r.ack && (r.ack !== 'now' || CONF[r.id])), memo = r.kind === 'memo', last = mg[mg.length - 1] || r;
      if(need){ add({ sev: 1.5, kind: memo ? 'Memorandum' : 'Message', red: true, title: memo ? (r.subject || 'Memorandum') : (r.subject || 'From ' + r.from), sub: memo ? (r.memoNo ? r.memoNo + ' · ' : '') + 'please read and acknowledge' : (last.text || ''),
          state: r.ack === 'now' ? ['ak', 'Acknowledging…'] : unseen.length ? ['un', 'Unread · needs your acknowledgement'] : ['ak', 'Read · not acknowledged yet'], verb: 'Read message', due: { d: -1, txt: '' }, act: function(){ tMsgOpen(r.id); } }); }
      else if(unseen.length){ add({ sev: 3.5, kind: 'Message', title: r.subject ? r.subject : 'From ' + last.from, sub: last.text || '', state: ['un', 'New · unread'], verb: 'Read message', due: { d: 50, txt: '' }, act: function(){ tMsgOpen(r.id); } }); } });
    /* late time-in notice */
    var tl = td.querySelector(':scope>#txLate'); if(tl && tl.textContent.trim()){ var lk = tl.querySelector('a,button'); add({ sev: 1, kind: 'Time-in', red: true, title: tl.querySelector('b') ? tl.querySelector('b').textContent.trim() : 'Late time-in', sub: tl.textContent.replace(/\s+/g, ' ').replace(/^[^·]*·\s*/, '').replace(/Details$/, '').trim(), verb: 'Details', due: dueOf(tl.textContent), act: function(){ (lk || tl).click(); } }); }
    /* signatures / contract banners */
    [].forEach.call(td.querySelectorAll(':scope>.ct-ban'), function(b){ var h = b.querySelector('b, h3, strong'), sm = b.querySelector('.small, small, span:last-child'); add({ sev: 2, kind: /sign/i.test(b.textContent) ? 'Signature' : 'Contract', title: h ? h.textContent.trim() : b.textContent.trim().slice(0, 80), sub: sm ? sm.textContent.trim() : '', verb: /sign/i.test(b.textContent) ? 'Read and sign' : 'Open', due: dueOf(b.textContent), act: function(){ b.click(); } }); });
    /* management is waiting (same items, same buttons) */
    (window._MUST || []).forEach(function(x, k){ if(/^(Message|Memorandum)/i.test(x.label)) return; add({ sev: x.red ? 1 : 2, kind: x.label, red: x.red, title: x.title, sub: x.sub, verb: x.verb, due: dueOf(x.title + ' ' + x.sub), act: function(){ window.mustGo(k); } }); });
    /* the rest of the To do list (once) */
    var h2 = [].slice.call(v.querySelectorAll('h2')).find(function(x){ return /^To do/.test(x.textContent.trim()); }), card = h2 && h2.nextElementSibling;
    if(card) [].forEach.call(card.querySelectorAll(':scope>.li'), function(li){ if(li.dataset.must != null || li.style.display === 'none') return; var ch = li.querySelector('.chip'), lab = ch ? ch.textContent.replace(/^[✓◷!]\s*/, '').trim() : 'To do';
      if(/^(Message|Memorandum)/i.test(lab)) return; var g = li.querySelector('.grow'), lines = g ? g.innerText.split('\n').map(function(z){ return z.trim(); }).filter(Boolean) : []; lines = lines.filter(function(z){ return z !== lab && z.replace(/^[✓◷!]\s*/, '') !== lab; });
      var red = ch && ch.matches('.red,.coral'); add({ sev: red ? 2.5 : 3, kind: lab, red: red, title: lines[0] || lab, sub: lines.slice(1).join(' · '), verb: 'Open', due: dueOf(li.textContent), act: function(){ li.click(); } }); });
    /* video checks */
    var vc = td.querySelector(':scope>#vcBox'); if(vc){ var rows = [].slice.call(vc.querySelectorAll('button')).filter(function(b){ return /explain/i.test(b.textContent); });
      rows.forEach(function(b){ var box = b.closest('div') || vc, hd = box.querySelector('b'); add({ sev: 2, kind: 'Video check', red: false, title: (hd ? hd.textContent.trim() : 'Video check'), sub: (box.textContent.match(/⚠[^\n]*/) || [''])[0].replace('⚠', '').trim().slice(0, 120) || 'Explain this video', verb: 'Explain', due: dueOf(vc.textContent), act: function(){ b.click(); } }); }); }
    out.sort(function(a, b){ return a.sev - b.sev || a.due.d - b.due.d; }); return out; }
  var SIG = '';
  function build(force){ try{
    if(typeof D === 'undefined' || !D || D.mgr) return; var v = document.getElementById('v-today'); if(!v) return; var td = v.querySelector(':scope>.td1104'); if(!td) return;
    var L = items(v, td), sig = L.map(function(x){ return x.kind + x.title + (x.state ? x.state[1] : '') + x.due.txt; }).join('|') + EXP;
    var box = td.querySelector(':scope>.q1106'); if(!force && box && sig === SIG) return; SIG = sig;
    ACT = L.map(function(x){ return x.act; });
    var MAX = 6, shown = EXP ? L : L.slice(0, MAX);
    var row = function(x, k){ var ck = x.sev <= 1.5 ? 'red' : x.sev < 3 ? 'amber' : 'teal', dc = x.due.d < 0 ? 'late' : x.due.d <= 2 ? 'soon' : '';
      return '<div class="qr" tabindex="0" role="button" onclick="q1106Go(' + k + ')" onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault();q1106Go(' + k + ')}">'
        + '<div class="qm"><div class="qk"><span class="chip ' + ck + '">' + E(x.kind) + '</span>' + (x.state ? '<span class="st ' + x.state[0] + '">' + E(x.state[1]) + '</span>' : '') + (x.due.txt ? '<span class="qd ' + dc + '">' + E(x.due.txt) + '</span>' : '') + '</div>'
        + '<div class="qt">' + E(x.title) + '</div>' + (x.sub ? '<div class="qs">' + E(x.sub) + '</div>' : '') + '</div>'
        + '<button type="button" class="btn sm ' + (k === 0 ? 'teal' : 'ghost') + '" onclick="event.stopPropagation();q1106Go(' + k + ')">' + E(x.verb || 'Open') + '</button></div>'; };
    var html = L.length ? shown.map(row).join('') + (L.length > shown.length ? '<button type="button" class="q-more" onclick="q1106More()">Show all ' + L.length + '</button>' : '') : '';
    if(!box){ box = document.createElement('div'); box.className = 'q1106'; var h = td.querySelector(':scope>h2'); if(h) h.after(box); else td.prepend(box); }
    box.innerHTML = html; box.style.display = L.length ? '' : 'none';
    var h2 = td.querySelector(':scope>h2'); if(h2) h2.innerHTML = 'Needs your action' + (L.length ? '<span class="qn">' + L.length + '</span>' : '');
    td.classList.add('q1106-on');
    /* the separate To do list is now part of this one list */
    var th = [].slice.call(v.querySelectorAll('h2')).find(function(x){ return /^To do/.test(x.textContent.trim()) && !td.contains(x); }); if(th){ th.classList.add('q1106-hid'); if(th.nextElementSibling && th.nextElementSibling.classList.contains('tdc')) th.nextElementSibling.classList.add('q1106-hid'); }
    td.style.display = (L.length || td.querySelector(':scope>#vidMine')) ? '' : 'none';
  }catch(e){ console.warn('1106', e); } }
  var t = 0, later = function(){ clearTimeout(t); t = setTimeout(function(){ build(false); }, 80); };
  ['renderToday', 'render', 'go', 'tMsgOpen', 'closeSheet'].forEach(function(nm){ var f = window[nm]; if(typeof f !== 'function') return; window[nm] = function(){ var r = f.apply(this, arguments); later(); if(r && typeof r.then === 'function') r.then(later, later); return r; }; });
  var v = document.getElementById('v-today'); if(v) new MutationObserver(later).observe(v, { childList: true });
  setInterval(function(){ if(typeof VIEW !== 'undefined' && VIEW === 'today') build(false); }, 4000);   /* cheap: rebuilds only when an item changed */
})();
`;
s = s.slice(0, i) + '<style id="d1106">/* 1106 · one Needs-your-action list + message states */' + css + '</style>\n<script>' + js + '</script>\n' + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
