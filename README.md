# pulsar-cooperative-packages-codemod

This repository is a WIP test on utilizing `jscodeshift` codemods in order to quickly
and effectively "rebrand" a package that's been transferred to the `pulsar-cooperative`
organization.

One of the most manual hurdles when migrating a new package to the organization
is that all instances of the old package name **must** be renamed to the new package name.

So in order to expedite that process this repository contains a collection of codemod
transformers to do this manually, after simply being provided with the old package name
and the new one.

## What does it handle?

Below we will list the Pulsar APIs and features that are handled.

* `atom.commands.add()`: Both the regular and composed instances of this function are supported.
* `atom.config`: Only a subsection of the available commands are supported:
  - `.observe()`
  - `.onDidChange()`
  - `.get()`
  - `.getAll()`
  - `set()`
  - `.unset()`
  - `getSchema()`
* `atom.packages`: Only a subsection of the available commands are supported:
  - `.activatePackage()`
  - `.disablePackage()`
  - `.enablePackage()`
  - `.resolvePackagePath()`
  - `.isBundledPackage()`
  - `.isPackageDisabled()`
  - `.isPackageActive()`
  - `.isPackageLoaded()`

## What doesn't it handle?

Below we will list the Pulsar APIs and features that are **not** handled.

* `keymaps` file: There is not yet support for handling renames via a keymaps file.
* `atom.commands.dispatch()`
* `package.json` file: We currently don't do anything to update this file.
* `README.md` file: We don't do anything to update this file, nor is it very likely that we will.

## Usage

To run this tool use:

```
npm run transform -- --newName=language-pulsar --oldName=language-atom
```

* `newName`: Specifies the new name the package should exist under.
* `oldName`: Specifies the original name of the package.

Other supported parameters:

* `dry`: A boolean to enable dry mode, or otherwise not writing any changes to disc.
* `print`: A boolean to print the results of the transformation.
* `verbose`: A variable that can be set to `1` for increased verbosity.
* `paths`: A comma separated list of file paths.
