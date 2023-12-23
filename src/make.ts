// script to automatically create zip file of mod data folder

import { osENV, osFileWriteSync, osB64toArray } from './os.ts';
import './libs/jszip.min.js'
import modder from './js/modder.js'
import './mods.zip.js'
const prnt = console.log


const MOD_TARGET = osENV('MOD_TARGET'); // d2r or d2x

const FILENAME_D2X = 'diymod_d2x.zip';
const FILENAME_D2R = 'diymod_d2r.zip';

prnt(`Making mod for ${MOD_TARGET}`);

const MOD_FILENAME = MOD_TARGET === 'd2r' ? FILENAME_D2R : FILENAME_D2X;

const MOD_OPTIONS = [
  {
    "name": "add_start_items",
    "options": {}
  },
  {
    "name": "bear_wolves",
    "options": {}
  },
  {
    "name": "multigolem",
    "options": {}
  },
  {
    "name": "iron_hero",
    "options": {}
  },
  {
    "name": "mob_density",
    "options": {
      "multiplier": "1",
    }
  },
  {
    "name": "multivalkyrie",
    "options": {
      "maxValk": "1"
    }
  },
  {
    "name": "side_kick",
    "options": {
      "id": "1",
      "summonSkill": "sacrifice", // grimward, sacrifice, findpotion
      "summonType": "rogue" // rogue, guard, mage, barb
    }
  },
  {
    "name": "side_kick",
    "options": {
      "id": "2",
      "summonSkill": "grimward",
      "summonType": "barb"
    }
  },
  {
    "name": "side_kick",
    "options": {
      "id": "3",
      "summonSkill": "findpotion",
      "summonType": "guard"
    }
  },
  {
    "name": "cube_recipes",
    "options": {}
  },
  {
    "name": "cube_ig",
    "options": {}
  },
  {
    "name": "item_randomizer",
    "options": {}
  },
  // {
  //   "name": "merc_gear",
  //   "options": {}
  // },
  {
    "name": "merc_gear_full",
    "options": {}
  },
  // {
  //   "name": "melee_ironwolf",
  //   "options": {}
  // },
  {
    "name": "i7x4cube",
    "options": {}
  },
]

if (MOD_TARGET === 'd2x') {
  Array.prototype.push.apply(
    MOD_OPTIONS,
    [
      // {
      //   "name": "i10x6inventory",
      //   "options": {}
      // },
      // {
      //   "name": "i10x8cube",
      //   "options": {}
      // },
      {
        "name": "i10x10stash",
        "options": {}
      },
      {
        "name": "font_fix",
        "options": {}
      }
    ]
  )
}

if (MOD_TARGET === 'd2r') {
  Array.prototype.push.apply(
    MOD_OPTIONS,
    [{
      "name": "no_weather",
      "options": {}
    },
    {
      "name": "no_videos",
      "options": {}
    },
    {
      "name": "no_3dvfx",
      "options": {}
    }]
  )
};



// Global variables
var DATA_UNZIPPED = {} // unzipped source content for patches and source files



const filedownload_click = function () {
  const sourceFiles = DATA_UNZIPPED
  const modSettings = {
    target: MOD_TARGET,
    enabledMods: MOD_OPTIONS,
  }

  var targetZip = new JSZip();

  // add file listing options selected
  const prefix = MOD_TARGET === 'd2r' ? 'mods/diymod' : 'data'
  targetZip.file(prefix + '/modoptions.txt', JSON.stringify(modSettings, null, 2))
  if (MOD_TARGET === 'd2r') targetZip.file('mods/diymod/diymod.mpq/modinfo.json', '{"name": "diymod","savepath": "diymod/"}')

  modder.ApplyMods(modSettings, sourceFiles, targetZip)

  prnt('Generating zip file');
  targetZip.generateAsync({ type: "base64", compression: "DEFLATE", compressionOptions: { level: 5 } })
    .then(function (base64content) {
      prnt('Saving zp file');
      osFileWriteSync(MOD_FILENAME, osB64toArray(base64content));
    }, function (err) {
      prnt(err);
    });
}


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

    prnt('Ready!');

    filedownload_click();
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