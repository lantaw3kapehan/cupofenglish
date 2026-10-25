// 941: (audit 25 Oct, phase 2 · D4) One look for bottom-sheet / modal FORMS — proposed shared class `.ui-form` — used here ONLY for
//      Finance dialogs. Display + inline error lines only; every handler, payload, validation rule and permission is unchanged.
//
// THE CLASS (for the lead to roll out; tokens from 900):
//   Put `ui-form` on the dialog element that holds the form: #sheet (bottom sheet), a modal's inner box (.wl-m), or a form column
//   (#ivM .iv-f). Documents inside it (.paper, pictures, PDFs) are excluded by the selectors, so a payslip shown in the same sheet is
//   untouched. It styles:
//   · dialog title  h1 22px brand font, ink, room for the ✕ (h1 / h3 of the modal head)
//   · intro line    .mute/.small first lines 13px muted
//   · label         12.5px / 700, #4A4566, 12px above, 5px below
//   · input/select/textarea (.in-t or bare) 38px high, 1px #E9E7F0 line, 10px radius, 13.5px sans, tabular numerals;
//                   focus = teal line + soft teal ring; [aria-invalid=true] = muted red line
//   · .ui-hint      12px muted helper line under a field
//   · .ui-err       12.5px / 600 muted-red error line (role=alert), shown under the field or the button that failed
//   · buttons       40px, 10px radius, 14px / 700; primary (.btn without ghost, .btn.teal, .btn.go) = teal-dark #00808B with
//                   white text (4.5:1 contrast; #01b0bf with white is 2.6:1); .btn.ghost = white, 1px line, ink text
//   · tables        13.5px sans, tabular numerals, 1px row lines (payslip row, PAY tab view)
// HOW IT IS ADDED HERE: the Finance openers (saleSheet, expSheet, payRow, payslip, payslipNow, togglePaid, rfOpen, tabSheet('PAY'))
//   are wrapped; while one of them is opening, every openSheet() it makes keeps `ui-form` on #sheet; any other openSheet() and
//   closeSheet() remove it. The wallet modal (#wlM .wl-m) and the payment-confirmation form column (#ivM .iv-f) get it when they appear.
// INLINE ERRORS: + Sale / + Expense still check exactly what sendMoney() checks (expense: description, category, amount; sale:
//   invoice/student or PDF, partner); when a check fails the missing fields are marked aria-invalid and a line under the button says
//   what is missing (the toast still shows). Typing in a marked field clears its mark.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8'); const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 941 · .ui-form — shared form look, Finance dialogs only */
(function(){ if(window.__941) return; window.__941 = 1;
  var F = 'var(--ui-font,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif)', INK = 'var(--ui-ink,#2f2752)', MU = 'var(--ui-mute,#6B6782)', LN = 'var(--ui-line,#E9E7F0)';
  var X = ':not(.paper *):not(.pg *)';   /* never inside a document */
  var css = [
    '.ui-form h1' + X + ',.ui-form .wl-mh h3{font-family:var(--ui-brand,"Fredoka One",sans-serif);font-weight:400;font-size:22px;color:' + INK + ';margin:0 44px 4px 0;line-height:1.25}',
    '.ui-form .wl-mh h3{font-size:19px;margin:0}',
    '.ui-form label' + X + '{display:block;font:700 12.5px/1.35 ' + F + ';letter-spacing:0;color:#4A4566;margin:12px 0 5px}',
    '.ui-form label.drop' + X + ',.ui-form label:has(> input[type=checkbox])' + X + '{font-weight:400;font-size:13px}',
    '.ui-form .in-t' + X + ',.ui-form input' + X + ':not([type=checkbox]):not([type=radio]):not([type=file]):not([type=range]),.ui-form select' + X + '{height:38px;min-height:0;box-sizing:border-box;border:1px solid ' + LN + ';border-radius:10px;padding-top:0;padding-bottom:0;font:13.5px ' + F + ';font-variant-numeric:tabular-nums;color:' + INK + ';background-color:#fff;box-shadow:none}',
    '.ui-form textarea' + X + '{min-height:76px;height:auto;padding:8px 12px;border:1px solid ' + LN + ';border-radius:10px;font:13.5px/1.45 ' + F + ';box-shadow:none}',
    '.ui-form .in-t' + X + ':focus,.ui-form input' + X + ':focus,.ui-form select' + X + ':focus,.ui-form textarea' + X + ':focus{border-color:var(--ui-teal,#01b0bf);box-shadow:0 0 0 3px rgba(1,176,191,.18);outline:none}',
    '.ui-form [aria-invalid=true]' + X + '{border-color:var(--ui-out,#B5533C)!important;box-shadow:0 0 0 3px rgba(181,83,60,.12)!important}',
    '.ui-form .ui-hint{font:12px/1.45 ' + F + ';color:' + MU + ';margin-top:4px}',
    '.ui-form .ui-err{font:600 12.5px/1.45 ' + F + ';color:var(--ui-out,#B5533C);margin-top:8px}',
    '.ui-form .btn' + X + '{min-height:40px;border-radius:10px;font:700 14px ' + F + ';box-shadow:none}',
    '.ui-form .btn.sm' + X + '{min-height:34px;font-size:13px}',
    '.ui-form .btn' + X + ':not(.ghost):not(.lite):not(.x):not(:disabled){background:var(--ui-teal-d,#00808B)!important;border-color:var(--ui-teal-d,#00808B)!important;color:#fff!important;box-shadow:none!important}',
    '.ui-form .btn.ghost' + X + '{background:#fff!important;border:1px solid ' + LN + '!important;color:' + INK + '!important;box-shadow:none!important}',
    '.ui-form .btn' + X + ':focus-visible{outline:2px solid var(--ui-teal,#01b0bf);outline-offset:2px}',
    '.ui-form > #sheetBody > .mute.small,.ui-form > #sheetBody > div.mute,.ui-form .sub' + X + '{font-family:' + F + ';font-size:13px;color:' + MU + '}',
    '.ui-form table' + X + '{font-family:' + F + ';font-size:13.5px;font-variant-numeric:tabular-nums}.ui-form table' + X + ' td{border-bottom:1px solid #F3F2F7}',
    '#wlM .wl-m.ui-form{border-radius:var(--ui-r,14px)}.ui-form .wl-ch button{height:34px;padding:0 12px;border:1px solid ' + LN + ';border-radius:10px;font:700 13px ' + F + '}',
    '.ui-form .wl-af{font-family:' + F + ';font-variant-numeric:tabular-nums}'
  ].join('\n');
  var st = document.createElement('style'); st.id = 'ui941'; st.textContent = css; document.head.appendChild(st);
  var sh = function(){ return document.getElementById('sheet'); };

  /* ── #sheet: class only while a Finance opener owns it ── */
  var act = 0;
  var _os = window.openSheet;
  if(typeof _os === 'function') window.openSheet = openSheet = function(html){ var r = _os.apply(this, arguments); try{ var e = sh(); if(e) e.classList.toggle('ui-form', act > 0); }catch(x){} return r; };
  var _cs = window.closeSheet;
  if(typeof _cs === 'function') window.closeSheet = closeSheet = function(){ var r = _cs.apply(this, arguments); try{ var e = sh(); if(e) e.classList.remove('ui-form'); }catch(x){} return r; };
  function wrap(name, test){ var o = window[name]; if(typeof o !== 'function' || o.__941) return;
    var w = function(){ if(test && !test.apply(this, arguments)) return o.apply(this, arguments);
      act++; var done = function(){ act = Math.max(0, act - 1); }, r;
      try{ r = o.apply(this, arguments); }catch(e){ done(); throw e; }
      if(r && typeof r.then === 'function') r.then(done, done); else done();
      try{ var e = sh(); if(e && e.classList.contains('on')) e.classList.add('ui-form'); }catch(x){}
      return r; };
    w.__941 = 1; window[name] = w; }
  function wrapAll(){ ['saleSheet', 'expSheet', 'payRow', 'payslip', 'payslipNow', 'togglePaid', 'rfOpen'].forEach(function(n){ wrap(n); });
    wrap('tabSheet', function(key){ return key === 'PAY'; }); }
  wrapAll(); setTimeout(wrapAll, 4000);   /* payslipNow / rfOpen are defined by later scripts on some builds */

  /* ── wallet modal + payment confirmation form column ── */
  function mark(){ var m = document.querySelector('#wlM .wl-m'); if(m && !m.classList.contains('ui-form')) m.classList.add('ui-form');
    var f = document.querySelector('#ivM .iv-f'); if(f && !f.classList.contains('ui-form')) f.classList.add('ui-form'); }
  try{ new MutationObserver(function(M){ for(var k = 0; k < M.length; k++) if(M[k].addedNodes.length){ mark(); return; } }).observe(document.body, { childList: true }); }catch(e){}

  /* ── inline error lines for + Sale / + Expense (same checks as sendMoney) ── */
  var _sm = window.sendMoney;
  if(typeof _sm === 'function') window.sendMoney = sendMoney = function(fn){
    try{ var v = function(id){ var el = document.getElementById(id); return el ? el.value : ''; }, miss = [];
      var old = document.getElementById('err941'); if(old) old.remove();
      document.querySelectorAll('#sheetBody [aria-invalid=true]').forEach(function(el){ el.removeAttribute('aria-invalid'); });
      if(fn === 'addExpense'){ if(!v('fE').trim()) miss.push(['fE', 'description']); if(!v('fC')) miss.push(['fC', 'category']); if(!(+v('fA').replace(/,/g, ''))) miss.push(['fA', 'amount']); }
      else if(fn === 'addSale'){ if(!v('fI').trim() && !(typeof INV !== 'undefined' && INV && INV.name)) miss.push(['fI', 'invoice and student (or attach the PDF)']); if(!v('fR')) miss.push(['fR', 'partner']); }
      if(miss.length){ miss.forEach(function(m){ var el = document.getElementById(m[0]); if(el){ el.setAttribute('aria-invalid', 'true'); el.setAttribute('aria-describedby', 'err941'); el.addEventListener('input', function c(){ el.removeAttribute('aria-invalid'); el.removeEventListener('input', c); }); el.addEventListener('change', function c2(){ el.removeAttribute('aria-invalid'); el.removeEventListener('change', c2); }); } });
        var b = document.getElementById('fGo'); if(b) b.insertAdjacentHTML('afterend', '<div class="ui-err" id="err941" role="alert">Still needed: ' + miss.map(function(m){ return m[1]; }).join(', ') + '.</div>'); } }catch(e){ console.warn('941', e); }
    return _sm.apply(this, arguments); };
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
