// 2312 (Misty 17 Nov 16:33 "ENSURE THAT CHECK HOMEWORK AND BOOKS WONT HAVE ISSUES OR LAGS"): keep the servers behind Homework check and
// the book reader awake while the app is open (a tiny request every 10 minutes), so the first open is never a cold start (~3 s), and
// let the browser fetch the Homework check page ahead of time.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
 ['<script id="b2278">',
  `<script id="b2312">
(function(){ if(window.__b2312) return; window.__b2312 = 1;
  function ping(){ try{ if(typeof TOKEN === 'undefined' || !TOKEN || document.hidden) return; const F = 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/';
    fetch(F + 'coe-hw', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'me', token: TOKEN }) }).catch(() => {});
    fetch(F + 'coe-books', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'ping', token: TOKEN }) }).catch(() => {}); }catch(e){} }
  setTimeout(function(){ ping(); try{ const l = document.createElement('link'); l.rel = 'prefetch'; l.href = 'homework/'; document.head.appendChild(l); }catch(e){} }, 9000);
  setInterval(ping, 10 * 60000);
})();
</script>
<script id="b2278">`],
]);
