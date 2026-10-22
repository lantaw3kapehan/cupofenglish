// 633: Celebrate picture spacing with the level line (name panel 36px shorter; rows moved up) so the signature stays clear of the bottom line.
require('../tools/lib.js')(process.argv[2], [
[
"const PY = 186, PH = 420;",
"const PY = 186, PH = 384;"
],
[
"c.fillText(L[0], cx, 666); c.fillStyle = NAVY; fit(L[1], 38, B, w); c.fillText(L[1], cx, 716); c.fillStyle = '#4A4766'; fit(L[2], 24, F, w); c.fillText(L[2], cx, 754); };",
"c.fillText(L[0], cx, 630); c.fillStyle = NAVY; fit(L[1], 38, B, w); c.fillText(L[1], cx, 680); c.fillStyle = '#4A4766'; fit(L[2], 24, F, w); c.fillText(L[2], cx, 718); };"
],
[
"if(k){ c.fillStyle = '#EEF0F4'; c.fillRect(CX + cw * k - 1, 640, 2, 124); } });",
"if(k){ c.fillStyle = '#EEF0F4'; c.fillRect(CX + cw * k - 1, 604, 2, 124); } });"
],
[
"c.fillText(l + ' is the level of ' + LVX[l][0] + '.', MX, 790);",
"c.fillText(l + ' is the level of ' + LVX[l][0] + '.', MX, 754);"
],
[
"c.fillText('欧标' + l + ' 相当于' + LVX[l][1] + '水平。', MX, 814);",
"c.fillText('欧标' + l + ' 相当于' + LVX[l][1] + '水平。', MX, 778);"
],
[
"cefrOf(x.cefr))) ? 862 : 812;",
"cefrOf(x.cefr))) ? 822 : 780;"
]
]);
