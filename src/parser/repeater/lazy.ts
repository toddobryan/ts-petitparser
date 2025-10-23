import type { int } from "../../common";
import type { Context } from "../../core/context";
import { StateError } from "../../core/errors";
import type { Parser } from "../../core/parser";
import { Failure, type Result } from "../../core/result";
import { LimitedRepeatingParser } from "./limited";

export { LazyRepeatingParser };

class LazyRepeatingParser<T> extends LimitedRepeatingParser<T> {
    constructor(delegate: Parser<T>, limit: Parser<null>, min: int | number, max: int | number | null) {
        super(delegate, limit, min, max);
    }

    override parseOn(context: Context): Result<T[]> {
        let current = context;
        const elements: T[] = [];
        while (elements.length < this.min) {
            const result = this.delegate.parseOn(current);
            if (result instanceof Failure) {
                return result;
            }
            if (current.position >= result.position) {
                throw new StateError(`${this.delegate} must always consume`);
            }
            elements.push(result.value);
            current = result;
        }
        while (true) {
            const limiter = this.limit.parseOn(current);
            if (limiter instanceof Failure) {
                if (this.max && elements.length >= this.max) {
                    return limiter;
                }
                const result = this.delegate.parseOn(current);
                if (result instanceof Failure) {
                    return limiter;
                }
                if (current.position >= result.position) {
                    throw new StateError(`${this.delegate} must always consume`);
                }
                elements.push(result.value);
                current = result;               
            } else {
                return current.success(elements);
            }
        }
    }

    override fastParseOn(buffer: string, position: int | number): int {
        let count = 0;
        let current = position as int;
        while (count < this.min) {
            const result = this.delegate.fastParseOn(buffer, current);
            if (result < 0) {
                return -1 as int;
            }
            if (current >= result) {
                throw new StateError(`${this.delegate} must always consume`);
            }
            current = result;
            count++;
        }
        while (true) {
            const limiter = this.limit.fastParseOn(buffer, current);
            if (limiter < 0) {
                if (this.max && count >= this.max) {
                    return -1 as int;
                }
                const result = this.delegate.fastParseOn(buffer, current);
                if (result < 0) {
                    return -1 as int;
                }
                if (current >= result) {
                    throw new StateError(`${this.delegate} must always consume`);
                }
                current = result;
                count++;
            } else {
                return current;
            }
        }
    }

    override copy(): LazyRepeatingParser<T> {
        return new LazyRepeatingParser(this.delegate, this.limit, this.min, this.max);
    }
}