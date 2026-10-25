# CupOfEnglish app — screen & role inventory (from code, 25 Oct 2026)

Source: `app.html` as live (COE_V 1158), read from code — not from a browser session. Nav lists were also rendered in
headless Chromium with a synthetic fixture and **all network blocked** (`/tmp/claude-0/g890/nav.js`, `hl.js`), so they reflect
the final state after every layered patch (812 groups, 816/636 Contracts/Notices, 817/819/823 Finance, 810 Monitor).
Line numbers = `app.html` lines. "api(X)" = Apps Script / database call through `api()`; reads vs writes follow `API_READ`/`API_BG`/`SB_R` (l.1150–1228).
Edge functions: `FAST_URL + '-mgmt' | '-trials' | '-monitor' | '-expenses' | '-fb' | '-pay' | '-payall' | '-notes' | '-push' | '-clash'`, and
Supabase functions `coe-wallet`, `coe-contract`, `coe-notice`, `coe-invoice`, `coe-train`.

## 0. Roles and how the code tells them apart

| Role | Test in code | Notes |
|---|---|---|
| Teacher | `D && !D.mgr` | nav `NAV_T` (l.1478) reshaped at l.11935 (groups Classes · Team · My growth · Pay), + Messages (`tinbox`, l.6189), Books (l.11710), Activity log (`act`, l.23460), Trainings (`train`, l.23310), My Contract (`contract`, l.21587). |
| Operations (management, not President) | `D.mgr && !D.pres` | same sidebar as President. `isPres()` false (l.1483). `D.ops` is never read. |
| President | `isPres()` = `D.mgr && D.pres` | 22 `isPres()` branches. President-only: Mark paid / Undo paid on a payslip (l.3278); "Teachers to pay" in the decision queue (l.4089); Overview Business card + Sales & costs data load (l.4103, 9622, 15590); Teacher Excellence full view (l.12507); Overview sf24 trial/ops strip (l.16340); wallets (server "President only", l.20773); refunds sheet (l.21204/21319). Leave approval queue differs: President sees requests with `r.ops` (passed by Ops), Ops sees the rest (l.4077, 3539, 3566). |

Phone vs laptop (management): laptop shows every sidebar entry; phone bottom bar shows only `k!==1` items — **Overview · Monitor · Schedule · Students · Finance · More**; `More` (view `more`, `renderMore` l.4501) lists To do · Messages · Trials · Teachers · Contracts · Notices of breach.

## 1. Management (Operations + President)

### 1a. Sidebar (final, laptop) and tab bars

| Group | Sidebar entry → view | Tab bar on that page (patch 812/816/823) |
|---|---|---|
| Today | Overview → `home` | — |
| | Monitor → `monitor` (810) | Monitor's own sub-tabs (All · Time-ins · Classes · Videos · Homework & notes · Reports · Schedule · Leave & cases · Students · Finance · Messages); "Time-ins" = view `team` |
| | To do → `mtoday` | — |
| | Schedule → `schedule` | — |
| | Messages → `msgs` | — |
| Students | Students → `astudents` | Students · Parent reports (`reports`) · Database (`db`) |
| | Trials → `trials` | Trials · Enquiries (`enquiry`) |
| Teachers | Teachers → `teachers` | Teachers · Performance (`perf`) · Trainings (`train`) · Leave (`leave`) · Cases (`actions`) · **Contracts** · **Notices of breach** (these two open a panel, not a page — see §4) |
| | **Contracts** (button `.sb-rec`, `ctAdmin()`) | opens a dialog |
| | **Notices of breach** (`ntAdmin()`) | opens a dialog |
| Finance | Finance → (`payroll` button, click rewired to `finov`, l.24941) | Overview (`finov`) · Payroll (`payroll`) · Transactions (`expenses`) · Sales & costs (`money`) |
| — | More → `more` (phone only) | — |

Views not in the sidebar but reachable: `team` (Monitor › Time-ins; also Overview "On time" tile), `active` (Packages; from Overview tiles and student pages; removed from nav l.8808), `mypay` (removed from mgmt nav l.24647; reachable only by old saved view), `gov` (label/tooltip only, no `v-gov` element).

### 1b. Management pages

| Screen (view) | How to reach | Data it loads | Writes it can make |
|---|---|---|---|
| Overview `home` | sidebar; default landing | `hmLoad` (l.4100): mgmtOverview (loadMgmt), mgmtHealth, mgmtPayReady, mgmtSchedule(today), TODAY tab (mgmtTab/tdDbGet), MONEY (President), mgmtActions, mgmtReports, mgmtPeer, mgmtPerformance, mgmtActive; coe-monitor (811 card); -trials ops (sf24, President); mgmtVidFlags; mgmtMonDay | late decision (`decideLate`/mgmtTagClass via #lqmBox); video check OK/Needs action (`mgmtVidFlagSet`); availability reminder |
| Monitor `monitor` | sidebar | `FAST_URL-monitor` (coe-monitor), mgmtMonDay, mgmtClassInfo, mgmtNoteGet | late decision (`moDecideGo` → mgmtTagClass), note comment (mgmtNoteComment) |
| Time-ins `team` | Monitor › Time-ins | MO.team/late (mgmtOverview), mgmtHours, mgmtTeacherVisits, mgmtVisitCoverage | decideLate, mgmtShiftClose, mgmtMemoInfo, close shift |
| To do `mtoday` | sidebar; Overview "N things need you" | TODAY tab (tdDbGet / mgmtTab 'TODAY'), mgmtRenewals, mgmtTrialFus, mgmtFixIgnored, mgmtTrials, agreements map (mgmtAgreeMap), enquiries (mgmtEnqList) | mgmtRenewal (renewal status/✓ Sent), mgmtRenewPaid, mgmtTrialFu (follow-up steps), mgmtTrialSent, mgmtFix / fixIgnore, mgmtPkgFix, mgmtEnqSave, mgmtRemindLog |
| Schedule `schedule` | sidebar | mgmtSchedule (per day + 7 ahead), schedLists, mgmtAvailAll, leave list | addClass, editClass (incl. cancel/change teacher), classCheck, mgmtSetBook, mgmtTagClass, -clash check |
| Messages `msgs` | sidebar | mgmtMsgs | mgmtMsgSend, mgmtMsgReply, mgmtMsgSeen |
| Students `astudents` | sidebar | mgmtStudents, mgmtStuClasses, dbLists/dbRecord, mgmtStuLog | saveStudent, setSharedPkg, mgmtSetCourse, mgmtSetBook, mgmtRefund (President), mgmtEnrolPaid, mgmtAgreeSave, setActiveTick |
| Parent reports `reports` | Students › Parent reports; Overview "Quality" | mgmtReports, mgmtReportsWait, mgmtReport, mgmtReportPdf, mgmtTrials | mgmtReportSent (Mark sent), mgmtReportReturn, mgmtTrialSent, mgmtTrialReturn |
| Database `db` | Students › Database | mgmtDatabase, dbLists | saveStudent (via dbRow form) |
| Packages `active` | Overview tiles; student page | mgmtActive | setActiveTick, mgmtPkgCheck/mgmtPkgFix, mgmtRenewal |
| Trials `trials` | sidebar | mgmtTrials, -trials (trialData, trialsAhead), mgmtTrialPdf, mgmtTrialSearch | mgmtTrialSent, mgmtTrialGroup, mgmtTrialCefrSave, mgmtTrialPdfNow, mgmtTrialSentPic, mgmtZh |
| Enquiries `enquiry` | Trials › Enquiries | mgmtEnqList | mgmtEnqSave (status, details, notes, links, sent pictures) |
| Teachers `teachers` | sidebar | mgmtTeacherCard (loadTT), mgmtOverview, mgmtProfiles, mgmtAvail, mgmtTeacherWeek | mgmtProfileSave, mgmtProfileImg, mgmtAvailSave, setTeacherEmail, mgmtPwSave, mgmtAccessOff |
| Performance `perf` | Teachers › Performance | mgmtPerformance, mgmtPeer, mgmtPeerMonth, mgmtQaLast | mgmtQaSubmit, mgmtPeerAssign, mgmtPeerCancel |
| Trainings `train` | Teachers › Trainings | coe-train (list/all/my/get/stu) | coe-train: tick, record, approve, decide, quiz, reflect, file, attend, coaching |
| Leave `leave` | Teachers › Leave | mgmtLeave, mgmtLeaveClasses, mgmtLeaveProof | mgmtLeaveSave (approve/decline), mgmtLeaveAsk |
| Cases `actions` | Teachers › Cases | mgmtActions | addCase, setCaseDone, mgmtCaseWaive |
| Finance Overview `finov` | sidebar Finance | MONEY tab (mgmtTab), payroll (mgmtPayroll), -expenses | none (links to + Sale / + Expense) |
| Payroll `payroll` | Finance › Payroll | mgmtPayroll (PAYROLL ledger), mgmtPayReady, mgmtPayChecks, mgmtOverview, PAY tab (mgmtTab) | markPaid (President), mgmtPayNudge, mgmtPayVerNudge, mgmtPayReply, mailInvoice |
| Transactions `expenses` | Finance › Transactions | -expenses (EXPENSES + sales copy) | addSale / addExpense (sendMoney) |
| Sales & costs `money` | Finance › Sales & costs | MONEY tab (loadMoney), moneyLists, coe-wallet (President) | addSale, addExpense, coe-wallet transfer/remit/check/out/void (President), coe-invoice |
| My pay `mypay` | (not in mgmt nav) | mgmtMyPay | — |
| More `more` | phone bottom bar | — | — |

## 2. Teacher

| Screen (view) | How to reach | Data it loads | Writes it can make |
|---|---|---|---|
| Today `today` | nav (Classes); default | getBootstrap/refresh, tReminders, tVidList, tVidFlags, tFbStatus, tPayReady | timeIn, timeOut, classIn ("I'm in"), saveNote, markHomework, tRemindLog, tSetMeet, tVidStart/tVidDone/tVidExplain (video upload), tNotMine |
| Schedule `tsched` | nav | tSchedule, tAvail | (open times via tAvOpen sheet) |
| Students `students` | nav | D.students, tStudent | tFbSubmit (monthly feedback), tTrialSubmit, tPcSubmit (progress check), tGoalsSave, tNoteTag |
| Books `books` | nav | course books (-mgmt op books, Drive) | — |
| Messages `tinbox` | nav (Team) | tMsgs | tMsgSend, tMsgSeen, tMsgAck |
| Activity log `act` | nav (Team) | tMyComments / tMyVisits / own log | — (copy as proof) |
| Growth `growth` | nav (My growth) | tGrowth, tGoals | tGoalsSave |
| QA feedback `qa` | nav (My growth) | tGrowth, tMyVisits, tNoteComments | tVisitAck |
| Trainings `train` | nav | coe-train (my) | coe-train tick/quiz/reflect/file/coaching |
| Pay `pay` | nav | tPayCheck, tPayReady | tPayVerify (confirm / dispute) |
| My Contract `contract` | nav | coe-contract (my) | coe-contract sign/respond; coe-notice explain/reply |

## 3. Bottom sheets / dialogs (`openSheet` callers, 167 call sites) — name · purpose

Management
- Schedule & classes: `classForm` New class · `classEdit` edit/cancel a class · `cxSheet`/`cxWelcome`/`cxText`/`dl` welcome & cancellation messages (copy) · `swOpen` switch/teacher change · `paint` Change teacher / schedule (l.13557/13632) · `ctRun` change-teacher progress · `show`/`watch` "Not saved/added in Google Calendar" · `_seRetry` Not saved (retry) · `cbOpen` Change book · `bookSheet`/`_bkGo` Course book · `bbAll`/`put`/`cov` Course Books · `label` weekly class times picture · `rr` weekly open times picture · `avOpen`/`avPaint` teacher open slots · `avAllOpen`/`avaPaint` all teachers' open times · `twOpen` teacher week · `classBrief` learning focus.
- Students & packages: `openStudent` student page (full sheet) · `stuForm` edit student · `dbRow` database row · `activeRow` package row · `pkgCheck` Package check · `enSheet`/`saleOpt`/`T`/`enSave` Enrolled · paid · `m0` Renewed · paid / already renewed · `renSheet` renewal reminder · `rfOpen`/`rfView` Refund (President) · `shSummary` Shared lesson summary · `opt` service agreement · `enqAgrAny` Service agreement · `cfSheet` CEFR picture · `cjPic` CEFR journey picture · `ppSheet` Price picture · `prPic` Progress report picture · `pcOpen`/`pcForm` Progress checks · `cpSheet` Course plan · `cpContent` class content reply · `docSheet` documents · `o` Level-up check · `celCopy`/`col` celebration message/picture.
- Trials & enquiries: `trialSheet` Trial report · `fixScore` trial scores · `inp` New enquiry · `enqForm` Inquiry form · `enqNote` note · `enqInv` invoice · `it` Link a trial · `welCopy` welcome · `fuSheet` follow-up update · `fuCopy` follow-up message · `payOpen` Payment (tagged person / Alipay QR) · `cnOpen`/`cnPaint`/`cnPick` Class notice.
- Reports: `rpOpen` Parent report · `rpAppOpen` parent report (app) · `fbSheet` Monthly feedback.
- To do: `fixSheet` data fix · `tdCopy` Reminder (copy fallback) · `wsSheet` Last week · `wsCopy` copy.
- Teachers: `profOpen`/`up` profile card · `mine`/`tabSheet` PAY/other tab view · `kpiSheet` Teacher Excellence · `qaSheet` QA evaluation · `pmAssign` Assign a peer review · `peerSheet` Peer review · `vaOpen` class visit · `growthSheet`/`gl` growth & timeline · `hrsSheet` hours · `mgPwList` Management passwords · `pwSet` Password · `setupView` Teaching setup · `ctSheet` emails · `macPerm` screen sharing help.
- Monitor/time-ins: `moDecide` late decision · `timeInSheet`/`tapTimeIn` Time in · `actLogCopy`/`paint` Copy as proof · `_vcAct`/`_vcRes` video check · `vidLateAsk` late video · `lvPic` on-leave picture · `pill`/`per` leave request/record · `lvMsg` leave message · `decide` decisions.
- Messages: `msgNew` New message · `msgOpen` thread · `order` "Sent to N people".
- Cases: `caseSheet` New case · `caseView` case.
- Contracts & notices: `ctAdmin` Contracts · `ntAdmin` Notices of breach · `ntAdminView` notice · `ntNew` Send a notice of breach.
- Finance: `saleSheet` Add sale · `expSheet` Add expense · `paySheet`/`payRow` payslip row (Mark paid, President) · `draw` Payslip · `n1` Teacher pay (PAY tab, 821) · `pay71Copy`/`payNudgeCopy` WeChat messages · `sec`/`sf24List` monthly lists.
- Trainings: `trOpen`, `trPart`, `trPartEdit`, `trView`, `trCell` (matrix cell), `trSched`, `trAttend`, `trList`/`trListOpen` Videos & quizzes, `trBooks`, `trAllPath` All trainings, `trSeeAs`, `trCoach`/`trCoachDone`/`trCoachPlay`/`trCoachRec` 1:1 coaching, `sh` quiz.
- Other: `pushAlSheet` Phone alerts · `wxLink` Shared WeChat group · `sheetBack` back stack · `copyCell` copy · `popH`, `row`, `done`, `back`, `two`, `T` generic helpers.
- Wallets (President) use their own modal `#wlM` (`modal()`, l.20760+): Transfer · Remit · Check balance · Out · Wallet history (`wlHist`) · Undo.

Teacher
- `classIn` I'm in · `timeOutSheet` Time out · `hwSheet` Homework · `noteSheet` Class note · `meetSheet` Meeting ID · `tRemind`/`show` Reminder · `notMineSheet` Not my student anymore · `fbSheet` Monthly feedback · `trialSheet` Trial report · `peerSheet` Peer review · `pcForm` Progress check · `tsOpen` My schedule · `tAvOpen`/`tAvPaint` My open times · `tMsgNew`/`tMsgOpen` messages · `payDispute` "Something's wrong with my pay" · `paySheet` payslip · `ctMy`/`ctRead`/`ctPrint` My Contract · `ntView` Notice of breach · `pill` Request leave · `trOpen`… trainings.

## 4. Page-vs-dialog behaviour

| Entry | Expected | Actual | Status |
|---|---|---|---|
| Sidebar "Contracts", "Notices of breach" | page like every other sidebar entry | dialog (`ctAdmin`/`ntAdmin` write into `#sheetBody`) | 892: marked "panel", `aria-haspopup="dialog"`; making them pages needs their paint code moved off `#sheetBody` — left as is |
| Teachers tab bar "Contracts", "Notices of breach" (816) | tab = page | dialog | 892: divider + "panel" mark + tooltip |
| Phone More › Contracts / Notices | list → page | dialog | same as above |
| Payroll › "PAY tab" (821) | — | dialog (wide sheet) | by design (sheet of a sheet tab), not a nav item |
| Sidebar Finance | Finance overview | opens `finov` (823 rewires click) — tooltip said "Teachers' monthly pay and payslips" | 892: tooltip fixed |
| Overview "On time" tile → `team` | Monitor | `team` = Monitor › Time-ins, Monitor highlighted | OK |
| Every other nav entry / tab | page | page | OK |

## 5. Forms that save (write calls)
Apps Script / database (`api()` / `apiNow()`), grouped: **classes** addClass, editClass, classCheck, mgmtSetBook, mgmtTagClass, decideLate, mgmtShiftClose ·
**students/packages** saveStudent, setSharedPkg, setActiveTick, mgmtSetCourse, mgmtPkgFix, mgmtEnrolPaid, mgmtRenewPaid, mgmtRenewal, mgmtRefund, mgmtAgreeSave ·
**trials/enquiries** mgmtTrialFu, mgmtTrialSent, mgmtTrialSentPic, mgmtTrialGroup, mgmtTrialCefrSave, mgmtTrialPdfNow, mgmtTrialReturn, mgmtEnqSave, mgmtZh ·
**reports** mgmtReportSent, mgmtReportReturn, tFbSubmit, tTrialSubmit, tPcSubmit, tPeerSubmit ·
**teachers** mgmtProfileSave, mgmtProfileImg, mgmtAvailSave, setTeacherEmail, mgmtPwSave, mgmtAccessOff, mgmtQaSubmit, mgmtPeerAssign, mgmtPeerCancel, mgmtLeaveSave, mgmtLeaveAsk, addCase, setCaseDone, mgmtCaseWaive, mgmtFix, mgmtVidFlagSet ·
**messages** mgmtMsgSend, mgmtMsgReply, mgmtMsgSeen, tMsgSend, tMsgSeen, tMsgAck, mgmtRemindLog, tRemindLog ·
**pay/finance** markPaid, mgmtPayNudge, mgmtPayVerNudge, mgmtPayReply, tPayVerify, addSale, addExpense, mailInvoice ·
**teacher day** timeIn, timeOut, classIn, saveNote, markHomework, tSetMeet, tNotMine, tHwFlag, tGoalsSave, tNoteTag, tVidStart, tVidDone, tVidExplain, tVisitAck, tLeaveRequest, tLeaveCancel, tLeaveReply ·
**auth** passwordLogin, requestCode, setPassword, signOut.
Supabase functions: coe-wallet (add/void/fee…), coe-contract (sign, countersign, witness, issue, paper, mailed), coe-notice (new, explain, reply, decide, void), coe-invoice, coe-train (tick, record, approve, quiz, reflect, file, attend, coaching), `-mgmt` ops write/writeStatus/classAdd/classEdit/setBook/lateDone/newCode, `-push` (sub/prefs/test).

## 6. Generated documents
| Output | Function(s) | Kind |
|---|---|---|
| Payslip / PAY tab / memo / contract print | `done`→`window.print` (l.3227/3349/4044), `memoPrint` (l.4371), `ctPrint`/`fit` (l.21530/21570) | browser print / PDF |
| Payment confirmation / invoice PDF | `render` with html2canvas + jsPDF (l.20268–20272), `jspdf` (l.13960) | PDF + PNG |
| Trial report & parent report PDF | `pdfPng`/`pdfPic` (l.4011–4027), `rpSave` (l.6062), `tlSaveF` (l.6001), `make` (l.14048/14271/24328) | PDF→PNG |
| Pictures for WeChat (canvas) | `docPic` (html2canvas l.3990), `prfDraw` profile card, `avPic`/`avaPic`/`label`/`rr` open times, `lvpDraw` on-leave, `cxDraw` cancellation, `cfSave` CEFR, `cjSave` CEFR journey, `ppSave` price, `payQr` payment QR, `agrPic` agreement, `memoPic`, `celSave` celebration, `bbPic` book covers, `tapCopyShot` time-in proof, `row` refund (l.21312), `share`/`toPng` | PNG download / clipboard |
| Signatures | `initPad`/`padPng` (l.21490–21499) | PNG in contract |
| CSV exports | `exCsv` (l.24641 Expenses, 24703, 24957 Transactions) | CSV |
| Other downloads | `avCopy`, `lvProof`, `lvpCopy`, `prfCopy`, `give`, `download` (l.20281) | file |
