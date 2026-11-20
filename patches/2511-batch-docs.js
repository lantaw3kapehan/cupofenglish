// 2511 (Misty: "go ahead and do it"): the app asked the server for about 14 small saved screens (op 'docs') one by one while opening.
//   Requests for docs that start within the same 20 ms now go out as one request; each part of the app still gets only its own docs back.
//   Anything unusual (other fields, a single request, an error) goes out exactly as before.
const file = process.argv[2];
const JS = `<script id="b2511">
(function(){ try{
  var URL0 = 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe', of = window.fetch; if(!of) return;
  var Q = {}, T = {};
  function plain(u, o){ try{ if(String(u) !== URL0 || !o || String(o.method || '').toUpperCase() !== 'POST' || typeof o.body !== 'string') return null;
      var b = JSON.parse(o.body); if(!b || b.op !== 'docs' || !b.token || !Array.isArray(b.keys) || !b.keys.length) return null;
      for(var k in b) if(k !== 'op' && k !== 'token' && k !== 'keys') return null; return b; }catch(e){ return null; } }
  function abortErr(){ try{ return new DOMException('Aborted', 'AbortError'); }catch(e){ var x = new Error('Aborted'); x.name = 'AbortError'; return x; } }
  function flush(tok){ var L = Q[tok] || []; delete Q[tok]; delete T[tok]; if(!L.length) return;
    if(L.length === 1){ var one = L[0]; of.call(window, one.u, one.o).then(one.ok, one.no); return; }
    var keys = []; L.forEach(function(x){ x.b.keys.forEach(function(k){ if(keys.indexOf(k) < 0) keys.push(k); }); });
    of.call(window, URL0, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'docs', token: tok, keys: keys }) })
      .then(function(r){ if(!r.ok) throw new Error('http ' + r.status); return r.json(); })
      .then(function(j){ L.forEach(function(x){ var out = j; if(j && j.ok && j.docs){ var d = {}; x.b.keys.forEach(function(k){ if(k in j.docs) d[k] = j.docs[k]; }); out = {}; for(var p in j) out[p] = j[p]; out.docs = d; }
          x.ok(new Response(JSON.stringify(out), { status: 200, headers: { 'Content-Type': 'application/json' } })); }); })
      .catch(function(){ L.forEach(function(x){ of.call(window, x.u, x.o).then(x.ok, x.no); }); });   /* anything wrong: each one as before */ }
  window.fetch = function(u, o){ var b = plain(u, o); if(!b) return of.apply(this, arguments);
    var sig = o.signal; if(sig && sig.aborted) return Promise.reject(abortErr());
    return new Promise(function(ok, no){ var done = false, x = { u: u, o: o, b: b, ok: function(r){ if(!done){ done = true; ok(r); } }, no: function(e){ if(!done){ done = true; no(e); } } };
      if(sig) try{ sig.addEventListener('abort', function(){ x.no(abortErr()); }); }catch(e){}
      (Q[b.token] = Q[b.token] || []).push(x); if(Q[b.token].length >= 40){ clearTimeout(T[b.token]); flush(b.token); } else if(!T[b.token]) T[b.token] = setTimeout(function(){ flush(b.token); }, 20); }); };
}catch(e){} })();
</script>`;
require('../tools/lib.js')(file, [['<script id="mo2025">', JS + '\n<script id="mo2025">']]);
