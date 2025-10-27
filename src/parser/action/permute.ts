import { genArray, type int } from "../../common";
import { Parser } from "../../core/parser";
import { Context, Failure, Result } from "../../core/context_result_and_errors";
import { DelegateParser } from "../combinator/delegate";

export { PermuteParser };

class PermuteParser<T> extends DelegateParser<T[], T[]> {
    readonly indexes: int[];

    constructor(delegate: Parser<T[]>, indexes: int[]) {
        super(delegate);
        this.indexes = indexes;
    }

    parseOn(context: Context): Result<T[]> {
        const result = this.delegate.parseOn(context);
        if (result instanceof Failure) {
            return result;
        } else {
            const value: T[] = result.value;
            const values: T[] = genArray(this.indexes.length, (i) => {
                const index = this.indexes[i]!;
                return value[index < 0 ? value.length + index : index]!;
            })!;
            return result.success(values);

        }
    }

    override fastParseOn(buffer: string, position: int): int {
        return this.delegate.fastParseOn(buffer, position);
    }

    copy(): PermuteParser<T> {
        return new PermuteParser<T>(this.delegate, this.indexes);
    }

    override hasEqualProperties(other: PermuteParser<T>): boolean {
        return super.hasEqualProperties(other) && this.indexes == other.indexes;
    }
}