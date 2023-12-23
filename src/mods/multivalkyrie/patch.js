import modder from '../../js/modder.js'

var mod_multivalkyrie = {
  update_skills_txt: function (mod, targetFiles) {
    // get file headers and offsets
    const col = modder.get_column_index(targetFiles, 'skills.txt')

    // prepare file operation
    const oplist = [{
      "find": "Valkyrie\t32",
      "replace": "columns",
      "columns": [
        { "col": col('petmax'), "val": mod.options.maxValk, "desc": "Number of valkyries allowed - default: 1" },
      ]
    }]

    // apply file operation
    modder.applySearchAndReplace(oplist, 'skills.txt', targetFiles);
  },

  update_pettype_txt: function (mod, targetFiles) {
    // get file headers and offsets
    var fileLines = targetFiles['pettype.txt']
    var COLUMN_NAMES = fileLines[0];
    var COLUMNS = COLUMN_NAMES.split('\t');
    function col(name) { return COLUMNS.indexOf(name) }

    // find row to update
    const rowToUpdate = modder.find_row_value(fileLines, 'pet type', 'valkyrie')

    // prepare file operation
    const oplist = [{
      "find": fileLines[rowToUpdate],
      "replace": "columns",
      "columns": [
        { "col": col('icontype'), "val": mod.options.maxValk, "desc": "Number of valkyries allowed - default: 1" },
      ]
    }]

    // apply file operation
    modder.applySearchAndReplace(oplist, 'pettype.txt', targetFiles);
  }
}

export default function applyPatch(mod, targetFiles) {
  mod_multivalkyrie.update_skills_txt(mod, targetFiles)
  mod_multivalkyrie.update_pettype_txt(mod, targetFiles)
}
