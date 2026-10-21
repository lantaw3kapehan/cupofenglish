// 21 Oct · To do: no redraw skips the later steps (flicker in Renewals due, raw "Enrolling", Elsa twice); one merge point at the outside.
const inc = require('fs').readFileSync(require('path').join(__dirname, '528-todo-one-render.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [
["if(!AGM) agrMap().then(m => { if(m && VIEW === 'mtoday') try{ _rmtAG(); }catch(e){} }); return r; };",
 "if(!AGM) agrMap().then(m => { if(m && VIEW === 'mtoday') try{ renderMToday(); }catch(e){} }); return r; };   /* 528: whole screen */"],
["window.renderMToday = function(){ if(tmr) return; const gap = Date.now() - last; if(gap > 800) return run(); tmr = setTimeout(run, 800 - gap); };",
 "window.renderMToday = function(){ return run(); };   /* 528: merging moved to the outside */"],
["    if(now - userAt < 1500 || now - lastAt > 350){ clearTimeout(t); return run(args); }   // a tap, or the first redraw in a while: at once\n    clearTimeout(t); t = setTimeout(() => { try{ run(args); }catch(e){ console.warn('td89', e); } }, 350); };",
 "    return run(args); };   /* 528: merging moved to the outside */"],
["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"]
]);
