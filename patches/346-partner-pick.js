// 19 Oct · Price picture: partner price per partner, for Kids & teens and Adults (Misty).
//   Dr. Spring · kids −¥20 (¥55 / lesson: 30+3 = ¥1,650 · 60+8 = ¥3,300) · adults −¥15 (¥65: 15 = ¥975)
//   Xiaolan    · kids −¥15 (¥60 / lesson: 30+3 = ¥1,800 · 60+8 = ¥3,600) · adults −¥15 (¥65)
// The tick becomes a choice: Normal · Dr. Spring · Xiaolan. Free lessons stay free. Normal is always the start.
require('../tools/lib.js')(process.argv[2], [
["const ppL = () => PP.ad === true && PP.partner ? PKA.map(p => Object.assign({}, p, { price: (Math.round(p.price / p.n) - 15) * p.n, save: 0, saveT: '' })) : PP.ad === 4 ? PKK",
 "const PARTNERS = { 'Dr. Spring': { k: 20, a: 15 }, 'Xiaolan': { k: 15, a: 15 } }, ppOff = () => ((PARTNERS[PP.partner] || {})[PP.ad ? 'a' : 'k']) || 0;   /* 346 */\nconst ppL = () => PP.partner && PARTNERS[PP.partner] && (PP.ad === true || !PP.ad) ? (PP.ad ? PKA : PK).map(p => Object.assign({}, p, { price: (Math.round(p.price / p.n) - ppOff()) * p.n, save: 0, saveT: '' })) : PP.ad === 4 ? PKK"],
["(PP.ad === true ? '<label class=\"check\" style=\"margin:8px 0 0\"><input type=\"checkbox\" ' + (PP.partner ? 'checked' : '') + ' onchange=\"ppPartner(this.checked)\"><span><b>Partner price</b> · ¥15 less per lesson · what the partner remits to us (15 lessons = ¥975)</span></label>' : '')",
 "(PP.ad === true || !PP.ad ? '<div class=\"small\" style=\"margin-top:12px\"><b>Price for</b> <span class=\"mute\">· partner = what the partner remits to us</span></div><div class=\"seg\">' + ['', 'Dr. Spring', 'Xiaolan'].map(n => '<button class=\"' + ((PP.partner || '') === n ? 'on' : '') + '\" onclick=\"ppPartner(\\'' + n + '\\')\">' + (n ? n + ' · −¥' + PARTNERS[n][PP.ad ? 'a' : 'k'] + '/lesson' : 'Normal (students)') + '</button>').join('') + '</div>' : '')"],
["window.ppPartner = function(v){ PP.partner = !!v; ppSheet(); };",
 "window.ppPartner = function(v){ PP.partner = typeof v === 'string' ? v : ''; ppSheet(); };"],
["PP.ad ? (PP.ad === true && PP.partner ? 'Partner price list · 合作伙伴结算价' : 'Adult price list · 成人课程价格') : 'Price list · 课程价格'",
 "PP.ad ? (PP.ad === true && PP.partner ? 'Partner price list · 合作伙伴结算价' : 'Adult price list · 成人课程价格') : (PP.partner ? 'Partner price list · 合作伙伴结算价' : 'Price list · 课程价格')"]]);
