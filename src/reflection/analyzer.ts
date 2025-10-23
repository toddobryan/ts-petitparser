/* eslint-disable @typescript-eslint/no-explicit-any */
import { StateError } from "../core/errors";
import type { Parser } from "../core/parser";
import { EpsilonParser } from "../parser/misc/epsilon";
import type { Predicate } from "../shared/types";
import { computeCycleSets } from "./internal/cycle_set";
import { computeFirstSets } from "./internal/first_set";
import { computeFollowSets } from "./internal/follow_set";
import { depthFirstSearch, ParserPath } from "./internal/path";
import { allParser } from "./iterable";

export { Analyzer };

class Analyzer {
    readonly root: Parser<any>;

    constructor(root: Parser<any>) {
        this.root = root;
    }

    _parsers: Set<Parser<any>> | undefined;

    get parsers(): Set<Parser<any>> {
        if (!this._parsers) {
            this._parsers = new Set(allParser(this.root));
        }
        return this._parsers!;
    }

    _allChildren: Map<Parser<any>, Set<Parser<any>>> = new Map();

    allChildren(parser: Parser<any>): Set<Parser<any>> {
        if (!this.parsers.has(parser)) {
            throw new StateError("parser is not part of the analyzer");
        }
        if (!this._allChildren.has(parser)) {
            const parsersChildren: Set<Parser<any>> = new Set();
            for (const child of parser.children) {
                for (const grandChild of allParser(child)) {
                    parsersChildren.add(grandChild);
                }
            }
            this._allChildren.set(parser, parsersChildren); 
        }
        return this._allChildren.get(parser)!;
    }

    findPath(source: Parser<any>, predicate: Predicate<ParserPath>): ParserPath | null {
        let path: ParserPath | null = null;
        for (const current of this.findAllPaths(source, predicate)) {
            if (!path || current.length < path.length) {
                path = current;
            }
        }
        return path;
    }

    findPathTo(source: Parser<any>, target: Parser<any>) {
        if (!this.parsers.has(target)) {
            throw new StateError("target is not part of the analyzer");
        }
        return this.findPath(source, (path) => path.target === target);
    }

    findAllPaths(source: Parser<any>, predicate: Predicate<ParserPath>): Iterable<ParserPath> {
        if (!this.parsers.has(source)) {
            throw new StateError("source is not part of the analyzer");
        }
        return depthFirstSearch(new ParserPath([source], []), predicate);
    }

    findAllPathsTo(source: Parser<any>, target: Parser<any>): Iterable<ParserPath> {
        if (!this.parsers.has(target)) {
            throw new StateError("target is not part of the analyzer");
        }
        return this.findAllPaths(source, (path) => path.target === target);
    }

    isNullable(parser: Parser<any>): boolean {
        return this.firstSet(parser).has(Analyzer.sentinel);
    }

    _firstSets?: Map<Parser<any>, Set<Parser<any>>>

    get firstSets(): Map<Parser<any>, Set<Parser<any>>> {
        if (!this._firstSets) {
            this._firstSets = computeFirstSets(this.parsers, Analyzer.sentinel);
        }
        return this._firstSets;
    }

    firstSet(parser: Parser<any>): Set<Parser<any>> {
        return this.firstSets.get(parser)!;
    }

    _followSets?: Map<Parser<any>, Set<Parser<any>>>

    get followSets(): Map<Parser<any>, Set<Parser<any>>> {
        if (!this._followSets) {
            this._followSets = computeFollowSets(this.root, this.parsers, this.firstSets, Analyzer.sentinel);
        }
        return this._followSets; 
    }

    followSet(parser: Parser<any>): Set<Parser<any>> {
        return this.followSets.get(parser)!;
    }

    _cycleSet?: Map<Parser<any>, Parser<any>[]>

    cycleSet(parser: Parser<any>): Parser<any>[] {
        if (!this._cycleSet) {
            this._cycleSet = computeCycleSets(this.parsers, this.firstSets)
        }
        return this._cycleSet!.get(parser)!;
    }

    static readonly sentinel = new EpsilonParser(null);
}