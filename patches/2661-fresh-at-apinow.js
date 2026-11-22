// 2661: 2660's step sat inside api(), but some screens (Monitor day list, …) reach Google through other wrappers.
//   Now the database step sits right before every Google call (apiNow): any read of these screens asks the database first.
const JS = `<script id="b2661">
(function(){ if(window.__2661) return; window.__2661 = 1;
  var F = /^(getBootstrap|tMyVisits|tMyComments|tLeave|tFbStatus|mgmtMonDay|mgmtPayroll|mgmtLeave|mgmtActions)$/, FAIL = {};
  function wrap(){ if(typeof window.apiNow !== 'function' || window.apiNow.__2661 || typeof window.fresh2660 !== 'function') return;
    var orig = window.apiNow;
    var w = function(fn){ var args = Array.prototype.slice.call(arguments, 1), self = this;
      if(!F.test(fn)) return orig.apply(self, arguments);
      var k = fn + '|' + JSON.stringify(args.slice(1)); if(FAIL[k] && Date.now() - FAIL[k] < 15000) return orig.apply(self, arguments);
      var all = arguments;
      return window.fresh2660(fn, args).then(function(x){ if(x !== undefined) return x; FAIL[k] = Date.now(); return orig.apply(self, all); }, function(){ FAIL[k] = Date.now(); return orig.apply(self, all); }); };
    w.__2661 = 1; window.apiNow = w; try{ apiNow = w; }catch(e){} }
  wrap(); setTimeout(wrap, 1500); setTimeout(wrap, 6000);
})();
</script>
</body>`;
const fs = require('fs'); const file = process.argv[2]; let h = fs.readFileSync(file, 'utf8');
if (h.includes('id="b2661"')) throw new Error('already');
const i = h.lastIndexOf('</body>'); h = h.slice(0, i) + JS + h.slice(i + 7); fs.writeFileSync(file, h);
require('../tools/lib.js')(file, []);
