// 21 Oct · Teacher Books, calmer (Misty: "let's do … BOOKS' SCREEN").
//  · The big coral rule box becomes one quiet line with a lock for teachers ("Read the rule" opens the full text). The full rule
//    still shows, and must be accepted, before a teacher opens a book for the first time on a device (unchanged).
//  · The teal "These are the books of …" box becomes a small grey line.
//  · Book tiles in the same card language as the other teacher screens (18 px corners, soft shadow, gentle lift).
require('../tools/lib.js')(process.argv[2], [
["    if(teach) h += `<div class=\"bl-note\">These are the books of the students in your classes${others ? ` · the other ${others} books open when one of your students starts them` : ''}.</div>`;",
 "    if(teach) h += `<div class=\"bl-n505\">Your students' books${others ? ` · ${others} more open when one of your students starts them` : ''}</div>`;   /* 505: a quiet line, no box */"],
["  const rule = () => (D && !D.mgr && ok()) ? slim() : box();",
 "  const more = () => `<details class=\"bk-rule slim bkm505\"><summary>${ICO}<span>For CupOfEnglish classes only · not for sharing, other classes or personal use</span><u>Read the rule</u></summary><div>${esc(TXT)}</div></details>`;\n  const rule = () => (D && !D.mgr) ? (ok() ? slim() : more()) : box();   /* 505: teachers see one quiet line; the full rule before the first book */"],
["#v-books .bl-c{border-radius:14px;padding:14px 12px 10px;background:linear-gradient(180deg,var(--bt) 0,#fff 78%);border:1px solid var(--line)}",
 "#v-books .bl-c{border-radius:14px;padding:14px 12px 10px;background:linear-gradient(180deg,var(--bt) 0,#fff 78%);border:1px solid var(--line)}\nbody:not(.mgr) #v-books .bl-c{border-radius:18px;overflow:hidden;border:1px solid rgba(43,34,83,.07);box-shadow:0 1px 2px rgba(43,34,83,.04),0 10px 26px -16px rgba(43,34,83,.18);transition:transform .2s,box-shadow .2s}\n@media(hover:hover){body:not(.mgr) #v-books .bl-c:hover{transform:translateY(-2px);box-shadow:0 2px 4px rgba(43,34,83,.05),0 16px 34px -18px rgba(43,34,83,.28)}}\n#v-books .bl-n505{font-size:12.5px;color:var(--mute);margin:2px 2px 4px}\n.bkm505 summary{list-style:none;display:flex;align-items:center;gap:6px;cursor:pointer;flex-wrap:wrap}.bkm505 summary::-webkit-details-marker{display:none}\n.bkm505 summary u{color:var(--teal);text-decoration:none;font-weight:700;margin-left:4px}.bkm505[open] summary u{display:none}\n.bkm505>div{margin-top:6px;padding:10px 12px;border-radius:12px;background:#FDF1EE;color:var(--ink);font-size:13px;line-height:1.5}"]
]);
// 505b · the rule line reads as one line on a phone ("Read the rule" inside it).
require('../tools/lib.js')(process.argv[2], [
["<span>For CupOfEnglish classes only · not for sharing, other classes or personal use</span><u>Read the rule</u></summary>",
 "<span>For CupOfEnglish classes only · not for sharing, other classes or personal use · <u>Read the rule</u></span></summary>"],
[".bkm505 summary{list-style:none;display:flex;align-items:center;gap:6px;cursor:pointer;flex-wrap:wrap}",
 ".bkm505{display:block!important}.bkm505 summary{list-style:none;display:flex;align-items:flex-start;gap:6px;cursor:pointer}.bkm505 summary svg{flex:none;margin-top:2px!important}.bkm505 summary span{flex:1;min-width:0}"],
[".bkm505 summary u{color:var(--teal);text-decoration:none;font-weight:700;margin-left:4px}", ".bkm505 summary u{color:var(--teal);text-decoration:none;font-weight:700;white-space:nowrap}"]]);
