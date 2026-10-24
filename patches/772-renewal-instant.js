// 772: (Misty) "Anna already renewed so this should be detected … every change that is interconnected should automate quickly too".
// · The moment a renewal is marked paid (or a renewal status is saved: reminder sent, renewing, paused, not renewing),
//   this phone/laptop updates its renewals list at once: To do, Overview, the renewal counts and every teacher row of that student.
//   (The database copy is now also updated by the server at the same moment, so every other manager sees it on the next refresh.)
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>'); if (i < 0) { console.error('no body'); process.exit(1); }
s = s.slice(0, i) + String.raw`<script>
/* 772 · renewal status updates everywhere at once */
(function(){
  if(window.__772 || typeof window.api !== 'function') return; window.__772 = 1;
  const day = () => new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'Asia/Manila' });
  const me = () => (typeof D !== 'undefined' && D && D.me && D.me.name) || 'CupOfEnglish';
  function set(code, st){ try{ code = String(code || '').toUpperCase(); if(!/^ST-\d{4}-\d{3}$/.test(code) || typeof REN !== 'object' || !REN) return;
      if(st) REN[code] = st; else delete REN[code];
      try{ localStorage.setItem('coe.ren', JSON.stringify(REN)); }catch(e){}
      setTimeout(() => { try{ if(typeof VIEW !== 'undefined' && VIEW === 'mtoday' && typeof renderMToday === 'function') renderMToday(); }catch(e){} try{ if(document.getElementById('wsBody') && typeof wsSheet === 'function') wsSheet(); }catch(e){} }, 50); }catch(e){} }
  const _api = window.api;
  window.api = function(fn){ const p = _api.apply(this, arguments), a = [].slice.call(arguments, 1);
    if(fn === 'mgmtRenewPaid' && a[1] && typeof a[1] === 'object' && !a[1].dry){ const f = a[1];
      Promise.resolve(p).then(r => { if(r && r.ok === false) return; set(f.code, (r && /^Renewed/.test(r.status || '')) ? r.status : 'Renewed · ' + (+f.pkg || 0) + (+f.free ? '+' + f.free : '') + ' paid · ' + day() + ' · ' + (f.partner || 'CupOfEnglish')); }, () => {}); }
    else if(fn === 'mgmtRenewal' && typeof a[1] === 'string'){ const code = a[1], st = String(a[2] || ''), note = String(a[3] || '').trim(), until = String(a[4] || '');
      Promise.resolve(p).then(r => { if(r && r.ok === false) return; set(code, r && typeof r.status === 'string' && r.status ? r.status : st ? st + (st === 'Paused' && until ? ' until ' + until : '') + ' · ' + day() + ' · ' + me() + (note ? ' · ' + note : '') : ''); }, () => {}); }
    return p; };
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
