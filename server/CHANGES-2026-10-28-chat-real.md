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
