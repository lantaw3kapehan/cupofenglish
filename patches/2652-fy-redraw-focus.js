// 2652: 2651's "never redraw For your decision while typing" also held the redraw while a tapped BUTTON had focus,
//   so a Followed up / Done stayed looking untapped. Now it holds only while a text box inside the card is being typed in.
const fs = require('fs'); const file = process.argv[2]; let h = fs.readFileSync(file, 'utf8');
const a = h.indexOf('<script id="b2630">'), b = h.indexOf('</script>', a); let s = h.slice(a, b);
const f = "if(o.__h !== h && !o.contains(document.activeElement)){ var t2", r = "if(o.__h !== h && !(o.contains(document.activeElement) && /^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName))){ var t2";
if (s.split(f).length !== 2) throw new Error('nf'); s = s.replace(f, r); h = h.slice(0, a) + s + h.slice(b); fs.writeFileSync(file, h);
require('../tools/lib.js')(file, []);
