// 2226 (14 Nov · Misty: "we can do all now"): the teacher's Schedule › Calendar gets the same look as management's Schedule:
// List | Calendar with icons, week grid as a rounded card with today's column and day marked in teal, softer class blocks that lift
// on hover, a dot on the red "now" line; month squares with the day number (today in a teal circle), bold class counts, China dates
// as coloured labels, past days faded, other months blank. Styling only: nothing about the data or buttons changes.
const lib = require("../tools/lib.js"), file = process.argv[2];
const CSS = String.raw`
<style id="css2226">
#v-tsched .c01sw{border-radius:14px!important;padding:4px!important;gap:2px!important}
#v-tsched .c01sw button{display:inline-flex;align-items:center;gap:7px;border-radius:10px!important;padding:7px 14px 7px 11px!important;min-height:38px!important;font-size:13.5px!important}
#v-tsched .c01sw button::before{content:'';width:16px;height:16px;background:currentColor;-webkit-mask:var(--ic) center/contain no-repeat;mask:var(--ic) center/contain no-repeat;opacity:.85}
#v-tsched .c01sw button:nth-child(1){--ic:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01'/%3E%3C/svg%3E")}
#v-tsched .c01sw button:nth-child(2){--ic:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='4' width='18' height='18' rx='2'/%3E%3Cpath d='M16 2v4M8 2v4M3 10h18'/%3E%3C/svg%3E")}
#v-tsched .c01{border-radius:20px!important;border-color:#ECEAF3!important;box-shadow:0 1px 2px rgba(43,34,83,.04),0 8px 24px rgba(43,34,83,.05)}
#v-tsched .c01h{background:#FAFAFC!important;min-height:64px!important;padding:9px 8px 7px!important}
#v-tsched .c01h b{font-size:17px!important;font-weight:700;color:#2B2253;display:inline-flex;align-items:baseline;gap:3px}
#v-tsched .c01h.td{background:#EEF8F9!important}
#v-tsched .c01h.td span{color:#00737B!important}
#v-tsched .c01h.td b{color:#00737B!important}
#v-tsched .c01h.td b::before{content:'';display:inline-block;width:8px;height:8px;border-radius:50%;background:#00939D;margin-right:3px;transform:translateY(-2px)}
#v-tsched .c01c.td{background:#F2FAFA!important}
#v-tsched .c01e{left:4px!important;right:4px!important;border-radius:9px!important;padding:3px 7px!important;font-size:12px!important;box-shadow:0 1px 2px rgba(43,34,83,.06);transition:transform .12s ease,box-shadow .12s ease}
#v-tsched .c01e:hover{transform:translateY(-1px);box-shadow:0 6px 14px rgba(43,34,83,.14);z-index:1}
#v-tsched .c01e small{font-size:10.5px!important}
#v-tsched .c01n{height:2px!important}
#v-tsched .c01n::before{content:'';position:absolute;left:-4px;top:-4px;width:10px;height:10px;border-radius:50%;background:#C2563F}
#v-tsched .c01m{gap:8px!important;padding:16px!important}
#v-tsched .c01m .dw{padding:0 8px 2px!important;letter-spacing:.06em!important}
#v-tsched .c01m .dw:nth-child(6),#v-tsched .c01m .dw:nth-child(7){color:#00737B}
#v-tsched .c01m .d{min-height:100px!important;border-radius:14px!important;border-color:#EEEDF4!important;padding:8px 9px!important;gap:3px!important;transition:box-shadow .12s ease}
#v-tsched .c01m .d:hover{box-shadow:0 6px 14px rgba(43,34,83,.08)}
#v-tsched .c01m .d>b{font-size:14px!important;font-weight:700;min-width:26px;height:26px;display:inline-flex;align-items:center;justify-content:center;border-radius:999px;margin:-2px 0 2px -3px;align-self:flex-start}
#v-tsched .c01m .d.td{border:1px solid #00A3AD!important;box-shadow:0 0 0 1px #00A3AD inset}
#v-tsched .c01m .d.td>b{background:#00939D;color:#fff}
#v-tsched .c01m .d.o{visibility:hidden}
#v-tsched .c01m .d.past{opacity:.7!important;filter:saturate(.6)}
#v-tsched .c01m .d .n{font-size:13px;font-weight:700;color:#2B2253}
#v-tsched .c01m .d .tm{font-size:11px}
#v-tsched .c01m .d .cn{border-radius:6px;padding:1px 6px;align-self:flex-start;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#v-tsched .c01m .d.cn-h .cn{background:#FFE9E2}#v-tsched .c01m .d.cn-x .cn{background:#ECE9FB}#v-tsched .c01m .d.cn-i .cn{background:#E3F4F2}
#v-tsched .c01k{gap:8px 18px!important;font-size:12.5px!important;margin:10px 2px 2px!important}
@media (max-width:640px){#v-tsched .c01m{gap:4px!important;padding:8px!important}#v-tsched .c01m .d{min-height:66px!important;padding:5px!important;border-radius:10px!important}#v-tsched .c01m .d>b{font-size:12.5px!important;min-width:22px;height:22px}#v-tsched .c01m .d .n{font-size:10px;line-height:1.15;overflow:visible}#v-tsched .c01m{padding:6px!important;gap:3px!important}#v-tsched .c01m .d{padding:4px 3px!important}#v-tsched .c01m .d .cn{display:none}}
</style>
`;
lib(file, [["\n</body>\n</html>", "\n" + CSS.trim() + "\n</body>\n</html>"]]);
