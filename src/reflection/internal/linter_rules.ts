/* eslint-disable @typescript-eslint/no-explicit-any */
import type { int } from "../../common";
import type { Parser } from "../../core/parser";
import { CastParser } from "../../parser/action/cast";
import { CastListParser } from "../../parser/action/cast_list";
import { FlattenParser } from "../../parser/action/flatten";
import { MapParser } from "../../parser/action/map";
import { PermuteParser } from "../../parser/action/permute";
import { PickParser } from "../../parser/action/pick";
import { TokenParser } from "../../parser/action/token";
import { WhereParser } from "../../parser/action/where";
import { ChoiceParser } from "../../parser/combinator/choice";
import { SettableParser } from "../../parser/combinator/settable";
import { FailureParser } from "../../parser/misc/failure";
import { NewlineParser } from "../../parser/misc/newline";
import { CharacterParser, SingleCharacterParser } from "../../parser/predicate/character";
import { PredicateParser } from "../../parser/predicate/predicate";
import { RepeatingCharacterParser } from "../../parser/repeater/character";
import { PossessiveRepeatingParser } from "../../parser/repeater/possessive";
import { RepeatingParser } from "../../parser/repeater/repeating";
import { SeparatedRepeatingParser } from "../../parser/repeater/separated";
import { ResolvableParser } from "../../parser/utils/resolvable";
import type { Analyzer } from "../analyzer";
import { LinterIssue, LinterRule, LinterType } from "../linter";
import { formatIterable } from "./formatting";
import { isParserIterableEqual } from "./utilities";

export { 
    CharacterRepeater, LeftRecursion, NestedChoice, NullableRepeater, OverlappingChoice,  
    RepeatedChoice, UnnecessaryFlatten, UnnecessaryResolvable as UnnecessaryResolveable, UnoptimizedFlatten,
    UnreachableChoice, UnresolvedSettable, UnusedResult
};

class CharacterRepeater extends LinterRule {
    constructor() {
        super(LinterType.warning, "Character repeater");
    }

    override run(analyzer: Analyzer, parser: Parser<any>, callback: (issue: LinterIssue) => void): void {
        if (parser instanceof FlattenParser) {
            const repeating: Parser<any> = parser.delegate;
            if (repeating instanceof PossessiveRepeatingParser) {
                const character: Parser<any> = repeating.delegate;
                if (character instanceof SingleCharacterParser) {
                    callback(
                        new LinterIssue(
                            this, 
                            parser,
                            `A flattened repeater ($repeating) that delegates to a character ` +
                            `parser ($character) can be much more efficiently implemented ` +
                            `using starString, plusString, timesString, or ` +
                            `repeatString that directly returns the underlying String ` +
                            `instead of an intermediate List.`
                        )
                    );
                }
            }
        }
    }
}

class LeftRecursion extends LinterRule {
    constructor() {
        super(LinterType.error, "Left recursion");
    }

    override run(analyzer: Analyzer, parser: Parser<any>, callback: (issue: LinterIssue) => void): void {
        if (analyzer.cycleSet(parser).length != 0) {
            callback(
                new LinterIssue(
                    this,
                    parser,
                    `The parser directly or indirectly refers to itself without ` +
                    `consuming input:\n` +
                    `${formatIterable(analyzer.cycleSet(parser), 1 as int)}\n` + 
                    `This causes an infinite loop when parsing.`,
                )
            );
        }
    }
}

class NestedChoice extends LinterRule {
    constructor() {
        super(LinterType.info, "Nested choice");
    }

    override run(analyzer: Analyzer, parser: Parser<any>, callback: (issue: LinterIssue) => void): void {
        if (parser instanceof ChoiceParser) {
            const children = parser.children;
            for (let i = 0; i < children.length - 1; i++) {
                const child: Parser<any> = children[i]!;
                if (child instanceof ChoiceParser) {
                    callback(
                        new LinterIssue(
                            this,
                            parser,
                            `The choice at index $i is another choice ($child) that adds ` +
                            `unnecessary overhead that can be avoided by flattening it into ` +
                            `the parent.`,
                        )
                    );
                }
            }
        }
    }
}

class NullableRepeater extends LinterRule {
    constructor() {
        super(LinterType.error, "Nullable repeater");
    }

    override run(analyzer: Analyzer, parser: Parser<any>, callback: (issue: LinterIssue) => void): void {
        if (parser instanceof RepeatingParser && analyzer.isNullable(parser.delegate)) {
            if (parser instanceof SeparatedRepeatingParser && !analyzer.isNullable(parser.separator)) {
                return;
            } else {
                callback(
                    new LinterIssue(
                        this,
                        parser,
                        `A repeater that delegates to a nullable parser causes an infinite ` +
                        `loop when parsing.`,
                    )
                )
            }
        }
    }
}

class OverlappingChoice extends LinterRule {
    constructor() {
        super(LinterType.info, "Overlapping choice");
    }

    override run(analyzer: Analyzer, parser: Parser<any>, callback: (issue: LinterIssue) => void): void {
        if (parser instanceof ChoiceParser) {
            const children = parser.children;
            for (let i = 0; i < children.length; i++) {
                const firstI = analyzer.firstSet(children[i]!);
                for (let j = i + 1; j < children.length; j++) {
                    const firstJ = analyzer.firstSet(children[j]!);
                    if (isParserIterableEqual(firstI, firstJ)) {
                        callback(
                            new LinterIssue(
                                this,
                                parser,
                                `The choices at index $i and $j have overlapping first-sets, ` +
                                `which can be an indication of an inefficient grammar:\n` +
                                `${formatIterable(firstI)}\n` +
                                `If possible, try extracting common prefixes from choices.`,
                            )
                        )
                    }
                }
            }
        }
    }
}

class RepeatedChoice extends LinterRule {
    constructor() {
        super(LinterType.warning, "Repeated choice");
    }

    override run(analyzer: Analyzer, parser: Parser<any>, callback: (issue: LinterIssue) => void): void {
        if (parser instanceof ChoiceParser) {
            const children = parser.children;
            for (let i = 0; i < children.length; i++) {
                for (let j = i + 1; j < children.length; j++) {
                    if (children[i]!.isEqualTo(children[j]!)) {
                        callback(
                            new LinterIssue(
                                this,
                                parser,
                                `The choices at index $i and $j are identical:\n` +
                                ` $i: ${children[i]}\n` +
                                ` $j: ${children[j]}\n` +
                                `The second choice can never succeed and can therefore be ` +
                                `removed.`,
                            )
                        );
                    }
                }
            }
        }
    }
}

class UnnecessaryFlatten extends LinterRule {
    constructor() {
        super(LinterType.warning, "Unnecessary flatten");
    }

    override run(analyzer: Analyzer, parser: Parser<any>, callback: (issue: LinterIssue) => void): void {
        if (parser instanceof FlattenParser && !parser.message) {
            const delegate = parser.delegate;
            if (delegate instanceof CharacterParser ||
                delegate instanceof FlattenParser ||
                delegate instanceof NewlineParser ||
                delegate instanceof PredicateParser ||
                delegate instanceof RepeatingCharacterParser) {
                    callback(
                        new LinterIssue(
                            this,
                            parser,
                            `A flatten parser delegating to a parser ($delegate) that is ` +
                            `returning the accepted input string adds unnecessary overhead and ` +
                            `can be removed.`,
                        )
                    );
            }
        }
    }
}

class UnnecessaryResolvable extends LinterRule {
    constructor() {
        super(LinterType.warning, "Unnecessary resolvable");
    }

    override run(analyzer: Analyzer, parser: Parser<any>, callback: (issue: LinterIssue) => void): void {
        if (parser instanceof ResolvableParser) {
            callback(
                new LinterIssue(
                    this,
                    parser,
                    "Resolvable parsers are used during construction of recursive " +
                    "grammars. While they typically dispatch to their delegate, " +
                    "they add unnecessary overhead and can be avoided by removing " +
                    "them before parsing using `resolve(parser)`.",
                )
            )
        }
    }
}

class UnoptimizedFlatten extends LinterRule {
    constructor() {
        super(LinterType.info, "Unoptimized flatten");
    }

    override run(analyzer: Analyzer, parser: Parser<any>, callback: (issue: LinterIssue) => void): void {
        if (parser instanceof FlattenParser && !parser.message) {
            callback(
                new LinterIssue(
                    this,
                    parser,
                    "A flatten parser without an error message is unable to switch " +
                    "to the fast parsing mode. This can lead to inefficient parsers " +
                    "and can usually easily fixed by providing an error message " +
                    "that should be used in case the delegate fails to parse.",
                )
            )
        }
    }
}

class UnreachableChoice extends LinterRule {
    constructor() {
        super(LinterType.warning, "Unreachable choice");
    }

    override run(analyzer: Analyzer, parser: Parser<any>, callback: (issue: LinterIssue) => void): void {
        if (parser instanceof ChoiceParser) {
            const children = parser.children;
            for (let i = 0; i < children.length - 1; i++) {
                if (analyzer.isNullable(children[i]!)) {
                    callback(
                        new LinterIssue(
                            this,
                            parser,
                            `The choice at index $i is nullable:\n` +
                            ` ${i}: ${children[i]}\n` +
                            `thus the choices after that can never be reached and can be ` +
                            `removed:\n` +
                            `${formatIterable(children.slice(i + 1), (i + 1) as int)}`,
                        )
                    )
                }
            }
        }
    }
}

class UnresolvedSettable extends LinterRule {
    constructor() {
        super(LinterType.error, "Unresolved settable");
    }

    override run(analyzer: Analyzer, parser: Parser<any>, callback: (issue: LinterIssue) => void): void {
        if (parser instanceof SettableParser && parser.delegate instanceof FailureParser) {
            callback(
                new LinterIssue(
                    this,
                    parser,
                    "This error is typically a bug in the code where a recursive " +
                    "grammar was created with `undefined()` that has not been " +
                    "resolved.",
                )
            )
        }
    }
}

class UnusedResult extends LinterRule {
    constructor() {
        super(LinterType.info, "Unused result");
    }

    override run(analyzer: Analyzer, parser: Parser<any>, callback: (issue: LinterIssue) => void): void {
        if (parser instanceof FlattenParser) {
            const deepChildren = analyzer.allChildren(parser);
            const ignoredResult = new Set(Array.from(deepChildren).filter(isResultProducing));
            if (ignoredResult.size > 0) {
                const path = analyzer.findPath(parser, (path) => ignoredResult.has(path.target))!;
                callback(
                    new LinterIssue(
                        this,
                        parser,
                        `The flatten parser discards the result of its children and ` +
                        `instead returns the consumed input. Yet this flatten parser ` +
                        `(indirectly) refers to one or more other parsers that explicitly ` +
                        `produce a result which is then ignored when called from this ` +
                        `context:\n` +
                        `${formatIterable(path.parsers, 1 as int)}\n` +
                        `This might point to an inefficient grammar or a possible bug.`,
                    )
                )
            }
        }
    }
}

const isResultProducing = (parser: Parser<any>) => {
    return parser instanceof CastParser ||
        parser instanceof CastListParser ||
        parser instanceof FlattenParser ||
        (parser instanceof MapParser && !parser.hasSideEffects) ||
        parser instanceof PermuteParser ||
        parser instanceof PickParser ||
        parser instanceof TokenParser ||
        parser instanceof WhereParser;
}