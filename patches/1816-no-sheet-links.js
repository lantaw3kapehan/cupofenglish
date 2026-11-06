// 1816: final QA · the Google Sheet is only a backup now (Misty: the database and the app are the source of truth; Operations has
//   no sheet access since 4 Nov), so management screens no longer offer "Open in sheet ↗", and Packages says it is live from the
//   database (coe_active_screen), not "live from ACTIVE".
const fs = require('fs'), file = process.argv[2]; let s = fs.readFileSync(file, 'utf8');
const a = "const sheetLink = tab => URLS && URLS[tab] ? ` <a class=\"link small\" style=\"margin-left:auto;letter-spacing:0;text-transform:none;font-weight:400\" href=\"${esc(URLS[tab])}\" target=\"_blank\">Open in sheet ↗</a>` : '';";
if(s.split(a).length !== 2) throw new Error('sheetLink not found once');
s = s.replace(a, "const sheetLink = tab => '';   /* 1816: the sheet is a backup · no \"Open in sheet\" */");
const n = s.split('live from ACTIVE').length - 1; s = s.split('live from ACTIVE').join('live from the database');
const m = s.match(/const COE_V = (\d+);/); s = s.replace(m[0], 'const COE_V = ' + (+m[1] + 1) + ';'); console.log('ACTIVE labels ' + n + ' · COE_V ' + m[1] + ' → ' + (+m[1] + 1));
fs.writeFileSync(file, s);
