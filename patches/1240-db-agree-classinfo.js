// 1240: (Misty, 26 Oct 22:27 "all should be reading straight from Supabase") — two management screens that still waited on Google:
//   · Service agreement sheet (mgmtAgree): Google took ~13 s (49 waits in 2 days). Now from the database (coe-db op agree: S-AGREE,
//     ACTIVE, DATABASE copies) in well under a second. Checked against all 58 stored Google answers: same name, Chinese name, package,
//     city and agreement history (the only differences were rows saved after Google's copy, and a trailing space Google trims).
//   · Class sheet check-in details (mgmtClassInfo): Google took ~4 s (77 waits + 13 s errors). Now from the database (coe-db op classinfo:
//     T-TIMEIN with management's decisions, videos uploaded in the app). Checked against 233 stored answers: 73/74 "I'm in" and 124/125
//     time-in records identical; the 2 differences are decisions management made after Google's copy (the database has the newer one).
//   Google is still asked behind the screen, only to add what the database does not have (Drive-found videos, the student's folder link,
//   a save made seconds ago) — the sheet is redrawn only if Google's answer really differs, and never while you are tagging a class.
//   · Teacher's observation visits (tMyVisits): a stored copy up to 14 days old opens at once (as Growth since 1230), refreshed behind.
//   If the database does not answer within 4 s, everything works exactly as before (Google).
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 1240 · Service agreement + class check-in details from the database */
(function(){
  if(window.__1240 || typeof window.api !== 'function') return; window.__1240 = 1;
  /* teacher's observation visits: like Growth (1230), a stored copy up to 14 days old opens at once and is refreshed behind (13 waits of ~7 s in 2 days) */
  try{ if(typeof SB_UIAGE !== 'undefined' && !SB_UIAGE.tMyVisits) SB_UIAGE.tMyVisits = 14 * 864e5; }catch(e){}
  const API0 = window.api;
  const strip = r => { const o = Object.assign({}, r); delete o.ms; delete o.db; delete o.now; return o; };
  async function dbAsk(body){ try{ const ac = window.AbortController ? new AbortController() : null, tid = ac ? setTimeout(() => ac.abort(), 4000) : 0;
      const r = await fetch(FAST_URL + '-db', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(Object.assign({ token: TOKEN }, body)), signal: ac ? ac.signal : undefined }).then(x => x.json()).finally(() => clearTimeout(tid));
      return r && r.ok ? r : null; }catch(e){ return null; } }
  const google = (fn, args) => (typeof apiNow === 'function' ? apiNow(fn, ...args) : API0(fn, ...args));
  /* the class sheet: repaint with Google's extra details (video found in Drive, the student's folder) only when they differ */
  function ciLater(ev, dbr, g){ g.then(x => { try{
      if(!x || !x.ok || typeof CE === 'undefined' || !CE || !CE.e || CE.e.id !== ev.id || !$('ceMon')) return;
      if(JSON.stringify([x.ci || null, x.day || null, x.vid || null]) === JSON.stringify([dbr.ci || null, dbr.day || null, dbr.vid || null])) return;
      if((typeof TG !== 'undefined' && TG && TG.cond) || ($('tgN') && $('tgN').value)) return;   /* she is tagging: leave the sheet alone */
      const e = CE.e; if(x.ci) e.ci = x.ci; if(x.vid) e.vid = x.vid; $('ceMon').innerHTML = monHtml(e, x); TG = { kind: 'late', cond: '' };
    }catch(err){} }).catch(() => {}); }
  /* the agreement sheet: the same tidy-up agrOpen does with Google's answer, only when it differs */
  function agLater(q, dbr, g){ g.then(r => { try{
      if(!r || !r.ok || typeof AGS === 'undefined' || !AGS || AGS.code !== String(q.code || '').toUpperCase() || (AGS.key || '') !== (q.key || '')) return;
      if(JSON.stringify([r.name, r.cn, r.pkg, r.city || '', r.list || []]) === JSON.stringify([dbr.name, dbr.cn, dbr.pkg, dbr.city || '', dbr.list || []])) return;
      const nat = /philippin|manila|cebu|davao|pangasinan|urdaneta|\bPH\b/i.test(r.city || '') ? 'Philippines 菲律宾' : 'China 中国', ch = (r.name && r.name !== AGS.name) || (r.cn && r.cn !== AGS.cn) || (r.pkg && r.pkg !== AGS.pkg) || nat !== AGS.nat;
      Object.assign(AGS, { name: r.name || AGS.name, cn: r.cn || AGS.cn, pkg: r.pkg || AGS.pkg, list: r.list || AGS.list, city: r.city || '', nat });
      if($('sheet').classList.contains('on') && $('agImg')){ const nv = $('agN') ? $('agN').value : '', how = AGS.how; if(ch){ AGPIC = null; } agrPaint(); if($('agN')) $('agN').value = nv; if(how) AGS.how = how; if(ch) agrPic(); }
    }catch(err){} }).catch(() => {}); }
  window.api = function(fn, ...args){
    try{
      if(typeof LIVE !== 'undefined' && LIVE && typeof D !== 'undefined' && D && D.mgr && TOKEN){
        if(fn === 'mgmtClassInfo' && args[1] && args[1].id && args[1].start && args[1].teacher){ const ev = args[1];
          return dbAsk({ op: 'classinfo', ev: ev }).then(r => { if(!r) return API0(fn, ...args); const g = google(fn, args); ciLater(ev, r, g); const o = strip(r); return o; }); }
        if(fn === 'mgmtAgree' && args[1] && (args[1].code || args[1].key)){ const q = args[1];
          return dbAsk({ op: 'agree', code: q.code || '', key: q.key || '', name: q.name || '' }).then(r => { if(!r) return API0(fn, ...args); const g = google(fn, args); agLater(q, r, g); return strip(r); }); }
      }
    }catch(e){}
    return API0(fn, ...args); };
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
