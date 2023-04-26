#!/usr/bin/env bash
cd "$(dirname "$0")/.." || exit

# Upgrade main modules
echo '-- Upgrade main modules --'
echo "==> ."
rm -rf node_modules
npm install --${1:-omit=dev}
npm audit fix
echo '-----------------------'

# Upgrade plugin dependencies.
echo
echo '-- Upgrade plugin dependencies --'
for folder in plugins/*; do
  if [ -d $folder ]; then
    echo
    echo '-----------------------'
    echo "==> ${folder}"
    echo '-----------------------'
    cd $folder
    rm -rf node_modules
    npm install --${1:-omit=dev}
    npm audit fix
    cd ../..
    echo '-----------------------'
  fi
done
