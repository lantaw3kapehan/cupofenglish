
// ───────────────────────── 23 Oct 2026 · BOOKS TO BUY: covers from COURSEWARE (Misty: parents buy on Taobao, often by photo search)
// mgmtBookCovers(token, codes, force): for each book code (coe_book_map), finds the Student Book and Workbook PDFs in COURSEWARE
// (coe_book_files), takes page 1 as a large picture (Drive thumbnail, 1400 px), stores it in Supabase storage "covers" (public) and
// fills coe_book_buy (title + Taobao search words when still empty — management can edit them). force = take the covers again.
API_FNS.push('mgmtBookCovers');
function bookBuyDefaults_(code, label) {
  const k = String(code).toLowerCase(); let m;
  if ((m = k.match(/^od(\d)$/))) return ['Oxford Discover 2nd edition · Level ' + m[1], '牛津探索 Oxford Discover 第二版 ' + m[1] + '级 学生书 练习册'];
  if ((m = k.match(/^odf(\d)$/))) return ['Oxford Discover Futures · Level ' + m[1], 'Oxford Discover Futures ' + m[1] + ' 学生书 练习册'];
  if (k === 'ref') return ['Reading Explorer Foundations', '美国国家地理 Reading Explorer Foundations 学生书'];
  if ((m = k.match(/^re(\d)$/))) return ['Reading Explorer · Level ' + m[1], '美国国家地理 Reading Explorer ' + m[1] + ' 学生书'];
  const opw = { thealphabet: 1, shortvowels: 2, shorvowels: 2, longvowels: 3, consonantblends: 4, letterblends: 5, lettercombination: 5, lettercombinations: 5 }[k];
  if (opw) return [String(label || ('Oxford Phonics World ' + opw)).replace(/^Oxford Phonics (\d)/, 'Oxford Phonics World $1'), '牛津自然拼读 Oxford Phonics World ' + opw + '级 学生书 练习册'];
  if ((m = k.match(/^raz([a-z]{1,2})$/))) return ['Raz-Kids · Level ' + m[1].toUpperCase(), 'RAZ 分级阅读 ' + m[1].toUpperCase() + '级'];
  if ((m = k.match(/^dkenglishlevel(\d)$/))) return ['DK English for Everyone · Level ' + m[1], 'DK English for Everyone Level ' + m[1] + ' Course Book Practice Book'];
  if (k === 'dkenglish') return ['DK English for Everyone', 'DK English for Everyone Course Book Practice Book'];
  if ((m = k.match(/^pathways(\d)$/))) return ['Pathways · Level ' + m[1], 'Pathways ' + m[1] + ' 美国国家地理 学生书'];
  if (k === 'pathwaysfoundation') return ['Pathways Foundations', 'Pathways Foundations 美国国家地理 学生书'];
  if ((m = k.match(/^wondersg(k|\d)$/))) return ['Wonders · Grade ' + m[1].toUpperCase(), '加州语文 Wonders ' + (m[1] === 'k' ? 'GK' : 'G' + m[1]) + ' 学生书'];
  if (/^business/.test(k)) return ['Business Partner B1', '培生 Business Partner B1 商务英语 学生书'];
  return [label || code, String(label || code)];
}
function bookFiles_(rules, files) {
  const bad = /unit|test|answer|audio|\bkey\b|teacher|guide|flash|poster|story|script/i, pick = { sb: null, wb: null };
  (rules || []).forEach(r => {
    const re = r.n ? new RegExp(r.n, 'i') : null;
    const L = files.filter(f => f.path === r.p && /pdf/i.test(f.mime || f.name) && (!re || re.test(f.name)));
    if (!pick.wb) pick.wb = L.find(f => /work ?book|practice|\bwb\b/i.test(f.name)) || null;
    if (!pick.sb) pick.sb = L.find(f => /student|course ?book|\bsb\b/i.test(f.name)) || L.find(f => !bad.test(f.name) && f !== pick.wb) || null;
  });
  return pick;
}
function bookCoverUp_(fileId, name) {
  const tok = ScriptApp.getOAuthToken(), r = UrlFetchApp.fetch('https://www.googleapis.com/drive/v3/files/' + fileId + '?fields=thumbnailLink&supportsAllDrives=true', { headers: { Authorization: 'Bearer ' + tok }, muteHttpExceptions: true });
  const link = (JSON.parse(r.getContentText() || '{}') || {}).thumbnailLink; if (!link) throw new Error('no picture of page 1 yet');
  const img = UrlFetchApp.fetch(link.replace(/=s\d+$/, '=s1400'), { headers: { Authorization: 'Bearer ' + tok }, muteHttpExceptions: true });
  if (img.getResponseCode() !== 200) throw new Error('picture ' + img.getResponseCode());
  const c = sbCfg_(), ct = img.getHeaders()['Content-Type'] || 'image/jpeg', ext = /png/.test(ct) ? 'png' : 'jpg', path = name + '.' + ext;
  let up = UrlFetchApp.fetch(c.url + '/storage/v1/object/covers/' + path, { method: 'post', contentType: ct, payload: img.getBlob().getBytes(), headers: { apikey: c.key, 'x-upsert': 'true' }, muteHttpExceptions: true });
  if (up.getResponseCode() >= 300) up = UrlFetchApp.fetch(c.url + '/storage/v1/object/covers/' + path, { method: 'post', contentType: ct, payload: img.getBlob().getBytes(), headers: { apikey: c.key, Authorization: 'Bearer ' + c.key, 'x-upsert': 'true' }, muteHttpExceptions: true });
  if (up.getResponseCode() >= 300) throw new Error('store ' + up.getResponseCode() + ' ' + up.getContentText().slice(0, 120));
  return c.url + '/storage/v1/object/public/covers/' + path + '?v=' + Date.now();
}
/** Management: take book covers from COURSEWARE (a few books per call; the app calls it in batches). */
function mgmtBookCovers(token, codes, force) {
  const u = mgr_(token), t0 = Date.now();
  const maps = sbReq_('GET', 'coe_book_map?select=code,label,rules') || [], have = {}; (sbReq_('GET', 'coe_book_buy?select=*') || []).forEach(x => have[x.code] = x);
  const want = Array.isArray(codes) && codes.length ? codes.map(x => String(x).toLowerCase()) : maps.map(x => x.code);
  const out = [];
  for (const code of want) {
    if (Date.now() - t0 > 240000) { out.push({ code: code, later: true }); continue; }
    const m = maps.find(x => x.code === code); if (!m) { out.push({ code: code, msg: 'not in the book list' }); continue; }
    const h = have[code] || {}, def = bookBuyDefaults_(code, m.label), row = { code: code, title: h.title || def[0], search_cn: h.search_cn || def[1], updated_by: u.name, updated_at: new Date().toISOString() };
    try {
      const ps = (m.rules || []).map(r => 'path.eq.' + encodeURIComponent('"' + r.p + '"')).join(',');
      const files = ps ? (sbReq_('GET', 'coe_book_files?select=id,name,path,mime&gone_at=is.null&or=(' + ps + ')') || []) : [];
      const f = bookFiles_(m.rules, files), res = { code: code, sb: f.sb && f.sb.name, wb: f.wb && f.wb.name };
      if (f.sb && (force || !h.sb_cover || h.sb_file !== f.sb.id)) { try { row.sb_cover = bookCoverUp_(f.sb.id, code + '-sb'); row.sb_file = f.sb.id; } catch (e) { res.sbErr = String(e.message || e); } }
      if (f.wb && (force || !h.wb_cover || h.wb_file !== f.wb.id)) { try { row.wb_cover = bookCoverUp_(f.wb.id, code + '-wb'); row.wb_file = f.wb.id; } catch (e) { res.wbErr = String(e.message || e); } }
      sbReq_('POST', 'coe_book_buy?on_conflict=code', [row], 'resolution=merge-duplicates,return=minimal');
      out.push(res);
    } catch (e) { out.push({ code: code, msg: String(e.message || e) }); }
  }
  return { ok: true, list: out };
}
