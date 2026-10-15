// 15 Oct · Teachers' screens: Google-built screens (growth, pay check, pay ready, comments on notes, the feedback /
// progress-check / trial / peer forms) open from the database copy when it is recent, instead of asking Google again on
// every open. Messages stay live.
require('../tools/lib.js')(process.argv[2], [
["const SB_OKAGE = { mgmtTeacherVisits: 30 * 6e4,", "const SB_OKAGE = { tGrowth: 30 * 6e4, tPayCheck: 10 * 6e4, tPayReady: 10 * 6e4, tNoteComments: 10 * 6e4, tMyComments: 10 * 6e4, tFbForm: 15 * 6e4, tPcForm: 15 * 6e4, tTrialForm: 15 * 6e4, tPeerForm: 15 * 6e4, tStuClasses: 10 * 6e4, mgmtTeacherVisits: 30 * 6e4,"],
["const SB_BGAGE = { mgmtTeacherVisits: 30 * 6e4,", "const SB_BGAGE = { tGrowth: 30 * 6e4, tPayCheck: 10 * 6e4, tPayReady: 10 * 6e4, tNoteComments: 10 * 6e4, mgmtTeacherVisits: 30 * 6e4,"],
]);
