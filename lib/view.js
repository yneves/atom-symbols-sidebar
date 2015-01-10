// - -------------------------------------------------------------------- - //
// - libs

var Symbols = require("./symbols.js");
var CompositeDisposable = require("atom").CompositeDisposable;

// - -------------------------------------------------------------------- - //
// - class SymbolsSidebarView

// new SymbolsSidebarView(state) :SymbolsSidebarView
function SymbolsSidebarView(state) {
  this.subscriptions = new CompositeDisposable();
  this.element = document.createElement("div");
  this.element.className = "symbols-sidebar";
  this.subscriptions.add(
    atom.workspace.onDidChangeActivePaneItem(
      this.refresh.bind(this)
    )
  );
}

SymbolsSidebarView.prototype = {

  // .getElement() :HTMLElement;
  getElement: function() {
    return this.element;
  },

  // .getEditor() :TextEditor
  getEditor: function() {
    return atom.workspace.getActiveEditor();
  },

  // .refresh() :void
  refresh: function() {
    var editor = this.getEditor();
    if (editor) {
      var elm = this.element;
      var children = elm.childNodes;
      var symbols = Symbols.find(editor);
      var length = symbols.length;
      for (var i = 0; i < length; i++) {
        var symbol = symbols[i];
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
