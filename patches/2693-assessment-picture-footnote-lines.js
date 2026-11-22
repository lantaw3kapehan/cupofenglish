// 2693 (Misty 22 Nov 14:15): the footnote on the assessment picture reads in two clean lines ("CEFR levels are approximate" on its own line)
require('../tools/lib.js')(process.argv[2] || 'app.html', [
  [`' assessment scales (0–5) · indicative level only · not an official Cambridge English result' : 'Internal estimate aligned with IELTS band descriptors · not an official IELTS result · CEFR levels are approximate', WD / 2, y + 10, WD - PAD * 2, 30);`,
   `' assessment scales (0–5) · indicative level only\\nNot an official Cambridge English result' : 'Internal estimate aligned with IELTS band descriptors · not an official IELTS result\\nCEFR levels are approximate', WD / 2, y + 10, WD - PAD * 2, 32);`],
]);
