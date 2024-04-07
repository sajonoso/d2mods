import modder from '../../js/modder.mjs'

const println = console.log

const summonProps = {
  life: "stat('maxhp'.accr)",
  attack: "stat('tohit'.accr)",
  regen: '100', // 100 = 20% per second
  // Maximum ToHitFactor = 20.   TODO: need to find way to get ToHitFactor from charstats.txt in formula
  defense: "(stat('dexterity'.accr)*5)-35+20 +stat('armorclass'.accr)",
  damage: "stat('maxdamage'.accr)+stat('secondary_maxdamage'.accr)",
}

const commonProps = {
  'passivestat1': 'maxhp',
  'passivecalc1': summonProps.life,
  'passivestat2': 'armorclass',
  'passivecalc2': summonProps.defense,
  'passivestat3': 'hpregen',
  'passivecalc3': summonProps.regen, // 100 = 20% per second
  'passivestat4': '',
  'passivecalc4': '',

  'aurastat1': 'tohit',
  'aurastatcalc1': summonProps.attack,
  'aurastat2': 'item_normaldamage',
  'aurastatcalc2': summonProps.damage,
  'aurastat3': '',
  'aurastatcalc3': "",
  'aurastat4': '',
  'aurastatcalc4': "",

  'reqlevel': '1',
  'maxlevel': '',
  'manashift': '1',
}

// Rogue does not fire elemental arrows and no explosions on hit
const rogueProps = {
  'summon': 'roguehire',
  'sumskill1': 'Natural Resistance', // from skills.txt skill column
  'sumsk1calc': 'ulvl/4',
  'sumskill2': 'Inner Sight',
  'sumsk2calc': 'ulvl/4',
  'sumskill3': '',
  'sumsk3calc': '',
  'sumskill4': '',
  'sumsk4calc': '',
  'sumskill5': '',
  'sumsk5calc': '',
  'aurastat3': 'item_crushingblow',
  'aurastatcalc3': '20',
  'sumumod': '27',  // 27 = spectral hit
}

const guardProps = {
  'summon': 'act2hire',
  'sumskill1': 'Natural Resistance',
  'sumsk1calc': 'ulvl/4',
  'sumskill2': 'Jab',
  'sumsk2calc': 'ulvl/4',
  'sumskill3': 'Sanctuary',
  'sumsk3calc': "(stat('gold'.accr)==0)?(ulvl/4):0",
  'sumskill4': 'Thorns',
  'sumsk4calc': "(stat('gold'.accr)==0)?0:(ulvl/4)",
  'sumskill5': '',
  'sumsk5calc': "",
  'sumumod': '', // 30 = random offensive aura (thorns, sanctuary, Concentration)
}

// Act3 mage not useable - does nothing unless monstats.txt isMelee set to 1
const mageProps = {
  'summon': 'act3hire',
  'sumskill1': 'Natural Resistance',
  'sumsk1calc': 'ulvl/4',
  'sumskill2': '',
  'sumsk2calc': '',
  'sumskill3': '',
  'sumsk3calc': '',
  'sumskill4': '',
  'sumsk4calc': '',
  'sumumod': '',
}

// Barb does not use bash or stun when summoned
const barbProps = {
  'summon': 'act5hire1',
  'sumskill1': 'Natural Resistance',
  'sumsk1calc': 'ulvl/4',
  'sumskill2': 'Sword Mastery',
  'sumsk2calc': 'ulvl/4',
  // 'sumskill3': 'Stun',
  // 'sumsk3calc': 'ulvl/4',
  // 'sumskill4': 'Bash',
  // 'sumsk4calc': 'ulvl/4',
  'aurastat3': 'item_crushingblow',
  'aurastatcalc3': '20',
  'sumumod': '', // 7 = randomly cast Amplify Damage when hitting
}


// 'rogue': { petName: "RogueScout", baseIcon: "rogueicon" },
// 'guard': { petName: "Guard", baseIcon: "act2hireableicon" },
// 'mage': { petName: "Iron Wolf", baseIcon: "act3hireableicon" },
// 'barb': { petName: "Barbarian", baseIcon: "barbhirable_icon" },

const mod_sidekick_rogue = {
  MAX_NUMBER: 1,
  NEW_NAME: 'RogueScout', // Must be in strings table
  NEW_ICON: 'rogueicon',
  NEW_SKILLNAME: 'minion', // not use if SKILL_TO_REPLACE is set
  NEW_SKILLDESC: 'Minion', // not use if SKILL_TO_REPLACE is set
  NEW_PET_TYPE: 'rogue_minion',
  // Popular options: clay golem , irongolem , valkyrie
  SKILL_TO_COPY: 'clay golem', // from skilldesc column
  SKILLDESC_TO_COPY: 'find potion', // from skilldesc column
  // Popular options are: sacrifice , find potion , grim ward
  SKILL_TO_REPLACE: 'sacrifice',  // from skilldesc column, leave empty to insert new line
  PETTYPE_TO_COPY: 'skeleton',
  // new summon properties
  NEW_PROPS: Object.assign({}, commonProps, rogueProps),
  NEW_DISPLAYPROPS: {} // these can only be assigned dynamically at runtime
}

const mod_sidekick_guard = {
  MAX_NUMBER: 1,
  NEW_NAME: 'Guard',
  NEW_ICON: 'act2hireableicon',
  NEW_PET_TYPE: 'guard_minion',
  SKILL_TO_COPY: 'clay golem',
  SKILLDESC_TO_COPY: 'find potion',
  SKILL_TO_REPLACE: 'find potion',
  PETTYPE_TO_COPY: 'skeleton',
  NEW_PROPS: Object.assign({}, commonProps, guardProps),
  NEW_DISPLAYPROPS: {}
}


const mod_sidekick_mage = {
  MAX_NUMBER: 1,
  NEW_NAME: 'Iron Wolf',
  NEW_ICON: 'act3hireableicon',
  NEW_PET_TYPE: 'mage_minion',
  SKILL_TO_COPY: 'clay golem',
  SKILLDESC_TO_COPY: 'find potion',
  SKILL_TO_REPLACE: 'find potion',
  PETTYPE_TO_COPY: 'skeleton',
  NEW_PROPS: Object.assign({}, commonProps, mageProps),
  NEW_DISPLAYPROPS: {}
}

const mod_sidekick_barb = {
  MAX_NUMBER: 1,
  NEW_NAME: 'Barbarian', // Must be in strings table
  NEW_ICON: 'barbhirable_icon',
  NEW_PET_TYPE: 'barb_minion',
  SKILL_TO_COPY: 'clay golem',
  SKILLDESC_TO_COPY: 'find potion',
  SKILL_TO_REPLACE: 'find potion',
  PETTYPE_TO_COPY: 'skeleton',
  NEW_PROPS: Object.assign({}, commonProps, barbProps),
  NEW_DISPLAYPROPS: {}
}



const mod_sidekick = {
  update_skills_txt: function (mod, targetFiles, settings) {

    const txt_lines = targetFiles['skills.txt']

    // get file headers and offsets
    const col = modder.get_column_index(targetFiles, 'skills.txt')
    const rowToCopy = modder.find_row_value(txt_lines, 'skilldesc', settings.SKILL_TO_COPY)
    const rowToReplace = !settings.SKILL_TO_REPLACE ? -1 : modder.find_row_value(txt_lines, 'skilldesc', settings.SKILL_TO_REPLACE)

    const maxId = modder.get_max_column(txt_lines, 'Id')
    const rowData = txt_lines[rowToCopy].split('\t')

    if (settings.SKILL_TO_REPLACE) {
      const originalData = txt_lines[rowToReplace].split('\t')
      rowData[col('skill')] = originalData[col('skill')]
      rowData[col('Id')] = originalData[col('Id')]
      rowData[col('charclass')] = originalData[col('charclass')]
      rowData[col('skilldesc')] = originalData[col('skilldesc')]
    } else {
      rowData[col('skill')] = settings.NEW_SKILLNAME
      rowData[col('Id')] = maxId + 1
      rowData[col('charclass')] = ''
      rowData[col('skilldesc')] = settings.NEW_SKILLDESC
    }

    rowData[col('pettype')] = settings.NEW_PET_TYPE
    rowData[col('petmax')] = settings.MAX_NUMBER

    for (const key in settings.NEW_PROPS) {
      rowData[col(key)] = settings.NEW_PROPS[key]
    }

    const updateRow = !settings.SKILL_TO_REPLACE ? txt_lines.length : rowToReplace
    txt_lines[updateRow] = rowData.join('\t');
  },


  update_skilldesc_txt: function (mod, targetFiles, settings) {

    var txt_lines = targetFiles['skilldesc.txt']

    // get file headers and offsets
    const col = modder.get_column_index(targetFiles, 'skilldesc.txt')
    const rowToCopy = modder.find_row_value(txt_lines, 'skilldesc', settings.SKILLDESC_TO_COPY)
    const rowToReplace = !settings.SKILL_TO_REPLACE ? -1 : modder.find_row_value(txt_lines, 'skilldesc', settings.SKILL_TO_REPLACE)

    const rowData = txt_lines[rowToCopy].split('\t')

    if (settings.SKILL_TO_REPLACE) {
      const originalData = txt_lines[rowToReplace].split('\t')
      rowData[col('skilldesc')] = originalData[col('skilldesc')]
      rowData[col('SkillPage')] = originalData[col('SkillPage')]
      rowData[col('SkillRow')] = originalData[col('SkillRow')]
      rowData[col('SkillColumn')] = originalData[col('SkillColumn')]
      rowData[col('ListRow')] = originalData[col('ListRow')]
      rowData[col('ListPool')] = originalData[col('ListPool')]
      rowData[col('IconCel')] = originalData[col('IconCel')]
    } else {
      rowData[col('skilldesc')] = settings.NEW_SKILLDESC
      rowData[col('SkillPage')] = '0'
      rowData[col('SkillRow')] = '0'
      rowData[col('SkillColumn')] = '0'
      rowData[col('ListRow')] = '0'
      rowData[col('ListPool')] = '0'
      rowData[col('IconCel')] = '8'
    }

    // rowData[col('str name')] = settings.NEW_NAME

    for (const key in settings.NEW_DISPLAYPROPS) {
      rowData[col(key)] = settings.NEW_DISPLAYPROPS[key]
    }

    const updateRowIndex = !settings.SKILL_TO_REPLACE ? txt_lines.length : modder.find_row_value(txt_lines, 'skilldesc', settings.SKILL_TO_REPLACE)
    txt_lines[updateRowIndex] = rowData.join('\t');
  },


  update_pettype_txt: function (mod, targetFiles, settings) {

    var txt_lines = targetFiles['pettype.txt']

    // get file headers and offsets
    const col = modder.get_column_index(targetFiles, 'pettype.txt')
    const rowToCopy = modder.find_row_value(txt_lines, 'pet type', settings.PETTYPE_TO_COPY)
    const maxId = modder.get_max_column(txt_lines, 'idx')

    const rowData = txt_lines[rowToCopy].split('\t')

    rowData[col('pet type')] = settings.NEW_PET_TYPE
    rowData[col('idx')] = maxId + 1
    rowData[col('name')] = settings.NEW_NAME
    rowData[col('icontype')] = settings.MAX_NUMBER > 1 ? 2 : 1  // 1 = without counter, 2 = with counter
    rowData[col('baseicon')] = settings.NEW_ICON

    txt_lines[txt_lines.length] = rowData.join('\t');
  },


  update_charstats_txt: function (mod, targetFiles, settings) {
    const summonSkill = settings.SKILL_TO_REPLACE

    // get file headers and offsets
    var txt_lines = targetFiles['charstats.txt']
    const col = modder.get_column_index(targetFiles, 'charstats.txt')

    const characterList = ['Amazon', 'Sorceress', 'Necromancer', 'Paladin', 'Barbarian', 'Druid', 'Assassin']
    const skillList = { 'grim ward': 'Grim Ward', sacrifice: 'Sacrifice', 'find potion': 'Find Potion' }
    const skillToAdd = skillList[summonSkill] ? skillList[summonSkill] : skillList['grimward']

    for (var charType of characterList) {
      let charRowNumber = modder.find_row_value(txt_lines, 'class', charType)

      // Skip changing character if they already have this skill
      if (charType === 'Barbarian' && (summonSkill === 'find potion' || summonSkill === 'grim ward')) charRowNumber = -1;
      if (charType === 'Paladin' && summonSkill === 'sacrifice') charRowNumber = -1;

      if (charRowNumber > 0) {
        const charColumnData = txt_lines[charRowNumber].split('\t')
        for (var skillNumber = 8; skillNumber <= 10; skillNumber++) {
          const skillColumn = col("Skill " + skillNumber)
          if (charColumnData[skillColumn] === "") {
            charColumnData[skillColumn] = skillToAdd
            // stop after first free skill is found
            break;
          }
        }

        txt_lines[charRowNumber] = charColumnData.join('\t')
      }
    }
  },
}

export default function applyPatch(mod, targetFiles) {
  const optionSkills = { "grim ward": "grim ward", "find potion": "find potion", "sacrifice": "sacrifice" }
  const optionTypes = { guard: mod_sidekick_guard, rogue: mod_sidekick_rogue, mage: mod_sidekick_mage, barb: mod_sidekick_barb }

  const optionType = optionTypes[mod.options.summonType]
  const optionSkill = optionSkills[mod.options.summonSkill]

  if (!optionType) throw Error('mod_sidekick: Invalid type')
  if (!optionSkill) throw Error('mod_sidekick: Invalid skill')

  const settings = optionType
  settings.SKILL_TO_REPLACE = optionSkill
  settings.SKILLDESC_TO_COPY = optionSkill

  const isD2r = modder.isD2R()

  const newDisplayProps = {
    // Copy description structure from revive
    'str short': 'skillsd95',
    'str long': 'skillld95',
    'str alt': 'skillan95',

    'descline1': '',
    'desctexta1': '',
    'desctextb1': '',
    'desccalca1': '',
    'desccalcb1': '',

    'descline2': isD2r ? '74' : '5', // S1C1
    'desctexta2': 'StrSkill42', // Life:
    'desctextb2': '',
    'desccalca2': `${summonProps.life}/256`,
    'desccalcb2': '',

    'descline3': isD2r ? '74' : '5', // S1C1
    'desctexta3': isD2r ? 'StrSkillDefense' : 'StrSkill21', // Defense:
    'desctextb3': '',
    'desccalca3': summonProps.defense,
    'desccalcb3': '',

    'descline4': isD2r ? '74' : '5', // S1C1
    'desctexta4': isD2r ? 'StrSkillAttackRating' : 'StrSkill22', // Attack:
    'desctextb4': '',
    'desccalca4': summonProps.attack,
    'desccalcb4': '',

    'descline5': '34', // S1C1
    'desctexta5': 'StrSkill4', // Damage:
    'desctextb5': '',
    'desccalca5': '',
    'desccalcb5': '',

    'descline6': '18', // S1
    'desctexta6': settings.NEW_NAME,
    'desctextb6': '',
    'desccalca6': '',
    'desccalcb6': '',
  }
  settings.NEW_DISPLAYPROPS = newDisplayProps

  // println(settings)


  mod_sidekick.update_skills_txt(mod, targetFiles, settings)
  mod_sidekick.update_skilldesc_txt(mod, targetFiles, settings)
  mod_sidekick.update_pettype_txt(mod, targetFiles, settings)
  mod_sidekick.update_charstats_txt(mod, targetFiles, settings)
}
