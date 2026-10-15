// 15 Oct · Leave: "✓ All clear" stays on one line on phones.
require('../tools/lib.js')(process.argv[2], [
["#v-leave .lv2-ok b{font-family:var(--brand);font-weight:400;font-size:17px}", "#v-leave .lv2-ok b{font-family:var(--brand);font-weight:400;font-size:17px;white-space:nowrap}"],
]);
