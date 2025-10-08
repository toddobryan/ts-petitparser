import type { int } from "../../common.js";
import type { Context } from "../../core/context.js";
import type { Parser } from "../../core/parser.js";
import type { Result } from "../../core/result.js";
import type { ResolvableParser } from "../utils/resolvable.js";
import { DelegateParser } from "./delegate.js";

export { SettableParser };

class SettableParser<T> extends DelegateParser<T, T> implements ResolvableParser<T> {
    constructor(delegate: Parser<T>) {
        super(delegate);
    }

    set(parser: Parser<T>): void {
        this.replace(this.children[0]!, parser);
    }

    resolve(): Parser<T> {
        return this.delegate;
    }

    override parseOn(context: Context): Result<T> {
        return this.delegate.parseOn(context);
    }

    override fastParseOn(buffer: string, position: int | number): int {
        return this.delegate.fastParseOn(buffer, position);
    }

    override copy(): SettableParser<T> {
        return new SettableParser(this.delegate);
    }
}