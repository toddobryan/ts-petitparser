import { Parser } from "../../core/parser";
import { CharacterParser } from "../predicate/character";
import { NotCharPredicate } from "./predicate/not";
import { toReadableString } from "./utils/code";
import { optimizedString } from "./utils/optimize";

export { noneOf };

const noneOf = (value: string, message?: string, ignoreCase: boolean = false, unicode: boolean = false): Parser<string> => {
    const predicate = new NotCharPredicate(optimizedString(value, ignoreCase, unicode));
    message ??= `none of "${toReadableString(value, unicode)}"${ignoreCase ? " (case insensitive)" : ""} expected`;
    return CharacterParser.create(predicate, message, unicode);
}