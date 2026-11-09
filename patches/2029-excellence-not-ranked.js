// 2029 (9 Nov 20:30, Misty: "some teachers are Gold? like Rose, Kat, Pam… I guess there is a problem" → chose "Hide under 20 units"):
//   the database now gives a level only to a ranked teacher (20 units or more, not the President). Teacher Excellence shows
//   "Not ranked yet · 1.5 of 20 units" in place of the level for the others, and the top 3 read "so far" until the month closes.
const file = process.argv[2];
require('../tools/lib.js')(file, [
 [
  "<div class=\"grow\"><b>${esc(tName(t.name))}</b> ${lvChip(t.level)}</div>",
  "<div class=\"grow\"><b>${esc(tName(t.name))}</b> ${t.level ? lvChip(t.level) + (t.soFar ? ' <span class=\"small mute\">so far</span>' : '') : t.note ? '<span class=\"chip\" style=\"background:#F3F2F8;color:#6B6782;font-weight:600\">' + esc(t.note) + '</span>' : ''}</div>"
 ],
 [
  "<div class=\"small mute\">${t.total} · ${esc(t.level || '')}</div>",
  "<div class=\"small mute\">${t.total} · ${esc(t.level || '')}${t.soFar ? ' so far' : ''}</div>"
 ]
]);
