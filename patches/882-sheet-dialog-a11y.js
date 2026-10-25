// 882: (Misty brief #18 · dialogs) the bottom card ($('sheet') + $('scrim')) behaves as a proper modal dialog.
// · #sheet: role="dialog", aria-modal="true", named by its first heading; aria-hidden="true" while closed. On phones the closed
//   card used to sit just below the screen and stayed in the Tab order and the screen-reader tree; it is now visibility:hidden
//   once its slide-out finishes (laptops already did this). The scrim is aria-hidden (click-to-close only).
// · Opening moves focus into the card (unless the screen already focused a field there); Tab / Shift+Tab cycle inside it;
//   closing returns focus to the control that opened it (re-found by id / onclick if the list was redrawn meanwhile).
// · Separate wrapper, safe next to the stale-sheet / focus-restore fix (agent B, 840–849): it does not wrap openSheet or
//   closeSheet, it watches the sheet's "on" class (so the two places that add "on" directly are covered too); it reuses
//   window.__sheetOpener when present and only restores focus if nothing else already did. Escape is NOT added here:
//   the app's own keydown handler already closes the card.
const lib = require('../tools/lib.js'), fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 882 · sheet dialog: role, hidden while closed, focus in, focus contained, focus back */
(function(){
  if(window.__882) return; window.__882 = 1;
  var sh = document.getElementById('sheet'), sc = document.getElementById('scrim'), bd = document.getElementById('sheetBody');
  if(!sh) return;
  document.head.insertAdjacentHTML('beforeend', '<style id="a882">@media(max-width:899px){.sheet:not(.on){visibility:hidden;transition:transform .22s ease,visibility 0s linear .22s}.sheet.on{visibility:visible}}#sheet:focus{outline:none}</style>');
  sh.setAttribute('role', 'dialog'); sh.setAttribute('aria-modal', 'true'); sh.setAttribute('tabindex', '-1');
  if(sc) sc.setAttribute('aria-hidden', 'true');
  var on = function(){ return sh.classList.contains('on'); };
  var vis = function(el){ return !!(el && el.isConnected && el.getClientRects().length); };
  var FOC = 'a[href],button:not([disabled]),input:not([disabled]):not([type=hidden]),select:not([disabled]),textarea:not([disabled]),summary,[tabindex]:not([tabindex="-1"]),[contenteditable="true"]';
  var focusables = function(){ return [].filter.call(sh.querySelectorAll(FOC), function(el){ return vis(el) && getComputedStyle(el).visibility !== 'hidden'; }); };
  var label = function(){ var h = bd && bd.querySelector('h1,h2,h3');
    if(h){ if(!h.id) h.id = 'sheetTitle882'; sh.setAttribute('aria-labelledby', h.id); sh.removeAttribute('aria-label'); }
    else { sh.removeAttribute('aria-labelledby'); sh.setAttribute('aria-label', 'Details'); } };
  /* who opened it: the focused control, else the last thing clicked outside the card */
  var lastEl = null;
  document.addEventListener('click', function(e){ var t = e.target && e.target.closest && e.target.closest('button,a,[onclick],[tabindex],input,select,summary'); if(t && !sh.contains(t)) lastEl = t; }, true);
  document.addEventListener('focusin', function(e){ if(e.target && e.target !== document.body && !sh.contains(e.target) && e.target !== sc) lastEl = e.target; }, true);
  var opener = null, sig = null;
  var refind = function(){ if(opener && opener.isConnected) return opener; if(!sig) return null;
    var el = sig.id ? document.getElementById(sig.id) : null;
    if(!el && sig.oc){ try{ el = document.querySelector('[onclick="' + (window.CSS && CSS.escape ? CSS.escape(sig.oc) : sig.oc.replace(/"/g, '\\"')) + '"]'); }catch(e){ el = null; } }
    return el && !sh.contains(el) ? el : null; };
  var was = on();
  sh.setAttribute('aria-hidden', was ? 'false' : 'true');
  var opened = function(){
    var a = document.activeElement, o = (window.__sheetOpener && window.__sheetOpener.isConnected && !sh.contains(window.__sheetOpener)) ? window.__sheetOpener
      : (a && a !== document.body && !sh.contains(a) ? a : lastEl);
    opener = o || null; sig = o ? { id: o.id || '', oc: o.getAttribute && o.getAttribute('onclick') || '' } : null; window.__a11ySheetOpener = opener;
    sh.setAttribute('aria-hidden', 'false'); label();
    setTimeout(function(){ if(on() && !sh.contains(document.activeElement)) try{ sh.focus({ preventScroll: true }); }catch(e){} }, 0);
  };
  var closed = function(){ sh.setAttribute('aria-hidden', 'true');
    setTimeout(function(){ if(on()) return; var a = document.activeElement;
      if(a && a !== document.body && !sh.contains(a)) return;      /* someone (e.g. agent B's restore) already placed focus */
      var o = (window.__sheetOpener && window.__sheetOpener.isConnected && !sh.contains(window.__sheetOpener)) ? window.__sheetOpener : refind();
      if(vis(o)) try{ o.focus({ preventScroll: true }); }catch(e){}
      else if(sh.contains(a)) try{ a.blur(); }catch(e){} }, 80); };
  new MutationObserver(function(){ var n = on(); if(n === was) return; was = n; n ? opened() : closed(); }).observe(sh, { attributes: true, attributeFilter: ['class'] });
  /* content swapped while open (card to card): keep a name and keep focus inside */
  if(bd) new MutationObserver(function(){ if(!on()) return; label();
    setTimeout(function(){ if(on() && (!document.activeElement || document.activeElement === document.body)) try{ sh.focus({ preventScroll: true }); }catch(e){} }, 0); })
    .observe(bd, { childList: true });
  /* Tab stays inside the open card; other overlays above it (pickers, invoice/wallet windows) are left alone */
  document.addEventListener('keydown', function(e){
    if(e.key !== 'Tab' || !on()) return;
    var a = document.activeElement, inSheet = sh.contains(a);
    var ap = document.getElementById('app'), lg = document.getElementById('login');
    if(!inSheet && a && a !== document.body && a !== sc && !(ap && ap.contains(a)) && !(lg && lg.contains(a))) return;
    var F = focusables(); if(!F.length){ e.preventDefault(); try{ sh.focus(); }catch(x){} return; }
    var first = F[0], lastF = F[F.length - 1];
    if(!inSheet){ e.preventDefault(); (e.shiftKey ? lastF : first).focus(); return; }
    if(e.shiftKey && (a === first || a === sh)){ e.preventDefault(); lastF.focus(); }
    else if(!e.shiftKey && a === lastF){ e.preventDefault(); first.focus(); }
  }, true);
  if(was) label();
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
lib(file, []);
