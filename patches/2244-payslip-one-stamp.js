// 2244 (Misty): the payslip showed the time twice (top "Generated …" and bottom "records as of …"). The bottom line now reads "System-generated payslip."
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [[
 "System-generated payslip · records as of ' + new Date().toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }) + '.</p></div>'",
 "System-generated payslip.</p></div>'"
]]);
