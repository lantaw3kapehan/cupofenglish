// 20 Oct · Age chip in English only (Misty: the profile is for management only).
require('../tools/lib.js')(process.argv[2], [
["a && a.age != null ? `<span class=\"chip age-chip\">${a.age} yrs · ${a.age}岁${a.grade ? ' · ' + esc(a.grade) : ''}</span>`", "a && a.age != null ? `<span class=\"chip age-chip\">${a.age} yrs old${a.grade ? ' · ' + esc(a.grade) : ''}</span>`"],
["a.age + ' yrs · ' + a.age + '岁</span>'", "a.age + ' yrs old</span>'"]]);
