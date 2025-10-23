import { Parser } from "../../core/parser";
import { CharacterParser } from "../predicate/character";
import { SingleCharPredicate } from "./predicate/char";
import { toCharCode, toReadableString } from "./utils/code";
import { optimizedString } from "./utils/optimize";

export { char };

const char = (value: string, message?: string, ignoreCase: boolean = false, unicode: boolean = false): Parser<string> => {
    const charCode = toCharCode(value, unicode);
    const predicate = ignoreCase ?
        optimizedString(value, ignoreCase, unicode) :
        new SingleCharPredicate(charCode);
    message ??= `"${toReadableString(value, unicode)}"${ignoreCase ? " (case insensitive)" : ""} expected`;
    return CharacterParser.create(predicate, message, unicode);
}
