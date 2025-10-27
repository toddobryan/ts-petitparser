/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Parser } from "../../core/parser";
import { FlattenParser } from "../../parser/action/flatten";
import { ChoiceParser, toChoiceParser } from "../../parser/combinator/choice";
import { DelegateParser } from "../../parser/combinator/delegate";
import { SettableParser } from "../../parser/combinator/settable";
import { LabelParser } from "../../parser/misc/label";
import { SingleCharacterParser } from "../../parser/predicate/character";
import { RepeatingCharacterParser } from "../../parser/repeater/character";
import { PossessiveRepeatingParser } from "../../parser/repeater/possessive";
import type { Analyzer } from "../analyzer";
import { type OptimizeRule, type ReplaceParser } from "../optimize";

export { CharacterRepeater, FlattenChoice, RemoveDelegate, RemoveDuplicate };

class CharacterRepeater implements OptimizeRule {
    run<T>(analyzer: Analyzer, parser: Parser<T>, replace: ReplaceParser<T>): void {
        if (parser instanceof FlattenParser) {
            const repeating: Parser<any> = parser.delegate;
            if (repeating instanceof PossessiveRepeatingParser) {
                const character = repeating.delegate;
                if (character instanceof SingleCharacterParser) {
                    replace(
                        parser as unknown as  Parser<T>,
                        new RepeatingCharacterParser(
                            character.predicate,
                            character.message,
                            repeating.min,
                            repeating.max,
                        ) as unknown as Parser<T>,
                    );
                }
            }
        }
    }
}

class FlattenChoice implements OptimizeRule {
    run<T>(analyzer: Analyzer, parser: Parser<T>, replace: ReplaceParser<any>): void {
        if (parser instanceof ChoiceParser) {
            const children = parser.children.flatMap((child) => 
                child instanceof ChoiceParser && parser.failureJoiner === child.failureJoiner ?
                    child.children :
                    [child]
            );
            if (parser.children.length < children.length) {
                replace(
                    parser,
                    toChoiceParser(children, parser.failureJoiner),
                );
            }
        }
    }
}

class RemoveDelegate implements OptimizeRule {
    run<T>(analyzer: Analyzer, parser: Parser<T>, replace: ReplaceParser<T>): void {
        const settables: Set<Parser<T>> = new Set();
        while (parser instanceof DelegateParser && 
            (parser instanceof SettableParser || parser instanceof LabelParser)) {
                const missing: boolean = !settables.has(parser);
                settables.add(parser);
                if (!missing) {
                    break;
                }
                parser = parser.delegate;
        }
        for (const settable of settables) {
            replace(settable, parser);
        }
    }
}

class RemoveDuplicate implements OptimizeRule {
    run<T>(analyzer: Analyzer, parser: Parser<T>, replace: ReplaceParser<T>): void {
        const other = [...analyzer.parsers].find((each) => parser.isEqualTo(each)) ?? parser;
        if (parser !== other) {
            replace(parser, other as Parser<T>);
        }
    }
}