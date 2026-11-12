// 2128 (12 Nov audit): after "Change teacher" / "New schedule", the app told staff to do "One step in the sheet (ACTIVE)": add a package row
// for the new teacher by hand. The sheet is an archive now, so that step could not be done, and the new teacher's lessons would not come
// off the package. The database now adds that row by itself the moment a class with a new teacher is saved (trigger coe_cls_teacher_row).
// The card now says so.
const lib = require("../tools/lib.js"), file = process.argv[2];
const A = '<div class="card" style="margin-top:10px;padding:12px 14px"><b>One step in the sheet (ACTIVE)</b><div class="small" style="margin-top:4px">Add a row for <b>${esc(o.code)} · ${esc(o.name)} · Teacher ${esc(o.nw)}</b> right under his package row, with <b>Enrolled empty</b> (like Teacher Kat under Teacher Daniela). Then Teacher ${esc(o.nw)}\'s lessons come off the same package and the lessons left stay right.</div></div>';
const B = '<div class="card" style="margin-top:10px;padding:12px 14px"><b>One step in the sheet (ACTIVE)</b><div class="small" style="margin-top:4px">If Teacher ${esc(cap(o.nw))} is new for ${esc(o.name)}: add a row <b>${esc(o.code)} · ${esc(o.name)} · Teacher ${esc(cap(o.nw))}</b> right under his package row with <b>Enrolled empty</b>, so her lessons come off the same package.</div></div>';
const OK = (nw) => '<div class="small mute" style="margin-top:10px">Teacher ' + nw + '’s lessons come off the same package automatically.</div>';
lib(file, [[A, OK('${esc(o.nw)}')], [B, OK('${esc(cap(o.nw))}')]]);
