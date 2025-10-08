/*import { Parser } from "../../core/parser.js";
import { CharacterParser } from "../predicate/character.js";
import { any } from "./any.js";
import { char } from "./char.js";
import { ConstantCharPredicate } from "./predicate/constant.js";
import { NotCharPredicate } from "./predicate/not.js";
import { RangeCharPredicate } from "./predicate/range.js";
import { toCharCode, toReadableString } from "./utils/code.js";
import { optimizedRanges } from "./utils/optimize.js";

export { pattern };

const pattern = (pattern: string, message?: string, ignoreCase: boolean = false, unicode: boolean = false): Parser<string> => {
    let input = pattern;
    const isNegated = input.startsWith("^");
    if (isNegated) {
        input = input.substring(1);
    }
    const inputs = ignoreCase ? [input.toLowerCase(), input.toUpperCase()] : [input];
    const parser = unicode ? _patternUnicodeParser : _patternParser;
    let predicate = optimizedRanges(inputs.flatMap((each) => parser.parse(each).value), unicode);
    if (isNegated) {
        predicate = predicate instanceof ConstantCharPredicate ?
            new ConstantCharPredicate(!predicate.constant) :
            new NotCharPredicate(predicate);
    }
    message ??= `[${toReadableString(pattern, unicode)}]${ignoreCase ? " (case insensitive)" : ""} expected`;
    return CharacterParser.create(predicate, message, unicode);
}

const _createParser = (unicode: boolean): Parser<RangeCharPredicate[]> => {
    const character = any(undefined, unicode);
    const single = character.map((element) => {
        return RangeCharPredicate.create(
            toCharCode(element, unicode), 
            toCharCode(element, unicode)
        );
    });
    const range = [character, char("-"), character].toSequenceParser().map3(
        (start, _ , stop) => RangeCharPredicate.create(
            toCharCode(start, unicode),
            toCharCode(stop, unicode),
        )
    );

    return [range, single].toChoiceParser().star().end(); 
}

const _patternParser = _createParser(false);
const _patternUnicodeParser = _createParser(true);
*/