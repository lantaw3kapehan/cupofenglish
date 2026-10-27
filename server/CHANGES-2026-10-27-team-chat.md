# 27 Oct 2026 · Team Chat pilot (release 1400)

Misty, 18:36–18:42: "our official WeChat group chat but all in the app — we can tag the teacher, it can be seen, they can reply…
if we know they have seen, at what time, and they reply". "Keep the day message fresh … after yesterday it remains just in the history."

## What it does
- **Groups:** All Teachers (official), Time-in, Announcements (management posts; teachers answer with the buttons), Substitutes.
  **Direct:** management ↔ each pilot teacher (teachers see one "Management" chat).
- **Today + History:** each group opens on Today (Manila midnight). Earlier days are under **History** (day list with counts, read-only).
  Pinned messages and still-open "Needs reply" / "Confirm" messages from earlier days stay on Today ("Still open from earlier (N)").
- **@tag** a teacher or **@All** (type @, pick from the list). The tagged message is highlighted for that teacher and sends a phone alert.
- **Seen by N of M** on every message → tap: who saw it and when, who replied and when, who confirmed, who has not seen it yet.
- **Needs reply** (+ optional "by" time) and **Confirm**, set by management. Red until answered.
  Teachers answer in one tap: **Noted · On it · Done** (or Reply). Confirm messages have a **Confirm** button.
- **Pinned** (management), **Edit** (writer; shows "edited"), **Hide** (management; the row stays, management can show it again). Nothing is ever deleted.
- **Pictures:** shrunk on the device to ≤ 300 KB, stored in the private `chat` bucket, shown with 1-hour links.
- **Time-in:** when a pilot teacher times in, her time-in card picture posts itself in the Time-in group (a redo replaces it, marked "Redo").
  The WeChat copy flow is unchanged during the pilot.
- **Search** every message: word, person, from/to date.
- **Members panel:** online / in class / last seen.
- **Phone alerts:** tags, @All, announcements, needs-reply, confirm and direct messages → existing web push. **Quiet during class:**
  held while the teacher has a class running, sent when it ends.
- **Nudges:** tagged / needs-reply and not seen after 10 min → one reminder; still not seen after 20 min → "Not seen · <teacher>" alert to the
  management writer.
- **Ready-made (management):** Redo time-in · Late for class · Substitute needed.

## Turning it on / off, adding teachers
Database doc `sys:chat`: `{"enabled": true, "pilot": ["Pam", "Kat", "April"], "mgmt": ["CupOfEnglish", "Celine"]}`.
- Off for everyone: set `enabled` to false (the menu item disappears on the next open; nothing is removed).
- Add a teacher: add her name to `pilot` (as she signs in, e.g. "Julia"). Everyone: list all teacher names.
- `mgmt`: management accounts that are members (receive alerts and count in "Seen by").

## Live / where
- App: patch `patches/1400-team-chat.js` (+ `1400-team-chat.inc.html`), menu: management › Today › Team Chat; teachers: Team Chat after Today.
- Database: `chat_groups`, `chat_messages`, `chat_reads`, `chat_outbox` (RLS on, service role only), bucket `chat`, function `coe_chat_out()`
  + cron `coe-chat-out` (every minute), edge function `coe-chat`. SQL: `server/sql-chat-1400.sql`.
- Live updates: the open chat checks every 4 s; elsewhere every 30 s (unread dot). (Supabase Realtime needs a public client key and
  table policies the app doesn't use; 4-second checks keep the custom sign-in.)

## Later
Response-time metrics in Performance · Substitute "I'll take it" button · Export a group's history · teacher picture/voice notes.

## 1401 · 27 Oct 19:40 · every teacher + WeChat-group basics
- **Everyone:** `sys:chat.pilot = "*"` = every active teacher (signed in or taught in the last 30 days), minus `exclude`
  (Virgo, Daniela, Marife, Lovely — Misty 19:31). Excluded teachers get no menu item, are not members, can't be tagged, and their
  time-in does not post. Members now: Misty, Celine + April, Ara, Christian, Cy, Dezza, Julia, Kat, Mayi, Pam, Resa, Rose.
- Misty's management account (CupOfEnglish, works@) shows as **Misty** (`alias`). Celine has her own account.
- **Alerts for every group message** (All Teachers / Time-in / Substitutes): sent ~45 s later and merged per person
  ("Team Chat · N new messages"). **Mute** per group (bell, in the group header); tags, @All, Needs reply, Confirm, Announcements and
  direct messages always come through. Quiet during class as before.
- **Unread count** on the Team Chat menu item and on each group; opening a group jumps to "New messages".
- **Quote-reply:** Reply button, long-press (phone) or right-click (laptop); the quote shows the original even from another day.
- **Your message shows at once** while it sends; reading older messages is no longer pushed down when new ones arrive.
- **Voice messages:** hold the microphone (up to 60 s), stored in the chat bucket.
- Teachers' Team Chat sits second in their menu (after Today).
- Next: teacher-to-teacher private chats (not now — All Teachers is the shared space), response times in Performance, substitute claim, export.

## 1402 + 1403 · 27 Oct 20:15 · design, mention sound, status, unread numbers
- Design (Misty 19:56): one three-pane surface filling the screen (chats 260 px · conversation · members 260 px; members are a toggle under
  1280 px and a sheet on phones); sidebar-sized list (15 px, no "Teacher" prefix, 28 px avatars); Reply/Edit/Pin/Hide as a small icon toolbar
  on hover (laptop) or long-press (phone); quiet "Seen by"; consecutive messages grouped; own and management bubbles teal; composer chips in
  one scrolling row; "No more messages today"; header "Today · N members · N online", Mute / History / Search / Members / Sound.
- Mention sound (Misty 19:57): chime.wav (7 KB, served with the app) when a new message tags me / @All / Needs reply / a direct message,
  on any screen; not for ordinary group messages; held while my class runs and played when it ends; "Tap to turn on chat sounds" if the
  browser blocks sound; "Sound on/off" in the chat header (default on); purple pulsing Team Chat badge for mentions.
  Phone alerts for those are urgent (tag chat-at-*): they stay on screen until clicked (requireInteraction, Android/desktop Chrome) and vibrate
  longer on Android. The sound of a phone alert is the phone's own notification sound (iPhone: system sound).
- Fixed: chat phone alerts never reached phones (names were not lower-cased for coe_push_subs — every chat alert said "no phone" before 20:10).
- Status (Misty 19:59): Members in three sections ONLINE · IN CLASS · AWAY; "In class · until 20:25" (no student name); last seen with the day
  ("Yesterday 22:05", "Mon 21:55"); "Not opened yet"; "Next class 20:40" for away teachers within 2 hours.
- Unread numbers (Misty 20:00): each group and direct chat shows its unread number (purple when it includes a mention, teal otherwise);
  the Team Chat menu item shows the total.
- Retention: chat rows and the chat bucket are kept in CupOfEnglish's database; no cleanup job touches them (checked coe-log-clean,
  coe-daily-archive, coe-speed-trim).
