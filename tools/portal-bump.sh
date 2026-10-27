#!/bin/sh
# 1354 · bump a portal's version so open phones reload: tools/portal-bump.sh student 1355   (or partner)
# Updates <dir>/version.txt, <meta name="portal-version">, and every ?v= on the page's own files / portal-update.js.
set -e; D="$1"; V="$2"; [ -n "$D" ] && [ -n "$V" ] || { echo "usage: tools/portal-bump.sh <student|partner> <version>"; exit 1; }
printf '%s\n' "$V" > "$D/version.txt"
sed -i -E "s/(<meta name=\"portal-version\" content=\")[^\"]*/\1$V/; s/(\.(woff2|js|css|png|webmanifest)\?v=)[A-Za-z0-9._-]+/\1$V/g" "$D/index.html"
grep -o 'portal-version" content="[^"]*' "$D/index.html"; cat "$D/version.txt"
