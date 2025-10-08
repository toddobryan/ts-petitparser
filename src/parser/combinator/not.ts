import type { int } from "../../common.js";
import type { Context } from "../../core/context.js";
import type { Parser } from "../../core/parser.js";
import type { Result } from "../../core/result.js";
import { Failure } from "../../core/result.js";
import { DelegateParser } from "./delegate.js";

export { NotParser };

class NotParser<T> extends DelegateParser<T, Failure> {
    readonly message: string;

    constructor(delegate: Parser<T>, message: string) {
        super(delegate);
        this.message = message;
    }

    override parseOn(context: Context): Result<Failure> {
        const result = this.delegate.parseOn(context);
        if (result instanceof Failure) {
            return context.success(result);
        } else {
            return context.failure(this.message);
        }
    }

    override fastParseOn(buffer: string, position: int | number): int {
        const result = this.delegate.fastParseOn(buffer, position);
        return (result < 0 ? position : -1) as int;
    }

    override copy(): NotParser<T> {
        return new NotParser(this.delegate, this.message);   
    }

    override hasEqualProperties(other: NotParser<T>): boolean {
        return super.hasEqualProperties(other) && this.message === other.message;
    }

    override toString(): string {
        return `${super.toString()}[${this.message}]`;
    }
}