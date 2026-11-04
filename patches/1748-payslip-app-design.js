// 1748: (Misty 4 Nov 16:40 "ensure the template for PAYSLIP is aligned with our APP's design") the database payslip uses the app's
//   design system (DESIGN-SYSTEM-2026-10-29): Inter body, Fredoka One only for the PAYSLIP title (brand), ink #2B2450 text, muted
//   #5E5A76 labels, section headings with the short teal bar, thin row lines, amounts tabular and right-aligned, key numbers in sunk
//   panels with their meaning colours (deductions red, net teal), card corners 14, no box inside a box. Same in the copied picture.
const file = process.argv[2];
const OLD_CSS = "const css = '<style>.ps1744{font:13px/1.45 system-ui,-apple-system,Segoe UI,sans-serif;color:#1d2433;max-width:720px;margin:0 auto}.ps1744 h2{margin:16px 0 6px;font-size:12px;letter-spacing:.08em;color:#00737B}.ps1744 table{width:100%;border-collapse:collapse}.ps1744 td{padding:5px 4px;border-bottom:1px solid #EEF0F4;vertical-align:top}.ps1744 .tot td{font-weight:700;border-bottom:2px solid #1d2433}.ps1744 .k{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:10px}.ps1744 .k div{background:#F1FAF9;border-radius:10px;padding:8px 10px}.ps1744 .k b{display:block;font-size:17px}.ps1744 .m{color:#6b7385;font-size:12px}</style>';";
const NEW_CSS = "const css = '<style>"
  + ".ps1744{font:400 14px/1.5 var(--coe-font,Inter,\"Noto Sans SC\",system-ui,-apple-system,\"Segoe UI\",sans-serif);color:#2B2450;max-width:760px;margin:0 auto;font-variant-numeric:tabular-nums}"
  + ".ps1744 .ttl{font-family:var(--coe-font-brand,\"Fredoka One\",\"Fredoka\",var(--coe-font,Inter),sans-serif);font-size:30px;line-height:1.2;color:#2B2450;letter-spacing:.06em;margin:4px 0 2px}"
  + ".ps1744 h2{margin:22px 0 8px;padding-left:10px;border-left:3px solid #01B0BF;font-size:16px;line-height:1.2;font-weight:600;color:#2B2450;letter-spacing:0;text-transform:none}"
  + ".ps1744 table{width:100%;border-collapse:collapse}"
  + ".ps1744 td{padding:8px 4px;border-bottom:1px solid #F0EEF5;vertical-align:top}"
  + ".ps1744 td:nth-child(n+2){text-align:right;white-space:nowrap}"
  + ".ps1744 .tot td{font-weight:600;border-top:1px solid #CFCBDD;border-bottom:none;padding-top:10px}"
  + ".ps1744 .k{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:14px}"
  + ".ps1744 .k div{background:#F7F7FA;border-radius:10px;padding:12px 14px}"
  + ".ps1744 .k b{display:block;font-size:22px;line-height:1.2;font-weight:600;margin-top:4px;color:#2B2450}"
  + ".ps1744 .k .kd b{color:#B42318}.ps1744 .k .kn b{color:#00707A}"
  + ".ps1744 .m{color:#5E5A76;font-size:13px}"
  + ".ps1744 .pr td{border-bottom:none;padding:2px 4px}.ps1744 .pr td:nth-child(n+2){text-align:left}"
  + ".ps1744 .pr b{font-size:16px;font-weight:600}"
  + "@media (max-width:560px){.ps1744 .k{grid-template-columns:1fr}.ps1744 .pr td{display:block;text-align:left!important}}"
  + "</style>';";
require('../tools/lib.js')(file, [
  [OLD_CSS, NEW_CSS],
  ["<b style=\"font-size:20px;letter-spacing:.12em\">PAYSLIP</b>", "<div class=\"ttl\">PAYSLIP</div>"],
  ["<div class=\"ps1744\" style=\"background:#fff;padding:18px 20px\">", "<div class=\"ps1744\" style=\"background:#fff;padding:24px;border:1px solid #E7E5EE;border-radius:14px\">"],
  ["+ '<h2>PERSONNEL</h2><table><tr>", "+ '<h2>Personnel</h2><table class=\"pr\"><tr>"],
  ["'<div class=\"k\"><div><span class=\"m\">Gross compensation</span>", "'<div class=\"k\"><div class=\"kg\"><span class=\"m\">Gross compensation</span>"],
  ["<div><span class=\"m\">Total deductions</span>", "<div class=\"kd\"><span class=\"m\">Total deductions</span>"],
  ["<div><span class=\"m\">Net compensation</span>", "<div class=\"kn\"><span class=\"m\">Net compensation</span>"],
  ["+ '<h2>COMPENSATION</h2>", "+ '<h2>Compensation</h2>"],
  ["+ '<h2>DEDUCTIONS</h2>", "+ '<h2>Deductions</h2>"],
  ["'</table><h2>STATUTORY</h2>", "'</table><h2>Statutory</h2>"],
]);
