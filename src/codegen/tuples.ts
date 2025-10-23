import * as fs from "fs";

import { genArray } from "../common";

export { printCode, tupleInstancePrefix };

const tupleInstancePrefix = "Tp"

const printCode = () => {
    const tuples = genArray(8, (i: number) => `${tupleInstancePrefix}${i + 2}`).join(", ");

    const lines: string[] = [
        `export { ${tuples} };`,
        "",
        "abstract class Tuple {}",
        "", 
    ];

    for (let i = 2; i <= 9; i++) {
        lines.push(header(i));
        for (let j = 1; j <= i; j++) {
            lines.push(field(j));
        }
        lines.push("");
        pushTConstructor(lines, i);
        lines.push("}");
        lines.push("");
    }

    writeToFile(lines.join("\n"));
}

const writeToFile = (content: string): void => {
    try {
        fs.writeFileSync("src/parser/combinator/generated/tuples.ts", content, "utf-8");
    } catch (error) {
        console.error("Error writing file: ", error);
    }
}

const header = (i: number): string => {
    const types = genArray(i, (j) => `T${j + 1}`).join(", ");
    return `class ${tupleInstancePrefix}${i}<${types}> extends Tuple {`;
}

const field = (i: number): string => {
    return `    readonly _${i}: T${i};`
}

const pushTConstructor = (arr: string[], i: number): void => {
    const args = genArray(i, (j) => `_${j + 1}: T${j + 1}`).join(", ");
    arr.push(`    constructor(${args}) {`);
    arr.push("        super();")
    for (let j = 1; j <= i; j++) {
        arr.push(`        this._${j} = _${j};`);
    }
    arr.push("    }");
}

printCode();


