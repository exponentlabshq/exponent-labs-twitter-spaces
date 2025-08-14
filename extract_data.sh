#!/bin/bash

# Data Extraction Script for Exponent Labs Twitter Spaces Analysis
# Usage: ./extract_data.sh "https://exponent-labs-twitter-spaces.netlify.app/exponent-labs-x-space-agi-haskell-remix-engine-dorahacks-hackathon-sbtc-wed-aug-13-2025.html"

if [ $# -eq 0 ]; then
    echo "Usage: $0 <URL>"
    echo "Example: $0 'https://exponent-labs-twitter-spaces.netlify.app/exponent-labs-x-space-agi-haskell-remix-engine-dorahacks-hackathon-sbtc-wed-aug-13-2025.html'"
    exit 1
fi

URL="$1"
echo "🔍 Extracting data from: $URL"
echo "=================================="

# Extract the JSON data from the script tag
echo "📊 EXTRACTED JSON DATA:"
echo ""

# Method 1: Extract raw JSON (recommended)
echo "## Raw JSON Data:"
curl -s "$URL" | pup '#curlable-json' | sed 's/<script[^>]*>//' | sed 's/<\/script>//' | head -50

echo ""
echo "=================================="

# Method 2: Extract specific sections
echo "## Data by Section:"
echo ""

echo "### Theoretical Frameworks:"
curl -s "$URL" | pup '#curlable-json' | sed 's/<script[^>]*>//' | sed 's/<\/script>//' | jq -r '.theoretical_frameworks | to_entries[] | "\(.key): \(.value.core_concept // .value.paradigm // .value.concept)"' 2>/dev/null || echo "jq not available - install with: brew install jq"

echo ""
echo "### Technical Achievements:"
curl -s "$URL" | pup '#curlable-json' | sed 's/<script[^>]*>//' | sed 's/<\/script>//' | jq -r '.technical_achievements | to_entries[] | "\(.key): \(.value.project // .value.agi_philosophy // .value.quote)"' 2>/dev/null || echo "jq not available - install with: brew install jq"

echo ""
echo "### Live Development:"
curl -s "$URL" | pup '#curlable-json' | sed 's/<script[^>]*>//' | sed 's/<\/script>//' | jq -r '.live_development | to_entries[] | "\(.key): \(.value.development_timeline)"' 2>/dev/null || echo "jq not available - install with: brew install jq"

echo ""
echo "=================================="

# Method 3: Extract specific data points
echo "## Specific Data Points:"
echo ""

echo "### AGI Development Quote:"
curl -s "$URL" | pup '#curlable-json' | sed 's/<script[^>]*>//' | sed 's/<\/script>//' | jq -r '.theoretical_frameworks.agi_development.quote' 2>/dev/null || echo "jq not available - install with: brew install jq"

echo ""
echo "### Haskell Remix Engine Status:"
curl -s "$URL" | pup '#curlable-json' | sed 's/<script[^>]*>//' | sed 's/<\/script>//' | jq -r '.technical_achievements.haskell_remix_engine.live_results' 2>/dev/null || echo "jq not available - install with: brew install jq"

echo ""
echo "=================================="

# Method 4: Save JSON to file
echo "## Saving JSON to file..."
JSON_FILE="exponent-labs-data.json"
curl -s "$URL" | pup '#curlable-json' | sed 's/<script[^>]*>//' | sed 's/<\/script>//' > "$JSON_FILE"
echo "✅ JSON data saved to: $JSON_FILE"

echo ""
echo "=================================="

# Method 5: Validate JSON structure
echo "## JSON Structure Validation:"
echo ""
if command -v jq &> /dev/null; then
    echo "### Top-level keys:"
    curl -s "$URL" | pup '#curlable-json' | sed 's/<script[^>]*>//' | sed 's/<\/script>//' | jq -r 'keys[]' 2>/dev/null
    
    echo ""
    echo "### Data counts:"
    curl -s "$URL" | pup '#curlable-json' | sed 's/<script[^>]*>//' | sed 's/<\/script>//' | jq -r 'to_entries[] | "\(.key): \(.value | if type == "object" then (keys | length) else length end) items"' 2>/dev/null
else
    echo "jq not available - install with: brew install jq for advanced JSON processing"
fi

echo ""
echo "=================================="
echo "✅ Data extraction complete!"
echo ""
echo "💡 TIPS:"
echo "- Use 'pup' for HTML parsing: brew install pup"
echo "- Use 'jq' for JSON processing: brew install jq"
echo "- Extract raw JSON: pup '#curlable-json' | sed 's/<script[^>]*>//' | sed 's/<\/script>//'"
echo "- Process with jq: ... | jq '.theoretical_frameworks'"
echo "- Save to file: ... > data.json"
echo ""
echo "🚀 QUICK EXTRACTION:"
echo "curl -s '$URL' | pup '#curlable-json' | sed 's/<script[^>]*>//' | sed 's/<\/script>//' | jq '.'"
