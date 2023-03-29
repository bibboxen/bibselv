#!/usr/bin/env bash
cd "$(dirname "$0")/.." || exit

# Remove main modules
echo '-- Remove main modules --'
echo "==> ."
rm -rf node_modules
echo '-----------------------'

# Remove plugin dependencies.
echo
echo '-- Remove plugin dependencies --'
for folder in plugins/*; do
  if [ -d $folder ]; then
    echo
    echo '-----------------------'
    echo "==> ${folder}"
    cd $folder
    rm -rf node_modules
    cd ../..
    echo '-----------------------'
  fi
done
