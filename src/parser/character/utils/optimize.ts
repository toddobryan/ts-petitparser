import { genArray } from "../../../common";
import { CharacterPredicate } from "../predicate";
import { SingleCharPredicate } from "../predicate/char";
import { ConstantCharPredicate } from "../predicate/constant";
import { LookupCharPredicate } from "../predicate/lookup";
import { RangeCharPredicate } from "../predicate/range";
import { codePoints } from "./code";

export { optimizedRanges, optimizedString };

const optimizedString = (s: string, unicode: boolean, ignoreCase: boolean = false): CharacterPredicate => {
    if (ignoreCase) {
        s = `${s.toLowerCase()}${s.toUpperCase()}`;
    }
    return optimizedRanges(
        codePoints(s, unicode).map((value: number) => {
            return RangeCharPredicate.create(value, value);
        }),
        unicode,
    );
}

const optimizedRanges = (ranges: RangeCharPredicate[], unicode: boolean): CharacterPredicate => {
    const sortedRanges: RangeCharPredicate[] = genArray<RangeCharPredicate>(ranges.length, (i) => ranges[i]!);
    sortedRanges.sort((a: RangeCharPredicate, b: RangeCharPredicate) => a.start != b.start ? a.start - b.start : a.stop - b. stop);
    const mergedRanges: RangeCharPredicate[] = [];
    for (const thisRange of sortedRanges) {
        if (mergedRanges.length == 0) {
            mergedRanges.push(thisRange);
        } else {
            const lastRange = mergedRanges.at(-1)!;
            if (lastRange.stop + 1 >= thisRange.start) {
                const characterRange = RangeCharPredicate.create(lastRange.start, thisRange.stop);
                mergedRanges[mergedRanges.length - 1] = characterRange
            } else {
                mergedRanges.push(thisRange)
            }
        }
    }

    const matchingCount = mergedRanges.reduce<number>((current,range) => current + (range.stop - range.start + 1), 0);
    if (matchingCount === 0) {
        return ConstantCharPredicate.none;
    } else if ((unicode && matchingCount - 1 === 0x10FFFF) || (!unicode && matchingCount - 1 === 0xFFFF)) {
        return ConstantCharPredicate.any;
    } else if (mergedRanges.length === 1) {
        return mergedRanges[0]!.start === mergedRanges[0]!.stop ?
            new SingleCharPredicate(mergedRanges[0]!.start) :
            mergedRanges[0]!;
    } else {
        return LookupCharPredicate.fromRanges(mergedRanges);
    }
}

