// 2450 (Misty 16:47 "the TODAY screen of teachers is kinda messy, maybe the TODAY together with CHRISTMAS GIFT will be the header" ·
//   approved mock 16:49) · laptop Today for teachers: welcome line + Christmas card side by side as the header; warnings next; then the
//   day; Talk of the Day becomes a small card in the right column under Time-in (questions open with "Open · share with student").
//   Layout only (CSS grid + where our own Talk card is placed) · the 1104 arrange() order and all buttons stay as they are.
const file = process.argv[2];
const OLD = "if(!h){ if(o) o.remove(); } else if(!o || o.hasAttribute('data-c2368') || o.getAttribute('data-h') !== String(h.length) + lv){ if(o) o.remove(); var ld = v.querySelector('.lead');\n        (ld || v).insertAdjacentHTML(ld ? 'afterend' : 'afterbegin', h); var n = document.getElementById('talk2425'); if(n) n.setAttribute('data-h', String(h.length) + lv); } }";
const NEW = "if(!h){ if(o) o.remove(); } else { var sd = v.querySelector('.tcol-side');   /* 2450: laptop · small card in the right column under Time-in */\n" +
"        if(!o || o.hasAttribute('data-c2368') || o.getAttribute('data-h') !== String(h.length) + lv){ if(o) o.remove(); var ld = v.querySelector('.lead');\n        (ld || v).insertAdjacentHTML(ld ? 'afterend' : 'afterbegin', h); o = document.getElementById('talk2425'); if(o) o.setAttribute('data-h', String(h.length) + lv); }\n" +
"        if(o && sd){ var tin = sd.querySelector(':scope>.tin'), want = tin || null; if(want ? o.previousElementSibling !== want : sd.firstElementChild !== o){ if(want) want.after(o); else sd.prepend(o); } }\n" +
"        else if(o && !sd && o.parentNode !== v){ var ld2 = v.querySelector(':scope>.lead'); if(ld2) ld2.after(o); } } }";
const CSS = `<style id="u2450">
@media (min-width:1100px){
body.role-t.tw #v-today:not(.hide){display:grid!important;grid-template-columns:minmax(0,1fr) minmax(300px,380px);column-gap:20px;row-gap:14px;align-items:start}
body.role-t.tw #v-today:not(.hide)>*{grid-column:1/-1;margin-top:0!important;margin-bottom:0!important;min-width:0}
body.role-t.tw #v-today:not(.hide)>.lead{grid-column:1;grid-row:1;align-self:center}
body.role-t.tw #v-today:not(.hide):not(:has(>#x21c))>.lead{grid-column:1/-1}
body.role-t.tw #v-today:not(.hide)>#x21c{grid-column:2;grid-row:1;align-self:center;margin:0!important}
body.role-t.tw #v-today:not(.hide)>[hidden],body.role-t.tw #v-today:not(.hide)>i#top2002{display:none!important}
.tcol-side #talk2425{padding:14px 16px!important;margin:12px 0!important}
.tcol-side #talk2425>div:first-child{gap:6px!important}
.tcol-side #talk2425>div:first-child>b{font-size:15.5px!important;flex:1 1 100%}
.tcol-side #talk2425>div:first-child>span[style*="margin-left:auto"]{display:none!important}
.tcol-side #talk2425>div:first-child>svg{flex:none}
.tcol-side #talk2425>div:nth-child(2){display:block!important;margin-top:8px!important}
.tcol-side #talk2425>div:nth-child(2)>div:nth-child(2){display:none!important}
.tcol-side #talk2425>div:nth-child(2)>div:first-child>span{display:none!important}
.tcol-side #talk2425>div:nth-child(2)>div:first-child>b{font-size:15px!important}
.tcol-side #talk2425>div:last-child{margin-top:10px!important;padding-top:10px!important;gap:6px!important}
.tcol-side #talk2425>div:last-child .btn{min-height:36px!important;font-size:13.5px!important;padding:0 12px!important}
}
</style>
`;
require('../tools/lib.js')(file, [
  [OLD, NEW],
  ['<script id="b2278">', CSS + '<script id="b2278">']
]);
