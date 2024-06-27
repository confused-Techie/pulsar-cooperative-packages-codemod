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
