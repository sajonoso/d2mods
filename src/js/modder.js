// Main library to apply mods to source text files
import * as patches from '../mods/modlist.js'

const prnt = console.log


const modder = {
  TARGET_FILES: {},
  MOD_TARGET: '',

  isD2R: function() {
    return modder.MOD_TARGET === 'd2r'
  },

  // Checks if file exists in the target file list.  If not copy from the source
  ensureHasFile: function (filename, sourceFiles, targetFiles) {
    if (!targetFiles[filename]) {
      const fileSource = modder.MOD_TARGET == 'd2r' ? "mods/source_txt.r/" : "mods/source_txt/"
      const fileContent = sourceFiles[fileSource + filename];
      if (!fileContent) return false;
      const fileLines = fileContent.split(fileContent.indexOf("\r\n") > 0 ? "\r\n" : "\n");

      targetFiles[filename] = fileLines.filter(function (line) {
        return line.trim();
      })
    }

    return true;
  },

  // get a function to return the column index by name
  get_column_index: function (targetFiles, fileName) {
    const fileLines = targetFiles[fileName]
    const COLUMN_NAMES = fileLines[0];
    const COLUMNS = COLUMN_NAMES.split('\t');
    function col(name) { return COLUMNS.indexOf(name) }
    return col;
  },

  // get the maximum value of a column
  get_max_column: function (lines, column) {
    const columnNames = lines[0].split('\t')
    const INDEX_ID = columnNames.indexOf(column);

    var maxID = 0;
    for (const index in lines) {
      if (index > 0) {
        const fields = lines[index].split('\t')
        const lineID = parseInt(fields[INDEX_ID])
        if (lineID > maxID) maxID = lineID
      };
    }

    return maxID;
  },

  find_row_value: function (lines, columnName, value) {
    const columnNames = lines[0].split('\t')
    const columnIndex = columnNames.indexOf(columnName)

    for (var idx in lines) {
      if (idx > 0) {
        const fields = lines[idx].split('\t')
        if (fields[columnIndex] === value) return idx;
      }
    }

    return -1;
  },

  replaceColumns: function (originalLine, replaceArray, col) {
    const fields = originalLine.split('\t');
    var entry = null;
    for (var i in replaceArray) {
      entry = replaceArray[i];
      if (typeof (entry.col) === 'number') {
        fields[entry.col] = entry.val;
      } else if (typeof (entry.col) === 'string') {
        fields[col(entry.col)] = entry.val;
      }
    }
    return fields.join('\t');
  },

  applySearchAndReplace: function (searchOps, fileName, targetFiles) {
    var fileLines = targetFiles[fileName]
    const col = modder.get_column_index(targetFiles, fileName)

    for (const key in searchOps) {
      const op = searchOps[key]
      fileLines.filter(function (line, index) {
        if (line.indexOf(op.find) >= 0) {
          fileLines[index] = op.replace !== "columns" ? op.replace :
            modder.replaceColumns(line, op.columns, col)
        }
      })
    }
  },

  fileSearch: function (searchList, sourceFiles, targetFiles) {
    for (const file in searchList) {
      if (!modder.ensureHasFile(file, sourceFiles, targetFiles)) {
        prnt('Error: file does not exist ' + file);
        return;
      }
      modder.applySearchAndReplace(searchList[file], file, targetFiles);
    }
  },

  fileAdd: function (addList, sourceFiles, targetFiles) {
    for (const file in addList) {
      if (!modder.ensureHasFile(file, sourceFiles, targetFiles)) {
        prnt('Error: file does not exist ' + file);
        return;
      }
      const content = targetFiles[file];
      const newContent = content.concat(addList[file]);
      targetFiles[file] = newContent;
    }
  },

  fileCopy: function (mod, copyList, sourceFiles, targetFiles) {
    for (const index in copyList) {
      const source = "mods/" + mod.name + "/" + copyList[index].source;
      const target = copyList[index].destination;
      targetFiles[source] = target;
    }
  },

  applyPatch: function (mod, patchJSON, sourceFiles, targetFiles) {
    const patchOps = JSON.parse(patchJSON);

    if (patchOps.search)
      modder.fileSearch(patchOps.search, sourceFiles, targetFiles);
    if (patchOps.add) modder.fileAdd(patchOps.add, sourceFiles, targetFiles);
    if (patchOps.copy)
      modder.fileCopy(mod, patchOps.copy, sourceFiles, targetFiles);
  },

  applyPatchCode: function (mod, patchJS, sourceFiles, targetFiles, targetZip) {

    if (typeof (patches[mod.name]) === 'function') {
      const currentPatch = patches[mod.name]
      currentPatch(mod, targetFiles, sourceFiles, targetZip)
    }
  },

  loadAndApplyMod: function (mod, sourceFiles, targetFiles, targetZip) {
    const patchData = sourceFiles["mods/" + mod.name + "/patch.json"];
    const patchCode = sourceFiles["mods/" + mod.name + "/patch.js"];

    prnt("Applying mod:" + mod.name);

    if (patchData) modder.applyPatch(mod, patchData, sourceFiles, targetFiles);
    if (typeof (patches[mod.name]) === 'function') modder.applyPatchCode(mod, patchCode, sourceFiles, targetFiles, targetZip);
  },

  ApplyMods: function (modSettings, sourceFiles, targetZip) {
    const targetFiles = modder.TARGET_FILES
    modder.MOD_TARGET = modSettings.target

    modSettings.enabledMods.forEach(function (mod) {
      modder.loadAndApplyMod(mod, sourceFiles, targetFiles, targetZip);
    });

    // compress target files
    for (const filename in targetFiles) {
      if (filename.indexOf("mods/") >= 0) {
        targetZip.file(targetFiles[filename], sourceFiles[filename]);
      } else {
        const targetPath = modder.MOD_TARGET === 'd2r' ? 'mods/diymod/diymod.mpq/data' : 'data';
        targetZip.file(targetPath + "/global/excel/" + filename, targetFiles[filename].join("\r\n") + "\r\n");
      }
    }
  }
};


export default modder;