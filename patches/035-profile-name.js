// Student profile: when the student record carries the code as its name (finished students), show the name from ACTIVE.
require('../tools/lib.js')(process.argv[2], [
[
"const nm = s.name || (() => {",
"const nm = (s.name && String(s.name).trim().toUpperCase() !== String(code).toUpperCase() ? s.name : '') || (() => {"
]
]);
