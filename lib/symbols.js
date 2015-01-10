// - -------------------------------------------------------------------- - //
// - libs

var fs = require("fs");
var path = require("path");

// - -------------------------------------------------------------------- - //
// - Symbols

var Symbols = {

  // .getPattern(editor) :Object
  getPattern: function(editor) {
    var ext = path.extname(editor.getPath());
    var file = path.resolve(__dirname,"../patterns",ext.substr(1) + ".js");
    if (fs.existsSync(file)) {
      var pattern = require(file);
      return pattern;
    }
  },

  // .getLines(editor) :Array
  getLines: function(editor) {
    var text = editor.getText();
    var lines = text.split(/\n/);
    return lines;
  },

  // .match(line,pattern) :Boolean
  match: function(line,pattern) {
    var match = false;
    if (pattern.match instanceof Array) {
      var length = pattern.match.length;
      for (var i = 0; i < length; i++) {
        var re = pattern.match[i];
        if (re instanceof RegExp) {
          if (re.test(line)) {
            match = true;
            break;
          }
        }
      }
    } else if (pattern.match instanceof RegExp) {
      if (pattern.match.test(line)) {
        match = true;
      }
    }
    return match;
  },

  // .label(line,pattern) :String
  label: function(line,pattern) {
    var label = line;
    if (pattern.label instanceof Array) {
      var length = pattern.label.length;
      for (var i = 0; i < length; i++) {
        var re = pattern.label[i];
        if (re instanceof RegExp) {
          var tags = line.match(re);
          if (tags && tags.length > 0) {
            label = tags[1];
            break;
          }
        }
      }
    } else if (pattern.label instanceof RegExp) {
      var tags = line.match(pattern.label);
      if (tags && tags.length > 0) {
        label = tags[1];
      }
    }
    return label;
  },

  // .find(editor) :Array
  find: function(editor) {
    var symbols = [];
    var pattern = this.getPattern(editor);
    if (pattern) {
      var lines = this.getLines(editor,pattern);
      var length = lines.length;
      for (var i = 0; i < length; i++) {
        var line = lines[i];
        if (this.match(line,pattern)) {
          symbols.push({
            line: i,
            label: this.label(line,pattern),
          });
        }
      }
    }
    return symbols;
  },

};

// - -------------------------------------------------------------------- - //
// - exports

module.exports = Symbols;

// - -------------------------------------------------------------------- - //
