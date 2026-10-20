// 20 Oct · The header message was cut off ("…Teacher of the Mon"). It now sits on two short lines (first sentence bold, the rest under it), never cut.
require('../tools/lib.js')(process.argv[2], [
  ["const h = '<span class=\"l\">' + esc(m.t) + '</span>",
   "const tx = String(m.t), cut = tx.search(/[.!] /), ic = tx.split(' ')[0], a = cut > 0 ? tx.slice(ic.length + 1, cut + 1) : tx.slice(ic.length + 1), bb = cut > 0 ? tx.slice(cut + 2) : '';\n" +
   "    const h = '<span class=\"l\"><span class=\"ic\">' + esc(ic) + '</span><span class=\"tx\"><b>' + esc(a) + '</b>' + (bb ? '<span class=\"sub\">' + esc(bb) + '</span>' : '') + '</span></span>"],
  ["'#cmHead.g{background:linear-gradient(135deg,#fff8dc,#f6d77a);color:#5a3d00;border-color:#d4a017}#cmHead .s{display:none}' +",
   "'#cmHead.g{background:linear-gradient(135deg,#fff8dc,#f6d77a);color:#5a3d00;border-color:#d4a017}#cmHead .s{display:none}' +\n" +
   "      '#cmHead{white-space:normal;border-radius:14px;padding:6px 14px;line-height:1.25}#cmHead .l{display:inline-flex;align-items:center;gap:9px}#cmHead .ic{font-size:20px}#cmHead .tx{display:flex;flex-direction:column;min-width:0}#cmHead .tx b{font-size:13.5px}#cmHead .sub{font-size:12px;font-weight:500;opacity:.85}' +"]
]);
