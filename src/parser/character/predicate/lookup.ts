import { genArray } from "../../../common";
import { StateError } from "../../../core/errors";
import { CharacterPredicate } from "../predicate";
import { RangeCharPredicate } from "./range";

export { LookupCharPredicate, equals };

class LookupCharPredicate extends CharacterPredicate {
    readonly start: number;
    readonly stop: number;
    readonly bits: Uint32Array;

    constructor(start: number, stop: number, bits: Uint32Array) {
        super();
        this.start = start;
        this.stop = stop;
        this.bits = bits;
    }

    static fromRanges(ranges: RangeCharPredicate[]): LookupCharPredicate {
        if (ranges.length < 1) {
            throw new StateError(`fromRanges must be called with non-empty ranges`);
        }
        const start: number = ranges.at(0)!.start;
        const stop: number = ranges.at(-1)!.stop;
        const bits: Uint32Array = new Uint32Array(size(ranges));
        for (const range of ranges) {
            for (let index = range.start - start; index <= range.stop - start; index++) {
                bits[index >> _shift]! |= _mask[index & _offset]!;
            }
        }
        return new LookupCharPredicate(start, stop, bits);
    }

    test(charCode: number): boolean {
        return this.start <= charCode && charCode <= this.stop && this._testBit(charCode - this.start);
    }

    _testBit(value: number): boolean {
        return (this.bits[value >> _shift]! & _mask[value & _offset]!) !== 0;
    }

    isEqualTo(other: CharacterPredicate): boolean {
        return other instanceof LookupCharPredicate &&
            this.start == other.start &&
            this.stop == other.stop &&
            equals(this.bits, other.bits);
    }

    override toString(): string {
        return `${super.toString()}(${this.start}, ${this.stop}, ${this.bits})`;
    }
}

const _shift = 5;
const _offset = 31;
const _mask = genArray(32, (i) => Math.pow(2, i));

const equals = (a: Uint32Array, b: Uint32Array): boolean => {
    if (a.length !== b.length) {
        return false;
    }
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
}

const size = (ranges: RangeCharPredicate[]): number => {
    return (ranges.at(-1)!.stop - ranges.at(0)!.start + _offset + 1) >> _shift;
}
