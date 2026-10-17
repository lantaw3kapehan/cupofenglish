// 17 Oct · URGENT: 262 and 263 shipped their .inc code without the line that adds it to the page, so svPill (the save banner)
// did not exist and Add class / Move class stopped before reaching Google (the screen showed the new time, nothing was saved).
// This adds both pieces of code, and also:
// (1) the student page keeps a new time on this device only after Google says "✓ Saved";
// (2) an app update never reloads the page while a save is still pending.
const fs = require('fs'), path = require('path');
const inc262 = fs.readFileSync(path.join(__dirname, '262-search-fast-teacher-reminders.inc'), 'utf8');
const inc263 = fs.readFileSync(path.join(__dirname, '263-add-class-saved-banner.inc'), 'utf8').replace("el.style.cssText = 'background:' + C[0]", "el.dataset.k = kind; el.style.cssText = 'background:' + C[0]");
require('../tools/lib.js')(process.argv[2], [
["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc263 + "\n" + inc262 + "\n</script>\n\n</body>"],
["CLS_HOLD = code; paint();", "CLS_HOLD = code; window._seOpt = 1; paint(); window._seOpt = 0;"],
["try{ store('set','coe.cls.'+code, JSON.stringify(L)); }catch(x){}", "if(!window._seOpt) try{ store('set','coe.cls.'+code, JSON.stringify(L)); }catch(x){}"],
["function busy(){ const a = document.activeElement || {}; return $('sheet').classList.contains('on') ||",
 "function busy(){ const a = document.activeElement || {}; if(document.querySelector('#svPills [data-k=\"wait\"]')) return true; return $('sheet').classList.contains('on') ||"],
]);
