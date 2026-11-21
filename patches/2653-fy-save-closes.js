// 2653: Followed up › Save left the note box focused, so the card waited for "typing" to end and never redrew.
//   Save now closes the note box first, then saves; the row moves to "Followed up" at once.
const fs = require('fs'); const file = process.argv[2]; let h = fs.readFileSync(file, 'utf8');
const a = h.indexOf('<script id="b2651">'), b = h.indexOf('</script>', a); let s = h.slice(a, b);
const f = "var save = function(){ window.__fy2651 = inp.value.trim(); window.__fy2651go = 1; window.fy2637(k, 'followed'); };";
const r = "var save = function(){ window.__fy2651 = inp.value.trim(); try{ inp.blur(); box.remove(); }catch(e){} window.__fy2651go = 1; window.fy2637(k, 'followed'); };";
if (s.split(f).length !== 2) throw new Error('nf'); s = s.replace(f, r); h = h.slice(0, a) + s + h.slice(b); fs.writeFileSync(file, h);
require('../tools/lib.js')(file, []);
