// 21 Oct · Misty: no 'BIR' wording for Chinese and international clients on the payment confirmation.
// The printed invoice number row reads 'Official invoice no. 正式发票号'. (Staff screens keep 'BIR invoice no.')
require('../tools/lib.js')(process.argv[2], [
["${inv.bir_no ? `<tr><td>BIR invoice no.</td><td>${e(inv.bir_no)}</td></tr>` : ''}", "${inv.bir_no ? `<tr><td>Official invoice no. <span class=\"zh\">\u6b63\u5f0f\u53d1\u7968\u53f7</span></td><td>${e(inv.bir_no)}</td></tr>` : ''}"],
["alt=\"BIR verification QR code\"", "alt=\"Business Registration Verification QR code\""]
]);
