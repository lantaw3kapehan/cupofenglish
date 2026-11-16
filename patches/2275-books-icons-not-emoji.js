// 2275 (Misty 16 Nov 18:29 "ensure emojis are professional and not generic"): the Books screens (2270 extras, 2273 unit view)
// used emoji (📄 🔊 🎧 📘 ✏️ 🧑‍🏫 ✅ 📍). They are now simple line icons in the app's own style (same colour as the text).
const lib = require("../tools/lib.js"), fs = require("fs"), file = process.argv[2];
const sv = (p) => '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;flex:none">' + p + '</svg>';
const I = {
  page: sv('<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h4"/>'),
  audio: sv('<path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/>'),
  phones: sv('<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/>'),
  book: sv('<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/>'),
  pencil: sv('<path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4z"/>'),
  teacher: sv('<circle cx="12" cy="7" r="3.5"/><path d="M5 21v-1.5A5.5 5.5 0 0 1 10.5 14h3a5.5 5.5 0 0 1 5.5 5.5V21"/>'),
  check: sv('<circle cx="12" cy="12" r="9"/><path d="m8 12.5 2.8 2.8L16.5 9.5"/>'),
  pin: sv('<path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0c0 4.8-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>')
};
const MAP = [['🧑‍🏫', I.teacher], ['✏️', I.pencil], ['✅', I.check], ['📘', I.book], ['📍', I.pin], ['🎧', I.phones], ['🔊', I.audio], ['📄', I.page]];
const s = fs.readFileSync(file, 'utf8'), edits = [];
for (const id of ['b2270', 'b2273']) {
  const i = s.indexOf('<script id="' + id + '">'), j = s.indexOf('</script>', i);
  if (i < 0 || j < 0) { console.error('block ' + id + ' not found'); process.exit(1); }
  const old = s.slice(i, j); let nw = old.split('\n').map(l => /^\s*\/\*|^\s*Server:|^\s*[0-9]\. /.test(l) ? l : MAP.reduce((t, [e, v]) => t.split(e).join(v), l)).join('\n');
  edits.push([old, nw]);
}
lib(file, edits);
