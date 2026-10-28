# Server paste · Class videos, one record per class per day (VIDDAYS28)

**What it does:** every class-video save that Google already makes to the database (upload, a teacher's explanation, management's review) is also saved to that class day's own record. Since 22 Oct, some weekly classes that keep one calendar id every day had the earlier day's record replaced by the next day's upload. This stops that for good. Nothing else changes: the files, month-DAILY, cases and checks all work as today.

**Why it is needed:** the per-day table and the 10 restored records are already live, and the app already reads them. Without this paste, a video uploaded from now on is only kept until the same class's next upload.

**When:** any time before 16:00 or after 22:00. It takes about 2 minutes.

## Step 1 · paste at the very bottom of Code.gs
Open Apps Script → project **CupOfEnglish Teacher App** → `Code.gs`. Scroll to the very end and paste this after the last line:

```
/* ═════ 28 Oct · VIDDAYS28 · class videos: one record per class per day (coe_class_video_days) ═════
   Some weekly classes keep one calendar id every day, so coe_class_videos (keyed by that id) kept only the newest day.
   Every video save to coe_class_videos is now also saved to that class day's own record. Nothing else changes. */
var sbReqBaseVD28_ = sbReq_;
sbReq_ = function (method, path, body, prefer) {
  const r = sbReqBaseVD28_.apply(this, arguments);
  try {
    const p = String(path || '');
    if (/^POST$/i.test(method) && p.indexOf('coe_class_videos?on_conflict=event_id') === 0 && Array.isArray(body)) {
      sbReqBaseVD28_('POST', 'coe_class_video_days?on_conflict=event_id,day', body, 'resolution=merge-duplicates,return=minimal');
    } else if (/^PATCH$/i.test(method) && p.indexOf('coe_class_videos?event_id=eq.') === 0) {
      const id = decodeURIComponent(p.slice('coe_class_videos?event_id=eq.'.length).split('&')[0]);
      let ds = ''; try { ds = JSON.parse(PropertiesService.getScriptProperties().getProperty('vf:' + id) || '{}').ds || ''; } catch (e) {}
      if (!ds) { const row = (sbReqBaseVD28_('GET', 'coe_class_videos?select=day&event_id=eq.' + encodeURIComponent(id)) || [])[0]; ds = (row && row.day) || ''; }
      if (ds) sbReqBaseVD28_('PATCH', 'coe_class_video_days?event_id=eq.' + encodeURIComponent(id) + '&day=eq.' + ds, body, 'return=minimal');
    }
  } catch (e) { console.warn('VIDDAYS28', e); }   // never blocks the original save
  return r;
};
```

## Step 2 · save and publish
1. Press **Ctrl+S** (Mac: **Cmd+S**). Check that "Unsaved changes" disappears.
2. **Deploy › Manage deployments ›** pencil icon › Version: **New version** › **Deploy**. This step is needed because video uploads are an app action.

## Step 3 · check (optional)
After the next class video is uploaded in the app, tell Claude. It checks that the upload appears in both `coe_class_videos` and `coe_class_video_days`.

## Undo
Delete the pasted block, save, and deploy a new version. The per-day records already saved stay where they are.
