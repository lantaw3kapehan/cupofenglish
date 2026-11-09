// 2013 (9 Nov 17:11, Misty's screenshot): in the management chat the date pills of earlier days stayed stuck at the top and piled up
//   on each other ("Fri 6 Nov" over "Thu 5 Nov"). The date pill now simply sits where each day starts.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["#v-chat .ch:not(.tch) #chList .ch-day{position:sticky;top:0;z-index:2;align-self:center;", "#v-chat .ch:not(.tch) #chList .ch-day{position:static;align-self:center;"],
]);
