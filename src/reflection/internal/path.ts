/* eslint-disable @typescript-eslint/no-explicit-any */
import type { int } from "../../common.js";
import { StateError } from "../../core/errors.js";
import type { Parser } from "../../core/parser.js";
import type { Predicate } from "../../shared/types.js";

export { ParserPath, depthFirstSearch };

class ParserPath {
    readonly parsers: Parser<any>[];
    readonly indexes: int[];

    constructor(parsers: Parser<any>[], indexes: (int | number)[]) {
        if (parsers.length === 0) {
            throw new StateError("parsers cannot be empty");
        }
        if (indexes.length !== parsers.length - 1) {
            throw new StateError("indexes wrong size");
        }
        for (let i: number = 0; i < indexes.length; i++) {
            if (parsers[i]!.children[indexes[i]!] !== parsers[i + 1]) {
                throw new StateError("indexes invalid");
            }
        }
        this.parsers = parsers;
        this.indexes = indexes as int[];
    }

    get source(): Parser<any> {
        return this.parsers[0]!;
    }

    get target(): Parser<any> {
        return this.parsers.at(-1)!;
    }

    get length(): int {
        return this.parsers.length as int;
    }

    push(parser: Parser<any>, index: int): void {
        this.parsers.push(parser);
        this.indexes.push(index);
    }

    pop(): void {
        this.parsers.pop();
        this.indexes.pop();
    }
}

function* depthFirstSearch(path: ParserPath, predicate: Predicate<ParserPath>): Iterable<ParserPath> {
    if (predicate(path)) {
        yield new ParserPath(path.parsers, path.indexes);
    } else {
        const children: Parser<any>[] = path.target.children;
        for (let i = 0; i < children.length; i++) {
            const child = children[i]!;
            if (path.parsers.indexOf(child) < 0) {
                path.push(child, i as int);
                yield* depthFirstSearch(path, predicate);
                path.pop();
            }
        }
    }
}
