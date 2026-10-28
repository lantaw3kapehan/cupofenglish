# 28 Oct 2026 · Philippine market prices (Enquiries) + Philippine learners in the Student portal · release 1530

Misty (21:16): "In ENQUIRIES, can you also put our PHILIPPINE MARKET PRICE? … for ADULT ENGLISH 1:1 and its learning system, and
ADULT IELTS. This way, when the Philippine market enquires, we can easily show this. And if we create them an account in our system
as STUDENT PORTAL, they also have an organised learner system like our Chinese clients."
Misty (21:20): ship when preview, stability and regress-saves pass. PH sign-in mirrors the Chinese learners: ST code + first name.

## One source of truth: `docs` row `sys:pricing_ph` (scope mgmt)

- New row only (inserted 28 Oct 21:3x; no schema change, nothing else touched). Seed copy: `server/pricing-ph.json` (same content).
- Holds both programmes (Adult English 1:1, IELTS 1:1) → three tracks each (lessons, extras, hours, CEFR/band target, band gain,
  price in pesos, goal, outcome), the learning system (4 skills: aim, core skills, result) and, for IELTS, the per-track key focus
  areas and the 70/30 coaching split of each roadmap. Transcribed from Misty's 8 flyers.
- The app (Enquiries) and coe-student read this row; nothing hard-codes a price. To change a price later: edit this row (keep the
  shape), bump `updated`; the app picks it up within 5 minutes (it keeps a copy on the device for instant open).
- China prices (`program_prices`, the app's price picture), partner rates and every calculation: unchanged.

| Programme | Track | Lessons | ≈ Hours | Target | Price |
|---|---|---|---|---|---|
| Adult English 1:1 | Foundation | 15 | 12.5 | CEFR A2 → Low B1 | ₱6,750 |
| | Professional | 30 + performance tasks | 25 | CEFR B1 → B1+ | ₱13,500 |
| | Mastery | 60 + presentation tasks | 50 | CEFR High B1 → B2 | ₱27,000 |
| IELTS 1:1 | Foundation | 15 | 12.5 | Band 4.5 → 5.0/5.5 (+0.5) | ₱8,250 |
| | Professional | 30 + 2 mock tests | 25 | Band 5.0 → 6.0 (+0.5–1.0) | ₱16,500 |
| | Mastery | 60 + 5 mock tests | 50 | Band 5.5 → 6.5/7.0 (+1.0–1.5) | ₱33,000 |

## Flyer pictures: `ph/*.webp` (hosted with the app)

8 flyers, 2000 px WebP (≈210–260 KB) + 640 px thumbnails (`-s.webp`, ≈40–50 KB): adult-english-program, adult-english-system,
ielts-program, ielts-system, ielts-listening, ielts-reading, ielts-speaking, ielts-writing. Copy picture = PNG to the clipboard;
Save picture = JPEG (phones: the share sheet).

## Management app · patch `1530-ph-pricing-enquiries.js`

1. **Enquiries › Market switch** (above "Pictures & messages"): **China · WeChat (¥)** (default, the existing toolkit unchanged) or
   **Philippines (₱)**. Remembered per device. Philippines shows two programme cards: tracks with price, lessons, hours, target and
   goal; the four skills; **Copy prices (text)**; **Learning system / Skills & roadmaps** (full sheet: track cards, 4-skill system,
   IELTS key focus per track with a Foundation / Professional / Mastery switch, pictures, text to send, "Copy this track"); every
   flyer with **Copy** / **Save**. Line icons, Fredoka One headings, teal/purple. Phone: one column, no sideways scroll.
2. **New enquiry**: "Interested in" adds **PH Adult English 1:1** and **PH IELTS 1:1**; picking one shows the three tracks with
   price (+ "Not sure yet"). Saved as `prog` = e.g. `PH IELTS 1:1 · Professional` (existing field; no new column).
   A PH enquiry's row shows the chip "Professional · ₱16,500"; its **Price** / **Roadmap** buttons read **PH price** / **PH roadmap**
   and open the Philippine sheet on that programme and track (China enquiries: unchanged).
3. **Students › Student access › Market** (per student): China (default) / Philippines + programme + track → coe-student
   `sMarket` → docs `sys:ph_learners` (`{ codes: { ST-…: { prog, track, at, by } } }`, created on the first save). A PH learner's
   row shows a purple chip and **Copy message (English)**: link `…/student/?lang=en`, student code, password = first name, home
   screen steps. China learners: the Chinese message as before.
- Exposed for this patch only: `window.__ps1350` (Student access internals) and `window.__enq1530()` (read-only enquiry list).

## Student portal (`student/index.html`, version 1530)

- **How a learner is PH**: no reliable field existed (no market/currency column; DATABASE city is free text, mostly Chinese cities;
  SOURCE is a referrer). So management marks it in Student access › Market. Default = not PH = today's Chinese-first portal.
- Sign-in unchanged (coe-student `login`: ST code + the English name on DATABASE/ACTIVE, case-insensitive; own password if set;
  5 wrong tries → 15-min lock per code, 30 per connection per hour). For a PH learner the **ENGLISH NAME** column should hold the
  first name they will type.
- PH learner after sign-in (server says `market: 'ph'`): the whole portal in English, Philippine time (UTC+8, same clock as Beijing):
  Home (next class, My programme card: programme + track, lessons/hours, CEFR or band target, band gain, lessons done of total and
  left, this week, KPIs, renewal/validity notes, latest class note) · Classes · Lessons (management's Lesson summary numbers,
  packages, payments in ₱, English receipt) · Notes (homework done ticks) · **Programme** (track path, 4-skill roadmap with the key
  focus areas for their track, learning-system/roadmap pictures, CEFR level journey, since joining, attendance, monthly reports in
  English). No prices of the price list are sent to the portal.
- Lessons left only when management's Lesson summary passes every check, else "Being checked · shows once confirmed" (the 核对中
  rule, same server guards); never guessed.
- `?lang=en` (the PH message link) shows the sign-in page in English; after sign-in the server's market decides.
- China families: unchanged (screens pixel-compared old vs new on all five tabs; meta, nav and language identical).

## coe-student v22 (deployed 28 Oct 21:48; source `supabase-coe-student-v22/`, v21 rollback copy `supabase-coe-student-v21/`)

- `sList` adds `ph: { prog, track } | null`; new mgmt op `sMarket` (mgmt session only; validates programme/track; optimistic
  read-modify-write of `sys:ph_learners`). `login` and `all` add `market: 'ph' | 'cn'`; `all` adds `ph` = programme + track from
  `sys:pricing_ph` **without prices**. Everything else byte-identical to v21 (deployed files diffed against the repo: identical).
- Probed after deploy with fake tokens (pg_net): `all` → 401 AUTH, `sMarket` → 401 AUTH. No rows written.

## Tests (preview / synthetic data only; no real accounts, no passwords)

- `tools/regress-saves.js`: all 17 save/refresh checks passed.
- Stability (management, enquiry/astudents/trials/mtoday/students, laptop + phone): base and new compared on the loaded machine (see
  release note); PH mode measured separately: Enquiries open 0 / repaint 0 (laptop and phone). Portal: PH, China-new, China-base 0.
- Screenshots: scratchpad `phprice/01…17*.png`.

## Rollback

- App: revert patch 1530 (branch `rollback-pre-1530` = main before this release).
- Portal: `student/index.html` from `rollback-pre-1530`.
- coe-student: redeploy `supabase-coe-student-v21/`.
- Data: `delete from docs where key in ('sys:pricing_ph','sys:ph_learners')` (new rows only).
