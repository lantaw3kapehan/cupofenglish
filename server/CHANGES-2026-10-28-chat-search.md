# Team Chat search · no overlapping results, no Members panel while searching (1498) · 28 Oct 2026

Misty 20:47: search rows overlapped at 1280×720 (Members open or closed); the "In this chat" Members panel is misleading during a global search and narrows the results; heading and toolbar must not cut labels. Retest on management and teacher at several sizes and zoom levels, and check that opening a result and going back keeps everything.

## Cause of the overlap
The result rows reused the sidebar's channel-row style inside a flex column, so on smaller heights the rows **shrank below their content**. Label, name, time and preview then spilled over the next row.

## What changed (display only)
- **Result rows have their own layout:**
  - Line 1: "In All Teachers" / "In Teacher Ara · private" label (wraps), with **Open** on the right.
  - Line 2: sender name and time (wraps).
  - Line 3: the preview, clamped to **3 lines with an ellipsis**.
  - Heights follow the content; rows never shrink and nothing is positioned absolutely.
- **Members panel hidden during search** (with its button). Leaving search brings it back exactly as it was, open or closed (the saved setting is not touched).
- **Search header:** the title ("Search all my chats") and the scope line wrap instead of being cut; the toolbar wraps onto a second line when needed. The toolbar buttons were already icons with screen-reader labels.
- **Short windows** (under 620 px high in CSS pixels, e.g. 1024×600 at 125–150% zoom): filters and results scroll as one page instead of a tiny inner list.
- **Open a result:** the chat opens at that message, highlighted, in context.
  - Before, the jump was lost on the first, still-loading render, so the message was not scrolled into view.
  - A **Back to search results** button returns with the query, filters, results and scroll position kept.
  - Reopening Search also keeps the last search; Clear filters resets it.
- **Unchanged:**
  - The management controls (Requires reply · Requires acknowledgement · Pin message · Templates · Create formal notice).
  - Permissions, privacy (teachers search only their groups and their own chat with management) and records.
  - The server (no deploy).

## Checks
- **Matrix (preview, sample data, 24 results with long previews, groups and private chats):**
  - Views: management and teacher.
  - Windows: 1024×600, 1280×720, 1366×768, 1440×900, each at browser zoom 100 / 110 / 125 / 150%, plus phone 390.
  - Members: open and closed on desktop sizes.
  - Checked in every combination:
    - No two parts of a row overlap and no part sits outside its row.
    - No two rows overlap.
    - Previews are clamped.
    - The title, subtitle and visible labels aren't cut.
    - No sideways page scroll, and Members is hidden while searching.
  - Result: **0 failures**.
- **Navigation (1280×720, and 1024×600 at 125% in single-scroll mode):** opening the 6th result puts that message in view; Back to search results returns with query "homework", the same 24 results and the same scroll position (400 px). The Members state is restored after leaving search.
- **regress-saves:** 17/17 passed.
- **Stability check:** run while the machine was heavily loaded (load average 10–12), so many unrelated screens moved; compared against the unpatched app on the same screens, the base moved as much or more (2 vs 1). 1498 only changes the Team Chat view (all its styles are scoped to it).

## Rollback
Branch `rollback-pre-1498`.
