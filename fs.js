/*
source: https://github.com/sajonoso/fsxcl
NodeJS compatibility library for Microsoft JScript v1.0
This file defines functions that do not exist in Microsoft Jscript
*/
(function () {
  if (typeof (WScript) === 'object') {
    var fso = new ActiveXObject("Scripting.FileSystemObject");
    var shell = new ActiveXObject("WScript.Shell");

    // Force script host to run with cscript
    if ("CSCRIPT.EXE" !== WScript.FullName.toUpperCase().slice(-11)) {
      shell.Run('cscript.exe /nologo "' + WScript.ScriptFullName + '"');
      WScript.Quit(0);
    };

    fs = {
      openSync: function (fileName, mode) {
        var modeNumber = (mode == 'r') ? 1 : 2;
        if (mode == 'a') modeNumber = 8
        return fso.OpenTextFile(fileName, modeNumber, true);
      },
      readFileSync: function (fileName, mode) {
        var fh = fso.OpenTextFile(fileName, 1);
        var content = fh.ReadAll();
        fh.close();
        return content;
      },
      readSync: function (fd, buffer, offset, length, position) {
        buffer = fd.Read(length);
        return buffer.length;
      },
      writeSync: function (fh, textdata) {
        fh.write(textdata);
      },
      closeSync: function (fd) { fd.close(); },
      existsSync: function (path) { return fso.FileExists(path) || fso.FolderExists(path); },
      mkdirSync: function (path) { fso.CreateFolder(path); }
    };
  }
})();
