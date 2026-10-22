// 22 Oct · Misty: editing an enrolled student (e.g. only adding the email) showed the whole Enrollment block and
// "Save enrollment". Now: a filled Enrollment folds into one line with Edit (like Student and Trial class); the button says
// what will be saved ("Save email", "Save changes", or "Nothing changed yet"); an email-only change saves just the email
// (no DATABASE write).
require('../tools/lib.js')(process.argv[2], [
["    if(newRow){ const d = b.querySelector('#sEnr'); if(d && !d.open){ d.open = true; try{ stuBtn(0); }catch(x){} } } };",
 "    if(newRow){ const d = b.querySelector('#sEnr'); if(d && !d.open){ d.open = true; try{ stuBtn(0); }catch(x){} } } else foldEnr(b);\n    snap(b); };"],
["/* 566 · student form: fill what the app already knows, show only what is missing */",
`/* 576 · enrollment folded when filled; the save button says what will be saved */
const EF = [['sFc', 'First class', 'd'], ['sLs', 'lessons'], ['sCb', ''], ['sFr', 'free'], ['sRc', 'Recommended', 'd'], ['sEnd', 'Ended', 'd']];
let SNAP = null;
const fdate = v => { const d = new Date(String(v).slice(0, 10) + 'T00:00:00'); return isNaN(d) ? v : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); };
function foldEnr(b){ const d = b.querySelector('#sEnr'), fc = b.querySelector('#sFc'); if(!d || !fc || !String(fc.value || '').trim() || d.dataset.f) return; d.dataset.f = 1; d.open = true;
  const tip = [...d.children].find(x => x.tagName === 'DIV' && /Leave this closed/.test(x.textContent)); if(tip) tip.style.display = 'none';
  const have = EF.filter(([id]) => { const el = b.querySelector('#' + id); return el && String(el.value || '').trim() && !(id === 'sFr' && +el.value === 0); });
  have.forEach(([id]) => { const g = b.querySelector('#' + id).closest('.grow'); if(g) g.classList.add('sf-h'); });
  d.querySelectorAll('.row').forEach(r => { const g = [...r.children]; if(g.length && g.every(x => x.classList.contains('sf-h'))) r.classList.add('sf-h'); });
  const txt = have.map(([id, l, t]) => { const v = String(b.querySelector('#' + id).value).trim(); return t === 'd' ? (l === 'First class' ? 'From ' : l + ' ') + fdate(v) : l === 'lessons' ? v + ' lessons' : l === 'free' ? '+' + v + ' free' : v; });
  const sm = d.querySelector('summary'); sm.insertAdjacentHTML('afterend', '<div class="sf-sum" id="sfEnr"><div>' + txt.map((x, i) => '<span>' + e(x) + '</span>').join('<i>\\u00b7</i>') + '</div><button type="button" class="btn ghost sm" onclick="sfOpenEnr()">Edit</button></div>'); }
window.sfOpenEnr = () => { const b = document.getElementById('sheetBody'), s = document.getElementById('sfEnr'); if(!b || !s) return; b.querySelectorAll('#sEnr .sf-h').forEach(x => x.classList.remove('sf-h')); s.remove(); };
const FORM_IDS = ['sEn', 'sCn', 'sBirth', 'sGender', 'sGrade', 'sCity', 'sSrc', 'sMail', 'sTd', 'sTt', 'sTb', 'sTc', 'sTe', 'sFc', 'sLs', 'sCb', 'sFr', 'sRc', 'sEnd'];
function changed(b){ if(!SNAP) return null; return FORM_IDS.filter(id => { const el = b.querySelector('#' + id); return el && String(el.value || '').trim() !== (SNAP[id] || ''); }); }
function label(){ const b = document.getElementById('sheetBody'), go = b && b.querySelector('#sGo'); if(!go || !SNAP || go.disabled) return; const c = changed(b) || [];
  go.textContent = !c.length ? 'Nothing changed yet' : c.length === 1 && c[0] === 'sMail' ? 'Save email' : 'Save changes'; go.style.opacity = c.length ? '' : '.55'; }
function snap(b){ if(!/saves into this row/.test(b.textContent)) return; SNAP = {}; FORM_IDS.forEach(id => { const el = b.querySelector('#' + id); if(el) SNAP[id] = String(el.value || '').trim(); });
  const mail = b.querySelector('#sMail'); if(mail && !mail.value && mail.dataset.o) SNAP.sMail = mail.dataset.o;
  if(!b.dataset.sfl){ b.dataset.sfl = 1; b.addEventListener('input', () => setTimeout(label, 0)); b.addEventListener('change', () => setTimeout(label, 0)); }
  setTimeout(() => { const m = b.querySelector('#sMail'); if(m && SNAP && !SNAP.sMail) SNAP.sMail = String(m.value || '').trim(); label(); }, 1300); label(); }
/* 566 · student form: fill what the app already knows, show only what is missing */`],
["    return _s.apply(this, arguments); }; })();",
 `    try{ const b = document.getElementById('sheetBody'), c = b && row ? changed(b) : null;
      if(c && !c.length) return tst('Nothing changed yet');
      if(c && c.length === 1 && c[0] === 'sMail' && PEND){ const P = PEND, cd = P.code || code; PEND = null; const go = b.querySelector('#sGo'); if(go){ go.disabled = true; go.textContent = 'Saving\\u2026'; }
        return call('contact_set', { code: cd, email: P.email }).then(() => { EM[cd] = P.email; delete BC[cd]; try{ mailChip.at = 0; }catch(x){} SNAP = null; try{ closeSheet(); }catch(x){} tst(P.email ? 'Email saved \\u00b7 ' + P.email : 'Email removed'); try{ if(typeof STU !== 'undefined' && STU && STU.code === cd) mailChip(); }catch(x){} })
          .catch(err => { if(go){ go.disabled = false; go.textContent = 'Save email'; } tst('Email not saved: ' + err.message); }); } }catch(x){}
    return _s.apply(this, arguments); }; })();`],
]);
