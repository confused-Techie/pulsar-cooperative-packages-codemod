/*
  Assuming:
    * old_package_name = "language-atom"
    * new_package_name = "language-pulsar"

  Transforms:

  atom.commands.add("atom-text-editor", "language-atom:do-thing", () => {
    shell.openExternal();
  });

  To:

  atom.commands.add("atom-text-editor", "language-pulsar:do-thing", () => {
    shell.openExternal();
  });

  ==============================================================================

  Transforms:

  atom.commands.add("atom-text-editor", {
    "language-atom:do-thing": function (event) {
      doThing();
    }
  });

  To:

  atom.commands.add("atom-text-editor", {
    "language-pulsar:do-thing": function (event) {
      doThing();
    }
  });

*/

module.exports =
function transform(fileInfo, api, options) {

  const j = api.jscodeshift;
  const root = j(fileInfo.source);

  // Finds all instances of:
  // `atom.commands.add()`
  const atomCommands = root.find(j.CallExpression, {
    callee: {
      object: {
        type: "MemberExpression",
        object: {
          type: "Identifier",
          name: "atom"
        },
        property: {
          type: "Identifier",
          name: "commands"
        }
      },
      property: {
        type: "Identifier",
        name: "add"
      }
    }
  });

  atomCommands.forEach(p => {
    let argument = p.node.arguments[1];

    if (argument.type == "ObjectExpression") {
      let commandName = argument.properties[0].key.value.split(":");

      if (commandName[0] == options.old_package_name) {
        commandName[0] = options.new_package_name;

        p.node.arguments[1].properties[0].key.value = commandName.join(":");
      }

    } else if (argument.type == "Literal") {
      let commandName = argument.value.split(":");

      if (commandName[0] == options.old_package_name) {
        commandName[0] = options.new_package_name;

        p.node.arguments[1].value = commandName.join(":");
      }
    }

  });

  return root.toSource();
}
