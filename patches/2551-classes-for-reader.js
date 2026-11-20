// 2551 (Misty 23:11 "teachers have back to back lessons … they rely mainly on the app for the books"): the app tells the book reader
// (same site, reader/) when today's classes are, so the reader saves books for next time only between classes, never during one.
const file = process.argv[2];
const inc = `<script id="b2551">
/* 20 Nov · 2551 · today's class times for the book reader (localStorage coe.today.cls = [[start ms, end ms], …], this teacher only) */
(function(){ if(window.__c2551) return; window.__c2551 = 1;
  function put(){ try{ if(typeof D === 'undefined' || !D || !D.today) return; var L = (D.schedule || []).filter(function(c){ return c.day === D.today && !c.cancelled && c.start && c.end; })
      .map(function(c){ return [new Date(c.start).getTime(), new Date(c.end).getTime()]; }).filter(function(x){ return x[0] && x[1]; });
    var v = JSON.stringify({ day: D.today, at: Date.now(), cls: L }); if(localStorage.getItem('coe.today.cls') !== v) localStorage.setItem('coe.today.cls', v); }catch(e){} }
  setTimeout(put, 3000); setInterval(put, 60e3);
})();
</script>
`;
require('../tools/lib.js')(file, [['<script id="b2278">', inc + '<script id="b2278">']]);
