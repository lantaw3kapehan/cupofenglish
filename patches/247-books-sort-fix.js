// 16 Oct · Books library order: Foundation first, then Level 1, 2…; Raz F in alphabetical place; Short Vowels with Oxford Phonics.
require('../tools/lib.js')(process.argv[2], [
["[/^(thealphabet|shor?tvowels|longvowels|consonantblends|letter\\w*)$/, '#F6BF26', 'Oxford Phonics', 0, 1]", "[/^(thealphabet|\\w*vowels|consonantblends|letter\\w*)$/, '#F6BF26', 'Oxford Phonics', 0, 1]"],
["const okey = x => { const b = String(face(x).b); return /^(F|aa|K|All)$/.test(b) ? '0'", "const okey = x => { const F0 = face(x), b = String(F0.b); return (/^(aa|K|All)$/.test(b) || F0.l === 'Foundation') ? '0'"],
]);
