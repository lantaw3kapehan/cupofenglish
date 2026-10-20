// 20 Oct · Teacher of the Month (final 1st place, Silver or Gold) and Gold Excellence (every Gold) as separate commendations; "leading so far" / "Gold so far" lines during the month.
const inc = require('fs').readFileSync(require('path').join(__dirname, '366-commendations.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [
  ["function paintAll(){ try{ side(); }catch(e){} try{ badge(); }catch(e){} try{ if(VIEW === 'growth') growthCard(); }catch(e){} try{ if(VIEW === 'today') totm(); }catch(e){} }",
   "function paintAll(){ window._KX = K; try{ side(); }catch(e){} try{ badge(); }catch(e){} try{ if(VIEW === 'growth') growthCard(); }catch(e){} try{ if(window.kxCommend) kxCommend(K); }catch(e){} }   /* 366: Teacher of the Month + Gold Excellence */"],
  ["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]
]);
