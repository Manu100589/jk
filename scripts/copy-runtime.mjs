import { copyFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const output = resolve("assets/runtime");
await mkdir(output, { recursive: true });
await copyFile(resolve(".site-build/site-runtime.js"), resolve(output, "site-runtime.js"));
await copyFile(resolve(".site-build/style.css"), resolve(output, "site-runtime.css"));
console.log("Static runtime copied to assets/runtime for GitHub Pages.");
