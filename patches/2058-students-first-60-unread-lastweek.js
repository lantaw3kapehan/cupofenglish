// 2058 (10 Nov 12:52, Misty: "yes do 1-3 now"). Display only.
//   1 · Students (management) draws the first 60 active students, then "Show all 220 students" (it drew every row at once: 24,881 px).
//       Search, filters and sorting work on everyone, as before.
//   2 · Notices & requests: no "Unread 0" button when nothing is unread.
//   3 · Overview › Last week: the three tiles sit in one row (one was alone on a second row); phones keep wrapping.
const file = process.argv[2];
require('../tools/lib.js')(file, [
[
"h += L.slice(0, 250).map(",
"h += L.slice(0, (q || (STF && STF !== 'active')) ? 250 : (window.ASLIM2058 || 60)).map(   /* 2058: the first 60, then Show all */"
],
[
"if(tb && !tb.querySelector('.un23')){",
"if(tb && !tb.querySelector('.un23') && (n || ONLY)){   /* 2058: no \"Unread 0\" */"
],
[
"仍保留在课程包中。</div>'; };\n})();\n</script>\n<style id=\"st2056\">",
"仍保留在课程包中。</div>'; };\n})();\n</script>\n<style id=\"st2058\">/* 2058: Overview › Last week tiles side by side in one row */\n#v-home section.ov-card .row:has(> div[style*=\"flex:1 1 130px\"]){display:flex!important;flex-wrap:nowrap!important;gap:10px!important}\n#v-home section.ov-card .row > div[style*=\"flex:1 1 130px\"]{flex:1 1 0!important;min-width:0!important}\n@media(max-width:640px){#v-home section.ov-card .row:has(> div[style*=\"flex:1 1 130px\"]){flex-wrap:wrap!important}#v-home section.ov-card .row > div[style*=\"flex:1 1 130px\"]{flex:1 1 130px!important}}\n.as2058{display:block;width:100%;margin:12px 0 4px;padding:12px;border:1.5px dashed var(--line,#E4E2EC);border-radius:14px;background:#fff;font:inherit;font-weight:700;color:#00707A;cursor:pointer}</style>\n<script>\n/* 2058 (10 Nov, Misty: \"yes do 1-3 now\"): Students shows the first 60 active students (the page drew all 220 rows, 24,881 px);\n   \"Show all\" draws the rest. Search, filters and sorting still look at everyone (sorting happens before the first 60 are taken). */\n(function(){\n  const r = window.renderAStudents; if(typeof r !== 'function') return;\n  window.renderAStudents = function(){ const x = r.apply(this, arguments);\n    try{ const v = document.getElementById('v-astudents'); if(!v || window.ASLIM2058 || v.querySelector('.as2058')) return x;\n      const rows = v.querySelectorAll('.li[onclick^=\"openStudent\"]'), m = (v.textContent.match(/(\\d+) active/) || [])[1], tot = +m || 0;\n      if(rows.length === 60 && tot > 60){ const b = document.createElement('button'); b.type = 'button'; b.className = 'as2058'; b.textContent = 'Show all ' + tot + ' students';\n        b.onclick = () => { window.ASLIM2058 = 1e4; renderAStudents(); }; rows[rows.length - 1].after(b); } }catch(e){}\n    return x; };\n})();\n</script>\n<style id=\"st2056\">"
]
]);
