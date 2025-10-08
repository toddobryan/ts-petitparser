import type { int } from "../../common.js";
import type { Context } from "../../core/context.js";
import type { Parser } from "../../core/parser.js";
import { Failure, type Result } from "../../core/result.js";
import { DelegateParser } from "./delegate.js";

export { AndParser };

class AndParser<T> extends DelegateParser<T, T> {
    constructor(delegate: Parser<T>) {
        super(delegate);
    }

    override parseOn(context: Context): Result<T> {
        const result = this.delegate.parseOn(context);
        if (result instanceof Failure) {
            return result;
        } else {
            return context.success(result.value);
        }
    }

    override fastParseOn(buffer: string, position: int | number): int {
        const result = this.delegate.fastParseOn(buffer, position);
        return (result < 0 ? -1 : position) as int;
    }

    override copy(): AndParser<T> {
        return new AndParser(this.delegate);
    }
}