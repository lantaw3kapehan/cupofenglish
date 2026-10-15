// 15 Oct · Teacher cards: wider (3 per row on a laptop) so names never cut off.
require('../tools/lib.js')(process.argv[2], [
["body #v-teachers .tc2-g{grid-template-columns:repeat(auto-fill,minmax(230px,1fr));", "body #v-teachers .tc2-g{grid-template-columns:repeat(auto-fill,minmax(290px,1fr));"],
]);
