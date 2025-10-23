import * as fs from "fs";
import { genArray } from "../common";
import { tupleInstancePrefix } from "./tuples";

export { printCode };

const printCodeN = (n: number): void => {
    const imports: string[] = [
        "/* eslint-disable @typescript-eslint/no-explicit-any */",
        'import type { int } from "../../../common";',
        'import type { Context } from "../../../core/context";',
        'import { Parser } from "../../../core/parser";',
        'import { Failure, type Result } from "../../../core/result";',
        'import type { SequentialParser } from "../../utils/sequential";',
        `import { Tp${n} } from "./tuples";`,
    ]

    const types: string[] = genArray(n, (i: number) => `T${i + 1}`);
    const typeGenerics: string = `<${types.join(", ")}>`;
    const tupleN: string = `${tupleInstancePrefix}${n}`
    const tuple: string = `${tupleN}${typeGenerics}`;
    const parsers: string[] = genArray(n, (i: number) => `parser${i + 1}`);
    const parsersWithTypes: string[] = genArray(n, (i: number) => `${parsers[i]}: Parser<${types[i]}>`);
    const seqN: string[] = [
        `const seq${n} = ${typeGenerics}(${parsersWithTypes.join(", ")}): Parser<${tupleN}${typeGenerics}> => {`,
        `    return new SequenceParser${n}${typeGenerics}(${parsers.join(", ")});`,
        `}`,
    ];
    const fields: string[] = parsersWithTypes.map(indent(4));
    const fieldAssignments: string[] = parsers.map((s) => `this.${s} = ${s};`).map(indent(4));

    const cnstrctr: string[] = [
        `constructor(${parsersWithTypes.join(", ")}) {`,
        "    super();",
        ...fieldAssignments,
        "}",
        "",
    ].map(indent(4));

    const resultValues: string = genArray(n, (i) => `result${i + 1}.value`).join(", ");

    const parseOn: string[] = [
        `override parseOn(context: Context): Result<${tuple}> {`,
        ...results(n),
        `    return result${n}.success(new ${tupleN}(${resultValues}));`,
        "}",
    ].map(indent(4));

    const fastParseOn: string[] = [
        `override fastParseOn(buffer: string, position: int | number): int {`,
        ...fpResults(n),
        `    return position as int;`,
        "}",
    ]

    const children: string[] = [
        "override get children(): Parser<any>[] {",
        `    return [${parsers.map((p) => `this.${p}`).join(", ")}];`,
        "}",
    ].map(indent(4));

    const replace: string[] = [
        "override replace(source: Parser<any>, target: Parser<any>): void {",
        "super.replace(source, target);",
        ...replaces(n),
        "}",
    ].map(indent(4));

    const copy: string[] = [
        `copy(): SequenceParser${n}${typeGenerics} {`,
        `    return new SequenceParser${n}${typeGenerics}(${parsers.map((p) => `this.${p}`).join(", ")});`,
        "}",
    ].map(indent(4));

    const isSequential: string[] = [
        `override get isSequential(): boolean {`,
        `    return true;`,
        `}`,
    ].map(indent(4));

    const seqParser: string[] = [
        `class SequenceParser${n}${typeGenerics} extends SequentialParser<${tuple}> {`,
        ...fields,
        "",
        ...cnstrctr,
        "",
        ...parseOn,
        "",
        ...fastParseOn,
        "",
        ...children,
        "",
        ...replace,
        "",
        ...copy,
        "",
        ...isSequential,
        "}",
    ];
    
    const lines: string[] = [
        ...imports,
        "",
        `export { SequenceParser${n}, seq${n} };`,
        "",
        ...seqN,
        "",
        ...seqParser,
    ]

    writeToFileN(n, lines.join("\n"));
}

const writeToFileN = (n: number, content: string): void =>{
    const file: string = `src/parser/combinator/generated/sequence_${n}.ts`;
    
    try {
        fs.writeFileSync(file, content, "utf-8");
    } catch (error) {
        console.error(`Error writing file ${file}`, error)
    }
}

const indent = (spaces: number): ((s: string) => string) => {
    return (s: string) => `${" ".repeat(spaces)}${s}`;
}

const results = (n: number): string[] => {
    const value: string[] = [];
    for (let i = 1; i <= n; i++) {
        value.push(...result(i));
    };
    return value;
}

const result = (i: number): string[] => {
    return [
        `const result${i}: Result<T${i}> = this.parser${i}.parseOn(context);`,
        `if (result${i} instanceof Failure) {`,
        `    return result${i};`,
        "}",
    ].map(indent(4));
}

const fpResults = (n: number): string[] => {
    const value: string[] = [];
    for (let i = 1; i <= n; i++) {
        value.push(...fpResult(i));
    }
    return value;
}

const fpResult = (i: number): string[] => {
    return [
        `position = this.parser${i}.fastParseOn(buffer, position as int);`,
        "if (position < 0) {",
        "    return -1 as int;",
        "}",
    ].map(indent(4));

}

const replaces = (n: number): string[] => {
    const value: string[] = [];
    for (let i = 1; i <= n; i++) {
        value.push(...repl(1));
    }
    return value.map(indent(4));
}

const repl = (i: number): string[] => {
    return [
        `if (this.parser${i} === source) {`,
        `    this.parser${i} = target as Parser<T${i}>;`,
        "}",
    ]
}

const printCode = (): void => {
    for (let i: number = 2; i <= 9; i++) {
        printCodeN(i);
    }
}