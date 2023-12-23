/*
    "options": {
      "id": '1',
      "summonSkill": "findpotion",    // findpotion, sacrifice, grimward
      "summonType": "guard"           // rogue, guard, mage, barb
    }
*/

import modder from '../../js/modder.js'

const prnt = console.log


const SUMMON_SPECS = {
  rogue: {
    summon: 'roguehire',
    sumskill1: 'RogueMissile', // 'fire arrow', 'Exploding Arrow', 'RogueMissile', 'Critical Strike'
    sumsk1calc: 'ulvl/3',
    sumskill2: 'Inner Sight',
    sumsk2calc: 'ulvl/3',
    sumumod: '27', //multishot 29, lightning enchanted 17, 27 spectral hit
    stat1: 'item_fasterattackrate',  // 'item_deadlystrike',
    calc1: '80',
    stat2: 'item_explosivearrow',  // item_magicarrow
    calc2: '5',
  },
  guard: {
    summon: 'act2hire',
    sumskill1: 'Jab',
    sumsk1calc: 'ulvl/3',
    sumskill2: 'Polearm Mastery',
    sumsk2calc: 'ulvl/3',
    sumumod: '30',
    stat1: 'item_stupidity', // item_openwounds
    calc1: '35',
  },
  mage: {
    summon: 'act3hire',
    sumskill2: 'Sword Mastery',
    sumsk2calc: 'ulvl/3',
    sumskill1: 'Sanctuary',
    sumsk1calc: 'ulvl/3',
    sumumod: '27',
    stat1: 'item_stupidity',
    calc1: '40',
  },
  barb: {
    summon: 'act5hire1',
    sumskill1: 'Sword Mastery',
    sumsk1calc: 'ulvl/3',
    sumskill2: 'Sanctuary',
    sumsk2calc: 'ulvl/3',
    sumumod: '',
    stat1: 'item_fasterattackrate',  // 'item_deadlystrike',
    calc1: '80',
    stat2: 'item_allskills',
    calc2: 'ulvl/3',
  }
}


var mod_side_kick = {
  SK_TYPE: "sidekick",
  SK_OFFSET: 0, // offset when there is more than one side kick
  SK_MAX_NUMBER: 1, // maximum number of side kicks allowed for this type
  SK_NEED_ITEM: false, // determines if need an item to summon this side kick
  SK_LIFE: "stat('maxhp'.accr)*2",
  SK_DAMAGE: "max(ulvl*2, stat('maxdamage'.accr)+stat('secondary_maxdamage'.accr))",
  SK_DEFENSE: "(stat('dexterity'.accr)/4+stat('armorclass'.accr))",
  SK_ATTACK: "stat('tohit'.accr)*2",


  update_skills_txt: function (mod, targetFiles) {
    // get file headers and offsets
    var fileLines = targetFiles['skills.txt']
    const col = modder.get_column_index(targetFiles, 'skills.txt')

    // find row to copy
    // const rowToCopyIndex = modder.find_row_value(fileLines, 'skill', 'Valkyrie')
    const rowToCopyIndex = modder.find_row_value(fileLines, 'skill', 'Clay Golem')
    // const rowToCopyIndex = modder.find_row_value(fileLines, 'skill', 'Shadow Master')
    const rowToCopy = fileLines[rowToCopyIndex]

    // find row to modify
    const skillList = { grimward: 'Grim Ward', sacrifice: 'Sacrifice', findpotion: 'Find Potion' }
    const skillToModify = skillList[mod.options.summonSkill] ? skillList[mod.options.summonSkill] : skillList['grimward']
    const rowToModifyIndex = modder.find_row_value(fileLines, 'skill', skillToModify)

    // Prepare the search and replace operation
    var skills_txt_op = { "find": "", "replace": "" }
    skills_txt_op.find = fileLines[rowToModifyIndex];

    // update skills.txt file
    var columns = rowToCopy.split('\t')

    // set columns to keep in target row
    const keepColumns = skills_txt_op.find.split('\t');
    columns[col('skill')] = keepColumns[col('skill')];

    const idColumnName = modder.isD2R() ? '*Id' : 'Id'
    columns[col(idColumnName)] = keepColumns[col(idColumnName)];

    columns[col('charclass')] = keepColumns[col('charclass')];
    columns[col('skilldesc')] = keepColumns[col('skilldesc')];

    // change common options
    columns[col('pettype')] = this.SK_TYPE;
    columns[col('aurastate')] = 'thorns';

    columns[col('reqskill1')] = '';
    columns[col('reqskill2')] = '';
    columns[col('reqskill3')] = '';

    // reduce mana cost
    columns[col('manashift')] = '1';
    columns[col('mana')] = '1';

    // add summon stats
    // Bug in Shadow warrior/master means only passivecalc2 and aurastatcalc2 values is used in their respective sections

    // life/defense
    columns[col('passivestat1')] = 'hpregen';
    columns[col('passivecalc1')] = '100'; // 100 = 20% per second

    columns[col('passivestat2')] = 'maxhp';
    columns[col('passivecalc2')] = mod_side_kick.SK_LIFE;

    columns[col('passivestat3')] = 'item_normaldamage';
    columns[col('passivecalc3')] = mod_side_kick.SK_DAMAGE;

    // attack / damage
    columns[col('aurastat1')] = 'tohit';
    columns[col('aurastatcalc1')] = mod_side_kick.SK_ATTACK;

    columns[col('aurastat2')] = 'armorclass';
    columns[col('aurastatcalc2')] = mod_side_kick.SK_DEFENSE;

    // Set pet options
    columns[col('petmax')] = '' + mod_side_kick.SK_MAX_NUMBER;

    columns[col('srvdofunc')] = mod_side_kick.SK_NEED_ITEM ? '57' : '56'; // AI type 56 = golem, 57 = iron golem, 16 valkyrie, 15 dopplezon, 49 shadow master/warrior
 
    columns[col('TargetItem')] = mod_side_kick.SK_NEED_ITEM ? '1' : '' // TargetItem 1 or blank
    columns[col('srvstfunc')] = mod_side_kick.SK_NEED_ITEM ? '20' : '';
    columns[col('LineOfSight')] = mod_side_kick.SK_NEED_ITEM ? '4' : '';

    // passive stat 1-5
    // columns[col('passivestat4')] = 'item_crushingblow'
    // columns[col('passivecalc4')] = '8'

    // columns[col('skpoints')] = '0'
    // columns[col('sumoverlay')] = '1'

    // sumskill1-5


    // get skill formula
    // const skillLevel = `lvl`

    // Set type specific properties
    const spec = SUMMON_SPECS[mod.options.summonType];
    if (typeof (spec) === 'object') {
      columns[col('summon')] = spec['summon'];
      columns[col('sumskill1')] = spec['sumskill1'];
      columns[col('sumsk1calc')] = spec['sumsk1calc'];
      columns[col('sumskill2')] = spec['sumskill2'];
      columns[col('sumsk2calc')] = spec['sumsk2calc'];
      columns[col('sumskill3')] = 'Natural Resistance';
      columns[col('sumsk3calc')] = 'ulvl/3';
      columns[col('sumskill4')] = 'Iron Skin';
      columns[col('sumsk4calc')] = 'ulvl/3'
      columns[col('sumumod')] = spec['sumumod'];
      columns[col('aurastat3')] = spec['stat1'];
      columns[col('aurastatcalc3')] = spec['calc1'];
      if (spec['stat2']) {
        columns[col('aurastat4')] = spec['stat2'];
        columns[col('aurastatcalc4')] = spec['calc2'];  
      }
    }

    skills_txt_op.replace = columns.join('\t')

    modder.applySearchAndReplace([skills_txt_op], 'skills.txt', targetFiles);
  },

  update_skilldesc_txt: function (mod, targetFiles) {
    // get file headers and offsets
    var fileLines = targetFiles['skilldesc.txt']
    const col = modder.get_column_index(targetFiles, 'skilldesc.txt')

    // Get skill row to modify
    const skillList = { grimward: 'grim ward', sacrifice: 'sacrifice', findpotion: 'find potion' }
    const skillToModify = skillList[mod.options.summonSkill] ? skillList[mod.options.summonSkill] : skillList['grimward']
    const rowToModifyIndex = modder.find_row_value(fileLines, 'skilldesc', skillToModify)

    const summonTypeList = { rogue: 'RogueScout', guard: 'Guard', mage: 'Iron Wolf', barb: 'Barbarian' }
    const SummonTypeName = summonTypeList[mod.options.summonType] ? summonTypeList[mod.options.summonType] :
      summonTypeList['barb']

    // Prepare search and replace operation
    var skilldesc_txt_op = {
      "find": fileLines[rowToModifyIndex],
      "replace": "columns",
      "columns": [
        // Copy descriptions from revive
        { "col": col('str short'), "val": "skillsd95" },
        { "col": col('str long'), "val": "skillld95" },
        { "col": col('str alt'), "val": "skillan95" },

        // Blank out unused line
        { "col": col('descline1'), "val": "" },
        { "col": col('desctexta1'), "val": '' },
        { "col": col('desctextb1'), "val": '' },
        { "col": col('desccalca1'), "val": '' },
        { "col": col('desccalcb1'), "val": '' },

        // Common lines
        { "col": col('descline4'), "val": "34", "desc": "S1C1" },
        { "col": col('desctexta4'), "val": "StrSkill4", "desc": "Damage:" },
        { "col": col('desctextb4'), "val": "", "desc": "" },
        { "col": col('desccalca4'), "val": '', "desc": "Value/formula" },
        { "col": col('desccalcb4'), "val": '', "desc": "Value/formula" },

        { "col": col('descline6'), "val": "18", "desc": "S1" },
        { "col": col('desctexta6'), "val": SummonTypeName, "desc": "SummonType" },
      ]
    }

    if (modder.isD2R()) {
      skilldesc_txt_op.columns = skilldesc_txt_op.columns.concat(
        { "col": col('descline2'), "val": "74", "desc": "S1C1" },
        { "col": col('desctexta2'), "val": "StrSkill42", "desc": "Life:" },
        { "col": col('desctextb2'), "val": "", "desc": "" },
        { "col": col('desccalca2'), "val": `${mod_side_kick.SK_LIFE}/256`, "desc": "Value/formula" },
        { "col": col('desccalcb2'), "val": "", "desc": "Value/formula" },

        { "col": col('descline3'), "val": "74", "desc": "S1C1" },
        { "col": col('desctexta3'), "val": "StrSkillDefense", "desc": "Defense:" },
        { "col": col('desctextb3'), "val": "", "desc": "" },
        { "col": col('desccalca3'), "val": mod_side_kick.SK_DEFENSE, "desc": "Value/formula" },
        { "col": col('desccalcb3'), "val": "", "desc": "" },

        { "col": col('descline5'), "val": "74", "desc": "S1C1" },
        { "col": col('desctexta5'), "val": "StrSkillAttackRating", "desc": "Attack:" },
        { "col": col('desctextb5'), "val": "", "desc": "Attack:" },
        { "col": col('desccalca5'), "val": mod_side_kick.SK_ATTACK, "desc": "Value/formula" },
        { "col": col('desccalcb5'), "val": "", "desc": "" },
      )
    } else {
      skilldesc_txt_op.columns = skilldesc_txt_op.columns.concat(
        { "col": col('descline2'), "val": "5", "desc": "S1C1" },
        { "col": col('desctexta2'), "val": "StrSkill42", "desc": "Life:" },
        { "col": col('desctextb2'), "val": "", "desc": "" },
        { "col": col('desccalca2'), "val": `${mod_side_kick.SK_LIFE}/256`, "desc": "Value/formula" },
        { "col": col('desccalcb2'), "val": "", "desc": "Value/formula" },

        { "col": col('descline3'), "val": "5", "desc": "S1C1" },
        { "col": col('desctexta3'), "val": "StrSkill21", "desc": "Defense:" },
        { "col": col('desctextb3'), "val": "", "desc": "" },
        { "col": col('desccalca3'), "val": mod_side_kick.SK_DEFENSE, "desc": "Value/formula" },
        { "col": col('desccalcb3'), "val": "", "desc": "" },

        { "col": col('descline5'), "val": "5", "desc": "S1C1" },
        { "col": col('desctexta5'), "val": "StrSkill22", "desc": "Attack:" },
        { "col": col('desctextb5'), "val": "", "desc": "Attack:" },
        { "col": col('desccalca5'), "val": mod_side_kick.SK_ATTACK, "desc": "Value/formula" },
        { "col": col('desccalcb5'), "val": "", "desc": "" },
      )
    }

    modder.applySearchAndReplace([skilldesc_txt_op], 'skilldesc.txt', targetFiles);
  },

  update_pettype_txt: function (mod, targetFiles) {
    const isD2R = modder.MOD_TARGET === 'd2r'

    // get file headers and offsets
    var fileLines = targetFiles['pettype.txt']
    const col = modder.get_column_index(targetFiles, 'pettype.txt')

    // find row to copy
    const rowToCopyIndex = modder.find_row_value(fileLines, 'pet type', 'valkyrie')
    const rowToCopy = fileLines[rowToCopyIndex]

    const columns = rowToCopy.split('\t')

    const options = {
      'rogue': { petName: "RogueScout", baseIcon: "rogueicon" },
      'guard': { petName: "Guard", baseIcon: "act2hireableicon" },
      'mage': { petName: "Iron Wolf", baseIcon: "act3hireableicon" },
      'barb': { petName: "Barbarian", baseIcon: "barbhirable_icon" },
    }
    const chosenOptions = options[mod.options.summonType] ? options[mod.options.summonType] : options['barb'];

    const maxID = modder.get_max_column(fileLines, 'idx');

    columns[col('pet type')] = this.SK_TYPE;
    if (!isD2R) columns[col('idx')] = maxID + 1
    columns[col('name')] = chosenOptions.petName;
    columns[col('baseicon')] = chosenOptions.baseIcon;
    // show number of pets if allowing more than one sidekick of this type
    if (mod_side_kick.SK_MAX_NUMBER > 1) columns[col('icontype')] = 2

    const newLine = columns.join('\t');

    var content = targetFiles['pettype.txt']
    const newContent = content.concat(newLine);
    targetFiles['pettype.txt'] = newContent;

  },

  update_charstats_txt: function (mod, targetFiles) {

    // get file headers and offsets
    var fileLines = targetFiles['charstats.txt']
    var COLUMN_NAMES = fileLines[0];
    var COLUMNS = COLUMN_NAMES.split('\t');
    function col(name) { return COLUMNS.indexOf(name) }

    const skillList = { grimward: 'Grim Ward', sacrifice: 'Sacrifice', findpotion: 'Find Potion' }
    const addSkill = skillList[mod.options.summonSkill] ? skillList[mod.options.summonSkill] : skillList['grimward']

    const barbAddSkill = (mod.options.summonSkill === 'findpotion' || mod.options.summonSkill === 'grimward') ?
      '' : addSkill;

    const paladinAddSkill = (mod.options.summonSkill === 'sacrifice') ? '' : addSkill;

    const skillOffset = mod_side_kick.SK_OFFSET;

    const charstats_txt_ops = [
      {
        "find": "Amazon\t",
        "replace": "columns",
        "columns": [
          { "col": col('Skill 8') + skillOffset, "val": addSkill }
        ]
      },
      {
        "find": "Sorceress\t",
        "replace": "columns",
        "columns": [
          { "col": col('Skill 8') + skillOffset, "val": addSkill }
        ]
      },
      {
        "find": "Necromancer\t",
        "replace": "columns",
        "columns": [
          { "col": col('Skill 8') + skillOffset, "val": addSkill }
        ]
      },
      {
        "find": "Paladin\t",
        "replace": "columns",
        "columns": [
          { "col": col('Skill 8') + skillOffset, "val": paladinAddSkill }
        ]
      },
      {
        "find": "Barbarian\t",
        "replace": "columns",
        "columns": [
          { "col": col('Skill 10'), "val": barbAddSkill }
        ]
      },
      {
        "find": "Druid\t",
        "replace": "columns",
        "columns": [
          { "col": col('Skill 8') + skillOffset, "val": addSkill }
        ]
      },
      {
        "find": "Assassin\t",
        "replace": "columns",
        "columns": [
          { "col": col('Skill 9') + skillOffset, "val": addSkill }
        ]
      }
    ]

    var charstats_txt_lines = targetFiles['charstats.txt']

    for (const index in charstats_txt_ops) {
      const op = charstats_txt_ops[index]
      charstats_txt_lines.filter(function (line, index) {
        if (line.indexOf(op.find) >= 0) {
          charstats_txt_lines[index] = modder.replaceColumns(line, op.columns)
        }
      })
    }
  },

  update_monstats_txt: function (mod, targetFiles) {
    // get file headers and offsets
    var fileLines = targetFiles['monstats.txt']
    var COLUMN_NAMES = fileLines[0];
    var COLUMNS = COLUMN_NAMES.split('\t');
    function col(name) { return COLUMNS.indexOf(name) }

    // Get monster row to modify
    const monList = { rogue: 'roguehire', guard: 'act2hire', mage: 'act3hire', barb: 'act5hire1' }
    const monToModify = monList[mod.options.summonType] ? monList[mod.options.summonType] : monList['barb']
    const rowToModifyIndex = modder.find_row_value(fileLines, 'Id', monToModify)

    const summonLife = '376';

    // Prepare search and replace operation
    var monstats_txt_op = {
      "find": fileLines[rowToModifyIndex],
      "replace": "columns",
      "columns": [
        // ##
        { "col": col('inventory'), "val": "1" },
        // Add base life to side kick
        // this is only required if skill template based on Shadow Master (srvdofunc=49)
        { "col": col('AI'), "val": "ShadowMaster" },
        { "col": col('minHP'), "val": summonLife },
        { "col": col('maxHP'), "val": summonLife },
        { "col": col('MinHP(N)'), "val": summonLife },
        { "col": col('MaxHP(N)'), "val": summonLife },
        { "col": col('MinHP(H)'), "val": summonLife },
        { "col": col('MaxHP(H)'), "val": summonLife },
      ]
    }

    modder.applySearchAndReplace([monstats_txt_op], 'monstats.txt', targetFiles);

  }
}

export default function applyPatch(mod, targetFiles) {
  if (mod.options.id) {
    mod_side_kick.SK_TYPE = 'sidekick' + mod.options.id;
    mod_side_kick.SK_OFFSET = mod.options.id - 1;
  };

  mod_side_kick.update_skills_txt(mod, targetFiles)
  mod_side_kick.update_skilldesc_txt(mod, targetFiles)
  mod_side_kick.update_pettype_txt(mod, targetFiles)
  mod_side_kick.update_charstats_txt(mod, targetFiles)
  // mod_side_kick.update_monstats_txt(mod, targetFiles)
}
