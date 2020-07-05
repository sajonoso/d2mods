var mod_side_kick2 = {
  update_skills_txt: function (mod, targetFiles) {
    var skills_txt_op = {
      "find": "Grim Ward\t150\tbar\tgrim ward",
      "replace": "Grim Ward\t150\tbar\tgrim ward\t\t57\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tarmorclass\tstat('armorclass'.accr)\ttohit\tstat('tohit'.accr)\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tmaxhp\tstat('maxhp'.accr)\titem_normaldamage\tmax(stat('maxdamage'.accr),stat('secondary_maxdamage'.accr))\thpregen\t164\titem_crushingblow\t25\t\t\t\t\tact5hire1\tsidekick2\t1\tNU\tnatural resistance\t1+min(ulvl/3,19)\t\t\t\t\t\t\t\t\t27\t\t\tnecromancer_golem_cast\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t1\t5\t\tnone\t\t\t\t\t\t\t\t\t\t\t\tSC\tSC\tS1\t\t\t\t\t4\t\t\t\t\t\t\t\t\t1\t\t\t\t\t\t\t\t\t\t\t\t1\t20\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t1\t8\t5\t0\t1\t1\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t1\t\t\t\t\t\t\t\t8\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t384\t3000"
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
    switch (mod.options.summonType) {
      case 'rogue':
        columns[60] = 'roguehire' // summon type
        columns[66] = 'pierce' // summon passive skill 2
        columns[67] = '5'
        columns[74] = '29' // summon umod - multishot
        break;
      case 'guard':
        columns[60] = 'act2hire' // summon type
        columns[66] = 'sanctuary' // summon passive skill 2
        columns[67] = '1'
        columns[74] = '1' // summon umod - random name
        break;
      case 'mage':
        columns[56] = 'item_fasterblockrate'
        columns[57] = '50'
        columns[60] = 'act3hire' // summon type
        columns[74] = '7' // summon umod - random cast amplify damage
        break;
      case 'barb':
        // default no change required
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
        { "col": 36, "val": "stat('maxhp'.accr)/256", "desc": "Value/formula" },
  
        { "col": 38, "val": "5", "desc": "S1C1" },
        { "col": 39, "val": "StrSkill21", "desc": "Defense:" },
        { "col": 41, "val": "stat('armorclass'.accr)", "desc": "Value/formula" },
  
        { "col": 43, "val": "5", "desc": "S1C1" },
        { "col": 44, "val": "StrSkill4", "desc": "Damage:" },
        { "col": 46, "val": "max(stat('maxdamage'.accr),stat('secondary_maxdamage'.accr))", "desc": "Value/formula" },
  
        { "col": 48, "val": "5", "desc": "S1C1" },
        { "col": 49, "val": "StrSkill22", "desc": "Attack:" },
        { "col": 51, "val": "stat('tohit'.accr)", "desc": "Value/formula" },

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
      "find": "sidekick2\t24\t",
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

    const secondSkill = 1
  
    const charstats_txt_ops = [
      {
        "find": "Amazon\t20",
        "replace": "columns",
         "columns": [
           {"col": 40+secondSkill, "val": addSkill}
          ]
      },
      {
        "find": "Sorceress\t10",
        "replace": "columns",
         "columns": [
           {"col": 40+secondSkill, "val": addSkill}
          ]
      },
      {
        "find": "Necromancer\t15",
        "replace": "columns",
         "columns": [
          {"col": 40+secondSkill, "val": addSkill}
          ]
      },
      {
        "find": "Paladin\t25",
        "replace": "columns",
         "columns": [
          {"col": 40+secondSkill, "val": paladinAddSkill}
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
          {"col": 40+secondSkill, "val": addSkill}
          ]
      },
      {
        "find": "Assassin\t20",
        "replace": "columns",
         "columns": [
          {"col": 41+secondSkill, "val": addSkill}
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
  mod_side_kick2.update_skills_txt(mod, targetFiles)
  mod_side_kick2.update_skilldesc_txt(mod, targetFiles)
  mod_side_kick2.update_pettype_txt(mod, targetFiles)
  mod_side_kick2.update_charstats_txt(mod, targetFiles)
}
