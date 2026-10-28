// 1534 · PH sign-in wording (28 Oct 2026, Misty 23:03): a Philippine learner's password is the FIRST WORD of their English name
// ("Maria" for "Maria Santos"; coe-student v23). The English access message, the Student access row and its note say so.
// China families: unchanged.
require('../tools/lib.js')(process.argv[2], [
  ["var n = String(x.name || '').trim() || 'there'", "var n = String(x.name || '').trim().split(/\\s+/)[0] || 'there'"],
  ["'Password: ' + n + ' (your first name, not case-sensitive)'", "'Password: ' + n + ' (your first name only, one word, not case-sensitive)'"],
  ["(x.own ? ' · own password set' : ' · password = English name')", "(x.own ? ' · own password set' : x.ph ? ' · password = first name (' + e(String(x.name || '').trim().split(/\\s+/)[0]) + ')' : ' · password = English name')"],
  ["They sign in the same way (ST code + English name) and see the portal in English with their learning roadmap.", "They sign in with the ST code and their first name only (one word, e.g. Maria for Maria Santos) and see the portal in English with their learning roadmap."]
]);
console.log('1534 PH first-name sign-in wording');
