// 2692 (Misty 22 Nov 14:14, Yufan): a trial with speaking only · the assessment picture leaves out the "Writing · Pending" tile
// (Speaking takes the full width) when the student has not started any writing. Writing in progress still shows Pending.
require('../tools/lib.js')(process.argv[2] || 'app.html', [
  [`    [['Speaking' + (CAMX() ? ' · out of 5' : ''), a.sp_band, a.cefr_sp, '#EEF7F7'], [CAMX() ? 'Writing · out of 5' : 'Academic Writing · Task 2', a.wr_band, a.cefr_wr, '#F2F0FA']].forEach((t, i) => { const x = PAD + i * (tw + 24); c.fillStyle = t[3]; rr(x, y, tw, 220, 28); c.fill();`,
   `    const T2692 = [['Speaking' + (CAMX() ? ' · out of 5' : ''), a.sp_band, a.cefr_sp, '#EEF7F7'], [CAMX() ? 'Writing · out of 5' : 'Academic Writing · Task 2', a.wr_band, a.cefr_wr, '#F2F0FA', 1]].filter(t => t[1] != null || !(t[4] && !a.essay_started_at && !String(a.essay || '').trim() && !a.essay_submitted_at));
    const tw2 = T2692.length === 1 ? WD - PAD * 2 : tw;
    T2692.forEach((t, i) => { const x = PAD + i * (tw2 + 24); c.fillStyle = t[3]; rr(x, y, tw2, 220, 28); c.fill();`],
]);
