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

---

# Follow-up · releases 1531–1532 (28 Oct 2026, 22:xx)

Review of 1530 + Misty (22:34): "make the Philippine price list follow the same template as the China price list, for uniformity."

## 1531 · thumbnails, subtitle, Market memory
- Flyer thumbnails (Enquiries and portal Programme › Pictures) load and decode at once (no `loading="lazy"`, no async decode);
  space reserved (width/height + aspect-ratio). The blank tiles in the first screenshots were off-screen lazy tiles in a full-page
  capture; over HTTP all 8 load and Copy / Save give the real 2000×1677 picture for each (PNG to clipboard, JPEG file).
- Enquiries subtitle follows the Market (China text unchanged; Philippines: "For enquiries from the Philippines · prices in pesos
  (₱) · flyer pictures and text for Messenger, Viber or e-mail").
- Market remembered per device: `localStorage coe.enqMarket` (try/catch), checked across a reload.
- Portal `student/` version 1531 (tiles eager).

## 1532 · Philippine market on the China template (one builder)
- `pricePic` / `ppSheet` / `ppDraw` / `ppText` take a market (`pricePic({ ph: 'adult' | 'ielts', rec })` → `PP.m = 'ph'`). Every
  China literal is kept; Philippines swaps only content from `sys:pricing_ph`: English text, ₱ prices and per-lesson price, the
  Foundation / Professional / Mastery tracks (lessons + mock tests / tasks, hours, CEFR or band target + gain, goal, outcome),
  notes from the flyers. Same sheet (Learner: Adult English 1:1 / IELTS 1:1 · Recommend · Copy picture · Share / save · Copy message
  with the English enrolment/payment lines), same picture, file `CupOfEnglish-price-ph-adult.png` / `-ph-ielts.png`.
- `coeCard(pill, body, { en: 1 })`: English-only labels; without the option (all China pictures) unchanged.
- China pictures byte-identical before/after (SHA-256 of 16 pictures: kids, adults, IELTS, PET, KET, partner prices, Xiaolan's
  students, None, personalised student picture, CEFR picture, course plan).
- Enquiries › Philippines = the China toolkit in English: "Pictures & messages · in English, for Messenger, Viber or e-mail",
  stage 1 "Before the trial" with the same cards: Price list (Price picture) · Learning roadmap (Roadmap: generated picture in the
  same frame and components: programme, track hero, 4 skills with core skills, IELTS key focus per track, result, notes) · Invite to a
  trial (Copy message, English) · Original flyers (Misty's 8 flyers, Copy / Save). The 1530 programme cards and sheet are retired.
- PH enquiry rows: PH price → price picture on its programme with its track recommended; PH roadmap → roadmap on its track.
- Tests: regress-saves 17/17; stability base vs new (enquiry, astudents, laptop + phone) all ok; PH tab open/repaint shift 0.

---

# Follow-up · releases 1533–1538 (28–29 Oct 2026, Misty 23:03 → 23:53)

## 1533 · UnionBank payment · Facebook source
- PH payment = CupOfEnglish's UnionBank account or QR, its own setting (docs `sys:pricing_ph.payment`), separate from China's
  "Payment with". Enquiries › Market: Philippines (₱) › **2 Enrolling › Payment QR · UnionBank** › Open: the QR (Copy QR / Save QR,
  lossless PNG at full size), the payment message (Copy message) and **Payment details** (bank, account name, account shown masked,
  method, note, QR upload; saved by coe-student op `sPhPay`, management only). Empty → "Payment: UnionBank account or QR · details
  from CupOfEnglish".
- Prefilled from Misty's QR (23:06): UnionBank of the Philippines · CUPOFENGLISH ONLINE TUTORIAL SERVICES · `**** **** 8123`
  (masked; the full number is never stored) · InstaPay QR · "Transfer fees may apply." · QR = `ph/unionbank-qr.png` (lossless PNG of
  her card, 1206×847; decodes with OpenCV and jsQR to the same 150-character payload as her original).
- PH price sheet: the "Payment with" (China helper, e.g. "Dr. @Sunshine") is replaced by the UnionBank line; PH message payment
  lines from the same setting. Recommended stays Professional by default; None works (no recommendation sentence).
- New enquiry › Found us through: + Facebook (stats table counts it).

## 1534 + coe-student v23 · PH sign-in = first name only
- A Philippine learner (Student access › Market = Philippines) signs in with the ST code + the FIRST WORD of their English name
  ("Maria" for "Maria Santos"; case-insensitive, trimmed). The full name is not accepted for them. China families unchanged.
  Same rate limits / lockout (5 wrong tries per code → 15 min; 30 per connection per hour), own password still overrides.
- Tested on the real handler (stubbed DB): PH "Maria", "  mARIA " OK; "Maria Santos", "Santos" 401; PH one-word OK; China
  "lily", "anna li" OK, "Anna" 401 (as before); 5 fails → 429; own password → name refused; access off → 401.
- English access message, Student access row ("password = first name (Maria)") and note updated. Portal login hint in English.

## 1535 + coe-student v24 · PH cancellation notice 4 hours · British Council line
- `sys:pricing_ph.cancel_hours = 4` (China stays 2, byte-identical). Rendered in: PH price picture "Good to know" line, PH price
  message, PH roadmap message, PH portal Classes tab ("Cancelling or moving a class", from `ph.cancelHours`, coe-student v24),
  the cancellation policy box on class / move / renewal pictures and its copied text (PH learner: English box, "4 hours",
  bar to scale, "Messenger, Viber or our group chat", Philippine time), the Class notice policy line.
- Enforcement in the app (management class editor): "Cancel · under N h", "Less than N hours before class" and the save guard
  ("a parent cancellation counts as a completed class") use the learner's market: PH learner (docs `sys:ph_learners`) → 4 h,
  everyone else → 2 h as before. Monitor / To do have no late-cancellation tags (nothing to change).
- NOT changed (for Misty): the Apps Script that applies a cancellation (it is not in this repo; the 2-hour rule is enforced by the app
  before it calls the script, so PH now gets 4 h there); stored classes / past cancellations are not touched.
- British Council footer on both PH price pictures (Adult English and IELTS), Misty's final wording, stored as
  `sys:pricing_ph.bc_line`: "CupOfEnglish assists eligible candidates with IELTS registration through its partnership with the British
  Council Philippines." One plain centred line at the bottom, separate from the logo and the "Good to know" list, no prefix, no logos.
  China pictures unchanged.

## 1536 · New enquiry form · PH mode + phone layout
- PH mode (a "PH …" programme picked; the form opens on PH Adult English 1:1 when Enquiries is on Philippines): Found us through =
  Facebook · Website · Referral · Other (WeChat, 小红书, Partner hidden); contact field "Facebook / Messenger / mobile (optional)" on its
  own line (same stored field); name hint "Facebook name is fine". China mode: original list and "WeChat ID (optional)".
- Phone: chip groups wrap as plain chips (the rounded track clipped wrapped chips and drew the curved mask); inputs 16 px (no iPhone
  zoom on focus, which pushed Age / level / Save off the edge). 390 and 375, China and PH: no element past the edge, no sideways scroll.

## 1537 · PH Price picture sheet on the phone
- Banner + Copy button (patch 34x) named the China learner ("KIDS & TEENS · 4–17", "Copy picture · Kids & teens") in the PH sheet:
  now "ADULT ENGLISH 1:1 · price · check this matches the learner before you copy" / "IELTS 1:1 · …" and "Copy picture · Adult English"
  / "· IELTS" (teal). China sheet unchanged.
- PH sheet: Learner and Recommend chips wrap ("Mastery · 60" no longer cut), Copy picture full width, Save / Copy message side by side.

## 1538 · PH Learner Service Agreement in English
- Same flow (student page or trial "Enrolling" › Service agreement › picture + message › Mark as sent › on file in S-AGREE), same layout.
  Chosen automatically for a PH learner (Market = Philippines, or an enquiry "PH Adult English 1:1 / PH IELTS 1:1" with that name);
  the sheet has "Agreement: China · bilingual / Philippines · English" to switch by hand.
- English text only (no Chinese lines, no gaps); PH tracks with ₱ prices (Foundation 15 · Professional 30 · Mastery 60, package ticked)
  and the programme name; payment = UnionBank account transfer or InstaPay QR (from the payment setting); notice = 4 hours; contact =
  Messenger / Viber or our group chat; "Class times are Philippine time"; reply "I have read and agree". Every other clause
  (validity 4/8/12 months, refund, conduct/recording, 1-on-1 rules, acceptance) is the English text of the current agreement.
- China agreement: HTML, message and picture byte-identical before/after (two China learners compared). Stored signed agreements
  (S-AGREE rows, Drive files) untouched; the saved "how" values are the same.
- For Misty (China-specific or unclear clauses, not guessed): (1) the provider clause "Provider cancellation or lateness under N hours"
  now uses 4 h for PH like the learner clauses, confirm; (2) "25 minutes for younger learners" kept from the English text; (3) the
  "Parent" row and "Learner / Parent / Guardian signature" kept for adults; (4) Place of signing "Online" (China: "Online · WeChat").

## Database writes (all on our own doc row `sys:pricing_ph`, no schema change)
- `payment` = the UnionBank details above (qr `ph/unionbank-qr.png`); `cancel_hours` = 4; `bc_line` = Misty's sentence.
- coe-student v23 → v24 deployed (index.ts only; pkg/mgmt/renew unchanged); deployed source = repo copy (byte compare).

## Tests
- check.js OK (incl. 42 renewal checks); regress-saves 17/17; stability: enquiry, astudents, schedule, trials, mtoday, laptop + phone
  ok (astudents laptop 0.0018 = base when run alone).
- China price pictures (16) byte-identical as a set, China sheet + message identical; China policy box picture + text and Class
  notice identical; China class editor unchanged (2 h).
- PH: class editor 3 h before class → "Cancel · under 4 h"; China learner same time → "Cancel class".

---

# 1539 · PH price list + learning roadmap redesigned for the Philippine audience (29 Oct 2026, Misty 23:53)
- Same builder and frame (coeCard: CupOfEnglish logo at the top, LEARN WITH THE BEST at the bottom, British Council line just above it on
  the price lists), a PH visual variant, no forked code. coeCard gains optional `ratio` (4:5 portrait), `font` (Inter) and `foot` (the
  footer line); China pictures pass none of them and stay byte-identical (16 China pictures + sheet + message compared).
- Format: 4:5 portrait, 2440 × 3050 px (crisp when saved; Facebook / Messenger feed size). Copy / Save / Share / Copy message unchanged.
- Price list: kicker "EXPERT … · 1:1 PREMIUM PROGRAM", bold Fredoka headline (Adult English / IELTS + teal "1:1"), tagline;
  Adult: Work & career · Travel · Everyday conversations · Presentations (from the track goals/outcomes on her flyer); IELTS: the
  Academic / General Training / UKVI pathway cards from her IELTS flyer; three track columns (navy header, Recommended in teal with a
  ribbon) with lessons + mock tests / tasks, ≈ hours, big ₱ price, ₱ per lesson (₱450 adult, ₱550 IELTS = price ÷ lessons), CEFR or
  band target, goal and outcome (full text, never cut); the four skills with check-marks; Good to know (lesson length, method, 4-hour
  notice, band disclaimer for IELTS); quote dates.
- Roadmap: a visual path 1 Foundation → 2 Professional → 3 Mastery with lessons (+ mock tests / tasks), the CEFR level / band and the goal
  at each step (the chosen track filled), then the four skills as cards with a line icon, 3–5 core skills each and the result line.
- Only facts from sys:pricing_ph / her flyers: no new claims, discounts, payment plans or guarantees. No emoji, no photos.
- Before / after: scratchpad/phprice/design-before-*.png, design-after-*.png, design-compare-*.png.
- Tests: check.js OK; regress-saves 17/17; stability enquiry laptop + phone ok; China pictures identical; no page errors; phone 390 no
  sideways scroll.

# 1539b · PH tidy-up (29 Oct 2026, Misty 02:51–02:54)
- PH pictures: eyebrow "EXPERT PREMIUM PROGRAM", headline "Adult English 1:1" / "IELTS 1:1" unchanged, chip "Price list" / "Learning
  roadmap" (no repeated programme name). Logo, footer, British Council line unchanged.
- PH price picture sheet: payment box removed (checkbox + UnionBank line); the PH price message has no payment lines. Payment = Enquiries
  › Philippines › 2 Enrolling › Payment QR · UnionBank (QR, message, Payment details editing). China keeps its box.
- Enquiries › Philippines: "Original flyers" card removed. Portal Programme › Pictures removed (the Programme tab already shows tracks
  and skills); hosted flyer files kept. Portal version 1536.
- Tests: China pictures/sheet/message identical; regress-saves 17/17; stability enquiry ok.
