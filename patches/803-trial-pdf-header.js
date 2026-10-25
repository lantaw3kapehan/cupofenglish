// 803: (Misty) app-made trial report: "it's covering logos and all" — a picture style from another screen (.tr-pill: full-width band)
//      leaked into the report header, so the "Trial class assessment" pill became a band across the logo on both pages.
// · The report keeps its own pill: a small rounded label on the right, logo fully visible.
require('../tools/lib.js')(process.argv[2], [
  [".tr-title span{font-size:13px}",
   ".tr-title span{font-size:13px}.tr-page .tr-top .tr-pill{position:static;left:auto;right:auto;display:inline-block}.tr-page .tr-top .tr-logo{position:relative;z-index:1}"]
]);
