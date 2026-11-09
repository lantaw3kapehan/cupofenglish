// 2035 (9 Nov 21:23, Misty chose option 1): teachers no longer open class videos in Google Drive. A video uploaded in the app is
//   saved in the CupOfEnglish Drive, so a teacher tapping its link got "Request access" and management received a share-request email
//   (Dezza 21:09, Sunny's video). Teachers now see "Class video uploaded ✓" without a Drive link; any other class-video or screen-proof
//   link a teacher taps shows "Saved ✓ · class videos are kept by CupOfEnglish" instead of opening Drive. Management is unchanged.
const file = process.argv[2];
const GUARD = `<script id="x2035">
/* 2035 · teachers: class-video / screen-proof links never open Google Drive (no share-request emails) */
document.addEventListener('click', function(ev){ try{
  if(typeof D === 'undefined' || !D || D.mgr) return;
  const a = ev.target && ev.target.closest ? ev.target.closest('a[href*="drive.google.com/file/"]') : null; if(!a) return;
  const t = (a.textContent || '') + ' ' + (a.className || '') + ' ' + (a.title || '');
  if(!/video|screen ?proof|recording|v1880|vm-c|▶|📷|SCREENPROOF|\\.mp4|\\.mov|\\.webm/i.test(t)) return;   // books and materials still open
  ev.preventDefault(); ev.stopPropagation();
  toast('Saved ✓ · class videos are kept by CupOfEnglish · only management opens them');
}catch(e){} }, true);
</script>
`;
require('../tools/lib.js')(file, [
 [
  '<div class="grow ell">Class video uploaded${v.at?\' · \'+esc(v.at):\'\'}</div><a class="btn ghost sm" href="${esc(v.url)}" target="_blank">Open</a></div>',
  '<div class="grow ell">Class video uploaded ✓${v.at?\' · \'+esc(v.at):\'\'}</div>${D && D.mgr ? `<a class="btn ghost sm" href="${esc(v.url)}" target="_blank">Open</a>` : \'\'}</div>'
 ],
 [
  "<script id=\"l1651\">",
  GUARD + "<script id=\"l1651\">"
 ]
]);
