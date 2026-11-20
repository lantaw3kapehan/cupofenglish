// 2510: 2509 only for the rows the learner filter keeps (2509 also showed rows the filter hides).
const file = process.argv[2];
const sel = ['early', 'young', 'teen', 'adult'].map(k => '#v-astudents[data-ltf="' + k + '"] .li.sa.f2119[data-lb="' + k + '"]').join(',');
require('../tools/lib.js')(file, [[
  '<style id="s2509">#v-astudents[data-ltf] :is(a,div).li.sa.f2119{display:flex!important}@media(min-width:900px){#v-astudents[data-ltf] :is(a,div).li.sa.f2119{display:grid!important}}</style>',
  '<style id="s2509">' + sel + '{display:flex!important}@media(min-width:900px){' + sel + '{display:grid!important}}</style>']]);
