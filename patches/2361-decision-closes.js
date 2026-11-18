// 2361: Approve / Decline on a report from Operations also closes it (it leaves Waiting for you; she still sees the answer).
const file = process.argv[2];
require('../tools/lib.js')(file, [
["call({ op: 'answer', id: id, text: t, decision: dec, close: !!close })", "call({ op: 'answer', id: id, text: t, decision: dec, close: !!close || !!dec })"]
]);
