// 22 Oct · Misty: the Independent Contractor contract in the teacher app ("so that there's transparency and they always see it",
// "official … not just something they see on their app", read, acknowledge and sign in the app; the President countersigns;
// the notarized scanned copy is attached later; date, time and browser location recorded; pops up only until signed).
// Teachers: Today banner + one pop-up per app opening while a document waits · Pay › My Contract · read · sign (tick, typed name,
//   drawn signature; IP always, location only if allowed) · question / do not agree · signing record · print for notarization.
// Management (More › Contracts): who has opened/signed · countersign (President) · attach notarized scan · record paper Agreements ·
//   Agreement details (legal name, address…) · send the full set to a new teacher · start again.
// Server: Supabase function coe-contract + tables coe_contract_docs / coe_contract_signs / coe_contract_people, bucket "contracts".
// The screen code is kept in 587-contracts.inc.txt (not .js, so the patch runner does not run it on its own).
const fs = require('fs'), path = require('path');
const inc = fs.readFileSync(path.join(__dirname, '587-contracts.inc.txt'), 'utf8');
require('../tools/lib.js')(process.argv[2], [
["</body>", inc + "\n</body>"],
]);
