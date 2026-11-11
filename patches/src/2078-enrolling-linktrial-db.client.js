/* 2078 (11 Nov, Misty: "MOVE THEM ALL AND SWITCH OFF"). Two saves that still went straight to Google now go to the database like the rest:
   · a trial follow-up "Enrolling" (shown as "Following up · said yes, enrolling"; the referral lesson is given by the database's own job)
   · a student record saved with "link this trial" (the trial gets the student code in the database).
   If the database cannot be reached, fastWrite falls back to Google once, as for every other save. */
(function(){
  if(window.__2078) return; window.__2078 = 1;
  const base = window.api; if(typeof base !== 'function') return;
  const w = function(fn){ const a = Array.prototype.slice.call(arguments, 1);
    if(!window.__dbfGoogle2078 && typeof fastWrite === 'function' && typeof TOKEN !== 'undefined' && TOKEN && a[0] === TOKEN && typeof D !== 'undefined' && D && D.mgr){
      if(fn === 'mgmtTrialFu' && a[2] === 'Enrolling') return fastWrite(fn, a);
      if(fn === 'saveStudent' && a[1] && a[1].linkTrial && /^ST-\d{4}-\d{3}$/.test(String(a[1].code || '').trim())) return fastWrite(fn, a); }
    return base.apply(this, arguments); };
  for(const k in base) try{ w[k] = base[k]; }catch(e){} w.__2078 = 1; window.api = w;
})();
