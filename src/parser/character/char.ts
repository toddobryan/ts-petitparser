import { Parser } from "../../core/parser.js";
import { CharacterParser } from "../predicate/character.js";
import { SingleCharPredicate } from "./predicate/char.js";
import { toCharCode, toReadableString } from "./utils/code.js";
import { optimizedString } from "./utils/optimize.js";

export { char };

const char = (value: string, message?: string, ignoreCase: boolean = false, unicode: boolean = false): Parser<string> => {
    const charCode = toCharCode(value, unicode);
    const predicate = ignoreCase ?
        optimizedString(value, ignoreCase, unicode) :
        new SingleCharPredicate(charCode);
    message ??= `"${toReadableString(value, unicode)}"${ignoreCase ? " (case insensitive)" : ""} expected`;
    return CharacterParser.create(predicate, message, unicode);
}
