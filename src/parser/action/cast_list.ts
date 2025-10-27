import { type int } from "../../common";
import { Parser } from "../../core/parser";
import { Context, Result, Failure } from "../../core/context_result_and_errors";
import { DelegateParser } from "../combinator/delegate";

export { CastListParser };

class CastListParser<T, U> extends DelegateParser<T, U[]> {
    constructor(delegate: Parser<T>) {
        super(delegate);
    }

    parseOn(context: Context): Result<U[]> {
        const result = this.delegate.parseOn(context);
        if (result instanceof Failure) {
            return result;
        } else {
            return result.success(result.value as U[]);
        }
    }

    override fastParseOn(buffer: string, position: int): int {
        return this.delegate.fastParseOn(buffer, position);
    }

    copy(): CastListParser<T, U> {
        return new CastListParser<T, U>(this.delegate);
    }
}