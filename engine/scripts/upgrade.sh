#!/usr/bin/env bash
cd "$(dirname "$0")"

# Install main modules
rm -rf node_modules
npm install --${1:-production}
npm audit fix

# Install plugin dependencies.
for folder in plugins/*; do
  if [ -d $folder ]; then
    echo
    echo '-----------------------'
    echo "==> ${folder}"
    echo '-----------------------'
    cd $folder
    echo ${folder}
    rm -rf node_modules
    npm install --${1:-production}
    npm audit fix
    cd ../..
  fi
done
