import { Context } from "../../core/context.js";
import { Parser } from "../../core/parser.js";
import { Result } from "../../core/result.js";
import { DelegateParser } from "../combinator/delegate.js";

export { type ContinuationFunction, type ContinuationHandler, ContinuationParser };

type ContinuationHandler<T, U> = (continuation: ContinuationFunction<T>, context: Context) => Result<U>;

type ContinuationFunction<T> = (context: Context) => Result<T>;

class ContinuationParser<T, U> extends DelegateParser<T, U> {
    readonly handler: ContinuationHandler<T, U>;

    constructor(delegate: Parser<T>, handler: ContinuationHandler<T, U>) {
        super(delegate);
        this.handler = handler;
    }

    override parseOn(context: Context): Result<U> {
        return this.handler(this.delegate.parseOn, context);
    }

    override copy(): ContinuationParser<T, U> {
        return new ContinuationParser(this.delegate, this.handler);
    }

    override hasEqualProperties(other: ContinuationParser<T, U>): boolean {
        return super.hasEqualProperties(other) && this.handler === other.handler;
    }
}
