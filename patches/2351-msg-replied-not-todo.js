// 2351 (Misty 18 Nov: "if teachers replied or done with it, it shouldn't be showing" on Today): a management message the teacher has replied to counts as answered, not "needs your acknowledgement".
const file = process.argv[2];
require('../tools/lib.js')(file, [
["var need = r.role === 'mgmt' && r.need && !(r.ack && (r.ack !== 'now' || CONF[r.id])),", "var need = r.role === 'mgmt' && r.need && !(r.ack && (r.ack !== 'now' || CONF[r.id])) && !(t.replies || []).some(function(x){ return x.role !== 'mgmt'; }),"]
]);
