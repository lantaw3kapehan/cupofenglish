// 21 Oct · All-time total, honest label (Misty: "how about those started 2020, 2021, 2022, 2023?"). The payroll on record starts
// in January 2024 (COE DATABASE › PAYROLL). When a teacher's paid months start there, the card says "since Jan 2024 · payroll before
// 2024 is not on record yet" instead of "all time", so nobody reads a partial total as their whole history.
require('../tools/lib.js')(process.argv[2], [[
"net, all time · ${n} paid month${n === 1 ? '' : 's'} · ${esc(mLab(first))} – ${esc(mLab(last))}",
"${first <= '2024-01' ? `net · ${n} paid month${n === 1 ? '' : 's'} since ${esc(mLab(first))} · <i style=\"color:#8A87A0;font-weight:600\">payroll before 2024 is not on record yet</i>` : `net, all time · ${n} paid month${n === 1 ? '' : 's'} · ${esc(mLab(first))} – ${esc(mLab(last))}`}"]]);
