import { type int } from "../../common";
import { Parser } from "../../core/parser";
import { Context, Failure, Result } from "../../core/context_result_and_errors";
import { DelegateParser } from "../combinator/delegate";

export { FlattenParser };

class FlattenParser extends DelegateParser<void, string> {
    message: string | undefined;

    constructor(delegate: Parser<any>, message?: string) {
        super(delegate);
        this.message = message;
    }

    parseOn(context: Context): Result<string> {
        if (this.message) {
            const position: int = this.delegate.fastParseOn(context.buffer, context.position);
            if (position < 0) {
                return context.failure(this.message);
            } else {
                const output = context.buffer.substring(context.position, position);
                return context.success(output, position);
            }
        } else {
            const result = this.delegate.parseOn(context);
            if (result instanceof Failure) {
                return result;
            } else {
                const output = context.buffer.substring(context.position, result.position);
                return result.success(output);
            }
        }
    }

    override fastParseOn(buffer: string, position: int): int {
        return this.delegate.fastParseOn(buffer, position);
    }

    hasEqualPropties(other: FlattenParser): boolean {
        return super.hasEqualProperties(other) && this.message === other.message;
    }

    copy(): FlattenParser {
        return new FlattenParser(this.delegate, this.message);
    }
}