import { type int } from "../../common.js";
import { Context } from "../../core/context.js";
import { Parser } from "../../core/parser.js";
import { Result, Failure } from "../../core/result.js";
import { DelegateParser } from "../combinator/delegate.js";

export { CastParser };

class CastParser<T, U> extends DelegateParser<T, U> {
    constructor(delegate: Parser<T>) {
        super(delegate);
    }

    parseOn(context: Context): Result<U> {
        const result = this.delegate.parseOn(context);
        if (result instanceof Failure) {
            return result;
        } else {
            return result.success(result.value as unknown as U);
        }
    }

    override fastParseOn(buffer: string, position: int): int {
        return this.delegate.fastParseOn(buffer, position);
    }

    copy(): CastParser<T, U> {
        return new CastParser<T, U>(this.delegate);
    }
}