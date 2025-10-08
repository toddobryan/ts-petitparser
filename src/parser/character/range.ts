import { Parser } from "../../core/parser.js";
import { CharacterParser } from "../predicate/character.js";
import { RangeCharPredicate } from "./predicate/range.js";
import { toCharCode, toReadableString } from "./utils/code.js";

export { range };

const range = (start: string, stop: string, message?: string, unicode: boolean = false): Parser<string> => {
    return CharacterParser.create(
        RangeCharPredicate.create(
            toCharCode(start, unicode),
            toCharCode(stop, unicode),
        ),
        message ?? `[${toReadableString(start, unicode)}-${toReadableString(stop, unicode)}] expected`,
        unicode,
    );
}
