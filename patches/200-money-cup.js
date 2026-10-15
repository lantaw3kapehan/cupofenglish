// 15 Oct night · Sales & costs: the CupOfEnglish cup, white and faded, in the corner of "this month" (as on Overview).
require('../tools/lib.js')(process.argv[2], [
["<section class=\"mx-hero\"><div class=\"row1\">", "<section class=\"mx-hero\"><img class=\"mx-cup\" src=\"${esc(ovCup())}\" alt=\"\"><div class=\"row1\">"],
[".mx-hero .row1{display:flex;", ".mx-cup{position:absolute;right:-22px;top:-30px;width:230px;opacity:.13;filter:brightness(0) invert(1);pointer-events:none;z-index:0}\n.mx-hero::after{display:none}\n.mx-hero .row1{position:relative;z-index:1;display:flex;"],
["  .mx-hero{padding:20px 18px;border-radius:20px}", "  .mx-hero{padding:20px 18px;border-radius:20px} .mx-cup{width:150px;right:-18px;top:-18px}"],
]);
