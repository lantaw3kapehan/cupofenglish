// 2703 (Misty 22 Nov 16:59): "Done" / "Followed up" on For your decision stayed visible for long items (validity with Celine's notes):
// the server keeps the item's signature cut to 300 characters, the screen compared it with the full one. Both now use the same 300.
require('../tools/lib.js')(process.argv[2] || 'app.html', [
  [`L.forEach(function(x){ x.sig = x.n + '|' + x.s; var m = M[x.k];`, `L.forEach(function(x){ x.sig = (x.n + '|' + x.s).slice(0, 300); var m = M[x.k];`],
]);
