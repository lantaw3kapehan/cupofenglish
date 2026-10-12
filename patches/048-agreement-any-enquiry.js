// Enquiries › "Pictures for any enquiry": new card 9 "Service agreement" (before payment). Asks for the child's English and
// Chinese name, then opens the usual agreement picture (today's date, package boxes left blank) · no need to log the enquiry.
require('../tools/lib.js')(process.argv[2], [
[
"card(9, 'Payment · Alipay',",
"card(9, 'Service agreement', '服务协议', 'For parents who ask for the agreement before paying: the child\\'s name, today\\'s date and the package boxes left blank · picture in English and Chinese. No need to log the enquiry first.', 'Agreement', 'enqAgrAny()') +\ncard(10, 'Payment · Alipay',"
],
[
"card(10, 'Payment · send to a tagged person',",
"card(11, 'Payment · send to a tagged person',"
],
[
"card(11, 'Class notice · enrolled',",
"card(12, 'Class notice · enrolled',"
],
[
"window.enqF = function(f){ ENQ_F = f; renderEnq(); };",
"window.enqF = function(f){ ENQ_F = f; renderEnq(); };\nwindow.enqAgrAny = function(){ openSheet('<h1>Service agreement · 服务协议</h1><div class=\"mute small\">For a parent who asks before enrolling · the package boxes stay blank</div><label>Child\\'s English name</label><input id=\"eaN\" class=\"in-t\" placeholder=\"e.g. Ying\"><label>Chinese name (optional)</label><input id=\"eaC\" class=\"in-t\" placeholder=\"e.g. 贺莹\"><button class=\"btn teal block\" style=\"margin-top:14px\" onclick=\"const n=$(\\'eaN\\').value.trim(); if(!n) return toast(\\'Type the child\\\\\\'s name\\'); agrOpen({ key: \\'enq:any:\\' + n.toLowerCase(), name: n, cn: $(\\'eaC\\').value.trim() })\">Make the agreement picture</button>'); setTimeout(() => { const i = $('eaN'); if(i) i.focus(); }, 50); };"
]
]);
