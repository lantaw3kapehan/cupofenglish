# CupOfEnglish app · design system (29 Oct 2026)

Request: Misty 09:43 — "please improve the visual design, layout, labelled colours, etc." Earlier the same day: "minimalism design, user-friendly, highly productive and efficient"; "don't change much info and don't affect what has been linked"; "it looks crowded" (student card header).

This page is the rulebook for every screen change from now on. **If you add or change a screen, use these tokens and components. Do not add new hex colours, sizes or chip styles.**

| Release | What | Rollback branch |
|---|---|---|
| 1620 · 1621 | Tokens, aliases for the older token families, focus ring · one meaning per colour | `rollback-pre-1620` (COE_V 1462) |
| 1622 | Shared components: buttons, fields, chips, headings, dialog close, empty text | `rollback-pre-1622` (one release with 1623 · 1624, COE_V 1471) |
| 1626 | No runtime contrast work: colours the two safety-net passes used to darken after paint are baked into the source CSS / templates; the passes run only with `?audit=1` | `rollback-pre-1626` |
| 1625 | Misty's colour decisions at the source templates, reaction line icons, course-book key in the templates (observer removed), fewer boxes inside boxes, 16 px between cards | `rollback-pre-1625` |
| 1623 · 1624 | Course-book colour key on the teacher's Today strip and Schedule · teacher Schedule Trial chip teal · leave "waiting" amber · Finance insight icons teal | `rollback-pre-1622` |

Where the code lives: `<style id="ds1620">`, `ds1621`, `ds1622` in `<head>` of `app.html` (in the first paint, before any screen is drawn), and `css1623` + its script at the end of the page.

---

## 1 · Tokens

All tokens are CSS custom properties on `html:root:root` (that selector wins over every older `:root` / `html:root` block, wherever it sits in the page).

### Colour · brand and neutrals

| Token | Value | Use |
|---|---|---|
| `--coe-teal` | #01B0BF | Logo teal. Accents, bars, dots. **Never for text** (2.6:1). |
| `--coe-teal-600` | #00838F | Icons, thin accents, charts — **not for text** (4.3:1); `--d-teal` / `--ui-teal-d` point at teal-700 since 1626 |
| `--coe-teal-700` | #00707A | **Primary button**, links, current tab line (5.8:1 on white) |
| `--coe-teal-800` / `-900` | #005E66 / #004E55 | Primary hover / pressed |
| `--coe-on-tint` | #00575F | Text on a teal tint (selected filter, current menu item) |
| `--coe-teal-50` / `-100` / `-200` | #E3F4F5 / #CDEBEE / #8CC5CA | Tints and outline borders |
| `--coe-purple` | #2F2752 | Brand purple (logo ink) |
| `--coe-purple-600` / `-50` / `-200` | #4B3D8F / #EEEAF8 / #D5CEF0 | Management chips |
| `--coe-ink` | #2B2450 | Headings, key numbers, body text |
| `--coe-text` | #3A3556 | Body text in dense areas |
| `--coe-mute` | #5E5A76 | Secondary text, labels (6.6:1) |
| `--coe-faint` | #6B6783 | Least important text (5.4:1). Nothing lighter for text. |
| `--coe-line` / `-line-2` / `-line-strong` | #E7E5EE / #F0EEF5 / #CFCBDD | Card borders / row dividers / field and outline-button borders |
| `--coe-surface` / `-sunk` / `-page` | #FFFFFF / #F7F7FA / #FAFAFC | Cards / sunk panels / page background |

### Colour · meanings (semantic)

Each meaning has a foreground / background / border set. Every pair is AA (≥ 4.5:1) as text on its background.

| Meaning | Colour | fg / bg / border | Contrast | Means |
|---|---|---|---|---|
| **danger** | red | `--coe-bad-fg` #B42318 / `--coe-bad-bg` #FDECEA / `--coe-bad-bd` #F0BDB6 | 5.8:1 | A problem: late, missed, overdue, cancelled, not saved, failed, unexcused, below standard — or must be done **now** |
| **warning** | amber | `--coe-warn-fg` #7A4A00 / `--coe-warn-bg` #FFF4DE / `--coe-warn-bd` #EFD39C | 6.9:1 | Waiting or to check: waiting for someone (Operations, a parent, the teacher, you), due soon, ending soon, not paid yet, developing, 核对中 |
| **success** | green | `--coe-ok-fg` #1E6E4C / `--coe-ok-bg` #E6F4EC / `--coe-ok-bd` #BFE0CE | 5.5:1 | Done or OK: on time, sent, paid, renewed, enrolled, got it, meets / exceeds |
| **info** | teal | `--coe-info-fg` #00616A / `--coe-info-bg` #E3F4F5 / `--coe-info-bd` #A9D9DD | 6.4:1 | Brand and neutral information: Trial, New, CEFR level, counts, early reminder, selected filter |
| **management** | purple | `--coe-mgmt-fg` #4B3D8F / `--coe-mgmt-bg` #EEEAF8 / `--coe-mgmt-bd` #D5CEF0 | 7.5:1 | Management only / from management / private to management |
| **neutral** | grey | `--coe-neutral-fg` #4C4868 / `--coe-neutral-bg` #F1F0F6 / `--coe-neutral-bd` #E2E0EA | 7.6:1 | A plain label with no status: Regular, Sub, Ended, Seen, activity type |
| **muted** | outline | `--coe-muted-fg` #5E5A76 / border `--coe-muted-bd` | 6.6:1 | Unknown / not set yet (e.g. "Type?") |

**Blue is not a meaning.** It is only used inside charts (series colours) and the course-book colours (Free talk).

### Type

| Token | Value |
|---|---|
| `--coe-font` | Inter, then Noto Sans SC / PingFang SC / Microsoft YaHei for Chinese, then the system sans-serif |
| `--coe-font-brand` | Fredoka One — **only** the CupOfEnglish brand, main page titles (h1) and brand cards (price lists, pictures) |
| Sizes | `--coe-fs-12` .75rem · `-13` · `-14` · `-16` · `-18` · `-20` · `-24` · `-28` · `-32` |
| Line height | `--coe-lh` 1.5 body, `--coe-lh-tight` 1.2 headings and controls |

Roles: page title h1 Fredoka One 28–32 px laptop / 24 px phone · section heading h2 Inter 18 px semibold · body and fields 16 px · secondary 14 px · chips 13 px semibold · smallest label 12 px (never smaller). Amounts tabular and right-aligned. Weights: 400 body, 500 controls, 600 headings and key numbers.

### Spacing, radii, shadows, sizes

- **Spacing (8 px grid):** 16 px between the cards of a screen (1625). `--coe-sp-4` (half step, inside chips only) · `-8` · `-12` (half step) · `-16` · `-24` · `-32` · `-40` · `-48`. Inside a card 16; between rows 8.
- **Radii:** `--coe-r-xs` 6 · `-sm` 10 (fields, small panels) · `-md` 14 (cards) · `-lg` 20 (dialogs) · `-pill` 999 (buttons, chips, filters).
- **Shadows:** `--coe-sh-1` (resting card) · `-sh-2` (raised card) · `-sh-3` (menus, dialogs). One level per layer, never stacked.
- **Control sizes:** `--coe-ctl` 40 px laptop / 44 px phone or touch · `--coe-ctl-sm` 36 px laptop / 44 px phone (filter pills, segmented choices) · `--coe-chip-h` 22 px.
- **Focus:** `--coe-ring` 3 px, 2 px offset, on every focusable thing (`:focus-visible`).

### Older token families (still work, now point at the tokens)

`--d-*` (1000), `--c-*` (1101), `--ui-*` (900), `--ink`, `--mute`, `--line`, `--green`, `--red` are aliases. Use `--coe-*` in new code.

---

## 2 · Colour meanings across the app (inventory 29 Oct, after 1621)

| Where | Label | Colour |
|---|---|---|
| Lesson / class | Cancelled | red |
|  | Trial | teal |
|  | Regular · Sub · Ended | neutral |
|  | Live / Now | teal |
|  | Not yet (I'm in) | neutral |
|  | Early reminder · name time | teal |
|  | Validity ended … extended N days | amber |
|  | Open · teacher is free | green |
| Time-in | On time · Clocked in · Good internet | green |
|  | Late · Late time-in · I'm in · late | red |
|  | Time-in – (not sent) | neutral |
|  | Late to class pending review | amber (waiting for management) |
| Payment / finance | Paid · All N paid | green |
|  | Not paid yet · Please check | amber |
|  | Sales (+) | green number · costs / deductions (−) red number |
| Renewal / package | Renewed date | green |
|  | Renewal (due) · 5 or fewer left · ending soon | amber |
|  | Lessons left at the "renew now" level · 0 left · over | red (Students list: "soon" counts amber) |
|  | 核对中 (numbers being checked) | amber |
| Monthly report / trial report | Report not in yet · Being made | amber |
|  | Report (to send, overdue) · Trial report | red |
|  | Sent · Enrolled | green |
| Notices & requests | Not seen yet · Waiting on teacher | amber |
|  | Seen | neutral |
|  | ✓ Got it / Acknowledged | green |
|  | Private · management only | purple |
|  | From the teacher | teal |
|  | Needs you (count) | red count on the filter |
| Teacher "Needs your action" (urgency) | Tagged · Late · Message needing acknowledgement · QA visit (urgent) | red |
|  | Signature · Pay · Leave waiting (soon) | amber |
|  | Later items | teal |
|  | Unread · needs your acknowledgement / Read · not acknowledged yet | amber |
| To do (management) | Needs you (tile) | amber (waiting for you; red is kept for overdue) |
|  | ! Report · overdue | red |
| QA / performance | Exceeds · Meets Standard · domain 4–5 | green |
|  | Developing · domain 3 | amber |
|  | Needs improvement · Does not meet · domain 1–2 | red |
|  | Class record ≥ 95 % green · 85–94 % teal · < 85 % red | |
| To fix (Monitor, teacher Growth) | every miss (no I'm in, late time-in, no note, video late, no homework) | red |
| Cases | Excused green · Unexcused red · category labels neutral | |
| Leave | waiting for Operations | amber (counts and "approved" are neutral) |
| Monitor activity | Class video · Homework · Reminder … (activity type) | neutral, sentence case |
| Learner type | Early Years · Young Learners · Teens · Adults | teal |
| Student source | Partner · Referral · CupOfEnglish (grey, icon) · Not set (red) | |
| Calendar / class bars | Course book colours (W1, RAZ, WK, Phonics, RE, Free talk, OD, Other, Trial) | categorical, **always with a key** (management Schedule; teacher Today and Schedule since 1623) |
| Rank (Teachers map, avatars) | Master · Senior · Newly Qualified · Newly Hired · Starting · No rank | categorical, always with the rank name and a key |

Every status chip carries its words; 1101 also adds a mark (✓ green, ! red, ◷ amber), so nothing depends on colour alone.

---

## 3 · Components

### Buttons

| Kind | Look | Rule |
|---|---|---|
| **Primary** | `.btn` / `.btn.teal` — solid `--coe-teal-700`, white, semibold | **One per context** (card, dialog, row group). The first action in a list may be primary; the rest secondary. |
| **Secondary** | `.btn.ghost` (neutral outline) or `.x1101-sec` (teal outline, row actions) | Everything else that is a real action |
| **Tertiary** | text link (`.lk`, `a`) in `--coe-teal-700`, underlined on hover | Details, "Show all", "Open" |
| **Destructive** | `.x1101-dz` (red outline) · `.x1101-dzs` (solid red, only in the confirm step) | Delete, cancel a class, remove. Never primary-teal. |
| Size | 40 px laptop · 44 px phone/touch · pill · 14 px · 0 × 16 px (14 px for `.sm`) | `.sm` keeps its narrower padding but the same height |
| Disabled | 50 % opacity, not-allowed cursor | Busy: `aria-busy="true"`, 75 % |

Button words say what happens ("Copy reminder", "Mark as sent"), the same word in the toast afterwards.

### Chips (status pills)

`span.chip` + one of `green` `amber` `red` `teal` `mgmt` (or none for neutral). 13 px semibold, 2 × 8 px, pill. In new code you may use `.coe-chip.is-ok / is-warn / is-bad / is-info / is-mgmt / is-muted`. A chip is a label, not a button; a clickable filter is a pill in a `.seg` row.

### Tabs and segmented controls

- **Tabs** (switch screen sections): `.mo-tabs` / `.stu-tabs` — text, 3 px teal underline on the current tab.
- **Filters / segments:** `.seg > button` — outline pills 36 px (44 phone); selected = teal tint + teal outline + semibold.

### Form fields

Every text / date / time / number field and select: 40 px (44 phone), 16 px text, 10 px corners, `--coe-line-strong` border, teal focus ring. Labels above the field, 14 px semibold. Text areas: same border and text, own height. Prefer choosing from a list over typing (times in 24-hour).

### Cards

White surface, 1 px `--coe-line`, `--coe-r-md` corners, 16–20 px padding. **No box inside a box:** inside a card use dividers (`--coe-line-2`) or a sunk panel (`--coe-sunk`, no border), not another bordered card.

### Dialogs (sheets)

Title (h1/h2) top left · close button top right, 40 px round (44 phone), the same in every dialog · content · actions at the bottom, primary last on the right (full width on a phone). Escape and Back close (1585/1586).

### Empty, loading, error

- **Empty:** `.empty` — 14 px muted, centred, 24 px padding, one sentence that says what to do ("No classes this week. Add one with + Class.").
- **Loading:** grey skeleton bars (`.sk`) of the final height — never a spinner that changes the layout.
- **Error:** red text in plain words, what happened and what to do, plus **Try again** (secondary). Never only a toast for a screen that failed to load.

---

## 4 · Layout

- Laptop first; every screen centred, the same width (Misty's rule). Phones: 16 px side gutter, one column, no sideways scroll.
- Section rhythm: 16 px between the cards of a screen, 16 px inside cards, 8 px between rows.
- Headings: page title h1, then sections h2 18 px with the short teal bar where the screen already uses it; secondary info in `--coe-mute`.
- Fewer boxes: one card per section; rows separated by thin lines; no double borders.
- Numbers: tabular, right-aligned in tables; key numbers semibold `--coe-ink`.

## 5 · Usage rules (checklist for every change)

1. Colours: only tokens. A colour that means something uses its meaning from section 2 and always has words with it.
2. One primary button per context; destructive actions red-outline.
3. 40 / 44 px controls; no text under 12 px; contrast AA.
4. Styles in the first paint (in `<head>` or inline in the same step as the HTML) — run `tools/stability-check.js` and compare with main under the same load.
5. Do not restyle parent pictures, the payment confirmation or signed agreement text; they are drawn outside `#app` / `#sheet` and keep their approved design.
6. English only on staff screens; Chinese only on parent-facing content.

## 6 · Misty's decisions (29 Oct) — done in 1625

1. **Learner type chips** (Early Years / Young Learners / Teens / Adults) and the **Enquiries audience tags** (Kids & teens · Adults · Exam course, card labels, Price picture / Inquiry form banner and Copy button): **teal with the words**.
2. **Student source chips:** **grey with their icon**; "Not set" stays **red**. Source filter dots grey (Not set red); a chosen filter uses the normal teal selected look.
3. **"Needs you"** stays **amber**; red only for overdue.
4. **Reactions** ("✓ Got it", "👍 On it!", "⏰ Will do it today", "✅ Done!", "🙋 I have a question", "❤️ Thank you!", task "⏳ Carry over"): the screen shows a **line icon** (`rxH()`), the **saved text is unchanged**. Team Chat emoji reactions are message content and stay.
5. **Fredoka One** only for the brand and page titles; section headings Inter.

Rule for new work: colours are set **in the template or the screen's own CSS**, never by an observer or timer that restyles after paint (see the paint gate, 1650–1659). The course-book key is now drawn by the templates (`k1623()`); 1623's observer was removed in 1625.


## 7 · Contrast (1626): fixed at the source, never after paint

Until 1626, two "safety net" passes (1007 `contrast()`, 1101 `fixText()`) scanned every screen after it was painted and darkened text that missed AA (and laid a dark tint behind white text on light colours). They cost 150–450 ms per frame at 4× CPU and made colours change after first paint.

1626 logged everything they changed on all management and teacher screens (laptop 1440, phone 390, plus the first dialog of each screen): **1,226 changes**. They are now fixed where the colour is defined:
- **Text colours in CSS and templates:** 36 values that miss AA on light backgrounds are replaced in every `color:` declaration (same hue, mixed toward the ink #2B2450 until ≥ 4.6:1 on white and on the app's tints). The teals #00939D, #00A3AD, #00808A and #00838F become `--coe-teal-700` #00707A, and `color:var(--teal)` becomes `var(--coe-teal-700)`. The commonest are #8A86A0 → #716D8B (muted labels) and #6F6B85 → #6C6883.
- **SVG chart labels:** `<text fill="…">` values get the same treatment.
- **Colours that come from data** (book colours, rank colours, `--c` / `--bc` / `--sc` / `--t56`): the CSS uses `color-mix(in srgb, var(--x) N%, #2B2450)`, so every value stays its hue and passes. Inline `style="color:#…"` from templates is covered by attribute rules in `ds1626`.
- **White text on light data colours** (calendar blocks, avatars, step dots): a fixed dark tint (the one the pass used to add), in `ds1626`.
- **Not touched:** documents and pictures (payment confirmation, memos, agreements, print pages, parent pictures).

With all of that, the passes found **0** changes left on the same tour. They no longer run. Open the app with **`?audit=1`** to run them as before (development audit). New colours must pass AA in the CSS itself: use the tokens.

## Tests (each release)

`tools/check.js` (scripts + renewal suite) · `tools/regress-saves.js` 17/17 · `tools/stability-check.js` on every management and teacher screen, laptop and phone, release and main run side by side under the same load. Screenshots before/after: laptop 1440 and 1280, phone 390 (scratchpad `design/`).
