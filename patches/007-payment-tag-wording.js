// Payment message for a tagged person: never says "partner", just @name.
require('../tools/lib.js')(process.argv[2], [
 [
  "p = String(p || '').trim() || 'our partner'; const at = /^our /.test(p) ? p : '@' + p.replace(/^@/, '');",
  "p = String(p || '').trim().replace(/^@/, ''); const at = '@' + (p || '______');"
 ],
 [
  "card(10, 'Payment · through a partner', '缴费 · 合作伙伴', 'For students who came through a partner: the payment goes to the partner, who helps us with it · English and Chinese.'",
  "card(10, 'Payment · send to a tagged person', '缴费 · @指定联系人', 'When the payment goes to someone we tag in the WeChat group (e.g. Dr. Sunshine) who helps us with it · English and Chinese.'"
 ],
 [
  "<h1>Payment · through a partner</h1><div class=\"mute small\">For students who came through a partner. The payment goes to the partner, who helps us with it · no Alipay QR.</div>",
  "<h1>Payment · send to a tagged person</h1><div class=\"mute small\">The message only names her with @ · no Alipay QR.</div>"
 ],
 [
  "Partner's WeChat name",
  "Her WeChat name (as in the group chat)"
 ],
 [
  "In WeChat, type @ and pick the partner so she gets notified.",
  "In the WeChat group, type @ and pick her so she gets notified."
 ],
 [
  "async function payCopy(pt){ ",
  "async function payCopy(pt){ if(pt && !String(($('payPn') || {}).value || '').trim()) return toast('Type her WeChat name first'); "
 ]
]);
