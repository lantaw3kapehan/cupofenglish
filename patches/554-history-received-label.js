// 21 Oct · Misty: confirmations follow the public price; SALES records what the partner actually remits.
// QuickBooks history rows show the SALES amount, so partner rows get a small "received · partner price" note under it.
require('../tools/lib.js')(process.argv[2], [
["<td class=\"n\">${h.amt ? '¥' + n2(h.amt) : ''}</td>", "<td class=\"n\">${h.amt ? '¥' + n2(h.amt) + (h.partner && !/cupofenglish/i.test(h.partner) ? '<div class=\"small mute\">received · partner price</div>' : '') : ''}</td>"],
["QuickBooks history · from SALES · read only</td>", "QuickBooks history · from SALES · read only · amounts are what we received</td>"],
]);
