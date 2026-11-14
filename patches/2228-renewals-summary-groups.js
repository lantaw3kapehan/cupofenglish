// 2228: Renewals due summary: "Not reminded yet" and "Waiting for a reply" count only Act now and This month (Coming up can wait);
// "said renewing" = the Renewing group.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [["      const t = r.textContent || ''; if(/\\bRenewing\\b|said renewing/i.test(t)) st.yes++; else if(/Copy reminder again|Reminder sent/i.test(t)) st.wait++; else st.not++; });",
 "      const t = r.textContent || ''; if(r.classList.contains('yes')) st.yes++; else if(!r.classList.contains('now') && !r.classList.contains('soon')) return; else if(/Copy reminder again|Reminder sent/i.test(t)) st.wait++; else st.not++; });"],
 ["'<div class=\"w\"><span>Not reminded yet</span><b>' + st.not + '</b><em>copy the reminder below</em></div>'", "'<div class=\"w\"><span>Not reminded yet</span><b>' + st.not + '</b><em>act now and this month</em></div>'"]]);
