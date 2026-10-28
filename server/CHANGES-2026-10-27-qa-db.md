# QA evaluations saved in the database first — release 1362 (27 Oct 2026)

Misty approved at 23:27: QA evaluations go through the database first.

## What changed
- **Send evaluation** now saves the evaluation in the database straight away. The sheet closes at once with "✓ QA evaluation sent". A save is identified by its own id, so sending it twice never creates a duplicate.
- **The teacher's Growth** shows the new evaluation within about a minute. Before this release it could take one to two hours, until the QA-DATA copy caught up.
- **Google is still updated exactly as before.** The app sends the same evaluation to QA-DATA behind the screen, and the "QA sent" mark and the QA row copy still run as they did. Nothing has to be pasted into Apps Script, so the app works now without one.
- **If Google refuses the evaluation**, a toast says so and the writing is kept: the draft is cleared only after Google confirms the save. The database copy is marked *failed* and is never shown. The app does not resend to Google on its own, so Google can never receive the same evaluation twice.
- **If the database save fails**, or takes longer than 6 s, the app falls back to the old way and waits for Google.

## How Growth uses the saves
Growth reads the saved evaluations from the table `coe_qa_saves`.
- **Until the QA-DATA copy has the evaluation**, Growth shows the saved one. The match uses the teacher, the evaluation date, the evaluator and the class observed.
- **Once the copy has it**, Growth uses the copy's row. It keeps the time of the first save, so the app does not treat it as a new evaluation.
- **Not shown:** saves marked failed or unmapped, and pending saves that Google has not confirmed after 3 h.

## Parts
| Part | What it does |
|---|---|
| Table `coe_qa_saves` | Columns: rid (the save's id), who sent it, teacher, row (laid out like QA-DATA), status, msg (notes such as unmatched headings), times. Status is pending, landed, failed or unmapped. Not readable from the browser. |
| Edge function `coe-qa` | `save` is management only. It lays the answers out by matching the QA-DATA headings to the form's question titles, in order. `done` records Google's answer. |
| Edge function `coe-growth` v5 | Merges the saves into Growth as described above. |
| `patches/1362-qa-database-first.js` | Changes the app's `qaSend`. |

## Checks
- **Column mapping:** tested against the real QA-DATA headings and the real form (cached in docs). All 27 columns are filled, the five comment columns are taken in turn, scores are stored as numbers, and checkbox answers are joined the same way the sheet joins them.
- **Fails safe:** if the form's titles change and no longer match the headings, the save is marked *unmapped*. It is never shown, and Google still gets the evaluation as before.
- **Release:** the stability check passed, the rollback branch is `rollback-pre-1362`, and CI passed.

## Not done
- **Apps Script paste:** not needed for this change, because Google keeps working through the app exactly as today. The Code.gs source could not be read tonight because the browser link to the computer is disconnected. A later step, where the server writes QA-DATA itself, will need that source.
- **Night report (mgmtNight) from the database:** blocked for the same reason. The port needs the Code.gs source.

## Rollback
- **App:** revert the release to the branch `rollback-pre-1362`.
- **Server:** with the app change reverted, nothing calls `coe-qa`. `coe-growth` only shows pending or landed saves, so no new ones appear.
