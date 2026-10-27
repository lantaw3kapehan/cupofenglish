// 1290: (Misty, 27 Oct 12:35 "do all") "Checking the package…" before Enrolled · paid / Renewed · paid took 13–18 s (Google reads
//   ACTIVE incl. the column-J SALES links, SALES and DATABASE). Google now copies exactly those into the database (paste PKGLINK27,
//   every ~2 min and right after every paid save) and the edge function coe-pkc answers the same check from it in well under a second
//   (compared with Google's own answers for every ACTIVE student before release: identical).
//   · The database answer is used only when the copy is under 5 minutes old and no Enrolled/Renewed · paid save is waiting or
//     finished after the copy; otherwise the app waits for Google exactly as before.
//   · Google's check still runs every time in the background. If its answer differs from the database's, Google's answer replaces
//     it at once (the open form is refreshed from Google's answer) — Google always wins. A Google error never overrides.
//   · The save itself is unchanged (Google's duplicate guard still runs on every save).
const fs = require('fs'), file = process.argv[2];
require('../tools/lib.js')(file, [
  ["const p = Promise.all([api('mgmtRenewPaid', TOKEN, { code, teacher, dry: true, date: today }).catch(e => ({ ok: false, msg: String(e && e.message || e) })), api('mgmtStuClasses', TOKEN, code).catch(() => null)]);",
   "const g = api('mgmtRenewPaid', TOKEN, { code, teacher, dry: true, date: today }).catch(e => ({ ok: false, msg: String(e && e.message || e), gerr: 1 })), sc = api('mgmtStuClasses', TOKEN, code).catch(() => null), d = window.pkcDb ? pkcDb('renew', { code, teacher, date: today }) : Promise.resolve(null);   /* 1290 */\n  const p = Promise.all([d.then(x => x || g), sc]); if(window.pkcVerify) pkcVerify('renew', k, d, g, sc);"],
  ["const p = api('mgmtEnrolPaid', TOKEN, { code: k, dry: true }).catch(e => ({ ok: false, msg: String((e && (e.msg || e.message)) || e) })); ENPRE[k] = { t: Date.now(), p: p };",
   "const g = api('mgmtEnrolPaid', TOKEN, { code: k, dry: true }).catch(e => ({ ok: false, msg: String((e && (e.msg || e.message)) || e), gerr: 1 })), d = window.pkcDb ? pkcDb('enrol', { code: k }) : Promise.resolve(null), p = d.then(x => x || g); if(window.pkcVerify) pkcVerify('enrol', k, d, g); ENPRE[k] = { t: Date.now(), p: p };   /* 1290 */"]]);
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 1290 · package check from the database (coe-pkc); Google verifies behind and wins */
(function(){
  if(window.__1290) return; window.__1290 = 1;
  window.pkcDb = function(op, body){
    try{ if(typeof D === 'undefined' || !D || !D.mgr || typeof TOKEN === 'undefined' || !TOKEN) return Promise.resolve(null); }catch(e){ return Promise.resolve(null); }
    const ac = window.AbortController ? new AbortController() : null, tid = ac ? setTimeout(() => ac.abort(), 3000) : 0;
    return fetch(FAST_URL + '-pkc', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(Object.assign({ token: TOKEN, op: op }, body || {})), signal: ac ? ac.signal : undefined })
      .then(r => r.json()).then(r => (r && r.src === 'db') ? r : null).catch(() => null).finally(() => clearTimeout(tid)); };
  const keyR = o => o && JSON.stringify([!!o.ok, o.msg || '', o.row, o.left, o.teacher, o.name, o.month, o.prev, o.pkg, o.free, o.method, o.partner, o.deadline, o.total]);
  const keyE = o => o && JSON.stringify([!!o.ok, o.msg || '', o.name, o.cn, o.firstClass, o.dbRow, o.sales]);
  window.pkcVerify = function(op, k, d, g, sc){
    Promise.all([d, g]).then(([x, y]) => {
      if(!x || !y || y.gerr) return;                      /* database not used, or Google could not answer: nothing to correct */
      if((op === 'renew' ? keyR : keyE)(x) === (op === 'renew' ? keyR : keyE)(y)) return;
      console.warn('1290 package check: Google differs, using Google', op, k, x, y);
      if(op === 'renew'){ RP_PRE[k] = { t: Date.now(), p: Promise.all([Promise.resolve(y), sc]) };
        try{ if(typeof RPS !== 'undefined' && RPS && String(RPS.code).toUpperCase() === k && $('rpS') && !/Saving/.test($('rpS').textContent)){ renPaidSheet(RPS.code, RPS.name, RPS.teacher, RPS.again); toast('Updated from Google'); } }catch(e){} }
      else { ENPRE[k] = { t: Date.now(), p: Promise.resolve(y) };
        try{ if(typeof ENS !== 'undefined' && ENS && String(ENS.code).toUpperCase() === k && $('enPay') && !$('enSaving')){ if(!ENS.touched && !ENS.tr){ enSheet(ENS.code, ENS.name, ENS.teacher); toast('Updated from Google'); } else toast('SALES changed while you were filling this in · close and open Enrolled · paid again'); } }catch(e){} }
    }).catch(() => {}); };
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
