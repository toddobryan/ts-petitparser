/* eslint-disable @typescript-eslint/no-explicit-any */
import { StateError } from "../core/errors";
import { Parser } from "../core/parser";
import { ResolvableParser } from "../parser/utils/resolvable";

export { resolve };

const resolve = <T>(parser: Parser<T>): Parser<T> => {
    const mapping = new Map<ResolvableParser<any>, Parser<any>>();
    parser = _dereference(parser, mapping);
    const todo: Parser<any>[] = [parser];
    const seen: Set<Parser<any>> = new Set<Parser<any>>([parser]);
    while (todo.length > 0) {
        const parent = todo.pop()!;
        for (let child of parent.children) {
            if (child instanceof ResolvableParser) {
                const referenced = _dereference(child, mapping);
                parent.replace(child, referenced);
                child = referenced;
            }
            if (!seen.has(child)) {
                seen.add(child);
                todo.push(child);
            }
        }
    }
    return parser;
};

const _dereference = <T>(parser: Parser<T>, mapping: Map<Parser<any>, Parser<any>>): Parser<T> => {
    const references = new Set<ResolvableParser<any>>();
    while (parser instanceof ResolvableParser) {
        if (mapping.has(parser)) {
            return mapping.get(parser) as Parser<T>;
        } else if (references.has(parser)) {
            throw new StateError("Recursive references detected");
        } else {
            references.add(parser);
        }
        parser = parser.resolve();
    }
    for (const reference of references) {
        mapping.set(reference, parser);
    }
    return parser;
}