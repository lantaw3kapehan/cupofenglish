// 21 Oct · Overview on a phone: the "Nothing needs you / To do ›" bar was wider than the screen (the page slid sideways). It wraps now.
require('../tools/lib.js')(process.argv[2], [["body.mgr .ovc .x-glance{display:none!important}",
"body.mgr .ovc .x-glance{display:none!important}\n@media(max-width:560px){body.mgr #v-home .x-todo{flex-wrap:wrap;row-gap:4px}body.mgr #v-home .x-todo b{min-width:0;flex:1 1 calc(100% - 30px);white-space:normal}body.mgr #v-home .x-todo span{flex-basis:100%;min-width:0;white-space:normal;margin-left:0}body.mgr #v-home .x-todo em{margin-left:auto}}"]]);
