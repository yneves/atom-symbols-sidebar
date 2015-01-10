// - -------------------------------------------------------------------- - //
// - libs

var Symbols = require("./symbols.js");
var CompositeDisposable = require("atom").CompositeDisposable;

// - -------------------------------------------------------------------- - //
// - class SymbolsSidebarView

// new SymbolsSidebarView(state) :SymbolsSidebarView
function SymbolsSidebarView(state) {
  this.symbols = [];
  this.subscriptions = new CompositeDisposable();
  this.element = document.createElement("div");
  this.element.className = "symbols-sidebar";
  this.resizableElement();
  this.subscriptions.add(
    atom.workspace.onDidChangeActivePaneItem(
      this.refreshEditor.bind(this)
    )
  );
}

SymbolsSidebarView.prototype = {

  // .getElement() :HTMLElement
  getElement: function() {
    return this.element;
  },

  // .getEditor() :TextEditor
  getEditor: function() {
    return atom.workspace.getActiveEditor();
  },

  // .getCursorLine()
  getCursorLine: function() {
    var editor = this.getEditor();
    if (editor) {
      var position = editor.getCursorBufferPosition();
      if (position) {
        return position.row;
      }
    }
  },

  // .refreshEditor()
  refreshEditor: function() {
    if (this.editorSubscriptions) {
      this.editorSubscriptions.dispose();
    }
    var editor = this.getEditor();
    if (editor) {
      this.editorSubscriptions = new CompositeDisposable();
      this.symbols = Symbols.find(editor);
      this.refreshSymbols();
      this.selectSymbol();
      this.editorSubscriptions.add(
        editor.onDidChangeCursorPosition(function(data) {
          if (data.oldBufferPosition.row != data.newBufferPosition.row) {
            this.selectSymbol(data.newBufferPosition.row);
          }
        }.bind(this))
      );
      this.editorSubscriptions.add(
        editor.onDidSave(function() {
          this.symbols = Symbols.find(editor);
          this.refreshSymbols();
          this.selectSymbol();
        }.bind(this))
      );
    }
  },

  // .refreshSymbols() :void
  refreshSymbols: function() {
    var editor = this.getEditor();
    if (editor) {
      var elm = this.element;
      var children = elm.childNodes;
      var length = this.symbols.length;
      for (var i = 0; i < length; i++) {
        var symbol = this.symbols[i];
        var node = children[i];
        if (!node) {
          node = document.createElement("div");
          elm.appendChild(node);
        }
        node.innerHTML = symbol.label;
        node.lineNumber = symbol.line;
        node.onclick = function() {
          editor.setCursorBufferPosition([this.lineNumber,0]);
        };
      }
      while (children.length > length) {
        elm.removeChild(children[children.length - 1]);
      }
    }
  },

  // .selectSymbol(line) :void
  selectSymbol: function(line) {
    if (typeof line === "undefined" || line === null) {
      line = this.getCursorLine();
    }
    if (typeof line === "number") {
      var elm = this.element;
      var children = elm.childNodes;
      var length = this.symbols.length;
      for (var i = 0; i < length; i++) {
        var node = children[i];
        var symbol = this.symbols[i];
        var nextSymbol = this.symbols[i+1];
        if (symbol.line <= line && (!nextSymbol || nextSymbol.line > line)) {
          if (node.className != "selected") {
            node.className = "selected";
          }
        } else {
          if (node.className != "") {
            node.className = "";
          }
        }
      }
    }
  },

  // .resizableElement() :void
  resizableElement: function() {
    var elm = this.element;
    var pos;
    var over;
    var start;
    var width;
    var resizing;
    var distance = 8;
    var resize = function(event) {
      var left = event.pageX;
      var resized = start - left;
      elm.style.width = (width + resized).toString() + "px";
    };
    elm.addEventListener("mouseenter",function() {
      var left = 0;
      var node = this;
      while (node) {
        left += parseInt(node.offsetLeft);
        node = node.offsetParent;
      }
      pos = left;
    });
    elm.addEventListener("mousedown",function(event) {
      if (over) {
        start = event.pageX;
        width = this.offsetWidth;
        resizing = true;
        document.addEventListener("mousemove",resize);
      }
    });
    elm.addEventListener("mouseup",function(event) {
      if (resizing) {
        start = undefined;
        width = undefined;
        resizing = false;
        document.removeEventListener("mousemove",resize);
      }
    });
    elm.addEventListener("mousemove",function(event) {
      if (!resizing) {
        over = event.pageX < pos + distance;
        if (over) {
          this.style.cursor = "w-resize";
        } else {
          this.style.cursor = "default";
        }
      }
    });
  },

  // .destroy() :void
  destroy: function() {
    var elm = this.element;
    elm.parentNode.removeChild(elm);
    this.subscriptions.dispose();
  },

  // .serialize() :Object
  serialize: function() {
  },

};

// - -------------------------------------------------------------------- - //
// - exports

module.exports = SymbolsSidebarView;

// - -------------------------------------------------------------------- - //
