// node audit/timeline/verify.js <preview.html> <tag> <width>
// For every teacher row on Monitor › Time-ins "Today's timeline": reads the recorded time-in (row title "in HH:MM"),
// measures the dot's centre and the hour labels, and computes where the time SHOULD be (linear between hour labels).
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
(async () => {
  const [,, file, tag, w] = process.argv; const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: +w, height: 900 } })).newPage();
  await p.goto('file://' + path.resolve(file)); await p.waitForTimeout(12000); await p.evaluate(() => go('team')); await p.waitForTimeout(4000);
  const res = await p.evaluate(() => {
    const box = document.querySelector('#v-team .tl11'); if(!box) return { err: 'no timeline' };
    box.scrollIntoView({ block: 'start' });
    const sx = box.querySelector('.sx'); if(sx) sx.scrollLeft = 0;
    const labels = [...box.querySelectorAll('.ax i')].map(i => { const r = i.getBoundingClientRect(); const [h, m] = i.textContent.split(':').map(Number); return { min: h * 60 + m, x: r.left + r.width / 2, text: i.textContent }; });
    // labels are centred on their time? read the left% anchor instead: the <i> left edge is at its time if not translated
    const lab2 = [...box.querySelectorAll('.ax i')].map(i => { const cs = getComputedStyle(i); const r = i.getBoundingClientRect(); const tr = cs.transform; return { text: i.textContent, left: r.left, cx: r.left + r.width / 2, tr }; });
    const track = box.querySelector('.r .tr').getBoundingClientRect();
    const rows = [...box.querySelectorAll('.r')].map(r => { const t = r.getAttribute('title') || '', m = t.match(/· in (\d{1,2}):(\d{2})/), dt = r.querySelector('.dt'); if(!m || !dt) return null;
      const d = dt.getBoundingClientRect(); return { name: r.querySelector('span').textContent, rec: m[1].padStart(2, '0') + ':' + m[2], min: +m[1] * 60 + +m[2], dotX: d.left + d.width / 2 }; }).filter(Boolean);
    return { labels, lab2: lab2.slice(0, 3), track: { left: track.left, width: track.width }, rows };
  });
  if(res.err){ console.log(tag, res.err); await b.close(); return; }
  // expected position: linear fit of label positions (time → x) using the labels' anchor
  const L = res.labels; const anchor = l => l.x; // centred labels
  const fit = (min) => { let a = L[0], z = L[L.length - 1]; for(let k = 0; k < L.length - 1; k++) if(min >= L[k].min && min <= L[k + 1].min){ a = L[k]; z = L[k + 1]; break; } if(min < L[0].min){ a = L[0]; z = L[1]; } if(min > z.min){ a = L[L.length - 2]; z = L[L.length - 1]; } return anchor(a) + (min - a.min) / (z.min - a.min) * (anchor(z) - anchor(a)); };
  const pxPerMin = (anchor(L[L.length - 1]) - anchor(L[0])) / (L[L.length - 1].min - L[0].min);
  const rows = res.rows.map(r => { const exp = fit(r.min), err = r.dotX - exp; return { teacher: r.name, recorded: r.rec, dot_x: Math.round(r.dotX), expected_x: Math.round(exp), error_px: +err.toFixed(1), error_min: +(err / pxPerMin).toFixed(1) }; });
  const out = { tag, width: +w, px_per_hour: +(pxPerMin * 60).toFixed(1), labels: L.map(l => l.text), label_anchor: res.lab2, rows, max_abs_error_min: Math.max(...rows.map(r => Math.abs(r.error_min))) };
  fs.writeFileSync(`audit/timeline/${tag}.json`, JSON.stringify(out, null, 1));
  // annotated screenshot: draw a thin line at each expected position and the time text
  await p.evaluate(rows => { rows.forEach(r => { const d = document.createElement('div'); d.style.cssText = 'position:fixed;top:0;bottom:0;width:0;border-left:1px dashed rgba(220,0,120,.6);z-index:99998;pointer-events:none;left:' + r.expected_x + 'px'; document.body.appendChild(d); }); }, rows);
  await p.evaluate(() => { const box = document.querySelector('#v-team .tl11'); box.scrollIntoView({ block: 'start' }); window.scrollBy(0, -10); });
  await p.screenshot({ path: `audit/timeline/${tag}.png` });
  console.log(tag, 'px/hour', out.px_per_hour, 'rows', rows.length, 'max |error| min', out.max_abs_error_min); console.table(rows.slice(0, 12)); await b.close();
})();
