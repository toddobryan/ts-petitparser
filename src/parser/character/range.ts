import { Parser } from "../../core/parser";
import { CharacterParser } from "../predicate/character";
import { RangeCharPredicate } from "./predicate/range";
import { toCharCode, toReadableString } from "./utils/code";

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
