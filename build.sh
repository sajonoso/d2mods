#!/bin/sh
# Builds web application for publication

DENO_OPTIONS="--allow-read=./ --allow-write=./ --allow-run --allow-env --import-map=vendor/import_map.json --no-remote"
deno run $DENO_OPTIONS src/build.ts

esbuild src/js/main.js --bundle --platform=browser --outfile=docs/bundled.js --minify-whitespace --minify-syntax
esbuild src/css/styles.css --bundle --outfile=docs/bundled.css --minify-whitespace --minify-syntax
cp src/index.html docs/index.html
cp -r src/images docs/