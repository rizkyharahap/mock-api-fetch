/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: "ts-jest/presets/default-esm", // Use the ESM preset
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": [
      "esbuild-jest",
      {
        loaders: {
          ".spec.ts": "ts",
        },
      },
    ],
  },
  extensionsToTreatAsEsm: [".ts"],
  moduleFileExtensions: ["ts", "js", "json", "node"],
  testMatch: ["<rootDir>/src/**/*.test.(ts|js)"],
  clearMocks: true,
  verbose: true,
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
  transformIgnorePatterns: ["<rootDir>/node_modules/"],
  moduleDirectories: ["node_modules", "src"],
};
