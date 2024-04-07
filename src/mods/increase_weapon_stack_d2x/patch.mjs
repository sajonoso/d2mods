import modder from '../../js/modder.mjs'

const println = console.log

const weapType = ['taxe', 'tkni', 'jave', 'ajav']

var mod_increase_weapon_stack_d2x = {
  update_weapons_txt: function (mod, targetFiles) {
    // get file headers and offsets
    var fileLines = targetFiles['weapons.txt']
    const col = modder.get_column_index(targetFiles, 'weapons.txt')
    const MINSTACK_COL = col('minstack')
    const MAXSTACK_COL = col('maxstack')
    const SPAWNSTACK_COL = col('spawnstack')
    const TYPE_COL = col('type')
    const STACKABLE_COL = col('stackable')

    // Loop through each row and update items with maxstack by 50%
    for (let i = 1; i < fileLines.length; i++) {
      const lineData = fileLines[i].split('\t')

      const weaponType = lineData[TYPE_COL]
      const isStackable = lineData[STACKABLE_COL]

      if (isStackable === '1' && weaponType !== 'tpot') { // && weapType.indexOf(weaponType) >= 0)
        // increase everything by 50%
        const minStack = Math.floor(lineData[MINSTACK_COL] * 1.5)
        const maxStack = Math.floor(lineData[MAXSTACK_COL] * 1.5)
        const spawnStack = Math.floor(lineData[SPAWNSTACK_COL] * 1.5)
        // DEBUG
        // println(`${weaponType}: ${maxStack}`)

        // Change on specific weapon type
        // if (weaponType === 'taxe') { lineData[MINSTACK_COL] = minStack; lineData[MAXSTACK_COL] = maxStack; lineData[SPAWNSTACK_COL] = spawnStack; }
        // if (weaponType === 'tkni') { lineData[MINSTACK_COL] = minStack; lineData[MAXSTACK_COL] = maxStack; lineData[SPAWNSTACK_COL] = spawnStack; }
        // if (weaponType === 'jave') { lineData[MINSTACK_COL] = minStack; lineData[MAXSTACK_COL] = maxStack; lineData[SPAWNSTACK_COL] = spawnStack; }
        // if (weaponType === 'ajav') { lineData[MINSTACK_COL] = minStack; lineData[MAXSTACK_COL] = maxStack; lineData[SPAWNSTACK_COL] = spawnStack; }

        lineData[MINSTACK_COL] = minStack;
        lineData[MAXSTACK_COL] = maxStack;
        lineData[SPAWNSTACK_COL] = spawnStack;

        fileLines[i] = lineData.join('\t')
      }
    }
  },
}

export default function applyPatch(mod, targetFiles) {
  mod_increase_weapon_stack_d2x.update_weapons_txt(mod, targetFiles)
}
