const path = require("node:path");
const fs = require("fs");
const { run: jscodeshift } = require("jscodeshift/src/Runner");

// Handle Arguments
const args = process.argv.slice(2);
const params = {
  dev: false,
  newName: null,
  oldName: null
};

for (let i = 0; i < args.length; i++) {
  if (args[i] == "--dev") {
    params.dev = true;
  }
  if (args[i]?.startsWith("--newName")) {
    params.newName = args[i].split("=")[1];
  }
  if (args[i]?.startsWith("--oldName")) {
    params.oldName = args[i].split("=")[1];
  }
}

console.log(params);

// Setup Transformations
const transformersPath = "./transformers";
const paths = [ "test.js" ];
const options = {
  dry: (params.dev ? true : false),
  print: (params.dev ? true : false),
  verbose: (params.dev ? 1 : 0),
  old_package_name: params.oldName,
  new_package_name: params.newName
};

// Execute Transformations
(async () => {

  const transformers = fs.readdirSync(transformersPath);

  for (const transformer of transformers) {
    const transformPath = path.resolve(path.join(transformersPath, transformer));

    const res = await jscodeshift(transformPath, paths, options);
    console.log(res);
  }

})();
