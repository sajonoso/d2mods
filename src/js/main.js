const MOD_FILENAME = 'd2_diy_mod.zip'


// Global variables
DATA_UNZIPPED = {} // unzipped source content for patches and source files


function ID(o) { return document.getElementById(o) }
Print = console.log

function filedownload_click() {
  const sourceFiles = DATA_UNZIPPED
  const EnabledMods = modder.getOptions()

  const FileOps = modder.loadMods(EnabledMods, sourceFiles)

  var targetZip = new JSZip();

  // add file listing options selected
  targetZip.file('data/modoptions.txt', JSON.stringify(EnabledMods, null, 2))

  modder.copyFiles(sourceFiles, targetZip, FileOps.copy_files)

  modder.applyUpdates(sourceFiles, targetZip, FileOps.modify_files)

  targetZip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 5 } })
    .then(function (blob) {
      saveAs(blob, MOD_FILENAME);
    }, function (err) {
      ID("#output").innerHTML = err;
    });
}


// const zipDataBinary = window.atob(DATA_ZIP)


// Unzip all files in data zip file
function GetAllZipfiles(zip, ZipfileList) {
  var Promise = JSZip.external.Promise;

  const unzipList = ZipfileList.map(function (item) {
    const extension4 = item.substr(-4).toLowerCase()
    const extension5 = item.substr(-5).toLowerCase()
    const contentType = (extension4 === ".txt" || extension5 === ".json") ? 'string' : 'uint8array'
    return zip.file(item).async(contentType).then(function (data) {
      return { file: item, content: data }
    })
  })

  Promise.all(unzipList).then(function (unzippedFiles) {
    DATA_UNZIPPED = {}
    unzippedFiles.forEach(function (item) {
      DATA_UNZIPPED[item.file.toLowerCase()] = item.content;
    })

    Print('Ready!');
  });
}

// Get all files in Zip file
JSZip.loadAsync(DATA_ZIP, { base64: true, checkCRC32: true })
  .then(function (zip) {
    const fileList = Object.keys(zip.files).filter(function (fileName) {
      return (fileName.substr(-1) !== '/') // directorys return false
    })
    GetAllZipfiles(zip, fileList)
  })