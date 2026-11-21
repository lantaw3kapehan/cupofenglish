// 2651 (Misty 21 Nov 21:08 "Overview and To do seemed messy once buttons are clicked · no actions · also actions from Operations ·
//   I have raised this concern already" · 21:10 "test President screen and Celine's screen simultaneously")
//   Causes found:
//   a. (checked live: rebuilds no longer blink since 2637; not changed) After any tap, the list that changed rebuilt the whole Overview / To do, which removed every card added by other parts
//      (For your decision, Lates, From the President, Christmas …) until each put itself back a moment later → cards vanish and come back.
//      Now: when Overview or To do is rebuilt (management), those cards are kept in place in the same instant, so nothing blinks or jumps.
//   b. "Followed up" opened a browser pop-up for the note. Now a small line opens under the row: note (optional) + Save / Cancel.
//   c. A tapped button gave no sign until the server answered. Now it dims at once ("Saving…" look) until its card is redrawn (max 6 s).
//   d. President ↔ Operations: For your decision / From the President are read again every 8 s (was 20 s).
const fs = require('fs'); const file = process.argv[2]; let h = fs.readFileSync(file, 'utf8');
function region(id, pairs){ const a = h.indexOf('<script id="' + id + '">'); if (a < 0) throw new Error('no ' + id); const b = h.indexOf('</script>', a);
  let s = h.slice(a, b); pairs.forEach(([f, r]) => { const n = s.split(f).length - 1; if (n !== 1) throw new Error(id + ' ' + n + ' × ' + f); s = s.replace(f, r); }); h = h.slice(0, a) + s + h.slice(b); }
region('b2630', [
  ["note = prompt('Followed up · a short note (optional), e.g. \"Rose: will send it soon\"', '') || '';", "note = String(window.__fy2651 || ''); window.__fy2651 = '';"],
  ["AT < 20e3", "AT < 8e3"],
  ["if(o.__h !== h){ var t2", "if(o.__h !== h && !o.contains(document.activeElement)){ var t2"],
]);
region('b2638', [["AT < 20e3", "AT < 8e3"]]);
const JS = `<script id="b2651">
(function(){ if(window.__2651) return; window.__2651 = 1;
  var mgr = function(){ return typeof D !== 'undefined' && D && D.mgr; };
  var css = document.createElement('style'); css.textContent = '.b2651-busy{opacity:.45;pointer-events:none;transition:opacity .12s}.fy2651{display:flex;gap:6px;align-items:center;flex-wrap:wrap;width:100%;padding:6px 0 2px 40px}.fy2651 input{flex:1;min-width:200px;height:36px;border:1px solid #CFCBDD;border-radius:10px;padding:0 10px;font:inherit}';
  document.head.appendChild(css);
  /* c · a tapped button shows it was taken */
  document.addEventListener('click', function(ev){ try{ if(!mgr()) return; var b = ev.target.closest && ev.target.closest('button'); if(!b || b.disabled) return;
    if(!b.closest('#v-home, #v-mtoday') || b.closest('summary') || /^(Show|Hide|Show list|Cancel|Copy|Copy message|Open|Review|Decide|Answer|Monitor)\\b/i.test((b.textContent || '').trim()) || /fy2651/.test(b.getAttribute('onclick') || '')) return;
    setTimeout(function(){ if(b.isConnected && !b.closest('.fy2651')) { b.classList.add('b2651-busy'); setTimeout(function(){ if(b.isConnected) b.classList.remove('b2651-busy'); }, 6000); } }, 0); }catch(e){} }, true);
  /* b · Followed up: a line under the row instead of a pop-up */
  var _fy = null; function wrapFy(){ if(_fy || typeof window.fy2637 !== 'function') return; _fy = window.fy2637;
    window.fy2637 = function(k, st){ if(st !== 'followed' || window.__fy2651go) { window.__fy2651go = 0; return _fy.apply(this, arguments); }
      var btn = document.querySelector('#fy2630 button[onclick*="fy2637(\\'' + k + '\\',\\'followed\\')"]'), row = btn && btn.closest('.fyr'); if(!row){ window.__fy2651 = ''; return _fy(k, st); }
      var old = row.querySelector('.fy2651'); if(old){ old.remove(); return; }
      row.insertAdjacentHTML('beforeend', '<div class="fy2651"><input placeholder="Short note (optional), e.g. Rose: will send it soon" maxlength="200"><button class="btn sm teal" type="button">Save</button><button class="btn sm ghost" type="button">Cancel</button></div>');
      row.style.flexWrap = 'wrap'; var box = row.querySelector('.fy2651'), inp = box.querySelector('input'), bs = box.querySelectorAll('button'); inp.focus();
      var save = function(){ window.__fy2651 = inp.value.trim(); window.__fy2651go = 1; window.fy2637(k, 'followed'); };
      bs[0].onclick = save; bs[1].onclick = function(){ box.remove(); }; inp.onkeydown = function(e){ if(e.key === 'Enter') save(); if(e.key === 'Escape') box.remove(); }; }; }
  wrapFy(); setInterval(wrapFy, 1500);
  /* e · 2651 (Misty 21:08 "messy … once buttons are clicked"): what was already acted on folds into one line under its card:
     For your decision › followed up · From the President › done · Trial follow-ups › next step later · Fix these › paused. */
  var FO = {}; try{ FO = JSON.parse(sessionStorage.getItem('coe.fold2651') || '{}'); }catch(e){}
  var F = [['#fy2630', '.fyr.fy-followed', 'fy', 'Followed up'], ['#fp2638', '.fpr.fpd', 'fp', 'Done'], ['#td-follow', '.tdr.later', 'tf', 'Waiting · next step later'], ['#o91fix', '.fx-riskp', 'rp', 'Paused · nothing to do until the date']];
  window.fold2651 = function(k){ FO[k] = !FO[k]; try{ sessionStorage.setItem('coe.fold2651', JSON.stringify(FO)); }catch(e){} fold(); };
  function fold(){ if(!mgr()) return; F.forEach(function(f){ [].slice.call(document.querySelectorAll(f[0])).forEach(function(c){
    var R = [].slice.call(c.querySelectorAll(f[1])), b = c.querySelector(':scope .fold2651[data-k="' + f[2] + '"]');
    if(!R.length){ if(b) b.remove(); return; }
    R.forEach(function(r){ r.classList.toggle('nb2648-off', !FO[f[2]]); });
    var t = f[3] + ' · ' + R.length + (FO[f[2]] ? ' · hide' : ' · show');
    if(!b){ b = document.createElement('button'); b.type = 'button'; b.className = 'fold2651'; b.dataset.k = f[2]; b.setAttribute('onclick', 'fold2651(this.dataset.k)'); }
    var last = R[R.length - 1]; if(b.previousElementSibling !== last || b.parentElement !== last.parentElement) last.after(b);
    if(b.textContent !== t) b.textContent = t; }); }); }
  var fcss = document.createElement('style'); fcss.textContent = '.nb2648-off{display:none!important}.fold2651{display:block;margin:6px 0 2px;background:none;border:0;padding:4px 0;font:600 13px/1.4 Inter,system-ui,sans-serif;color:#0E6B73;cursor:pointer}';
  document.head.appendChild(fcss);
  var FT = 0; new MutationObserver(function(){ clearTimeout(FT); FT = setTimeout(fold, 30); }).observe(document.body, { childList: true, subtree: true }); fold();
})();
</script>
</body>`;
if (h.includes('id="b2651"')) throw new Error('already');
const i = h.lastIndexOf('</body>'); h = h.slice(0, i) + JS + h.slice(i + 7); fs.writeFileSync(file, h);
require('../tools/lib.js')(file, []);
