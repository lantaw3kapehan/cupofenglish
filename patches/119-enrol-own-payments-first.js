// 14 Oct night · Enrolled · paid: only this student's payments are shown (Misty: "why are Ethel's and Amy's payments
// there to choose?"). The list is every SALES payment of the last 45 days that no ACTIVE row points to; payments whose
// invoice name is another student's are now behind "Other payments (n)", so they can't be picked by mistake.
require('../tools/lib.js')(process.argv[2], [
["  const box = $('enPay'); box.insertAdjacentHTML('afterbegin', (x.sales || []).map(saleOpt).join(''));",
 "  const box = $('enPay'), mine = (x.sales || []).filter(y => nm && String(y.invoice || '').toLowerCase().indexOf(nm) > -1), oth = (x.sales || []).filter(y => mine.indexOf(y) < 0);\n" +
 "  box.insertAdjacentHTML('afterbegin', mine.map(saleOpt).join(''));\n" +
 "  if(oth.length) box.insertAdjacentHTML('afterend', '<div class=\"small\" style=\"margin-top:6px\"><button type=\"button\" class=\"btn ghost sm\" onclick=\"this.parentNode.nextElementSibling.classList.toggle(\\'hide\\')\">Other payments (' + oth.length + ') · not ' + esc(name) + '\\'s</button></div><div class=\"rnl hide\">' + oth.map(saleOpt).join('') + '</div>');"],
]);
