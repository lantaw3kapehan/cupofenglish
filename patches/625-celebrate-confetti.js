// 625: Celebrate picture · confetti only along the left and right edges (it was landing on the logo, title and footer).
require('../tools/lib.js')(process.argv[2], [
["for(let n = 0; n < 70; n++){ const px = 40 + rnd() * (W - 80), py = 40 + (n < 52 ? rnd() * 300 : 860 + rnd() * 200), r = 4 + rnd() * 7; if(py > 150 && py < 300 && px > 200 && px < 700) continue;",
 "for(let n = 0; n < 64; n++){ const px = n % 2 ? 48 + rnd() * 80 : W - 128 + rnd() * 80, py = 60 + rnd() * (H - 140), r = 4 + rnd() * 7;"]
]);
