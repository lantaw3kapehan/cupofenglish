// 1729: (Misty 4 Nov 10:37, screenshot Andy ST-2026-018) student card: the second line under the name ("Shared package · Joy",
//   "Referred by Joy (ST-2023-012)", the email) ran into each other. The items could shrink below their text, so the text spilled over the
//   next item. Now each item keeps its own width and the line wraps onto the next row instead; a very long item ends with "…".
const file = process.argv[2];
const CSS = String.raw`<style>
/* 1729 · student card hero lines wrap instead of overlapping */
#sheetBody .shero .grow .hl>*{flex:0 0 auto!important;max-width:100%!important;min-width:0}
#sheetBody .shero .grow .hl>*:not(:has(*)){overflow:hidden;text-overflow:ellipsis}
#sheetBody .shero .grow .hl .sa-src{overflow:hidden;text-overflow:ellipsis}
#sheetBody.stu2 .shero .grow .hl .teal+.teal{margin-left:0!important}
</style>
`;
require('../tools/lib.js')(file, [["</script>\n</body>\n</html>", "</script>\n" + CSS + "</body>\n</html>"]]);
