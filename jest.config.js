/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    bail: 2,
    modulePathIgnorePatterns: ["<rootDir>/dist/"],
    preset: "ts-jest",
    testEnvironment: "node",
}
