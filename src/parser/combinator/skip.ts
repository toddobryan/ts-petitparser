/* eslint-disable @typescript-eslint/no-explicit-any */
import type { int } from "../../common";
import type { Context } from "../../core/context";
import type { Parser } from "../../core/parser";
import { Failure, type Result } from "../../core/result";
import { DelegateParser } from "./delegate";

export { SkipParser };

class SkipParser<T> extends DelegateParser<T, T> {
    before: Parser<void>;
    after: Parser<void>;

    constructor(delegate: Parser<T>, before: Parser<void>, after: Parser<void>) {
        super(delegate);
        this.before = before;
        this.after = after;
    }

    override parseOn(context: Context): Result<T> {
        const beforeContext = this.before.parseOn(context);
        if (beforeContext instanceof Failure) {
            return beforeContext;
        }
        const resultContext = this.delegate.parseOn(beforeContext);
        if (resultContext instanceof Failure) {
            return resultContext;
        }
        const afterContext = this.after.parseOn(resultContext);
        if (afterContext instanceof Failure) {
            return afterContext;
        }
        return afterContext.success(resultContext.value);
    }

    override fastParseOn(buffer: string, position: int | number): int {
        position = this.before.fastParseOn(buffer, position);
        if (position < 0) {
            return -1 as int;
        }
        position = this.delegate.fastParseOn(buffer, position);
        if (position < 0) {
            return -1 as int;
        }
        return this.after.fastParseOn(buffer, position);
    }

    override copy(): SkipParser<T> {
        return new SkipParser(this.delegate, this.before, this.after);
    }

    override get children(): Parser<any>[] {
        return [this.before, this.delegate, this.after];
    }

    override replace(source: Parser<any>, target: Parser<any>): void {
        super.replace(source, target);
        if (this.before === source) {
            this.before = target;
        }
        if (this.after === source) {
            this.after = target;
        }
    }

    override get isSequential(): boolean {
        return true;
    }
}