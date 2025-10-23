import type { Config } from "jest";

const config: Config = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["<rootDir>/tests"],
    transform: {
        "^.+\\.tsx?$": "ts-jest",
    },

    testRegex: "((\\.|/)(test|spec))\\.tsx?$",

    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"]
}

export default config;
