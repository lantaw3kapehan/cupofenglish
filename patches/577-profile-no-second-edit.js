// 22 Oct · Misty: "Edit details is repetitive here" — the Profile tab no longer adds its own Edit details button
// (Manage › Edit details stays, one place).
require('../tools/lib.js')(process.argv[2], [
["      if(ph && !ph.querySelector('.s2-edit')){ const lk = ph.querySelector('a'); (lk || ph).insertAdjacentHTML(lk ? 'beforebegin' : 'beforeend', btn(STU.code, 'teal')); }",
 "      /* 577: Profile heading keeps no second Edit details (Manage has it) */"],
]);
