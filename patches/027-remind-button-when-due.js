// Class cards: the Remind button shows only while a reminder is due and not sent yet (early, then again at 10 minutes);
// once sent only the "Reminded · who · time" chip stays.
require('../tools/lib.js')(process.argv[2], [
[
"${scRemChips(e)}${!e.cancelled && now < new Date(e.end).getTime() ?",
"${scRemChips(e)}${(st => st && !scSent(e, st))(scStage(e)) ?"
]
]);
