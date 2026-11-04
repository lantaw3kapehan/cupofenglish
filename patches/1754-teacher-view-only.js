// 1754: (Misty 4 Nov 17:19, "On teacher's access dont let them copy or share, just on view only · Only management must copy picture")
//   Payslip and Lessons by student: Copy picture / Share · save buttons only for management; a teacher's view has no text
//   selection and the picture / print functions refuse for a teacher.
const file = process.argv[2];
const B = "<button class=\"btn sm teal\" id=\"psC1745\" onclick=\"ps1745Pic()\">Copy picture</button><button class=\"btn sm ghost\" onclick=\"ps1745Pic(1)\">' + (navigator.share ? 'Share · save' : 'Save picture') + '</button>";
const G = "' + (typeof D !== 'undefined' && D && D.mgr ? '" + B + "' : '<span class=\"chip\">View only</span>') + '";   /* 1754 */
require('../tools/lib.js')(file, [
  ["Lessons by student · ' + esc(name) + '</h1>" + B, "Lessons by student · ' + esc(name) + '</h1>" + G],
  ["Payslip · ' + esc(name) + '</h1>" + B, "Payslip · ' + esc(name) + '</h1>" + G],
  ["  window.ps1745Pic = async function(save){ const el",
   "  window.ps1745Pic = async function(save){ if(!(typeof D !== 'undefined' && D && D.mgr)) return toast('View only');   /* 1754 */ const el"],
  ["  window.ps1744Print = function(){ if(!SL) return;",
   "  window.ps1744Print = function(){ if(!SL || !(typeof D !== 'undefined' && D && D.mgr)) return;   /* 1754 */"],
  ["</script>\n</body>\n</html>",
   "</script>\n<style>/* 1754 · teacher's payslip / lessons: view only */ body.t1754 #sheetBody .ps1744{ -webkit-user-select:none; user-select:none; -webkit-touch-callout:none; }</style>\n" +
   "<script>(function(){ try{ const f = () => { try{ document.body.classList.toggle('t1754', !(typeof D !== 'undefined' && D && D.mgr)); }catch(e){} }; f(); setInterval(f, 3000); }catch(e){} })();</script>\n</body>\n</html>"],
]);
