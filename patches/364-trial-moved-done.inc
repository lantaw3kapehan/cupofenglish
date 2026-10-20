/* 20 Oct · 364 · A trial moved to another day still said "Write report" after the teacher sent it (Julia · Sheren: logged 16 Oct,
   taught and reported 19 Oct; the old rule matched the report only on the same date and name).
   The app asks the database for this teacher's trial reports (TR-DATA + reports sent in the app, last 60 days) and clears
   "Write report" when one is there for the same student (code or name) from 3 days before to 30 days after the logged date.
   Works on the teacher's own screen and in management's teacher view, whichever copy of the home screen is shown. */
(function(){
  let LIST = null, AT = 0, BUSY = 0;
  const add = (d, k) => new Date(Date.parse(d + 'T00:00:00Z') + k * 864e5).toISOString().slice(0, 10);
  function apply(){ if(!LIST || !D || !D.special) return; let ch = 0;
    D.special.forEach(x => { if(!x.reportMissing || !x.date) return; const lo = add(x.date, -3), hi = add(x.date, 30), c = String(x.code || '').trim().toUpperCase(), s = String(x.student || '').trim().toLowerCase();
      if(LIST.some(r => r.d >= lo && r.d <= hi && ((c && r.c === c) || (s && r.s === s)))){ x.reportMissing = false; ch = 1; } });
    if(ch){ try{ render(); }catch(e){} } }
  async function check(){ try{
    if(typeof D === 'undefined' || !D || D.mgr || !TOKEN || !(D.special || []).some(x => x.reportMissing)) return;
    if(LIST && Date.now() - AT < 5 * 6e4){ apply(); return; } if(BUSY) return; BUSY = 1;
    const r = await fetch(FAST_URL + '-trials', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, as: (D.me && D.me.name) || '' }) }).then(x => x.json());
    BUSY = 0; if(r && r.ok && Array.isArray(r.list)){ LIST = r.list; AT = Date.now(); apply(); } }catch(e){ BUSY = 0; } }
  const _r = window.render; if(_r) window.render = function(){ const o = _r.apply(this, arguments); setTimeout(check, 0); return o; };
})();
