/* 2070 (11 Nov, Misty: "LET US DO ALL NOW"): the App health box comes from the database's own checks (docs mgmt:dbHealth, made every
   5 minutes by coe_health: the daily fix-guard checks + the 5-minute watch + slow app screens). Google is no longer asked. */
(function(){
  if(window.__2070) return; window.__2070 = 1;
  async function dbHealth(tok){
    const r = await fetch(FAST_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'docs', token: tok, keys: ['mgmt:dbHealth|[]'] }) }).then(x => x.json());
    const d = r && r.ok && r.docs && r.docs['mgmt:dbHealth|[]'];
    if(!d || !d.data) throw { msg: 'Health not available' };
    return d.data; }
  const wrap = base => { const w = function(fn){ const a = Array.prototype.slice.call(arguments, 1);
      if(fn === 'mgmtHealth' && a[0] && typeof TOKEN !== 'undefined' && a[0] === TOKEN) return dbHealth(a[0]);
      return base.apply(this, arguments); };
    for(const k in base) try{ w[k] = base[k]; }catch(e){} w.__2070 = 1; return w; };
  if(typeof window.api === 'function') window.api = wrap(window.api);
  if(typeof window.apiNow === 'function') window.apiNow = apiNow = wrap(window.apiNow);
  /* the box keeps its other parts (visits, coverage…): the Google-only lines (Google allowance, warm-up, Google time, sign-in mail
     count, yearly archive) are left out when the answer comes from the database */
  const GOOGLE_ONLY = /<div>(Background warm-up|Background time today|Sign-in emails left today|Yearly archive)[\s\S]*?<\/div>/g;
  const old = window.hlHtml;
  if(typeof old === 'function') window.hlHtml = function(){
    if(typeof HL === 'undefined' || !HL || !HL.db) return old.apply(this, arguments);
    HL.issues = HL.issues || []; HL.warm = HL.warm || {}; HL.today = HL.today || { hours: 0, budget: 6, runs: 0 };
    let h = String(old.apply(this, arguments) || '');
    h = h.replace(/<div style="margin-top:8px"><div style="height:8px[\s\S]*?<\/span><\/div><\/div>/, '').replace(GOOGLE_ONLY, '');
    return h.replace('</summary>', '</summary><div class="small mute" style="margin-top:6px">Daily checks: ' + (HL.checks || 0) + ' · ' + (HL.ok ? 'all passing' : HL.issues.length + ' to look at') + '</div>'); };
})();
