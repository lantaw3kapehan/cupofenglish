// 2575 (audit QA-10, verified 21 Nov): To do › "Students at risk 3" counted Sunny, whose parent asked for a break until 14 Feb 2027
// (kind 'riskp'). Paused students now sit in their own "Paused follow-ups" group, so the at-risk count is only students to act on.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["    ['risk', 'Students at risk', 'Send the parent a friendly WeChat message this week.', k => k === 'risk' || k === 'riskp'],",
   "    ['risk', 'Students at risk', 'Send the parent a friendly WeChat message this week.', k => k === 'risk'],\n    ['riskp', 'Paused follow-ups', 'Parent asked for a break · nothing to do until the date · back under Students at risk after it if still at risk.', k => k === 'riskp'],   /* 2575 */"],
  ["    risk: '<path d=\"M12 9v4\"/>",
   "    riskp: '<rect x=\"6\" y=\"4\" width=\"4\" height=\"16\" rx=\"1\"/><rect x=\"14\" y=\"4\" width=\"4\" height=\"16\" rx=\"1\"/>',\n    risk: '<path d=\"M12 9v4\"/>"],
  ["#o91fix .fx-trial{--fx-c:#00808B;", "#o91fix .fx-riskp{--fx-c:#8A87A0;--fx-bg:#F6F6F9;--fx-ring:#E3E2EA;--fx-t:#5C5974}\n#o91fix .fx-trial{--fx-c:#00808B;"],
]);
