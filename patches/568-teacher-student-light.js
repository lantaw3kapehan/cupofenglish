// 22 Oct · Misty: teachers see only what is relevant to teaching on their student's page, light and simple, so students
// can't be poached. The server (coe and Apps Script tStudent) now sends teachers only the teaching columns of DATABASE;
// here the long DATABASE "Profile" becomes a short "About" card for teachers (age, grade, gender, class length, CEFR & books,
// trial), and "lessons left" is not shown to teachers. Management sees everything as before.
require('../tools/lib.js')(process.argv[2], [
["\n</body>", `
<script>
/* 568 · teacher's view of a student: only what helps teaching */
(function(){
  const KEEP = /^(AGE|GENDER|SCHOOL GRADE|TRIAL CLASS · (DATE|BOOK|CEFR|TEACHER)|ENROLLMENT · (LENGTH|CEFR & BOOKS))$/i;
  const LBL = { 'AGE': 'Age', 'GENDER': 'Gender', 'SCHOOL GRADE': 'School grade', 'ENROLLMENT · LENGTH': 'Class length', 'ENROLLMENT · CEFR & BOOKS': 'CEFR & books' };
  const isT = () => { try{ return !!(D && !D.mgr); }catch(e){ return false; } };
  const _p = window.dbProfile;
  if(typeof _p === 'function') window.dbProfile = function(P){
    if(!isT()) return _p.apply(this, arguments);
    if(!P || !Array.isArray(P.head)) return '';
    const f = [], tr = [];
    P.head.forEach((k, j) => { k = String(k || '').trim(); let v = String(P.row && P.row[j] == null ? '' : P.row[j]).trim(); if(!v || !KEEP.test(k) || /^#/.test(v) || v === 'FALSE') return;
      if(/^TRIAL CLASS/i.test(k)){ if(/DATE/i.test(k)){ const d = new Date(v.slice(0, 10) + 'T00:00:00'); if(!isNaN(d)) v = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); } tr.push(v); return; }
      if(/AGE/i.test(k) && /^\\d+$/.test(v)) v += ' yrs old';
      f.push([LBL[k.toUpperCase()] || k, v]); });
    if(!f.length && !tr.length) return '';
    return '<h2>About</h2><div class="facts">' + f.map(([k, v]) => '<div><span>' + esc(k) + '</span><b>' + esc(v) + '</b></div>').join('') + (tr.length ? '<div class="wide"><span>Trial class</span><b>' + esc(tr.join(' · ')) + '</b></div>' : '') + '</div>'; };
  document.head.insertAdjacentHTML('beforeend', '<style>#sheetBody.tview .kpis>div:first-child{display:none}</style>');
  const mark = () => { const b = document.getElementById('sheetBody'); if(b) b.classList.toggle('tview', isT()); };
  const _r = window.stuRender; if(typeof _r === 'function') window.stuRender = function(){ mark(); const r = _r.apply(this, arguments); mark(); return r; };
})();
</script>

</body>`],
]);
