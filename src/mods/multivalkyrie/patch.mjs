import modder from '../../js/modder.mjs'

var mod_multivalkyrie = {
  update_skills_txt: function (mod, targetFiles) {
    // get file headers and offsets
    var fileLines = targetFiles['skills.txt']
    const col = modder.get_column_index(targetFiles, 'skills.txt')

    // find row to update
    const rowToUpdate = modder.find_row_value(fileLines, 'skill', 'Valkyrie')
    const lineData = fileLines[rowToUpdate].split('\t')
    lineData[col('petmax')] = mod.options.maxValk

    fileLines[rowToUpdate] = lineData.join('\t')
  },

  update_pettype_txt: function (mod, targetFiles) {
    // get file headers and offsets
    var fileLines = targetFiles['pettype.txt']
    const col = modder.get_column_index(targetFiles, 'pettype.txt')

    // find row to update
    const rowToUpdate = modder.find_row_value(fileLines, 'pet type', 'valkyrie')
    const lineData = fileLines[rowToUpdate].split('\t')
    lineData[col('icontype')] = mod.options.maxValk > 1 ? '2' : '1';  // Number of valkyries allowed  - default: 1

    fileLines[rowToUpdate] = lineData.join('\t')
  }
}

export default function applyPatch(mod, targetFiles) {
  mod_multivalkyrie.update_skills_txt(mod, targetFiles)
  mod_multivalkyrie.update_pettype_txt(mod, targetFiles)
}
