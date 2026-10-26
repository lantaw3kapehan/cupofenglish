// 1200: (Misty, 26 Oct 21:00) teacher Today · the large "Final warning" / "Warning" panel becomes one compact, clearly labelled alert:
//   "⛔ Final warning · 3 issues · management has been told   [View details]". Same red urgency (red edge, red title, Final/Warning wording).
//   "View details" opens the SAME full content in place (no pop-up): why it shows, every item, and the required action
//   ("Write my plan" → the plan box → "Send my plan to management"). Nothing about the rules changes: the warning is still worked out by
//   ftCheck (levels, overdue days, repeats), it still stays until the app's data says the items are done, the plan is still sent as a
//   message to management, and acknowledgements (Got it on class visits, memos) are still done where they were. Opened stays opened
//   while the items are the same (redraws do not close it); a new or changed item shows it compact again.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
const css = `
#v-today #ftBox.ft1200c>*:not(h3):not(.ftc1200){display:none!important}
#v-today #ftBox.ft1200c{padding:10px 14px!important}
#v-today #ftBox h3{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
#v-today #ftBox .ftc1200{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:4px;font-size:.875rem;color:#8E1F12}
#v-today #ftBox .ftc1200 .ftn{display:inline-flex;align-items:center;font-weight:700;font-size:.8125rem;border-radius:999px;padding:2px 10px;background:#FDECEA;color:#8E1F12;border:1px solid #F3B8B0}
#v-today #ftBox.ftSent .ftc1200,#v-today #ftBox.ftSent .ftc1200 .ftn{color:#1E7A55}
#v-today #ftBox.ftSent .ftc1200 .ftn{background:#EAF6F0;border-color:#CDE9DA}
#v-today #ftBox .ftc1200 .ftr{flex:1;min-width:140px}
#v-today #ftBox .ftc1200 .ftv{flex:none;padding:5px 14px;font-size:.8125rem;font-weight:700;border-radius:10px;border:1.5px solid #C0392B;background:#fff;color:#8E1F12;cursor:pointer;font-family:inherit;min-height:32px}
#v-today #ftBox.ftSent .ftc1200 .ftv{border-color:#1E7A55;color:#1E7A55}
#v-today #ftBox .ftc1200 .ftv:focus-visible{outline:3px solid rgba(192,57,43,.45);outline-offset:2px}
@media(max-width:640px){#v-today #ftBox .ftc1200 .ftv{width:100%}}
`;
const js = String.raw`
(function(){
  if(window.__1200) return; window.__1200 = 1;
  var OPEN = '';   /* the warning signature the teacher opened (kept while the items stay the same) */
  function sig(f){ return String((window._FT && window._FT.sig) || '') + '|' + (f.classList.contains('ftSent') ? 's' : ''); }
  function count(f){ var L = [].slice.call(f.querySelectorAll(':scope>ul>li')), n = 0; L.forEach(function(li){ var m = li.textContent.trim().match(/^\+(\d+)\s/); n += m ? +m[1] : 1; }); return n; }
  window.ft1200 = function(){ var f = document.getElementById('ftBox'); if(!f) return; OPEN = f.classList.contains('ft1200c') ? sig(f) : ''; deco(); if(OPEN){ var w = f.querySelector('.ftW'), t = document.getElementById('ftP'); (w || t || f).focus && (w || t || f).focus({ preventScroll: true }); } };
  function deco(){ try{
    if(typeof D === 'undefined' || !D || D.mgr) return; var f = document.getElementById('ftBox'); if(!f) return;
    var n = count(f), sent = f.classList.contains('ftSent'), fin = /Final warning/.test((f.querySelector('h3') || {}).textContent || ''), open = OPEN && OPEN === sig(f);
    var want = (n ? n + ' issue' + (n === 1 ? '' : 's') : '') + '|' + open + '|' + sent;
    var c = f.querySelector(':scope>.ftc1200');
    if(!c){ c = document.createElement('div'); c.className = 'ftc1200'; var h = f.querySelector(':scope>h3'); if(h) h.after(c); else f.prepend(c); }
    if(c.dataset.w !== want){ c.dataset.w = want;
      var what = sent ? 'Plan sent · stays until fixed' : 'Action needed · send your follow-up plan';
      c.innerHTML = (n ? '<span class="ftn">' + n + ' issue' + (n === 1 ? '' : 's') + '</span>' : '') + '<span class="ftr">' + what + '</span>'
        + '<button type="button" class="ftv" aria-expanded="' + (open ? 'true' : 'false') + '" aria-controls="ftBox" onclick="ft1200()">' + (open ? 'Hide details' : 'View details') + '</button>'; }
    var cls = !open; if(f.classList.contains('ft1200c') !== cls) f.classList.toggle('ft1200c', cls);
    f.setAttribute('role', 'region'); f.setAttribute('aria-label', fin ? 'Final warning' : sent ? 'Follow-up plan sent' : 'Warning');
  }catch(e){ console.warn('1200', e); } }
  window.__ft1200 = deco;
  var _rt = window.renderToday; if(typeof _rt === 'function') window.renderToday = function(){ var r = _rt.apply(this, arguments); deco(); return r; };
  /* the box is (re)inserted by several passes: decorate before the browser paints */
  new MutationObserver(function(){ if(document.getElementById('ftBox')) deco(); }).observe(document.body, { childList: true, subtree: true });
})();
`;
s = s.slice(0, i) + '<style id="d1200">/* 1200 · compact warning */' + css + '</style>\n<script>' + js + '</script>\n' + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
