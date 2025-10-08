/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Parser } from "../../core/parser.js";
import { OptionalParser } from "../../parser/combinator/optional.js";
import { EpsilonParser } from "../../parser/misc/epsilon.js";
import { PositionParser } from "../../parser/misc/position.js";
import { RepeatingCharacterParser } from "../../parser/repeater/character.js";
import { RepeatingParser } from "../../parser/repeater/repeating.js";

export { isNullable, isTerminal, isSequence, addAll, isParserIterableEqual };

const isNullable = (parser: Parser<any>): boolean => {
    return parser instanceof OptionalParser ||
        parser instanceof EpsilonParser ||
        parser instanceof PositionParser ||
        (parser instanceof RepeatingParser && parser.min == 0) ||
        (parser instanceof RepeatingCharacterParser && parser.min == 0);
}

const isTerminal = (parser: Parser<any>): boolean => {
    return parser.children.length === 0;
}

const isSequence = (parser: Parser<any>): boolean => {
    return parser.isSequential && parser.children.length > 1;
}

const addAll = <T>(result: Set<T>, elements: Iterable<T>): boolean => {
    let changed = false;
    for (const element of elements) {
        const missing = !result.has(element);
        changed = changed || missing;
        if (missing) {
            result.add(element);
        }
    }
    return changed;
}

const isParserIterableEqual = (first: Iterable<Parser<any>>, second: Iterable<Parser<any>>): boolean => {
    const fst: Parser<any>[] = [...first];
    const sec: Parser<any>[] = [...second];
    for (const one of fst) {
        if (!sec.some((two) => one.isEqualTo(two))) {
            return false;
        }
    }
    for (const two of sec) {
        if (!fst.some((one) => two.isEqualTo(one))) {
            return false;
        }
    }
    return true;
}

