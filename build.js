const fs = require('fs')
const os = require('os')
const process = require('process')
const spawn = require('child_process').spawn
const crypto = require('crypto')


const BASE_FOLDER = 'src'
const BASE_FILE = 'index.htm'
const OUTPUT_FOLDER = 'docs'
const BUNDLE_FILE = '../docs/index.html' // relative to BASE_FOLDER
const SCRIPT_BUNDLE_FILE = 'bundled.js'
const CSS_BUNDLE_FILE = 'bundled.css'

const ImageList = []
const ScriptList = []
const CSSList = []
const NODE_VERSION = Number(process.version.match(/^v(\d+\.\d+)/)[1])


function sha1hash(plainstring) {
  return crypto.createHash('sha1').update(plainstring).digest('hex')
}

// abstract file copy operation
function CopyFileSync(source, destination) {
  let sourceFile = source
  let destinationFile = destination

  if (os.platform() === 'win32') {
    sourceFile = source.replace(/\//g, '\\')
    destinationFile = destination.replace(/\//g, '\\')
  }

  if (NODE_VERSION > 8.5) {
    return fs.copyFileSync(source, destination, (err) => {
      if (err) throw err;
      console.log('source.txt was copied to destination.txt');
    });
  } else {
    if (os.platform() === 'win32') {
      spawn('cmd.exe', ['/c', 'copy', '/b', sourceFile, destinationFile])
    } else {
      throw Error('Node version less than 8.5 does not support file copy')
    }
  }
}

function CheckImageTag(line) {
  const isImageTag = line.match(/<img(.*?)src='(.*?).png'>/)
  if (isImageTag) {
    const imgFile = isImageTag[2] + '.png';
    const imgAttributes = isImageTag[1] ? isImageTag[1] : ''
    const png_imageid = sha1hash(imgFile)

    if (fs.existsSync(imgFile)) {
      if (ImageList.indexOf(imgFile) < 0) {
        ImageList.push(imgFile)
        // const imgFileBinary = fs.readFileSync(imgFile, 'base64');
        CopyFileSync('./' + imgFile, '../' + OUTPUT_FOLDER + '/' + imgFile)
      }
      return '<img id="' + png_imageid + '" ' + imgAttributes + 'src="' + imgFile + '">';
      // return '<img ' + isImageTag[1] + 'src="data:image/png;base64,' + imgFileBinary + '">';
    }
  }

  const isJpgImageTag = line.match(/<img(.*?)src='(.*?).jpg'>/)
  if (isJpgImageTag) {
    const imgFile = isJpgImageTag[2] + '.jpg';
    const imgAttributes = isJpgImageTag[1] ? isJpgImageTag[1] : ''
    const jpg_imageid = sha1hash(imgFile)

    if (fs.existsSync(imgFile)) {
      if (ImageList.indexOf(imgFile) < 0) {
        ImageList.push(imgFile)
        // const imgFileBinary = fs.readFileSync(imgFile, 'base64');
        CopyFileSync('./' + imgFile, '../' + OUTPUT_FOLDER + '/' + imgFile)
      }
      return '<img id="' + jpg_imageid + '" ' + imgAttributes + 'src="' + imgFile + '">';
      // return '<img ' + isJpgImageTag[1] + 'src="data:image/jpg;base64,' + imgFileBinary + '">';
    }
  }

  return '';
}

function CheckScriptTag(line) {
  var isScriptTag = line.match(/<script src='(.*?).js'><\/script>/)
  if (isScriptTag) {
    const scriptFile = isScriptTag[1] + '.js';
    const scriptid = sha1hash(scriptFile)

    if (fs.existsSync(scriptFile)) {
      // uncomment next two lines to bundle scripts in html file and comment out remainder of block
      // const scriptFileContent = fs.readFileSync(scriptFile, 'utf-8');
      // return '\n<script>\n' + scriptFileContent + '\n</script>\n';

      if (ScriptList.indexOf(scriptFile) < 0) {
        ScriptList.push(scriptFile)
        const scriptFileContent = fs.readFileSync(scriptFile, 'utf-8');
        const bundleFile = '../' + OUTPUT_FOLDER + '/' + SCRIPT_BUNDLE_FILE
        const newBundleContent = '// #### ' + scriptFile + '\n' + scriptFileContent + '\n'
        if (ScriptList.length === 1) {
          fs.writeFileSync(bundleFile, newBundleContent)
        } else {
          fs.appendFileSync(bundleFile, newBundleContent)
        }
      }
      if (ScriptList.length === 1) return '<script src="' + SCRIPT_BUNDLE_FILE + '"></script>\n'
      return '<!-- ' + scriptFile + ' -->'
    }
  }
  return '';
}

function CheckCSSTag(line) {
  var isCSSTag = line.match(/<link rel='stylesheet' href='(.*?).css'>/)
  if (isCSSTag) {
    const cssFile = isCSSTag[1] + '.css';
    const cssFileid = sha1hash(cssFile)

    if (fs.existsSync(cssFile)) {
      const cssFileContent = fs.readFileSync(cssFile, 'utf-8');
      return '<style>\n' + cssFileContent + '\n</style>';

      // if (CSSList.indexOf(cssFile) < 0) {
      //   CSSList.push(cssFile)
      //   const cssFileContent = fs.readFileSync(cssFile, 'utf-8');
      //   const bundleFile = '../' + OUTPUT_FOLDER + '/' + CSS_BUNDLE_FILE
      //   const newBundleContent = '/* #### ' + cssFile + ' */\n' + cssFileContent + '\n'
      //   if (CSSList.length === 1) {
      //     fs.writeFileSync(bundleFile, newBundleContent)
      //   } else {
      //     fs.appendFileSync(bundleFile, newBundleContent)
      //   }
      // }
      // if (CSSList.length === 1) return '<link rel="stylesheet" href="' + CSS_BUNDLE_FILE + '">\n'
      // return '<!-- ' + cssFile + ' -->'
    }
  }
  return '';
}

function CheckScriptZipTag(line) {
  var isScriptTag = line.match(/<script type='application\/zip' src='(.*?).zip'><\/script>/)
  if (isScriptTag) {
    const scriptFile = isScriptTag[1] + '.zip';
    if (fs.existsSync(scriptFile)) {
      const scriptFileContent = fs.readFileSync(scriptFile, 'base64');
      const scriptVariable = isScriptTag[1].toUpperCase() + '_ZIP'
      return '<script>\n' + scriptVariable + '="' + scriptFileContent + '";\n</script>';
    }
  }
  return '';
}

function CheckTags(line) {
  var result = CheckImageTag(line)
  if (result) return result;

  result = CheckScriptTag(line)
  if (result) return result;

  result = CheckCSSTag(line)
  if (result) return result;

  result = CheckScriptZipTag(line)
  if (result) return result;

  return line
}

function BuildBundle() {
  const basefile = fs.readFileSync(BASE_FILE, 'utf-8');

  const basefile_lines = basefile.split("\n")
  const newbundle = basefile_lines.reduce(function (acc, line) {
    return acc + CheckTags(line) + '\n';
  }, '')

  // console.log(newbundle)

  const fdOut = fs.openSync(BUNDLE_FILE, 'w');
  fs.writeSync(fdOut, newbundle);
  fs.closeSync(fdOut);
}


// ******
// Functions to compress mods folder
const INPUT_FOLDER = 'mods'
const OUTPUT_FILE = 'mods.zip'

function DirList(dir, filelist) {
  const files = fs.readdirSync(dir)
  filelist = filelist || []
  files.forEach(function (file) {
    if (fs.statSync(dir + '/' + file).isDirectory()) {
      filelist = DirList(dir + '/' + file, filelist)
    } else {
      filelist.push(dir + '/' + file)
    }
  })
  return filelist
};

function CompressFolder(fileList, nextFunction) {
  var JSZip = require("./src/libs/jszip.min");

  var zip = new JSZip();

  fileList.forEach(function (file) {
    const fileContent = fs.readFileSync(file)
    zip.file(file, fileContent)
  })

  const zipOptions = {
    type: "base64",
    compression: "DEFLATE",
    compressionOptions: {
      level: 9
    }
  }
  zip.generateAsync(zipOptions)
    .then(function (base64Zip) {
      const fdOut = fs.openSync(OUTPUT_FILE + '.js', 'w');
      fs.writeSync(fdOut, 'const DATA_ZIP="' + base64Zip + '";');
      fs.closeSync(fdOut);

      nextFunction();
    })
}

// ******
process.chdir(BASE_FOLDER)
const fileList = DirList(INPUT_FOLDER)

CompressFolder(fileList, function () {
  if (!fs.existsSync('../' + OUTPUT_FOLDER)) fs.mkdirSync('../' + OUTPUT_FOLDER)
  if (!fs.existsSync('../' + OUTPUT_FOLDER + '/images')) fs.mkdirSync('../' + OUTPUT_FOLDER + '/images')
  BuildBundle();
})