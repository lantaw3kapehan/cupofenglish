// 2431 (Misty 19 Nov 15:27: "this would be hard for PRE-A1 … Phonics and early years") · Talk of the Day card: an "Early years" level
//   (Pre-A1: picture and words, point and say, sound of the day) next to YLE, Teens and Adults.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["var LV = { yle: 'YLE', teens: 'Teens', adults: 'Adults' };", "var LV = { early: 'Early years', yle: 'YLE', teens: 'Teens', adults: 'Adults' };"],
  ["k === 'yle' ? SC.china : k === 'teens' ? SC.stem : SC.ai", "k === 'early' ? SC.food : k === 'yle' ? SC.china : k === 'teens' ? SC.stem : SC.ai"]
]);
