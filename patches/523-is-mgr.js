// 21 Oct · The Overview changes (521/522) did not show: they were written for a "mgr" page class that the app never sets.
// The app now marks the page "is-mgr" when management is signed in, and those rules use it. The teacher-only student-page
// action row (510: no WRITE / MORE labels) is now teachers only again — management keeps its "Send to parent" / "Manage" groups.
const fs = require('fs'), f = process.argv[2];
{ const s = fs.readFileSync(f, 'utf8'), n = (s.match(/body\.mgr /g) || []).length; if(n !== 13){ console.error('expected 13 body.mgr rules, found ' + n); process.exit(1); } }
require('../tools/lib.js')(f, [
["body:not(.mgr) .stu-bar{gap:8px!important;", "body:not(.is-mgr) .stu-bar{gap:8px!important;"],
["body:not(.mgr) .stu-bar .grp{border:0!important;", "body:not(.is-mgr) .stu-bar .grp{border:0!important;"],
["body:not(.mgr) .stu-bar .grp>span{display:none!important}`;", "body:not(.is-mgr) .stu-bar .grp>span{display:none!important}`;\n  try{ const _bn = window.buildNav; if(_bn) window.buildNav = buildNav = function(){ const r = _bn.apply(this, arguments); try{ document.body.classList.toggle('is-mgr', !!(typeof D !== 'undefined' && D && D.mgr)); }catch(e){} return r; }; if(typeof D !== 'undefined' && D) document.body.classList.toggle('is-mgr', !!D.mgr); }catch(e){}   /* 523 */"]
]);
fs.writeFileSync(f, fs.readFileSync(f, 'utf8').replace(/body\.mgr /g, 'body.is-mgr '));
