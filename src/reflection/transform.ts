/* eslint-disable @typescript-eslint/no-explicit-any */
import { Parser } from "../core/parser.js";
import { allParser } from "./iterable.js";

export { transformParser };

/**
 * A function transforming one parser to another one.
 */
type TransformationHandler = <T>(parser: Parser<T>) => Parser<T>;

/**
 * Transforms all parsers reachable from [parser] with the given [handler].
 * The identity function returns a copy of the the incoming parser.
 * 
 * The implementation first creates a copy of each parser reachable in the
 * input grammar; then the resulting grammar is traversed until all references
 * to old parsers are replaced with the transformed ones.
 */
const transformParser = <T>(parser: Parser<T>, handler: TransformationHandler): Parser<T> => {
    const mapping = new Map<Parser<any>, Parser<any>>();
    for (const p of allParser(parser)) {
        mapping.set(p, p.copy().captureResultGeneric<any>(handler));
    }
    const todo: Parser<any>[] = [...mapping.values()];
    const seen: Set<Parser<any>> = new Set<Parser<any>>([...mapping.values()]);
    while (todo.length > 0) {
        const parent = todo.pop()!;
        for (const child of parent.children) {
            if (mapping.has(child)) {
                parent.replace(child, mapping.get(child)!);
            } else if (!seen.has(child)) {
                seen.add(child);
                todo.push(child);
            }
        }
    }
    return mapping.get(parser)! as Parser<T>;
}
