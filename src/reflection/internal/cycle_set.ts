/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Parser } from "../../core/parser.js"
import { isNullable, isSequence, isTerminal } from "./utilities";

export { computeCycleSets };

const computeCycleSets = (
    parsers: Iterable<Parser<any>>, 
    firstSets: Map<Parser<any>, Set<Parser<any>>>
): Map<Parser<any>, Parser<any>[]> => {
    const cycleSets: Map<Parser<any>, Parser<any>[]> = new Map();
    for (const parser of parsers) {
        computeCycleSet(parser, firstSets, cycleSets);
    }
    return cycleSets;
}

const computeCycleSet = (
    parser: Parser<any>, 
    firstSets: Map<Parser<any>, Set<Parser<any>>>,
    cycleSets: Map<Parser<any>, Parser<any>[]>,
    stack?: Parser<any>[],
): void => {
    if (cycleSets.has(parser)) {
        return;
    }
    if (isTerminal(parser)) {
        cycleSets.set(parser, []);
        return;
    }
    stack ??= [parser];
    const children = computeCycleChildren(parser, firstSets);
    for (const child of children) {
        const index = stack.indexOf(child);
        if (index >= 0) {
            const cycle = stack.slice(index);
            for (const parser of cycle) {
                cycleSets.set(parser, cycle);
            }
            return;
        } else {
            stack.push(child);
            computeCycleSet(parser, firstSets, cycleSets, stack);
            stack.pop();
        }
    }

    if (!cycleSets.has(parser)) {
        cycleSets.set(parser, []);
        return;
    }
}

const computeCycleChildren = (parser: Parser<any>, firstSets: Map<Parser<any>, Set<Parser<any>>>): Parser<any>[] => {
    if (isSequence(parser)) {
        const children: Parser<any>[] = [];
        for (const child of parser.children) {
            children.push(child);
            if (![...firstSets.get(child)!].some(isNullable)) {
                break;
            }
        }
        return children;
    }
    return parser.children;
}