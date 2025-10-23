import { StateError } from "../../../core/errors";
import { CharacterPredicate } from "../predicate";

export { RangeCharPredicate };

class RangeCharPredicate extends CharacterPredicate {
    readonly start: number;
    readonly stop: number;

    private constructor(start: number, stop: number) {
        super();
        this.start = start;
        this.stop = stop;
    }

    static create(start: number, stop: number): RangeCharPredicate {
        if (!(Number.isInteger(start) && Number.isInteger(stop) && start <= stop)) {
            throw new StateError(`Invalid range character range: ${start}-${stop}`)
        }
        return new RangeCharPredicate(start, stop);
    }

    test(charCode: number): boolean {
        return this.start <= charCode && charCode <= this.stop;
    }

    isEqualTo(other: CharacterPredicate): boolean {
        return other instanceof RangeCharPredicate && this.start === other.start && this.stop === other.stop;
    }

    override toString(): string {
        return `${super.toString()}(${this.start}, ${this.stop})`;
    }
}