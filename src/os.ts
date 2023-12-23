// ****** Platform specific functions go here - this one is for deno
import { decode } from "https://deno.land/std/encoding/base64.ts"

type dirEntry = {
  name: string;
  isDirectory: boolean;
};

function osENV(env: string) {
  return Deno.env.get(env)
}

function osFileReadSync(filePath: string) {
  return Deno.readFileSync(filePath);
}

function osFileWriteSync(filePath: string, fileContent: Uint8Array) {
  Deno.writeFileSync(filePath, fileContent);
}

function osFileWriteTextSync(filePath: string, fileContent: String) {
  Deno.writeTextFileSync(filePath, fileContent);
}

// list the files and folder in a folder
function osFolderList(dir: string) {
  const result = Deno.readDirSync(dir);
  const dirlist = [];
  for (const dirEntry of result) {
    dirlist.push({ name: dirEntry.name, isDirectory: dirEntry.isDirectory });
  }
  return dirlist;
}

// Change current working directory
function osChdir(dir: string) {
  Deno.chdir(dir);
}

function osB64toArray(b64String: string): Uint8Array {
  return decode(b64String)
}

export { osENV, osFileReadSync, osFileWriteSync, osFileWriteTextSync, osFolderList, osChdir, osB64toArray, dirEntry };
