var mod_side_kick1 = {
  SK_TYPE: "sidekick1", // also update patch.json to match type
  SK_OFFSET: 0, // offset when there is more than one side kick
  SK_MAX_NUMBER: 1, // maximum number of side kicks allowed for this type
  SK_NEED_ITEM: true, // determines if need an item to summon this side kick
  SK_LIFE: "stat('maxhp'.accr)*2",
  SK_DAMAGE: "max(stat('maxdamage'.accr),stat('secondary_maxdamage'.accr))",
  SK_DEFENSE: "stat('armorclass'.accr)",
  SK_ATTACK: "stat('tohit'.accr)",


  update_skills_txt: function (mod, targetFiles) {
    var SKILL_COLUMN_NAMES = "skill\tId\tcharclass\tskilldesc\tsrvstfunc\tsrvdofunc\tprgstack\tsrvprgfunc1\tsrvprgfunc2\tsrvprgfunc3\tprgcalc1\tprgcalc2\tprgcalc3\tprgdam\tsrvmissile\tdecquant\tlob\tsrvmissilea\tsrvmissileb\tsrvmissilec\tsrvoverlay\taurafilter\taurastate\tauratargetstate\tauralencalc\taurarangecalc\taurastat1\taurastatcalc1\taurastat2\taurastatcalc2\taurastat3\taurastatcalc3\taurastat4\taurastatcalc4\taurastat5\taurastatcalc5\taurastat6\taurastatcalc6\tauraevent1\tauraeventfunc1\tauraevent2\tauraeventfunc2\tauraevent3\tauraeventfunc3\tauratgtevent\tauratgteventfunc\tpassivestate\tpassiveitype\tpassivestat1\tpassivecalc1\tpassivestat2\tpassivecalc2\tpassivestat3\tpassivecalc3\tpassivestat4\tpassivecalc4\tpassivestat5\tpassivecalc5\tpassiveevent\tpassiveeventfunc\tsummon\tpettype\tpetmax\tsummode\tsumskill1\tsumsk1calc\tsumskill2\tsumsk2calc\tsumskill3\tsumsk3calc\tsumskill4\tsumsk4calc\tsumskill5\tsumsk5calc\tsumumod\tsumoverlay\tstsuccessonly\tstsound\tstsoundclass\tstsounddelay\tweaponsnd\tdosound\tdosound a\tdosound b\ttgtoverlay\ttgtsound\tprgoverlay\tprgsound\tcastoverlay\tcltoverlaya\tcltoverlayb\tcltstfunc\tcltdofunc\tcltprgfunc1\tcltprgfunc2\tcltprgfunc3\tcltmissile\tcltmissilea\tcltmissileb\tcltmissilec\tcltmissiled\tcltcalc1\t*cltcalc1 desc\tcltcalc2\t*cltcalc2 desc\tcltcalc3\t*cltcalc3 desc\twarp\timmediate\tenhanceable\tattackrank\tnoammo\trange\tweapsel\titypea1\titypea2\titypea3\tetypea1\tetypea2\titypeb1\titypeb2\titypeb3\tetypeb1\tetypeb2\tanim\tseqtrans\tmonanim\tseqnum\tseqinput\tdurability\tUseAttackRate\tLineOfSight\tTargetableOnly\tSearchEnemyXY\tSearchEnemyNear\tSearchOpenXY\tSelectProc\tTargetCorpse\tTargetPet\tTargetAlly\tTargetItem\tAttackNoMana\tTgtPlaceCheck\tItemEffect\tItemCltEffect\tItemTgtDo\tItemTarget\tItemCheckStart\tItemCltCheckStart\tItemCastSound\tItemCastOverlay\tskpoints\treqlevel\tmaxlvl\treqstr\treqdex\treqint\treqvit\treqskill1\treqskill2\treqskill3\trestrict\tState1\tState2\tState3\tdelay\tleftskill\trepeat\tcheckfunc\tnocostinstate\tusemanaondo\tstartmana\tminmana\tmanashift\tmana\tlvlmana\tinterrupt\tInTown\taura\tperiodic\tperdelay\tfinishing\tpassive\tprogressive\tgeneral\tscroll\tcalc1\t*calc1 desc\tcalc2\t*calc2 desc\tcalc3\t*calc3 desc\tcalc4\t*calc4 desc\tParam1\t*Param1 Description\tParam2\t*Param2 Description\tParam3\t*Param3 Description\tParam4\t*Param4 Description\tParam5\t*Param5 Description\tParam6\t*Param6 Description\tParam7\t*Param7 Description\tParam8\t*Param8 Description\tInGame\tToHit\tLevToHit\tToHitCalc\tResultFlags\tHitFlags\tHitClass\tKick\tHitShift\tSrcDam\tMinDam\tMinLevDam1\tMinLevDam2\tMinLevDam3\tMinLevDam4\tMinLevDam5\tMaxDam\tMaxLevDam1\tMaxLevDam2\tMaxLevDam3\tMaxLevDam4\tMaxLevDam5\tDmgSymPerCalc\tEType\tEMin\tEMinLev1\tEMinLev2\tEMinLev3\tEMinLev4\tEMinLev5\tEMax\tEMaxLev1\tEMaxLev2\tEMaxLev3\tEMaxLev4\tEMaxLev5\tEDmgSymPerCalc\tELen\tELevLen1\tELevLen2\tELevLen3\tELenSymPerCalc\taitype\taibonus\tcost mult\tcost add";
    var SKILL_COLUMNS = SKILL_COLUMN_NAMES.split('\t');

    function col(name) {
      return SKILL_COLUMNS.indexOf(name)
    }

    var skills_txt_op = {
      "find": "Grim Ward\t150\tbar\tgrim ward",
      "replace": "Grim Ward\t150\tbar\tgrim ward\t\t57\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tarmorclass\t" + mod_side_kick1.SK_DEFENSE + "\ttohit\t" + 
      mod_side_kick1.SK_ATTACK + "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tmaxhp\t" + mod_side_kick1.SK_LIFE + "\titem_normaldamage\t" + mod_side_kick1.SK_DAMAGE + "\thpregen\t164\titem_crushingblow\t25\t\t\t\t\tact5hire1\t" + mod_side_kick1.SK_TYPE + "\t" + 
      "1\tNU\t\t\t\t\t\t\t\t\t\t\t27\t\t\tnecromancer_golem_cast\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t1\t5\t\tnone\t\t\t\t\t\t\t\t\t\t\t\tSC\tSC\tS1\t\t\t\t\t4\t\t\t\t\t\t\t\t\t1\t\t\t\t\t\t\t\t\t\t\t\t1\t20\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t1\t8\t5\t0\t1\t1\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t1\t\t\t\t\t\t\t\t8\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t384\t3000"
    }

    const SKILL_MARKER = 'Grim Ward\t150\tbar\tgrim ward'
    switch (mod.options.summonSkill) {
      case 'findpotion':
        skills_txt_op.find = "Find Potion\t131\tbar\tfind potion";
        skills_txt_op.replace = skills_txt_op.replace.replace(SKILL_MARKER, "Find Potion\t131\tbar\tfind potion")
        break;
      case 'sacrifice':
        skills_txt_op.find = "Sacrifice\t96\tpal\tsacrifice";
        skills_txt_op.replace = skills_txt_op.replace.replace(SKILL_MARKER, "Sacrifice\t96\tpal\tsacrifice")
        break;
      case 'grimward':
        // default no change required
        break;
    }

    // update skills.txt file
    var columns = skills_txt_op.replace.split('\t')

    // change common options
    columns[col('petmax')] = '' + mod_side_kick1.SK_MAX_NUMBER;
    columns[col('srvdofunc')] = mod_side_kick1.SK_NEED_ITEM ? '57' : '56' // AI type 56 = golem, 57 = iron golem
    columns[col('TargetItem')] = mod_side_kick1.SK_NEED_ITEM ? '1' : '' // TargetItem 1 or blank

    // passive stat 1-5
    columns[col('passivestat4')] = 'item_crushingblow'
    columns[col('passivecalc4')] = '8'

    // sumskill1-5
    columns[col('sumskill1')] = 'natural resistance'
    columns[col('sumsk1calc')] = '1+min(ulvl/3,19)'

    columns[col('sumskill2')] = 'increased speed'
    columns[col('sumsk2calc')] = '1'

    switch (mod.options.summonType) {
      case 'rogue':
        columns[col('passivestat5')] = 'item_fasterattackrate'
        columns[col('passivecalc5')] = '50'
        columns[col('summon')] = 'roguehire' // summon type
        columns[col('sumskill3')] = 'pierce'
        columns[col('sumsk3calc')] = '1'
        columns[col('sumskill4')] = 'inner sight'
        columns[col('sumsk4calc')] = '1'
        columns[col('sumumod')] = '29' // multishot
        break;
      case 'guard':
        columns[col('passivestat5')] = 'item_fasterattackrate'
        columns[col('passivecalc5')] = '50'
        columns[col('summon')] = 'act2hire' // summon type
        columns[col('sumskill3')] = 'jab'
        columns[col('sumsk3calc')] = '6'
        columns[col('sumskill4')] = 'sanctuary'
        columns[col('sumsk4calc')] = '1'
        columns[col('sumskill5')] = 'pole arm mastery'
        columns[col('sumsk5calc')] = '1'
        columns[col('sumumod')] = '' // champion can not be cursed=38, random offensive aura = 30, spectral hit=27
        break;
      case 'mage':
        columns[col('passivestat5')] = 'item_fasterattackrate'
        columns[col('passivecalc5')] = '50'
        columns[col('summon')] = 'act3hire'
        columns[col('sumskill3')] = 'sword mastery'
        columns[col('sumsk3calc')] = "1"
        columns[col('sumumod')] = '27' // spectral hit=27
        break;
      case 'barb':
        columns[col('passivestat5')] = 'lifedrainmindam'
        columns[col('passivecalc5')] = '10'
        columns[col('summon')] = 'act5hire1'
        columns[col('sumskill3')] = 'sword mastery'
        columns[col('sumsk3calc')] = "1"
        // columns[col('sumskill4')] = 'fanaticism'
        // columns[col('sumsk4calc')] = "skill('fanaticism'.lvl)==0?1:0"
        columns[col('sumumod')] = ''
        break;
    }
  
    skills_txt_op.replace = columns.join('\t')
  
    var skills_txt_lines = targetFiles['skills.txt']
    skills_txt_lines.filter(function(line, index) {
      if (line.indexOf(skills_txt_op.find) >= 0) {
        skills_txt_lines[index] = skills_txt_op.replace
      }
    })
  },

  update_skilldesc_txt: function(mod, targetFiles) {
    let SummonTypeName = ''
    switch (mod.options.summonType) {
      case 'rogue': SummonTypeName = "RogueScout";  break;
      case 'guard': SummonTypeName = "Guard";  break;
      case 'mage': SummonTypeName = "Mage";  break;
      case 'barb': SummonTypeName = "Barbarian";  break;
    }

    var skilldesc_txt_op = {
      "find": "grim ward\t3\t5",
      "replace": "columns",
      "columns": [
        { "col": 33, "val": "5", "desc": "S1C1" },
        { "col": 34, "val": "StrSkill42", "desc": "Life:" },
        { "col": 36, "val": mod_side_kick1.SK_LIFE + "/256", "desc": "Value/formula" },
  
        { "col": 38, "val": "5", "desc": "S1C1" },
        { "col": 39, "val": "StrSkill21", "desc": "Defense:" },
        { "col": 41, "val": mod_side_kick1.SK_DEFENSE, "desc": "Value/formula" },
  
        { "col": 43, "val": "5", "desc": "S1C1" },
        { "col": 44, "val": "StrSkill4", "desc": "Damage:" },
        { "col": 46, "val": mod_side_kick1.SK_DAMAGE, "desc": "Value/formula" },
  
        { "col": 48, "val": "5", "desc": "S1C1" },
        { "col": 49, "val": "StrSkill22", "desc": "Attack:" },
        { "col": 51, "val": mod_side_kick1.SK_ATTACK, "desc": "Value/formula" },

        { "col": 53, "val": "18", "desc": "S1" },
        { "col": 54, "val": SummonTypeName, "desc": "SummonType" },
        //{ "col": 56, "val": "1", "desc": "1" }
      ]
    }

    switch (mod.options.summonSkill) {
      case 'findpotion':
        skilldesc_txt_op.find = "find potion\t3\t1";
        break;
      case 'sacrifice':
        skilldesc_txt_op.find = "sacrifice\t1\t1";
        break;
      case 'grimward':
        // default no change required
        break;
    }

    var skilldesc_txt_lines = targetFiles['skilldesc.txt']
    skilldesc_txt_lines.filter(function(line, index) {
      if (line.indexOf(skilldesc_txt_op.find) >= 0) {
        skilldesc_txt_lines[index] = modder.replaceColumns(line, skilldesc_txt_op.columns)
      }
    })

  },

  update_pettype_txt: function(mod, targetFiles) {
    var pettype_txt_op = {
      "find": mod_side_kick1.SK_TYPE + "\t" + (23 + mod_side_kick1.SK_OFFSET) + "\t",
      "replace": "columns",
      "columns": [
        { "col": 9, "val": "Barbarian", "desc": "Text under icon" },
        { "col": 12, "val": "barbhirable_icon", "desc": "Icon" }
      ]
    }

    switch (mod.options.summonType) {
      case 'rogue':
        pettype_txt_op.columns = [
          { "col": 9, "val": "RogueScout" },
          { "col": 12, "val": "rogueicon" }
        ]
        break;
      case 'guard':
        pettype_txt_op.columns = [
          { "col": 9, "val": "Guard" },
          { "col": 12, "val": "act2hireableicon" }
        ]
        break;
      case 'mage':
        pettype_txt_op.columns = [
          { "col": 9, "val": "Mage" },
          { "col": 12, "val": "act3hireableicon" }
        ]
        break;
      case 'barb':
        // no need to change from default value
        break;
    }

    // show number of pets if allowing more than one sidekick of this type
    if (mod_side_kick1.SK_MAX_NUMBER > 1) {
      pettype_txt_op.columns[2] = { "col": 11, "val": "2", "desc": "changes icon to show number of side kicks" }
    }

    var pettype_txt_lines = targetFiles['pettype.txt']
    pettype_txt_lines.filter(function(line, index) {
      if (line.indexOf(pettype_txt_op.find) >= 0) {
        pettype_txt_lines[index] = modder.replaceColumns(line, pettype_txt_op.columns)
      }
    })
  },

  update_charstats_txt: function(mod, targetFiles) {
    var addSkill = 'Grim Ward'
  
    switch (mod.options.summonSkill) {
      case 'findpotion': addSkill = 'Find Potion'; break;
      case 'sacrifice': addSkill = 'Sacrifice'; break;
      case 'grimward':
        // default no change required
        break;
    }

    const barbAddSkill = (mod.options.summonSkill === 'findpotion' || mod.options.summonSkill === 'grimward') ?
        '' : addSkill;

    const paladinAddSkill = (mod.options.summonSkill === 'sacrifice') ? '' : addSkill;

    const skillOffset = mod_side_kick1.SK_OFFSET;
  
    const charstats_txt_ops = [
      {
        "find": "Amazon\t20",
        "replace": "columns",
         "columns": [
           {"col": 40+skillOffset, "val": addSkill}
          ]
      },
      {
        "find": "Sorceress\t10",
        "replace": "columns",
         "columns": [
           {"col": 40+skillOffset, "val": addSkill}
          ]
      },
      {
        "find": "Necromancer\t15",
        "replace": "columns",
         "columns": [
          {"col": 40+skillOffset, "val": addSkill}
          ]
      },
      {
        "find": "Paladin\t25",
        "replace": "columns",
         "columns": [
          {"col": 40+skillOffset, "val": paladinAddSkill}
          ]
      },
      {
        "find": "Barbarian\t30",
        "replace": "columns",
         "columns": [
          {"col": 42, "val": barbAddSkill}
          ]
      },
      {
        "find": "Druid\t15",
        "replace": "columns",
         "columns": [
          {"col": 40+skillOffset, "val": addSkill}
          ]
      },
      {
        "find": "Assassin\t20",
        "replace": "columns",
         "columns": [
          {"col": 41+skillOffset, "val": addSkill}
          ]
      }
    ]

    var charstats_txt_lines = targetFiles['charstats.txt']

    for (index in charstats_txt_ops) {
      op = charstats_txt_ops[index]
      charstats_txt_lines.filter(function(line, index) {
        if (line.indexOf(op.find) >= 0) {
          charstats_txt_lines[index] = modder.replaceColumns(line, op.columns)
        }
      })
    }
  }
}

modder.currentPatch = function applyPatch(mod, targetFiles) {
  mod_side_kick1.update_skills_txt(mod, targetFiles)
  mod_side_kick1.update_skilldesc_txt(mod, targetFiles)
  mod_side_kick1.update_pettype_txt(mod, targetFiles)
  mod_side_kick1.update_charstats_txt(mod, targetFiles)
}
