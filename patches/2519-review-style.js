// 2519: review page · no app heading bar before its title; Inter like the rest of the management screens.
const file = process.argv[2];
require('../tools/lib.js')(file, [['#rv2518{position:fixed;inset:0;z-index:9000;background:#F6F5FA;overflow:auto;-webkit-overflow-scrolling:touch}',
  '#rv2518{position:fixed;inset:0;z-index:9000;background:#F6F5FA;overflow:auto;-webkit-overflow-scrolling:touch;font-family:Inter,system-ui,-apple-system,sans-serif}\n#rv2518 h2::before,#rv2518 h2::after{content:none!important;display:none!important}\n#rv2518 label,#rv2518 .rs{font-weight:400}']]);
