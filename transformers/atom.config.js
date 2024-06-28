/*
  Assuming:
    * old_package_name = "language-atom"
    * new_package_name = "language-pulsar"

  Transforms:

  atom.config.observe("language-atom.settingValue", (value) => {
    doThing();
  });

  To:

  atom.config.observe("language-pulsar.settingValue", (value) => {
    doThing();
  });

  ==============================================================================

  Transforms:

  const value = atom.config.get("language-atom.settingValue");

  To:

  const value = atom.config.get("language-pulsar.settingValue");

*/

const SUPPORTED_PROPERTIES = [
  "observe", "onDidChange", "get", "getAll", "set", "unset", "getSchema"
];

module.exports =
function transform(fileInfo, api, options) {

  const j = api.jscodeshift;
  const root = j(fileInfo.source);
  
  const atomConfig = root.find(j.CallExpression, {
    callee: {
      type: "MemberExpression",
      object: {
        type: "MemberExpression",
        object: {
          type: "Identifier",
          name: "atom"
        },
        property: {
          type: "Identifier",
          name: "config"
        }
      },
      property: {
        type: "Identifier",
        name: (v) => {
          return SUPPORTED_PROPERTIES.includes(v);
        }
      }
    }
  });

  atomConfig.forEach(p => {
    let configName = p.node.arguments[0].value.split(".");

    if (configName[0] == options.old_package_name) {
      configName[0] = options.new_package_name;

      p.node.arguments[0].value = configName.join(".");
    }
  });

  return root.toSource();
}
