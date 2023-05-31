#!/usr/bin/env bash
cd "$(dirname "$0")/.." || exit

# Install main modules
echo '-- Install main modules --'
echo "==> ."
npm install --${1:-omit=dev} --force
echo '-----------------------'

# Install plugin dependencies.
echo
echo '-- Install plugin dependencies --'
for folder in plugins/*; do
  if [ -d $folder ]; then
    echo
    echo '-----------------------'
    echo "==> ${folder}"
    echo '-----------------------'
    cd $folder; npm install --${1:-omit=dev} --force; cd ../..;
    echo '-----------------------'
  fi
done
