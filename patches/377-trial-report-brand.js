// 20 Oct · Trial report (made in the app) in the same look as the schedule / lesson-summary pictures (Misty: "same logo … for uniformity"):
// the CupOfEnglish logo image top left on white, a soft label on the right ("Trial class assessment · 试听课评估报告"), thin grey divider,
// and the "Learn with the best" tagline artwork centred in the footer (page number small on the right).
require('../tools/lib.js')(process.argv[2], [
  ["const head = `<div class=\"tr-top\"><div class=\"tr-logo\"><b>CupOfEnglish</b><span>一杯英语</span></div><div class=\"tr-title\"><b>TRIAL CLASS ASSESSMENT</b><span>试听课评估报告</span></div></div>",
   "const LG = (document.querySelector('#login img') || {}).src || '', TG = (document.querySelector('#login .tagl img') || {}).src || '';   /* 377: the same artwork as the schedule pictures */\n" +
   "    const head = `<div class=\"tr-top\"><div class=\"tr-logo\">${LG ? '<img src=\"' + LG + '\" alt=\"CupOfEnglish\">' : '<b>CupOfEnglish</b><span>一杯英语</span>'}</div><div class=\"tr-title\"><span class=\"tr-pill\">Trial class assessment · 试听课评估报告</span></div></div>"],
  ["const foot = n => `<div class=\"tr-foot\"><span>CupOfEnglish · 一杯英语 · LEARN WITH THE BEST</span><span>${e(F.student)} · ${e(F.code)} · ${n} / 2</span></div>`;",
   "const foot = n => `<div class=\"tr-foot\"><span class=\"tr-fl\">${e(F.student)} · ${e(F.code)}</span>${TG ? '<img src=\"' + TG + '\" alt=\"Learn with the best\">' : '<span>Learn with the best to be the best · 与优秀者同行，遇见更好的自己</span>'}<span class=\"tr-fr\">${n} / 2</span></div>`;"],
  [".tr-top{display:flex;align-items:center;justify-content:space-between;background:linear-gradient(135deg,#2BB3AA,#1F8F96);color:#fff;border-radius:16px;padding:16px 22px}",
   ".tr-top{display:flex;align-items:center;justify-content:space-between;background:#fff;color:#2B2253;padding:2px 0 14px;border-bottom:2px solid #EEF0F4}.tr-logo img{height:58px;display:block}.tr-pill{display:inline-block;background:#ECEAF6;color:#2B2253;border-radius:999px;padding:9px 18px;font:700 14px Rockwell,Arvo,Georgia,serif}"],
  [".tr-foot{position:absolute;left:40px;right:40px;bottom:16px;display:flex;justify-content:space-between;font-size:9px;color:#A9A6B8;border-top:1px solid #F2F1F6;padding-top:5px}",
   ".tr-foot{position:absolute;left:40px;right:40px;bottom:10px;display:flex;justify-content:space-between;align-items:center;font-size:9px;color:#A9A6B8;border-top:2px solid #EEF0F4;padding-top:6px}.tr-foot img{height:26px;display:block}.tr-foot .tr-fl,.tr-foot .tr-fr{width:160px}.tr-foot .tr-fr{text-align:right}"]
]);
