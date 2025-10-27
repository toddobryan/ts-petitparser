import type { int } from "../../common";
import type { Parser } from "../../core/parser";
import { Context, Failure, type Result } from "../../core/context_result_and_errors";
import { DelegateParser } from "./delegate";

export { OptionalParser };

class OptionalParser<T> extends DelegateParser<T, T> {
    readonly otherwise: T

    constructor(delegate: Parser<T>, otherwise: T) {
        super(delegate);
        this.otherwise = otherwise;
    }

    override parseOn(context: Context): Result<T> {
        const result = this.delegate.parseOn(context);
        if (! (result instanceof Failure)) {
            return result;
        } else {
            return context.success(this.otherwise);
        }
    }

    override fastParseOn(buffer: string, position: int | number): int {
        const result = this.delegate.fastParseOn(buffer, position);
        return result < 0 ? position as int : result;
    }

    override copy(): OptionalParser<T> {
        return new OptionalParser(this.delegate, this.otherwise);

    }

    override hasEqualProperties(other: OptionalParser<T>): boolean {
        return super.hasEqualProperties(other) && this.otherwise === other.otherwise;
    }
}