// 22 Oct · Misty: the printable contract carries the CupOfEnglish letterhead (logo, company name, address, registration no.).
require('../tools/lib.js')(process.argv[2], [
[`'<div style="font-size:11px;color:#555">CupOfEnglish Online Tutorial Services OPC · ' + e(d.title) + ' · version ' + e(d.version) + ' · confidential</div>'`,
 `(() => { const i = document.querySelector('#login img, .tagl img, img[alt*="CupOfEnglish" i]'); const lg = i ? i.src : '';
    return '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px;border-bottom:2px solid #2B2253;padding-bottom:10px;margin-bottom:6px">' +
      (lg ? '<img src="' + lg + '" alt="CupOfEnglish" style="width:150px;height:auto;max-width:40%">' : '<b style="font-size:18px">CupOfEnglish</b>') +
      '<div style="font-size:10.5px;line-height:1.5;color:#444;text-align:right"><b>CupOfEnglish Online Tutorial Services OPC</b><br>MS2-102&amp;103 Bayani Hall Centrale, San Vicente East<br>Urdaneta City, Pangasinan, Philippines 2428<br>SEC Reg. No. 2022050053289-14 · works@cupofenglishatph.com</div></div>' +
      '<div style="font-size:11px;color:#555">' + e(d.title) + ' · version ' + e(d.version) + ' · confidential</div>'; })()`],
]);
