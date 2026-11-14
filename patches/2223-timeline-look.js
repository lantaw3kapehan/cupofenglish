// 2223 (14 Nov · Misty: "enhance the visual look and design, and all"): Schedule › Timeline: wider hours (180 px) so a 25-minute
// class shows the student's name and time in full, taller rows, softer class blocks with a hover lift, alternate row shading,
// clearer hour labels and teacher column.
const lib = require("../tools/lib.js"), file = process.argv[2];
const CSS = String.raw`
<style id="css2223">
#v-schedule .tl97{border-radius:18px!important;box-shadow:0 1px 2px rgba(43,34,83,.04),0 8px 24px rgba(43,34,83,.05)}
#v-schedule .tl97 .t7hd{grid-template-columns:180px 1fr!important;background:#FAFAFC!important}
#v-schedule .tl97 .t7hd .t7hs{height:36px!important}
#v-schedule .tl97 .t7hd .t7hs span{top:10px!important;font-size:12.5px!important;color:#4A4566!important}
#v-schedule .tl97 .t7r{grid-template-columns:180px 1fr!important;min-height:60px!important}
#v-schedule .tl97 .t7r:nth-child(even) .t7tr{background:#FCFCFE}
#v-schedule .tl97 .t7nm{padding:8px 14px!important}
#v-schedule .tl97 .t7nm b{font-size:14px!important;color:#2B2253}
#v-schedule .tl97 .t7b{top:7px!important;bottom:7px!important;border-radius:10px!important;padding:5px 9px!important;font-size:12.5px!important;gap:1px;transition:transform .12s ease,box-shadow .12s ease}
#v-schedule .tl97 .t7b:hover{transform:translateY(-1px);box-shadow:0 6px 14px rgba(43,34,83,.16)!important}
#v-schedule .tl97 .t7b i{font-size:11px!important}
#v-schedule .tl97 .t7nw{width:2px!important}
</style>
`;
lib(file, [["'<div class=\"tl97\"><div class=\"t7in\" style=\"min-width:' + (160 + span * 110) + 'px\">", "'<div class=\"tl97\"><div class=\"t7in\" style=\"min-width:' + (180 + span * 180) + 'px\">"],
 ["\n</body>\n</html>", "\n" + CSS.trim() + "\n</body>\n</html>"]]);
