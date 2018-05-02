/*
source: https://github.com/sajonoso/fsxcl
NodeJS compatibility layer for Microsoft JScript v1.0
This file defines functions that do not exist in NodeJS or Microsoft Jscript
Add the following lines in your scripts to include this file

require = typeof(require)==='function' ? require : function(file) {
  var fh = (new ActiveXObject("Scripting.FileSystemObject")).OpenTextFile(file +'.js', 1);
  var content = fh.ReadAll(); fh.close(); eval(content); return fs;
}
require('./fsxcl');

*/
fs = require('fs'); // import and export fs module

ReadInput = null; // reads a line of text from the console
ReadLine = null;  // reads a line of text from a file

(function () {
  if (typeof (WScript) === 'object') {
    var wsshell = new ActiveXObject("WScript.Shell");

    console = {
      log: function (textdata) { WScript.Echo(textdata); }
    }

    ReadInput = function (callBack) { callBack(WScript.StdIn.ReadLine()); }

    ReadLine = function (fs, fileHandle, lineFunction) {
      while (!fileHandle.AtEndOfStream) {
        var blStop = lineFunction(fileHandle.ReadLine());
        if (blStop) break;
      };
    }

    SysCommand = function (cmd) {
      var result = '', objExec = wsshell.Exec(cmd);
      while (!objExec.StdOut.AtEndOfStream) result += (objExec.StdOut.ReadLine() + '\n');
      return result;
    }

  } else {
    var readline = require('readline');
    var execSync = require('child_process').execSync;

    ReadInput = function (callBack) {
      var output;
      var rl = readline.createInterface(process.stdin, process.stdout);
      rl.on('line', function (line) {
        rl.close();
        callBack(line);
      });
    };

    ReadLine = function (fs, fileHandle, lineFunction) {
      var LINE_BUFFER_SIZE = 65536;  // 64Kb line buffer
      var lineBuffer = new Buffer(LINE_BUFFER_SIZE);
      var leftOver = '';
      var read, line, idxStart, idx;
      while ((read = fs.readSync(fileHandle, lineBuffer, 0, LINE_BUFFER_SIZE, null)) !== 0) {
        leftOver += lineBuffer.toString('utf8', 0, read);
        idxStart = 0
        while ((idx = leftOver.indexOf("\n", idxStart)) !== -1) {
          line = leftOver.substring(idxStart, idx);
          idxStart = idx + 1;
          if (line.slice(-1) === '\r') line = line.slice(0, line.length - 1);
          var blStop = lineFunction(line);
          if (blStop) return;
        }
        leftOver = leftOver.substring(idxStart);

        if (leftOver) {
          if (leftOver.slice(-1) === '\r') leftOver = leftOver.slice(0, leftOver.length - 1);
          lineFunction(leftOver);
        }
      }
    }

    SysCommand = function (cmd) {
      return execSync(cmd).toString();
    }
  }

  /** Common functions **/
  MakeFullPath = function (fs, targetDir) {
    var folders = targetDir.split('/');
    var currentPath = '', createPath = '';
    for (var i = 0; i < folders.length; i++) {
      currentPath = folders[i] === '' ? '/' : (currentPath + '/' + folders[i]);
      createPath = currentPath.slice(1);
      if (createPath && !fs.existsSync(createPath)) fs.mkdirSync(createPath);
    }
  }

})();



(function () {
  /*
     json_parse.js
     2016-05-02
  */
  var json_parse = (function () {
    "use strict"; var at, ch, escapee = { '"': '"', '\\': '\\', '/': '/', b: '\b', f: '\f', n: '\n', r: '\r', t: '\t' }, text, error = function (m) { throw { name: 'SyntaxError', message: m, at: at, text: text } }, next = function (c) {
      if (c && c !== ch) { error("Expected '" + c + "' instead of '" + ch + "'") }
      ch = text.charAt(at); at += 1; return ch
    }, number = function () {
      var number, string = ''; if (ch === '-') { string = '-'; next('-') }
      while (ch >= '0' && ch <= '9') { string += ch; next() }
      if (ch === '.') { string += '.'; while (next() && ch >= '0' && ch <= '9') { string += ch } }
      if (ch === 'e' || ch === 'E') {
        string += ch; next(); if (ch === '-' || ch === '+') { string += ch; next() }
        while (ch >= '0' && ch <= '9') { string += ch; next() }
      }
      number = +string; if (!isFinite(number)) { error("Bad number") } else { return number }
    }, string = function () {
      var hex, i, string = '', uffff; if (ch === '"') {
        while (next()) {
          if (ch === '"') { next(); return string } else if (ch === '\\') {
            next(); if (ch === 'u') {
              uffff = 0; for (i = 0; i < 4; i += 1) {
                hex = parseInt(next(), 16); if (!isFinite(hex)) { break }
                uffff = uffff * 16 + hex
              }
              string += String.fromCharCode(uffff)
            } else if (typeof escapee[ch] === 'string') { string += escapee[ch] } else { break }
          } else { string += ch }
        }
      }
      error("Bad string")
    }, white = function () { while (ch && ch <= ' ') { next() } }, word = function () {
      switch (ch) { case 't': next('t'); next('r'); next('u'); next('e'); return !0; case 'f': next('f'); next('a'); next('l'); next('s'); next('e'); return !1; case 'n': next('n'); next('u'); next('l'); next('l'); return null }
      error("Unexpected '" + ch + "'")
    }, value, array = function () {
      var array = []; if (ch === '[') {
        next('['); white(); if (ch === ']') { next(']'); return array }
        while (ch) {
          array.push(value()); white(); if (ch === ']') { next(']'); return array }
          next(','); white()
        }
      }
      error("Bad array")
    }, object = function () {
      var key, object = {}; if (ch === '{') {
        next('{'); white(); if (ch === '}') { next('}'); return object }
        while (ch) {
          key = string(); white(); next(':'); if (Object.hasOwnProperty.call(object, key)) { error('Duplicate key "' + key + '"') }
          object[key] = value(); white(); if (ch === '}') { next('}'); return object }
          next(','); white()
        }
      }
      error("Bad object")
    }; value = function () { white(); switch (ch) { case '{': return object(); case '[': return array(); case '"': return string(); case '-': return number(); default: return ch >= '0' && ch <= '9' ? number() : word() } }; return function (source, reviver) {
      var result; text = source; at = 0; ch = ' '; result = value(); white(); if (ch) { error("Syntax error") }
      return typeof reviver === 'function' ? (function walk(holder, key) {
        var k, v, value = holder[key]; if (value && typeof value === 'object') { for (k in value) { if (Object.prototype.hasOwnProperty.call(value, k)) { v = walk(value, k); if (v !== undefined) { value[k] = v } else { delete value[k] } } } }
        return reviver.call(holder, key, value)
      }({ '': result }, '')) : result
    }
  }())

  JSON = typeof (JSON) === 'object' ? JSON : { parse: json_parse }
})();