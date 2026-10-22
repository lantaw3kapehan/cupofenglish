// 22 Oct · Misty: in Safari the per-page signatures did not show and "about:srcdoc" printed in the corner.
// The printable contract is now laid out as real A4 pages inside the preview: each page is its own sheet with the letterhead
// on page 1 and BOTH signatures in its own footer (no browser-dependent repeating), page numbers "Page n of N", no browser
// header/footer (margins 0). The signatures and the notary's Acknowledgment are kept whole on a page.
const fs = require('fs'); const file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const A = "      const html = '<!doctype html>", B = "      const f = $('ctPF');";
const i = s.indexOf(A), j = s.indexOf(B, i);
if(i < 0 || j < 0 || s.indexOf(A, i + 1) >= 0){ console.error('print html block not found once'); process.exit(1); }
const NEW = String.raw`      const lg = (() => { const im = document.querySelector('#login img, .tagl img, img[alt*="CupOfEnglish" i]'); return im ? im.src : ''; })();
      const yr = new Date().getFullYear(), tName = e(r.typed_name || r.teacher), pName = e(r.pres_name || 'Misty T. Dagyapen');
      const head = '<div class="lh">' + (lg ? '<img src="' + lg + '" alt="CupOfEnglish">' : '<b style="font-size:18px">CupOfEnglish</b>') +
        '<div class="co"><b>CupOfEnglish Online Tutorial Services OPC</b><br>MS2-102&amp;103 Bayani Hall Centrale, San Vicente East<br>Urdaneta City, Pangasinan, Philippines 2428<br>SEC Reg. No. 2022050053289-14 · works@cupofenglishatph.com</div></div>' +
        '<div class="dt">' + e(d.title) + ' · version ' + e(d.version) + ' · Confidential</div>';
      const sigs = '<div class="keep"><h3>Signatures</h3><table class="sg"><tr>' + sigBlock('Independent Contractor', r.typed_name || r.teacher, r.sig, r.signed_at, r.ip, r.loc) + sigBlock('For CupOfEnglish Online Tutorial Services OPC · President', r.pres_name || 'Misty T. Dagyapen', r.pres_sig, r.pres_at, r.pres_ip, r.pres_loc) + '</tr></table>' +
        '<p class="fp">Document fingerprint (SHA-256 of the text signed): ' + e(r.filled_hash || d.hash) + '. Sent ' + e(phT(r.sent_at)) + (r.opened_at ? ' · opened ' + e(phT(r.opened_at)) : '') + '.</p>' +
        '<h3>Signed in the presence of</h3><table class="wl"><tr><td class="ln"></td><td class="gap"></td><td class="ln"></td></tr><tr><td>Witness · Signature over printed name<br><small>Operations, CupOfEnglish</small></td><td class="gap"></td><td>Witness · Signature over printed name<br><small>Operations, CupOfEnglish</small></td></tr></table></div>';
      const ack = '<div class="keep"><h3>Acknowledgment</h3><p>REPUBLIC OF THE PHILIPPINES )<br>CITY OF URDANETA ) S.S.</p><p>BEFORE ME, a Notary Public, for and in the City of Urdaneta, personally appeared the aforementioned parties, whom I have identified through competent evidence of identity, who presented this instrument, which they signed electronically in the App on the dates stated above and signed before me, and declared that it is their free and voluntary act and deed.</p>' +
        '<table class="ct-t"><thead><tr><th>Name</th><th>Competent evidence of identity</th><th>Date and place issued</th></tr></thead><tbody><tr><td>' + tName + '<br><small>Independent Contractor</small></td><td></td><td></td></tr><tr><td>' + pName + '<br><small>President, CupOfEnglish Online Tutorial Services OPC</small></td><td></td><td></td></tr></tbody></table>' +
        '<p style="margin-top:14px">WITNESS MY HAND AND SEAL this ____ day of ______________ ' + yr + ' at Urdaneta City, Philippines.</p>' +
        '<p style="margin-top:18px">Doc. No. ____ ; Page No. ____ ; Book No. ____ ; Series of ' + yr + '.</p><p class="np">Notary Public</p></div>';
      const sm = (src, nm, role, right) => '<div class="fs' + (right ? ' r' : '') + '">' + (src ? '<img src="' + src + '" alt="">' : '<div class="bl"></div>') + '<span>' + nm + ' · ' + role + '</span></div>';
      const foot = sm(r.sig, tName, 'Independent Contractor') + '<div class="fm">' + e(d.title.split(' · ')[0]) + ' v' + e(d.version) + ' · ' + e(String(r.filled_hash || d.hash).slice(0, 12)) + '<br>Each page is signed by both parties · <b class="pn"></b></div>' + sm(r.pres_sig, pName, 'President', 1);
      const css = '@page{size:A4;margin:0}*{box-sizing:border-box}html,body{margin:0;padding:0}body{background:#E9E8EE;font-family:Georgia,serif;color:#111;font-size:12.5px;line-height:1.5;overflow-wrap:anywhere}' +
        '.page{width:210mm;height:297mm;background:#fff;margin:0 auto 14px;position:relative;padding:12mm 16mm 0;overflow:hidden;page-break-after:always;break-after:page}.page:last-child{page-break-after:auto;break-after:auto}' +
        '.pb{height:252mm;overflow:hidden}.pf{position:absolute;left:16mm;right:16mm;bottom:9mm;height:22mm;display:flex;gap:12px;align-items:flex-end;justify-content:space-between;border-top:1px solid #999;padding-top:4px;font-size:8.5px;color:#444;font-family:Georgia,serif}' +
        '.fs{width:42%;display:flex;flex-direction:column}.fs.r{align-items:flex-end;text-align:right}.fs img{height:30px;width:auto;max-width:100%}.fs .bl{height:30px;border-bottom:1px solid #333;width:150px}.fm{flex:1;text-align:center}' +
        '.lh{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;border-bottom:2px solid #2B2253;padding-bottom:8px;margin-bottom:6px}.lh img{width:150px;height:auto}.lh .co{font-size:10px;line-height:1.5;color:#444;text-align:right}.dt{font-size:10.5px;color:#555;margin-bottom:4px}' +
        'h2{font-size:18px;margin:10px 0 8px}h3{font-size:14px;margin:12px 0 6px}h4{font-size:12.5px;margin:10px 0 4px}p{margin:0 0 8px}ul,ol{margin:0 0 8px;padding-left:22px}li{margin:2px 0}p.ct-ai{padding-left:18px;text-indent:-18px}' +
        'table{border-collapse:collapse;width:100%;table-layout:fixed}.ct-t th,.ct-t td{border:1px solid #bbb;padding:4px 6px;font-size:11px;text-align:left;vertical-align:top}.ct-tw{margin:4px 0 10px}' +
        '.sg td{vertical-align:top;padding:8px;border:1px solid #ccc}.sg img{height:56px;max-width:100%;display:block;margin:4px 0}.fp{font-size:10px;color:#555;margin-top:6px}' +
        '.wl td{padding:0;font-size:11.5px;vertical-align:top}.wl .ln{height:44px;border-bottom:1px solid #333}.wl .gap{width:40px}.np{margin-top:28px;border-top:1px solid #333;width:260px;padding-top:4px}' +
        '#src{width:178mm;position:absolute;left:-9999px;top:0}@media print{body{background:#fff;zoom:1!important}.page{margin:0;box-shadow:none}}@media screen{.page{box-shadow:0 1px 6px rgba(0,0,0,.18)}}';
      const pager = '<scr' + 'ipt>(function(){var src=document.getElementById("src"),ft=document.getElementById("ft").innerHTML,pages=[],cur=null;' +
        'function np(){var p=document.createElement("div");p.className="page";p.innerHTML="<div class=\\"pb\\"></div><div class=\\"pf\\">"+ft+"</div>";document.body.appendChild(p);pages.push(p);cur=p.firstChild;return cur;}np();' +
        'var els=[].slice.call(src.children);els.forEach(function(el){cur.appendChild(el);if(cur.scrollHeight>cur.clientHeight+1&&cur.children.length>1){cur.removeChild(el);np().appendChild(el);}});' +
        'src.parentNode.removeChild(src);pages.forEach(function(p,i){var b=p.querySelector(".pn");if(b)b.textContent="Page "+(i+1)+" of "+pages.length;});' +
        'function fit(){var w=window.innerWidth;document.body.style.zoom=w<820?(w/820):"";}fit();window.addEventListener("resize",fit);})();</scr' + 'ipt>';
      const html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title> </title><style>' + css + '</style></head><body>' +
        '<div id="src">' + head + md(d.body) + sigs + ack + '</div><template id="ft">' + foot + '</template>' + pager + '</body></html>';
`;
s = s.slice(0, i) + NEW + s.slice(j);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, [
["title=\"Printable contract\" style=\"width:100%;height:72vh;", "title=\"\" style=\"width:100%;height:72vh;"],
]);
