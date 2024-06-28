atom.config.observe("language-pulsar.settingValue", (value) => {
  doThing();
});

const value = atom.config.get("language-pulsar.settingValue");

atom.config.set("language-pulsar.settingValue", false);
