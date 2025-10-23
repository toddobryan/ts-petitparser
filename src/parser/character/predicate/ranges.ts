import { CharacterPredicate } from "../predicate";
import { equals } from "./lookup";
import { RangeCharPredicate } from "./range";

export { RangesCharPredicate };

class RangesCharPredicate extends CharacterPredicate {
    readonly ranges: Uint32Array;

    constructor(ranges: Uint32Array) {
        super();
        this.ranges = ranges;
    }

    static fromRanges(ranges: RangeCharPredicate[]): RangesCharPredicate {
        const newRanges = new Uint32Array(size(ranges));
        for (let i = 0; i < ranges.length; i += 2) {
            newRanges[i] = ranges[i]!.start;
            newRanges[i + 1] = ranges[i]!.stop;
        }
        return new RangesCharPredicate(newRanges);
    }

    test(charCode: number): boolean {
        let min = 0;
        let max = this.ranges.length - 2;
        while (min <= max) {
            const midDiv = (min + ((max - min) >> 1));
            const mid = midDiv - (midDiv % 2);
            if (this.ranges[mid]! <= charCode && charCode <= this.ranges[mid + 1]!) {
                return true;
            } else if (charCode < this.ranges[mid]!) {
                max = mid - 2;
            } else {
                min = mid + 2;
            }
        }
        return false;
    }

    isEqualTo(other: CharacterPredicate): boolean {
        return other instanceof RangesCharPredicate && equals(this.ranges, other.ranges);
    }

    override toString(): string {
        return `${super.toString()}(${this.ranges})`;
    }
}

const size = (ranges: RangeCharPredicate[]): number => {
    return 2 * ranges.length;
}