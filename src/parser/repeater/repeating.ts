import type { int } from "../../common";
import { StateError } from "../../core/context_result_and_errors";
import type { Parser } from "../../core/parser";
import { DelegateParser } from "../combinator/delegate";

export { RepeatingParser };

abstract class RepeatingParser<T, U> extends DelegateParser<T, U> {
    readonly min: int;
    readonly max: int | null;

    constructor(delegate: Parser<T>, min: int | number = 0, max: int | number | null = null) {
        if (min < 0) {
            throw new StateError(`min must be at least 0, but got ${min}`);
        }
        if (max && max < min) {
            throw new StateError(`max must be at least ${min}, but got ${max}`);
        }
        super(delegate);
        this.min = min as int;
        this.max = max ? max as int : null;
    }

    override hasEqualProperties(other: RepeatingParser<T, U>): boolean {
        return super.hasEqualProperties(other) &&
            this.min === other.min &&
            this.max === other.max;
    }
}