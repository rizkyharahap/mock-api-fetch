const esbuild = require("esbuild");
const { execSync } = require("child_process");
const { dependencies } = require("./package.json");

// Step 1: Generate TypeScript declaration files using `tsc`
console.log("Generating type declarations...");
execSync("tsc --project tsconfig.json");

// Step 2: Build JavaScript bundles with esbuild
console.log("Building JavaScript bundles with esbuild...");

const sharedConfig = {
  entryPoints: ["src/index.ts"],
  bundle: true,
  minify: true,
  sourcemap: true,
  external: Object.keys(dependencies || {}),
  target: ["es2020"],
  logLevel: "info",
};

// Build ESM
esbuild.build({
  ...sharedConfig,
  format: "esm",
  outfile: "dist/unready-fetch.esm.js",
});

// Build CommonJS
esbuild.build({
  ...sharedConfig,
  format: "cjs",
  outfile: "dist/unready-fetch.cjs.js",
});

console.log("Build completed successfully!");
