// 2220 (14 Nov · Misty: "for the SCHEDULE can you please enhance the visual look and design, and all"): management Schedule.
// Month: header with ‹ › (and "This month"), stat tiles (classes, cancelled %, busiest day), days tinted by how busy they are,
// big class counts, cancelled / leave as chips, today as a teal circle, weekend columns marked, empty cells for other months.
// The view switch becomes a proper segmented control with icons; the explanation under it is shorter. Day strip and cards: softer.
const lib = require("../tools/lib.js"), file = process.argv[2], fs = require("fs");
const OLD = fs.readFileSync(__dirname + "/2220-old.txt", "utf8"), NEW = fs.readFileSync(__dirname + "/2220-new.txt", "utf8");
const CSS = String.raw`
<style id="css2220">
#v-schedule .mo04{margin:14px 0 22px;background:#fff;border:1px solid #ECEAF3;border-radius:20px;padding:20px 20px 16px;box-shadow:0 1px 2px rgba(43,34,83,.04),0 8px 24px rgba(43,34,83,.05)}
#v-schedule .mo04 .top{display:flex;align-items:center;gap:12px;margin-bottom:14px}
#v-schedule .mo04 .top .ttl{flex:1;display:flex;flex-direction:column;gap:2px;min-width:0}
#v-schedule .mo04 .top .ttl b{font-size:22px;font-weight:700;color:#2B2253;letter-spacing:-.01em;flex:none}
#v-schedule .mo04 .top .ttl span{font-size:13px;color:#6F6B85}
#v-schedule .mo04 .top .nav{display:inline-flex;border:1px solid #E3E1EC;border-radius:12px;overflow:hidden}
#v-schedule .mo04 .top .nav button{width:42px;height:40px;border:0;border-radius:0;background:#fff;font-size:20px;line-height:1;color:#2B2253;cursor:pointer}
#v-schedule .mo04 .top .nav button+button{border-left:1px solid #E3E1EC}
#v-schedule .mo04 .top .nav button:hover,#v-schedule .mo04 .top .tdy:hover{background:#F6F5FA}
#v-schedule .mo04 .top .tdy{height:40px;padding:0 14px;border:1px solid #E3E1EC;border-radius:12px;background:#fff;font:600 13.5px Inter,sans-serif;color:#00737B;cursor:pointer}
#v-schedule .mo04 .sts{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:0 0 16px}
#v-schedule .mo04 .st{background:#F7F6FB;border-radius:14px;padding:10px 14px;display:flex;flex-direction:column;gap:1px;min-width:0}
#v-schedule .mo04 .st span{font-size:11.5px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:#6F6B85}
#v-schedule .mo04 .st b{font-size:22px;font-weight:700;color:#2B2253;font-variant-numeric:tabular-nums}
#v-schedule .mo04 .st em{font-style:normal;font-size:12.5px;color:#6F6B85;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#v-schedule .mo04 .g{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:8px}
#v-schedule .mo04 .dw{font-size:11.5px;font-weight:600;color:#6F6B85;text-transform:uppercase;letter-spacing:.06em;padding:0 10px 2px}
#v-schedule .mo04 .dw.we{color:#00737B}
#v-schedule .mo04 .d{--h:0;position:relative;min-height:118px;border:1px solid #EEEDF4;border-radius:14px;padding:9px 10px 8px;display:flex;flex-direction:column;gap:2px;font-size:12px;color:#4A4566;background:#fff;
  background:color-mix(in srgb,#00939D calc(var(--h)*16%),#fff);box-sizing:border-box;overflow:hidden;cursor:pointer;text-align:left;font-family:inherit;transition:transform .12s ease,box-shadow .12s ease,border-color .12s ease}
#v-schedule .mo04 .d:hover{transform:translateY(-1px);box-shadow:0 6px 16px rgba(43,34,83,.10);border-color:#D9D6E6}
#v-schedule .mo04 .d:focus-visible{outline:2px solid #00A3AD;outline-offset:2px}
#v-schedule .mo04 .d.o{background:transparent;border:1px dashed #EEEDF4;cursor:default;box-shadow:none;transform:none;opacity:1}
#v-schedule .mo04 .d.past{filter:saturate(.55);opacity:.82}
#v-schedule .mo04 .d.past:hover{opacity:1;filter:none}
#v-schedule .mo04 .d .dt{display:flex;justify-content:space-between;align-items:center;gap:6px;margin-bottom:4px}
#v-schedule .mo04 .d .dt b{font-size:15px;font-weight:700;color:#2B2253;min-width:28px;height:28px;display:inline-flex;align-items:center;justify-content:center;border-radius:999px;margin:-3px 0 0 -4px}
#v-schedule .mo04 .d.td{border-color:#00A3AD;box-shadow:0 0 0 1px #00A3AD inset}
#v-schedule .mo04 .d.td .dt b{background:#00939D;color:#fff}
#v-schedule .mo04 .d.sel:not(.td){box-shadow:0 0 0 2px #2B2253 inset}
#v-schedule .mo04 .d .pk{font-size:11px;color:#6F6B85;background:rgba(255,255,255,.7);border-radius:999px;padding:1px 7px;white-space:nowrap}
#v-schedule .mo04 .d .pk::before{content:'Peak ';color:#9A96AE}
#v-schedule .mo04 .d .cn{font-size:10.5px;font-weight:700;line-height:1.2;border-radius:6px;padding:2px 6px;text-align:right;max-width:70%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#v-schedule .mo04 .d.k-h .cn{background:#FFE9E2;color:#A4402A}#v-schedule .mo04 .d.k-x .cn{background:#ECE9FB;color:#4A3FA8}#v-schedule .mo04 .d.k-i .cn{background:#E3F4F2;color:#00626A}
#v-schedule .mo04 .d.k-h{border-color:#F6D3C8}#v-schedule .mo04 .d.k-x{border-color:#DCD7F5}#v-schedule .mo04 .d.k-i{border-color:#C9E9E5}
#v-schedule .mo04 .d .n{font-size:12.5px;color:#4A4566}
#v-schedule .mo04 .d .n b{font-size:22px;font-weight:700;color:#2B2253;font-variant-numeric:tabular-nums;margin-right:3px;letter-spacing:-.01em}
#v-schedule .mo04 .d .sub{font-size:12px;color:#6F6B85;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#v-schedule .mo04 .d .ch{display:flex;flex-wrap:wrap;gap:4px;margin-top:auto;padding-top:5px}
#v-schedule .mo04 .d .ch:empty{display:none}
#v-schedule .mo04 .d .cx,#v-schedule .mo04 .d .lv{font-size:11px;font-weight:600;border-radius:999px;padding:2px 8px;line-height:1.35;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#v-schedule .mo04 .d .cx{background:#FCEDEA;color:#A6432E}
#v-schedule .mo04 .d .lv{background:#FFF4DE;color:#8A5A12}
#v-schedule .mo04 .k{display:flex;flex-wrap:wrap;gap:8px 18px;font-size:12.5px;color:#4A4566;margin-top:14px;padding-top:12px;border-top:1px solid #F1F0F6}
#v-schedule .mo04 .k span{display:flex;align-items:center;gap:7px}
#v-schedule .mo04 .k i{display:inline-block;width:16px;height:12px;border-radius:4px}
#v-schedule .mo04 .k i.heat{width:38px;background:linear-gradient(90deg,#fff,#D6EEF0);border:1px solid #E3E1EC}
#v-schedule .mo04 .k i.tdk{width:14px;height:14px;border-radius:999px;background:#00939D}
@media (max-width:900px){#v-schedule .mo04 .d{min-height:96px}#v-schedule .mo04 .d .sub{display:none}}
@media (max-width:640px){#v-schedule .mo04{padding:12px 10px;border-radius:16px}#v-schedule .mo04 .g{gap:4px}#v-schedule .mo04 .dw{padding:0 2px;font-size:10px;text-align:center}
  #v-schedule .mo04 .d{min-height:70px;padding:5px 4px;border-radius:10px;align-items:center;text-align:center}#v-schedule .mo04 .d .dt{justify-content:center;margin:0}#v-schedule .mo04 .d .dt b{font-size:13px;min-width:24px;height:24px;margin:0}
  #v-schedule .mo04 .d .pk,#v-schedule .mo04 .d .cn,#v-schedule .mo04 .d .sub,#v-schedule .mo04 .d .lv{display:none}#v-schedule .mo04 .d .n{font-size:0}#v-schedule .mo04 .d .n b{font-size:16px;margin:0}
  #v-schedule .mo04 .d .cx{font-size:0;padding:0;width:6px;height:6px;background:#D9705B}#v-schedule .mo04 .d .ch{justify-content:center;padding-top:2px}
  #v-schedule .mo04 .d.k-h{background:#FFF1EC}#v-schedule .mo04 .d.k-x{background:#F3F1FD}#v-schedule .mo04 .d.k-i{background:#EEF8F7}
  #v-schedule .mo04 .sts{gap:6px}#v-schedule .mo04 .st{padding:8px 10px}#v-schedule .mo04 .st b{font-size:17px}#v-schedule .mo04 .st em{display:none}#v-schedule .mo04 .top .ttl b{font-size:19px}}
/* view switch: segmented control with icons */
#v-schedule .vw03{margin:14px 0 4px!important;gap:12px!important}
#v-schedule .vw03>span:first-child{display:none}
#v-schedule .vw03>div{background:#F1F0F6!important;border-radius:14px!important;padding:4px!important;gap:2px!important}
#v-schedule .vw03>div button{display:inline-flex!important;align-items:center;gap:8px;padding:8px 16px 8px 13px!important;min-height:40px!important;border-radius:10px!important;font-size:14px!important;transition:background .12s ease,color .12s ease}
#v-schedule .vw03>div button::before{content:'';width:17px;height:17px;background:currentColor;-webkit-mask:var(--ic) center/contain no-repeat;mask:var(--ic) center/contain no-repeat;opacity:.85}
#v-schedule .vw03>div button:nth-child(1){--ic:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01'/%3E%3C/svg%3E")}
#v-schedule .vw03>div button:nth-child(2){--ic:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='M4 6h9M8 12h12M4 18h7'/%3E%3C/svg%3E")}
#v-schedule .vw03>div button:nth-child(3){--ic:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='4' width='18' height='18' rx='2'/%3E%3Cpath d='M16 2v4M8 2v4M3 10h18'/%3E%3C/svg%3E")}
#v-schedule .vw03>div button:not([style*="background:#fff"]):hover{background:rgba(255,255,255,.6)!important}
#v-schedule .vw03>span:last-child{font-size:12.5px!important;color:#8A86A0!important}
</style>
`;
lib(file, [[OLD, NEW], ["window.mo04M = d => { const [y, m] = (MM || ymd(new Date()).slice(0, 7)).split('-').map(Number);", "window.mo04M = d => { if(d === 0) MM = ymd(new Date()).slice(0, 7); const [y, m] = (MM || ymd(new Date()).slice(0, 7)).split('-').map(Number);"], ["\n</body>\n</html>", "\n" + CSS.trim() + "\n</body>\n</html>"]]);
