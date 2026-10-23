// 719: (Misty) Punctuality card spells out the windows: Time in opens 40 min before the first class and is on time until 30 min before;
// "I'm in" opens 5 min before each class (e.g. :25 for a :30 class) and is on time until the class starts.
require('../tools/lib.js')(process.argv[2], [
['On time = timed in at least 30 minutes before your first class, and "I\\\'m in" before each class starts.', 'Time in opens 40 minutes before your first class · on time until 30 minutes before. \\"I\\\'m in\\" opens 5 minutes before each class (e.g. :25 for a :30 class) · on time until the class starts.'],
]);
