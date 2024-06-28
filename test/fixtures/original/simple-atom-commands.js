atom.commands.add("atom-text-editor", "language-atom:do-thing", () => {
  shell.openExternal();
});

atom.commands.add("atom-text-editor", {
  "language-atom:do-thing": function (event) {
    doThing();
  }
});

atom.commands.add("atom-text-editor", "different-package:do-thing", () => {
  shell.openExternal();
});
