import modder from '../../js/modder.mjs'

export default function applyPatch(mod, targetFiles) {
  const fileLines = targetFiles['levels.txt']
  const col = modder.get_column_index(targetFiles, 'levels.txt')

  const INDEX_RAIN = col('Rain')
  const INDEX_MUD = col('Mud')

  fileLines.filter(function (line, index) {
    if (index > 0) {
      const fields = fileLines[index].split('\t');

      if (fields[INDEX_RAIN] === '1') fields[INDEX_RAIN] = '0'
      if (fields[INDEX_MUD] === '1') fields[INDEX_MUD] = '0'

      fileLines[index] = fields.join('\t');
    }
  })
}
