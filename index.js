const path = require("node:path");
const { run: jscodeshift } = require("jscodeshift/src/Runner");

const transformPath = path.resolve("./transformers/atom.packages.activatePackage.js");
const paths = [ "test.js" ];
const options = {
  dry: true,
  print: true,
  verbose: 1,
  old_package_name: "language-atom",
  new_package_name: "language-pulsar"
};

(async () => {

  const res = await jscodeshift(transformPath, paths, options);
  console.log(res);

})();
