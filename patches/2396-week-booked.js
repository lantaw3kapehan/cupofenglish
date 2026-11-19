// 2396 (Misty 19 Nov 10:57): Students · A WEEK for a new student comes from the classes booked in the next 4 weeks ("booked"),
//   until there are past months of classes.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["return `<span class=\"sa-w${w.v < 1 ? ' lo' : ''}\" title=\"From the last ${w.n} month${w.n === 1 ? '' : 's'} of classes\">",
   "return `<span class=\"sa-w${w.v < 1 ? ' lo' : ''}\" title=\"${w.plan ? 'From the classes booked in the next 4 weeks (new student, no past months yet)' : 'From the last ' + w.n + ' month' + (w.n === 1 ? '' : 's') + ' of classes'}\">"],
  [">${w.v} unit${w.v === 1 ? '' : 's'}</small></span>`; };",
   ">${w.v} unit${w.v === 1 ? '' : 's'}${w.plan ? ' · booked' : ''}</small></span>`; };"]
]);
