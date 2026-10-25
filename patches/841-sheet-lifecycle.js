// 841: Cards (the bottom sheet / dialog) close and open predictably (audit #3: "Edit student" stayed over Parent reports).
// Causes found:
// · stuForm (Edit / New student) opens a loading card, waits for dbLists / dbRecord, then opens the form with openSheet()
//   without checking that the loading card is still the one on screen. Closing it (× / Esc / Back) and going to another
//   screen (e.g. Students › Parent reports) before the answer came → the form popped up over the new screen.
// · stuEdit waits for the whole DATABASE (loadDb) before opening the form: same thing on a slow line.
// · dbPatch (fills the form with the fresh row) could still run on a closed or different card and close it with a toast.
// · go() never closed an open card, so a link inside a card that did not call closeSheet() left the card over the new screen.
// · 794 replaced window.sheetBack(snapshot) with a no-argument "back to the card before" — so the three
//   "Not saved · your changes are back in the form" paths (student details, leave form, pay-check reply) closed the card
//   instead of bringing the form back. sheetBack(snapshot) works again; sheetBack() with no argument is unchanged.
// · No dialog semantics or focus handling: focus stayed behind the card; nothing went back to the button that opened it.
// Now: a stale Edit/New student form is dropped (drawn into a hidden stand-in that is removed at once) if its loading card was closed or replaced; stuEdit stops if the card was
// closed / the screen changed while DATABASE loaded; dbPatch only fills the same student's open form; go() to another
// screen closes an open card first; #sheet is role="dialog" aria-modal, aria-hidden while closed, named by its <h1>;
// focus moves into the card on open and back to the opener on close. Esc / × / Back behaviour is unchanged otherwise
// (the QA form still refuses Esc and the dark background, as before).
const lib = require('../tools/lib.js'), fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 841 · card (sheet) lifecycle: no stale re-open, go() closes, failed-save restore, dialog semantics, focus return */
(function(){
  if(window.__841 || typeof window.openSheet !== 'function' || typeof window.closeSheet !== 'function') return; window.__841 = 1;
  const sh = () => document.getElementById('sheet'), bd = () => document.getElementById('sheetBody');
  const on = () => { const x = sh(); return !!(x && x.classList.contains('on')); };
  let GEN = 0, SFN = 0, opener = null, ALLOW = 0;
  window.coeSheetGen = () => GEN;
  const isSkel = h => /^<h1>(Edit student|New student)<\/h1><div class="sk"><\/div><div class="sk"><\/div>$/.test(h);
  const isForm = h => h.indexOf('id="sBirth"') > -1 && h.indexOf('sendStu(') > -1;
  const clearSf = () => { const b = bd(); if(b){ delete b.dataset.sf841; delete b.dataset.sfc841; } };
  document.head.insertAdjacentHTML('beforeend', '<style>#sheet:focus,#sheet:focus-visible{outline:none!important}</style>');
  try{ const x = sh(); if(x){ x.setAttribute('role', 'dialog'); x.setAttribute('aria-modal', 'true'); if(!x.hasAttribute('tabindex')) x.setAttribute('tabindex', '-1'); x.setAttribute('aria-hidden', on() ? 'false' : 'true'); } }catch(e){}
  function name(){ try{ const x = sh(), h = bd() && bd().querySelector('h1'); if(!x) return; if(h){ if(!h.id) h.id = 'sheetTitle841'; x.setAttribute('aria-labelledby', h.id); } else x.removeAttribute('aria-labelledby'); }catch(e){} }

  /* a dropped form is drawn into a hidden stand-in for the rest of stuForm's step (focus, button label, its error line),
     so nothing is written into the card that is open now; the stand-in goes away right after */
  function sink(h){ const real = bd(); if(!real) return; real.id = 'sheetBody841r';
    const tmp = document.createElement('div'); tmp.id = 'sheetBody'; tmp.hidden = true; tmp.setAttribute('aria-hidden', 'true'); tmp.innerHTML = h; document.body.appendChild(tmp);
    Promise.resolve().then(() => { tmp.remove(); real.id = 'sheetBody'; }); }
  const o0 = window.openSheet;
  window.openSheet = function(html){
    const was = on(), h = String(html == null ? '' : html);
    try{ if(!ALLOW && isForm(h) && !isSkel(h)){ const b = bd();
        /* the Edit/New student form may only replace its own loading card (or itself) while that card is open */
        if(!was || !b || !b.dataset.sf841 || (b.dataset.sfc841 && h.indexOf(b.dataset.sfc841) < 0)){ sink(h); return; } } }catch(e){}
    if(!was){ try{ const a = document.activeElement, x = sh(); opener = a && a !== document.body && !(x && x.contains(a)) ? a : opener; window.__sheetOpener = opener || null; }catch(e){} }
    GEN++;
    const r = o0.apply(this, arguments);
    try{ if(!isForm(h) && !isSkel(h)) clearSf();
      const x = sh(); if(x) x.setAttribute('aria-hidden', 'false'); name();
      /* the card fades in (hidden until the transition starts), so try again until it can take focus */
      if(!was) [0, 80, 240].forEach(ms => setTimeout(() => { try{ const x2 = sh(); if(on() && x2 && !x2.contains(document.activeElement)) x2.focus({ preventScroll: true }); }catch(e){} }, ms));
    }catch(e){}
    return r; };

  const c0 = window.closeSheet;
  window.closeSheet = function(){
    const was = on(); const r = c0.apply(this, arguments);
    try{ if(was && !on()){ GEN++; clearSf(); const x = sh(); if(x) x.setAttribute('aria-hidden', 'true');
        const o = opener; opener = null;
        setTimeout(() => { try{ if(on()) return; const a = document.activeElement, x2 = sh();
            if(o && document.contains(o) && o.getClientRects().length > 0 && !(x2 && x2.contains(o))) o.focus({ preventScroll: true });
            else if(a && x2 && x2.contains(a) && a.blur) a.blur(); }catch(e){} }, 0); } }catch(e){}
    return r; };

  /* go() to another screen closes the open card first (cards opened after go() in the same tap are not affected) */
  const g0 = window.go;
  if(g0) window.go = function(v){ try{ const cur = typeof VIEW !== 'undefined' ? VIEW : ''; if(v && v !== cur){ GEN++; if(on()){ opener = null; window.closeSheet(); } } }catch(e){} return g0.apply(this, arguments); };

  /* Edit / New student: stamp the loading card so only its own form may follow it */
  const sf0 = window.stuForm;
  if(typeof sf0 === 'function') window.stuForm = function(row, code){ const p = sf0.apply(this, arguments);
    try{ const b = bd(); if(b && on()){ b.dataset.sf841 = String(++SFN); if(code) b.dataset.sfc841 = String(code); else delete b.dataset.sfc841; } }catch(e){}
    return p; };
  const dp0 = window.dbPatch;
  if(typeof dp0 === 'function') window.dbPatch = function(v2, code){ try{ const b = bd(); if(!on() || !b || !b.dataset.sf841 || (b.dataset.sfc841 && code && b.dataset.sfc841 !== String(code))) return; }catch(e){} return dp0.apply(this, arguments); };
  /* stuEdit: if DATABASE has to load first, stop when the card was closed or the screen changed meanwhile */
  const se0 = window.stuEdit;
  if(typeof se0 === 'function') window.stuEdit = async function(code){
    if((typeof DB === 'undefined' || !DB) && typeof loadDb === 'function'){ const g = GEN; try{ toast('Opening the student’s DATABASE row…'); }catch(e){}
      try{ await loadDb(true); }catch(e){} if(GEN !== g) return; }
    return se0.apply(this, arguments); };

  /* failed save → the form comes back as it was (10416's sheetBack(snapshot), replaced by 794's no-argument version) */
  const sb0 = window.sheetBack;
  window.sheetBack = function(sn){
    if(sn && typeof sn === 'object' && typeof sn.html === 'string'){ ALLOW = 1;
      try{ window.openSheet(sn.html); const x = sh(), b = bd(); if(sn.wide && x) x.classList.add('wide');
        if(b){ [...b.querySelectorAll('input,textarea,select')].forEach((el, k) => { if(!sn.vals || k >= sn.vals.length) return; if(el.type === 'checkbox' || el.type === 'radio') el.checked = sn.vals[k]; else if(el.type !== 'file') el.value = sn.vals[k]; });
          [...b.querySelectorAll('details')].forEach((d, k) => { if(sn.open && k < sn.open.length) d.open = sn.open[k]; });
          b.querySelectorAll('button[disabled]').forEach(btn => { btn.disabled = false; if(/Saving|Sending/.test(btn.textContent)) btn.textContent = 'Try again'; }); }
      }catch(e){ console.warn('841 sheetBack', e); } finally { ALLOW = 0; }
      return; }
    return sb0 ? sb0.apply(this, arguments) : window.closeSheet(); };
})();
</script>` + s.slice(i);
fs.writeFileSync(file, s);
lib(file, []);
