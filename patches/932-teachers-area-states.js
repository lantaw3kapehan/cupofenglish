// 932: (audit 25 Oct, D3 · state handling, finding 18 accessibility) Loading / error states in the Teachers area that were
// stuck, misleading or used sheet names:
//  · Teachers › "Teacher details": when the teacher card could not load, the picker stayed on "Loading…" with grey bars forever
//    (only a toast "Could not load TEACHERS"). Now: "Could not load teacher details" + Try again; the picker says "Not loaded".
//    It stays after the list above repaints, and clears as soon as a new load starts.
//  · Teacher growth page (tap a teacher on Performance): a failed load left grey bars forever. Now a message + Try again.
//  · Management passwords (President only): any failed load said "Only the President can open this." — to the President.
//    Now the President sees "Could not load the list" + Try again; anyone else still sees "Only the President…".
//  · Leave / Cases: "Could not load leave." / "Could not load ACTIONS." → plain words + Try again (calls the same loader).
//  · Teacher Excellence: "Could not load (mgmtKpi)" showed an internal name; now plain words (the detail stays as a tooltip).
//  · Contracts / Notices panels (incl. "Send a notice of breach"): text boxes whose label is a separate line ("Teacher",
//    "Subject", "The rule", "The record"…) had no accessible name; they now carry that label (aria-label). Nothing is sent differently.
const lib = require('../tools/lib.js'), fs = require('fs'), file = process.argv[2];
lib(file, [
  ["catch(e){ toast('Could not load TEACHERS'); if($('ttBody')) $('ttBody').style.opacity = 1; }",
   "catch(e){ toast('Could not load teacher details'); if($('ttBody')) $('ttBody').style.opacity = 1; }"],
  ["grmPaint(); }); }catch(e){ toast('Could not load growth'); }",
   "grmPaint(); }); }catch(e){ toast('Could not load growth');\n"
   + "  if(window._grmN === name && $('sheet').classList.contains('on') && !$('sheetBody').querySelector('.seg')) $('sheetBody').innerHTML = '<h1>' + esc(tName(name)) + '</h1><div class=\"empty\" role=\"alert\">Could not load this teacher\\u2019s page. <button class=\"btn ghost sm\" onclick=\"growthSheet(\\'' + esc(name) + '\\')\">Try again</button></div>'; }"],
  ["if(!r || !r.ok){ $('sheetBody').innerHTML = '<h1>Management passwords</h1><div class=\"empty\">Only the President can open this.</div>'; return; }",
   "if(!r || !r.ok){ $('sheetBody').innerHTML = '<h1>Management passwords</h1><div class=\"empty\" role=\"alert\">' + (isPres() ? 'Could not load the list. <button class=\"btn ghost sm\" onclick=\"mgPwList()\">Try again</button>' : 'Only the President can open this.') + '</div>'; return; }"],
  ["$('v-leave').innerHTML = '<div class=\"empty\">Could not load leave.</div>';",
   "$('v-leave').innerHTML = '<div class=\"empty\" role=\"alert\">Could not load leave. <button class=\"btn ghost sm\" onclick=\"loadLeave()\">Try again</button></div>';"],
  ["$('v-actions').innerHTML = '<div class=\"empty\">Could not load ACTIONS.</div>';",
   "$('v-actions').innerHTML = '<div class=\"empty\" role=\"alert\">Could not load cases. <button class=\"btn ghost sm\" onclick=\"loadActions()\">Try again</button></div>';"],
  ['el.innerHTML = `<p class="mute">Could not load (${esc(d.err)}). Try again in a minute.</p>`;',
   'el.innerHTML = `<p class="mute" role="alert" title="${esc(d.err)}">Could not load the scores. Try again in a minute.</p>`;'],
]);
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
if (i < 0) { console.error('no </body>'); process.exit(1); }
s = s.slice(0, i) + String.raw`<script>
/* 932 · Teachers area: teacher details error state, labels in the Contracts / Notices panels */
(function(){ if(window.__932) return; window.__932 = 1;
  function ttErr(){ const b = document.getElementById('ttBody'); if(!b || (typeof TT !== 'undefined' && TT) || !window._ttErr) return;
    b.style.opacity = 1; b.innerHTML = '<div class="empty" role="alert">Could not load teacher details. <button class="btn ghost sm" onclick="loadTT()">Try again</button></div>';
    const n = document.getElementById('ttN'); if(n){ n.innerHTML = '<option>Not loaded</option>'; n.disabled = true; } }
  const _l = window.loadTT;
  if(typeof _l === 'function') window.loadTT = async function(){ window._ttErr = 0; const n = document.getElementById('ttN'); if(n) n.disabled = false;
    const r = await _l.apply(this, arguments); try{ if(typeof TT === 'undefined' || !TT){ window._ttErr = 1; ttErr(); } }catch(x){} return r; };
  const _r = window.renderTeachers;
  if(typeof _r === 'function') window.renderTeachers = function(){ const r = _r.apply(this, arguments); try{ ttErr(); }catch(x){} return r; };
  /* label text boxes in the Contracts / Notices panels from the line above them */
  function lab(){ const b = document.getElementById('sheetBody'); if(!b || !b.querySelector('.ct')) return;
    b.querySelectorAll('.ct input,.ct select,.ct textarea').forEach(x => { if(x.type === 'hidden' || x.getAttribute('aria-label') || x.getAttribute('aria-labelledby') || x.closest('label')) return;
      if(x.id && b.querySelector('label[for="' + x.id + '"]')) return;
      let p = x.previousElementSibling; if(!p && x.parentElement) p = x.parentElement.previousElementSibling;
      const t = p && /\blab\b|\blbl\b|\blabel\b/.test(p.className || '') ? p.textContent.trim() : '';
      if(t) x.setAttribute('aria-label', t.slice(0, 120)); }); }
  let q = 0; const mo = new MutationObserver(() => { if(q) return; q = requestAnimationFrame(() => { q = 0; try{ lab(); }catch(x){} }); });
  (function w(){ const b = document.getElementById('sheetBody'); if(b) mo.observe(b, { childList: true, subtree: true }); else setTimeout(w, 1500); })();
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
