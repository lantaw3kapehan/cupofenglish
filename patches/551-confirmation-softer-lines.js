// 21 Oct · Misty: softer lines on the payment confirmation. Item row lines lighter (last row none, the totals sit below),
// footer divider and the two teal cards' outlines become a soft brand-teal hairline to match the PAID stamp.
require('../tools/lib.js')(process.argv[2], [
[".ivp table.ivli td{padding:9px 10px;vertical-align:top;border-bottom:1px solid #E7E5EF}", ".ivp table.ivli td{padding:9px 10px;vertical-align:top;border-bottom:1px solid #F0EFF5}.ivp table.ivli tr:last-child td{border-bottom:0}"],
[".ivp .rb{margin-top:18px;border:1px solid #E7E5EF;", ".ivp .rb{margin-top:18px;border:1px solid #D6EEEC;"],
[".ivp .ft{margin-top:auto;padding-top:16px;border-top:1px solid #E7E5EF;", ".ivp .ft{margin-top:auto;padding-top:16px;border-top:1px solid #BFE3E0;"],
["border:1px solid #E7E5EF;border-left:4px solid #1BA8A0;border-radius:10px;background:#F7FBFB}\n.ivp .ft .seal>img", "border:1px solid #D6EEEC;border-left:4px solid #1BA8A0;border-radius:10px;background:#F7FBFB}\n.ivp .ft .seal>img"],
["padding-top:6px;border-top:1px solid #E7E5EF;font-size:8.5px", "padding-top:6px;border-top:1px solid #D6EEEC;font-size:8.5px"],
]);
