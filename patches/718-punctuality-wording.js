// 718: Punctuality card states the real rule: time in at least 30 minutes before the first class (CFG.TIMEIN_LEAD_MIN = 30).
require('../tools/lib.js')(process.argv[2], [
['On time = timed in before your first class, and "I\\\'m in" before each class.', 'On time = timed in at least 30 minutes before your first class, and "I\\\'m in" before each class starts.'],
]);
