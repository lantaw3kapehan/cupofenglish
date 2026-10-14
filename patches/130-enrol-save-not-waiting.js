// 14 Oct night · Save enrolment did nothing while the payment list was still loading (Misty: "not sure if this saved").
// The button no longer waits silently: a transfer saves at once (it needs no SALES list); a payment says so in a toast.
require('../tools/lib.js')(process.argv[2], [
["window.enSave = async function(){ const S = ENS; if(!S || !S.info) return;",
 "window.enSave = async function(){ const S = ENS; if(!S) return; if(!S.info && !S.tr && !S.sale) return toast('Still reading SALES · try again in a few seconds');"],
]);
