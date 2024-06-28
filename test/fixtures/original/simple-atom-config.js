atom.config.observe("language-atom.settingValue", (value) => {
  doThing();
});

const value = atom.config.get("language-atom.settingValue");

atom.config.set("language-atom.settingValue", false);
