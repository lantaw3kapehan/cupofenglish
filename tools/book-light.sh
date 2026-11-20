#!/bin/bash
# 2548 · lighter copy of a book PDF to a fixed clarity standard, plus side-by-side pictures (laptop screen size and 2x zoom).
set -euo pipefail
SB=https://rlxkiahqjsabopmuhern.supabase.co; mkdir -p work out; : > out/sizes.txt
IFS=',' read -ra I <<< "$IDS"; IFS=',' read -ra P <<< "$PAGES"
for n in "${!I[@]}"; do id="${I[$n]}"; pg="${P[$n]}"
  curl -sf -o "work/$id.pdf" "$SB/storage/v1/object/public/book-media/$id"
  gs -q -dNOPAUSE -dBATCH -dSAFER -sDEVICE=pdfwrite -dCompatibilityLevel=1.5 \
     -dDownsampleColorImages=true -dColorImageDownsampleType=/Bicubic -dColorImageResolution=$DPI -dColorImageDownsampleThreshold=1.2 \
     -dDownsampleGrayImages=true -dGrayImageDownsampleType=/Bicubic -dGrayImageResolution=$DPI -dGrayImageDownsampleThreshold=1.2 \
     -dDownsampleMonoImages=true -dMonoImageResolution=300 \
     -dAutoFilterColorImages=false -sColorImageFilter=/DCTEncode -dAutoFilterGrayImages=false -sGrayImageFilter=/DCTEncode \
     -dJPEGQ=85 -dDetectDuplicateImages=true -dCompressFonts=true -dSubsetFonts=true \
     -sOutputFile="work/$id.light.pdf" "work/$id.pdf"
  a=$(stat -c%s "work/$id.pdf"); b=$(stat -c%s "work/$id.light.pdf")
  echo "$id  page $pg  original $((a/1048576)) MB  light $((b/1048576)) MB" >> out/sizes.txt
  # laptop screen: page fitted to 1920 px wide; zoom: the top-left quarter of the page at 2x
  for v in pdf light.pdf; do t=$([ "$v" = pdf ] && echo original || echo light)
    pdftoppm -f "$pg" -l "$pg" -png -scale-to-x 1920 -scale-to-y -1 "work/$id.$v" "work/s-$t"; mv work/s-$t*.png "work/$n-screen-$t.png"
    pdftoppm -f "$pg" -l "$pg" -png -scale-to-x 3840 -scale-to-y -1 "work/$id.$v" "work/z-$t"; f=$(ls work/z-$t*.png); convert "$f" -gravity center -crop 50%x50%+0+0 +repage "work/$n-zoom-$t.png"; rm "$f"; done
  convert "work/$n-screen-original.png" "work/$n-screen-light.png" -append -resize 1600x "out/$n-screen.png"
  convert "work/$n-zoom-original.png" "work/$n-zoom-light.png" +append -resize 2400x "out/$n-zoom.png"
  # the light copy goes next to ours (not used by the reader yet)
  curl -sf -X POST -H "Authorization: Bearer $SRK" -H "apikey: $SRK" -H "Content-Type: application/pdf" -H "x-upsert: true" \
    --data-binary "@work/$id.light.pdf" "$SB/storage/v1/object/book-media/light-2548/$id" >/dev/null && echo "$id uploaded" || echo "$id upload failed"
done
cat out/sizes.txt
