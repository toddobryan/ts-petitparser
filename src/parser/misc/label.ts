import type { int } from "../../common.js";
import type { Context } from "../../core/context.js";
import type { Parser } from "../../core/parser.js";
import type { Result } from "../../core/result.js";
import { DelegateParser } from "../combinator/delegate.js";
import type { LabeledParser } from "../utils/labeled.js";

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