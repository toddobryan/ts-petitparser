import type { int } from "../../common";
import type { Parser } from "../../core/parser";
import { Context, Failure, type Result } from "../../core/context_result_and_errors";
import { DelegateParser } from "./delegate";

export { AndParser };

class AndParser<T> extends DelegateParser<T, T> {
    constructor(delegate: Parser<T>) {
        super(delegate);
    }

    parseOn(context: Context): Result<T> {
        const result = this.delegate.parseOn(context);
        if (result instanceof Failure) {
            return result;
        } else {
            return context.success(result.value);
        }
    }

    fastParseOn(buffer: string, position: int | number): int {
        const result = this.delegate.fastParseOn(buffer, position);
        return (result < 0 ? -1 : position) as int;
    }

    copy(): AndParser<T> {
        return new AndParser(this.delegate);
    }
}