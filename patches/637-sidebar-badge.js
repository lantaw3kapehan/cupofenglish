// 637: side menu Contracts / Notices of breach show a number badge (the full count text stays on the More page).
require('../tools/lib.js')(process.argv[2], [
[
"'<span class=\"nl\">' + label + '</span><span class=\"' + cnt + ' hide\" style=\"margin-left:auto;font-size:11px;font-weight:700;color:#B4472E;background:#FDECE7;border-radius:10px;padding:2px 8px;white-space:nowrap\"></span></button>';",
"'<span class=\"nl\">' + label + '</span><span class=\"' + cnt + ' hide\" style=\"display:none!important\"></span><span class=\"sb-n hide\" style=\"margin-left:auto;min-width:20px;text-align:center;font-size:11px;font-weight:700;color:#fff;background:#E0533D;border-radius:10px;padding:2px 6px\"></span></button>';"
],
[
"setInterval(put, 2000); setTimeout(put, 800);",
"/* the side menu shows only the number (the count text, e.g. \"1 to countersign · 2 to reply\", is summed) */\n  function num(){ document.querySelectorAll('#navIn .sb-rec').forEach(b => { const t = b.querySelector('.ct-cnt, .nt-cnt'), n = b.querySelector('.sb-n'); if(!t || !n) return; const v = t.classList.contains('hide') ? 0 : (String(t.textContent).match(/\\d+/g) || []).reduce((a, x) => a + (+x), 0);\n      n.textContent = v || ''; n.classList.toggle('hide', !v); b.title = (v ? t.textContent + ' · ' : '') + b.title.replace(/^.*? · (?=Who|Notices)/, ''); }); }\n  setInterval(() => { put(); num(); }, 2000); setTimeout(put, 800);"
]
]);
