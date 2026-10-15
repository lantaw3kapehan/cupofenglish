// 15 Oct night · The white cup sits fully inside the dark card (Payroll and Sales & costs), not cut by the edges.
const css = ".mx-cup,.py-cup{right:22px!important;top:50%!important;bottom:auto!important;transform:translateY(-50%);height:calc(100% - 40px)!important;width:auto!important;max-width:38%;max-height:220px;object-fit:contain;opacity:.12!important}\\n@media(max-width:640px){.mx-cup,.py-cup{right:14px!important;height:calc(100% - 28px)!important;max-height:150px;opacity:.09!important}}";
require('../tools/lib.js')(process.argv[2], [
["\n</script>\n\n</body>", "\n</script>\n<script>\n(function(){ const s = document.createElement('style'); s.textContent = \"" + css + "\"; document.head.appendChild(s); })();\n</script>\n\n</body>"],
]);
