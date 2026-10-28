// 1535 · Philippine cancellation notice = 4 hours (28 Oct 2026, Misty 23:15) + British Council strapline (Misty 23:19 / coordinator).
// The hours come from docs sys:pricing_ph.cancel_hours (4); China stays at 2 hours, byte-identical (same text, same pictures).
// 1. Enforcement (management class editor): "under N h" / "Less than N hours before class" / the save guard use the learner's market:
//    a Philippine learner (docs sys:ph_learners, set in Student access › Market) → cancel_hours; everyone else → 2 as today.
// 2. Cancellation policy box (class / move / renewal pictures) and its copied text: a Philippine learner gets an English box and text
//    with cancel_hours ("Messenger, Viber or our group chat"; Philippine time = UTC+8, the same clock as Beijing). China: unchanged.
// 3. Class notice text: the policy line uses cancel_hours for a Philippine learner (English only); China unchanged.
// 4. PH price picture "Good to know" line, PH price message and PH roadmap message: cancel_hours.
// 5. PH price pictures (Adult English and IELTS) footer: "CupOfEnglish assists eligible candidates with IELTS registration through its partnership with the British Council Philippines."
//    (docs sys:pricing_ph.bc_line; exact text, one plain centred footer line, 22 px shrinking to fit one line (min 16 px) on the 1160 px card, no prefix, no logos). China pictures unchanged.
// Apps Script / stored classes: not changed (see server/CHANGES-2026-10-28-ph-pricing.md).
const fs = require('fs'), file = process.argv[2], R = String.raw;
require('../tools/lib.js')(file, [
  [", late2 = !e.cancelled && st - nw0 < 2 * 36e5; window._ceLate = late2;",
   ", CXH = window.cxHoursFor ? cxHoursFor([e.code, e.title, e.student, src === 'stu' && typeof STU !== 'undefined' && STU ? STU.code : ''].join(' ')) : 2, late2 = !e.cancelled && st - nw0 < CXH * 36e5; window._ceLate = late2; window._ceLateH = CXH;"],
  ["'Cancel · under 2 h'", "'Cancel · under ' + CXH + ' h'"],
  ["'Less than 2 hours before class.'", "'Less than ' + CXH + ' hours before class.'"],
  ["return toast('Under 2 hours: a parent cancellation counts as a completed class. Choose a teacher / CupOfEnglish reason.');",
   "return toast('Under ' + (window._ceLateH || 2) + ' hours: a parent cancellation counts as a completed class. Choose a teacher / CupOfEnglish reason.');"],
  ["{ t: 'Please tell your teacher at least 2 hours before class if you need to cancel or move a lesson.', red: 1 }",
   "{ t: 'Please tell your teacher at least ' + phCxHours() + ' hours before class if you need to cancel or move a lesson.', red: 1 }"],
  ["bc: 'CupOfEnglish helps eligible learners register for the IELTS test through its partnership with British Council Philippines.' }",
   "bc: phBcLine() }"],
  ["T.wrap(Q ? Q.bc : '",
   "if(Q){ y += 6; let fz = 22; while(fz > 15 && T.w(Q.bc, '400 ' + fz + 'px ' + T.F) > T.Wc - 80) fz--; T.wrap(Q.bc, T.Wc - 80, '400 ' + fz + 'px ' + T.F).forEach(s => { T.text(s, T.Wc / 2, y + 4, '400 ' + fz + 'px ' + T.F, T.MUTE, 'center'); y += fz + 10; }); } else T.wrap('"],
  ["your teacher will check your current level and suggest the right track.' + ex",
   "your teacher will check your current level and suggest the right track.' + '\\n\\nNeed to cancel or move a lesson? Please tell your teacher at least ' + phCxHours() + ' hours before class.' + ex"],
  [R`' Please see the picture for the skills you will work on. You are welcome to book a trial class.\n\nCupOfEnglish'`,
   R`' Please see the picture for the skills you will work on. You are welcome to book a trial class. If you need to cancel or move a lesson, please tell your teacher at least ' + phCxHours() + ' hours before class.\n\nCupOfEnglish'`]
]);
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + R`<script>
/* 1535 · Philippine learners: cancellation notice from docs sys:pricing_ph.cancel_hours (4); China stays 2 hours */
(function(){
  if(window.__1535) return; window.__1535 = 1;
  var KEY = 'coe.ph_learners', PHL = {}, at = 0, busy = 0;
  try{ PHL = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; }catch(e){ PHL = {}; }
  var D = function(){ return window.phPricing1530 ? phPricing1530() : null; };
  window.phCxHours = function(){ var d = D(), h = d && +d.cancel_hours; return h > 0 && h <= 48 ? h : 4; };
  window.phBcLine = function(){ var d = D(); return (d && String(d.bc_line || '').trim()) || 'CupOfEnglish assists eligible candidates with IELTS registration through its partnership with the British Council Philippines.'; };
  function load(force){ if(busy || typeof TOKEN === 'undefined' || !TOKEN || typeof FAST_URL === 'undefined') return; if(!force && Date.now() - at < 5 * 6e4) return; busy = 1;
    fetch(FAST_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'docs', token: TOKEN, keys: ['sys:ph_learners'] }) }).then(function(r){ return r.json(); })
      .then(function(j){ if(!(j && j.ok && j.docs)) return; var d = j.docs['sys:ph_learners']; PHL = (d && d.data && d.data.codes) || {}; at = Date.now(); try{ localStorage.setItem(KEY, JSON.stringify(PHL)); }catch(x){} })
      .catch(function(){}).finally(function(){ busy = 0; }); }
  window.phLearners1535 = function(force){ load(force); return PHL; };
  var codes = function(t){ return (String(t || '').toUpperCase().match(/ST[\s_-]*\d{4}[\s_-]*\d{3}/g) || []).map(function(x){ var m = x.replace(/[^0-9]/g, ''); return 'ST-' + m.slice(0, 4) + '-' + m.slice(4); }); };
  window.isPhLearner = function(t){ load(); return codes(t).some(function(k){ return !!PHL[k]; }); };
  window.cxHoursFor = function(t){ return window.isPhLearner(t) ? phCxHours() : 2; };
  setTimeout(function(){ load(true); }, 4000);
  /* a Market change in Student access refreshes the list */
  var _ps = window.psPhSave; if(_ps) window.psPhSave = function(){ var r = _ps.apply(this, arguments); setTimeout(function(){ load(true); }, 2500); return r; };

  var phOf = function(P, e){ var x = (e && e.code) || (P && P.e && P.e.code) || ''; return x && window.isPhLearner(x); };
  var _info = window.cxPolInfo;
  if(_info) window.cxPolInfo = function(P, e){ if(!phOf(P, e)) return _info.apply(this, arguments);
    var H = phCxHours(), bl = P.kind === 'bal', src = bl ? ((P.renew && P.renew.en) || '') : ((P.pkg && P.pkg.en) || ''), T = [], re = /(\d{1,2}):(\d{2})/g, m;
    while((m = re.exec(src))){ var pre = src.slice(Math.max(0, m.index - 2), m.index); if(/[-–~至]\s*$/.test(pre)) continue; var t = ('0' + m[1]).slice(-2) + ':' + m[2]; if(T.indexOf(t) < 0) T.push(t); }
    if(!T.length && !bl && e && e.start) T.push(tm(e.start));
    if(T.length !== 1) return { one: false };
    var hm = T[0].split(':').map(Number); if(hm[0] < H) return { one: false };
    return { one: true, start: T[0], cut: ('0' + (hm[0] - H)).slice(-2) + ':' + ('0' + hm[1]).slice(-2) }; };
  var _txt = window.cxPolText;
  if(_txt) window.cxPolText = function(P){ if(!phOf(P)) return _txt.apply(this, arguments);
    try{ var pol = (P.kind === 'bal' && P.renew) || ((P.kind === 'class' || P.kind === 'move') && !cxTrial(P.e)); if(!pol) return '';
      var H = phCxHours(), I = cxPolInfo(P, P.e);
      return '\n\nCancellation policy\nPlease tell us at least ' + H + ' hours before class.' + (I.one ? '\nFor your ' + I.start + ' class (Philippine time): by ' + I.cut + '.' : '')
        + '\nCancelling less than ' + H + ' hours before class uses the lesson.\nJust send us a message on Messenger, Viber or our group chat.'; }catch(x){ return ''; } };
  var _pol = window.cxPol;
  if(_pol) window.cxPol = function(c, rr, F, W, y, P, e){ if(!phOf(P, e)) return _pol.apply(this, arguments);
    var H = phCxHours(), I = cxPolInfo(P, e), x = 80, w = W - 160, p = 30, ix = x + p, iw = w - 2 * p, h = POL_H - 32;
    var ico = function(d, cx, cy, s, col, lw){ c.save(); c.translate(cx - 12 * s, cy - 12 * s); c.scale(s, s); c.strokeStyle = col; c.lineWidth = lw; c.lineCap = 'round'; c.lineJoin = 'round'; d.forEach(function(q){ c.stroke(new Path2D(q)); }); c.restore(); };
    c.save(); rr(x, y, w, h, 26); c.fillStyle = '#fff'; c.fill(); c.lineWidth = 2; c.strokeStyle = '#D7ECEA'; c.stroke(); c.restore();
    var yy = y + p;
    c.beginPath(); c.arc(ix + 24, yy + 24, 24, 0, Math.PI * 2); c.fillStyle = '#E3F6F6'; c.fill();
    ico(['M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6', 'M9 17v1a3 3 0 0 0 6 0v-1'], ix + 24, yy + 24, 1.15, '#00737B', 2);
    c.textAlign = 'left'; c.fillStyle = '#2B2253'; c.font = '700 24px ' + F; c.fillText('Cancellation policy', ix + 64, yy + 20);
    c.fillStyle = '#6F6B85'; c.font = '400 18px ' + F; c.fillText('Good to know', ix + 64, yy + 44);
    yy += 96;
    c.font = '700 32px ' + F; var hx = ix; [['Please tell us at least ', '#2B2253'], [H + ' hours', '#00737B'], [' before class', '#2B2253']].forEach(function(q){ c.fillStyle = q[1]; c.fillText(q[0], hx, yy); hx += c.measureText(q[0]).width; });
    yy += 36; c.fillStyle = '#4C4868'; c.font = '400 22px ' + F; c.fillText('to cancel or move a lesson', ix, yy);
    yy += 34;
    var bw = iw, bt = Math.round(bw * 3 / (H + 2.25));
    c.save(); rr(ix, yy, bw, 16, 8); c.clip(); c.fillStyle = '#86CFC6'; c.fillRect(ix, yy, bt, 16); c.fillStyle = '#F4B08A'; c.fillRect(ix + bt, yy, bw - bt, 16); c.restore();
    yy += 46;
    c.fillStyle = '#00737B'; c.font = '700 22px ' + F; c.fillText(I.one ? 'Before ' + I.cut : H + '+ hours before', ix, yy);
    c.fillStyle = '#6F6B85'; c.font = '400 18px ' + F; c.fillText('free to cancel or move', ix, yy + 26);
    c.textAlign = 'right'; c.fillStyle = '#B5592C'; c.font = '700 22px ' + F; c.fillText(I.one ? I.cut + '–' + I.start : 'Less than ' + H + ' hours', ix + iw, yy);
    c.fillStyle = '#6F6B85'; c.font = '400 18px ' + F; c.fillText('lesson used', ix + iw, yy + 26); c.textAlign = 'left';
    yy += 46;
    c.save(); c.strokeStyle = '#E3E9EA'; c.lineWidth = 2; c.setLineDash([6, 6]); c.beginPath(); c.moveTo(ix, yy); c.lineTo(ix + iw, yy); c.stroke(); c.restore();
    yy += 30; c.fillStyle = '#6F6B85'; c.font = '400 18px ' + F; c.fillText('Class day · Philippine time', ix, yy);
    c.textAlign = 'right'; c.fillText((I.one ? I.start + ' · ' : '') + 'class starts', ix + iw, yy); c.textAlign = 'left';
    yy += 24;
    rr(ix, yy, iw, 78, 18); c.fillStyle = '#F3F9F9'; c.fill();
    ico(['M3 20l1.3 -3.9c-2.324 -3.437 -1.426 -7.872 2.1 -10.374c3.526 -2.501 8.59 -2.296 11.845 .48c3.255 2.777 3.695 7.266 1.029 10.501c-2.666 3.235 -7.615 4.215 -11.574 2.293l-4.7 1'], ix + 38, yy + 39, 1.2, '#00737B', 1.8);
    c.fillStyle = '#2B2253'; c.font = '400 24px ' + F; c.fillText('Just send us a message', ix + 72, yy + 34);
    c.fillStyle = '#6F6B85'; c.font = '400 18px ' + F; c.fillText('on Messenger, Viber or our group chat', ix + 72, yy + 60);
    return y + POL_H; };
  var _cn = window.cnText;
  if(typeof _cn === 'function') window.cnText = function(){ var t = _cn.apply(this, arguments); try{ if(typeof CN === 'undefined' || !CN || !window.isPhLearner(CN.code)) return t;
      return t.replace(/\n\n(\S*\s*)Please tell us 2 hours before class if (your child|you) can’t attend; a late cancellation counts as a class\.\n[^\n]*/, function(_, a, who){ return '\n\n' + a + 'Please tell us at least ' + phCxHours() + ' hours before class if ' + who + ' can’t attend; a late cancellation counts as a class.'; }); }catch(x){ return t; } };
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
console.log('1535 PH cancellation hours (sys:pricing_ph.cancel_hours) · British Council strapline');
