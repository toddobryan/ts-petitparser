import type { int } from "../../common";
import type { Parser } from "../../core/parser";
import type { Context, Result } from "../../core/context_result_and_errors";
import { DelegateParser } from "../combinator/delegate";
import type { LabeledParser } from "../utils/labeled";

export { LabelParser };

class LabelParser<T> extends DelegateParser<T, T> implements LabeledParser<T> {
    readonly label: string;

    constructor(delegate: Parser<T>, label: string) {
        super(delegate);
        this.label = label;
    }

    override parseOn(context: Context): Result<T> {
        return this.delegate.parseOn(context);
    }

    override fastParseOn(buffer: string, position: int | number): int {
        return this.delegate.fastParseOn(buffer, position);
    }

    override copy(): LabelParser<T> {
        return new LabelParser(this.delegate, this.label);
    }

    override hasEqualProperties(other: LabelParser<T>): boolean {
        return super.hasEqualProperties(other) && this.label === other.label;
    }

    override toString(): string {
        return `${super.toString()}[${this.label}]`;
    }
}