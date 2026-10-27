// 1341: Partner access sheet (management › Students › Partner access) now says what partners see after the 27 Oct schedule update:
//        each teacher's weekly schedule (open / booked; only the partner's own students are named), "who is free" for any day/time,
//        their own students' week, and shareable phone-shaped pictures. Text only — the partner page and the coe-partner function
//        (op "week") carry the feature.
const file = process.argv[2];
require('../tools/lib.js')(file, [[
  'and the teachers’ open times. No money, no teacher pay, no other families. Works in mainland China (no Google).',
  'and the teachers’ weekly schedules (open / booked — only their own students are named), who is free at any day and time, their own students’ week, and phone pictures to share in their WeChat groups. No money, no teacher pay, no other families. Works in mainland China (no Google).'
]]);
