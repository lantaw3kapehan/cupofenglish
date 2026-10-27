/* 1358 · Weekly class times picture · SHARED RULE: this exact function is in management (app.html) and the partner portal (partner/index.html).
   Misty 20:36: in the current week, days that have passed are blank (faint "—" under the day header) and times already gone today are left out;
   never "Full · 已满" or "Not available" for the past. items: [{ t, b: 0 open | 1 booked, gone }] in time order. */
function wkpCol(pastDay, items, hasHours, fullSpec) {
  if (pastDay) return [];
  const L = items.filter(it => !it.gone), open = L.filter(it => !it.b).length, bk = L.length - open;
  return (fullSpec || (!open && bk) ? [{ full: 1 }] : !hasHours && !items.length ? [{ off: 1 }] : []).concat(L); }
