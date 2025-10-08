import type { int } from "../../common.js";
import type { Context } from "../../core/context.js";
import { StateError } from "../../core/errors.js";
import { Parser } from "../../core/parser.js";
import type { Result } from "../../core/result.js";
import type { CharacterPredicate } from "../character/predicate.js";

export { RepeatingCharacterParser };

class RepeatingCharacterParser extends Parser<string> {
    readonly predicate: CharacterPredicate;
    readonly message: string;
    readonly min: int;
    readonly max: int | null;

    constructor(predicate: CharacterPredicate, message: string, min: int | number = 0, max: int | number | null = null) {
        if (min < 0) {
            throw new StateError(`min must be at least 0, but got ${min}`);
        }
        if (max && max < min) {
            throw new StateError(`max must be at least ${min}, but got ${max}`);
        }
        super();
        this.predicate = predicate;
        this.message = message;
        this.min = min as int;
        this.max = max as int;
    }

    override parseOn(context: Context): Result<string> {
        const buffer = context.buffer;
        const start = context.position;
        const end = buffer.length;
        let position = start;
        let count = 0;
        while (this.max && count < this.max && position < end && this.predicate.test(buffer.codePointAt(position)!)) {
            position++;
            count++;
        }
        return count >= this.min ?
            context.success(buffer.substring(start, position), position as int) :
            context.failure(this.message, position as int);
    }

    override fastParseOn(buffer: string, position: int | number): int {
        const end = buffer.length;
        let count = 0;
        while (this.max && count < this.max && position < end && this.predicate.test(buffer.codePointAt(position)!)) {
            position++;
            count++;
        }
        return (count >= this.min ? position : -1) as int;
    }

    override copy(): RepeatingCharacterParser {
        return new RepeatingCharacterParser(this.predicate, this.message, this.min, this.max);
    }

    override hasEqualProperties(other: RepeatingCharacterParser): boolean {
        return super.hasEqualProperties(other) &&
        this.predicate === other.predicate &&
        this.message === other.message &&
        this.min === other.min &&
        this.max === other.max;
    }

    override toString(): string {
        return `${super.toString()}[$message, ${this.min}..${this.max ?? "*"}]`;
    }
}