#!/usr/bin/env node
import { readFileSync, writeFileSync, copyFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import jsYaml from "js-yaml";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgRoot = resolve(__dirname, "..");
const repoRoot = resolve(pkgRoot, "../..");

const specSource = resolve(repoRoot, "openapi.yaml");
const yamlDest = resolve(pkgRoot, "openapi.yaml");
const jsonDest = resolve(pkgRoot, "openapi.json");

copyFileSync(specSource, yamlDest);

const yaml = readFileSync(specSource, "utf-8");
const doc = jsYaml.load(yaml);
writeFileSync(jsonDest, JSON.stringify(doc, null, 2));

console.log("Copied openapi.yaml and generated openapi.json");
