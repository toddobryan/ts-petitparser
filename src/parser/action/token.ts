import { type int } from "../../common";
import { Context } from "../../core/context";
import { Parser } from "../../core/parser";
import { Result, Failure } from "../../core/result";
import { Token } from "../../core/token";
import { DelegateParser } from "../combinator/delegate";

export { TokenParser };

class TokenParser<T> extends DelegateParser<T, Token<T>> {
    constructor(delegate: Parser<T>) {
        super(delegate);
    }

    parseOn(context: Context): Result<Token<T>> {
        const result = this.delegate.parseOn(context);
        if (result instanceof Failure) {
            return result;
        } else {
            const token = new Token<T>(
                result.value,
                context.buffer,
                context.position,
                result.position,
            );
            return result.success(token);
        }
    }

    override fastParseOn(buffer: string, position: int): int {
        return this.delegate.fastParseOn(buffer, position);
    }

    copy(): TokenParser<T> {
        return new TokenParser(this.delegate);
    }
}