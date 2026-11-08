// 1915: (Misty 8 Nov 16:17 — Mayi taps "Upload late video" for Sat 7 Nov and gets "This class has not started yet")
//   Weekly classes keep the same class id every week. The upload looked the id up in this week's schedule first, so it found
//   next Saturday (14 Nov) → blocked as "not started yet" (and would have filed the video under 14 Nov).
//   Now "Upload late video" marks the exact missed class (id + start), and both the guard and the upload use that class.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  // the late button remembers which missed class (by id + start) is being uploaded
  ["onclick=\"closeSheet();vidUp(\\'' + esc(c.id) + '\\')\">I understand · choose the video</button>",
   "onclick=\"closeSheet();window.__vlUse={id:\\'' + esc(c.id) + '\\',start:\\'' + esc(c.start) + '\\',t:Date.now()};vidUp(\\'' + esc(c.id) + '\\')\">I understand · choose the video</button>"],
  // 1150 guard + queue: prefer the marked missed class
  ["var cls = function(id){ return ((typeof D !== 'undefined' && D && D.schedule) || []).find(function(x){ return x.id === id; }) || (window.VL_LIST || []).find(function(x){ return x.id === id; }); };",
   "var cls = function(id){ var u = window.__vlUse; if(u && u.id === id && Date.now() - u.t < 30 * 6e4){ var L = (window.VL_LIST || []).find(function(x){ return x.id === id && x.start === u.start; }); if(L) return L; } return ((typeof D !== 'undefined' && D && D.schedule) || []).find(function(x){ return x.id === id; }) || (window.VL_LIST || []).find(function(x){ return x.id === id; }); };   /* 1915 */"],
  // the upload itself: the marked missed class first
  ["const c = (D.schedule || []).find(x => x.id === id) || (window.VL_LIST || []).find(x => x.id === id); if(!c) return toast('Class not found · refresh the app and try again');",
   "const u1915 = window.__vlUse, c = (u1915 && u1915.id === id && Date.now() - u1915.t < 30 * 6e4 && (window.VL_LIST || []).find(x => x.id === id && x.start === u1915.start)) || (D.schedule || []).find(x => x.id === id) || (window.VL_LIST || []).find(x => x.id === id); if(!c) return toast('Class not found · refresh the app and try again');   /* 1915 */"],
]);
