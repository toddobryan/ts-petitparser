/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Parser } from "../../core/parser";
import { addAll, isNullable, isSequence, isTerminal } from "./utilities";

export { computeFirstSets, expandFirstSet };

const computeFirstSets = (parsers: Iterable<Parser<any>>, sentinel: Parser<any>): Map<Parser<any>, Set<Parser<any>>> => {
    const firstSets: Map<Parser<any>, Set<Parser<any>>> = new Map();
    for (const parser of parsers) {
        const firstSet: Set<Parser<any>> = new Set();
        if (isTerminal(parser)) {
            firstSet.add(parser);
        }
        if (isNullable(parser)) {
            firstSet.add(sentinel);
        }
        firstSets.set(parser, firstSet);
    }

    let changed = false;
    do {
        changed = false;
        for (const parser of parsers) {
            changed = changed || expandFirstSet(parser, firstSets, sentinel);
        }
    } while(changed);
    return firstSets;
}

const expandFirstSet = (parser: Parser<any>, firstSets: Map<Parser<any>, Set<Parser<any>>>, sentinel: Parser<any>): boolean => {
    let changed = false;
    const firstSet: Set<Parser<any>> = firstSets.get(parser)!;
    if (isSequence(parser)) {
        for (const child of parser.children){
            let nullable = false;
            for (const first of firstSets.get(child)!) {
                if (isNullable(first)) {
                    nullable = true;
                } else {
                    const wasMissing = !firstSet.has(first);
                    changed = changed || wasMissing;
                    if (wasMissing) {
                        firstSet.add(first);
                    }
                }
            }
            if (!nullable) {
                return changed;
            }
        }
        const wasMissing = !firstSet.has(sentinel);
        changed = changed || wasMissing;
        if (wasMissing) {
            firstSet.add(sentinel);
        }
    } else {
        for (const child of parser.children) {
            changed = changed || addAll(firstSet, firstSets.get(child)!);
        }
    }
    return changed;
}
