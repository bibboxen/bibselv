#!/usr/bin/env bash
cd "$(dirname "$0")/.." || exit

# Audit main modules
echo '-- Audit main modules --'
echo "==> ."
rm -rf node_modules
npm install --${1:-omit=dev}
npm audit
echo '-----------------------'

# Audit plugin dependencies.
echo
echo '-- Audit plugin dependencies --'
for folder in plugins/*; do
  if [ -d $folder ]; then
    echo
    echo '-----------------------'
    echo "==> ${folder}"
    echo '-----------------------'
    cd $folder
    rm -rf node_modules
    npm install --${1:-omit=dev}
    npm audit
    cd ../..
    echo '-----------------------'
  fi
done
