// 840: Student page header age chip (audit #2, ST-2026-105 "Age ? · add birthdate" while Profile showed the birthdate).
// Cause: the chip (356, coeAge) read DATABASE › BIRTHDATE (col F) and only understood "2015-03-12" and "12-Mar-2015".
// DATABASE shows some birthdates as the sheet formats them, "April//2018" (month and year only), so the chip said "Age ?".
// Teachers never get BIRTHDATE (server teacherSafe keeps AGE only), so for them the chip always said "Age ? · add birthdate"
// and offered an Edit they cannot use.
// Now (display only, nothing stored changes, no day or month is invented):
// · full date → exact age, as before
// · month + year ("April//2018", "April 2018", "Apr-2018") → exact age, except in the birth month itself → "7–8 yrs"
// · year only ("2018") → "7–8 yrs"
// · Excel day numbers (e.g. 43191) → read as the date they stand for
// · no birthdate but the sheet's AGE column has a number (teachers) → that age, labelled "from DATABASE › AGE"
// · nothing at all → management: "Age ? · add birthdate" (opens Edit details, as before); teachers: "Age not recorded" (no link)
// · Profile tab: a month-year birthdate reads "April 2018" instead of "April//2018".
const lib = require('../tools/lib.js'), fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 840 · Age chip on the student page: reads month-year / year-only / Excel birthdates and the AGE column; never invents a day */
(function(){
  if(window.__840) return; window.__840 = 1;
  const up = x => String(x || '').trim().toUpperCase();
  const MON = ['january','february','march','april','may','june','july','august','september','october','november','december'];
  const mIdx = t => { t = String(t || '').toLowerCase(); if(t.length < 3) return -1; return MON.findIndex(m => m.indexOf(t) === 0 || t.indexOf(m) === 0); };
  /* → { y, m (1-12 or 0), d (1-31 or 0), txt } — m/d are 0 when the sheet does not show them */
  function parseBirth(v){
    if(v == null) return null; if(typeof v === 'number' || /^\d{5}(\.\d+)?$/.test(String(v).trim())){ const n = +v; if(n > 20000 && n < 80000){ const t = new Date(Date.UTC(1899, 11, 30) + Math.floor(n) * 864e5); return { y: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate() }; } return null; }
    const raw = String(v).trim(); if(!raw) return null; let m;
    if((m = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/))) return { y: +m[1], m: +m[2], d: +m[3] };
    if((m = raw.match(/^(\d{1,2})[-\s\/.]+([A-Za-z]{3,})[-\s\/.,]+(\d{4})$/))){ const k = mIdx(m[2]); if(k > -1) return { y: +m[3], m: k + 1, d: +m[1] }; }
    if((m = raw.match(/^([A-Za-z]{3,})\.?\s+(\d{1,2}),?\s+(\d{4})$/))){ const k = mIdx(m[1]); if(k > -1) return { y: +m[3], m: k + 1, d: +m[2] }; }
    if((m = raw.match(/^([A-Za-z]{3,})[\s\/.,-]*(\d{4})$/))){ const k = mIdx(m[1]); if(k > -1) return { y: +m[2], m: k + 1, d: 0 }; }
    if((m = raw.match(/^(\d{4})[-\/.](\d{1,2})$/))) return { y: +m[1], m: +m[2], d: 0 };
    if((m = raw.match(/^(\d{4})$/))) return { y: +m[1], m: 0, d: 0 };
    return null; }
  window.coeParseBirth = parseBirth;
  const MS3 = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const birthTxt = b => !b ? '' : b.d ? b.d + ' ' + MS3[b.m - 1] + ' ' + b.y : b.m ? MON[b.m - 1].replace(/^./, c => c.toUpperCase()) + ' ' + b.y : String(b.y);
  /* age range on Manila's date: lo = hi when the known parts decide it */
  function ageRange(b){ if(!b || !b.y) return null; const t = new Date(Date.now() + 8 * 3600e3), y = t.getUTCFullYear(), mo = t.getUTCMonth() + 1, d = t.getUTCDate();
    let lo, hi; const a = y - b.y;
    if(!b.m){ lo = a - 1; hi = a; }
    else if(mo > b.m){ lo = hi = a; } else if(mo < b.m){ lo = hi = a - 1; }
    else if(!b.d){ lo = a - 1; hi = a; } else { lo = hi = d >= b.d ? a : a - 1; }
    lo = Math.max(0, lo); if(hi < 0 || hi >= 100) return null; return { lo, hi }; }
  function rowOf(code){ const c = up(code);
    const r = ((typeof DB !== 'undefined' && DB && DB.rows) || []).find(x => up(x[0]) === c); if(r) return { r, head: (typeof DB !== 'undefined' && DB && DB.head) || null };
    const p = typeof STU !== 'undefined' && STU && STU.r && STU.r.profile; if(p && Array.isArray(p.row) && up(p.row[0]) === c) return { r: p.row, head: p.head || null };
    return null; }
  function col(head, re, dflt){ if(Array.isArray(head)){ const j = head.findIndex(h => re.test(String(h || '').trim())); if(j > -1) return j; } return dflt; }
  const _ca = window.coeAge;
  window.coeAge = function(code){
    try{ const o = rowOf(code); if(!o) return _ca ? _ca.apply(this, arguments) : null; const r = o.r;
      const b = parseBirth(r[col(o.head, /^BIRTHDATE$/i, 5)]), R = ageRange(b);
      const base = { grade: String(r[8] || '').trim(), en: String(r[2] || '').trim(), cn: String(r[1] || '').trim(), known: true };
      if(R) return Object.assign(base, { age: R.lo, ageHi: R.hi, approx: R.lo !== R.hi, birth: b, birthTxt: birthTxt(b), from: 'birth' });
      const sa = String(r[col(o.head, /^AGE$/i, 6)] == null ? '' : r[col(o.head, /^AGE$/i, 6)]).trim();
      if(/^\d{1,2}$/.test(sa)) return Object.assign(base, { age: +sa, ageHi: +sa, approx: false, from: 'sheet' });
      return Object.assign(base, { age: null, from: '' });
    }catch(e){ return _ca ? _ca.apply(this, arguments) : null; } };
  const isMgr = () => !!(typeof D !== 'undefined' && D && D.mgr);
  /* the chip itself is drawn by 356 and tidied by 578; 840 sets its words and title afterwards */
  function fixChip(){ try{ if(typeof STU === 'undefined' || !STU || !STU.code) return; const hero = document.querySelector('#sheetBody .shero'); if(!hero) return;
    const el = hero.querySelector('.age-chip'); if(!el) return; const a = coeAge(STU.code); if(!a) return;
    const sv = el.querySelector('svg'); let txt, tip;
    if(a.age != null){
      txt = (a.approx ? a.age + '–' + a.ageHi : a.age) + ' yrs' + (a.grade ? ' · ' + a.grade : '');
      tip = a.from === 'sheet' ? 'Age from DATABASE › AGE' : 'Born ' + a.birthTxt + (a.birth && !a.birth.d ? (a.birth.m ? ' · the day is not recorded' : ' · the day and month are not recorded') + (a.approx ? ', so the age is shown as a range' : '') : '');
      el.classList.remove('q'); el.removeAttribute('onclick'); el.removeAttribute('role'); el.removeAttribute('tabindex');
    } else if(isMgr()){
      txt = 'Age ? · add birthdate'; tip = 'No birthdate in DATABASE · tap to open Edit details';
      el.setAttribute('role', 'button'); el.setAttribute('tabindex', '0');
      if(!el.dataset.k840){ el.dataset.k840 = 1; el.addEventListener('keydown', e => { if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); el.click(); } }); }
    } else { txt = 'Age not recorded'; tip = 'No birthdate or age in DATABASE'; el.removeAttribute('onclick'); el.style.cursor = 'default'; }
    if(el.dataset.t840 === txt + '|' + tip) return; el.dataset.t840 = txt + '|' + tip;
    el.textContent = txt; if(sv) el.prepend(sv); el.title = tip; }catch(e){} }
  const _sr = window.stuRender; if(_sr) window.stuRender = function(){ const r = _sr.apply(this, arguments); try{ fixChip(); [60, 500, 1600, 3200].forEach(ms => setTimeout(fixChip, ms)); }catch(e){} return r; };
  /* the chip can arrive after DATABASE loads (356 asks for it when the page opens first) */
  const _ld = window.loadDb; if(_ld) window.loadDb = function(){ const p = _ld.apply(this, arguments); try{ Promise.resolve(p).then(() => setTimeout(fixChip, 0), () => {}); }catch(e){} return p; };
  /* Profile tab: "April//2018" → "April 2018" (the day is not invented) */
  const _dp = window.dbProfile; if(_dp) window.dbProfile = function(){ const h = _dp.apply(this, arguments);
    try{ return String(h).replace(/(<dt>Birthdate<\/dt><dd>)([^<]*)(<\/dd>)/, (m0, a, v, c) => { const b = parseBirth(v.replace(/&amp;/g, '&')); return b && !b.d ? a + esc(birthTxt(b)) + c : m0; }); }catch(e){ return h; } };
})();
</script>` + s.slice(i);
fs.writeFileSync(file, s);
lib(file, []);
