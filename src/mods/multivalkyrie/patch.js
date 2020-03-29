modder.currentPatch = function applyPatch(mod, targetFiles) {
  var fileLines = targetFiles['skills.txt']

  const op = {
    "find": "Valkyrie\t32\tama\tvalkyrie",
    "replace": "columns",
    "columns": [
      { "col": 62, "val": mod.options.maxValk, "desc": "Number of valkyries allowed - default: 1" },
    ]
  }

  fileLines.filter(function(line, index) {
    if (line.indexOf(op.find) >= 0) {
      fileLines[index] = op.replace !== "columns" ? op.replace :
        modder.replaceColumns(line, op.columns)
    }
  })
}
