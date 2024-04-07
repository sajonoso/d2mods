// NOTE: Needs nodeJS v16+ because use of atob function

import '../libs/zipfile.web.mjs'
import modder from './modder.mjs'
import { DATA_ZIP } from '../mods.zip.mjs'

const FILENAME_D2X = 'diymod_d2x.zip';
const FILENAME_D2R = 'diymod_d2r.zip';


const str2array = (str) => (new TextEncoder()).encode(str)
const array2str = (buf) => (new TextDecoder()).decode(buf)

const println = console.log

const osB64toArray = (b64String) => {
  const binaryString = atob(b64String);
  // Create a Uint8Array from the binary string
  const uint8Array = new Uint8Array(binaryString.length);
  for (let i = binaryString.length - 1; i--;) {
    uint8Array[i] = binaryString.charCodeAt(i);
  }
  return uint8Array
}

/*
  extracts patch.json file for each mod and add to mod object
*/
const getUsedModActions = (dataZip, modSettings) => {
  // get patch.json list in zip file
  const zr = new ZipFile()
  zr.open(osB64toArray(DATA_ZIP))
  zr.listFiles()

  // extract patches used in enabled mods
  const usedMods = {}
  for (const mod of modSettings.enabledMods) {
    const extractedFile = zr.getFile(`mods/${mod.name}/patch.json`)
    if (!extractedFile || typeof (extractedFile) === 'string') {
      usedMods[mod.name] = {}
    } else {
      const patchJsonContent = extractedFile.content
      usedMods[mod.name] = JSON.parse(array2str(patchJsonContent))
    }
  }
  zr.close();

  return usedMods
}

const convertCopyArrayToObject = (mod, copyList) => {
  const copyFiles = {}
  for (let i = 0; i < copyList.length; i++) {
    const newSourceName = `mods/${mod.name}/${copyList[i].source}`
    // adding * to key to differentiate between modifiable text files
    copyFiles["*" + newSourceName] = {
      source: newSourceName,
      destination: copyList[i].destination
    }
  }

  return copyFiles
}

/*
creates an object that contains file names as keys.
for values:
an array indicates a text file, with eacah item in the array being a row
an object indicates a file operation required.  either a copy or create.
example
const filelist = {
  "skills.txt": [ "line1\tcol2\tcol3", "line2\tcol2\t\col3" ],
  "font.dc6" : { source: "my_mod/font.dc6", destination: "mod/folder1/dont.dc6" },
  "new.json" : { content: "hello world", destination: "mod/folder1/dont.dc6" },
}
*/
const getFilesToExtract = (modSettings, modActions) => {
  const copyKey = `${modSettings.d2Version}-copy`

  // stick all files used by enabled mods in an array
  let filelist = {}

  // Add file keys for files that will be modified
  for (const mod of modSettings.enabledMods) {
    const patchActions = modActions[mod.name]

    const searchFiles = patchActions.search || {}
    const loadFiles = patchActions.load || {}
    const addFiles = patchActions.add || {}

    filelist = Object.assign(filelist, searchFiles, addFiles, loadFiles)
  }

  // clear value in the file keys to indicate they will be processed as text files
  for (const key of Object.keys(filelist)) filelist[key] = ""


  // Add file keys for files that will be copied
  for (const mod of modSettings.enabledMods) {
    const patchActions = modActions[mod.name]

    // Files that are copied from the mod folder need the mod folder name included in it
    const copyList1 = (patchActions.copy || [])
    const copyList2 = (patchActions[copyKey] || [])

    const copyFiles1 = convertCopyArrayToObject(mod, copyList1)
    const copyFiles2 = convertCopyArrayToObject(mod, copyList2)

    filelist = Object.assign(filelist, copyFiles1, copyFiles2)
  }

  return filelist
}


const extractUsedFiles = (dataZip, modSettings, filelist) => {
  const isD2r = modSettings.d2Version === 'd2r'
  const sourceFolder = isD2r ? 'source_txt.r/' : 'source_txt/'
  const eol = isD2r ? '\r\n' : '\n'

  // println('>> filelist:', filelist)

  // open zip file and get list of all files
  const zr = new ZipFile()
  zr.open(osB64toArray(dataZip))
  const zipfileList = zr.listFiles()

  // get content of text files in the file list
  for (let filename of Object.keys(filelist)) {
    if (typeof (filelist[filename]) === 'string') {


      // find file in data zip file
      const file = zipfileList.filter(item =>
        item.filename.toLowerCase().indexOf(`${sourceFolder}${filename}`) >= 0 ||
        item.filename.toLowerCase() === filename.toLowerCase()
      )
      if (file.length !== 1) throw Error(`ERROR: extractUsedFiles matched more than one (${file.length}) file for ${filename}`);

      // extract file
      const fileExtracted = zr.getFile(file[0].filename)
      if (typeof (fileExtracted) === 'string') throw new Error(`ERROR: extractUsedFiles could not extract ${filename}:\n  ${fileExtracted}`)
      const fileContent = fileExtracted.content
      let stringContent = array2str(fileContent)

      if (filename.slice(-4) === '.txt') {
        // split each line into an array of rows, d2r and d2x have different eol characters
        if (!isD2r) stringContent = stringContent.trim()
        if (isD2r) stringContent = stringContent.replace(eol + eol, eol)
        filelist[filename] = stringContent.split(eol)
        // bug fix for d2r if last line is blank, remove last line
        if (isD2r && filelist[filename].slice(-1).length <= 1) filelist[filename] = filelist[filename].slice(0, filelist[filename].length - 1)
      } else {
        filelist[filename] = stringContent
      }
    }
  }
  zr.close();

  return filelist
}


const addOtherFiles = (modSettings, targetFiles) => {
  const prefix = modSettings.d2Version === 'd2r' ? 'mods/diymod' : 'data'

  // Add a file to show what options were selected
  targetFiles[`*${prefix}/modoptions.txt`] = {
    content: str2array(JSON.stringify(modSettings, null, 2)),
    destination: `${prefix}/modoptions.txt`
  }

  // D2 resurrected also need this extra file
  if (modSettings.d2Version === 'd2r') {
    targetFiles['*mods/diymod/diymod.mpq/modinfo.json'] = {
      content: str2array('{"name": "diymod","savepath": "diymod/"}'),
      destination: 'mods/diymod/diymod.mpq/modinfo.json'
    }
  }
}


const processFileOperation = (zr, zw, zipfileList, targetFiles, filename) => {
  const fileOp = targetFiles[filename]

  let sourceContent = null
  if (fileOp.content && fileOp.destination) {
    sourceContent = fileOp.content
  } else if (fileOp.source && fileOp.destination) {
    const sourceFileName = fileOp.source  // .slice(0,1) === '*' ? fileOp.source.slice(1) : fileOp.source
    const extractedFile = zr.getFile(sourceFileName)
    if (!extractedFile || typeof (extractedFile) === 'string') throw Error(`ERROR: processFileOperation - extractedFile wrong for: ${filename} : ${sourceFileName}`)
    sourceContent = extractedFile.content
  }

  if (typeof (sourceContent) === Uint8Array) throw Error(`ERROR: processFileOperation - sourceContent wrong for: ${filename} `)

  zw.addFile(fileOp.destination, sourceContent)
}


const createZipFile = (zipWriter, modSettings, targetFiles, dataZip) => {
  const isD2r = modSettings.d2Version === 'd2r'
  const targetPath = isD2r ? 'mods/diymod/diymod.mpq/data' : 'data';
  const eol = isD2r ? '\r\n' : '\r\n'

  const zr = new ZipFile()
  zr.open(osB64toArray(dataZip))
  const zipfileList = zr.listFiles()

  // compress target files
  for (const filename of Object.keys(targetFiles)) {
    const fileItem = targetFiles[filename]
    if (Array.isArray(fileItem)) {
      const textContent = fileItem.join(eol) + (isD2r ? eol : eol)
      const zippedFilename = filename.indexOf('/') < 0 ? `${targetPath}/global/excel/${filename}` : filename

      zipWriter.addFile(zippedFilename, str2array(textContent))
    } else if (typeof (fileItem) === 'string') {
      zipWriter.addFile(filename, str2array(fileItem))
    } else {
      processFileOperation(zr, zipWriter, zipfileList, targetFiles, filename)
    }
  }
  zr.close();

  zipWriter.lock()
  const newZipContent = zipWriter.getZip()

  return newZipContent
}


const generateZipFile = (D2_VERSION, MOD_OPTIONS) => {
  const modSettings = {
    d2Version: D2_VERSION,
    enabledMods: MOD_OPTIONS
  }

  const modActions = getUsedModActions(DATA_ZIP, modSettings)
  const filesToExtract = getFilesToExtract(modSettings, modActions)
  // DEBUG println('>>> filesToExtract', filesToExtract)

  const targetFiles = extractUsedFiles(DATA_ZIP, modSettings, filesToExtract)
  addOtherFiles(modSettings, targetFiles)
  // DEBUG println(targetFiles['cubemain.txt'].slice(-5))
  modder.D2_VERSION = modSettings.d2Version
  modder.ApplyMods(modSettings, modActions, targetFiles)

  println(`>> Creating Zip file ...`);
  const zipWriter = new ZipFile()
  zipWriter.create(8)

  const newZipFile = createZipFile(zipWriter, modSettings, targetFiles, DATA_ZIP)

  const newFilename = D2_VERSION === 'd2r' ? FILENAME_D2R : FILENAME_D2X;

  // You need the zipWriter to close the zip file after saving the new zip file buffer
  return { zipWriter, newFilename, newZipFile }
}

export { generateZipFile }
