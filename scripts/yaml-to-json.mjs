#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import jsYaml from "js-yaml";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgRoot = resolve(__dirname, "..");
const yamlPath = resolve(pkgRoot, "openapi.yaml");
const jsonDest = resolve(pkgRoot, "openapi.json");

const yaml = readFileSync(yamlPath, "utf-8");
const doc = jsYaml.load(yaml);

// `info.version` is the package version, not a second number maintained by
// hand. They had drifted: @1claw/openapi-spec@0.59.5 declared "0.58.0", so a
// spec could not be identified from its own contents — which is the whole
// reason a consumer reads info.version rather than the tarball name.
const pkg = JSON.parse(readFileSync(resolve(pkgRoot, "package.json"), "utf-8"));
if (doc.info.version !== pkg.version) {
    console.log(`info.version ${doc.info.version} -> ${pkg.version} (from package.json)`);
    doc.info.version = pkg.version;
}

writeFileSync(jsonDest, JSON.stringify(doc, null, 2));

// Keep the YAML in step too; it is the source of truth everything else is
// generated from, and a stale version there just reintroduces the drift.
writeFileSync(
    yamlPath,
    yaml.replace(/^(\s*version:\s*)"[^"]*"/m, `$1"${pkg.version}"`),
);

console.log("Generated openapi.json from openapi.yaml");
