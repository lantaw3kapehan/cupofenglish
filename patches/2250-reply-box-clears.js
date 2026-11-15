// 2250 (Misty): after "Send reply" the sent text came back in the Reply box. The reply panel re-opens at once (before the save
// finishes), and the "unsent draft" keeper (1464) saw the typed text and put it back. The box is now emptied first, so nothing comes back.
// Same for the teacher's reply box. If sending fails, the text is still put back as before ("your reply is kept").
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
 ["if(th){ th.replies.push(loc); th.lastAt = loc.at; }\nmsgOpen(id); toast('✓ Sent');", "if(th){ th.replies.push(loc); th.lastAt = loc.at; }\n{ const R0 = $('mgR'); if(R0) R0.value = ''; } msgOpen(id); toast('✓ Sent');"],
 ["if(th){ th.replies.push(loc); th.lastAt = loc.at; }\ntMsgOpen(parent); toast('✓ Sent');", "if(th){ th.replies.push(loc); th.lastAt = loc.at; }\n{ const R0 = $('tmR'); if(R0) R0.value = ''; } tMsgOpen(parent); toast('✓ Sent');"]
]);
