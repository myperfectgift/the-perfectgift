#!/bin/bash
# ==========================================
# Quick Setup Script for New Balance Checker
# ==========================================
# Usage: bash setup.sh
#
# This will ask you for your project details and
# replace all placeholders automatically.

echo ""
echo "=========================================="
echo "  Balance Checker - Quick Setup"
echo "=========================================="
echo ""

# Get project details
read -p "Site Name (---------'): " SITE_NAME
read -p "Domain (----------): " SITE_DOMAIN
read -p "Logo Initials - 2 chars (e.g. --): " SITE_INITIALS
read -p "Vercel subdomain (-------): " VERCEL_SUB
read -p "Project slug for package.json (---------): " PROJECT_SLUG
echo ""
read -p "Google verification code (or press Enter to skip): " GOOGLE_CODE
read -p "Bing verification code (or press Enter to skip): " BING_CODE
read -p "API Token (or press Enter to skip): " API_TOKEN_VAL

echo ""
echo "Applying changes..."

# Replace placeholders in all files
find . -type f \( -name "*.html" -o -name "*.json" -o -name "*.xml" -o -name "*.txt" -o -name "*.svg" -o -name "*.js" \) \
  ! -path "./node_modules/*" ! -path "./.git/*" | while read file; do
  sed -i "s|__SITE_NAME__|${SITE_NAME}|g" "$file"
  sed -i "s|__SITE_DOMAIN__|${SITE_DOMAIN}|g" "$file"
  sed -i "s|__SITE_INITIALS__|${SITE_INITIALS}|g" "$file"
  sed -i "s|__VERCEL_SUBDOMAIN__|${VERCEL_SUB}|g" "$file"
  sed -i "s|__PROJECT_SLUG__|${PROJECT_SLUG}|g" "$file"
done

# Set verification codes if provided
if [ -n "$GOOGLE_CODE" ]; then
  find . -type f -name "*.html" ! -path "./node_modules/*" | while read file; do
    sed -i "s|YOUR_GOOGLE_CODE|${GOOGLE_CODE}|g" "$file"
  done
fi

if [ -n "$BING_CODE" ]; then
  find . -type f \( -name "*.html" -o -name "*.xml" \) ! -path "./node_modules/*" | while read file; do
    sed -i "s|YOUR_BING_CODE|${BING_CODE}|g" "$file"
  done
fi

# Update favicon with initials
FIRST="${SITE_INITIALS:0:1}"
SECOND="${SITE_INITIALS:1:1}"
cat > public/favicon.svg << FAVICON
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="20" fill="#0f172a"/>
  <text x="50%" y="50%" text-anchor="middle" dominant-baseline="central" font-family="Inter, system-ui, sans-serif" font-weight="800" font-size="44">
    <tspan fill="#ffffff">${FIRST}</tspan><tspan fill="#2563eb">${SECOND}</tspan>
  </text>
</svg>
FAVICON

# Create .env if API token provided
if [ -n "$API_TOKEN_VAL" ]; then
  cat > .env << ENV
API_TOKEN=${API_TOKEN_VAL}
TELEGRAM_ID_BEFORE_CHECK=
TELEGRAM_ID_AFTER_CHECK=
ENV
  echo "Created .env file"
fi

echo ""
echo "=========================================="
echo "  Setup Complete!"
echo "=========================================="
echo ""
echo "  Site: ${SITE_NAME}"
echo "  Domain: ${SITE_DOMAIN}"
echo "  Vercel: ${VERCEL_SUB}.vercel.app"
echo ""
echo "  Next steps:"
echo "  1. npm install"
echo "  2. npm run dev        (local development)"
echo "  3. git init && git add -A && git commit -m 'Initial commit'"
echo "  4. Push to GitHub"
echo "  5. Connect to Vercel"
echo "  6. Add env vars in Vercel: API_TOKEN, TELEGRAM_ID_*"
echo ""
