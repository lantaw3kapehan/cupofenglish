// 2189 (13 Nov · Misty: her deductions are the usual SSS, Pag-IBIG and PhilHealth): My pay says government contributions are taken
// from her pay as part of her deductions (2180 said they were paid by CupOfEnglish, which the payroll records do not support).
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [["${p.govEmployer ? ', paid by CupOfEnglish and not taken from your pay' : ''}",
  "${p.govEmployer ? ', taken from your pay as part of your deductions' + (cur.govEst ? ' (already counted in this estimate)' : '') : ''}"]]);
