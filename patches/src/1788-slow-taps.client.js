<script>
/* 1788 · slow management taps from the database (coe-taps, coe-mgmt, coe); Google only when the database cannot answer
   · mgmtReport (parent report sheet): the REPORT FILES row + that month's feedback (coe-taps). A report sent / returned since the row
     was last copied, or feedback the sheet copy does not agree with → Google, as before.
   · mgmtHealth (App health box): Google's own last health answer, read straight from the database (no batch wait). When it is older
     than 30 min this device asks Google behind (at most every 30 min, as before; ↻ asks at once) and the box redraws when it lands.
   · mgmtTeacherCard: the database card (coe-mgmt) at once, without waiting first for the stored Google copy. If the database is slow
     (over 2.5 s) and this page already has that card, the card it has is shown and the new one replaces it in memory when it lands.
   · mgmtStudents: when the app would go to Google because no database copy came back, the database works the list out first (coe "students").
     Straight after a save the app still asks Google, as before. */
(function(){
  const base = window.api, an = window.apiNow; if(!base || base.__1788 || typeof an !== 'function') return;
  const TAPS = 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-taps', MGMT = 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-mgmt', M = 6e4;
  const post = (url, body, ms) => { const ac = window.AbortController ? new AbortController() : null, tid = ac ? setTimeout(() => ac.abort(), ms) : 0;
    return fetch(url, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(body), signal: ac ? ac.signal : undefined }).then(x => x.json()).finally(() => clearTimeout(tid)); };
  const mine = a => typeof D !== 'undefined' && D && D.mgr && typeof LIVE !== 'undefined' && LIVE && typeof TOKEN !== 'undefined' && a[0] && a[0] === TOKEN;
  const google = (self, fn, a) => an.apply(self, [fn].concat(a));   /* Google itself (the calls below already tried the database) */
  let rf = 0; document.addEventListener('click', ev => { try{ if(ev.target && ev.target.closest && ev.target.closest('#rf')) rf = Date.now(); }catch(e){} }, true);
  /* parent report */
  function report(self, a){ const g = () => google(self, 'mgmtReport', a);
    return post(TAPS, { token: a[0], op: 'report', key: a[1] }, 6000).then(r => (r && r.ok && r.data && r.data.report && r.data.report.key === a[1]) ? r.data : g(), g); }
  /* App health */
  let HM = null, gAt = 0, hBusy = 0;
  const copy = x => JSON.parse(JSON.stringify(x));
  function healthBehind(self, a){ if(hBusy || Date.now() - gAt < (Date.now() - rf < 5000 ? M : 30 * M)) return; gAt = Date.now(); hBusy = 1;
    const u = window._ui; window._ui = 0; let p; try{ p = google(self, 'mgmtHealth', a); }finally{ window._ui = u; }
    Promise.resolve(p).then(x => { hBusy = 0; if(x == null || x.error) return; const was = HM ? JSON.stringify(HM.d) : ''; HM = { t: Date.now(), d: x };
      if(was !== JSON.stringify(x) && typeof window.loadHealth === 'function') setTimeout(() => { try{ window.loadHealth(); }catch(e){} }, 50); }, () => { hBusy = 0; }); }
  function health(self, a){ const fb = () => base.apply(self, ['mgmtHealth'].concat(a));
    if(HM && Date.now() - HM.t < 30 * M && Date.now() - rf > 5000) return Promise.resolve(copy(HM.d));
    return post(TAPS, { token: a[0], op: 'health' }, 5000).then(r => { if(!(r && r.ok && r.data != null)) return fb();
      const at = Date.parse(r.at) || 0; if(Date.now() - at > 30 * M || Date.now() - rf < 5000) healthBehind(self, a);
      return HM && HM.t > at ? copy(HM.d) : r.data; }, fb); }
  /* teacher card */
  const TC = {}; let cardBad = 0;
  const okCard = d => d && d.name && Array.isArray(d.options) && d.options.length && d.me && Array.isArray(d.attend);
  function card(self, a){ const nm = String(a[1] || ''), force = !!a[2], k = TC[nm], g = () => google(self, 'mgmtTeacherCard', a);
    if(k && !force && Date.now() - k.t < 20000) return Promise.resolve(k.d);
    if(!k && Date.now() - cardBad < M) return g();   /* the database just failed: no second wait */
    const dbp = post(MGMT, { op: 'teacherCard', name: nm, token: a[0] }, 9000).then(r => { const d = r && r.ok && r.data; if(!okCard(d)) throw new Error('no card');
      TC[nm] = TC[d.name] = { t: Date.now(), d }; try{ if(typeof TTC !== 'undefined' && TTC && TTC[d.name]) TTC[d.name] = d; }catch(e){} return d; });
    const safe = dbp.catch(() => { cardBad = Date.now(); return (k && Date.now() - k.t < 24 * 3600e3) ? k.d : g(); });
    if(!k || force) return safe;
    return Promise.race([safe, new Promise(z => setTimeout(() => z(null), 2500))]).then(x => x || k.d); }
  const w = function(fn){ const a = Array.prototype.slice.call(arguments, 1);
    try{ if(mine(a)){
      if(fn === 'mgmtReport' && typeof a[1] === 'string' && a[1]) return report(this, a);
      if(fn === 'mgmtHealth') return health(this, a);
      if(fn === 'mgmtTeacherCard') return card(this, a); } }catch(e){}
    return base.apply(this, arguments); };
  w.__1788 = 1; for(const k in base) try{ w[k] = base[k]; }catch(e){} window.api = w;
  /* the same for anything that asks Google directly; the students list when Google would be asked for want of a database copy */
  const n = function(fn){ const a = Array.prototype.slice.call(arguments, 1), self = this;
    try{ if(mine(a)){
      if(fn === 'mgmtReport' && typeof a[1] === 'string' && a[1]) return report(self, a);
      if(fn === 'mgmtTeacherCard') return card(self, a);
      if(fn === 'mgmtStudents' && a.length === 1 && typeof FAST_URL !== 'undefined' && !(typeof SB_LASTW !== 'undefined' && SB_LASTW && Date.now() - SB_LASTW < 120000)){
        const g = () => google(self, fn, a);
        return post(FAST_URL, { op: 'students', token: a[0] }, 8000).then(r => (r && r.ok && r.full && Array.isArray(r.data) && r.data.length) ? r.data : g(), g); } } }catch(e){}
    return an.apply(this, arguments); };
  for(const k in an) try{ n[k] = an[k]; }catch(e){}
  window.apiNow = apiNow = n;
})();
</script>
