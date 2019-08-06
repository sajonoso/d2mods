// require = typeof (require) === 'function' ? require : function (file) {
//   var fh = (new ActiveXObject('Scripting.FileSystemObject')).OpenTextFile(file + '.js', 1);
//   var content = fh.ReadAll(); fh.close(); eval(content); return fs;
// }
// require('./fsxcl');
const fs = require('fs')
const process = require('process')

const BASE_FOLDER = 'src'
const BASE_FILE = 'index.htm'
const BUNDLE_FILE = '../docs/index.html' // relative to BASE_FOLDER


function CheckImageTag(line) {
  const isImageTag = line.match(/<img(.*?)src='(.*?).png'>/)
  if (isImageTag) {
    const imgFile = isImageTag[2] + '.png';
    if (fs.existsSync(imgFile)) {
      const imgFileBinary = fs.readFileSync(imgFile, 'base64');
      return '<img ' + isImageTag[1] + 'src="data:image/png;base64,' + imgFileBinary + '">';
    }
  }

  const isJpgImageTag = line.match(/<img(.*?)src='(.*?).jpg'>/)
  if (isJpgImageTag) {
    const imgFile = isJpgImageTag[2] + '.jpg';
    if (fs.existsSync(imgFile)) {
      const imgFileBinary = fs.readFileSync(imgFile, 'base64');
      return '<img ' + isJpgImageTag[1] + 'src="data:image/jpg;base64,' + imgFileBinary + '">';
    }
  }

  return '';
}

function CheckScriptTag(line) {
  var isScriptTag = line.match(/<script src='(.*?).js'><\/script>/)
  if (isScriptTag) {
    const scriptFile = isScriptTag[1] + '.js';
    if (fs.existsSync(scriptFile)) {
      const scriptFileContent = fs.readFileSync(scriptFile, 'utf-8');
      return '<script>\n' + scriptFileContent + '\n</script>';
    }
  }
  return '';
}

function CheckCSSTag(line) {
  var isScriptTag = line.match(/<link rel='stylesheet' href='(.*?).css'>/)
  if (isScriptTag) {
    const scriptFile = isScriptTag[1] + '.css';
    if (fs.existsSync(scriptFile)) {
      const scriptFileContent = fs.readFileSync(scriptFile, 'utf-8');
      return '<style>\n' + scriptFileContent + '\n</style>';
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
    }
    else {
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

  zip.generateAsync({ type: "base64", compression: "DEFLATE", compressionOptions: { level: 9 } })
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

CompressFolder(fileList, function() {
  BuildBundle();
})


