/* eslint-disable @typescript-eslint/no-explicit-any */
import { Parser } from "../core/parser.js";

export { allParser };

const allParser = <T>(root: Parser<T>): Iterable<Parser<any>> => new _ParserIterable(root);

class _ParserIterable implements Iterable<Parser<any>> {
    private readonly root: Parser<any>;

    constructor(root: Parser<any>) {
        this.root = root;
    }

    [Symbol.iterator](): Iterator<Parser<any>> {
        return new _ParserIterator(this.root);
    }
}

class _ParserIterator implements Iterator<Parser<any>> {
    todo: Parser<any>[];
    seen: Set<Parser<any>>;

    constructor(root: Parser<any>) {
        this.todo = [root];
        this.seen = new Set();
    }

    next(): IteratorResult<Parser<any>> {
        while (this.todo.length > 0) {
            const parser = this.todo.pop()!;
            if (this.seen.has(parser)) {
                continue;
            }
            this.seen.add(parser);
            // Add children to todo stack if any
            const children: Parser<any>[] = parser.children;
            for (let i = children.length - 1; i >= 0; i--) {
                this.todo.push(children[i]!);
            }
            return { value: parser, done: this.todo.length === 0};
        }
        return { value: undefined, done: true };
    }
}