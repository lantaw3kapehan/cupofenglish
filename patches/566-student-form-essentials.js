// 22 Oct · Misty: the student form for a student who is already in the app shows only what is missing.
// Known details are filled in (from the sheet row, or the app's database copy when the sheet row is not loaded, e.g. Abner)
// and folded into a one-line summary per section with "Edit"; only empty fields stay open. "New row for …" opens Enrollment.
require('../tools/lib.js')(process.argv[2], [
["const ob = new MutationObserver(() => { try{ addBtns(); }catch(x){} try{ addMail(); }catch(x){} });",
`/* 566 · student form: fill what the app already knows, show only what is missing */
const SF = { Student: [['sEn', 2], ['sCn', 1], ['sBirth', 5, 'd'], ['sGender', 7], ['sGrade', 8], ['sCity', 9], ['sSrc', 22], ['sMail']], 'Trial class': [['sTd', 10, 'd'], ['sTt', 11, 't'], ['sTb', 12], ['sTc', 13], ['sTe', 14]] };
const STU = {};
const fv = el => el ? String(el.value || '').trim() : '';
const setv = (el, v) => { v = String(v == null ? '' : v).trim(); if(!el || !v || fv(el) || el.dataset.t) return;
  if(el.tagName === 'SELECT'){ const o = [...el.options].find(x => x.value.trim().toLowerCase() === v.toLowerCase()); if(o) el.value = o.value; else { el.insertAdjacentHTML('beforeend', '<option>' + e(v) + '</option>'); el.value = v; } }
  else el.value = v; };
const nice = (id, el) => { const v = fv(el); if(!v) return ''; if(el.type === 'date'){ const d = new Date(v + 'T00:00:00'); return isNaN(d) ? v : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); } return v; };
function parts(b, id){ const el = b.querySelector('#' + id); if(!el) return []; const g = el.closest('.grow'); if(g) return [g];
  const out = [el]; let p = el.previousElementSibling; if(p && p.tagName === 'LABEL') out.unshift(p); const n = el.nextElementSibling; if(n && n.tagName === 'DATALIST') out.push(n); return out; }
function fold(b){
  [...b.querySelectorAll('h2')].forEach(h => { const F = SF[h.textContent.trim()]; if(!F || h.dataset.f) return;
    const have = F.filter(([id]) => fv(b.querySelector('#' + id)));
    if(!have.length) return; h.dataset.f = 1;
    have.forEach(([id]) => parts(b, id).forEach(n => n.classList.add('sf-h')));
    b.querySelectorAll('.row').forEach(r => { const g = [...r.children]; if(g.length && g.every(x => x.classList.contains('sf-h'))) r.classList.add('sf-h'); });
    const miss = F.length - have.length;
    h.insertAdjacentHTML('afterend', '<div class="sf-sum"><div>' + have.map(([id]) => '<span>' + e(nice(id, b.querySelector('#' + id))) + '</span>').join('<i>\\u00b7</i>') + '</div><button type="button" class="btn ghost sm" onclick="sfOpen(this)">Edit</button></div>' + (miss ? '<div class="small mute sf-miss">Still needed: ' + F.filter(([id]) => !fv(b.querySelector('#' + id))).map(([id]) => { const p = parts(b, id)[0], l = p && (p.tagName === 'LABEL' ? p : p.querySelector('label')); return l ? e(l.textContent.split('\\u00b7')[0].replace(/\\s+/g, ' ').trim()) : ''; }).filter(Boolean).join(', ') + '</div>' : ''));
  }); }
window.sfOpen = btn => { const s = btn.closest('.sf-sum'), h = s.previousElementSibling, b = document.getElementById('sheetBody'); const F = SF[h.textContent.trim()] || [];
  F.forEach(([id]) => parts(b, id).forEach(n => n.classList.remove('sf-h'))); b.querySelectorAll('.row.sf-h').forEach(r => { if([...r.children].some(x => !x.classList.contains('sf-h'))) r.classList.remove('sf-h'); });
  const m = s.nextElementSibling; if(m && m.classList.contains('sf-miss')) m.remove(); s.remove(); };
function essentials(){
  const b = document.getElementById('sheetBody'); if(!b || !b.querySelector('#sEn') || b.querySelector('#sEn').dataset.sf) return;
  try{ if(!(D && D.mgr)) return; }catch(x){ return; }
  const sub = [...b.querySelectorAll('.mute.small')].find(x => /DATABASE/.test(x.textContent)); if(!sub) return;
  const m = /saves into this row|New row for/.test(sub.textContent) ? sub.textContent.match(/ST-\\d{4}-\\d{3}/) : null; if(!m) return;
  const code = m[0], newRow = /New row for/.test(sub.textContent); b.querySelector('#sEn').dataset.sf = 1;
  if(!document.getElementById('sfCss')) document.head.insertAdjacentHTML('beforeend', '<style id="sfCss">#sheetBody .sf-h{display:none!important}.sf-sum{display:flex;align-items:center;gap:10px;margin:6px 0 4px;padding:12px 14px;border-radius:14px;background:var(--tint,#EEF7F8)}.sf-sum>div{flex:1;min-width:0;font-size:14px;line-height:1.6;color:#2E2650}.sf-sum>div i{font-style:normal;margin:0 6px;color:#9A97AE}.sf-sum>div span:first-child{font-weight:700}.sf-miss{margin:2px 2px 8px;color:#B8553D}</style>');
  const go = () => { if(!document.body.contains(b) || !b.querySelector('#sEn')) return; fold(b);
    const h1 = b.querySelector('h1'), nm = fv(b.querySelector('#sEn')) || fv(b.querySelector('#sCn')); if(newRow && h1 && nm && /^New student/.test(h1.textContent)){ h1.textContent = nm + ' \u00b7 enrollment'; sub.textContent = code + ' \u00b7 already in the app \u00b7 only what is missing is open below'; }
    if(newRow){ const d = b.querySelector('#sEnr'); if(d && !d.open){ d.open = true; try{ stuBtn(0); }catch(x){} } } };
  const fill = d => { if(!d) return; Object.values(SF).forEach(F => F.forEach(([id, i, t]) => { if(i == null) return; let v = d[i]; if(v == null || v === '') return; v = String(v);
    if(t === 'd') v = v.slice(0, 10); if(t === 't'){ const mm = v.match(/(\\d{1,2}):(\\d{2})/); v = mm ? mm[1].padStart(2, '0') + ':' + mm[2] : ''; } setv(b.querySelector('#' + id), v); })); };
  const need = !fv(b.querySelector('#sEn')) && !fv(b.querySelector('#sCn'));
  const mail = () => new Promise(r => { const el = b.querySelector('#sMail'); if(!el || fv(el)) return r(); let k = 0; const t = setInterval(() => { if(fv(el) || ++k > 12){ clearInterval(t); r(); } }, 100); });
  const db = need ? (STU[code] ? Promise.resolve(STU[code]) : call('stu', { code }).then(r => (STU[code] = r.data))).then(fill).catch(() => {}) : Promise.resolve();
  Promise.all([db, mail()]).then(() => setTimeout(go, 0)); }
const ob = new MutationObserver(() => { try{ addBtns(); }catch(x){} try{ addMail(); }catch(x){} try{ essentials(); }catch(x){} });`],
]);
