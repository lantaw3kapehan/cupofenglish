# Server paste · trial report PDF wording that fits adults too (25 Oct)

**What's wrong:** Will (Business English, adult) got a children's PDF:
1. **No Learner type reached Google.** The app's faster Send button left it out. This is fixed in the app (patch 798), so the PDF used the children's row: "family, school and hobbies", "A2 Flyers / A2 Key", Oxford Discover roadmap.
   → Setting Learner type **Adult · business** brings the adult row (TR-PATH › AdultB|A2): "work, travel and daily life", "A2 Key (KET)" and Business Partner A2 → B1 → Market Leader.
2. **The skill breakdown (page 2) has no adult version.** TR-CEFR has one line per skill and level for everyone. Four lines are written for children, for example Listening A2 "short dialogues about family, school and hobbies".
   → This paste rewrites those 4 lines so they fit children and adults alike. All other lines are already neutral.

| Key | Now | After |
|---|---|---|
| L1 · A2 | …short dialogues about family, school and hobbies | …short dialogues on familiar everyday topics |
| R2 · A2 | …and says if they liked it | …and says what they think of it |
| L1 · Pre-A1 | …(name, age, colour) | …(name, age, family) |
| S4 · Pre-A1 | …(colours, numbers, family) | …(numbers, family, food) |

## Step 1 · Paste at the very bottom of the last file (CupOfEnglish Teacher App)

```javascript
// 25 Oct · TR-CEFR: the 4 children-only can-do lines → wording that fits children and adults (trial report PDF, page 2)
function zzTrWords25() {
  const sh = ss_().getSheetByName('TR-CEFR'); if (!sh) { console.log('TR-CEFR missing'); return; }
  const NEW = {
    'L1|A2': ['Understands the main point of short dialogues on familiar everyday topics', '能听懂有关熟悉的日常话题的简短对话大意'],
    'R2|A2': ['Answers who/what/where questions about a text and says what they think of it', '能回答有关文章的“谁、什么、哪里”等问题，并说出自己的看法'],
    'L1|Pre-A1': ['Understands very simple questions about themselves (name, age, family)', '能听懂有关自己的简单问题（姓名、年龄、家人）'],
    'S4|Pre-A1': ['Uses a few single words for familiar things (numbers, family, food)', '能用少量单词表达熟悉事物（如数字、家人、食物）']
  };
  const v = sh.getRange(1, 1, sh.getLastRow(), 5).getValues(), done = [];
  v.forEach((r, i) => { const k = String(r[0]).trim(); if (NEW[k]) { sh.getRange(i + 1, 4, 1, 2).setValues([NEW[k]]); done.push(k); } });
  SpreadsheetApp.flush(); console.log('TR-CEFR updated: ' + done.join(', '));
}
```

## Step 2 · Save (Cmd+S), choose **zzTrWords25**, click **Run**
The log says `TR-CEFR updated: L1|Pre-A1, S4|Pre-A1, L1|A2, R2|A2`. No new deployment is needed: it only changes the sheet.

## Step 3 · Will's PDF
App › **Parent reports › Trial classes › Will** › Learner type **Adult · business** › confirm, then **Make PDF now**.

Note: if the Excel Daily trial script ever rebuilds TR-CEFR (a new TR_PATH_VERSION), run zzTrWords25 again.
