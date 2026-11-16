<script id="b2277">
/* 16 Nov · 2277 · Book pages open in the CupOfEnglish reader (Misty 18:49–18:54): a separate CupOfEnglish tab (reader/), never
   Google Drive, so the teacher keeps Today open in the app and shares only the book tab in class. The reader has zoom, drawing
   tools, Present (full screen: only the CupOfEnglish header, the page and the drawings), and the unit's lessons and videos.
   Every book page link in the app (book sheet, student's Course book card, class card) opens in the same reader tab. */
(function(){
  function bookOf(id){ try{ for(let i = 0; i < localStorage.length; i++){ const k = localStorage.key(i); if(!/^coe\.bk3\./.test(k)) continue;
      const c = JSON.parse(localStorage.getItem(k) || 'null'), F = (c && c.b && c.b.files) || [], f = F.find(x => x.id === id); if(f) return { code: (c.b.code || k.split('.').pop()), f }; } }catch(e){} return null; }
  window.bkReader = function(id, title){ const hit = bookOf(id); if(hit && hit.f.kind !== 'pdf') return false;
    const q = new URLSearchParams({ id, t: String(title || (hit && hit.f.name) || '').slice(0, 120), n: '1' }); if(hit && hit.code) q.set('b', hit.code);
    const w = window.open('reader/?' + q.toString(), 'coeReader'); if(!w){ toast('Allow pop-ups for this site to open books'); return false; } try{ w.focus(); }catch(e){} return true; };
  document.addEventListener('click', ev => { try{ if(ev.defaultPrevented || !D) return;
    const a = ev.target && ev.target.closest && ev.target.closest('a[href*="drive.google.com/file/d/"]'); if(!a) return;
    const t = (a.textContent || '').trim(); if(/^[▶♪]/.test(t)) return;
    const id = decodeURIComponent((/\/d\/([^/]+)/.exec(a.getAttribute('href')) || [])[1] || ''); if(!id) return;
    const inBooks = a.closest('#bkBody, #stuBk, #v-books') || a.classList.contains('bkb'), hit = bookOf(id);
    if(!inBooks && !(hit && hit.f.kind === 'pdf')) return;
    if(window.bkReader(id, t)) ev.preventDefault(); }catch(e){} });
})();
</script>
