import modder from '../../js/modder.mjs'

const println = console.log

const PREFIX_ENV = 'hd/env/vis'
const PREFIX_WEATHER = 'hd/env/weather'
// const PREFIX_BIOME = 'hd/env/biome'
const PREFIX_ENEMY = 'hd/character/enemy'
const PREFIX_NPC = 'hd/character/npc'
const PREFIX_PLAYER = 'hd/character/player'
const PREFIX_MISSILES = 'hd/missiles'

// PREFIX_ENEMY, PREFIX_NPC, PREFIX_PLAYER
const FILE_PREFIXES = [PREFIX_ENV, PREFIX_MISSILES, PREFIX_WEATHER, PREFIX_ENEMY, PREFIX_PLAYER]


const PATCH_JSON_PATH = 'src/mods/no_3dvfx.d2r/patch.json'


// uncomment block below and execute to generate patch file:  node src/mods/no_3dvfx.d2r/patch.mjs

/*
// GeneratePatchJSON()
async function GeneratePatchJSON() {
  const fs = await import("node:fs")

  const dirlist = {};

  for (const prefix of FILE_PREFIXES) {
    println(`adding ${prefix}`)
    const hdFiles = fs.readdirSync(`src/mods/source_txt.r/${prefix}/`, { withFileTypes: true });
    for (const dirEntry of hdFiles) dirlist[`mods/source_txt.r/${prefix}/${dirEntry.name}`] = []
  }


  const patchJSON = JSON.stringify({ search: dirlist }, null, 2)
  fs.writeFileSync(PATCH_JSON_PATH, patchJSON)

  println(`>> ${PATCH_JSON_PATH} generated`)
}
*/


function disable3dfx_env(mod, targetFiles) {
  for (const fileKey of Object.keys(targetFiles)) {
    if (fileKey.indexOf(`mods/source_txt.r/${PREFIX_ENV}`) >= 0) {
      const fileContent = targetFiles[fileKey]
      const normalContent = fileContent

      var newData = JSON.parse(normalContent)

      newData.entities.forEach(entity => {
        entity.components.forEach(component => {
          // Disable non-essential component features
          if (typeof (component.shadowCaster) === 'boolean') component.shadowCaster = false
          if (typeof (component.screenspaceVfx) === 'string') component.screenspaceVfx = ''
          // if (typeof (component.gradingLutFile) === 'string' && component.gradingLutFile === 'data/hd/env/lut/default.dds') component.gradingLutFile = ''
          if (typeof (component.fogDensity) === 'number') component.fogDensity = 0.0
          if (typeof (component.softShadowBlurFactor) === 'number') component.softShadowBlurFactor = 0.0
          if (typeof (component.keyLightShadowPitchDeg) === 'number') component.keyLightShadowPitchDeg = 0.0
          if (typeof (component.unitLightSpecOrientation) === 'object') component.unitLightSpecOrientation = {}
          if (typeof (component.characterShadowOrientation) === 'object') component.characterShadowOrientation = {}
          if (typeof (component.windDirection) === 'object') component.windDirection = {}
          if (typeof (component.windScale) === 'number') component.windScale = 0.0
        })
      })

      // const newEntities = newData.entities.filter(entity => {
      //   println(`>> entity.name: ${entity.name}`)
      //   return entity.name !== 'vis_data'
      // })
      // newData.entities = newEntities;

      newData.dependencies.particles = []
      newData.dependencies.textures = []
      // if (newData.dependencies.other.length === 1 && newData.dependencies.other[0].path === 'data/hd/env/lut/default.dds') {
      //   println(`>> newData.dependencies.other: ${fileKey}`, newData.dependencies.other)
      //   newData.dependencies.other = []
      // }

      const newContent = JSON.stringify(newData)

      targetFiles[fileKey] = newContent
    }
  }
}

function disablemonster2(targetFiles, fileKey, prefix) {
  if (fileKey.indexOf(`mods/source_txt.r/${prefix}`) >= 0) {
    const fileContent = targetFiles[fileKey]
    const normalContent = fileContent

    var newData = JSON.parse(normalContent)

    if (newData.entities) {
      newData.entities.forEach(entity => {
        entity.components.forEach(component => {
          // Disable non-essential component features
          if (PREFIX_MISSILES === prefix) {
            // if (typeof (component.hideAllMeshWhenInOpenedMode) === 'boolean') component.hideAllMeshWhenInOpenedMode = true
            if (typeof (component.disableAttemptVfx) === 'boolean') component.disableAttemptVfx = true
            // if (typeof (component.doNotUseHDHeight) === 'boolean') component.doNotUseHDHeight = true
          }
          if (typeof (component.filename) === 'string' && component.filename.slice(-10) === '.particles') component.filename = ''
        })
      })
    }

    newData.dependencies.particles = []
    newData.dependencies.textures = []

    const newContent = JSON.stringify(newData)

    targetFiles[fileKey] = newContent
  }
}



function disablemonster(targetFiles, fileKey, prefix) {
  if (fileKey.indexOf(`mods/source_txt.r/${prefix}`) >= 0) {
    const fileContent = targetFiles[fileKey]
    const normalContent = fileContent

    var newData = JSON.parse(normalContent)
    var tmpContent = normalContent

    let iTextures = 0
    if (Array.isArray(newData.dependencies.textures)) {
      for (const texture of newData.dependencies.textures) {
        const tPath = texture.path
        tmpContent = tmpContent.replaceAll(tPath, "")
        iTextures++
      }
    }

    let iParticles = 0
    if (Array.isArray(newData.dependencies.particles)) {
      for (const particle of newData.dependencies.particles) {
        const pPath = particle.path
        // println(`>> Removing particle: ${pPath}`)
        tmpContent = tmpContent.replaceAll(pPath, "")
        iParticles++
      }
    }

    // DEBUG
    // println(`>> Cleared ${fileKey} - textures: ${iTextures}   particles: ${iParticles}`)

    var tmpData = JSON.parse(tmpContent)
    tmpData.dependencies.textures = [] // [{ path: 'data/hd/env/texture/void_alb.texture' }]
    tmpData.dependencies.particles = []

    const newContent = JSON.stringify(tmpData)

    targetFiles[fileKey] = newContent
  }
}



function disable3dfx_enemy(mod, targetFiles) {
  for (const fileKey of Object.keys(targetFiles)) disablemonster(targetFiles, fileKey, PREFIX_ENEMY)
}


function disable3dfx_player(mod, targetFiles) {
  for (const fileKey of Object.keys(targetFiles)) disablemonster(targetFiles, fileKey, PREFIX_PLAYER)
}



function disable3dfx_npc(mod, targetFiles) {
  for (const fileKey of Object.keys(targetFiles)) disablemonster(targetFiles, fileKey, PREFIX_NPC)
}


function disable3dfx_missiles(mod, targetFiles) {
  for (const fileKey of Object.keys(targetFiles)) disablemonster(targetFiles, fileKey, PREFIX_MISSILES)
}

function disable3dfx_weather(mod, targetFiles) {
  for (const fileKey of Object.keys(targetFiles)) {
    if (fileKey.indexOf(`mods/source_txt.r/${PREFIX_WEATHER}`) >= 0) {
      const fileContent = targetFiles[fileKey]
      const normalContent = fileContent

      var newData = JSON.parse(normalContent)
      newData.dependencies.particles = []
      newData.dependencies.textures = []

      newData.rain = ''
      newData.snow = ''
      newData.splash1 = ''
      newData.splash2 = ''
      newData.splash3 = ''
      newData.splash4 = ''
      newData.bubble1 = ''
      newData.bubble2 = ''
      newData.bubble3 = ''
      newData.bubble4 = ''

      const newContent = JSON.stringify(newData)

      targetFiles[fileKey] = newContent
    }
  }
}


function disable3dfx_biome(mod, targetFiles) {
  for (const fileKey of Object.keys(targetFiles)) {
    if (fileKey.indexOf(`mods/source_txt.r/${PREFIX_BIOME}`) >= 0) {
      const fileContent = targetFiles[fileKey]
      const normalContent = fileContent

      var newData = JSON.parse(normalContent)
      var tmpContent = normalContent

      if (Array.isArray(newData.dependencies.textures)) {
        for (const texture of newData.dependencies.textures) {
          const tPath = texture.path
          tmpContent = tmpContent.replaceAll(tPath, "data/hd/env/texture/void_alb.texture")
        }
      }

      // if (Array.isArray(newData.dependencies.particles)) {
      //   for (const particle of newData.dependencies.particles) {
      //     const pPath = particle.path
      //     println(`>> Removing particle: ${pPath}`)
      //     tmpContent = tmpContent.replaceAll(pPath, "")
      //   }
      // }

      var tmpData = JSON.parse(tmpContent)
      tmpData.dependencies.textures = [{ path: 'data/hd/env/texture/void_alb.texture' }]
      // tmpData.dependencies.particles = []

      const newContent = JSON.stringify(tmpData)

      targetFiles[fileKey] = newContent
    }
  }
}



function updatetargetFilenames(mod, targetFiles) {
  for (const fileKey of Object.keys(targetFiles)) {

    for (const prefix of FILE_PREFIXES) {
      if (fileKey.indexOf(`mods/source_txt.r/${prefix}`) >= 0) {
        const oldKeyContent = targetFiles[fileKey]

        // DEBUG
        // println(`copying: ${`mods/source_txt.r/${prefix}/`} -> ${`mods/diymod/diymod.mpq/data/${prefix}/`}`)

        const newKey = fileKey.replace(`mods/source_txt.r/${prefix}/`, `mods/diymod/diymod.mpq/data/${prefix}/`)
        targetFiles[newKey] = oldKeyContent
        delete targetFiles[fileKey]
      }
    }

  }
}


export default function applyPatch(mod, targetFiles) {
  // This patch only for d2r
  if (modder.D2_VERSION !== 'd2r') return;

  // DEBUG
  // println(`>> Applying patch ${modder.D2_VERSION}`);
  // println(Object.keys(targetFiles))

  disable3dfx_env(mod, targetFiles)
  disable3dfx_weather(mod, targetFiles)
  disable3dfx_missiles(mod, targetFiles)

  disable3dfx_enemy(mod, targetFiles)
  disable3dfx_player(mod, targetFiles)
  // disable3dfx_npc(mod, targetFiles)

  // disable3dfx_biome(mod, targetFiles)

  updatetargetFilenames(mod, targetFiles)
}
