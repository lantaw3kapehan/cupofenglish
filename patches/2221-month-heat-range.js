// 2221: Month view: the day tint follows the month's quietest → busiest day (was 0 → busiest, so every day looked the same);
// days of other months are blank.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
 ["      const r = x && x.n ? x.n / mx : 0;", "      const vs = Object.entries(D || {}).filter(([k]) => k.slice(0, 7) === m).map(([, z]) => +z.n || 0).filter(Boolean), mn = vs.length ? Math.min(...vs) : 0, r = x && x.n ? (mx > mn ? 0.12 + 0.88 * (x.n - mn) / (mx - mn) : 0.5) : 0;"],
 ["background:color-mix(in srgb,#00939D calc(var(--h)*16%),#fff);", "background:color-mix(in srgb,#00939D calc(var(--h)*22%),#fff);"],
 ["#v-schedule .mo04 .d.o{background:transparent;border:1px dashed #EEEDF4;cursor:default;box-shadow:none;transform:none;opacity:1}", "#v-schedule .mo04 .d.o{visibility:hidden}"],
 ["#v-schedule .mo04 .k i.heat{width:38px;background:linear-gradient(90deg,#fff,#D6EEF0);", "#v-schedule .mo04 .k i.heat{width:38px;background:linear-gradient(90deg,#F3FAFA,#C7E7E9);"]
]);
