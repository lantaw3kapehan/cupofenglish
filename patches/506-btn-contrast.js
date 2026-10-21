// 21 Oct · Student page (teacher): the "Class note" button under MORE was dark text on the dark premium button (unreadable).
// 499's dark pill now always carries white text, and the student page's action buttons keep their white outline style.
require('../tools/lib.js')(process.argv[2], [[
"body:not(.mgr) .btn:not(.ghost):not(.teal):not(.coral){background:linear-gradient(180deg,#3A2F6B,#2B2253)!important;box-shadow:0 6px 16px -8px rgba(43,34,83,.6)!important}",
"body:not(.mgr) .btn:not(.ghost):not(.teal):not(.coral){background:linear-gradient(180deg,#3A2F6B,#2B2253)!important;color:#fff!important;box-shadow:0 6px 16px -8px rgba(43,34,83,.6)!important}\nbody:not(.mgr) .stu-bar .btn:not(.ghost):not(.teal):not(.coral),body:not(.mgr) .stu-bar .btn.btn{background:#fff!important;color:#2B2253!important;border:1px solid #E3E1EC!important;box-shadow:none!important}   /* 506: the student page's action buttons stay white with dark text */"]]);
