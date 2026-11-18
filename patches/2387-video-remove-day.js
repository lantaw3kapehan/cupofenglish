// 2387: Wrong file · remove sends the class's date, so a recurring class clears only that day's video (coe_vid_remove p_day).
const file = process.argv[2];
require('../tools/lib.js')(file, [
["r = await vfCall({ action: 'vf_remove', id: x.id, reason: ((x.flags || [])[0] || {}).t || '' });",
 "r = await vfCall({ action: 'vf_remove', id: x.id, ds: x.ds || String(x.start || '').slice(0, 10), reason: ((x.flags || [])[0] || {}).t || '' });"]
]);
