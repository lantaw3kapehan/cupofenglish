// 1723: (Misty, 3 Nov 21:19 "speed it up") Enrolled · paid / Renewed · paid open from the database in ~0.6 s (coe-pkc) and save in ~1 s
//   (fast layer). Google's read-only double-check behind the form (dry: true, ~15 s) was being recorded as a wait, so App health showed
//   "mgmtEnrolPaid ×23 typical 14.7 s". Record those background checks as background, so the report shows what people really wait for.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["ui = Date.now() - (window._ui || 0) < 1500 && !(window.__quick && Date.now() - (window.__quick[fn] || 0) < 8000), p = baseApi.apply(this, arguments);",
   "ui = Date.now() - (window._ui || 0) < 1500 && !(window.__quick && Date.now() - (window.__quick[fn] || 0) < 8000) && !(/^mgmt(Enrol|Renew)Paid$/.test(fn) && arguments[2] && arguments[2].dry), p = baseApi.apply(this, arguments);   /* 1723: Google's check behind the form is not a wait */"]
]);
