# Changes · 28 Oct 2026 · Team Chat like a real chat (Misty 10:09 / 10:11 / 10:12) · management and teacher views

## 1416 · real-chat layout
- My own messages on the right in a teal bubble; everyone else on the left in white (with the Management tag on management messages).
- Runs from the same person (within 5 minutes) are grouped: name and avatar once.
- Time: shown in the name line; on a laptop each later bubble shows its time on hover; on a phone a tap on a bubble shows the full date
  and time.
- "Seen by" appears only under the last bubble of a run (it repeated under every bubble before).
- Jump-to-latest round button when scrolled up more than a screen.
- Picture viewer: zoom with the wheel, pinch, double-tap or the buttons; drag to move; Escape / ✕ closes.
- "Copy link" on each message (tools on hover / long-press): the link opens the app on that message; the server still checks who may see it.

## 1417 · emojis and reactions (server coe-chat v12 · table chat_reacts)
- Emoji picker (smiley button in the box): recent emojis first, then Smileys · Gestures · Hearts · Work · Food · Nature (about 200,
  built into the app: works offline and in China). Inserts at the cursor; Escape or a click elsewhere closes it.
- Reactions: hover a message (laptop) or long-press (phone) → React → 👍 ❤️ 😂 😮 🙏 ✅ or + for more. Count chips under the bubble
  (mine highlighted); tap a chip → who reacted + add / remove mine. No alert is sent for a reaction. Everyone can see who reacted
  (like a real chat); management keeps its full read receipts.
- Live test (v12, hidden test message 38): 👍 saved and returned with the message; "<b>" refused ("Pick an emoji").
- Emojis are people's own content in chat; the app's own buttons and labels keep line icons.

## 1418 · mark up a picture
- A picture waiting to be sent has an Edit (pencil) button: Pen · Circle · Arrow · Box · Text · Crop, colours red (first) · yellow ·
  blue · white, Undo (Ctrl/Cmd+Z), Cancel / Done. Done saves a new flattened picture (shrunk to ≤ 300 KB like every chat picture) in
  place of the original; tick "Keep the original too" to send both.
- A received picture: open it → "Mark up and reply": the marked-up copy is attached to the box as a reply to that message.
- Built into the app (canvas, no outside library); works with mouse, pen and touch.

## 1419 · loud Team Chat sound, tab alert, push wording, settings, typing (Misty 10:11 / 10:12) · both views
- Our own sound (built into the app, works offline and in China): chat-alert.wav — rising G–C–E–G chime (0.8 s), played twice, for
  tagged / @All / Needs reply / direct messages; chat-msg.wav — short E–A chime (0.4 s), once, for an ordinary group message (not for
  muted groups; can be switched off). Both normalised to −1 dBFS and played at the chosen volume (default 100 %). Different from the
  class-reminder sounds. Nothing rings while my class is running; the alert rings when the class ends.
- Laptop in the background: the tab title blinks "(2) New message · Team Chat" and the tab icon gets a red number; both stop when the
  app is looked at again.
- Phone alerts: title "CupOfEnglish Team Chat", sender and group in the text, app icon, Android vibration, mentions stay on screen until
  tapped (sw.js). The phone itself chooses the alert sound.
- Chat sounds (sound button in the chat header): Chat sounds on/off · Ordinary group messages on/off · Volume · Test sound /
  Test message sound.
- "… is typing" for the open chat only (shares the 4-second check; kept 6 s). Teachers only see management typing (privacy rule:
  no presence of other teachers).
- Stability: teacher Team Chat open 0.28 on some runs comes from a sheet that opens by itself in the preview about 9 s after load;
  it happens on the build before 1419 too (2 of 3 runs) — not from these changes.

## 1450 · Team Chat final polish (Misty 12:25) · management and teacher views, laptop first
English
- All Teachers: "Chat with teachers and management here. For official notices, leave requests, or pay-related inquiries, go to
  Notices & requests." Other chats end with the same guidance; Time-in / Substitutes / private chat descriptions reworded.
- "No messages today" · "View earlier messages" · "Back to conversation" · "Still open from earlier days" · "Last active 12:05" before
  presence times · "Management" spelled out in the participant panel · time-in note reworded.
Management composer (behaviour unchanged, verified against the server: reply flag, acknowledge flag, pin flag, Notices form)
- "Requires reply" · "Requires acknowledgement" · "Pin message" · "Templates" · "Create formal notice"; selected ones turn teal with a
  check mark and a line says what the message will do ("This message will ask everyone in this chat to reply by 18:00 and stay pinned
  at the top."). Tooltips explain each; acknowledgement is "read and understood", not task completion.
- Acknowledgement wording everywhere: "Acknowledge" button, "2 of 4 acknowledged", "You acknowledged", "Please acknowledge", Today line
  "Acknowledge Celine's message in Team Chat". Reply chip: "Reply requested by 13:06 · 1 of 4 replied".
- Create formal notice: the Notices & requests form now starts with "This creates a formal notice in Notices & requests, not in Team
  Chat. Only the people you tick below receive it … Check the recipients before you tap Send."
Layout
- Participant panel: ✕ hide button (management; remembered on this device, also via the Members button). Teachers keep the small list.
- "Find a teacher" above the direct chats (management, when there are more than 5).
- No boxes scrolling inside the chat: pinned shows 2 lines, "Still open" shows 2 items + Show all; on short laptop screens
  (≤ 860 px tall, e.g. 1366×768) 1 line / 1 item and the key hint is hidden, so the conversation keeps its space.
- Option row wraps instead of scrolling: no label is ever cut off (checked 1024, 1366, 1440, 390).
Audience
- Search is "Search all my chats", with its scope ("…A direct chat stays private: only that teacher and management can read it.")
  and each result labelled with its chat ("In All Teachers", "In Teacher Ara · private"); the header no longer shows the previous
  chat's members while searching.
