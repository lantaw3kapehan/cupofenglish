// 2129 (12 Nov audit): student page › Package card.
// · "Package ACTIVE" (sheet name) next to a "✓ Active" chip: now just "Package".
// · Dates read "deadline 2027-03-15 · started 2026-11-15": now "valid until 15 Mar 2027 · started 15 Nov 2026", like the rest of the app.
// · "Last 45 days · 1 classes": now "1 class".
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
  ["const h1587 = '<h2>Package <span class=\"c\">ACTIVE</span></h2>'", "const dd2129 = s => { const m = String(s || '').match(/^(\\d{4})-(\\d{2})-(\\d{2})/); return m ? new Date(+m[1], +m[2] - 1, +m[3]).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : String(s || ''); };\n    const h1587 = '<h2>Package</h2>'"],
  ["(r[C.deadline] ? ' · deadline ' + esc(r[C.deadline]) : '') + (r[C.start] ? ' · started ' + esc(r[C.start]) : '')", "(r[C.deadline] ? ' · valid until ' + esc(dd2129(r[C.deadline])) : '') + (r[C.start] ? ' · started ' + esc(dd2129(r[C.start])) : '')"],
  ["Last 45 days · ${past.length} classes", "Last 45 days · ${past.length} class${past.length === 1 ? '' : 'es'}"],
]);
