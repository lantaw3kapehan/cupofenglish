// 1201: (Misty, 26 Oct 21:00) teacher Today · classes in the order of the day's work:
//   Now & next (unchanged, from 1104) → "Remaining today" (classes still to come) → "Completed today · N" (classes that have ended,
//   and cancelled ones), folded by default; open/closed is remembered on this device.
//   A class that ended with its class note or video not done yet also stays in "Needs your action" (one row per class:
//   "Mia Example · 13:00 class · Class note · Video not done yet") until the app's own data says it is done; "Open class"
//   opens Completed today and brings that class card into view, with its drag-and-drop video box, note and homework buttons
//   exactly as before. Unmarked homework keeps its own existing row. Cards are only moved, never rebuilt: buttons, drafts,
//   uploads and statuses behave exactly as before. Nothing is saved by this screen.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
/* 1106's one list: let other passes add rows (same row look, same sorting) */
const A = "    out.sort(function(a, b){ return a.sev - b.sev || a.due.d - b.due.d; }); return out; }";
s = s.replace(A, "    (window.q1106Extra || []).forEach(function(f){ try{ (f(v, td, out) || []).forEach(add); }catch(e){ console.warn('q1106Extra', e); } });   /* 1201 */\n" + A);
const i = s.lastIndexOf('</body>');
const css = `
#v-today .cd1200{margin:12px 0 4px;background:#fff;border:1px solid #E7E5EE;border-radius:14px;padding:0}
#v-today .cd1200>summary{list-style:none;cursor:pointer;display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:12px 14px;min-height:44px;box-sizing:border-box}
#v-today .cd1200>summary::-webkit-details-marker{display:none}
#v-today .cd1200>summary:focus-visible{outline:3px solid rgba(0,112,122,.55);outline-offset:-3px;border-radius:14px}
#v-today .cd1200>summary .cdt{font-family:'Fredoka One','Fredoka',Inter,sans-serif;font-size:1.0625rem;color:#2B2450}
#v-today .cd1200>summary .cdn{font-size:.8125rem;font-weight:700;color:#1E7A55;background:#EAF6F0;border-radius:999px;padding:2px 10px}
#v-today .cd1200>summary .cdp{font-size:.8125rem;font-weight:700;color:#7A4A00;background:#FFF4DE;border-radius:999px;padding:2px 10px}
#v-today .cd1200>summary .cda{margin-left:auto;font-size:.8125rem;font-weight:600;color:#00616A}
#v-today .cd1200>summary .cda::after{content:' ›';display:inline-block;transition:transform .15s}
#v-today .cd1200[open]>summary .cda::after{transform:rotate(90deg)}
#v-today .cd1200>.cdl{padding:0 10px 10px}
#v-today .cd1200>.cdl>.cls{margin:10px 0 0!important}
#v-today .rm1200e{padding:12px 14px;color:#5E5A76;font-size:.9375rem;background:#fff;border:1px dashed #E7E5EE;border-radius:14px}
#v-today .cls.fl1200{outline:3px solid #8CC5CA;outline-offset:2px;transition:outline-color 1.2s}
`;
const js = String.raw`
(function(){
  if(window.__1201) return; window.__1201 = 1;
  var KEY = 'coe.td.cdone';
  var get = function(){ try{ return localStorage.getItem(KEY) === '1'; }catch(e){ return false; } }, set = function(b){ try{ localStorage.setItem(KEY, b ? '1' : '0'); }catch(e){} };
  var hm = function(t){ var m = String(t || '').match(/(\d{1,2}):(\d{2})/); return m ? (+m[1]) * 60 + (+m[2]) : null; };
  var nowMin = function(){ var d = new Date(); return d.getHours() * 60 + d.getMinutes(); };
  var tOf = function(c){ var b = c.querySelector('.t b, .t .num'); return hm(b && b.textContent); };
  var lenOf = function(c){ var sp = c.querySelector('.t span'); var m = sp && String(sp.textContent).match(/(\d+)\s*min/); return m ? +m[1] : 25; };
  var gone = function(c){ return c.classList.contains('x') || /cancel/i.test(c.className); };
  var ended = function(c){ if(gone(c)) return true; if(c.classList.contains('now')) return false; var t = tOf(c); return t != null && t + lenOf(c) <= nowMin(); };
  var nameOf = function(c){ var e = c.querySelector('.nm'); return e ? e.textContent.replace('›', '').trim() : 'Class'; };
  function missing(c){ if(gone(c) || c.classList.contains('trial')) return []; return [].slice.call(c.querySelectorAll('.cs93>span.n')).map(function(x){ return x.textContent.replace(/^[!✓◷\s]+/, '').trim(); }).filter(function(x){ return /^(Homework|Note|Video)$/i.test(x); }); }
  var busy = false;
  function parts(v){
    var h2 = [].slice.call(v.querySelectorAll('h2')).find(function(x){ return !x.closest('.nn1104,.td1104,.cd1200') && /^(Rest of today|Today's classes|Today’s classes|Remaining today)/.test(x.textContent.trim()); });
    if(!h2) return null; var list = h2.nextElementSibling; if(!list || list.tagName !== 'DIV') return null; return { h2: h2, list: list }; }
  function arrange(){ if(busy) return; try{
    if(typeof D === 'undefined' || !D || D.mgr) return; var v = document.getElementById('v-today'); if(!v || !v.querySelector(':scope>.td1104')) return;   /* after 1104 has placed Now & next */
    var P = parts(v); if(!P) return; busy = true;
    var box = v.querySelector('.cd1200');
    var inList = [].slice.call(P.list.querySelectorAll('.cls')).filter(function(c){ return !c.closest('.cd1200'); });
    var old = box ? [].slice.call(box.querySelectorAll('.cdl>.cls')) : [];
    var fin = inList.filter(ended), back = old.filter(function(c){ return !ended(c); });
    if((fin.length || old.length) && !box){ box = document.createElement('details'); box.className = 'cd1200'; if(get()) box.open = true;
      box.innerHTML = '<summary><span class="cdt">Completed today</span><span class="cdn"></span><span class="cdp" hidden></span><span class="cda"></span></summary><div class="cdl"></div>';
      box.addEventListener('toggle', function(){ set(box.open); var a = box.querySelector('.cda'); if(a) a.textContent = box.open ? 'Hide' : 'Show'; }); }
    if(box && box.previousElementSibling !== P.list) P.list.after(box);
    var L = box ? box.querySelector('.cdl') : null;
    /* the old "✓ Finished today" fold (336): its cards belong here now */
    [].forEach.call(v.querySelectorAll('.dnBox'), function(d){ if(L) [].forEach.call(d.querySelectorAll('.cls'), function(c){ L.appendChild(c); }); d.remove(); });
    fin.forEach(function(c){ L.appendChild(c); });
    back.forEach(function(c){ P.list.appendChild(c); });
    if(L){ var cs = [].slice.call(L.querySelectorAll(':scope>.cls')); cs.sort(function(a, b){ return (tOf(a) || 0) - (tOf(b) || 0); }); if(cs.some(function(c, k){ return L.children[k] !== c; })) cs.forEach(function(c){ L.appendChild(c); });
      var n = cs.filter(function(c){ return !gone(c); }).length, x = cs.length - n, todo = cs.filter(function(c){ return missing(c).length; }).length;
      if(!cs.length){ box.remove(); box = null; }
      else { var cn = (n ? n + ' class' + (n === 1 ? '' : 'es') : '') + (x ? (n ? ' · ' : '') + x + ' cancelled' : ''); var e1 = box.querySelector('.cdn'); if(e1.textContent !== cn) e1.textContent = cn;
        var e2 = box.querySelector('.cdp'), tx = todo ? todo + ' with something to finish' : ''; if(e2.textContent !== tx) e2.textContent = tx; e2.hidden = !todo;
        var e3 = box.querySelector('.cda'), at = box.open ? 'Hide' : 'Show'; if(e3.textContent !== at) e3.textContent = at; } }
    /* "Remaining today" */
    if(!/^Remaining today/.test(P.h2.textContent.trim())) P.h2.textContent = 'Remaining today';
    var left = [].slice.call(P.list.querySelectorAll(':scope>.cls')).length, emp = P.list.querySelector(':scope>.rm1200e');
    [].forEach.call(P.list.querySelectorAll(':scope>.empty'), function(e){ if(!e.classList.contains('rm1200e')) e.style.display = 'none'; });
    if(!left){ var msg = v.querySelector(':scope>.nn1104') ? 'No other classes left today' : 'All of today’s classes are finished ✓'; if(!emp){ emp = document.createElement('div'); emp.className = 'rm1200e'; P.list.appendChild(emp); } if(emp.textContent !== msg) emp.textContent = msg; }
    else if(emp) emp.remove();
  }catch(e){ console.warn('1201', e); } finally{ busy = false; } }
  window.__td1201 = arrange;
  /* ended classes with their class note / video (or homework, if no row has it yet) still open → one row each in Needs your action */
  (window.q1106Extra = window.q1106Extra || []).push(function(v, td, out){
    var hasHw = (out || []).some(function(x){ return /homework/i.test(x.kind || ''); }), rows = [];
    [].forEach.call(v.querySelectorAll('.cls'), function(c){ if(c.closest('.nn1104') || !ended(c)) return; var m = missing(c).filter(function(x){ return !(hasHw && /homework/i.test(x)); }); if(!m.length) return;
      var t = tOf(c), tt = t == null ? '' : (t < 600 ? '0' : '') + Math.floor(t / 60) + ':' + (t % 60 < 10 ? '0' : '') + (t % 60), nm = nameOf(c);
      var lab = m.map(function(x){ return /note/i.test(x) ? 'Class note' : /video/i.test(x) ? 'Video' : 'Homework'; });
      rows.push({ sev: 2.2, kind: 'After class', title: nm + (tt ? ' · ' + tt + ' class' : ''), sub: lab.join(' · ') + ' not done yet · by 23:59', verb: 'Open class', due: { d: 0, txt: 'Today' },
        act: function(){ var box = c.closest('.cd1200'); if(box && !box.open){ box.open = true; set(true); } c.scrollIntoView({ behavior: 'smooth', block: 'center' }); c.classList.add('fl1200'); setTimeout(function(){ c.classList.remove('fl1200'); }, 2400);
          var b = c.querySelector(/video/i.test(lab[0]) ? '.hw button[onclick*="vidUp("]' : /note/i.test(lab[0]) ? '.hw[onclick*="noteSheet"], button[onclick*="noteSheet"]' : 'button[onclick*="markHw"]'); if(b) try{ b.focus({ preventScroll: true }); }catch(e){} } }); });
    return rows; });
  var _rt = window.renderToday; if(typeof _rt === 'function') window.renderToday = function(){ var r = _rt.apply(this, arguments); arrange(); return r; };
  var v = document.getElementById('v-today'); if(v) new MutationObserver(function(){ arrange(); }).observe(v, { childList: true });
  setInterval(function(){ if(typeof VIEW !== 'undefined' && VIEW === 'today' && !document.hidden) arrange(); }, 60000);   /* a class that just ended moves down */
})();
`;
s = s.slice(0, i) + '<style id="d1201">/* 1201 · Remaining / Completed today */' + css + '</style>\n<script>' + js + '</script>\n' + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
