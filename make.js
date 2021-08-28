// script to automatically create zip file of mod data folder

const MOD_FILENAME = 'd2_diy_mod.zip'

const MOD_OPTIONS = [
  {
    "name": "bear_wolves",
    "options": {}
  },
  {
    "name": "multigolem",
    "options": {}
  },
  {
    "name": "multivalkyrie",
    "options": {
      "maxValk": "2"
    }
  },
  {
    "name": "melee_ironwolf",
    "options": {}
  },
  {
    "name": "side_kick1",
    "options": {
      "summonSkill": "findpotion",
      "summonType": "rogue"
    }
  },
  {
    "name": "side_kick2",
    "options": {
      "summonSkill": "grimward",
      "summonType": "guard"
    }
  },
  {
    "name": "cube_recipes",
    "options": {}
  },
  {
    "name": "item_randomizer",
    "options": {}
  },
  {
    "name": "full_merc",
    "options": {}
  },
  {
    "name": "10x6inventory",
    "options": {}
  },
  {
    "name": "10x8cube",
    "options": {}
  },
  {
    "name": "10x10stash",
    "options": {}
  },
  {
    "name": "add_start_items",
    "options": {}
  },
  {
    "name": "font_fix",
    "options": {}
  }
]

const fs = require('fs')

const print = console.log;
const JSZip = require("./src/libs/jszip.min");
function include(filename) { eval(fs.readFileSync(filename, 'utf8')); }

include("./src/mods.zip.js");
include("./src/js/modder.js");


// Global variables
DATA_UNZIPPED = {} // unzipped source content for patches and source files


// Unzip all files in data zip file
function GetAllZipfiles(zip, ZipfileList) {
  var Promise = JSZip.external.Promise;

  const unzipList = ZipfileList.map(function (item) {
    const extension3 = item.substr(-3).toLowerCase()
    const extension4 = item.substr(-4).toLowerCase()
    const extension5 = item.substr(-5).toLowerCase()
    const contentType = (extension3 === '.js' || extension4 === ".txt" || extension5 === ".json") ?
      'string' : 'uint8array'
    return zip.file(item).async(contentType).then(function (data) {
      return { file: item, content: data }
    })
  })

  Promise.all(unzipList).then(function (unzippedFiles) {
    DATA_UNZIPPED = {}
    unzippedFiles.forEach(function (item) {
      DATA_UNZIPPED[item.file.toLowerCase()] = item.content;
    })

    print('Ready!');

    make_zip()
  });
}


function make_zip() {
  const sourceFiles = DATA_UNZIPPED
  const EnabledMods = MOD_OPTIONS

  var targetZip = new JSZip();

  // add file listing options selected
  targetZip.file('data/modoptions.txt', JSON.stringify(EnabledMods, null, 2))

  modder.ApplyMods(EnabledMods, sourceFiles, targetZip)

  targetZip.generateAsync({ type: "base64", compression: "DEFLATE", compressionOptions: { level: 5 } })
    .then(function (base64content) {
      fs.writeFileSync(MOD_FILENAME, Buffer.from(base64content, 'base64'));
    }, function (err) {
      print(err);
    });
}

function main() {
  // Get all files in Zip file
  JSZip.loadAsync(DATA_ZIP, { base64: true, checkCRC32: true })
    .then(function (zip) {
      const fileList = Object.keys(zip.files).filter(function (fileName) {
        return (fileName.substr(-1) !== '/') // directorys return false
      })
      GetAllZipfiles(zip, fileList)
    })
}

main();
