// Builds a self-contained PREVIEW of the app that runs on recorded, anonymised sample data (audit/fx/recs.json).
// usage: node tools/preview-build.js <app.html> <recs.json> <out.html> [label]
// · Every request is answered from the samples; nothing reaches Google or the database. Saves are refused ("saving is off").
// · The clock is fixed at 25 Oct 2026 13:50 (Manila) so dates in the samples line up.
const fs = require('fs');
const [,, inp, fx, out, label] = process.argv;
let s = fs.readFileSync(inp, 'utf8');
const recs = JSON.parse(fs.readFileSync(fx, 'utf8'));
const data = JSON.stringify(recs).replace(/<\/(script)/gi, '<\\/$1');
const shim = `<script type="application/json" id="fxdata">${data}</script>
<script>
/* PREVIEW SHIM — sample data only, saving switched off */
(function(){
  window.COE_API = 'https://preview.invalid/exec'; window.__PREVIEW = 1;
  var T0 = Date.parse('2026-10-25T05:50:00Z'), P0 = performance.now(), RD = Date;
  function FD(){ var a = Array.prototype.slice.call(arguments); if(!(this instanceof FD)) return new RD(T0 + performance.now() - P0).toString();
    return a.length ? new (Function.prototype.bind.apply(RD, [null].concat(a)))() : new RD(T0 + performance.now() - P0); }
  FD.prototype = RD.prototype; FD.now = function(){ return T0 + performance.now() - P0; }; FD.parse = RD.parse; FD.UTC = RD.UTC; window.Date = FD;
  try{ localStorage.clear(); sessionStorage.clear(); }catch(e){} try{ localStorage.setItem('coe.token', 'PREVIEW-0000000000000000000000000'); }catch(e){}
  var R = JSON.parse(document.getElementById('fxdata').textContent), IX = {}, BY = {};
  function ep(u){ u = String(u).split('?')[0]; var m = u.match(/functions\\/v1\\/([^/]+)/); if(m) return m[1]; if(/\\/exec$/.test(u)) return 'exec'; return u.split('/').pop(); }
  function nb(b){ return String(b || '').replace(/,?"rid":"[^"]*"/, '').replace(/"token":"[^"]+"/, '"token":"T"').replace(/"[A-Za-z0-9_-]{30,}"/g, '"T"'); }
  function op(b){ try{ var j = JSON.parse(b || '{}'); return j.fn || j.op || j.action || ''; }catch(e){ return ''; } }
  R.forEach(function(r){ var e = ep(r.url); IX[e + '|' + nb(r.body)] = r.t; var k = e + '|' + op(r.body); if(!BY[k]) BY[k] = r.t; });
  var DOCS = {}; R.forEach(function(r){ if(ep(r.url) === 'coe' && op(r.body) === 'docs'){ try{ var d = JSON.parse(r.t).docs || {}; for(var k in d) if(d[k]){ if(d[k].at) d[k].at = new RD(T0 - 60000).toISOString(); DOCS[k] = d[k]; } }catch(e){} } });
  var MISS = window.__PREVIEW_MISS = [];
  var WRITE = /^(rec_add|new|undo|fee|issue|add|save|set|mark|send|del|remove|upload|update|claim|tag|decide|request|approve|reject|pay|transfer|remit|refund|sign|ack|seen|record|create|edit|post|reply|submit|mgmt(Save|Set|Tag|Mark|Send|Renew|Enrol|Trial(Sent|Group|Fu)|Report(Sent)|Leave|Msg|Task|Pkg|Agree|Profile|Avail|Vid|Pay|Wallet|Remit|Transfer))/i;
  var _f = window.fetch;
  window.fetch = function(u, o){ var url = String(u && u.url || u), body = o && typeof o.body === 'string' ? o.body : '';
    if(/fonts\\.(googleapis|gstatic)\\.com|cdnjs|jsdelivr|unpkg/.test(url)) return _f.apply(this, arguments);
    if(/version\\.txt/.test(url)) return Promise.resolve(new Response(String((document.documentElement.innerHTML.match(/const COE_V = (\\d+);/) || [])[1] || 1)));
    if(/app\\.html|sw\\.js|manifest/.test(url)) return Promise.reject(new Error('preview'));
    var e = ep(url), name = op(body), t = IX[e + '|' + nb(body)];
    if(t == null && e !== 'exec' && e !== 'coe' && !WRITE.test(name)) t = BY[e + '|' + name];
    if(e === 'coe' && name === 'docs'){ var out = {}; try{ JSON.parse(body).keys.forEach(function(k){ if(DOCS[k]) out[k] = DOCS[k]; }); }catch(x){} t = JSON.stringify({ ok: true, docs: out }); }
    if(t == null){ MISS.push(e + ' ' + name); (window.__PREVIEW_MISSB = window.__PREVIEW_MISSB || []).push({ e: e, body: body.replace(/"token":"[^"]+"/, '"token":"T"') }); t = JSON.stringify(WRITE.test(name) && /writes=fake/.test(location.search) ? { ok: true, preview: true, id: 1, msg: 'Preview: pretend-saved (nothing stored)', data: { ok: true, preview: true, msg: 'Preview: pretend-saved (nothing stored)' } } : WRITE.test(name) ? { ok: false, error: 'PREVIEW', msg: 'Preview: saving is switched off (sample data)' } : { ok: false, msg: 'Preview: no sample data for this' }); }
    if(/role=ops/.test(location.search) && name === 'getBootstrap'){ try{ var jb = JSON.parse(t); if(jb.data){ jb.data.pres = false; jb.data.me.role = 'Operations Coordinator'; jb.data.me.name = 'Operations'; } t = JSON.stringify(jb); }catch(x){} }
    return new Promise(function(res){ setTimeout(function(){ res(new Response(t, { status: 200, headers: { 'Content-Type': 'application/json' } })); }, window.__PREVIEW_DELAY || 60); }); };
  try{ navigator.sendBeacon = function(){ return true; }; }catch(e){}
  try{ if(navigator.serviceWorker) navigator.serviceWorker.register = function(){ return Promise.reject(new Error('preview')); }; }catch(e){}
  document.addEventListener('DOMContentLoaded', function(){ var b = document.createElement('div'); b.id = 'pvBanner';
    b.style.cssText = 'position:fixed;left:50%;transform:translateX(-50%);bottom:10px;z-index:99999;background:#2f2752;color:#fff;font:600 12px/1.2 -apple-system,Segoe UI,Roboto,Arial,sans-serif;padding:7px 14px;border-radius:999px;max-width:calc(100vw - 32px);box-sizing:border-box;text-align:center;box-shadow:0 4px 14px rgba(0,0,0,.2);pointer-events:none';
    b.textContent = 'PREVIEW ${(label || '').replace(/[`$\\]/g, '')} · sample data with made-up names · saving is switched off'; document.body.appendChild(b); });
})();
</script>`;
const i = s.indexOf('</script>', s.indexOf('window.COE_API')) + 9;
s = s.slice(0, i) + '\n' + shim + s.slice(i);
fs.writeFileSync(out, s);
console.log('preview written', out, Math.round(s.length / 1024) + ' KB');
