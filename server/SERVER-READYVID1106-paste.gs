
/* ═════ 6 Nov · READYVID1106 · "Ready to release": a class with an uploaded video or an accepted screen proof counts as done
   (Misty 14:33: late cancellation by the student, the teacher uploaded the proof → accepted). Paste AFTER "END SHEETBACKUP1106d".
   The release check (payReadyBuild_) only looks for a video link in the month's -DAILY tab. Its answer now goes through
   rpc/coe_ready_filter, which drops every class that has an upload in coe_class_videos (video, or screen proof not rejected).
   Undo: delete this block, Save. ═════ */
(function () {
  const G = globalThis;
  const filt = function (r) {
    try { if (!r || typeof r !== 'object' || !r.t || !sbCfg_()) return r;
      const f = sbReq_('post', 'rpc/coe_ready_filter', { p_data: r });
      return f && typeof f === 'object' && f.t ? f : r; } catch (e) { console.warn('readyvid1106', e); return r; } };
  ['payReady_', 'payReadyFast_'].forEach(function (fn) {
    const base = G[fn]; if (typeof base !== 'function' || base.__rv1106) return;
    const w = function () { return filt(base.apply(this, arguments)); }; w.__rv1106 = 1; G[fn] = w;
  });
})();
/* ═════ END READYVID1106 ═════ */
