#!/bin/bash
# Lighthouse 手動計測スクリプト
# 使い方: ./scripts/lighthouse.sh [URL]
# デフォルト: https://ryo722.github.io/portfolio/

set -euo pipefail

URL="${1:-https://ryo722.github.io/portfolio/}"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
OUTPUT_DIR="ops/reports/lighthouse"
OUTPUT_FILE="${OUTPUT_DIR}/lighthouse-${TIMESTAMP}.json"

mkdir -p "$OUTPUT_DIR"

echo "Running Lighthouse on: $URL"
echo "Output: $OUTPUT_FILE"

npx lighthouse "$URL" \
  --output=json \
  --output-path="$OUTPUT_FILE" \
  --chrome-flags="--headless --no-sandbox" \
  --quiet

# スコアサマリー表示
node -e "
const r = JSON.parse(require('fs').readFileSync('$OUTPUT_FILE','utf8'));
const c = r.categories;
console.log('');
console.log('=== Lighthouse Scores ===');
console.log('Performance:    ', Math.round(c.performance.score*100));
console.log('Accessibility:  ', Math.round(c.accessibility.score*100));
console.log('Best Practices: ', Math.round(c['best-practices'].score*100));
console.log('SEO:            ', Math.round(c.seo.score*100));
console.log('');
console.log('Full report: $OUTPUT_FILE');
"
