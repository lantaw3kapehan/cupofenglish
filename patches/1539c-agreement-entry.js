// 1539c · One "Service agreement" entry point with the market first (29 Oct 2026, Misty 02:58 / 03:00).
// Enquiries › Service agreement (the dialog for a parent / learner who asks before enrolling) starts with China · bilingual /
// Philippines · English (default: the Enquiries Market, the last choice remembered on this device). China = exactly today's fields and
// output (Child's English name, Chinese name, the same agreement). Philippines = "Learner's name", programme (from sys:pricing_ph, so new
// PH programmes appear by themselves) and an optional track (its lesson box ticked) → the English-only agreement (1538), one "Make agreement"
// button. Enquiries › Philippines › 2 Enrolling gets a "Service agreement (English)" card that opens the same dialog on Philippines.
// PH pictures: the top-right chip in Inter bold (was the frame's slab serif), "Price List" / "Learning Roadmap"; China chip unchanged.
// The student page / trial "Enrolling" › Service agreement paths are unchanged (English chosen automatically for PH learners).
const fs = require('fs'), file = process.argv[2], R = String.raw;
require('../tools/lib.js')(file, [
  ["const pf = '700 22px ' + F, pw = T.w(pill, pf) + 44;", "const pf = '700 22px ' + (opt && opt.font ? opt.font : F), pw = T.w(pill, pf) + 44;"],   // PH pictures: the chip in Inter (China: unchanged)
  ["return coeCard('Price list', function(T, y){", "return coeCard('Price List', function(T, y){"],
  ["return coeCard('Learning roadmap', function(T, y){", "return coeCard('Learning Roadmap', function(T, y){"],
  ["var id = (m && m.prog) || enqProg(a) || 'adult'", "var id = (a && a.prog) || (m && m.prog) || enqProg(a) || 'adult'"],
  ["window.agrPh1538 = function(a){ if(!a) return false; if(a.mk) return a.mk === 'ph';",
   "window.agrPh1538 = function(a){ if(!a) return false; var q = window.__agrQ39; if(!a.mk && q && q.mk && q.key === a.key){ a.mk = q.mk; if(q.prog) a.prog = q.prog; } if(a.mk) return a.mk === 'ph';"]
]);
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + R`<script>
/* 1539c · Service agreement: one dialog, market first */
(function(){
  if(window.__1539c) return; window.__1539c = 1;
  var MK = 'coe.enqAgrMk', get = function(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }, put = function(k, v){ try{ localStorage.setItem(k, v); }catch(e){} };
  var _o = window.agrOpen; if(typeof _o === 'function') window.agrOpen = function(q){ window.__agrQ39 = q && q.mk ? q : null; return _o.apply(this, arguments); };
  var _cn = window.enqAgrAny;   // China: today's dialog, unchanged
  var ST = { m: 'cn', prog: '', track: '' };
  function progs(){ var d = window.phPricing1530 ? phPricing1530() : null; return (d && d.programs) || []; }
  function paint(){ var sb = document.getElementById('sheetBody'); if(!sb) return; var nm = (document.getElementById('eaN') || {}).value || '', cn = (document.getElementById('eaC') || {}).value || '';
    var seg = '<div class="seg pp37-w" role="group" aria-label="Agreement" style="margin:10px 0 2px!important"><button type="button" class="' + (ST.m === 'cn' ? 'on' : '') + '" onclick="agr39Mk(\'cn\')">China · bilingual</button><button type="button" class="' + (ST.m === 'ph' ? 'on' : '') + '" onclick="agr39Mk(\'ph\')">Philippines · English</button></div>';
    if(ST.m === 'cn'){ _cn(); sb = document.getElementById('sheetBody'); var h1 = sb && sb.querySelector('h1'); if(h1) h1.insertAdjacentHTML('afterend', seg); var i0 = document.getElementById('eaN'); if(i0 && nm) i0.value = nm; var c0 = document.getElementById('eaC'); if(c0 && cn) c0.value = cn; return; }
    var P = progs(); if(!ST.prog && P.length) ST.prog = P[0].id; var cur = P.find(function(p){ return p.id === ST.prog; }) || null;
    var chips = function(id, L, v){ return '<div class="seg pp37-w" id="' + id + '" style="margin:6px 0 2px!important">' + L.map(function(o){ return '<button type="button" class="' + (v === o[0] ? 'on' : '') + '" onclick="agr39Set(\'' + id + '\',\'' + o[0] + '\')">' + esc(o[1]) + '</button>'; }).join('') + '</div>'; };
    openSheet('<h1>Service agreement</h1>' + seg + '<div class="mute small">English only · for a learner (or parent) who asks before enrolling</div>'
      + '<label>Learner\'s name</label><input id="eaN" class="in-t" placeholder="e.g. Maria Santos" value="' + esc(nm) + '">'
      + '<label>Programme</label>' + (P.length ? chips('ea39P', P.map(function(p){ return [p.id, p.short]; }), ST.prog) : '<div class="small mute">Price list still loading…</div>')
      + '<label>Track <span class="mute small">(optional · its lesson box is ticked)</span></label>' + chips('ea39T', ((cur && cur.tracks) || []).map(function(t){ return [t.id, t.name + ' · ' + t.lessons]; }).concat([['', 'Not set']]), ST.track)
      + '<button class="btn teal block" style="margin-top:14px" onclick="agr39Go()">Make agreement</button>');
    setTimeout(function(){ var x = document.getElementById('eaN'); if(x && !x.value) x.focus(); }, 50); }
  window.agr39Mk = function(m){ ST.m = m === 'ph' ? 'ph' : 'cn'; put(MK, ST.m); paint(); };
  window.agr39Set = function(id, v){ if(id === 'ea39P'){ ST.prog = v; ST.track = ''; } else ST.track = v; paint(); };
  window.agr39Go = function(){ var n = ((document.getElementById('eaN') || {}).value || '').trim(); if(!n) return toast('Type the learner\'s name');
    var P = progs().find(function(p){ return p.id === ST.prog; }), T = P && (P.tracks || []).find(function(t){ return t.id === ST.track; });
    agrOpen({ key: 'enq:any:' + n.toLowerCase(), name: n, cn: '', pkg: T ? T.lessons : 0, mk: 'ph', prog: ST.prog }); };
  if(typeof _cn === 'function') window.enqAgrAny = function(m){ ST = { m: m === 'ph' || m === 'cn' ? m : (get(MK) || get('coe.enqMarket') || 'cn') === 'ph' ? 'ph' : 'cn', prog: '', track: '' }; if(m) put(MK, ST.m); paint(); };
  /* Enquiries › Philippines › 2 Enrolling: the same dialog, on Philippines */
  var _k = window.phKit1532; if(_k) window.phKit1532 = function(){ var h = _k.apply(this, arguments), A = 'onclick="phPayOpen()">Open</button></div>';
    var C = '<div style="background:#fff;border:1px solid #E6EEF0;border-radius:18px;padding:16px 18px;margin-top:12px;display:flex;gap:14px;align-items:center" class="eq2-t"><div style="width:36px;height:36px;border-radius:50%;background:#E3F6F6;color:#00737B;font-weight:700;display:flex;align-items:center;justify-content:center;flex:none">6</div><div class="grow" style="min-width:0"><b>Service agreement (English)</b><div class="small mute" style="margin-top:3px">The Learner Service Agreement in English: the learner\'s name, programme and track, UnionBank payment, 4-hour notice. Copy the picture and the message.</div></div><button class="btn teal sm x1101-sec" style="flex:none" onclick="enqAgrAny(\'ph\')">Open</button></div>';
    return h.indexOf(A) > -1 ? h.replace(A, A + C) : h; };
  try{ if(typeof VIEW !== 'undefined' && VIEW === 'enquiry') renderEnq(); }catch(x){}
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
console.log('1539c Service agreement: one dialog, market first; 2 Enrolling card');
