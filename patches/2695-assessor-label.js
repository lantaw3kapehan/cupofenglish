// 2695 (Misty 22 Nov 14:27, option A): the assessor's name on the assessment picture sits on a light lavender band
require('../tools/lib.js')(process.argv[2] || 'app.html', [
  [`    c.fillStyle = '#4A4766'; c.font = '400 28px ' + F; c.fillText([new Date(a.assess_date + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }), a.assessor ? 'Assessor: ' + a.assessor : ''].filter(Boolean).join('  ·  '), PAD, 372);`,
   `    { const d0 = new Date(a.assess_date + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) + (a.assessor ? '  ·  Assessor: ' : ''); c.fillStyle = '#4A4766'; c.font = '400 28px ' + F; c.fillText(d0, PAD, 372);
      if(a.assessor){ const x = PAD + c.measureText(d0).width + 4; c.font = '700 28px ' + F; const w = c.measureText(a.assessor).width; c.fillStyle = '#ECE9F7'; rr(x, 372 - 32, w + 28, 44, 22); c.fill(); c.fillStyle = '#3C3489'; c.fillText(a.assessor, x + 14, 372); } }`],
]);
