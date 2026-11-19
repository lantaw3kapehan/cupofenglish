// 2463 (Misty 18:29 "don't force teachers to logout or kick out or refresh or update · they use it, even books, during class ·
//   the header says there is an update, and when they click it, that's the only time it refreshes to the latest version")
//   1 · teachers: a new version is never applied by itself (any time of day) · management keeps the quiet background rule
//   2 · everyone: a small "Update ready · Refresh" button in the header when a newer version is waiting · the page reloads only on that tap
//   3 · everyone: a "please sign in again" from the server signs you out only if it is still true 15 seconds later (the 18:00 database
//       restart signed Celine out twice although her sign-in was fine) · a sign-out you choose is immediate as before
const file = process.argv[2];
const JS = String.raw`<style id="u2463">#upd2463{display:none;align-items:center;gap:6px;border:1px solid #CFE3E5;background:#fff;color:#00636B;border-radius:999px;font:inherit;font-weight:700;font-size:13px;padding:7px 12px;margin-right:8px;cursor:pointer;white-space:nowrap}
#upd2463.on{display:inline-flex}#upd2463 i{width:8px;height:8px;border-radius:50%;background:#00A3AD;display:inline-block}@media(max-width:620px){#upd2463 .t{display:none}}</style>
<script id="b2463">
(function(){
  /* 2 · header button */
  function ready(){ try{ return (typeof newerSaved === 'function' && newerSaved()) || !!window._updNet; }catch(e){ return false; } }
  function place(){ try{ var b = document.getElementById('upd2463'), n = document.getElementById('tinNag'); var host = n ? n.parentNode : document.querySelector('header .hd');
      if(!b){ if(!host) return; b = document.createElement('button'); b.type = 'button'; b.id = 'upd2463'; b.title = 'A newer version of the app is ready · tap to refresh';
        b.innerHTML = '<i aria-hidden="true"></i><span class="t">Update ready · </span>Refresh'; b.onclick = function(){ location.reload(); }; if(n) host.insertBefore(b, n); else host.appendChild(b); }
      b.classList.toggle('on', ready()); }catch(e){} }
  setInterval(place, 20000); setTimeout(place, 4000); document.addEventListener('visibilitychange', function(){ if(!document.hidden) setTimeout(place, 800); });
  try{ var _bn = updBanner; updBanner = function(){ place(); }; }catch(e){}   /* the old bottom pill → the header button */
  /* 3 · sign out only when the sign-in is really gone */
  var URL = 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe', chk = 0, _lo = logout;
  var probe = function(tk){ return fetch(URL, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: tk, op: 'ping' }) }).then(function(r){ return r.status; }, function(){ return 0; }); };
  logout = function(silent){ if(!silent || typeof TOKEN === 'undefined' || !TOKEN) return _lo.apply(this, arguments); if(chk) return; chk = 1; var tk = TOKEN;
    probe(tk).then(function(s1){ if(s1 !== 401){ chk = 0; return; } setTimeout(function(){ probe(tk).then(function(s2){ chk = 0; if(s2 === 401 && TOKEN === tk) _lo(true); }); }, 15000); }); };
  window.logout = logout;
})();
</script>
`;
require('../tools/lib.js')(file, [
  ["!(typeof updQuiet === 'function' && updQuiet()) && !inClass2462(); }catch(e){ return false; } }", "!(typeof updQuiet === 'function' && updQuiet()) && !(typeof D !== 'undefined' && D && !D.mgr); }catch(e){ return false; } }   /* 2463: teachers update only by tapping Refresh in the header */"],
  ['<script id="b2278">', JS + '<script id="b2278">']
]);
