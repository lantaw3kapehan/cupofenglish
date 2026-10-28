# Homework "Pages go back" · same book only (1483) · 28 Oct 2026

**Complaint (Misty 18:26):** Teacher Kat could not give "page 3" as homework to Phyllis (ST-2025-103).

## Cause
The check in the homework box (Homework sheet and the class note's homework box) compared the new page with the last homework that had page numbers, matching only workbook / not workbook. It never looked at the book.
- Phyllis's last paged homework: "Long Vowels Workbook - page 37" (14 Oct, class book LongVowels).
- Her book changed to OD1 on 21 Oct (mgmtSetBook; homework that day "Updated: OD1"; classes 21 and 28 Oct = OD1).
- So page 3 of OD1 was called "Page 3 comes before … next is p. 38". The first Save showed a red box, the second Save sent a flag to management. Kat stopped at the red box (no flag or homework save from her for Phyllis since 21 Oct in the app's write log).

## Fix · patch 1483
- The book of the new homework = this class's book (class record), else the student's book.
- The book of the earlier homework = the book of that day's class (the teacher's own schedule for that day, looked up once, at most 2.5 s, only when a go-back is possible), else the book named in its text when it is this class's book.
- Pages are compared only when both books are known and the same, and no "Updated / new book" homework came in between. Different or unknown book → no page warning. "Same homework as before" works as before.
- The warning is a warning, not a block: amber box "Check the pages" with **Change it** / **Keep it** (one tap keeps it and saves; management gets the note as before).
- One flag per homework: the flag log shows most flags sent twice, 0.5 s apart (two Save taps while the check read the history). Save can no longer run twice during the check, and the same flag is never sent twice.
- Same flag sheet (S-HW-FLAGS), same history, same saves. Both paths changed (Homework sheet / markHw and class note #nH / saveNote). No other screen runs this check; management reads the flags only in the S-HW-FLAGS sheet.

## Tests (preview, synthetic data, saves pretend-only)
| Case | Before | After |
|---|---|---|
| A · new book (LongVowels p. 37 → page 3 in the new class book) | red box, flag on 2nd Save | no warning, saved |
| A2 · same, schedule look-up unavailable | red box | no warning, saved |
| A3 · "Updated: OD1" in between, bare "Workbook p. 37" → "Workbook p. 3" | red box | no warning, saved |
| B · genuine go-back, book named (WK 2 Workbook p. 36 → p. 30) | red box | "Check the pages" · Keep it → 1 flag + saved |
| C · genuine go-back, bare pages, same class book that day (p. 5 → p. 2) | red box | warning · Keep it → 1 flag + saved |
| D · pages forward, same book | saved | saved |
| E · same homework again | red box | warning · Keep it → 1 flag + saved |
Class-note path: B, C, E warn and A, A2, A3, D do not (the note's own required fields stop the pretend save in the preview, before and after alike). Double tap on Keep it → one flag.

## Existing flags (S-HW-FLAGS, database copy to 25 Oct 11:24, and the app's write log, current)
- "Pages go back": Owen ST-2026-047 25 Oct ("Workbook P.36" after "ShortVowels Workbook p. 36", class book ShortVowels both days) and Jake ST-2026-010 15 Oct ("Workbook p. 2" after "Workbook p. 5", class book TheAlphabet both days). **Same book both times → not false under the new rule.** No flag for Phyllis was ever sent.
- 3 of the 4 flags are doubled (Owen, Jeffrey and Jake each have two rows saved 0.5–5 s apart; Lovely's is single). These duplicates are only in the Google sheet S-HW-FLAGS; there is no app screen for them, so nothing was changed. Misty may delete the second row of each pair or mark it "duplicate" in the sheet.
