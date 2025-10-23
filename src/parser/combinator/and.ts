import type { int } from "../../common";
import type { Context } from "../../core/context";
import type { Parser } from "../../core/parser";
import { Failure, type Result } from "../../core/result";
import { DelegateParser } from "./delegate";

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