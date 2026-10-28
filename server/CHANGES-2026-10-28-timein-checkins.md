# Team Chat · class check-ins go to Time-in + "Send to Time-in" (1495–1496 · coe-chat v16) · 28 Oct 2026

Misty:
- **17:59** "time-in message should only be in TIME-IN MESSAGE not ALL TEACHERS"
- **18:02** "once they click COPY TO WECHAT … it goes directly to TIME-IN … ensure it captures everything before it auto sends"
- **18:06** "If weak signal they should try and be informed their network is bad."

## What teachers see
- **Time-in group:** teachers can now post a class check-in there: a picture with a short caption (up to 140 characters, e.g. "In, Abner's class"). Text-only posts, voice messages and replies stay off for teachers in Time-in. A note above the box explains this.
- **All Teachers:** a picture whose caption looks like a check-in ("In…", "I'm in", "check-in", "time-in"), or a bare picture between 60 min before and 15 min after the teacher's class, asks **"Post in Time-in instead?"**. **Post in Time-in** is the main button and Post in All Teachers is the secondary one. Nothing is ever moved silently. The descriptions say "Class check-in screenshots go in Time-in".
- **Time-in picture (after Time in):** the old Copy picture → paste in WeChat → tick Posted in WeChat is replaced by a preview of exactly what will be sent and one **Send to Time-in** button.
  - The button stays off until the picture, time-in time, status and internet check are all there. It also stays off if the screen picture isn't on this device ("open Today on the laptop you timed in on").
  - The send states are Sending… / Sent to Time-in · 18:04 / Not sent · Try again.
  - Copy picture for WeChat and Save picture stay as small links.
  - The previous silent automatic post was removed, so nothing is sent before the teacher checks it.
- **"I'm in" (each class):** the result card now shows the screen proof with the caption it will send ("In, Abner's class · 17:52 · On time") and a **Send to Time-in** button.
- **Weak signal (Misty 18:06; wording per the 18:20 review):** a clear amber warning stays on the card until the post is sent, with a main **Try again** button.
  - If the last reading is poor (the app's own rule: under 10 Mbps, ping over 200 ms or jitter over 100 ms): "**Your internet is weak · not sent yet.** Check your LAN cable / Wi-Fi, then tap Try again. Internet checked 17:02: ↓ … · jitter …".
  - If the reading was good: "**Not sent yet · connection dropped.** Check your LAN cable / Wi-Fi, then tap Try again." No reading is shown.
  - The post is kept on the device and retried every 30 s and when the internet comes back.
  - Needs your action shows "Your time-in picture is not sent yet" (red) until it arrives.
- **One reading:** the card picture and the Time-in post header use the same check (the time-in's, or the redo's).
- **No "Seen by 0":** a teacher's own post shows "Seen by" only after someone has seen it. Management's "Seen by X of Y" is unchanged.
- **No duplicates:**
  - There is one time-in card per teacher per day; Send again or a redo replaces the card.
  - Class check-ins carry a key (`ci-<day>-<class>`), so a retry or double tap never posts twice.
  - The automatic time-in card and the picture are the same post.
- **Wording:** Today, the time-in sheet, the time-in reminder, Needs your action and the redo sheet now say "Team Chat › Time-in" instead of "WeChat corner".

## What management sees
- **Time-in group:** a "Not arrived yet" strip lists any teacher whose post is waiting (weak internet since 18:04, with the internet reading) or was refused.
- **Participant panel:** the same note appears as that teacher's status.
- **Privacy:** teachers never see other teachers' notes.

## Alerts, unread and Today
- **Teacher check-ins in Time-in:** receipts and phone alerts go to management only, and as soft (merged) alerts, never the loud mention sound. The automatic time-in card's alert also now goes to management only (before, every teacher got one).
- **Teachers' unread:** Time-in never counts toward a teacher's unread unless management tags them or asks for a reply there. Management's own Time-in messages still reach the teacher as before.
- **All Teachers totals:** they no longer include check-ins. Unread is counted per chat, so moved posts count in Time-in, which is management-only for teachers.
- **Today items:** unchanged; check-ins create no Today item.

## Existing posts moved (gid only: author, time, picture, reactions and receipts kept)
| id | teacher | time | caption |
|---|---|---|---|
| 40 | Julia | 15:24 | In, Ms. Mandy's class |
| 42 | Kat | 16:51 | In, Phyllis' class |
| 44 | April | 16:58 | In, Arvin's class (text, paired with 45) |
| 45 | April | 16:58 | picture |
| 48 | Pam | 17:50 | In Grace's class |
| 50 | Christian | 17:52 | In, Abner's class |
| 51 | Dezza | 17:52 | picture (1 min before her captioned 52) |
| 52 | Dezza | 17:53 | In, Jeffrey's class |
| 56 | Cy | 17:55 | In,Nini's class |
| 59 | Mayi | 18:25 | picture (paired with 60) |
| 60 | Mayi | 18:26 | In, Lewis's class |

- **Moved:** 11 posts (8 pictures with captions, 3 bare pictures, 2 caption texts sent next to a picture). **Ambiguous / left in place:** none.
- **Not moved:** Celine's picture (id 20, 27 Oct) and management's follow-ups 54, 55 and 57 (replies to Kat, Pam and Christian) stay in All Teachers, and they still show the quoted check-in.
- **Older posts:** none were found before 28 Oct.
- **Rollback list:** saved in `docs` key `sys:chatmove1495`. Rollback with `update chat_messages set gid = 'all' where id in (40,42,44,45,48,50,51,52,56,59,60);`

## Server (coe-chat v15 → v16)
- **Send rules:**
  - A teacher's post in Time-in needs a picture, with a caption of 140 characters or fewer.
  - No mentions and no reply-to. Receipts go to management, and soft alerts to management only.
  - The automatic card's alert goes to management only.
  - Unread in Time-in counts for teachers only when they are tagged.
- **New action `pend`:** stores a teacher's own waiting or failed note in the new table `chat_pending` (RLS on, server only). It is cleared when the post arrives. Management sees it in `presence` (`pend`) and in the Time-in `list` (`pending`).
- **Grants:** this project doesn't give the server role access to new tables by default; that was granted explicitly in migration `chat_pending_1495_grants`.

## Checks
- **Preview, fake server:**
  - A check-in in All Teachers asks, and Post in Time-in posts to `timein` with the picture.
  - An ordinary picture posts straight away.
  - Time-in composer: note shown, mic and emoji hidden, 140-character limit; text-only is refused on the device.
  - Time-in picture: Send stays off until complete; on a weak signal the amber warning shows the internet reading with Try again and a pending note goes to management; Try again then sends, the note clears and the button shows "Send again".
  - "I'm in": preview + Send; weak signal → warning; when the internet comes back it sends by itself with the same key (no duplicate).
  - Management: the "Not arrived yet" strip and the panel status show.
- **Live (test sign-ins only, no production messages):**
  - A teacher's text-only or voice post in Time-in is refused.
  - `pend` stores the note and clears it with off.
  - Management's Time-in list shows the note; a teacher's shows none.
- **Screenshots for Misty:** the preview loaded a local copy of html2canvas 1.4.1, so the real card is drawn with the screen proof. Phone 390 and laptop 1440 shots cover: the Today card, Needs your action, the preview, Sending, Sent, connection dropped, weak internet, "I'm in" preview and sent, and Team Chat › Time-in.

## Not changed (for a decision)
- **WeChat tick in the time-in flow:** the old hidden `wcOk` check ("Post your screenshot in the WeChat corner first") is always ticked and does nothing.
- **Other WeChat wording:** "Copy … paste it in WeChat" for parents' class groups (reminders, reports, renewals) is unchanged; that WeChat use is for parents, not the teachers' corner.

## Rollback
- **Screens:** branch `rollback-pre-1495`.
- **Server:** redeploy coe-chat v14 from the commit before 1495, or leave v16 (it is backward compatible).
- **Data:** see the rollback list above.
