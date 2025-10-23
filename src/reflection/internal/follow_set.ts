/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Parser } from "../../core/parser";
import { RepeatingParser } from "../../parser/repeater/repeating";
import { addAll, isNullable, isSequence } from "./utilities";

export { computeFollowSets };

const computeFollowSets = (
    root: Parser<any>, 
    parsers: Iterable<Parser<any>>, 
    firstSets: Map<Parser<any>, Set<Parser<any>>>,
    sentinel: Parser<any>,
): Map<Parser<any>, Set<Parser<any>>> => {
    const followSets: Map<Parser<any>, Set<Parser<any>>> = new Map();
    for (const parser of parsers) {
        followSets.set(parser, parser === root ? new Set([sentinel]) : new Set())
    }
    let changed = false;
    do {
        changed = false;
        for (const parser of parsers) {
            changed = changed || expandFollowSet(parser, followSets, firstSets);
        }
    } while (changed);
    return followSets;
}

const expandFollowSet = (
    parser: Parser<any>, 
    followSets: Map<Parser<any>, Set<Parser<any>>>, 
    firstSets: Map<Parser<any>, Set<Parser<any>>>
): boolean => {
    if (isSequence(parser)) {
        return expandFollowSetOfSequence(parser, parser.children, followSets, firstSets);
    } else if (parser instanceof RepeatingParser) {
        return expandFollowSetOfSequence(parser, [parser.children[0]!, ...parser.children], followSets, firstSets);
    } else {
        let changed = false;
        for (const child of parser.children) {
            changed = changed || addAll(followSets.get(child)!, followSets.get(parser)!);
        }
        return changed;
    }
}

const expandFollowSetOfSequence = (
    parser: Parser<any>,
    children: Parser<any>[],
    followSets: Map<Parser<any>, Set<Parser<any>>>,
    firstSets: Map<Parser<any>, Set<Parser<any>>>,
): boolean => {
    let changed = false;
    for (let i = 0; i < children.length; i++) {
        if (i == children.length - 1) {
            changed = changed || addAll(followSets.get(children[i]!)!, followSets.get(parser)!);
        } else {
            const firstSet: Set<Parser<any>> = new Set();
            let j = i + 1;
            for (; j < children.length; j++) {
                for (const child of firstSets.get(children[j]!)!) {
                    firstSet.add(child);
                }
                if (![...firstSets.get(children[j]!)!].some(isNullable)) {
                    break;
                }
            }
            if (j == children.length) {
                changed = changed || addAll(followSets.get(children[i]!)!, followSets.get(parser)!);
            }
            changed = changed || addAll(followSets.get(children[i]!)!, [...firstSet].filter((each) => isNullable(each)));
        }
    }
    return changed;
}