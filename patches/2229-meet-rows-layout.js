// 2229 (14 Nov · Misty: "also the design here"): Meeting ID missing rows: fixed columns so "Reminded ✓" never covers the class
// count, teacher names on one line, smaller reminded pill, the "Remind all" button lighter and on the same line as the hint.
const lib = require("../tools/lib.js"), file = process.argv[2];
const CSS = String.raw`
<style id="css2229">
.mt14 .rw{grid-template-columns:96px minmax(0,1fr) 170px 84px 150px!important;gap:12px!important;padding:9px 0!important}
.mt14 .rw>span:nth-child(3){white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#4A4566}
.mt14 .rw .n{white-space:nowrap}
.mt14 .rw .rm{justify-self:end;font-size:12.5px!important;padding:5px 12px!important}
.mt14 .rw .rm.ok{background:#EEF8F3;color:#1F6E4E;font-weight:600;padding:5px 10px!important}
.mt14 .ra{background:#fff!important;color:#00737B!important;border:1px solid #BFE0E2!important;border-radius:999px!important;padding:7px 14px!important;font-size:13px!important;margin:4px 0 8px!important}
.mt14 .ra:hover:not(:disabled){background:#EEF8F9!important}
.mt14 .ra:disabled{color:#1F6E4E!important;border-color:transparent!important;background:#EEF8F3!important;opacity:1!important}
@media (max-width:900px){.mt14 .rw{grid-template-columns:78px minmax(0,1fr) 120px 130px!important}.mt14 .rw .n{display:none}}
@media (max-width:560px){.mt14 .rw{grid-template-columns:62px minmax(0,1fr) 112px!important}.mt14 .rw>span:nth-child(3){display:none}}
</style>
`;
lib(file, [["s ? '<span class=\"rm ok\">Reminded ✓ ' + s + '</span>'", "s ? '<span class=\"rm ok\" title=\"Reminded in the app at ' + s + '\">✓ Reminded ' + s + '</span>'"],
 ["\n</body>\n</html>", "\n" + CSS.trim() + "\n</body>\n</html>"]]);
