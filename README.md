# Stay a while and listen!

This repository contains a collection of mods for the classic video game Diablo 2: Lord of Destruction.  The repository only contains soft mods which are simply text and image files that alter the game without any code changes.  Soft mods are highly compatible with different patches to the game.  These mods have been extensively tested with version 1.14c :wink:

Unlike other soft mods that I have seen, this one allows you to choose which features you want to use through a single page application

Also note, that once you apply these mods it is highly likely you will not be able to play in the offical game servers as they do not allow enhancements.  However, you should be able to run your own private game server with these enhancements.

## Requirements

* Diablo 2 LoD versions 1.10 to 1.14d (May also work with earlier patches)
It is also advisable to remove any other enhancements or plugins as it may interfere with these mods.

* Web browser: Internet Explorer 10+, edge, Chrome or Firefox. (Untested on Safari or other browsers)

## Building
If you wish to build the single page application from the source you will need nodejs (v8.0+).
Simply run `node build.js`  This will create the single page application under `docs/index.html`

## Usage
If you simply want to use the d2mod generator, [Click here](https://sajonoso.github.io/d2mods)

## adding new mod

Create folder under `mods` folder and add in the required patch.json and optionally patch.js file.
add related .txt files under `mods/source_txt`
add option in index.htm file.
If mod has options in the index.htm get those options in the file `src\js\modder.js` in the function `getModOptions`
