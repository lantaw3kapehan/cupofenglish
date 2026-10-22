// 22 Oct · Misty: colour labels for the payment method in All payment confirmations and the QuickBooks history
// (Alipay blue, WeChat Pay green, Bank transfer navy like CCB, GCash, PayPal, Cash amber, others grey), same style as the partner labels.
require('../tools/lib.js')(process.argv[2], [
["<td class=\"small mute\">${e(h.method)}</td>", "<td>${mtag(h.method)}</td>"],
["'<span class=\"pill\" style=\"background:var(--soft);color:var(--mute)\">No email</span>'}</td>", "'<span class=\"pill\" style=\"background:var(--soft);color:var(--mute)\">No email</span>'}${x.method ? '<div style=\"margin-top:5px\">' + mtag(x.method) + '</div>' : ''}</td>"],
["const isPartner = p =>", "const MCOL = [[/alipay|支付宝/i, '#EEF5FF', '#1677FF', 'Alipay 支付宝'], [/wechat|weixin|微信/i, '#EAF8F0', '#07A35A', 'WeChat Pay 微信'], [/bank|ccb|银行|transfer/i, '#EDF1F9', '#1F4E9C', ''], [/gcash/i, '#E8F0FE', '#0B5BD3', ''], [/paypal/i, '#EDEFF7', '#253B80', ''], [/cash|现金/i, '#FFF3DC', '#8A5A00', '']];\nconst mtag = m => { m = String(m || '').trim(); if(!m) return ''; const c = MCOL.find(x => x[0].test(m)) || [0, '#ECEBF2', '#55516E', ''];\n  return `<span class=\"ptag\" style=\"margin-left:0;background:${c[1]};color:${c[2]}\">${e(c[3] || m)}</span>`; };\nconst isPartner = p =>"],
]);
