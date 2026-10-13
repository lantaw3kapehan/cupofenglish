// CEFR picture chart in the words Chinese parents use: header "雅思 · 剑桥英语", "IELTS 4.5–5.5" → "雅思 4.5–5.5" (KET / PET / FCE stay, parents use those letters).
require('../tools/lib.js')(process.argv[2], [
["b = T.wrap(m[3] || '', c4 - 24, rf)", "b = T.wrap(String(m[3] || '').replace(/^IELTS /, '雅思 '), c4 - 24, rf)"],
["['IELTS · Cambridge', c1 + c2 + c3]", "['雅思 · 剑桥英语', c1 + c2 + c3]"]
]);
