/*
source: https://github.com/sajonoso/d2mods
This script generates soft mods for Diablo 2
Comment out any mods not required before running this script
*/

ENABLED_PATCHES = [
  '10x8cube',
  '10x10stash',
  'add_start_items',
  'extra_cube_recipes',
  'font_fix',
  'full_merc',
  'bear+wolves',
  'multigolem',
  // 'movingdecoy', // disabled - not complete
  'multivalkyrie'
];



// ***** Do not modify code below this line
require = typeof(require)==='function' ? require : function(file) {
  var fh = (new ActiveXObject("Scripting.FileSystemObject")).OpenTextFile(file +'.js', 1);
  var content = fh.ReadAll(); fh.close(); eval(content); return fs;
}
require('./fsxcl');

DEBUG = false;
EXCEL_FOLDER = 'data/global/excel';
SOURCE_TXT_FOLDER = 'source_txt';

var NEEDED_FOLDERS = [
  EXCEL_FOLDER,
  'data/global/ui/panel',
  'data/local/font/latin'
];

var MODIFY_FILES = {};
/*
  filename1_key: {
    search: [
      {find: "line1text", replace: "id_one"},
      {find: "line2text", replace": "columns",
        "columns": [
          {"col": 61, "val": "new value"}
      ]}
    ],
    add: [
      "text1 to add to end of line",
      "text2 to add to end of line",
    ]
  },
  filename2_key: { ... }
*/

var COPY_FILES = []
/* array of copy operations
[
  {source: "test.txt", destination: "data/test.txt" },
  {source: "test.txt", destination: "data/test.txt" }
]
*/

function LoadPatch(patchFolder) {
  var jsonContent = fs.readFileSync(patchFolder + '/patch.json', 'utf-8');
  var patch = JSON.parse(jsonContent);
  var currentValues;

  // add search and replace operations
  if (patch.search) {
    for (file_keys in patch.search) {
      if (typeof (MODIFY_FILES[file_keys]) !== 'object') MODIFY_FILES[file_keys] = { search: [], add: [] };
      currentValues = MODIFY_FILES[file_keys]['search'];
      var searchOperations = patch.search[file_keys];
      MODIFY_FILES[file_keys]['search'] = currentValues.concat(searchOperations);
    }
  }

  // add append to file operations
  if (patch.add) {
    for (file_keys in patch.add) {
      if (typeof (MODIFY_FILES[file_keys]) !== 'object') MODIFY_FILES[file_keys] = { search: [], add: [] };
      currentValues = MODIFY_FILES[file_keys]['add'];
      var addOperations = patch.add[file_keys];
      MODIFY_FILES[file_keys]['add'] = currentValues.concat(addOperations);
    }
  }

  // add copy operations
  if (patch.copy) {
    var fileOp;
    for (var i in patch.copy) {
      fileOp = patch.copy[i];
      COPY_FILES.push({
        source: patchFolder + '\\' + fileOp.source,
        destination: fileOp.destination
      });
    };
  }
}

function MakeNeededFolders() {
  var folderName = '';
  for (var i in NEEDED_FOLDERS) {
    folderName = NEEDED_FOLDERS[i];
    MakeFullPath(fs, folderName);
    if (DEBUG) Print('CREATING_FOLDER: ' + folderName);
  }
}

function CopyFiles() {
  for (var i in COPY_FILES) {
    fileOp = COPY_FILES[i];
    var copy_cmd = 'xcopy /y ' + fileOp.source + ' ' + fileOp.destination + "*";
    if (DEBUG) Print(copy_cmd);
    SysCommand(copy_cmd);
  }
}

function matchLine(line, srarray) {
  for (i = 0; i < srarray.length; i++) {
    if (line.indexOf(srarray[i].find) >= 0) return i;
  }
  return -1;
}

function replaceColumns(originalLine, replaceArray) {
  var fields = originalLine.split('\t');
  var entry =null;
  for (var i in replaceArray) {
    entry = replaceArray[i];
    if (typeof(entry.col) === 'number') fields[entry.col] = entry.val;
  }
  return fields.join('\t');
}

function ApplyUpdates() {
  for (filekey in MODIFY_FILES) {
    var realFileName = filekey.replace('_', '.')
    if (DEBUG) Print('Updating file: ' + realFileName);

    var fileIn = fs.openSync(SOURCE_TXT_FOLDER + '\\' + realFileName, 'r');
    var fileOut = fs.openSync(EXCEL_FOLDER + '\\' + realFileName, 'w');
    var lineout = '';

    // search and replace lines in file
    var searchList = MODIFY_FILES[filekey]['search'];
    ReadLine(fs, fileIn, function (line) {
      j = matchLine(line, searchList);
      lineout = (j >= 0) ? (searchList[j].replace) : line;
      if (lineout === 'columns') lineout = replaceColumns(line, searchList[j].columns);
      fs.writeSync(fileOut, lineout + "\r\n");
    });
    fs.closeSync(fileIn);

    // append lines to file
    var addList = MODIFY_FILES[filekey]['add'];
    for (i = 0; i < addList.length; i++) {
      fs.writeSync(fileOut, addList[i] + "\r\n");
    }
    fs.closeSync(fileOut);
  }
}

// *** Main logic starts here
var PatchList = '';
for (var ep in ENABLED_PATCHES) {
  PatchList += ENABLED_PATCHES[ep] + "\n";
  LoadPatch(ENABLED_PATCHES[ep]);
}

MakeNeededFolders();
CopyFiles();
ApplyUpdates();


var Msg = 'The following mods have been added:\n\n' + PatchList +
  '\n1) Copy the generated data folder into your Diablo 2 installation folder\n' +
  '\n2) Add the following parameters to your diablo shortcut: -direct -txt' +
  '\n\nPress enter to close this window'
console.log(Msg);
var pause = ReadInput(function () { });
