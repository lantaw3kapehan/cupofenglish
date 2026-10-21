// 21 Oct · Misty: remove the 'not valid for claim of input tax' line from the payment confirmation footer.
require('../tools/lib.js')(process.argv[2], [[
"<b class=\"nv\">THIS DOCUMENT IS NOT VALID FOR CLAIM OF INPUT TAX.</b>",
""
]]);
