/*
  Tranforms:

  const { CompositeDisposable, Emitter } = require("atom");

  To:

  const { CompositeDisposable, Emitter } = require("pulsar");

  ==============================================================================

  This doesn't actually serve any purpose. Instead was a practice run to
  understand how codemods via jscodeshift function.

*/

module.exports =
function transform(fileInfo, api, options) {

  const j = api.jscodeshift;
  const root = j(fileInfo.source);

  // Finds all instances of:
  // `require("atom")`
  const atomRequires = root.find(j.VariableDeclarator, {
    init: {
      callee: {
        name: "require"
      },
      arguments: [
        {
          type: "Literal",
          value: "atom"
        }
      ]
    }
  });

  atomRequires.forEach(p => {
    p.node.init.arguments[0].value = "pulsar";
  });

  return root.toSource();
}
