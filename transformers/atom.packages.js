/*
  Assuming:
    * old_package_name = "language-atom"
    * new_package_name = "language-pulsar"

  Transforms:

  const activationPromise = atom.packages.activatePackage("language-atom");

  To:

  const activationPromise = atom.packages.activatePackage("language-pulsar");

  ==============================================================================

  Transforms:

  atom.packages.enablePackage("language-atom");

  To:

  atom.packages.enablePackage("language-pulsar");

*/

const SUPPORTED_PROPERTIES = [
  "activatePackage", "disablePackage", "enablePackage", "resolvePackagePath",
  "isBundledPackage", "isPackageDisabled", "isPackageActive", "isPackageLoaded"
];

module.exports =
function transform(fileInfo, api, options) {

  const j = api.jscodeshift;
  const root = j(fileInfo.source);

  const atomPackagesActivatePackage = root.find(j.CallExpression, {
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
          name: "packages"
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

  atomPackagesActivatePackage.forEach(p => {
    if (p.node.arguments[0].value == options.old_package_name) {
      p.node.arguments[0].value = options.new_package_name;
    }
  });

  return root.toSource();
}
