// 19 Oct · Price picture · Adults: "Partner price" tick — ¥15 less per lesson, what the partner remits to CupOfEnglish
// (15 lessons × ¥65 = ¥975 · 30 × ¥65 = ¥1,950 · 60 × ¥65 = ¥3,900; free lessons stay free). Title "Partner price list · 合作伙伴结算价".
require('../tools/lib.js')(process.argv[2], [
["const ppL = () => PP.ad === 4 ? PKK",
 "const ppL = () => PP.ad === true && PP.partner ? PKA.map(p => Object.assign({}, p, { price: (Math.round(p.price / p.n) - 15) * p.n, save: 0, saveT: '' })) : PP.ad === 4 ? PKK"],
["'</div>' + '<div class=\"small\" style=\"margin-top:12px\"><b>Recommend</b></div>",
 "'</div>' + (PP.ad === true ? '<label class=\"check\" style=\"margin:8px 0 0\"><input type=\"checkbox\" ' + (PP.partner ? 'checked' : '') + ' onchange=\"ppPartner(this.checked)\"><span><b>Partner price</b> · ¥15 less per lesson · what the partner remits to us (15 lessons = ¥975)</span></label>' : '') + '<div class=\"small\" style=\"margin-top:12px\"><b>Recommend</b></div>"],
["PP.ad ? 'Adult price list · 成人课程价格'",
 "PP.ad ? (PP.ad === true && PP.partner ? 'Partner price list · 合作伙伴结算价' : 'Adult price list · 成人课程价格')"],
["window.ppAd = function(a){ PP.ad = a >= 2 ? a : !!a; ppSheet(); };",
 "window.ppAd = function(a){ PP.ad = a >= 2 ? a : !!a; ppSheet(); };\nwindow.ppPartner = function(v){ PP.partner = !!v; ppSheet(); };"]]);
