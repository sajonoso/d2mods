import './libs/jszip.min.js';
import { osENV, osFileReadSync, osFileWriteTextSync, osFolderList, osChdir, dirEntry } from './os.ts';

const print = console.log;

const BASE_FOLDER = 'src';
const INPUT_FOLDER = 'mods';
const OUTPUT_FILE = 'mods.zip';

// ******
// Functions to compress mods folder
// function DirList(dir: string, filelist?: dirEntry[]): dirEntry[] {
//   const files = osFolderList(dir);
//   filelist = filelist || [];
//   files.forEach(function (file) {
//     if (file.isDirectory) {
//       filelist = DirList(dir + '/' + file.name, filelist);
//     } else {
//       filelist.push({ name: dir + '/' + file.name, isDirectory: false });
//     }
//   });
//   return filelist;
// }

// function CompressFolder(fileList: dirEntry[], nextFunction) {
//   const zip = new JSZip();

//   fileList.forEach(function (file) {
//     const fileContent = osFileReadSync(file.name);
//     zip.file(file.name, fileContent);
//   });

//   const zipOptions = {
//     type: 'base64',
//     compression: 'DEFLATE',
//     compressionOptions: { level: 9 },
//   };
//   zip.generateAsync(zipOptions).then(function (base64Zip: string) {
//     const filePath = OUTPUT_FILE + '.js';
//     const fileContent = 'window.DATA_ZIP="' + base64Zip + '";';
//     osFileWriteTextSync(filePath, fileContent);

//     nextFunction();
//   });
// }

// ******
// function main_old() {
//   osChdir(BASE_FOLDER);
//   const fileList = DirList(INPUT_FOLDER);

//   print(`Read ${fileList.length} files\nCompressing...`);

//   CompressFolder(fileList, function () {
//     print(`Done`);
//     // if (!fs.existsSync('../' + OUTPUT_FOLDER)) fs.mkdirSync('../' + OUTPUT_FOLDER)
//     // if (!fs.existsSync('../' + OUTPUT_FOLDER + '/images')) fs.mkdirSync('../' + OUTPUT_FOLDER + '/images')
//     // BuildBundle();
//   });
// }


function Uint8ToBase64(u8Arr) {
  var CHUNK_SIZE = 0x8000; //arbitrary number
  var index = 0;
  var length = u8Arr.length;
  var result = '';
  var slice;
  while (index < length) {
    slice = u8Arr.subarray(index, Math.min(index + CHUNK_SIZE, length));
    result += String.fromCharCode.apply(null, slice);
    index += CHUNK_SIZE;
  }
  return btoa(result);
}

function isWindows() {
  return osENV('OS') === 'Windows_NT'
}

async function main() {
  //  \t -xr!*.js
  osChdir(BASE_FOLDER)

  // Remove old archives
  const command1 = `rm \t ./${OUTPUT_FILE}`;
  print(command1.replace(/ \t /g, ' '));
  const p1 = Deno.run({ cmd: command1.split(' \t '), stdout: 'piped', stderr: 'piped', stdin: 'null' });
  const result1 = await p1.status();

  // Generate archive
  const cmd7z = isWindows() ? 'c:/Program Files/7-Zip/7z.exe' : '7z'
  const command2 = `${cmd7z} \t a \t -xr!*.js \t ./${OUTPUT_FILE} \t ${INPUT_FOLDER}/`;
  print(command2.replace(/ \t /g, ' '));
  const p2 = Deno.run({ cmd: command2.split(' \t '), stdout: 'piped', stderr: 'piped', stdin: 'null' });
  const result2 = await p2.status();

  const zipfileArray = osFileReadSync(`mods.zip`);
  const base64Zip = Uint8ToBase64(zipfileArray)
  const fileContent = 'window.DATA_ZIP="' + base64Zip + '";';
  osFileWriteTextSync(`mods.zip.js`, fileContent);
}

main();
