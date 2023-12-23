#!/bin/sh
# Creates a mod zip file and installs it locally for testing


export MOD_TARGET=$1

# set DESTINATION and PRG_7Z from .env file
. ./.env

if [ "$MOD_TARGET" = "" ]; then
    echo "Target paramater required. Must be d2x or d2r"
    exit 222
fi


DENO_OPTIONS="--allow-read=./ --allow-write=./ --allow-run --allow-env --import-map=vendor/import_map.json --no-remote"
deno run $DENO_OPTIONS src/build.ts
deno run $DENO_OPTIONS src/make.ts

# Diablo 2 LoD
if [ "$MOD_TARGET" = "d2x" ]; then
    rm -r $DESTINATION/data
    "$EXE_7Z" x -o$DESTINATION/ diymod_d2x.zip
fi

# Diablo 2 resurrected
if [ "$MOD_TARGET" = "d2r" ]; then
    rm -r $DESTINATION/mods
    "$EXE_7Z" x -o$DESTINATION/ diymod_d2r.zip
fi
