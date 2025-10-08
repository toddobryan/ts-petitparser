import { Parser } from "../../core/parser.js";
import { CharacterParser } from "../predicate/character.js";
import { toReadableString } from "./utils/code.js";
import { optimizedString } from "./utils/optimize.js";

export { anyOf }

const anyOf = (value: string, message?: string, ignoreCase: boolean = false, unicode: boolean = false): Parser<string> => {
    const predicate = optimizedString(value, ignoreCase, unicode);
    message ??= `any of ${toReadableString(value, unicode)}${ignoreCase ? " (case insensitive)" : ""} expected`;
    return CharacterParser.create(predicate, message, unicode);
}