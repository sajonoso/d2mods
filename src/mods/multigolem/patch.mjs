import modder from '../../js/modder.mjs'


const mod_multigolem = {
  clear_unused_pettype_fields: function (line, col) {
    line[col('mclass2')] = ''
    line[col('micon2')] = ''
    line[col('mclass3')] = ''
    line[col('micon3')] = ''
  },

  update_pettype_txt: function (mod, targetFiles) {
    var fileLines = targetFiles['pettype.txt']
    const col = modder.get_column_index(targetFiles, 'pettype.txt')

    // find original Golem row to copy
    const rowToCopyIndex = modder.find_row_value(fileLines, 'pet type', 'golem')
    const originalLine = fileLines[rowToCopyIndex]

    // Change original row to handle iron golem only. (Iron golem saving is hard coded to this row)
    const pettype_txt_ops = [
      {
        "find": "golem\t",
        "replace": "columns",
        "columns": [
          { "col": col('pet type'), "val": 'irongolem' },
          { "col": col('baseicon'), "val": 'metalgolumicon' },
          { "col": col('mclass1'), "val": '291' },
          { "col": col('micon1'), "val": 'metalgolumicon' },
          { "col": col('mclass2'), "val": '' },
          { "col": col('micon2'), "val": '' },
          { "col": col('mclass3'), "val": '' },
          { "col": col('micon3'), "val": '' }
        ]
      }
    ]
    modder.applySearchAndReplace(pettype_txt_ops, 'pettype.txt', targetFiles);

    // Add new rows for the other golem types
    const maxID = modder.get_max_column(fileLines, 'idx');

    // Add clay golem
    const clayFields = originalLine.split("\t")
    clayFields[col('pet type')] = 'claygolem'
    if (!modder.isD2R()) clayFields[col('idx')] = maxID + 1
    clayFields[col('baseicon')] = 'earthgolumicon'
    clayFields[col('mclass1')] = '289'
    clayFields[col('micon1')] = 'earthgolumicon'
    mod_multigolem.clear_unused_pettype_fields(clayFields, col)
    const clayGolemLine = clayFields.join("\t")

    // Add blood golem
    const bloodFields = originalLine.split("\t")
    bloodFields[col('pet type')] = 'bloodgolem'
    if (!modder.isD2R()) bloodFields[col('idx')] = maxID + 2
    bloodFields[col('baseicon')] = 'bloodgolumicon'
    bloodFields[col('mclass1')] = '290'
    bloodFields[col('micon1')] = 'bloodgolumicon'
    mod_multigolem.clear_unused_pettype_fields(bloodFields, col)
    const bloodGolemLine = bloodFields.join("\t")

    // Add fire golem
    const fireFields = originalLine.split("\t")
    fireFields[col('pet type')] = 'firegolem'
    if (!modder.isD2R()) fireFields[col('idx')] = maxID + 3
    fireFields[col('baseicon')] = 'firegolumicon'
    fireFields[col('mclass1')] = '292'
    fireFields[col('micon1')] = 'firegolumicon'
    mod_multigolem.clear_unused_pettype_fields(fireFields, col)
    const fireGolemLine = fireFields.join("\t")

    const additions = [
      clayGolemLine,
      bloodGolemLine,
      fireGolemLine
    ]

    targetFiles['pettype.txt'] = fileLines.concat(additions)
  },

  update_skills_txt: function (mod, targetFiles) {
    var fileLines = targetFiles['skills.txt']

    const clayIndex = modder.find_row_value(fileLines, 'skill', 'Clay Golem')
    const bloodIndex = modder.find_row_value(fileLines, 'skill', 'BloodGolem')
    const ironIndex = modder.find_row_value(fileLines, 'skill', 'IronGolem')
    const fireIndex = modder.find_row_value(fileLines, 'skill', 'FireGolem')

    const skills_txt_op = [
      {
        "find": fileLines[clayIndex],
        "replace": "columns",
        "columns": [{ "col": 'pettype', "val": 'claygolem' }]
      },
      {
        "find": fileLines[bloodIndex],
        "replace": "columns",
        "columns": [{ "col": 'pettype', "val": 'bloodgolem' }]
      },
      {
        "find": fileLines[ironIndex],
        "replace": "columns",
        "columns": [{ "col": 'pettype', "val": 'irongolem' }]
      },
      {
        "find": fileLines[fireIndex],
        "replace": "columns",
        "columns": [{ "col": 'pettype', "val": 'firegolem' }]
      },
    ]

    modder.applySearchAndReplace(skills_txt_op, 'skills.txt', targetFiles);
  },

}


export default function applyPatch(mod, targetFiles) {
  mod_multigolem.update_pettype_txt(mod, targetFiles)
  mod_multigolem.update_skills_txt(mod, targetFiles)
}
