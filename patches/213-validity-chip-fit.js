// 16 Oct · validity notice: sized to its text on class cards; months as Jan … Sep … Dec.
require('../tools/lib.js')(process.argv[2], [
["  .vn-row{display:block;margin-top:4px}`;", "  .vn-row{display:flex;width:max-content;max-width:100%;margin-top:4px}`;"],
["const fmt = s => new Date(s + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });", "const fmt = s => (+s.slice(8, 10)) + ' ' + ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][+s.slice(5, 7) - 1];"],
]);
