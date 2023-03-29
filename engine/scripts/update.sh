#!/usr/bin/env bash
cd "$(dirname "$0")/.." || exit

# Install main modules
rm -rf node_modules
npm install --${1:-omit=dev}

# Update main modules
echo '-- Update main modules --'
echo "==> ."
rm -rf node_modules
npm install --${1:-omit=dev}
echo '-----------------------'

# Update plugin dependencies.
echo
echo '-- Update plugin dependencies --'
for folder in plugins/*; do
  if [ -d $folder ]; then
    echo
    echo '-----------------------'
    echo "==> ${folder}"
    echo '-----------------------'
    cd $folder
    rm -rf node_modules
    npm install --${1:-omit=dev}
    cd ../..
    echo '-----------------------'
  fi
done
