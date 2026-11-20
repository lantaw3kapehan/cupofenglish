// 2552 (Misty 23:14 "make it live"): today's units are saved on the teacher's computer before class, so they open instantly in class.
const file = process.argv[2];
const inc = `<script id="b2552">
/* 20 Nov · 2552 · Saving today's books ahead (Misty 22:45–23:14). After time-in, for each of today's classes: the student's book and
   current unit (the unit of the last class note) and the next unit → their unit PDFs → the file the reader would open (the light copy
   when there is one) → saved in Cache Storage "coe-books-pre", the same place and key the reader reads first (2549).
   Only outside class time (3 minutes before a class until it ends counts as class time), one file at a time, files up to 50 MB,
   not on slow or data-saver connections. A save pauses when a class starts. Nothing shows on screen. */
(function(){ if(window.__p2552) return; window.__p2552 = 1;
  var SB = 'https://rlxkiahqjsabopmuhern.supabase.co', KC = 'coe-books-pre', KMAX = 50 * 1048576, KALL = 1200 * 1048576, RUN = 0, DONE = {};
  var norm = function(s){ return String(s || '').toLowerCase().replace(/[^a-z0-9]/g, ''); };
  var NONE = /^(freetalk|debate|ielts\\w*|academicwriting|conversation|trial|review)$/;
  var code1 = function(s){ return String(s || '').split(/\\s*[,;/]\\s*/).map(function(x){ return x.trim(); }).filter(function(p){ return p && !/^(pre[-\\s]?)?[abc][12]\\+?$/i.test(p); }).map(norm).filter(function(x){ return x && !NONE.test(x); })[0]; };
  var unitIn = function(t){ var m = /unit\\s*(\\d+)/i.exec(String(t || '')) || /\\bU(\\d+)(?=L|W|\\b)/i.exec(String(t || '')); return m ? +m[1] : null; };
  function unitOf(f){ var g = String(f.group || ''), m = /^(\\d+)$/.exec(g.split(' / ').slice(-1)[0] || ''); if(m) return +m[1];
    m = /\\bunit\\s*0?(\\d+)\\b/i.exec(g) || /\\bunit\\s*0?(\\d+)\\b/i.exec(f.name) || /(?:^|[^A-Z])U0?(\\d+)(?=L|W|[^0-9]|$)/.exec(f.name); return m ? +m[1] : null; }
  function classes(){ return (D.schedule || []).filter(function(c){ return c.day === D.today && !c.cancelled && c.start && c.end; }); }
  function free(){ var t = Date.now(); return !classes().some(function(c){ return t >= new Date(c.start).getTime() - 3 * 6e4 && t <= new Date(c.end).getTime(); }); }
  var sleep = function(ms){ return new Promise(function(r){ setTimeout(r, ms); }); };
  async function waitFree(){ while(!free()) await sleep(60e3); }
  function idx(){ try{ return JSON.parse(localStorage.getItem('coe.bk.pre') || '[]'); }catch(e){ return []; } }
  async function save(url, src, n){ var c = await caches.open(KC); if(await c.match(url)) return 'had';
    var out = new Uint8Array(n), pos = 0, step = 524288;
    while(pos < n){ await waitFree(); var e = Math.min(n, pos + step), r = await fetch(src, { cache: 'no-store', headers: { Range: 'bytes=' + pos + '-' + (e - 1) } });
      if(r.status !== 206 && !(r.ok && pos === 0 && e === n)) return 'no'; out.set(new Uint8Array(await r.arrayBuffer()).subarray(0, e - pos), pos); pos = e; await sleep(150); }
    await c.put(url, new Response(out, { headers: { 'Content-Type': 'application/pdf', 'Content-Length': String(n) } }));
    var L = idx().filter(function(x){ return x.u !== url; }); L.unshift({ u: url, n: n, at: Date.now() }); var tot = 0, keep = [];
    for(var i = 0; i < L.length; i++){ if(tot + L[i].n <= KALL){ keep.push(L[i]); tot += L[i].n; } else { try{ await c.delete(L[i].u); }catch(e){} } }
    try{ localStorage.setItem('coe.bk.pre', JSON.stringify(keep.slice(0, 200))); }catch(e){} return 'saved'; }
  async function run(){ if(RUN || typeof D === 'undefined' || !D || D.mgr || !D.timeIn || !TOKEN || !('caches' in window) || !window.bkGet) return;
    var cn = navigator.connection || {}; if(cn.saveData || /(^|-)2g|3g/.test(cn.effectiveType || '')) return;
    var day = D.today; if(DONE[day] && Date.now() - DONE[day] < 30 * 6e4) return; RUN = 1;
    try{ var want = [], seen = {};
      for(var c of classes()){ if(new Date(c.end).getTime() < Date.now()) continue; var s = (D.students || []).find(function(x){ return x.code === c.code; }) || {}, k = code1(c.book || s.book); if(!k) continue;
        var u = unitIn(s.note && s.note.ended); if(u == null) continue; var b = null; try{ b = await bkGet(k); }catch(e){} if(!b) continue;
        (b.files || []).filter(function(f){ var x = unitOf(f); return f.kind === 'pdf' && (x === u || x === u + 1); }).forEach(function(f){ if(!seen[f.id]){ seen[f.id] = 1; want.push(f.id); } }); }
      for(var id of want.slice(0, 30)){ if(D.today !== day) break; await waitFree();
        var m = null; try{ m = await fetch(SB + '/functions/v1/coe-books', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'meta', token: TOKEN, id: id }) }).then(function(r){ return r.json(); }); }catch(e){}
        if(!m) continue; var src = '', n = 0;
        if(m.light && m.lightSize){ src = SB + '/storage/v1/object/public/book-media/' + m.light.split('/').map(encodeURIComponent).join('/'); n = +m.lightSize; }
        else if(m.copied && m.size){ src = SB + '/storage/v1/object/public/book-media/' + encodeURIComponent(id); n = +m.size; }
        if(!src || !n || n > KMAX) continue; try{ await save(src + '?n=' + n, src, n); }catch(e){} }
      DONE[day] = Date.now(); }catch(e){} RUN = 0; }
  setTimeout(function(){ run(); }, 20e3); setInterval(function(){ run(); }, 10 * 6e4);
})();
</script>
`;
require('../tools/lib.js')(file, [['<script id="b2278">', inc + '<script id="b2278">']]);
