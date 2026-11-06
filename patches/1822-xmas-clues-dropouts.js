// 1822: (Misty 6 Nov 19:52–19:57) Christmas Secret Santa:
//   · "About me" clues in the sign-up form; the picker reads the clues + wishlist first, then taps "Reveal the name" (the wheel spins to it).
//   · Drop-outs: a teacher can tap "I can't come anymore"; management has "Can't come" per person. The giver of that person gets
//     that person's match and spins again ("Your match changed"), so everyone left still gives and receives one gift.
//     Wishlists stay exactly as written. Server coe-xmas v3 · coe_xmas_drop. The home card no longer shows the match's name.
const lib = require('../tools/lib.js'), fs = require('fs'), file = process.argv[2];
lib(file, JSON.parse(fs.readFileSync(__dirname + '/1822-xmas-clues-dropouts.pairs.json', 'utf8')));
