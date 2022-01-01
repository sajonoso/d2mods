var mod_2hs_merc = {
  update_hireling_txt: function (mod, targetFiles) {
    var fileLines = targetFiles['hireling.txt']

    var COLUMN_NAMES = fileLines[0];
    var COLUMNS = COLUMN_NAMES.split('\t');

    var maxID = modder.get_max_column(fileLines, 'Id')

    var INDEX_HIRELING = COLUMNS.indexOf('Hireling')
    var INDEX_SUBTYPE = COLUMNS.indexOf('SubType')
    var INDEX_ID = COLUMNS.indexOf('Id')
    var INDEX_CLASS = COLUMNS.indexOf('Class')
    var INDEX_HIREDESC = COLUMNS.indexOf('HireDesc')

    // copy and change existing lines to new list
    var firstID = 0;
    var newLines = [];
    for (var index in fileLines) {
      if (index > 0) {
        var fields = fileLines[index].split('\t');

        if (fields[INDEX_HIRELING] == 'Barbarian') {
          if (firstID === 0) firstID = parseInt(fields[INDEX_ID])
          var newSubtype = fields[INDEX_SUBTYPE].replace('1', '2')
          fields[INDEX_SUBTYPE] = newSubtype
          fields[INDEX_ID] = maxID + 1 + parseInt(fields[INDEX_ID]) - firstID
          fields[INDEX_CLASS] = '560'
          fields[INDEX_HIREDESC] = 'comb';
          
          var updatedLine = fields.join('\t')
          newLines.push(updatedLine)
        };
      };
    };

    // append new list to existing content
    for (var index2 in newLines) {
      fileLines = fileLines.concat(newLines[index2])
    };

    targetFiles['hireling.txt'] = fileLines;
  },

  update_pettype_txt: function (mod, targetFiles) {
    var fileLines = targetFiles['pettype.txt']

    const op = {
      "find": "hireable\t7\t\t1\t1",
      "replace": "columns",
      "columns": [
        { "col": 19, "val": '560', "desc": "mclass4" },
        { "col": 20, "val": 'barbhirable_icon', "desc": "micon4" },
      ]
    }

    fileLines.filter(function (line, index) {
      if (line.indexOf(op.find) >= 0) {
        fileLines[index] = op.replace !== "columns" ? op.replace :
          modder.replaceColumns(line, op.columns)
      }
    })
  }
}


modder.currentPatch = function applyPatch(mod, targetFiles) {
  mod_2hs_merc.update_hireling_txt(mod, targetFiles)
  mod_2hs_merc.update_pettype_txt(mod, targetFiles)
}
