/*import { Parser } from "../../core/parser";
import { CharacterParser } from "../predicate/character";
import { any } from "./any";
import { char } from "./char";
import { ConstantCharPredicate } from "./predicate/constant";
import { NotCharPredicate } from "./predicate/not";
import { RangeCharPredicate } from "./predicate/range";
import { toCharCode, toReadableString } from "./utils/code";
import { optimizedRanges } from "./utils/optimize";

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