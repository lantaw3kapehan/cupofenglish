// 756: (Misty) "I'm in" only from the class laptop — the working laptop is the standard. On a phone or tablet (or a browser that
// cannot share the screen) there is no "I'm in from here" any more: the sheet tells them to tap it on their class laptop.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const rep = (a, b) => { if (s.split(a).length !== 2) { console.error('not unique: ' + a.slice(0, 90)); process.exit(1); } s = s.replace(a, b); };
rep(`Tap “I'm in” on the laptop you teach on — it takes a picture of your VooV window as proof. From here it is saved but flagged for management to check.</div>
<button class="btn block" id="ciGo" style="margin-top:14px" onclick="classInGo('\${esc(id)}', false)">I'm in from here (flagged)</button>\`}\`);`,
`\${laptop ? 'Open the app in Chrome or Edge on this laptop, then tap “I\\'m in” again.' : '“I\\'m in” works only on your class laptop, the one you teach on. Open the app there and tap “I\\'m in”.'} Laptop not working? Message Ops right away so your class time is noted.</div>
<button class="btn ghost block" style="margin-top:14px" onclick="closeSheet()">OK</button>\`}\`);`);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
