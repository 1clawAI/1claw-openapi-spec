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
writeFileSync(jsonDest, JSON.stringify(doc, null, 2));

console.log("Generated openapi.json from openapi.yaml");
