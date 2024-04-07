// Main library to apply mods to source text files
import * as patches from '../mods/modlist.mjs'

const println = console.log

const modder = {
  TARGET_FILES: {},
  D2_VERSION: '',

  isD2R: function () {
    return modder.D2_VERSION === 'd2r'
  },

  addToTarget: function (targetFiles, fileName, fileContent) {
    if (!targetFiles[fileName]) {
      targetFiles[fileName] = fileContent
    } else {
      throw new Error('File already in target')
    }
  },

  // Checks if file exists in the target file list.  If not copy from the source
  ensureHasFile: function (filename, targetFiles) {
    if (!targetFiles[filename]) throw new Error(`ERROR: ensureHasFile - ${filename} does not exist in targetFiles`)

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

  fileSearch: function (searchList, targetFiles) {
    for (const file in searchList) {
      if (!modder.ensureHasFile(file, targetFiles)) {
        println('Error: file does not exist ' + file);
        return;
      }
      modder.applySearchAndReplace(searchList[file], file, targetFiles);
    }
  },

  fileAdd: function (addList, targetFiles) {
    // should match d2zip_generator.mjs :: createZipFile
    const eol = '\r\n'

    for (const file in addList) {
      if (!modder.ensureHasFile(file, targetFiles)) {
        println('Error: file does not exist ' + file);
        return;
      }
      if (addList[file].length > 0) {
        const content = targetFiles[file];
        const newContent = content.concat(addList[file]);
        targetFiles[file] = newContent;
      }
    }
  },

  fileCopy: function (mod, copyList, targetFiles) {
    for (const index in copyList) {
      const source = `mods/${mod.name}/${copyList[index].source}`;
      targetFiles[`*${source}`] = { source: source, destination: copyList[index].destination }
    }
  },

  applyPatch: function (mod, patchJSON, targetFiles) {
    // const patchOps = JSON.parse(patchJSON);
    const patchOps = patchJSON;
    // println('>> Applying patch', patchOps)

    if (patchOps.search) modder.fileSearch(patchOps.search, targetFiles);
    if (patchOps.add) modder.fileAdd(patchOps.add, targetFiles);
    if (patchOps.copy) modder.fileCopy(mod, patchOps.copy, targetFiles);
  },

  loadAndApplyMod: function (mod, modActions, targetFiles) {
    const patchData = modActions[mod.name]
    const patchCode = typeof (patches[mod.name]) === 'function' ? patches[mod.name] : null

    println("Applying mod:" + mod.name);

    if (patchData) modder.applyPatch(mod, patchData, targetFiles);
    if (patchCode) patchCode(mod, targetFiles);
  },

  ApplyMods: function (modSettings, modActions, targetFiles) {
    modSettings.enabledMods.forEach(function (mod) {
      modder.loadAndApplyMod(mod, modActions, targetFiles);
    });
  }
};


export default modder;