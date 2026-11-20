// 2554 (Misty 23:19 "yes go ahead"): today's unit audio and videos are saved on the teacher's computer before class too, and play
// from there (sw.js 2554 serves them, with seeking). Same rules as the books (2552): outside class time only, one file at a time.
const file = process.argv[2];
const inc = `<script id="b2554">
/* 20 Nov · 2554 · Saving today's unit audio and videos ahead. For each of today's classes: book + current unit → that unit's audio and
   videos (our copies) → saved in Cache Storage "coe-books-pre" under their own address; the app frame (sw.js) plays a saved one from the
   computer. Outside class time only (3 minutes before a class until it ends counts as class time), one file at a time, a save pauses
   when a class starts, files up to 110 MB, not on slow or data-saver connections. Nothing shows on screen. */
(function(){ if(window.__m2554) return; window.__m2554 = 1;
  var MEDIA = 'https://rlxkiahqjsabopmuhern.supabase.co/storage/v1/object/public/book-media/', KC = 'coe-books-pre', KMAX = 110 * 1048576, KALL = 1200 * 1048576, RUN = 0, DONE = {};
  var norm = function(s){ return String(s || '').toLowerCase().replace(/[^a-z0-9]/g, ''); };
  var NONE = /^(freetalk|debate|ielts\\w*|academicwriting|conversation|trial|review)$/;
  var code1 = function(s){ return String(s || '').split(/\\s*[,;/]\\s*/).map(function(x){ return x.trim(); }).filter(function(p){ return p && !/^(pre[-\\s]?)?[abc][12]\\+?$/i.test(p); }).map(norm).filter(function(x){ return x && !NONE.test(x); })[0]; };
  var unitIn = function(t){ var m = /unit\\s*(\\d+)/i.exec(String(t || '')) || /\\bU(\\d+)(?=L|W|\\b)/i.exec(String(t || '')); return m ? +m[1] : null; };
  function unitOf(f){ var g = String(f.group || ''), m = /^(\\d+)$/.exec(g.split(' / ').slice(-1)[0] || ''); if(m) return +m[1];
    m = /\\bunit\\s*0?(\\d+)\\b/i.exec(g) || /\\bunit\\s*0?(\\d+)\\b/i.exec(f.name) || /(?:^|[^A-Z])U0?(\\d+)(?=L|W|[^0-9]|$)/.exec(f.name); if(m) return +m[1];
    if(f.kind === 'audio'){ m = /(?:^|[_\\s-])(\\d{1,2})\\.(\\d{1,2})(?=[_\\s.-]|$)/.exec(String(f.name).replace(/\\.[a-z0-9]+$/i, '')); if(m) return +m[1]; } return null; }
  function classes(){ return (D.schedule || []).filter(function(c){ return c.day === D.today && !c.cancelled && c.start && c.end; }); }
  function free(){ var t = Date.now(); return !classes().some(function(c){ return t >= new Date(c.start).getTime() - 3 * 6e4 && t <= new Date(c.end).getTime(); }); }
  var sleep = function(ms){ return new Promise(function(r){ setTimeout(r, ms); }); };
  async function waitFree(){ while(!free()) await sleep(60e3); }
  function idx(){ try{ return JSON.parse(localStorage.getItem('coe.bk.pre') || '[]'); }catch(e){ return []; } }
  async function save(url, type){ var c = await caches.open(KC); if(await c.match(url)) return;
    var h = await fetch(url, { method: 'HEAD', cache: 'no-store' }); var n = +(h.headers.get('content-length') || 0); if(!h.ok || !n || n > KMAX) return;
    var out = new Uint8Array(n), pos = 0, step = 524288;
    while(pos < n){ await waitFree(); var e = Math.min(n, pos + step), r = await fetch(url, { cache: 'no-store', headers: { Range: 'bytes=' + pos + '-' + (e - 1) } });
      if(r.status !== 206 && !(r.ok && pos === 0 && e === n)) return; out.set(new Uint8Array(await r.arrayBuffer()).subarray(0, e - pos), pos); pos = e; await sleep(150); }
    await c.put(url, new Response(out, { headers: { 'Content-Type': h.headers.get('content-type') || type, 'Content-Length': String(n) } }));
    var L = idx().filter(function(x){ return x.u !== url; }); L.unshift({ u: url, n: n, at: Date.now() }); var tot = 0, keep = [];
    for(var i = 0; i < L.length; i++){ if(tot + L[i].n <= KALL){ keep.push(L[i]); tot += L[i].n; } else { try{ await c.delete(L[i].u); }catch(e){} } }
    try{ localStorage.setItem('coe.bk.pre', JSON.stringify(keep.slice(0, 300))); }catch(e){}
    try{ if(navigator.serviceWorker && navigator.serviceWorker.controller) navigator.serviceWorker.controller.postMessage('coe-books-saved'); }catch(e){} }
  async function run(){ if(RUN || typeof D === 'undefined' || !D || D.mgr || !D.timeIn || !TOKEN || !('caches' in window) || !window.bkGet) return;
    var cn = navigator.connection || {}; if(cn.saveData || /(^|-)2g|3g/.test(cn.effectiveType || '')) return;
    var day = D.today; if(DONE[day] && Date.now() - DONE[day] < 30 * 6e4) return; RUN = 1;
    try{ var want = [], seen = {};
      for(var c of classes()){ if(new Date(c.end).getTime() < Date.now()) continue; var s = (D.students || []).find(function(x){ return x.code === c.code; }) || {}, k = code1(c.book || s.book); if(!k) continue;
        var u = unitIn(s.note && s.note.ended); if(u == null) continue; var b = null; try{ b = await bkGet(k); }catch(e){} if(!b) continue;
        (b.files || []).filter(function(f){ return (f.kind === 'audio' || f.kind === 'video') && unitOf(f) === u; }).forEach(function(f){ if(!seen[f.id]){ seen[f.id] = 1; want.push(f); } }); }
      want.sort(function(a, z){ return (a.kind === 'audio' ? 0 : 1) - (z.kind === 'audio' ? 0 : 1); });   /* the small audio first */
      for(var f of want.slice(0, 60)){ if(D.today !== day) break; await waitFree(); try{ await save(MEDIA + encodeURIComponent(f.id), f.kind === 'video' ? 'video/mp4' : 'audio/mpeg'); }catch(e){} }
      DONE[day] = Date.now(); }catch(e){} RUN = 0; }
  setTimeout(function(){ run(); }, 45e3); setInterval(function(){ run(); }, 10 * 6e4);
})();
</script>
`;
require('../tools/lib.js')(file, [['<script id="b2278">', inc + '<script id="b2278">']]);
