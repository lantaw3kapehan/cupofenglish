// 16 Oct · The "Open · free" bar on a cancelled card is shown at full strength; the rest of the card stays faded.
require('../tools/lib.js')(process.argv[2], [
[".cls.x .cxo{filter:none}", ".cls.x .cxo{filter:none}.cls.x:has(.cxo){opacity:1}.cls.x:has(.cxo)>*:not(.grow),.cls.x:has(.cxo) .grow>*:not(.cxo){opacity:.55}"],
]);
