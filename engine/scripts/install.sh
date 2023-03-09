#!/usr/bin/env bash
cd "$(dirname "$0")"

# Install main modules
echo
echo '-----------------------'
echo "==> ."
echo '-----------------------'
npm install --${1:-omit=dev}

# Install plugin dependencies.
for folder in plugins/*; do
  if [ -d $folder ]; then
    echo
    echo '-----------------------'
    echo "==> ${folder}"
    echo '-----------------------'
    cd $folder; npm install --${1:-production}; cd ../..;
  fi
done
