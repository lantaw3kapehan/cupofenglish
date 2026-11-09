// 2037 (9 Nov 21:32, Misty: "the activity log is like that now on teacher's access"): a teacher tapping Activity log got her
//   Today screen. 1997 (teachers never open management screens) listed "act" by mistake; the teacher's Activity log uses the same
//   screen name. Removed from the list: the screen opens again and shows only her own actions (the server answers with her own only).
const file = process.argv[2];
require('../tools/lib.js')(file, [
 ["|expenses|finov|wallets|forecast|gov|act)$/;", "|expenses|finov|wallets|forecast|gov)$/;   /* 2037: 'act' is also the teacher's own Activity log */"]
]);
