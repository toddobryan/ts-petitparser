/* eslint-disable @typescript-eslint/no-explicit-any */
import type { int } from "../../common";
import type { Parser } from "../../core/parser";
import { RepeatingParser } from "./repeating";

export { LimitedRepeatingParser };

abstract class LimitedRepeatingParser<T> extends RepeatingParser<T, T[]> {
    limit: Parser<null>;

    constructor(delegate: Parser<T>, limit: Parser<null>, min: int | number = 0, max: int | number | null) {
        super(delegate, min, max);
        this.limit = limit;
    }

    override get children(): Parser<any>[] {
        return [this.delegate, this.limit];
    }

    override replace(source: Parser<any>, target: Parser<any>): void {
        super.replace(source, target);
        if (this.limit === source) {
            this.limit = target;
        }
    }
}