import { Parser } from "../../core/parser.js";
import { CharacterParser } from "../predicate/character.js";
import { NotCharPredicate } from "./predicate/not.js";
import { toReadableString } from "./utils/code.js";
import { optimizedString } from "./utils/optimize.js";

export { noneOf };

const noneOf = (value: string, message?: string, ignoreCase: boolean = false, unicode: boolean = false): Parser<string> => {
    const predicate = new NotCharPredicate(optimizedString(value, ignoreCase, unicode));
    message ??= `none of "${toReadableString(value, unicode)}"${ignoreCase ? " (case insensitive)" : ""} expected`;
    return CharacterParser.create(predicate, message, unicode);
}