import { type int } from "../../common";
import { Context } from "../../core/context";
import { Parser } from "../../core/parser";
import { Result, Failure } from "../../core/result";
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