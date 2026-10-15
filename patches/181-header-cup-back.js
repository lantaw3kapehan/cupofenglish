// 15 Oct · The small cup logo beside the name in the header shows on laptops again (Misty asked; it was hidden on
// wide screens since 12 Oct because the sidebar shows the full logo). Teachers and management alike.
require('../tools/lib.js')(process.argv[2], [
["nav button .dot{position:static;margin-left:auto}\n.hd img{display:none}", "nav button .dot{position:static;margin-left:auto}\n.hd img{display:block;height:34px}"],
]);
