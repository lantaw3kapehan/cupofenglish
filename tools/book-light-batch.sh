#!/bin/bash
# 2548 · overnight: lighter copies of our big book PDFs (text stays text, pictures $DPI dpi, JPEG 85).
# A light copy is kept only if it is at least 20% smaller; otherwise the original stays. Nothing here changes what teachers open.
set -uo pipefail
SB=https://rlxkiahqjsabopmuhern.supabase.co; FN=$SB/functions/v1/coe-light; mkdir -p work; END=$(( $(date +%s) + ${BUDGET_MIN:-300} * 60 ))
tok(){ curl -sf -H "Authorization: Bearer $ACTIONS_ID_TOKEN_REQUEST_TOKEN" "$ACTIONS_ID_TOKEN_REQUEST_URL&audience=coe-light" | python3 -c 'import sys,json;print(json.load(sys.stdin)["value"])'; }
call(){ python3 - "$1" <<'P'
import json,sys,os,subprocess,urllib.request
b=json.loads(sys.argv[1]); b["oidc"]=os.environ["OIDC"]
r=urllib.request.Request(os.environ["FN"],data=json.dumps(b).encode(),headers={"Content-Type":"application/json"})
print(urllib.request.urlopen(r,timeout=60).read().decode())
P
}
export FN
OIDC=$(tok) && export OIDC
if [ -n "${IDS:-}" ]; then J=$(python3 -c 'import sys,json;print(json.dumps([x.strip() for x in sys.argv[1].split(",") if x.strip()]))' "$IDS"); list=$(call "{\"op\":\"todo\",\"ids\":$J}") || { echo "todo failed"; exit 1; }   # v4: chosen files
else list=$(call "{\"op\":\"todo\",\"limit\":${LIMIT:-40}}") || { echo "todo failed"; exit 1; }
fi
echo "$list" | python3 -c 'import sys,json; r=json.load(sys.stdin)["rows"]; print(len(r),"files to do"); [print(x["id"], x["size"]) for x in r]' > work/todo.txt
head -1 work/todo.txt; ok=0; kept=0; bad=0
tail -n +2 work/todo.txt | while read -r id size; do
  [ "$(date +%s)" -ge "$END" ] && { echo "time is up, the rest runs next night"; break; }
  rm -f work/a.pdf work/b.pdf
  curl -sf -o work/a.pdf "$SB/storage/v1/object/public/book-media/$id" || { echo "$id download failed"; continue; }
  timeout 900 gs -q -dNOPAUSE -dBATCH -dSAFER -sDEVICE=pdfwrite -dCompatibilityLevel=1.5 \
     -dDownsampleColorImages=true -dColorImageDownsampleType=/Bicubic -dColorImageResolution=$DPI -dColorImageDownsampleThreshold=1.2 \
     -dDownsampleGrayImages=true -dGrayImageDownsampleType=/Bicubic -dGrayImageResolution=$DPI -dGrayImageDownsampleThreshold=1.2 \
     -dDownsampleMonoImages=true -dMonoImageResolution=300 \
     -dAutoFilterColorImages=false -dColorImageFilter=/DCTEncode -dAutoFilterGrayImages=false -dGrayImageFilter=/DCTEncode \
     -dJPEGQ=85 -dDetectDuplicateImages=true -dCompressFonts=true -dSubsetFonts=true -sOutputFile=work/b.pdf work/a.pdf 2>/dev/null || { echo "$id could not be made lighter"; continue; }
  a=$(stat -c%s work/a.pdf); b=$(stat -c%s work/b.pdf); pa=$(pdfinfo work/a.pdf 2>/dev/null | awk '/^Pages/{print $2}'); pb=$(pdfinfo work/b.pdf 2>/dev/null | awk '/^Pages/{print $2}')
  OIDC=$(tok); export OIDC
  if [ -n "$pa" ] && [ "$pa" = "$pb" ] && [ "$b" -lt $(( a * 8 / 10 )) ]; then
    url=$(call "{\"op\":\"sign\",\"id\":\"$id\"}" | python3 -c 'import sys,json;print(json.load(sys.stdin)["url"])') || { echo "$id sign failed"; continue; }
    if curl -sf -X PUT -H "Content-Type: application/pdf" -H "x-upsert: true" --data-binary @work/b.pdf "$url" >/dev/null; then
      call "{\"op\":\"done\",\"id\":\"$id\",\"orig\":$a,\"size\":$b,\"dpi\":$DPI,\"use\":true}" >/dev/null; echo "$id  $((a/1048576)) MB → $((b/1048576)) MB  ($pa pages)"
    else echo "$id upload failed"; fi
  else call "{\"op\":\"done\",\"id\":\"$id\",\"orig\":$a,\"size\":$b,\"dpi\":$DPI,\"use\":false}" >/dev/null; echo "$id  kept the original ($((a/1048576)) MB → $((b/1048576)) MB, pages $pa/$pb)"; fi
done
