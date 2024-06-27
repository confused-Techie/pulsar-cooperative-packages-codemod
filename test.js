const { CompositeDisposable, Emitter } = require('atom');

atom.commands.add("atom-text-editor", "language-atom:do-thing", () => {
  shell.openExternal();
});

atom.config.observe("language-atom.settingValue", (value) => {
  doThing();
});

const value = atom.config.get("language-atom.settingValue");

// For use in tests
const activationPromise = atom.packages.activatePackage("language-atom");

atom.commands.add("atom-text-editor", {
  "language-atom:do-thing": function (event) {
    doThing();
  }
});

atom.packages.enablePackage("language-atom");
