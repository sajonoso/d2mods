import modder from '../../js/modder.js'

const prnt = console.log

const FILES_PREFIX = 'mods/source_txt.r/vis'


function disable3dfx(mod, sourceFiles, targetZip) {
  for (const file of Object.keys(sourceFiles)) {
    if (file.indexOf(FILES_PREFIX) >= 0) {
      const fileContent = sourceFiles[file]
      // var newContent = fileContent
      var newData = JSON.parse(fileContent)

      newData.entities.forEach(entity => {
        entity.components.forEach(component => {
          // Disable non-essential component features
          if (typeof(component.shadowCaster) === 'boolean') component.shadowCaster = false
          if (typeof(component.screenspaceVfx) === 'string') component.screenspaceVfx = ""
          if (typeof(component.fogDensity) === 'number') component.fogDensity = 0.0
          if (typeof(component.keyLightShadowPitchDeg) === 'number') component.keyLightShadowPitchDeg = 0.0
          if (typeof(component.unitLightSpecOrientation) === 'object') component.unitLightSpecOrientation = {}
          if (typeof(component.characterShadowOrientation) === 'object') component.characterShadowOrientation = {}
          if (typeof(component.windDirection) === 'object') component.windDirection = {}
          if (typeof(component.windScale) === 'number') component.windScale = 0.0
        })
      })

      const newContent = JSON.stringify(newData)

      const newFilename = file.replace(FILES_PREFIX, "mods/diymod/diymod.mpq/data/hd/env/vis")
      targetZip.file(newFilename, newContent)
    }
  }
}


export default function applyPatch(mod, targetFiles, sourceFiles, targetZip) {
  // This patch only for d2r
  if (modder.MOD_TARGET !== 'd2r') return;

  prnt(`mod options:`, mod.options)

  disable3dfx(mod, sourceFiles, targetZip)
}
