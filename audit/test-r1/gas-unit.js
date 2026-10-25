// Runs the Apps Script paste from SERVER-BIRTHDATE-paste.md against a fake DATABASE sheet. usage: node gas-unit.js <paste.md>
const fs = require('fs'), assert = require('assert'), vm = require('vm');
const md = fs.readFileSync(process.argv[2], 'utf8'), code = md.split('```javascript')[1].split('```')[0];
function world(){
  const cells = {}, fmt = {}; const k = (r, c) => r + ':' + c;
  const sheet = { getRange: (r, c) => ({ getValue: () => cells[k(r, c)] === undefined ? '' : cells[k(r, c)], setValue: v => { cells[k(r, c)] = v; log.push('set ' + k(r, c)); },
    getNumberFormat: () => fmt[k(r, c)] || 'General', setNumberFormat: f => { fmt[k(r, c)] = f; log.push('fmt ' + k(r, c)); } }) };
  const log = [];
  cells['27:1'] = 'ST-2026-105'; cells['27:6'] = new Date(Date.UTC(2018, 3, 1)); fmt['27:6'] = 'mmmm"//"yyyy'; cells['27:7'] = 8;
  const g = { console: { log: () => {}, warn: (...a) => log.push('warn ' + a.join(' ')) }, SpreadsheetApp: { getActive: () => ({ getSheetByName: n => n === 'DATABASE' ? sheet : null }) }, Date, String, Number, log, cells, fmt };
  /* the original saveStudent: writes f.birth as the old code would (blank → ""), and a date string → a Date with General format */
  g.saveStudent = function(t, f, row){ if('birth' in f){ const b = String(f.birth || ''); cells[row + ':6'] = b ? new Date(b + 'T00:00:00Z') : ''; if(b) fmt[row + ':6'] = 'yyyy-mm-dd'; } if(f.city) cells[row + ':10'] = f.city; return { ok: true }; };
  g.globalThis = g; vm.createContext(g); vm.runInContext(code, g); return g; }
let n = 0; const t = (name, fn) => { fn(); n++; console.log('  PASS ' + name); };
const F = o => Object.assign({ code: 'ST-2026-105', city: 'Ningbo' }, o);
t('blank birth (old app) → cell and format restored', () => { const g = world(); const r = g.saveStudent('T', F({ birth: '' }), 27); assert.ok(r.ok); assert.strictEqual(g.cells['27:6'].getTime(), Date.UTC(2018, 3, 1)); assert.strictEqual(g.fmt['27:6'], 'mmmm"//"yyyy'); assert.strictEqual(g.cells['27:10'], 'Ningbo'); });
t('birthKeep with original value → format "April//2018" kept', () => { const g = world(); g.saveStudent('T', F({ birth: '2018-04-01', birthKeep: 1 }), 27); assert.strictEqual(g.cells['27:6'].getTime(), Date.UTC(2018, 3, 1)); assert.strictEqual(g.fmt['27:6'], 'mmmm"//"yyyy'); });
t('missing birth key → untouched', () => { const g = world(); g.saveStudent('T', F({}), 27); assert.strictEqual(g.fmt['27:6'], 'mmmm"//"yyyy'); assert.ok(g.cells['27:6'] instanceof Date); });
t('new full date → written as the original saveStudent does', () => { const g = world(); g.saveStudent('T', F({ birth: '2018-04-15' }), 27); assert.strictEqual(g.cells['27:6'].getTime(), Date.UTC(2018, 3, 15)); assert.strictEqual(g.fmt['27:6'], 'yyyy-mm-dd'); });
t('birthClear → emptied', () => { const g = world(); g.saveStudent('T', F({ birth: '', birthClear: 1 }), 27); assert.strictEqual(g.cells['27:6'], ''); });
t('code in the row differs → no restore (left to saveStudent)', () => { const g = world(); g.cells['27:1'] = 'ST-2026-999'; g.saveStudent('T', F({ birth: '' }), 27); assert.strictEqual(g.cells['27:6'], ''); });
t('new row (row 0) → original only', () => { const g = world(); let called = 0; const o = g.saveStudent; g.log.length = 0; o('T', F({ birth: '' }), 0); assert.ok(!g.log.some(x => /^set 27/.test(x))); });
t('failed save (ok:false) → no restore write', () => { const g = world(); const w = g.saveStudent; /* rewrap a failing original */ const g2 = world(); g2.saveStudent = function(){ return { ok: false }; }; vm.runInContext(code, g2); g2.saveStudent('T', F({ birth: '' }), 27); assert.ok(!g2.log.some(x => /^set|^fmt/.test(x))); });
t('pasting twice wraps once', () => { const g = world(); const w1 = g.saveStudent; vm.runInContext(code, g); assert.strictEqual(g.saveStudent, w1); });
console.log('RESULT ' + n + ' passed');
