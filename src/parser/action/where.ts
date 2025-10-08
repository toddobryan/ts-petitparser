import { Context } from "../../core/context.js";
import { Parser } from "../../core/parser.js";
import { Result, Success } from "../../core/result.js";
import { type Predicate } from "../../shared/types.js";
import { DelegateParser } from "../combinator/delegate.js";

export { WhereParser, defaultFactory };
export type { FailureFactory };

type FailureFactory<T> = (context: Context, success: Success<T>) => Result<T>;

class WhereParser<T> extends DelegateParser<T, T> {
    readonly predicate: Predicate<T>;
    readonly factory: FailureFactory<T>;

    constructor(parser: Parser<T>, predicate: Predicate<T>, factory: FailureFactory<T>) {
        super(parser);
        this.predicate = predicate;
        this.factory = factory;
    }

    parseOn(context: Context): Result<T> {
        const result = this.delegate.parseOn(context);
        if (result instanceof Success && !this.predicate(result.value)) {
            return this.factory(context, result);
        }
        return result;
    }

    copy(): Parser<T> {
        return new WhereParser(this.delegate, this.predicate, this.factory);
    }

    override hasEqualProperties(other: WhereParser<T>): boolean {
        return super.hasEqualProperties(other) &&
        this.predicate === other.predicate &&
        this.factory === other.factory;
    }
}

const defaultFactory = <T>(message?: string): FailureFactory<T> => {
    return (context: Context, success: Success<T>): Result<T> => {
        return context.failure(message ?? `unexpected "${success.value}"`);
    }
}
