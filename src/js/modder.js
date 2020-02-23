// Library to apply mods to source text files

var modder = {
  getModOptions: function (modId) {

    if (modId === 'multivalkyrie') {
      const maxValk = ID('multivalkyrie_limit').value
      return { maxValk: maxValk }
    }

    if (modId === 'side_kick') {
      const summonSkill = document.querySelector('input[name=sidekick_skill]:checked').value
      const summonType = document.querySelector('input[name=sidekick_type]:checked').value
      return { summonSkill: summonSkill, summonType: summonType }
    }

    return {};
  },

  getOptions: function () {
    const allMods = document.querySelectorAll('.mod-option')

    var enabled_patches = [];
    allMods.forEach(function (mod) {
      if (mod.getElementsByTagName('input')[0].checked) {
        const modOptions = modder.getModOptions(mod.id)
        enabled_patches.push({ name: mod.id, options: modOptions })
      }
    })

    return enabled_patches;
  },

  summonBarb_add_CharStats_skill: function(mod, searchOperation) {
    var customSkill = 'Grim Ward'
    switch (mod.options.summonSkill) {
      case 'findpotion':
        customSkill = 'Find Potion'; break;
      case 'sacrifice':
        customSkill = 'Sacrifice'; break;
    }

    for (var i in searchOperation) {
      searchOperation[i].columns[0].val = customSkill;
    }

    return searchOperation;
  },

  getModSearchVariation_summonBarb: function (mod, searchOperation, file_name) {
    // for default options don't modify search operations
    if (mod.options.summonSkill === 'grimward' &&
      mod.options.summonType === 'barb') return searchOperation

    // Change Charstat.txt skill
    if ('CharStats_txt' === file_name) {
      return modder.summonBarb_add_CharStats_skill(mod, searchOperation)
    }

    var SKILLS_TXT_LINE = 'Grim Ward\t150\tbar\tgrim ward'
    if (searchOperation[0].find === SKILLS_TXT_LINE) {
      var originalline = searchOperation[0].replace

      if (mod.options.summonSkill === 'findpotion') {
        var newSkillMarker = 'Find Potion\t131\tbar\tfind potion'
        searchOperation[0].find = newSkillMarker
        searchOperation[0].replace = originalline.replace(SKILLS_TXT_LINE, newSkillMarker)
      } else if (mod.options.summonSkill === 'sacrifice') {
        var newSkillMarker = 'Sacrifice\t96\tpal\tsacrifice'
        searchOperation[0].find = newSkillMarker
        searchOperation[0].replace = originalline.replace(SKILLS_TXT_LINE, newSkillMarker)
      }

      var columns = searchOperation[0].replace.split('\t')
        // columns[54] = 'item_crushingblow'
        // columns[55] = '25'

      if (mod.options.summonType === 'rogue') {
        // columns[56] = 'item_freeze'
        // columns[57] = '10'
        columns[60] = 'roguehire' // summon type
        columns[66] = 'pierce' // summon passive skill 2
        columns[67] = '5'
        columns[74] = '29' // summon umod - multishot
      }

      if (mod.options.summonType === 'guard') {
        columns[60] = 'act2hire' // summon type
        columns[66] = 'sanctuary' // summon passive skill 2
        columns[67] = '1'
        columns[74] = '1' // summon umod - random name
      }

      if (mod.options.summonType === 'mage') {
        columns[56] = 'item_fasterblockrate'
        columns[57] = '50'
        columns[60] = 'act3hire' // summon type
        columns[74] = '7' // summon umod - random cast amplify damage
      }

      searchOperation[0].replace = columns.join('\t')
    }

    var MONSTATS_TXT_LINE = 'act3hire\t359\tact3hire'
    if (searchOperation[0].find === MONSTATS_TXT_LINE) {
      if (mod.options.summonType === 'mage') {
        searchOperation[0].columns = [{ "col": 9, "val": "NecroPet", "desc": "Change AI type" }]
      }
    }

    var SKILLDESC_TXT_LINE = 'grim ward\t3\t5'
    if (searchOperation[0].find === SKILLDESC_TXT_LINE) {
      if (mod.options.summonSkill === 'findpotion') {
        searchOperation[0].find = 'find potion\t3\t1'
      } else if (mod.options.summonSkill === 'sacrifice') {
        searchOperation[0].find = 'sacrifice\t1\t1'
      }
    }

    return searchOperation
  },

  getModAddVariation_summonBarb: function (mod, addOperation) {
    // for default options don't modify add operations
    if (mod.options.summonSkill === 'grimward' &&
      mod.options.summonType === 'barb') return addOperation

    var PETTYPE_TXT_LINE = "sidekick1\t23\t\t0\t1\t\t1\t1\t1\tBarbarian\t1\t1\tbarbhirable_icon\t\t\t\t\t\t\t\t\t0"
    if (addOperation[0] && addOperation[0].indexOf(PETTYPE_TXT_LINE) >= 0) {
      var columns = PETTYPE_TXT_LINE.split('\t')

      if (mod.options.summonType === 'guard') {
        columns[9] = 'Guard'
        columns[12] = 'act2hireableicon'
        return [columns.join('\t')]
      }

      if (mod.options.summonType === 'mage') {
        columns[9] = 'Mage'
        columns[12] = 'act3hireableicon'
        return [columns.join('\t')]
      }

      if (mod.options.summonType === 'rogue') {
        columns[9] = 'RogueScout'
        columns[12] = 'rogueicon'
        return [columns.join('\t')]
      }
    }

    // Note must be first add operation in side_kick.json file for cubemain.txt
    var CUBEMAIN_TXT_LINE = "1 key + 1 boots -> Small charm (+1 grim ward)"
    if (addOperation[0] && addOperation[0].indexOf(CUBEMAIN_TXT_LINE) >= 0) {
      var columns = addOperation[0].split('\t')

      if (mod.options.summonSkill === 'findpotion') {
        columns[0] = columns[0].replace('grim ward', 'find potion')
        columns[23] = '131' // skillId of find potion
        addOperation[0] = columns.join('\t');
        // return [columns.join('\t')]
      }

      if (mod.options.summonSkill === 'sacrifice') {
        columns[0] = columns[0].replace('grim ward', 'sacrifice')
        columns[23] = '96' //skillId of sacrifice
        addOperation[0] = columns.join('\t');
        // return [columns.join('\t')]
      }
    }

    return addOperation
  },

  getModSearchVariation: function (mod, searchOperation, file_name) {
    if (mod.name === 'multivalkyrie') {
      if (searchOperation[0].find === 'Valkyrie\t32\tama\tvalkyrie') {
        searchOperation[0].columns[0].val = mod.options.maxValk;
      };
    };

    if (mod.name === 'side_kick') {
      return modder.getModSearchVariation_summonBarb(mod, searchOperation, file_name)
    }

    return searchOperation;
  },

  getModAddVariation: function (mod, addOperation) {
    if (mod.name === 'side_kick') {
      return modder.getModAddVariation_summonBarb(mod, addOperation)
    }

    return addOperation
  },

  loadPatch: function (mod, sourceFiles, L_MODIFY_FILES, L_COPY_FILES) {
    const patchFolder = mod.name
    // var jsonContent = fs.readFileSync(patchFolder + '/patch.json', 'utf-8');
    const jsonContent = sourceFiles['mods/' + patchFolder + '/patch.json']
    var patch = JSON.parse(jsonContent);
    var currentValues;

    // add search and replace operations
    if (patch.search) {
      for (file_keys in patch.search) {
        if (typeof (L_MODIFY_FILES[file_keys]) !== 'object') L_MODIFY_FILES[file_keys] = { search: [], add: [] };
        currentValues = L_MODIFY_FILES[file_keys]['search'];
        var searchOperations = patch.search[file_keys];

        var newSearchOperations = (Object.keys(mod.options)).length === 0 ? searchOperations :
          modder.getModSearchVariation(mod, searchOperations, file_keys)

        L_MODIFY_FILES[file_keys]['search'] = currentValues.concat(newSearchOperations);
      }
    }

    // add append to file operations
    if (patch.add) {
      for (file_keys in patch.add) {
        if (typeof (L_MODIFY_FILES[file_keys]) !== 'object') L_MODIFY_FILES[file_keys] = { search: [], add: [] };
        currentValues = L_MODIFY_FILES[file_keys]['add'];
        var addOperations = patch.add[file_keys];

        var newAddOperations = (Object.keys(mod.options)).length === 0 ? addOperations :
          modder.getModAddVariation(mod, addOperations)

        L_MODIFY_FILES[file_keys]['add'] = currentValues.concat(newAddOperations);
      }
    }

    // add copy operations
    if (patch.copy) {
      var fileOp;
      for (var i in patch.copy) {
        fileOp = patch.copy[i];
        L_COPY_FILES.push({
          source: patchFolder + '\\' + fileOp.source,
          destination: fileOp.destination
        });
      };
    }

  },

  loadMods: function (enabled_mods, sourceFiles) {
    var copy_files = []
    var modify_files = {}

    enabled_mods.forEach(function (mod) {
      modder.loadPatch(mod, sourceFiles, modify_files, copy_files)
    })

    return { modify_files: modify_files, copy_files: copy_files }
  },

  copyFiles: function (sourceFiles, targetZip, CopyOps) {
    CopyOps.forEach(function (CopyOp) {
      const SoureFileName = 'mods/' + CopyOp.source.toLowerCase().replace(/\\/g, '/')
      const TargetFileName = CopyOp.destination.replace(/\\/g, '/')

      targetZip.file(TargetFileName, sourceFiles[SoureFileName])
    })
  },

  matchLine: function (line, srarray) {
    for (i = 0; i < srarray.length; i++) {
      if (line.indexOf(srarray[i].find) >= 0) return i;
    }
    return -1;
  },

  replaceColumns: function (originalLine, replaceArray) {
    var fields = originalLine.split('\t');
    var entry = null;
    for (var i in replaceArray) {
      entry = replaceArray[i];
      if (typeof (entry.col) === 'number') fields[entry.col] = entry.val;
    }
    return fields.join('\t');
  },

  applyUpdates: function (sourceFiles, targetZip, ModifyOps) {

    for (filekey in ModifyOps) {
      var realFileName = filekey.replace('_', '.') // .toLowerCase()

      var CurrentFileContents = sourceFiles['mods/source_txt/' + realFileName.toLowerCase()]
      const CurrentFileLines = CurrentFileContents.indexOf("\r\n") > 0 ?
        CurrentFileContents.split("\r\n") : CurrentFileContents.split("\n")

      var NewFileContents = "";

      var searchList = ModifyOps[filekey]['search'];
      var lineout = '';
      CurrentFileLines.forEach(function (line) {
        j = modder.matchLine(line, searchList);
        lineout = (j >= 0) ? (searchList[j].replace) : line;
        if (lineout === 'columns') lineout = modder.replaceColumns(line, searchList[j].columns);
        NewFileContents += (lineout + "\r\n");
      })

      NewFileContents = NewFileContents.substr(0, NewFileContents.length - 2)

      // append lines to file
      var addList = ModifyOps[filekey]['add'];
      for (i = 0; i < addList.length; i++) {
        NewFileContents += (addList[i] + "\r\n")
      }

      TargetFileName = 'data/global/excel/' + realFileName
      targetZip.file(TargetFileName, NewFileContents)
    }
  },

}
