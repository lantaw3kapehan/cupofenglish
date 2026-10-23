// 695: (Misty) Oxford Discover Futures, Wonders, and the adult books (Pathways, DK English for Everyone, Business Partner) as
// courseware; adult books form their own group "Adults". Short column names.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const rep = (a, b) => { if (s.split(a).length !== 2) { console.error('not unique: ' + a.slice(0, 90)); process.exit(1); } s = s.replace(a, b); };
rep("/^cw-(raz|re)$/.test(t.id) ? 'Reading'", "/^cw-(raz|re|wonders)$/.test(t.id) ? 'Reading' : /^cw-(pathways|dk|business)$/.test(t.id) ? 'Adults'");
rep("'Oxford Discover': '#5D8FD6',", "'Oxford Discover': '#5D8FD6', 'Adults': '#2B2253',");
rep("['Phonics', 'Reading', 'Oxford Discover', 'Books', 'Specializations', 'Trial classes']", "['Phonics', 'Reading', 'Oxford Discover', 'Adults', 'Books', 'Specializations', 'Trial classes']");
rep("'cw-raz': 'Raz-Kids',", "'cw-raz': 'Raz-Kids', 'cw-odf': 'OD Futures', 'cw-wonders': 'Wonders', 'cw-pathways': 'Pathways', 'cw-dk': 'DK English', 'cw-business': 'Business',");
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
