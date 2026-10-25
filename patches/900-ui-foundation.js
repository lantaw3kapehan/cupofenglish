// 900: (Misty, 25 Oct 14:26) "Improve the DESIGN screen by screen and tab by tab … using the updated Finance Overview as the
//      visual reference … preserve the Finance Overview font styles and sizes … centralize the approved styles".
// One shared design layer, copied from Finance Overview (patch 823 `.fx`), that every screen's redesign uses:
// · Tokens on :root: --ui-font (system sans + Chinese fallbacks, as Finance Overview), --ui-brand (Fredoka One, page titles only),
//   colours (ink #2f2752, teal #01b0bf/#00808B for actions, green income #2E7D5B, muted red expense #B5533C, line #E9E7F0,
//   mute #6B6782), radius 14px, card padding 14px 16px, gap 12px, control height 34px.
// · Classes (opt-in, nothing restyles itself): .ui-h (page title row), .ui-sub, .ui-card, .ui-ch (card header), .ui-k (KPI strip),
//   .ui-seg (segmented filter), .ui-pill (.ok .ac .no .mu .in .out), .ui-t (table), .ui-bar (filter row), .ui-note.
// · A light global pass on the app screens only: page titles h1 26px brand font in ink; card radius and shadows calmed to the
//   Finance look; .btn.sm 34px high; tabular numerals on figures. Documents (print / PDF / pictures) are not touched.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8'); const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 900 · CupOfEnglish UI foundation (Finance Overview look) */
(function(){ if(window.__900) return; window.__900 = 1;
  var ZH = '"PingFang SC","Hiragino Sans GB","Microsoft YaHei","Noto Sans SC",sans-serif';
  var css = [
    ':root{--ui-font:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,' + ZH + ';--ui-brand:"Fredoka One","Fredoka",-apple-system,"Segoe UI",Roboto,Arial,' + ZH + ';',
    '--ui-ink:#2f2752;--ui-teal:#01b0bf;--ui-teal-d:#00808B;--ui-in:#2E7D5B;--ui-in-b:#E8F4EE;--ui-out:#B5533C;--ui-out-b:#FBEDEA;--ui-ac:#97600F;--ui-ac-b:#FFF5E6;',
    '--ui-line:#E9E7F0;--ui-soft:#FAFAFD;--ui-tint:#F3F2F8;--ui-mute:#6B6782;--ui-r:14px;--ui-pad:14px 16px;--ui-gap:12px;--ui-ctl:34px}',
    '.ui-h{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:4px 0 12px}.ui-h h1{margin:0;font-family:var(--ui-brand);font-weight:400;font-size:26px;color:var(--ui-ink)}.ui-h .grow{flex:1}',
    '.ui-sub{font-family:var(--ui-font);font-size:13px;color:var(--ui-mute)}',
    '.ui-card{background:#fff;border:1px solid var(--ui-line);border-radius:var(--ui-r);padding:var(--ui-pad);margin-bottom:var(--ui-gap);box-shadow:none}',
    '.ui-ch{display:flex;align-items:center;gap:8px;margin-bottom:10px}.ui-ch h2{margin:0;font-family:var(--ui-font);font-size:15px;font-weight:700;color:var(--ui-ink)}.ui-ch .grow{flex:1}.ui-ch a{font-family:var(--ui-font);font-size:13px;font-weight:700;color:var(--ui-teal-d);cursor:pointer}',
    '.ui-k{display:grid;grid-template-columns:repeat(var(--n,4),minmax(0,1fr));background:#fff;border:1px solid var(--ui-line);border-radius:var(--ui-r);margin-bottom:var(--ui-gap);overflow:hidden}',
    '.ui-k>div{padding:12px 16px;border-left:1px solid var(--ui-line);min-width:0}.ui-k>div:first-child{border-left:0}',
    '.ui-k span{display:block;font-family:var(--ui-font);font-size:11.5px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:var(--ui-mute)}',
    '.ui-k b{display:block;font-family:var(--ui-font);font-variant-numeric:tabular-nums;font-size:22px;font-weight:700;color:var(--ui-ink);margin-top:3px;white-space:nowrap}.ui-k small{display:block;font-family:var(--ui-font);font-size:12px;color:var(--ui-mute);margin-top:2px}',
    '.ui-seg{display:inline-flex;background:#F1F0F6;border-radius:10px;padding:2px;height:var(--ui-ctl);box-sizing:border-box}.ui-seg button{border:0;background:none;padding:0 12px;border-radius:8px;font:700 13px var(--ui-font);color:var(--ui-mute);cursor:pointer}.ui-seg button.on{background:#fff;color:var(--ui-ink);box-shadow:0 1px 2px rgba(47,39,82,.12)}',
    '.ui-bar{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:10px}.ui-bar .grow{flex:1}.ui-bar select,.ui-bar input{height:var(--ui-ctl);border:1px solid var(--ui-line);border-radius:10px;background:#fff;padding:0 10px;font:13px var(--ui-font);color:var(--ui-ink);margin:0}',
    '.ui-pill{display:inline-block;font:700 11px/1.6 var(--ui-font);border-radius:999px;padding:1px 8px;white-space:nowrap;background:#F1F0F6;color:#5E5A75}.ui-pill.ok,.ui-pill.in{background:var(--ui-in-b);color:var(--ui-in)}.ui-pill.ac{background:var(--ui-ac-b);color:var(--ui-ac)}.ui-pill.no,.ui-pill.out{background:var(--ui-out-b);color:var(--ui-out)}',
    '.ui-t{width:100%;border-collapse:collapse;font-family:var(--ui-font);font-size:13.5px;font-variant-numeric:tabular-nums}.ui-t th{font-size:11px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:var(--ui-mute);text-align:left;padding:8px 10px;border-bottom:1px solid var(--ui-line);white-space:nowrap}.ui-t td{padding:9px 10px;border-bottom:1px solid #F3F2F7;text-align:left}.ui-t .r{text-align:right}',
    '.ui-note{font-family:var(--ui-font);font-size:12.5px;color:var(--ui-mute);margin:-2px 2px 10px}',
    '.ui-in{color:var(--ui-in)!important}.ui-out{color:var(--ui-out)!important}',
    /* light global pass, app screens only (#app), never documents */
    '#app main h1:not(.paper h1):not(.memo h1){font-family:var(--ui-brand);color:var(--ui-ink)}',
    '#app .btn.sm{min-height:var(--ui-ctl)}',
    '@media(max-width:900px){.ui-k{grid-template-columns:1fr 1fr!important}.ui-k>div:nth-child(odd){border-left:0}.ui-k>div:nth-child(n+3){border-top:1px solid var(--ui-line)}}',
    '@media(max-width:640px){.ui-h h1{font-size:22px}.ui-k b{font-size:18px}.ui-card{padding:12px}}'
  ].join('');
  var st = document.createElement('style'); st.id = 'ui900'; st.textContent = css; document.head.appendChild(st);
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
