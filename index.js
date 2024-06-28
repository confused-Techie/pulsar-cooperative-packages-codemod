const path = require("node:path");
const fs = require("fs");
const { run: jscodeshift } = require("jscodeshift/src/Runner");

// Handle Arguments
const args = process.argv.slice(2);
const params = {
  dev: false,
  dry: false,
  print: false,
  verbose: 0,
  newName: null,
  oldName: null,
  paths: []
};

for (let i = 0; i < args.length; i++) {
  if (args[i] == "--dry") {
    params.dry = true;
  }
  if (args[i] == "--print") {
    params.print = true;
  }
  if (args[i]?.startsWith("--verbose=")) {
    params.verbose = args[i].split("=")[1];
  }
  if (args[i]?.startsWith("--newName=")) {
    params.newName = args[i].split("=")[1];
  }
  if (args[i]?.startsWith("--oldName=")) {
    params.oldName = args[i].split("=")[1];
  }
  if (args[i]?.startsWith("--paths=")) {
    params.paths = args[i].split("=")[1].split(",");
  }
}

// Setup Transformations
const transformersPath = "./transformers";
const paths = params.paths;
const options = {
  dry: params.dry,
  print: params.print,
  verbose: params.verbose,
  old_package_name: params.oldName,
  new_package_name: params.newName
};

// Execute Transformations
(async () => {

  const transformers = fs.readdirSync(transformersPath);

  for (const transformer of transformers) {
    console.log(`Running Transformer: ${transformer}`);
    const transformPath = path.resolve(path.join(transformersPath, transformer));

    const res = await jscodeshift(transformPath, paths, options);

    if (res.error > 0) {
      // If there is an error on this transform
      console.log(`Failed transform: ${transformer}`);
      throw res;
    }
  }

})();
