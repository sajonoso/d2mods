#!/bin/sh
# set variables from .env file
. ./.env

DENO_OPTIONS="--allow-read=./,$(which deno) --allow-write=./ --allow-run --allow-env --no-remote"
JSEXEC_CMD="deno run $DENO_OPTIONS"
# JSEXEC_CMD="./node_modules/.bin/ts-node -T"
# JSEXEC_CMD=node


# Creates the zip bundle that contains all the mod data and files
create_data_zip() {
  cd src
  rm -rf ./mods.zip
  "$EXE_7Z" a -mx=2 -xr!*.js ./mods.zip mods/ # 

  echo -n 'const DATA_ZIP="' > ./mods.zip.mjs
  base64 --wrap=0 ./mods.zip >> ./mods.zip.mjs
  echo -n "\";\nexport { DATA_ZIP }\n" >> ./mods.zip.mjs
  cd ..
}


# Creates the website generator
app_build() {
  create_data_zip

  esbuild src/js/main.mjs --bundle --platform=browser --outfile=docs/bundled.js --minify # --minify-whitespace --minify-syntax
  esbuild src/css/styles.css --bundle --outfile=docs/bundled.css --minify # --minify-whitespace --minify-syntax
  cp src/index.html docs/index.html
  cp -r src/images docs/
}

# builds a zip package for testing
app_make() {
  export D2_VERSION=$1
  create_data_zip

  echo ">>> Making diymod.zip"
  $JSEXEC_CMD src/make.mjs
  if [ ! "$?" = "0" ]; then exit 1 ; fi

  
  if [ "$D2_VERSION" = "d2x" ]; then # Diablo 2 LoD
      rm -r $DESTINATION/data
      "$EXE_7Z" x -o$DESTINATION/ diymod_d2x.zip
  fi
  if [ "$D2_VERSION" = "d2r" ]; then # Diablo 2 resurrected
      rm -r $DESTINATION/mods
      "$EXE_7Z" x -o$DESTINATION/ diymod_d2r.zip
  fi

  echo $(date)
}

app_clean() {
  rm ./diymod_d2x.zip
  rm ./diymod_d2r.zip
  rm src/mods.zip
  rm src/mods.zip.mjs
  rm -r docs/
  mkdir docs
}

app_test() {
  export D2_VERSION="d2r"
  create_data_zip

  $JSEXEC_CMD src/make.mjs
}

if [ "$1" = "d2x" ]; then app_make $1 ; exit $? ; fi
if [ "$1" = "d2r" ]; then app_make $1 ; exit $? ; fi

if [ "$1" = "test" ]; then app_test ; exit $? ; fi

if [ "$1" = "build" ]; then app_build ; exit $? ; fi
if [ "$1" = "clean" ]; then app_clean ; exit $? ; fi
if [ "$1" = "edit" ]; then
  $MSCODE . &
  exit $?
fi

echo "Unknown command.  options are: build, clean, d2x, d2r"