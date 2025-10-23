/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Parser } from "../core/parser";
import { Analyzer } from "./analyzer";
import { CharacterRepeater, LeftRecursion, NestedChoice, NullableRepeater, OverlappingChoice, RepeatedChoice, UnnecessaryFlatten, UnnecessaryResolveable, UnoptimizedFlatten, UnreachableChoice, UnresolvedSettable, UnusedResult } from "./internal/linter_rules";

export { LinterIssue, LinterRule, LinterType, linter };

enum LinterType {
    info,
    warning,
    error,
}

abstract class LinterRule {
    readonly type: LinterType;
    readonly title: string;

    constructor(type: LinterType, title: string) {
        this.type = type;
        this.title = title;
    }

    abstract run(analyzer: Analyzer, parser: Parser<any>, callback: LinterCallback): void;

    toString(): string {
        return `${this.constructor.name}(${this.type}, ${this.title})}`;
    }
}

class LinterIssue {
    readonly rule: LinterRule;
    readonly parser: Parser<any>;
    readonly description: string;

    constructor(rule: LinterRule, parser: Parser<any>, description: string) {
        this.rule = rule;
        this.parser = parser;
        this.description = description;
    }

    get type(): LinterType {
        return this.rule.type;
    }

    get title(): string {
        return this.rule.title;
    }

    toString(): string {
        return `${this.constructor.name}(${this.type}, ${this.title}, ${this.parser}, ${this.description})`;
    }
}

type LinterCallback = (issue: LinterIssue) => void

const allLinterRules: LinterRule[] = [
    new CharacterRepeater(),
    new LeftRecursion(),
    new NestedChoice(),
    new NullableRepeater(),
    new OverlappingChoice(),
    new RepeatedChoice(),
    new UnnecessaryFlatten(),
    new UnnecessaryResolveable(),
    new UnoptimizedFlatten(),
    new UnreachableChoice(),
    new UnresolvedSettable(),
    new UnusedResult(),
];

const justLinterInfo = new Set([LinterType.info]);

const linter = (
    parser: Parser<any>,
    callback?: LinterCallback,
    rules?: LinterRule[],
    excludedRules: Set<string> = new Set(),
    excludedTypes: Set<LinterType> = justLinterInfo,
): LinterIssue[] => {
    const issues: LinterIssue[] = [];
    const analyzer: Analyzer = new Analyzer(parser);
    const selectedRules: LinterRule[] = rules ?? allLinterRules.filter((rule) =>
        !excludedRules.has(rule.title) && !excludedTypes.has(rule.type)
    );
    for (const p of analyzer.parsers) {
        for (const rule of selectedRules) {
            rule.run(analyzer, p, (issue) => {
                if (callback) {
                    callback(issue);
                }
                issues.push(issue);
            });
        }
    }
    return issues;
}