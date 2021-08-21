modder.currentPatch = function applyPatch(mod, targetFiles) {
  var fileLines = targetFiles['levels.txt']

  var LEVELS_COLUMN_NAMES = fileLines[0];
  var LEVELS_COLUMNS = LEVELS_COLUMN_NAMES.split('\t');

  var INDEX_MONDEN = LEVELS_COLUMNS.indexOf('MonDen')
  var INDEX_MONDEN_N = LEVELS_COLUMNS.indexOf('MonDen(N)')
  var INDEX_MONDEN_H = LEVELS_COLUMNS.indexOf('MonDen(H)')

  var multiplier = mod.options.multiplier;

  fileLines.filter(function (line, index) {
    if (index > 0) {
      var fields = fileLines[index].split('\t');
      var o_monden = fields[INDEX_MONDEN];
      var o_monden_n = fields[INDEX_MONDEN_N];
      var o_monden_h = fields[INDEX_MONDEN_H];

      fields[INDEX_MONDEN] = o_monden * multiplier
      fields[INDEX_MONDEN_N] = o_monden_n * multiplier
      fields[INDEX_MONDEN_H] = o_monden_h * multiplier

      fileLines[index] = fields.join('\t');
    }
  })
}
