// Library to apply mods to source text files

var modder = {
  getModOptions: function(modId) {
    if (modId === "multivalkyrie") {
      const maxValk = ID("multivalkyrie_limit").value;
      return { maxValk: maxValk };
    }

    if (modId === "side_kick1") {
      const summonSkill = document.querySelector(
        "#side_kick1 input[name=sidekick1_skill]:checked"
      ).value;
      const summonType = document.querySelector(
        "#side_kick1 input[name=sidekick1_type]:checked"
      ).value;
      return { summonSkill: summonSkill, summonType: summonType };
    }

    if (modId === "side_kick2") {
      const summonSkill = document.querySelector(
        "#side_kick2 input[name=sidekick2_skill]:checked"
      ).value;
      const summonType = document.querySelector(
        "#side_kick2 input[name=sidekick2_type]:checked"
      ).value;
      return { summonSkill: summonSkill, summonType: summonType };
    }

    return {};
  },

  getOptions: function() {
    const allMods = document.querySelectorAll(".mod-option");

    var enabled_patches = [];
    allMods.forEach(function(mod) {
      if (mod.getElementsByTagName("input")[0].checked) {
        const modOptions = modder.getModOptions(mod.id);
        enabled_patches.push({ name: mod.id, options: modOptions });
      }
    });

    return enabled_patches;
  },

  ensureHasFile: function(filename, sourceFiles, targetFiles) {
    if (!targetFiles[filename]) {
      //DEBUG console.log('sourceFiles984:', "mods/source_txt/" + filename)
      //DEBUG console.log('sourceFiles777:', sourceFiles["mods/source_txt/" + filename])
       const fileContent = sourceFiles["mods/source_txt/" + filename];
       const fileLines = fileContent.split(fileContent.indexOf("\r\n") > 0 ? "\r\n" : "\n");
       
       targetFiles[filename] = fileLines.filter(function(line) {
         return line.trim();
       })
    }
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

  applySearchAndReplace: function(searchOps, fileIndex, targetFiles) {
    // console.log('applySearchAndReplace:', fileIndex)
    // console.log('searchops: ', searchOps)

    var fileLines = targetFiles[fileIndex]
    for (key in searchOps) {
      const op = searchOps[key]
      fileLines.filter(function(line, index) {
        if (line.indexOf(op.find) >= 0) {
          fileLines[index] = op.replace !== "columns" ? op.replace :
            modder.replaceColumns(line, op.columns)
        }
      })
    }
  },

  fileSearch: function(searchList, sourceFiles, targetFiles) {
    for (file in searchList) {
      //DEBUG console.log("Search:" + file);
      modder.ensureHasFile(file, sourceFiles, targetFiles);
      modder.applySearchAndReplace(searchList[file], file, targetFiles);
    }
  },

  fileAdd: function(addList, sourceFiles, targetFiles) {
    for (file in addList) {
      modder.ensureHasFile(file, sourceFiles, targetFiles);
      const content = targetFiles[file];
      const newContent = content.concat(addList[file]);
      targetFiles[file] = newContent;
    }
  },

  fileCopy: function(mod, copyList, sourceFiles, targetFiles) {
    for (index in copyList) {
      const source = "mods/" + mod.name + "/" + copyList[index].source;
      const target = copyList[index].destination;
      targetFiles[source] = target;

      //DEBUG console.log('COPY: ' + source  + ' -> ' + target)
    }
  },

  applyPatch: function(mod, patchJSON, sourceFiles, targetFiles) {
    const patchOps = JSON.parse(patchJSON);

    if (patchOps.search)
      modder.fileSearch(patchOps.search, sourceFiles, targetFiles);
    if (patchOps.add) modder.fileAdd(patchOps.add, sourceFiles, targetFiles);
    if (patchOps.copy)
      modder.fileCopy(mod, patchOps.copy, sourceFiles, targetFiles);
  },

  applyPatchCode: function(mod, patchJS, sourceFiles, targetFiles) {
    eval(patchJS)
    if (typeof(modder.currentPatch) === 'function') modder.currentPatch(mod, targetFiles)
  },

  loadAndApplyMod: function(mod, sourceFiles, targetFiles) {
    const patchData = sourceFiles["mods/" + mod.name + "/patch.json"];
    const patchCode = sourceFiles["mods/" + mod.name + "/patch.js"];

    console.log("Applying mod:" + mod.name);

    if (patchData) modder.applyPatch(mod, patchData, sourceFiles, targetFiles);
    if (patchCode) modder.applyPatchCode(mod, patchCode, sourceFiles, targetFiles);
  },

  ApplyMods: function(enabled_mods, sourceFiles, targetZip) {
    var targetFiles = {};

    enabled_mods.forEach(function(mod) {
      modder.loadAndApplyMod(mod, sourceFiles, targetFiles);
    });

    window.TARGET_FILES = targetFiles;

    // compress target files
    for (filename in targetFiles) {
      if (filename.indexOf("mods/") >= 0) {
        targetZip.file(targetFiles[filename], sourceFiles[filename]);
      } else {
        targetZip.file("data/global/excel/" + filename, targetFiles[filename].join("\r\n") + "\r\n");
      }
    }
  }
};
