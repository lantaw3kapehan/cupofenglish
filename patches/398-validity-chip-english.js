// 20 Oct · "Validity ended … · extended N days" chips on our own screens in English only (Misty); the Chinese stays on the lesson summary picture for parents (vnLine).
require('../tools/lib.js')(process.argv[2], [
  ["extended ${-x.dlN} day${x.dlN === -1 ? '' : 's'} · 已延长${-x.dlN}天</span>", "extended ${-x.dlN} day${x.dlN === -1 ? '' : 's'}</span>"],
  [" · 已延长${v.days}天", ""]]);
