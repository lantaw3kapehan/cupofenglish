// 20 Oct · Trials: the total standing shows on the first view too (a strip under the switch); its parts open This year / All time.
const inc = require('fs').readFileSync(require('path').join(__dirname, '438-trials-standing-strip.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [
  ["const _r = window.renderTP; if(_r) window.renderTP = function(){ const r = _r.apply(this, arguments); try{ paint(); if(RG !== 'd45' && !ALL) load(); }catch(e){ console.warn('tr37', e); } return r; };",
   "const _r = window.renderTP; if(_r) window.renderTP = function(){ const r = _r.apply(this, arguments); try{ paint(); if(!ALL || Date.now() - (ALL.at || 0) > 30 * 6e4) load(); }catch(e){ console.warn('tr37', e); } return r; };   /* 438: load always, the strip needs it */"],
  ["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]]);
