import { type int } from "../../common";
import { Parser } from "../../core/parser";
import { Context, Failure, Result } from "../../core/context_result_and_errors";
import { DelegateParser } from "../combinator/delegate";

export { PickParser };

class PickParser<T> extends DelegateParser<T[], T> {
    readonly index: int;

    constructor(delegate: Parser<T[]>, index: int) {
        super(delegate);
        this.index = index;
    }

    parseOn(context: Context): Result<T> {
        const result = this.delegate.parseOn(context);
        if (result instanceof Failure) {
            return result;
        } else {
            const value = result.value;
            return result.success(value[this.index < 0 ? value.length + this.index : this.index]!);
        }
    }

    override fastParseOn(buffer: string, position: int): int {
        return this.delegate.fastParseOn(buffer, position);
    }

    copy(): PickParser<T> {
        return new PickParser(this.delegate, this.index);
    }

    override hasEqualProperties(other: PickParser<T>): boolean {
        return super.hasEqualProperties(other) && this.index === other.index;
    }
}