// Fix: the staircase step indent rule was published as ".cj-{…}" (one letter lost in 062), so the steps on the student page were not staggered. Now ".cj-r{…}".
require('../tools/lib.js')(process.argv[2], [
[
".cj-{padding-left:var(--o)}",
".cj-r{padding-left:var(--o)}"
]
]);
