// Here we orchestrate the test run without using the excess of a framework, due to how simple our testing will be.

const fs = require("fs");
const path = require("path");
const child_process = require("node:child_process");
const { diff } = require("jest-diff");

const GREEN_TEXT_OUT = '\x1b[32m%s\x1b[0m';
const RED_TEXT_OUT = '\x1b[31m%s\x1b[0m';

let TOTAL_ERRORS = 0;

(async () => {

  // First lets move all our test files to the `./instanced` directory
  fs.cpSync("./test/fixtures/original/", "./test/fixtures/instanced/", { force: true, recursive: true });

  // Then we run the transforms, capturing whatever the output may be
  child_process.execSync(`node ./index.js ${process.argv.slice(2).join(" ")}`, (error, stdout, stderr) => {
    // TODO Find out why I can't log any of this?
    if (error) {
      console.log(RED_TEXT_OUT, "Codemod failed to execute!");
      console.log(error);
      TOTAL_ERRORS++;
    } else if (stderr) {
      console.log(RED_TEXT_OUT, "Codemod failed to execute via stderr!");
      console.log(stderr);
      TOTAL_ERRORS++;
    } else {
      console.log(GREEN_TEXT_OUT, "Codemod executed successfully.");
    }

  });

  // Then we want to compare the `./modified` files to what's been changed in `./intanced`

  const instancedOutput = {};

  const instancedFiles = fs.readdirSync("./test/fixtures/instanced");

  for (const file of instancedFiles) {
    instancedOutput[file] = fs.readFileSync(`./test/fixtures/instanced/${file}`, { encoding: "utf8" });
  }

  const modifiedOutput = {};

  const modifiedFiles = fs.readdirSync("./test/fixtures/modified");

  for (const file of modifiedFiles) {
    modifiedOutput[file] = fs.readFileSync(`./test/fixtures/modified/${file}`, { encoding: "utf8" });
  }

  // Now to do the actual comparison of files

  for (const file in instancedOutput) {
    let instanced = instancedOutput[file];
    let modified = modifiedOutput[file];

    if (instanced !== modified) {
      console.log(RED_TEXT_OUT, `Transformed files do not match: '${file}'!`);
      const difference = diff(modified, instanced, {
        // We define `aColor` & `bColor` because `chalk.RED` & `chalk.GREEN`
        // don't seem to show up in GitHub Actions. But these values do
        aColor: (val) => {
          return `\x1b[32m${val}\x1b[0m`;
        },
        bColor: (val) => {
          return `\x1b[31m${val}\x1b[0m`;
        }
      });
      console.log(difference);
      TOTAL_ERRORS++;
    } else {
      console.log(GREEN_TEXT_OUT, `Successfully transformed: '${file}'`);
    }
  }

  // Now to handle if we had any failures
  if (TOTAL_ERRORS > 0) {
    console.log(RED_TEXT_OUT, "Test failed! Read above for details.");
    process.exit(1);
  } else {
    console.log(GREEN_TEXT_OUT, "All tests passed!");
    process.exit(0);
  }

})();
