# 27 Oct · teacher access fixes (patch 1330)

Misty, 12:43 — teacher access, still needs fixing:

1. **Duplicate "Next class" below the main class card (Today).** With a class running, "Now & next" showed the class now AND the
   next class's card (beside it on wide screens, below it on narrower ones) while the heading already says "then Zoe at 16:00".
   Now: Now & next shows only the class now (+ "then … at 16:00"); the next class is the first card in "Remaining today".
   With no class running, the next class is the main card as before.
2. **Blank level in Class brief.** The Level tile read only the latest progress check. Now the same one-level rule as the student
   page / CEFR journey (1221, coe-cj): latest assessment · else last course level across all DATABASE rows · else trial level.
   "Not assessed yet" only when nothing is known.
3. **Alice: header A1 but "At a glance" Pre-A1 → A1.** At a glance used the first progress check / book name. Now it uses the same
   level as the header and journey, shown as "A1 now → goal A2".
4. **Monthly score labelled November while tasks say October classes.** At a glance printed the month the feedback is due.
   Now "October 2026 classes", the same wording as the task list, feedback cards and reports (1220).

Display only; no record changed.
