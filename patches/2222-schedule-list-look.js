// 2222 (14 Nov · Misty: "enhance the visual look and design, and all"): Schedule › List gets the same look as Month:
// day strip as cards (selected day filled teal), bigger numbers in the day summary with "Next" as a pill, hour headers as teal
// time pills with a rule, each class as a rounded card with a thicker book-colour bar. The duplicate "Timeline" button above the
// list is hidden (the View switch at the top has it).
const lib = require("../tools/lib.js"), file = process.argv[2];
const CSS = String.raw`
<style id="css2222">
#v-schedule .s2-wk{gap:8px}
#v-schedule .s2-d{border-radius:14px!important;border:1px solid #ECEAF3!important;background:#fff!important;transition:transform .12s ease,box-shadow .12s ease;box-shadow:0 1px 2px rgba(43,34,83,.04)}
#v-schedule .s2-d:hover{transform:translateY(-1px);box-shadow:0 6px 14px rgba(43,34,83,.08)}
#v-schedule .s2-d span{font-size:12px!important;letter-spacing:.03em;color:#6F6B85!important}
#v-schedule .s2-d b{font-size:20px!important;color:#2B2253!important}
#v-schedule .s2-d em{font-style:normal;font-size:11.5px!important;color:#6F6B85!important}
html body #v-schedule .s2-wk a.s2-d.on:not(#z2222):not(#y2222){background:#00939D!important;border-color:#00939D!important;box-shadow:0 6px 16px rgba(0,147,157,.28)!important}
html body #v-schedule .s2-wk a.s2-d.on:not(#z2222):not(#y2222):not(#x2222) :is(span,b,em,s){color:#fff!important;-webkit-text-fill-color:#fff!important}
#v-schedule .s2-d.td:not(.on){border-color:#00A3AD!important}
#v-schedule .s2-ar{border-radius:12px!important;border:1px solid #E3E1EC!important;background:#fff!important}
#v-schedule .s2-sum{padding:14px 18px!important;gap:6px 26px!important;border-radius:16px!important}
#v-schedule .s2-sum>span:not(.nx){display:inline-flex;align-items:baseline;gap:6px;color:#6F6B85}
#v-schedule .s2-sum>span:not(.nx) b{font-size:24px;font-weight:700;color:#2B2253;font-variant-numeric:tabular-nums}
#v-schedule .s2-sum>span:not(.nx) b.minus{color:#B4483A}
#v-schedule .s2-sum .nx{margin-left:auto;background:#E9F6F6;color:#00626A!important;border-radius:999px;padding:5px 12px;font-weight:600}
#v-schedule .dg16{border-radius:16px!important}
#v-schedule .hh16{align-items:center!important;gap:10px!important;margin:20px 2px 8px!important}
#v-schedule .hh16 b{font-family:Inter,sans-serif!important;font-weight:700!important;font-size:14px!important;color:#00626A!important;background:#E6F4F5;border-radius:8px;padding:3px 10px;font-variant-numeric:tabular-nums}
#v-schedule .hh16 span{font-size:12.5px!important}
#v-schedule .hh16::after{content:'';flex:1;height:1px;background:#ECEAF3}
#v-schedule .cls{border:1px solid #EEEDF4!important;border-radius:14px!important;transition:box-shadow .12s ease,border-color .12s ease}
#v-schedule .cls:hover{border-color:#DAD7E7!important;box-shadow:0 6px 16px rgba(43,34,83,.08)!important}
#v-schedule .cls .bar{width:5px!important;border-radius:5px!important;align-self:stretch}
#v-schedule .cls .nm{font-size:15.5px;font-weight:650;color:#2B2253}
#v-schedule .sctb .seg .tl97b{display:none}
</style>
`;
lib(file, [["\n</body>\n</html>", "\n" + CSS.trim() + "\n</body>\n</html>"]]);
