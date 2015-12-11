var fs = require('fs');
var path = require('path');
var code = (function () {
  var excludeList = ['node_modules', '.git']
  var beautify = require('js-beautify').js_beautify;
  var beautifyOptions = {
    'indent_size': 2,
    'indent_char': ' ',
    'indent_level': 0,
    'indent_with_tabs': false,
    'preserve_newlines': true,
    'max_preserve_newlines': 2,
    'jslint_happy': true,
    'brace_style': 'collapse',
    'keep_array_indentation': false,
    'keep_function_indentation': false,
    'space_before_conditional': true,
    'break_chained_methods': false,
    'eval_code': false,
    'unescape_strings': false,
    'wrap_line_length': 0
  };
  var getFilePath = function (dir) {
    var filePath = dir;
    if (excludeList.indexOf(dir) == -1) {
      fs.readdir(dir, function (err, items) {
        items.forEach(function (file, index, array) {
          if (excludeList.indexOf(file) == -1) {
            filePath = (dir != './') ? dir + '/' + file : file
            if (!fs.statSync(filePath).isFile())
              getFilePath(filePath);
            else if (path.extname(filePath) === '.js') {
              source(filePath)
            }
          }
        });
      });
    }
  };
  var removeEmptyLines = function (data) {
    var rEmptyLines = /^\s*[\r\n]/gm;
    return data.replace(rEmptyLines, '');
  };
  var removeComments = function (data) {
    var rComments = /(?:\/\*(?:[\s\S]*?)\*\/)|(?:([\s;])+\/\/(?:.*)$)/gm;
    return data.replace(rComments, function (match) {
      if (match.indexOf(':retain') != -1)
        return match;
      else
        return '';
    });
  };
  var removeLogs = function (data) {
    var options = {};
    options.namespace = ['console', 'window.console'];
    options.methods = 'log info warn error assert count clear group groupEnd groupCollapsed trace debug dir dirxml profile profileEnd time timeEnd timeStamp table exception'.split(' ')
    rConsole = new RegExp('(' + options.namespace.join('|') + ')' + '.(?:' + options.methods.join('|') + ')\\s{0,}\\([^;]*\\)(?!\\s*[;,]?\\s*\\/\\*\\s*:retain\\s*\\*\\/)\\s{0,};?', 'gi');
    return data.replace(rConsole, '');
  }
  var source = function (file) {
    fs.readFile(file, 'utf8', function (err, data) {
      if (err) {
        throw err;
      }
      data = removeLogs(data)
      data = removeComments(data);
      data = removeEmptyLines(data);
      var beautifiedData = beautify(data, beautifyOptions);
      console.log('file ' + file); /* :retain */
      fs.writeFile(file, beautifiedData, 'utf8', function (err, written, buffer) {
        if (!err) {}
      });
    });
  };
  var clean = function () {
    getFilePath('./')
  }
  return {
    clean
  }
})();
code.clean();
