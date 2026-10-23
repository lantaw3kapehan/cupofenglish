// 736: (Misty) class video card — no renaming: just upload; the app names and files it, and every video is checked automatically.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const rep = (a, b) => { if (s.split(a).length !== 2) { console.error('not unique: ' + a.slice(0, 90)); process.exit(1); } s = s.replace(a, b); };
rep("<span class=\"mute\">· here in the app · saved to the school Drive, not your storage · named and filed for you · not recorded? upload a screen proof instead</span>",
    "<span class=\"mute\">· just upload it here, no renaming · the app names and files it · every video is checked automatically (its fingerprint, length and recording time) · not recorded? upload a screen proof</span>");
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
