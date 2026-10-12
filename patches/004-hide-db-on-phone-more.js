// Phones: hide "Database sheet" from the More list (it stays as a link at the top of Students), same as on computers.
require('../tools/lib.js')(process.argv[2], [
  ["NAV_M.filter(x=>x[3]===1 && (x[0] !== 'mypay'", "NAV_M.filter(x=>x[3]===1 && x[0] !== 'db' && (x[0] !== 'mypay'"],
]);
