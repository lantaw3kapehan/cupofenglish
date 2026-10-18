// 18 Oct · class comments (tNoteComments) and "my comments" (tMyComments) worked out by the database (coe LOOKUP, checked equal
// to Google's copies 18 Oct 17:56); a new comment reaches the database within ≈ 3 min (WT18, Version 401).
require('../tools/lib.js')(process.argv[2], [[
  "t(Student|Schedule|FbStatus|HwHist|Reminders|Goals|Leave|MyVisits|Msgs)|getBootstrap|dbRecord|dbLists)$/;",
  "t(Student|Schedule|FbStatus|HwHist|Reminders|Goals|Leave|MyVisits|Msgs|NoteComments|MyComments)|getBootstrap|dbRecord|dbLists)$/;"]]);
