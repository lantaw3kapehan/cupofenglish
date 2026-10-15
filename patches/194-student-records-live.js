// 15 Oct night · Student records (DATABASE) come from the database: the list, a record's edit form and the form's lists
// open at once, and an edit of an existing student shows straight away (Google writes the sheet a minute later).
// New students (and an edit that links a trial) still go to Google directly.
require('../tools/lib.js')(process.argv[2], [
["|Leave|Msgs)|t(Student|Schedule|FbStatus|HwHist|Reminders|Goals|Leave|MyVisits|Msgs)|getBootstrap)$/;",
 "|Leave|Msgs|Database)|t(Student|Schedule|FbStatus|HwHist|Reminders|Goals|Leave|MyVisits|Msgs)|getBootstrap|dbRecord|dbLists)$/;"],
["!(fn === 'mgmtMsgSend' && args[4])); }   /* memos: Google */", "!(fn === 'mgmtMsgSend' && args[4]) && !(fn === 'saveStudent' && (!Number(args[2]) || !args[1] || args[1].linkTrial))); }   /* memos and new students: Google */\nFAST_M.saveStudent = 1;   /* 15 Oct night: edits of a student record */"],
["const FF_L = { mgmtReportSent: 'Report sent',", "const FF_L = { saveStudent: 'Student record', mgmtReportSent: 'Report sent',"],
["  if(fn === 'mgmtReportSent') return", "  if(fn === 'saveStudent'){ const c = String((args[1] || {}).code || ''); try{ Object.keys(SB_FRESH).forEach(k => { if(/(mgmtDatabase|dbRecord|mgmtStudents?)\\|/.test(k)) delete SB_FRESH[k]; }); }catch(e){} return { ok: true, queued: true, code: c, row: Number(args[2]) || 0, linked: 0, note: 'Saved ' + c + ' · ' + who }; }\n  if(fn === 'mgmtReportSent') return"],
]);
