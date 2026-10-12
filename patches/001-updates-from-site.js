// Phones check for new versions on this site (version.txt, app.html) instead of Apps Script.
require('../tools/lib.js')(process.argv[2], [
  ["fetch(API_URL + '?v=1', {cache:'no-store'})", "fetch('version.txt', {cache:'no-store'})"],
  ["fetch(API_URL + '?app=1', {cache:'no-store'})", "fetch('app.html', {cache:'no-store'})"],
]);
