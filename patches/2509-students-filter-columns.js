// 2509 (Misty 13:23 screenshot): with a learner filter on (Early Years, Teens...), the shown rows were set back to the browser's default
//   display, so level / lessons left / a week / valid until stacked under the name instead of sitting in their columns.
const file = process.argv[2];
const CSS = '<style id="s2509">#v-astudents[data-ltf] :is(a,div).li.sa.f2119{display:flex!important}'
 + '@media(min-width:900px){#v-astudents[data-ltf] :is(a,div).li.sa.f2119{display:grid!important}}</style>';
require('../tools/lib.js')(file, [['<script id="b2278">', CSS + '<script id="b2278">']]);
