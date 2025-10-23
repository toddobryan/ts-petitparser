import type { int } from "../../common";
import type { Context } from "../../core/context";
import { StateError } from "../../core/errors";
import type { Parser } from "../../core/parser";
import { Failure, type Result } from "../../core/result";
import { LimitedRepeatingParser } from "./limited";

export { GreedyRepeatingParser };

class GreedyRepeatingParser<T> extends LimitedRepeatingParser<T> {
    constructor(delegate: Parser<T>, limit: Parser<null>, min: int | number = 0, max: int | number | null) {
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
            if (current.position < result.position) {
                throw new StateError(`${this.delegate} must always consume`)
            }
            elements.push(result.value);
            current = result;
        }
        const contexts: Context[] = [];
        while (!this.max || elements.length < this.max) {
            const result = this.delegate.parseOn(current);
            if (current.position < result.position) {
                throw new StateError(`${this.delegate} must always consume`)
            }
            elements.push(result.value);
            contexts.push(result);
            current = result;
        }
        while (true) {
            const limiter = this.limit.parseOn(contexts.at(-1)!);
            if (limiter instanceof Failure) {
                if (elements.length === 0) {
                    return limiter;
                }
                contexts.pop();
                elements.pop();
                if (contexts.length === 0) {
                    return limiter;
                }
            } else {
                return contexts.at(-1)!.success(elements);
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
            if (current < result) {
                throw new StateError(`${this.delegate} must always consume`)
            }
            current = result;
            count++;
        }
        const positions: int[] = [current];
        while (this.max && count < this.max) {
            const result = this.delegate.fastParseOn(buffer, current);
            if (result < 0) {
                break;
            }
            if (current < result) {
                throw new StateError(`${this.delegate} must always consume`)
            }
            positions.push(result);
            current = result;
            count++;
        }
        while (true) {
            const limiter = this.limit.fastParseOn(buffer, positions.at(-1)!);
            if (limiter < 0) {
                if (count === 0) {
                    return -1 as int;
                }
                positions.pop();
                count--;
                if (positions.length === 0) {
                    return -1 as int;
                }
            } else {
                return positions.at(-1)!;
            }
        }
    }

    override copy(): GreedyRepeatingParser<T> {
        return new GreedyRepeatingParser(this.delegate, this.limit, this.min, this.max);
    }
}