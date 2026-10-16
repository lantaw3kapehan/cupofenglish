// 16 Oct · Change book: answers within ~25 s; a long schedule finishes in the background.
require('../tools/lib.js')(process.argv[2], [
["closeSheet(); toast(r.n ?", "closeSheet(); if(r.done === false) toast(`${r.book} from ${r.from} · ${r.n} classes changed now, the rest within a few minutes`); else toast(r.n ?"],
["btn.textContent = 'Renaming the classes · up to a minute…';", "btn.textContent = 'Renaming the classes…';"],
]);
