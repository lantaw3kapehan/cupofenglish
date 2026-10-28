# 1500 · Move a class after its end time (28 Oct 2026, Misty 18:30)

James ST-2022-004, Wed 28 Oct 17:00–17:50: the family rescheduled it to the next day, but at 18:29 the class card looked finished, so Misty couldn't move it.

- **Cause:** a UI problem. No rule on the server blocks moving a past class: coe-mgmt `classEdit` and Google's `editClass` both accept it (writes 2628 and 2630 on 26 Oct moved a past class). After the end time, the card hid Move behind a small "Picture · move · cancel" link, put "Tag this class" (lateness) first, and always said "Live class".
- **Fix (app):**
  - An ended class shows the Move · reschedule and Cancel buttons at once.
  - A line under them says whether the class was held:
    - "Ended · not held · no time-in, no video, no class note · Parent rescheduled? Tap Move · reschedule".
    - "Ended · held · time-in 17:02 …" when there is one.
  - Moving a held class (with a class time-in, a video or a class note from Monitor) asks for confirmation first. It is not blocked.
  - The status box now reads Scheduled / Live now / Ended · held / Ended · not held / Cancelled, matching the schedule rows ("Live" only while on, "fin" when ended).
  - After a move, Monitor and the change stamps refetch, so the old "No time-in" for that class disappears.
- **Unchanged:**
  - The server move logic: the double-booking check, the `classes_keep_moves` ghost guard (it works by write time, not class time) and the Google follow-up.
  - Lesson counts and pay: they follow the class's new day like any other move.
  - The "No time-in yet" team tile: computed from today's classes (`coe_overview_live`), so it clears when the class leaves today.
- **Teacher app:** teachers can't move classes, so nothing changed there.
- **Not changed:** `coe_push_late` sends a "⏰ No time-in" push 3–8 minutes after the start. That can't be known in advance for a late reschedule, and the push is not a case or penalty.
- **Tests:**
  - Preview: an ended class shows Move with "Ended · not held", and moving it calls editClass. A held class asks first; dismissing the prompt saves nothing. Live and pre phases are unchanged.
  - regress-saves: 17/17.
  - Stability check (schedule, monitor, To do): the same pre-existing shifts as main, with no new movement.
- **Rollback:** branch `rollback-pre-1500`.
