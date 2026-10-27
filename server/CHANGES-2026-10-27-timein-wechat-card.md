# 27 Oct 2026 · Time-in picture for the WeChat corner · fuller internet test · "Ask to redo check" (release 1270)

**Why (Misty, 10:03–10:14):** teachers posted a separate speed.cloudflare.com screenshot in the WeChat corner. Now the app makes ONE
picture with everything management checks, and management can ask a teacher to redo the time-in check.

## Teachers
1. Time in exactly as before (class laptop, 40-minute window, entire-screen picture, location). The tick *before* time-in
   ("I posted my first-class screenshot…") is gone.
2. After saving, a sheet shows the steps — **1 Tap Copy picture · 2 Open the WeChat corner and paste it (Ctrl+V · ⌘V) · 3 Send ·
   4 Come back and tick Posted in WeChat** — and "You no longer need to send the speed-test screenshot — this picture has
   everything." (shown in full the first 3 times, then folded under "How to post it…").
3. The picture (landscape 1600 × ~1060, readable as a ~500 px WeChat thumbnail): logo + date, teacher name, "Timed in 09:12" +
   On time / Late, first class; **What management checks** — On time · Class laptop · LAN cable (✓ / ⚠ Wi-Fi · "see the picture"
   when the browser does not say) · Screen proof · Internet (the same label as the app's internet warnings) · Location; the screen
   proof picture; Download / Upload / Latency / Jitter; provider + city and device; the "Learn with the best" tagline small
   (38 px) at the bottom. **Privacy:** the card (posted in the teachers' group) never shows the IP address, street/barangay or
   coordinates — only "Location shared" and the provider's city. Management still sees the exact location, map link and IP in the app.
4. Copy picture → clipboard (fallback: the picture is saved as a file). Until "Posted in WeChat" is ticked, "Post your time-in
   picture in the WeChat corner" stays in **Needs your action** that day.

## Internet test (time-in only; "I'm in" keeps its short test)
- Cloudflare's method: ~20 pings (latency = median, jitter = mean difference of consecutive pings, first ping = connection
  warm-up), download 100 kB × 8 → 1 MB × 6 → 10 MB × 2 (only on fast lines), upload 100 kB × 6 → 1 MB × 4, speed = 90th
  percentile; ~10–13 s; network times from the browser's timing record where Cloudflare allows it. Thresholds unchanged.
- The time-in **does not wait** for it: it is saved with the provider/IP already known, the card shows "measuring…" and fills in
  by itself (same size, no jump), and the result is saved in the database (`coe_wechat_posts.speed`) and shown everywhere as the
  time-in's internet. Measured in the preview: tap → "Time-in saved" 1.9 s / 4.4 s (screen share 0.6 s / 3 s) vs 2.3 s / 4.3 s
  before (within noise).

## Ask to redo the check (management)
- Time-in rows (Monitor › Time-ins) and the internet details panel: **Ask to redo check** → reasons (Internet too weak · Screen
  proof not clear / not entire screen · Wi-Fi not LAN · Not the class laptop · Other + note).
- The teacher gets an urgent first item in Needs your action: "Management asked you to redo your time-in check · reason · Redo
  now" → fresh full internet test + entire-screen picture + location → a new picture with an amber **REDO · Internet re-checked
  10:24 · asked by management: …** banner → copy → post → tick.
- **The time-in time and On time / Late never change.** The redo's internet result replaces the time-in's internet (rows,
  chips, weak-internet flags); the details panel keeps "First check 09:12 · … · replaced by the redo 10:24". The redo's screen
  picture and location are extra proof (private storage bucket `timein-redo`, opened by management through a 1-hour link).
- Status chips (only the current state): amber "Redo asked · reason" → teal "Redone · 10:24 · reason"; "WeChat ✓ 09:14" / "WeChat not posted".

## Server
- Tables `coe_wechat_posts`, `coe_timein_redo` (service role only, RLS on), bucket `timein-redo` (private). Migrations
  `coe_wechat_posts_20261027`, `coe_timein_redo_20261027`.
- Edge function `coe-wct` (own token check): post · net · mine (teacher) · day · ask (management) · redo · redoPost (teacher).
- No Google paste. Google's time-in record keeps its own data; it usually has no speed now (the full test finishes after the save),
  so the app shows the database result instead.

## Rollback
Screens: branch `rollback-pre-1270`. Server: leave coe-wct/tables (unused without the screens).

## 27 Oct afternoon · release 1272 (after Teacher Pam's real picture, 15:21)
- **Privacy:** while a time-in / redo / "I'm in" screen picture is taken (share prompt → frame grabbed) the whole app is covered by a
  neutral screen (logo + "Taking your screen picture…"); everything else is hidden, so the pay rate, student codes and phone numbers
  can never be in the picture. After sharing starts, a 3-second countdown asks the teacher to bring the VooV window to the front.
  (This adds ~3 s to a time-in / "I'm in".)
- **Upload "0.0 Mbps"** was a test that never ran (the download rounds used the whole time budget on a slower line). Upload now has
  its own ~4.5 s, is sent the way Cloudflare accepts from another site (no-cors), and a missing/≤0.05 result shows "not measured"
  everywhere (older saved "↑ 0.0 Mbps" results too). Thresholds unchanged.
- The checklist row is now "Screen proof · check VooV + date/time" with the neutral "…" (it is a reminder, not checked automatically).
- Rollback: branch `rollback-pre-1272`.

## 27 Oct evening · release 1273 (after April / Kat / Mayi's cards, 16:54 — "there's no green light if the timein is okay")
- **No copy while measuring:** Copy picture / Save picture stay off with "Checking internet… a few seconds" until the internet
  result is in; after 25 s without a result the card says "Internet · not measured". A later result still updates the card, the
  database and management (a card already posted while measuring is corrected in the app, not in WeChat).
- **Green status:** "All good · Ready to teach" pill at the top when on time, class laptop, good internet and location shared;
  otherwise "Needs a look" (red) or "Please check below" (amber). LAN cable and Screen proof are neutral "check in picture" rows
  (eye icon) — management's visual checks, they do not block the green. Line icons on every row.
- **Same look everywhere:** the card's fonts (Fredoka One + Inter) ship with the app (`fonts/card-*.woff2`) and are loaded before
  the picture is drawn (the page's Google fonts use display=optional, so some computers drew the card in a fallback font). Fixed
  left column; long text ends with "…" instead of running under the screen picture.
- **Jitter thresholds:** amber over 30 ms, red over 100 ms (were 15 / 30); download (red < 10, amber < 25 Mbps) and ping (red > 200,
  amber > 100 ms) unchanged. One rule for the card, Today, management rows and details.
- **Screen picture:** after Share the app shows "Click your VooV class window now" and takes the picture once the app window is in
  the background (up to 6 s); while the picture is taken the cover is blank, so "Taking your screen picture…" can no longer appear in it.
- Rollback: branch `rollback-pre-1273`.
