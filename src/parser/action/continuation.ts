import { type Parser } from "../../core/parser";
import { Context, Result } from "../../core/context_result_and_errors";
import { DelegateParser } from "../combinator/delegate";
import {ContinuationHandler} from "../../common";

export { ContinuationParser };

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
