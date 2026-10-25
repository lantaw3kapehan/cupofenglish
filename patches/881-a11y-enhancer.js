// 881: (Misty brief #18 · accessibility) one small DOM enhancer for every screen, no screen code changed.
// · Clickable non-buttons (div/span/li/td/img/svg with onclick, and a[onclick] without href) get tabindex="0", Enter/Space
//   activation and role="button" (rows <tr> and cards that contain other controls keep their own role and only become
//   keyboard-reachable, so tables and nested buttons stay valid). Backdrops ("if(event.target === this)") and the scrim are left alone.
// · Controls without a name get one: icon buttons from title / inner <title> / img alt / ✕ ‹ › symbols; inputs/selects from an
//   unlinked <label> just before them (label "for" is set, so tapping the label focuses the field) or their placeholder.
//   Anything still unnamed is listed by window.__a11yReport() for follow-up.
// · Selected states: tab bars and segmented controls whose buttons use class "on" (.seg, .mo-tabs, .tabs, .acc, .sk2, chips and
//   any button row with exactly one "on") get aria-pressed; the main navigation (#navIn) and the group tabs (.grp-tabs)
//   get aria-current="page". this.classList.toggle('open') collapsibles get aria-expanded. Re-synced after every click/render.
// · The invoice and wallet windows (#ivM, #wlM) are announced as dialogs.
// · "Signing in…": the toast is now a polite live region; after a toast fades its text is cleared, and when the app opens the
//   leftover "Signing in…" toast is removed at once, so no stale announcement stays on screen or in the accessibility tree.
// Documents (print area, previews, capture boxes) are skipped. Debounced (idle callback), each element handled once.
const lib = require('../tools/lib.js'), fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 881 · accessibility enhancer: keyboard for clickable elements, names, selected states, live toast */
(function(){
  if(window.__881) return; window.__881 = 1;
  var DOCS = '#printArea,.docprint,.paper,.memo,.sd,.ivp,.ivq,.tr-page,#rfNote,[data-doc]';
  var CLICK = '[onclick]:not(button):not(input):not(select):not(textarea):not(option):not(label):not(summary):not(a[href]):not([role]):not([tabindex]):not(body):not(html)';
  var INTER = 'button,a[href],input,select,textarea,summary,[onclick],[tabindex]';
  var GROUPS = '.seg,.mo-tabs,.tabs,.acc,.sk2,.chips,.pills,[role=tablist]';
  var NAVS = '#navIn,.grp-tabs';
  var SYM = { '✕': 'Close', '×': 'Close', '✖': 'Close', '‹': 'Previous', '›': 'Next', '←': 'Previous', '→': 'Next', '<': 'Previous', '>': 'Next', '…': 'More', '⋯': 'More' };
  var txt = function(el){ return (el.textContent || '').replace(/\s+/g, ' ').trim(); };
  var offHost = function(el){ var t = el; while(t.parentElement && t.parentElement !== document.body) t = t.parentElement; return t !== el && /left:\s*-\d{3,}/.test(t.getAttribute && t.getAttribute('style') || ''); };
  var skip = function(el){ return !!(el.closest && el.closest(DOCS)) || offHost(el); };
  var hid = function(el){ return !!(el.closest && el.closest('[aria-hidden="true"]')) || el.getAttribute('tabindex') === '-1'; };
  var named = function(el){ if(el.getAttribute('aria-label') || el.getAttribute('aria-labelledby')) return true;
    if(el.labels && el.labels.length && el.labels[0] && txt(el.labels[0])) return true;
    if(/^(BUTTON|A)$/.test(el.tagName) || el.getAttribute('role') === 'button'){ var tx = txt(el); if(tx && !SYM[tx]) return true; var im = el.querySelector('img[alt]:not([alt=""])'); if(im) return true; }
    return false; };
  var guess = function(el){ var t = el.getAttribute('title') || el.getAttribute('data-tip') || el.getAttribute('data-title'); if(t) return t.trim();
    var st = el.querySelector && el.querySelector('svg title'); if(st && txt(st)) return txt(st);
    var tx = txt(el); if(tx && SYM[tx]) return SYM[tx];
    return ''; };
  var UNNAMED = new Set(); window.__a11yReport = function(){ return [].filter.call(Array.from(UNNAMED), function(e){ return e.isConnected && e.getClientRects().length && !named(e) && !e.getAttribute('aria-label'); }).map(function(e){
    return e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + (e.className && typeof e.className === 'string' ? '.' + e.className.trim().split(/\s+/).join('.') : '') + ' ' + (e.getAttribute('onclick') || e.getAttribute('name') || '').slice(0, 60); }); };

  var clickables = function(root){
    [].forEach.call(root.querySelectorAll(CLICK + ',a[onclick]:not([href]):not([role]):not([tabindex])'), function(el){
      if(el.__a881 || skip(el)) return; el.__a881 = 1;
      var oc = el.getAttribute('onclick') || ''; if(el.id === 'scrim' || /event\.target\s*===?\s*this|^\s*event\.stopPropagation\(\);?\s*$/.test(oc)) return;
      el.setAttribute('tabindex', '0'); el.__a881k = 1;
      if(/^(TR|TD|TH)$/.test(el.tagName) || el.querySelector(INTER)) return;   /* table rows/cells and cards with controls inside: keyboard only, table semantics kept */
      el.setAttribute('role', 'button');
      if(!named(el)){ var g = guess(el); if(g) el.setAttribute('aria-label', g); else UNNAMED.add(el); }
    });
  };
  var names = function(root){
    [].forEach.call(root.querySelectorAll('button:not([aria-label]):not([aria-labelledby]),a[href]:not([aria-label])'), function(el){
      if(el.__a881n || skip(el) || hid(el)) return; if(named(el)){ el.__a881n = 1; return; }
      var g = guess(el); if(g){ el.setAttribute('aria-label', g); el.__a881n = 1; } else UNNAMED.add(el); });
    [].forEach.call(root.querySelectorAll('input:not([type=hidden]):not([type=submit]):not([type=button]):not([aria-label]):not([aria-labelledby]),select:not([aria-label]),textarea:not([aria-label])'), function(el){
      if(el.__a881n || skip(el)) return; el.__a881n = 1; if(named(el)) return;
      var p = el.previousElementSibling; if(!p && el.parentElement) p = el.parentElement.previousElementSibling;
      if(p && p.tagName === 'LABEL' && !p.htmlFor && !p.querySelector('input,select,textarea') && txt(p)){
        if(el.id) p.htmlFor = el.id; else el.setAttribute('aria-label', txt(p)); return; }
      var t = el.getAttribute('title') || el.getAttribute('placeholder'); if(t){ el.setAttribute('aria-label', t.trim()); return; }
      UNNAMED.add(el); });
    [].forEach.call(root.querySelectorAll('#ivM:not([role]),#wlM:not([role])'), function(m){ m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true');
      var h = m.querySelector('h1,h2,h3'); if(h){ if(!h.id) h.id = m.id + 'T'; m.setAttribute('aria-labelledby', h.id); } });
  };
  var setSt = function(b, attr, v){ if(b.__a881s === undefined) b.__a881s = !(b.hasAttribute('aria-pressed') || b.hasAttribute('aria-selected') || b.hasAttribute('aria-current'));
    if(!b.__a881s) return; if(v === null){ if(b.hasAttribute(attr)) b.removeAttribute(attr); } else if(b.getAttribute(attr) !== v) b.setAttribute(attr, v); };
  var kids = function(g){ return [].filter.call(g.children, function(c){ return c.tagName === 'BUTTON' || c.getAttribute('role') === 'button'; }); };
  var states = function(root){
    [].forEach.call(root.querySelectorAll(NAVS), function(g){ if(skip(g)) return; kids(g).forEach(function(b){ setSt(b, 'aria-current', b.classList.contains('on') ? 'page' : null); }); });
    var done = new Set();
    [].forEach.call(root.querySelectorAll(GROUPS), function(g){ if(skip(g) || g.matches(NAVS)) return; done.add(g); kids(g).forEach(function(b){ setSt(b, 'aria-pressed', b.classList.contains('on') ? 'true' : 'false'); }); });
    [].forEach.call(root.querySelectorAll('button.on,[role=button].on'), function(b){ var g = b.parentElement; if(!g || done.has(g) || g.matches(NAVS) || skip(g)) return; done.add(g);
      var K = kids(g); if(K.length < 2 || K.filter(function(x){ return x.classList.contains('on'); }).length !== 1) return;
      var bc = function(x){ return (x.className || '').replace(/\bon\b/g, '').replace(/\s+/g, ' ').trim(); }, c0 = bc(K[0]);
      if(K.some(function(x){ return bc(x) !== c0 || x.id === 'tinNag'; })) return;   /* only uniform button rows (tabs/segments), not e.g. the header's Time-in status */
      K.forEach(function(x){ setSt(x, 'aria-pressed', x.classList.contains('on') ? 'true' : 'false'); }); });
    [].forEach.call(root.querySelectorAll('[onclick*="classList.toggle"]'), function(el){ var oc = el.getAttribute('onclick') || '';
      if(/this\.classList\.toggle\(\\?'open\\?'\)/.test(oc)) setSt(el, 'aria-expanded', el.classList.contains('open') ? 'true' : 'false');
      else if(/this\.classList\.toggle\(\\?'on\\?'\)/.test(oc)) setSt(el, 'aria-pressed', el.classList.contains('on') ? 'true' : 'false'); });
  };
  var run = function(){ q = 0; var t0 = performance.now(); try{ var b = document.body; UNNAMED.forEach(function(e){ if(!e.isConnected) UNNAMED.delete(e); }); clickables(b); names(b); states(b); }catch(e){ console.warn('881', e); }
    window.__881ms = Math.round(performance.now() - t0); };
  var q = 0, kick = function(){ if(q) return; q = 1; (window.requestIdleCallback || function(f){ return setTimeout(f, 60); })(run, { timeout: 250 }); };
  new MutationObserver(function(ms){ for(var k = 0; k < ms.length; k++) if(ms[k].addedNodes.length){ kick(); return; } }).observe(document.body, { childList: true, subtree: true });
  document.addEventListener('click', function(){ setTimeout(function(){ try{ states(document.body); }catch(e){} }, 0); });
  document.addEventListener('keydown', function(e){
    if(e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey || (e.key !== 'Enter' && e.key !== ' ' && e.key !== 'Spacebar')) return;
    var el = e.target; if(!el || !el.__a881k || el.isContentEditable) return;
    e.preventDefault(); if(typeof el.click === 'function') el.click(); else el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window })); });
  kick();

  /* "Signing in…" and other finished toasts: clear the live text after it fades; drop it at once when the app opens */
  var t = document.getElementById('toast');
  if(t){ t.setAttribute('role', 'status'); t.setAttribute('aria-live', 'polite'); t.setAttribute('aria-atomic', 'true');
    var ct = 0; new MutationObserver(function(){ clearTimeout(ct); if(!t.classList.contains('on')) ct = setTimeout(function(){ if(!t.classList.contains('on')) t.textContent = ''; }, 450); })
      .observe(t, { attributes: true, attributeFilter: ['class'] });
    var app = document.getElementById('app');
    var stale = function(){ if(app && !app.classList.contains('hide') && /^Signing in/i.test(txt(t))){ clearTimeout(t._h); t.classList.remove('on'); t.textContent = ''; } };
    if(app) new MutationObserver(stale).observe(app, { attributes: true, attributeFilter: ['class'] });
    stale(); }
  var lg = document.querySelector('#login > img'); if(lg && !lg.hasAttribute('alt')) lg.setAttribute('alt', 'CupOfEnglish');
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
lib(file, []);
