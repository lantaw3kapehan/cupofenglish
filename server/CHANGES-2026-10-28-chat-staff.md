# Team Chat · members from the staff table + designation chips (1451 · coe-chat v14) · 28 Oct 2026

Misty 12:53–12:55: everyone ticked "In Team Chat" in the staff record is in Team Chat, but **teachers have their own groups; non-teachers only when management clicks their name**. Celine = Operations. Chips show team · designation; no "President" anywhere teachers or staff can see.

## Rules (server, coe-chat v14)
- Members = `staff` rows that are active with **In Team Chat** ticked, minus the sys:chat exclude list. A teacher sign-in that has no staff row yet still counts as a teacher.
- **Teachers** (role teacher, or anyone who signs in with the teacher app) → All Teachers, Time-in, Substitutes (names unchanged) + their own chat with management.
- **Other staff** → only a direct chat with management. They are not in any teacher group, teachers never see their names, and they see only management's names. No Staff group was created.
- **Chat management** = the sys:chat management list (CupOfEnglish, Celine) or a management sign-in whose role is operations/admin/president. A staff member given management-app access (e.g. a content creator) is an ordinary member: no presence, no receipts, no Manage members. Permissions otherwise unchanged.
- Teacher-only features stay teacher-only: Today items (1415), quiet during class, time-in cards.

## Chips (display only)
| Who | Chip |
|---|---|
| CupOfEnglish | Management (purple) |
| Celine | Management · Operations (purple) |
| Misty (teacher account, admin in staff) | Management (purple) |
| Teachers | Teacher (teal) |
| Katherine | Staff · Digital Content C… (grey) |
| Myra | Staff · Corporate Treasur… (grey) |

Designations are capped at 18 characters with an ellipsis; the full text is in the tooltip. On phones only the team word shows. Chips appear in message author lines, the participant panel (both views), management's Direct list (staff only), Manage members and Online now. Message author lines now show the plain name plus the chip, so "Teacher April" becomes "April" with a "Teacher" chip.

## Manage members
- Each person shows their chip. Teachers keep their group toggles. Staff show "Direct chat with management only" with a Remove/Add button.
- Anyone without app access shows **No app access yet · Give app access**. The link opens Teachers and the existing Give app access form (AS40.access). No accounts are created by chat.
- Anyone whose "In Team Chat" box is unticked shows a note saying so instead of Add.
- The Direct search is now "Find a person". Receipts say "Acknowledged" (1450 wording).

## Member list (live, 28 Oct)
- **All Teachers / Time-in / Substitutes:** CupOfEnglish, Celine + April, Ara, Christian, Cy, Dezza, Julia, Kat, Martin, Mayi, Misty, Pam, Resa, Ric, Rose
- **Direct chat with management only:** Katherine, Myra
- **Not in Team Chat:** Virgo, Daniela, Lovely (unticked), Marife (inactive), plus the other names on the exclude list
- **No app access yet:** Katherine, Myra, Ric, Daniela

## Checks
- Live (pg_net, isolated zz sessions):
  - management init returns 19 members with Katherine/Myra DMs;
  - a teacher sees 2 management + 15 teachers, with no staff names and no presence;
  - a staff sign-in (management app, role Content Creator) gets mgmt=false, kind staff, only its own Management chat, and only management's names;
  - All Teachers returns "Not found" and roster/presence details are refused.
- Previews: management laptop/phone, teacher laptop/phone; no "President" in any chat view; no page errors.
- Server deploy: the jsr type import was dropped because the bundler timed out fetching it (types only, no behaviour change).

## Test leftovers
- app_sessions zztest-s7 (new), zztest-mg7, zztest-t7: all expired. zztest-mg7's role is back to "".
- chat_groups dm:zztest-t7, dm:zztest-s7: empty and never listed.
- sys:chat allowTest removed.
- No test messages.
