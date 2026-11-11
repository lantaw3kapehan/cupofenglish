// 2104 (11 Nov 21:48, Misty: "I'm on Sunny's screen but it gives me Andy and Andrew"). After a Lesson summary opens, the app refreshes the
//   package list in the background and, if the numbers changed, re-draws that summary. The check only asked "is a sheet open and was the
//   last summary this student's?", so after moving to Sunny (a different sheet), Andy & Andrew's summary was drawn over Sunny's screen.
//   Now it re-draws only if that same summary is still on the screen.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
  ["if(JSON.stringify(AT && AT.rows) !== sig && DOCV && DOCV.key === 'SHPKG' && DOCV.pick === code && $('sheet').classList.contains('on')){",
   "if(JSON.stringify(AT && AT.rows) !== sig && DOCV && DOCV.key === 'SHPKG' && DOCV.pick === code && $('sheet').classList.contains('on') && window.__sh2104 && window.__sh2104.code === code && window.__sh2104.node && window.__sh2104.node.isConnected){   /* 2104: only while this summary is still on screen */"],
  ["docShow('SHPKG', T, { rows: h, pick: '' }, code);",
   "docShow('SHPKG', T, { rows: h, pick: '' }, code); try{ window.__sh2104 = { code, node: $('sheetBody').querySelector('.paper') || $('sheetBody').firstElementChild }; }catch(e){}   /* 2104 */"]
]);
