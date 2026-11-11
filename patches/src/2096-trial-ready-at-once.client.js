/* 2096 (11 Nov 20:39, Misty: trials stuck on "Report being made" · "needs to be fast … parents informed right away").
   Since 2065 the trial report is made in the app at once (no Google PDF), but the list still waited for a PDF, so a report with its
   Chinese stayed under "Being made" and never reached "To send". Now: Chinese ready → "To send" straight away; Chinese not ready yet →
   "Adding Chinese". The database also fills the trial's Chinese the moment the reviewed Chinese is saved (migration 2096). */
(function(){
  if(window.__tr2096) return; window.__tr2096 = 1;
  const fix = r => { try{ const rows = r && (r.rows || (r.data && r.data.rows)); if(!Array.isArray(rows)) return r;
      rows.forEach(x => { if(!x || x.sent || x.pdf || x.redo || !x.label) return; if(x.status !== 'Making PDF' && x.status !== 'Translating') return;
        x.status = ((x.comm && !x.commZh) || (x.next && !x.nextZh)) ? 'Translating' : 'Ready'; }); }catch(e){} return r; };
  const a0 = window.api;
  if(typeof a0 === 'function') window.api = function(fn){ const p = a0.apply(this, arguments); return fn === 'mgmtTrials' && p && typeof p.then === 'function' ? p.then(fix) : p; };
  try{ if(typeof TRL !== 'undefined' && TRL) fix(TRL); }catch(e){}
})();
