import type { int } from "../../common";
import type { Context } from "../../core/context";
import { StateError } from "../../core/errors";
import type { Parser } from "../../core/parser";
import { Failure, type Result } from "../../core/result";
import { RepeatingParser } from "./repeating";

export { PossessiveRepeatingParser };

class PossessiveRepeatingParser<T> extends RepeatingParser<T, T[]> {
    constructor(delegate: Parser<T>, min: int | number, max: int | number | null) {
        super(delegate, min, max);
    }

    override parseOn(context: Context): Result<T[]> {
        const elements: T[] = [];
        let current = context;
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
        while (this.max && elements.length < this.max) {
            const result = this.delegate.parseOn(current);
            if (result instanceof Failure) {
                break;
            }
            if (current.position >= result.position) {
                throw new StateError(`${this.delegate} must always consume`);
            }
            elements.push(result.value);
            current = result;
        }
        return current.success(elements);
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
        while (this.max && count < this.max) {
            const result = this.delegate.fastParseOn(buffer, current);
            if (result < 0) {
                break;
            }
            if (current >= result) {
                throw new StateError(`${this.delegate} must always consume`);
            }
            current = result;
            count++;
        }
        return current;
    }

    override copy(): PossessiveRepeatingParser<T> {
        return new PossessiveRepeatingParser(this.delegate, this.min, this.max);
    }
}