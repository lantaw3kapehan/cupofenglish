// 2426 (Misty 19 Nov 14:47: "Add CULTURE topics, EDUCATION, TRAVEL, DAILY and all") · Talk of the Day card knows the new topic labels.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["var ST = { china: 'Today in China', stem: 'STEM / STEAM', ai: 'AI literacy', think: 'Critical thinking', world: 'Real-world talk' };",
   "var ST = { china: 'Today in China', stem: 'STEM / STEAM', ai: 'AI literacy', think: 'Critical thinking', world: 'Real-world talk', culture: 'Culture & festivals', education: 'Education', travel: 'Travel', daily: 'Daily life', food: 'Food', sport: 'Sport', nature: 'Nature & animals' };"],
  ["think: ['#FCEDE8', '#B5432C'], world: ['#FFF1D6', '#8A5A00'] };",
   "think: ['#FCEDE8', '#B5432C'], world: ['#FFF1D6', '#8A5A00'], culture: ['#FDECEF', '#9C2F52'], education: ['#E9F1E4', '#3B6326'], travel: ['#E3F1FA', '#1D5A80'], daily: ['#F3EFE6', '#5E4F27'], food: ['#FFEDE0', '#8F4310'], sport: ['#E3F4EA', '#1F6236'], nature: ['#EDF6E4', '#3A6420'] };"]
]);
