// script to automatically create zip file of mod data folder

import { osFileWriteSync, osENV } from './os.mjs';
import { generateZipFile } from './js/d2zip_generator.mjs'

const println = console.log


const COMMON_MOD_OPTIONS = [
  {
    "name": "add_start_items",
    "options": {}
  },
  {
    "name": "sidekick",
    "options": {
      "summonType": "barb", // rogue, guard, mage, barb
      "summonSkill": "grim ward", // sacrifice , find potion , grim ward
    }
  },
  {
    "name": "sidekick",
    "options": {
      "summonType": "rogue",
      "summonSkill": "find potion",
    }
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


const getmodOptions = (d2Version) => {
  if (d2Version === 'd2x') {
    return COMMON_MOD_OPTIONS.concat(
      [
        // {
        //   "name": "i10x6inventory",
        //   "options": {}
        // },
        {
          "name": "increase_weapon_stack_d2x",
          "options": {}
        },
        {
          "name": "i2hs_merc_d2x",
          "options": {}
        },
        {
          "name": "max_arrow_bolt_d2x",
          "options": {}
        },
        {
          "name": "i10x10stash_d2x",
          "options": {}
        },
        {
          "name": "font_fix_d2x",
          "options": {}
        }
      ]
    )
  }
  if (d2Version === 'd2r') {
    return COMMON_MOD_OPTIONS.concat(
      [
        {
          "name": "no_weather_d2r",
          "options": {}
        },
        {
          "name": "no_videos_d2r",
          "options": {}
        },
        {
          "name": "no_3dvfx_d2r",
          "options": {}
        }
      ]
    )
  };
}


function main() {
  const D2_VERSION = osENV('D2_VERSION'); // d2r or d2x
  const MOD_OPTIONS = getmodOptions(D2_VERSION)

  println(`Making mod for ${D2_VERSION}`);

  const { zipWriter, newFilename, newZipFile } = generateZipFile(D2_VERSION, MOD_OPTIONS)

  osFileWriteSync(newFilename, newZipFile)
  zipWriter.close()
}


main();
