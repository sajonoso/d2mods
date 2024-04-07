// ****** Platform specific functions go here
// The node: schema only supported from nodejs12 and deno 1.30.0 onwards

import { Buffer } from "node:buffer"
import fs from "node:fs"
import process from "node:process"
import { spawn } from "node:child_process"

// type dirEntry = {
//   name: string;
//   isDirectory: boolean;
// };

function osENV(env) {
  return process.env[env]
}

function osFileReadSync(filePath) {
  return fs.readFileSync(filePath);
}

function osFileWriteSync(filePath, fileContent) {
  fs.writeFileSync(filePath, fileContent);
}

function osFileWriteTextSync(filePath, fileContent) {
  fs.writeFileSync(filePath, fileContent, { encoding: 'utf8' });
}

// list the files and folder in a folder
function osFolderList(dir) {
  const result = fs.readDirSync(dir);
  const dirlist = [];
  for (const dirEntry of result) {
    dirlist.push({ name: dirEntry.name, isDirectory: dirEntry.isDirectory });
  }
  return dirlist;
}

// Change current working directory
function osChdir(dir) {
  process.chdir(dir);
}

function osB64toArray(b64String) {
  const buf = Buffer.from(b64String, 'base64');
  const uint8Array = new Uint8Array(buf);
  return uint8Array
}

function osArraytoB64(u8Arr) {
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

async function osRun(command) {
  const cmd = command.split(' \t ')
  const cmdParameters = cmd.slice(1)

  const exitCode = await new Promise((resolve, reject) => {
    const child = spawn(cmd[0], cmdParameters).on('exit', function (code, signal) {
      if (code !== null) resolve(code);
      if (signal !== null) reject(new Error(`Child process terminated due to signal ${signal}`));
      reject(new Error(`Child process terminated due to unknown error`));
    });

    child.stdout.setEncoding('utf8');
    child.stdout.on('data', data => { console.log(data); });
    child.stderr.setEncoding('utf8');
    child.stderr.on('data', data => { console.error(data); });
  })

  return exitCode

}

export { osENV, osFileReadSync, osFileWriteSync, osFileWriteTextSync, osFolderList, osChdir, osB64toArray, osArraytoB64, osRun };
