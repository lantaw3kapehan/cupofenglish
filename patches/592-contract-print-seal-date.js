// 22 Oct · 591 follow-up: the notary's closing line has blanks for the day and month.
require('../tools/lib.js')(process.argv[2], [
["WITNESS MY HAND AND SEAL on the date and place first written above.", "WITNESS MY HAND AND SEAL this ____ day of ______________ ' + new Date().getFullYear() + ' at Urdaneta City, Philippines."],
]);
