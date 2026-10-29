# Teacher specialties: 1640 (management editor) and 1641 (partner portal)

29 Oct 2026, requested by Misty between 10:05 and 10:27. Live as partner 1360 and management COE_V 1453.

## Where the data lives
The `staff.specialties` jsonb column, with `staff.spec_at` recording when a specialty was last saved. It holds:
- `status`: `confirmed`, `draft` or `left`
- `bands`: any of `yl` (2–8), `kids` (8–12), `teens`, `adults`
- `level`: `adv`
- `books`: COURSE codes, plus `PHONICS` (Oxford Phonics World 1–5: TheAlphabet, ShortVowels, LongVowels, ConsonantBlends, LetterCombinations). `ODF` means Oxford Discover Futures; ODF1 and ODF2 count as ODF.
- `subj`, `line`, `by` and `at`

The new edge function `coe-partner-spec` (v1) has three ops:
- `spec`, for partners: confirmed specialties only, plus the names not to list (staff who are not active, or whose status is `left`)
- `list`, for management: active teachers with a read-only suggestion worked out from their students' ages and courses
- `set`, for management: saves one teacher's specialty

coe-partner is untouched at v17. `coe_partner_stamp()` now also includes the newest `spec_at` and the count of active staff, so a save or a deactivation refreshes open partner pages within about 15 seconds.

## Confirmed specialties

| Teacher | Age band | Books / subject |
|---|---|---|
| April, Kat | Young learners 2–8 | Phonics |
| Mayi, Dezza | Kids 8–12 and Teens (chip: 少儿/青少年 8–16) | OD1–OD2, Phonics |
| Christian, Rose | Teens | OD1–OD2 |
| Resa | Teens | OD1–OD2, Phonics |
| Julia, Pam, Ara | 进阶 Advanced | OD2, ODF, REF |
| Misty, Martin | Adults | IELTS, TOEFL |
| Cy | Young learners and Teens | none |
| Virgo | Teens (his students are 14–16) | 辩论 · 演讲 Debate & public speaking |

Ric, Daniela and Lovely are marked `left`. They are not listed on Who's free or Teachers. Their history and （曾任） tags stay.

## Partner portal (1641)
- **What partners see:** specialties appear on the portal screens only. Every picture is byte-identical to 1359: the copied weekly picture (all teachers, this week and next) and the Who's-free picture (today and weekend, every part of the day) were all compared.
- **Child filter:** at the top of Who's free. The age choices are 全部, 幼儿, 少儿, 青少年 and 成人. The book choices are 不限, OD1, OD2, ODF, REF, IELTS and Phonics. The choice is remembered on the phone.
- **Matching:** a teacher is a good match when every chosen item fits. A teacher with no confirmed age band does not count as an age mismatch. A chosen book must be on the teacher's list.
- **Order:** good matches come first, marked ✓适合 · Good match. All other free teachers follow, dimmed, under "其他有空的老师".
- **Chips:** one colour-coded age chip with its text, plus at most two book chips. Phonics and ODF details appear in the chip tooltip and in the teacher's 简介.
- **No pop-in:** on a first visit, Who's free and Teachers show the skeleton until the specialties arrive, so the chips never appear after the list.

## Management (1640)
The teacher's page in Team & access has a Specialties section with:
- age bands, the Advanced level, books and the subject chip
- status: Confirmed, Draft or Left
- "Suggested · confirm" with a "Use this" button

## Rollback
- Pages: branch `rollback-pre-1640`
- Partner portal: stop calling `coe-partner-spec` (1359 is on the rollback branch)
- Data: setting `staff.specialties` to null removes every specialty
