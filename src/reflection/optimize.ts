/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Parser } from "../core/parser.js";
import { Analyzer } from "./analyzer.js";
import { CharacterRepeater, FlattenChoice, RemoveDelegate, RemoveDuplicate } from "./internal/optimize_rules.js";

export { OptimizeRule, type ReplaceParser, optimize };

type ReplaceParser<T> = (source: Parser<T>, target: Parser<T>) => void;

abstract class OptimizeRule {
    constructor() {
    }

    abstract run<T>(analyzer: Analyzer, parser: Parser<T>, replace: ReplaceParser<T>): void;
}

const allOptimizerRules: OptimizeRule[] = [
    new CharacterRepeater(),
    new FlattenChoice(),
    new RemoveDelegate(),
    new RemoveDuplicate(),
];

const optimize = <T>(
    parser: Parser<T>,
    callback?: ReplaceParser<any>,
    rules?: OptimizeRule[],
): Parser<T> => {
    const analyzer = new Analyzer(parser);
    const selectedRules = rules ?? allOptimizerRules;
    const replacements: Map<Parser<any>, Parser<any>> = new Map();
    for (const p of analyzer.parsers) {
        p.captureResultGeneric(<P>(parsr: Parser<P>) => {
            for (const rule of selectedRules) {
                rule.run<P>(analyzer, parsr, (a, b) => {
                    if (callback) {
                        callback(a, b);
                    }
                    replacements.set(a, b);
                });
            }
        });
    }
    if (replacements.size > 0) {
        for (const p of analyzer.parsers) {
            for (const replacement of replacements.entries()) {
                p.replace(replacement[0], replacement[1]);
            }
        }
        return replacements.get(parser) as Parser<T> ?? parser;
    }
    return parser;
}