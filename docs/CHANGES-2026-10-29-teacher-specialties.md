# Teacher specialties: 1640 (management editor) and 1641 (partner portal)

29 Oct 2026, requested by Misty between 10:05 and 10:37. Live as partner 1364, management COE_V 1457 and coe-partner-spec v2.

## Where the data lives
The `staff.specialties` jsonb column, with `staff.spec_at` recording when a specialty was last saved. It holds:
- `status`: `confirmed`, `draft` or `left`
- `bands` (1642, from Misty's 10:34 table): `early` 幼儿 Early Years 2–6, `young` 少儿 Young Learners 7–12, `teens` 青少年 Teens 13–17, `adults` 成人 Adults 18+
- `level`: `adv`
- `books`: COURSE codes, plus `PHONICS` (Oxford Phonics World 1–5: TheAlphabet, ShortVowels, LongVowels, ConsonantBlends, LetterCombinations). `ODF` means Oxford Discover Futures; ODF1 and ODF2 count as ODF.
- `subj`, `line`, `by` and `at`

The new edge function `coe-partner-spec` (v1) has three ops:
- `spec`, for partners: confirmed specialties only, plus the names not to list (staff who are not active, or whose status is `left`)
- `list`, for management: active teachers with a read-only suggestion worked out from their students' ages and courses
- `set`, for management: saves one teacher's specialty

coe-partner is untouched at v17. `coe_partner_stamp()` now also includes the newest `spec_at` and the count of active staff, so a save or a deactivation refreshes open partner pages within about 15 seconds.

## Confirmed specialties (as of 10:37)

| Teacher | Age chip | Book and exam chips |
|---|---|---|
| April, Kat | 幼儿/少儿 2–12岁 | 自然拼读 Phonics |
| Mayi, Dezza, Resa | 少儿/青少年 7–17岁 | 牛津探索 OD1–OD2, 自然拼读 Phonics |
| Rose | 少儿/青少年 7–17岁 | 牛津探索 OD1–OD2 |
| Cy | 少儿/青少年 7–17岁 | none |
| Christian | 青少年 13–17岁 | 牛津探索 OD1–OD2 |
| Virgo | 青少年 13–17岁 | 辩论 · 演讲 Debate & public speaking |
| Julia, Pam, Ara | 青少年 13–17岁 · 进阶 | 牛津探索 OD2 · ODF, 阅读探索 REF |
| Misty, Martin | 成人 18岁+ | 雅思 托福 · IELTS TOEFL, PET · FCE |

Julia, Pam and Ara are waiting for Misty to decide on their age band. Their active students' known ages:
- Julia: 46 known. 2 are under 7, 31 are 7–12, 13 are 13–17, 2 are adults.
- Pam: 27 known. 15 are 7–12, 11 are 13–17, 1 is an adult.
- Ara: 20 known. 10 are 7–12, 9 are 13–17, 1 is an adult.

Book codes:
- Phonics stands for Oxford Phonics World 1–5, made up of the COURSE codes TheAlphabet, ShortVowels, LongVowels, ConsonantBlends and LetterCombinations.
- ODF means Oxford Discover Futures; the book titles ODF1 and ODF2 count as ODF.
- PET is Cambridge B1 Preliminary and FCE is Cambridge B2 First. KET (A2 Key) is offered in the editor too.

Ric, Daniela and Lovely are marked `left`. They are not listed on Who's free or Teachers. Their history and （曾任） tags stay.

## Partner portal (1641)
- **What partners see:** specialties appear on the portal screens only. Every picture is byte-identical to 1359: the copied weekly picture (all teachers, this week and next) and the Who's-free picture (today and weekend, every part of the day) were all compared.
- **Child filter:** at the top of Who's free.
  - Age buttons, each showing its years: 全部, 幼儿 2–6岁, 少儿 7–12岁, 青少年 13–17岁, 成人 18岁+. A one-line English key sits under them.
  - Book and exam buttons: 不限, 拼读 Phonics, OD1, OD2, ODF, REF, IELTS, TOEFL, PET, FCE.
  - The choice is remembered on the phone.
- **Matching:** a teacher is a good match when every chosen item fits. A teacher with no confirmed age band does not count as an age mismatch. A chosen book must be on the teacher's list.
- **Order:** good matches come first, marked ✓适合 · Good match. All other free teachers follow, dimmed, under "其他有空的老师".
- **Chips:** one colour-coded age chip that always shows the years. Neighbouring bands are merged into one range, e.g. 少儿/青少年 7–17岁. At most two book or exam chips follow. Details for Phonics, ODF and the Cambridge exams appear in the chip tooltip and in the teacher's 简介.
- **No pop-in:** on a first visit, Who's free and Teachers show the skeleton until the specialties arrive, so the chips never appear after the list.

## Management (1640)
The teacher's page in Team & access has a Specialties section with:
- age bands, the Advanced level, books and the subject chip
- status: Confirmed, Draft or Left
- "Suggested · confirm" with a "Use this" button

## Rollback
- Pages: branch `rollback-pre-1640`, or `rollback-pre-1642` to return to the first version of the bands
- Partner portal: stop calling `coe-partner-spec` (1359 is on the rollback branch)
- Data: setting `staff.specialties` to null removes every specialty
