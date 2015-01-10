// - -------------------------------------------------------------------- - //
// - libs

var SymbolsSidebarView = require("./view.js");
var CompositeDisposable = require("atom").CompositeDisposable;

// - -------------------------------------------------------------------- - //
// - SymbolsSidebar

var SymbolsSidebar = {

  rightPanel: null,
  subscriptions: null,
  symbolsSidebarView: null,

  // .active(state) :void
  activate: function(state) {

    this.subscriptions = new CompositeDisposable();

    this.symbolsSidebarView = new SymbolsSidebarView(state.symbolsSidebarView);

    this.rightPanel = atom.workspace.addRightPanel({
      item: this.symbolsSidebarView.getElement(),
      visible: false,
    });

    this.subscriptions.add(
      atom.commands.add(
        "atom-text-editor",
        "symbols-sidebar:toggle",
        this.toggle.bind(this)
      )
    );

  },

  // .serialize() :Object
  serialize: function() {
    return {
      symbolsSidebarView: this.symbolsSidebarView.serialize(),
    };
  },

  // .deactivate() :void
  deactivate: function() {
    this.rightPanel.destroy();
    this.subscriptions.dispose();
    this.symbolsSidebarView.destroy();
  },

  // .toggle() :void
  toggle: function() {
    var panel = this.rightPanel;
    if (panel.isVisible()) {
      panel.hide();
    } else {
      panel.show();
      this.symbolsSidebarView.refreshEditor();
    }
  },

};

// - -------------------------------------------------------------------- - //
// - exports

module.exports = SymbolsSidebar;

// - -------------------------------------------------------------------- - //
