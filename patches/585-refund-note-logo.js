// 22 Oct · Misty: "the logo now seemed distorted unlike the copy picture of others" + "Original payment · · 0 + 0 free" when reopened.
// Logo sized by height like the payment confirmation (56px, width auto); the original-payment line only shows what is known.
require('../tools/lib.js')(process.argv[2], [
["#rfNote .hd img{width:150px}", "#rfNote .hd img{height:56px!important;width:197px!important;max-width:none!important;max-height:none!important;object-fit:contain}"],
["      (S.invoice ? '<br>Original payment 原付款: ' + e(S.invoice.replace(/\\.pdf$/i, '').replace(/_/g, ' ')) + ' · ' + e(fd(S.date)) + ' · ' + n1(S.pkg) + ' + ' + n1(S.free) + ' free lessons' : '') + '</div>' +",
 "      (S.invoice ? '<br>Original payment 原付款: ' + e(S.invoice.replace(/\\.pdf$/i, '').replace(/_/g, ' ')) + (S.date ? ' · ' + e(fd(S.date)) : '') + (+S.pkg ? ' · ' + n1(S.pkg) + ' + ' + n1(S.free) + ' free lessons' : '') : '') + '</div>' +"],
]);
