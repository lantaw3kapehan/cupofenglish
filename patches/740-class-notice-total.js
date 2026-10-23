// 740: (Misty) Class notice shows the whole package: paid + free, carried-over lessons, and the TOTAL the parent can count on.
//   📘 OD1 Courseware
//   🎫 Package: 30 units + 3 free = 33 units
//   ➕ Carried over: 2 units
//   ✅ Total 共计: 35 units (50 min each) = 70 × 25-min classes · 共 70 节
// Free lessons come from the renewal ("30+3 paid") and can be typed in; carried over from ACTIVE.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const rep = (a, b) => { if (s.split(a).length !== 2) { console.error('not unique: ' + a.slice(0, 90)); process.exit(1); } s = s.replace(a, b); };
rep("Object.assign(x, { book: cnBookPick(bk0) || cnBook(bk0), bo: !!bk0 && !cnBookPick(bk0) ? 1 : 0, units: p.en, carry: p.carry || '',",
    "const fr = /^Renewed/.test(x.rn) ? String(x.rn).match(/(\\d+(?:\\.\\d+)?)\\s*\\+\\s*(\\d+(?:\\.\\d+)?)/) : null;\nObject.assign(x, { book: cnBookPick(bk0) || cnBook(bk0), bo: !!bk0 && !cnBookPick(bk0) ? 1 : 0, units: p.en, free: fr && Math.abs(+fr[1] + +fr[2] - +p.en) < 0.01 ? +fr[2] : '', carry: p.carry || '',");
rep("'\\n\\n📘 ' + (String(x.book || '').trim() ? String(x.book).trim() + ' ' : '') + 'Courseware | ' + fm(u) + ' units (50 min each) = ' + fm(u * 2) + ' × 25-min classes' +\n(c ? '\\n📝 ' + fm(c) + (c < 2 ? ' unit' : ' units') + ' × 50-min classes (carried over)' : '') +",
    "'\\n\\n📘 ' + (String(x.book || '').trim() ? String(x.book).trim() + ' ' : '') + 'Courseware' +\n'\\n🎫 Package: ' + (f > 0 && f < u ? fm(u - f) + ' units + ' + fm(f) + ' free = ' : '') + fm(u) + (u === 1 ? ' unit' : ' units') +\n(c ? '\\n➕ Carried over: ' + fm(c) + (c === 1 ? ' unit' : ' units') : '') +\n'\\n✅ Total 共计: ' + fm(u + c) + ' units (50 min each) = ' + fm((u + c) * 2) + ' × 25-min classes · 共 ' + fm((u + c) * 2) + ' 节' +");
rep("const x = CN, u = +x.units || 0, c = +x.carry || 0, fm = n => String(Math.round(n * 10) / 10);", "const x = CN, u = +x.units || 0, c = +x.carry || 0, f = +x.free || 0, fm = n => String(Math.round(n * 10) / 10);");
rep("<div class=\"row\" style=\"gap:8px\"><div class=\"grow\">${inp('units', 'Units (50 min each)', 'number')}</div><div class=\"grow\">${inp('carry', 'Carried over (units)', 'number')}</div></div>",
    "<div class=\"row\" style=\"gap:8px\"><div class=\"grow\">${inp('units', 'Package units (50 min each · paid + free)', 'number')}</div><div class=\"grow\">${inp('free', 'of which free', 'number')}</div><div class=\"grow\">${inp('carry', 'Carried over (units)', 'number')}</div></div>");
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
